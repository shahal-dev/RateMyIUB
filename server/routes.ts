import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { clerkClient, verifyToken } from '@clerk/backend';
import type { Request, Response } from 'express';

// Extend Request type to include auth
interface AuthRequest extends Request {
  auth?: {
    userId: string;
    sessionId: string;
  };
}

// Auth middleware
const requireAuth = async (req: AuthRequest, res: Response, next: Function) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    });

    req.auth = {
      userId: decoded.sub,
      sessionId: decoded.sid || '',
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post('/api/auth/sync-user', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const clerkUserId = req.auth!.userId;
      const clerkUser = await clerkClient.users.getUser(clerkUserId);
      
      // Check if user exists
      let user = await storage.getUserByClerkId(clerkUserId);
      
      if (!user) {
        // Create new user
        user = await storage.createUser({
          clerkId: clerkUserId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          displayName: clerkUser.firstName && clerkUser.lastName ? 
            `${clerkUser.firstName} ${clerkUser.lastName}` : 
            `IUB-Student-${Math.random().toString(36).substring(2, 8)}`,
          avatarUrl: clerkUser.imageUrl,
          role: 'student',
          isVerified: clerkUser.emailAddresses[0]?.verification?.status === 'verified',
        });
      }
      
      res.json({ user });
    } catch (error) {
      console.error('Error syncing user:', error);
      res.status(500).json({ error: 'Failed to sync user' });
    }
  });

  // Departments
  app.get('/api/departments', async (req: Request, res: Response) => {
    try {
      const departments = await storage.getDepartments();
      res.json(departments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch departments' });
    }
  });

  // Courses
  app.get('/api/courses', async (req: Request, res: Response) => {
    try {
      const { departmentId, query } = req.query;
      const courses = await storage.getCourses({
        departmentId: departmentId as string,
        query: query as string,
      });
      res.json(courses);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch courses' });
    }
  });

  app.get('/api/courses/:id', async (req: Request, res: Response) => {
    try {
      const course = await storage.getCourse(req.params.id);
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
      
      const stats = await storage.getCourseStats(req.params.id);
      res.json({ ...course, ...stats });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch course' });
    }
  });

  // Professors
  app.get('/api/professors', async (req: Request, res: Response) => {
    try {
      const { departmentId, query } = req.query;
      const professors = await storage.getProfessors({
        departmentId: departmentId as string,
        query: query as string,
      });
      res.json(professors);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch professors' });
    }
  });

  app.get('/api/professors/:id', async (req: Request, res: Response) => {
    try {
      const professor = await storage.getProfessor(req.params.id);
      if (!professor) {
        return res.status(404).json({ error: 'Professor not found' });
      }
      
      const stats = await storage.getProfessorStats(req.params.id);
      res.json({ ...professor, ...stats });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch professor' });
    }
  });

  // Reviews
  app.get('/api/reviews', async (req: Request, res: Response) => {
    try {
      const { professorId, courseId, semester, year, limit = '20', offset = '0' } = req.query;
      const reviews = await storage.getReviews({
        professorId: professorId as string,
        courseId: courseId as string,
        semester: semester as string,
        year: year ? parseInt(year as string) : undefined,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      });
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  });

  app.post('/api/reviews', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.auth!.userId;
      const user = await storage.getUserByClerkId(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const review = await storage.createReview({
        ...req.body,
        userId: user.id,
        status: 'published',
        createdAt: new Date(),
        updatedAt: new Date(),
        editedUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      });
      
      res.status(201).json(review);
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ error: 'Failed to create review' });
    }
  });

  app.post('/api/reviews/:id/vote', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.auth!.userId;
      const user = await storage.getUserByClerkId(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const vote = await storage.voteReview({
        reviewId: req.params.id,
        userId: user.id,
        vote: req.body.vote,
      });
      
      res.json(vote);
    } catch (error) {
      res.status(500).json({ error: 'Failed to vote on review' });
    }
  });

  // Initialize seed data
  app.post('/api/seed', async (req: Request, res: Response) => {
    try {
      // Create departments
      const cse = await storage.createDepartment({
        code: 'CSE',
        nameEn: 'Computer Science & Engineering',
        nameBn: 'কম্পিউটার সায়েন্স ও ইঞ্জিনিয়ারিং',
      });

      const eee = await storage.createDepartment({
        code: 'EEE',
        nameEn: 'Electrical & Electronic Engineering',
        nameBn: 'ইলেকট্রিক্যাল ও ইলেকট্রনিক ইঞ্জিনিয়ারিং',
      });

      const bba = await storage.createDepartment({
        code: 'BBA',
        nameEn: 'Business Administration',
        nameBn: 'ব্যবসায় প্রশাসন',
      });

      // Create courses
      await storage.createCourse({
        departmentId: cse.id,
        code: 'CSE101',
        titleEn: 'Programming Fundamentals',
        titleBn: 'প্রোগ্রামিং মৌলিক বিষয়',
        credits: 3,
      });

      await storage.createCourse({
        departmentId: cse.id,
        code: 'CSE203',
        titleEn: 'Data Structures',
        titleBn: 'ডেটা স্ট্রাকচার',
        credits: 3,
      });

      await storage.createCourse({
        departmentId: bba.id,
        code: 'BBA201',
        titleEn: 'Financial Management',
        titleBn: 'আর্থিক ব্যবস্থাপনা',
        credits: 3,
      });

      // Create professors
      await storage.createProfessor({
        fullName: 'Dr. Sarah Rahman',
        slug: 'dr-sarah-rahman',
        departments: [cse.id],
        bio: 'Professor of Computer Science with expertise in Software Engineering and Data Structures.',
      });

      await storage.createProfessor({
        fullName: 'Prof. Ahmed Hassan',
        slug: 'prof-ahmed-hassan',
        departments: [bba.id],
        bio: 'Professor of Business Administration specializing in Financial Management and Strategic Planning.',
      });

      await storage.createProfessor({
        fullName: 'Dr. Fatima Khan',
        slug: 'dr-fatima-khan',
        departments: [eee.id],
        bio: 'Associate Professor of Electrical Engineering with research focus on Machine Learning and Signal Processing.',
      });

      res.json({ message: 'Seed data created successfully' });
    } catch (error) {
      console.error('Error seeding data:', error);
      res.status(500).json({ error: 'Failed to seed data' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
