import puppeteer from 'puppeteer';
import axios from 'axios';
import * as cheerio from 'cheerio';

export interface FacultyMember {
  name: string;
  title?: string;
  department?: string;
  school?: string;
  email?: string;
  phone?: string;
  office?: string;
  bio?: string;
  imageUrl?: string;
  profileUrl?: string;
}

class FacultyScraperService {
  private baseUrl = 'https://iub.ac.bd';
  
  /**
   * Scrape faculty data using Puppeteer for dynamic content
   */
  async scrapeFacultyWithPuppeteer(): Promise<FacultyMember[]> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const page = await browser.newPage();
      
      // Set user agent to avoid blocking
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      console.log('Navigating to IUB faculty page...');
      await page.goto('https://iub.ac.bd/faculties', { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      // Wait for faculty data to load
      await page.waitForTimeout(5000);
      
      // Try to find and click load more buttons or handle pagination
      try {
        const loadMoreButton = await page.$('button[aria-label="Load more"], .load-more, .pagination button');
        if (loadMoreButton) {
          await loadMoreButton.click();
          await page.waitForTimeout(3000);
        }
      } catch (e) {
        console.log('No load more button found, continuing...');
      }
      
      // Extract faculty data
      const facultyData = await page.evaluate(() => {
        const faculty: FacultyMember[] = [];
        
        // Try multiple selectors for faculty cards/items
        const facultySelectors = [
          '.faculty-card',
          '.faculty-member',
          '.faculty-item',
          '.member-card',
          '.profile-card',
          '.faculty',
          '[data-faculty]',
          '.card',
          '.person-card'
        ];
        
        let facultyElements: NodeListOf<Element> | null = null;
        
        for (const selector of facultySelectors) {
          facultyElements = document.querySelectorAll(selector);
          if (facultyElements.length > 0) {
            console.log(`Found ${facultyElements.length} faculty with selector: ${selector}`);
            break;
          }
        }
        
        // If no specific faculty elements found, try to extract from any structure
        if (!facultyElements || facultyElements.length === 0) {
          // Look for patterns that might indicate faculty listings
          facultyElements = document.querySelectorAll('.row .col, .grid-item, .list-item, .item');
        }
        
        facultyElements?.forEach((element) => {
          try {
            const nameElement = element.querySelector('h1, h2, h3, h4, h5, .name, .faculty-name, .title, strong');
            const name = nameElement?.textContent?.trim();
            
            if (name && name.length > 2) {
              const member: FacultyMember = {
                name: name,
                title: element.querySelector('.title, .position, .designation, .rank')?.textContent?.trim(),
                department: element.querySelector('.department, .dept, .unit')?.textContent?.trim(),
                school: element.querySelector('.school, .faculty-school, .college')?.textContent?.trim(),
                email: element.querySelector('.email, [href^="mailto:"]')?.textContent?.trim() || 
                       element.querySelector('[href^="mailto:"]')?.getAttribute('href')?.replace('mailto:', ''),
                phone: element.querySelector('.phone, .tel, .contact')?.textContent?.trim(),
                office: element.querySelector('.office, .room, .location')?.textContent?.trim(),
                bio: element.querySelector('.bio, .description, .about, p')?.textContent?.trim(),
                imageUrl: element.querySelector('img')?.getAttribute('src'),
                profileUrl: element.querySelector('a[href]')?.getAttribute('href')
              };
              
              // Clean up the data
              if (member.imageUrl && !member.imageUrl.startsWith('http')) {
                member.imageUrl = 'https://iub.ac.bd' + member.imageUrl;
              }
              
              if (member.profileUrl && !member.profileUrl.startsWith('http')) {
                member.profileUrl = 'https://iub.ac.bd' + member.profileUrl;
              }
              
              faculty.push(member);
            }
          } catch (error) {
            console.error('Error extracting faculty member data:', error);
          }
        });
        
        return faculty;
      });
      
      console.log(`Extracted ${facultyData.length} faculty members`);
      return facultyData;
      
    } finally {
      await browser.close();
    }
  }
  
