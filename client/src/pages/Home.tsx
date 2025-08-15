import { Search, TrendingUp, Star, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DepartmentGrid from "@/components/DepartmentGrid";
import RatingDisplay from "@/components/RatingDisplay";

const trendingProfessors = [
  {
    id: 1,
    name: "Dr. Sarah Rahman",
    department: "Computer Science",
    course: "CSE101 - Programming Fundamentals", 
    rating: 4.8,
    reviews: 156,
    wouldTakeAgain: 0.94,
    tags: ["Clear Explanation", "Engaging", "Fair Grading"]
  },
  {
    id: 2,
    name: "Prof. Ahmed Hassan",
    department: "Business Administration",
    course: "BBA201 - Financial Management",
    rating: 4.6,
    reviews: 89,
    wouldTakeAgain: 0.87,
    tags: ["Real-world Examples", "Helpful", "Organized"]
  },
  {
    id: 3,
    name: "Dr. Fatima Khan",
    department: "Environmental Science",
    course: "ENV301 - Climate Change",
    rating: 4.7,
    reviews: 67,
    wouldTakeAgain: 0.91,
    tags: ["Research Oriented", "Passionate", "Interactive"]
  }
];

const Home = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 gradient-hero opacity-5"></div>
        <div className="relative container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Find Your Perfect
              <span className="gradient-hero bg-clip-text text-transparent"> Professor</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover honest, anonymous reviews from IUB students. Make informed decisions about your courses and professors.
            </p>
            
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="Search professors, courses, or departments..." 
                    className="pl-12 py-6 text-lg"
                  />
                </div>
                <Button size="lg" className="px-8 py-6 shadow-glow">
                  Search
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary">Dr. Sarah Rahman</Badge>
              <Badge variant="secondary">CSE101</Badge>
              <Badge variant="secondary">Business</Badge>
              <Badge variant="secondary">Computer Science</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">250+</div>
              <div className="text-sm text-muted-foreground">Professors</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">800+</div>
              <div className="text-sm text-muted-foreground">Courses</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">5.2K+</div>
              <div className="text-sm text-muted-foreground">Reviews</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">8</div>
              <div className="text-sm text-muted-foreground">Departments</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trending Professors */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            Trending This Week
          </h2>
          <p className="text-muted-foreground">Most reviewed and highly rated professors</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingProfessors.map((prof) => (
            <Card key={prof.id} className="group hover:shadow-elevated transition-smooth cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{prof.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{prof.department}</p>
                    <p className="text-sm text-primary font-medium">{prof.course}</p>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    {prof.rating}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <RatingDisplay 
                  overall={prof.rating}
                  totalReviews={prof.reviews}
                  wouldTakeAgain={prof.wouldTakeAgain}
                  size="sm"
                />
                
                <div className="flex flex-wrap gap-1">
                  {prof.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-smooth"
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Departments Grid */}
      <section className="container mx-auto px-4">
        <DepartmentGrid />
      </section>

      {/* Call to Action */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <Award className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-foreground mb-4">Join the IUB Community</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Help fellow students make informed decisions. Share your experience and read honest reviews.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="shadow-glow">
              Write a Review
            </Button>
            <Button variant="outline" size="lg">
              Browse Professors
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;