  /**
   * Fallback scraping using axios and cheerio
   */
  async scrapeFacultyWithAxios(): Promise<FacultyMember[]> {
    try {
      console.log('Fetching faculty page with axios...');
      const response = await axios.get('https://iub.ac.bd/faculties', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        timeout: 30000
      });
      
      const $ = cheerio.load(response.data);
      const faculty: FacultyMember[] = [];
      
      // Try multiple selectors for faculty data
      const possibleSelectors = [
        '.faculty-card',
        '.faculty-member', 
        '.member-card',
        '.profile-card',
        '.faculty',
        '.card',
        '.person-card',
        '.row .col',
        '.grid-item'
      ];
      
      for (const selector of possibleSelectors) {
        const elements = $(selector);
        if (elements.length > 0) {
          console.log(`Found ${elements.length} elements with selector: ${selector}`);
          
          elements.each((index, element) => {
            const $el = $(element);
            const nameElement = $el.find('h1, h2, h3, h4, h5, .name, .faculty-name, .title, strong').first();
            const name = nameElement.text().trim();
            
            if (name && name.length > 2) {
              const member: FacultyMember = {
                name: name,
                title: $el.find('.title, .position, .designation, .rank').first().text().trim(),
                department: $el.find('.department, .dept, .unit').first().text().trim(),
                school: $el.find('.school, .faculty-school, .college').first().text().trim(),
                email: $el.find('.email, [href^="mailto:"]').first().text().trim() || 
                       $el.find('[href^="mailto:"]').first().attr('href')?.replace('mailto:', ''),
                phone: $el.find('.phone, .tel, .contact').first().text().trim(),
                office: $el.find('.office, .room, .location').first().text().trim(),
                bio: $el.find('.bio, .description, .about, p').first().text().trim(),
                imageUrl: $el.find('img').first().attr('src'),
                profileUrl: $el.find('a[href]').first().attr('href')
              };
              
              // Clean up URLs
              if (member.imageUrl && !member.imageUrl.startsWith('http')) {
                member.imageUrl = 'https://iub.ac.bd' + member.imageUrl;
              }
              
              if (member.profileUrl && !member.profileUrl.startsWith('http')) {
                member.profileUrl = 'https://iub.ac.bd' + member.profileUrl;
              }
              
              faculty.push(member);
            }
          });
          
          if (faculty.length > 0) break;
        }
      }
      
      console.log(`Extracted ${faculty.length} faculty members with axios`);
      return faculty;
      
    } catch (error) {
      console.error('Error scraping with axios:', error);
      return [];
    }
  }
  
  /**
   * Try to get faculty data from IUB API if available
   */
  async tryFacultyAPI(): Promise<FacultyMember[]> {
    try {
      // Try common API endpoints
      const apiEndpoints = [
        'https://iub.ac.bd/api/faculties',
        'https://iub.ac.bd/api/faculty',
        'https://iub.ac.bd/wp-json/wp/v2/faculty',
        'https://iub.ac.bd/wp-json/custom/v1/faculty'
      ];
      
      for (const endpoint of apiEndpoints) {
        try {
          console.log(`Trying API endpoint: ${endpoint}`);
          const response = await axios.get(endpoint, { timeout: 10000 });
          
          if (response.data && Array.isArray(response.data)) {
            console.log(`Found ${response.data.length} faculty from API`);
            return this.normalizeApiData(response.data);
          }
        } catch (e) {
          // Continue to next endpoint
          continue;
        }
      }
      
      return [];
    } catch (error) {
      console.error('Error trying API endpoints:', error);
      return [];
    }
  }
  
  /**
   * Normalize API data to our FacultyMember interface
   */
  private normalizeApiData(data: any[]): FacultyMember[] {
    return data.map(item => ({
      name: item.name || item.title || item.display_name || '',
      title: item.title || item.position || item.designation || item.rank,
      department: item.department || item.dept || item.unit,
      school: item.school || item.faculty || item.college,
      email: item.email || item.contact_email,
      phone: item.phone || item.contact_phone || item.telephone,
      office: item.office || item.room || item.location,
      bio: item.bio || item.description || item.about || item.content,
      imageUrl: item.image || item.photo || item.picture || item.avatar,
      profileUrl: item.url || item.link || item.profile_url
    })).filter(member => member.name && member.name.length > 2);
  }
  
  /**
   * Main method to scrape faculty data - tries multiple methods
   */
  async scrapeFaculty(): Promise<FacultyMember[]> {
    console.log('Starting faculty data scraping...');
    
    // Try API first
    let faculty = await this.tryFacultyAPI();
    if (faculty.length > 0) {
      console.log(`Successfully fetched ${faculty.length} faculty from API`);
      return faculty;
    }
    
    // Try Puppeteer scraping
    try {
      faculty = await this.scrapeFacultyWithPuppeteer();
      if (faculty.length > 0) {
        console.log(`Successfully scraped ${faculty.length} faculty with Puppeteer`);
        return faculty;
      }
    } catch (error) {
      console.error('Puppeteer scraping failed:', error);
    }
    
    // Fallback to axios scraping
    faculty = await this.scrapeFacultyWithAxios();
    if (faculty.length > 0) {
      console.log(`Successfully scraped ${faculty.length} faculty with Axios`);
      return faculty;
    }
    
    console.log('No faculty data could be scraped');
    return [];
  }
}

export const facultyScraperService = new FacultyScraperService();

