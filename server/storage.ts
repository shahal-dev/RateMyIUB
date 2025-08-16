import { eq, and, desc, asc, sql, count } from 'drizzle-orm';
import {
  users,
  departments,
  courses,
  professors,
  offerings,
  reviews,
  reviewVotes,
  reports,
  type User,
  type InsertUser,
  type Department,
  type InsertDepartment,
  type Course,
  type InsertCourse,
  type Professor,
  type InsertProfessor,
  type Review,
  type InsertReview,
  type ReviewVote,
  type InsertReviewVote,
} from '@shared/schema';
import { db } from './db';

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByClerkId(clerkId: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;

  // Departments
  getDepartments(): Promise<Department[]>;
  getDepartment(id: string): Promise<Department | undefined>;
  createDepartment(department: InsertDepartment): Promise<Department>;

  // Courses
  getCourses(filters?: { departmentId?: string; query?: string }): Promise<Course[]>;
  getCourse(id: string): Promise<Course | undefined>;
  getCourseByCode(code: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;

  // Professors
  getProfessors(filters?: { departmentId?: string; query?: string }): Promise<Professor[]>;
  getProfessor(id: string): Promise<Professor | undefined>;
  getProfessorBySlug(slug: string): Promise<Professor | undefined>;
  createProfessor(professor: InsertProfessor): Promise<Professor>;
  updateProfessor(id: string, updates: Partial<InsertProfessor>): Promise<Professor | undefined>;

  // Reviews
  getReviews(filters?: {
    professorId?: string;
    courseId?: string;
    semester?: string;
    year?: number;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<Review[]>;
  getReview(id: string): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: string, updates: Partial<InsertReview>): Promise<Review | undefined>;

  // Review votes
  voteReview(vote: InsertReviewVote): Promise<ReviewVote>;
  getReviewVote(reviewId: string, userId: string): Promise<ReviewVote | undefined>;

  // Stats
  getProfessorStats(professorId: string): Promise<{
    totalReviews: number;
    averageRating: number;
    wouldTakeAgainPercent: number;
    recommendPercent: number;
  }>;

  getCourseStats(courseId: string): Promise<{
    totalReviews: number;
    averageRating: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByClerkId(clerkId: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user as any).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(users).set({
      ...updates,
      updatedAt: new Date()
    } as any).where(eq(users.id, id)).returning();
    return result[0];
  }

  // Departments
  async getDepartments(): Promise<Department[]> {
    return await db.select().from(departments).orderBy(asc(departments.nameEn));
  }

  async getDepartment(id: string): Promise<Department | undefined> {
    const result = await db.select().from(departments).where(eq(departments.id, id)).limit(1);
    return result[0];
  }

  async createDepartment(department: InsertDepartment): Promise<Department> {
    const result = await db.insert(departments).values(department).returning();
    return result[0];
  }

  // Courses
  async getCourses(filters?: { departmentId?: string; query?: string }): Promise<Course[]> {
    let baseQuery = db.select().from(courses);
    const conditions = [];
    
    if (filters?.departmentId) {
      conditions.push(eq(courses.departmentId, filters.departmentId));
    }
    
    if (filters?.query) {
      const searchPattern = `%${filters.query}%`;
      conditions.push(
        sql`${courses.code} ILIKE ${searchPattern} OR ${courses.titleEn} ILIKE ${searchPattern}`
      );
    }
    
    if (conditions.length > 0) {
      baseQuery = baseQuery.where(and(...conditions)) as any;
    }
    
    return await baseQuery.orderBy(asc(courses.code));
  }

  async getCourse(id: string): Promise<Course | undefined> {
    const result = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
    return result[0];
  }

  async getCourseByCode(code: string): Promise<Course | undefined> {
    const result = await db.select().from(courses).where(eq(courses.code, code)).limit(1);
    return result[0];
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const result = await db.insert(courses).values(course).returning();
    return result[0];
  }

  // Professors
  async getProfessors(filters?: { departmentId?: string; query?: string }): Promise<Professor[]> {
    let baseQuery = db.select().from(professors);
    const conditions = [];
    
    if (filters?.departmentId) {
      // Filter by department ID in the JSONB array
      conditions.push(sql`${professors.departments} @> ${JSON.stringify([filters.departmentId])}`);
    }
    
    if (filters?.query) {
      const searchPattern = `%${filters.query}%`;
      conditions.push(
        sql`${professors.fullName} ILIKE ${searchPattern}`
      );
    }
    
    if (conditions.length > 0) {
      baseQuery = baseQuery.where(and(...conditions)) as any;
    }
    
    return await baseQuery.orderBy(asc(professors.fullName));
  }

  async getProfessor(id: string): Promise<Professor | undefined> {
    const result = await db.select().from(professors).where(eq(professors.id, id)).limit(1);
    return result[0];
  }

  async getProfessorBySlug(slug: string): Promise<Professor | undefined> {
    const result = await db.select().from(professors).where(eq(professors.slug, slug)).limit(1);
    return result[0];
  }

  async createProfessor(professor: InsertProfessor): Promise<Professor> {
    const result = await db.insert(professors).values(professor).returning();
    return result[0];
  }

  async updateProfessor(id: string, updates: Partial<InsertProfessor>): Promise<Professor | undefined> {
    const result = await db.update(professors).set(updates as any).where(eq(professors.id, id)).returning();
    return result[0];
  }

  // Reviews
  async getReviews(filters?: {
    professorId?: string;
    courseId?: string;
    semester?: string;
    year?: number;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<Review[]> {
    let baseQuery = db.select().from(reviews);
    const conditions = [];
    
    if (filters?.professorId) {
      conditions.push(eq(reviews.professorId, filters.professorId));
    }
    
    if (filters?.courseId) {
      conditions.push(eq(reviews.courseId, filters.courseId));
    }
    
    if (filters?.semester) {
      conditions.push(eq(reviews.semester, filters.semester));
    }
    
    if (filters?.year) {
      conditions.push(eq(reviews.year, filters.year));
    }
    
    if (filters?.status) {
      conditions.push(eq(reviews.status, filters.status as any));
    } else {
      // Default to published reviews only
      conditions.push(eq(reviews.status, 'published'));
    }
    
    if (conditions.length > 0) {
      baseQuery = baseQuery.where(and(...conditions)) as any;
    }
    
    baseQuery = baseQuery.orderBy(desc(reviews.createdAt)) as any;
    
    if (filters?.limit) {
      baseQuery = baseQuery.limit(filters.limit) as any;
    }
    
    if (filters?.offset) {
      baseQuery = baseQuery.offset(filters.offset) as any;
    }
    
    return await baseQuery;
  }

  async getReview(id: string): Promise<Review | undefined> {
    const result = await db.select().from(reviews).where(eq(reviews.id, id)).limit(1);
    return result[0];
  }

  async createReview(review: InsertReview): Promise<Review> {
    const result = await db.insert(reviews).values(review as any).returning();
    return result[0];
  }

  async updateReview(id: string, updates: Partial<InsertReview>): Promise<Review | undefined> {
    const result = await db.update(reviews).set({
      ...updates,
      updatedAt: new Date()
    } as any).where(eq(reviews.id, id)).returning();
    return result[0];
  }

  // Review votes
  async voteReview(vote: InsertReviewVote): Promise<ReviewVote> {
    // Upsert the vote
    const result = await db.insert(reviewVotes)
      .values(vote as any)
      .onConflictDoUpdate({
        target: [reviewVotes.userId, reviewVotes.reviewId],
        set: { vote: vote.vote } as any
      })
      .returning();
    return result[0];
  }

  async getReviewVote(reviewId: string, userId: string): Promise<ReviewVote | undefined> {
    const result = await db.select().from(reviewVotes)
      .where(and(eq(reviewVotes.reviewId, reviewId), eq(reviewVotes.userId, userId)))
      .limit(1);
    return result[0];
  }

  // Stats
  async getProfessorStats(professorId: string): Promise<{
    totalReviews: number;
    averageRating: number;
    wouldTakeAgainPercent: number;
    recommendPercent: number;
  }> {
    const stats = await db.select({
      totalReviews: count(),
      averageRating: sql<number>`AVG(${reviews.overall})`,
      wouldTakeAgainPercent: sql<number>`AVG(CASE WHEN ${reviews.wouldTakeAgain} THEN 1.0 ELSE 0.0 END) * 100`,
      recommendPercent: sql<number>`AVG(CASE WHEN ${reviews.recommend} THEN 1.0 ELSE 0.0 END) * 100`,
    })
    .from(reviews)
    .where(and(
      eq(reviews.professorId, professorId),
      eq(reviews.status, 'published')
    ));
    
    return {
      totalReviews: stats[0]?.totalReviews || 0,
      averageRating: Number(stats[0]?.averageRating) || 0,
      wouldTakeAgainPercent: Number(stats[0]?.wouldTakeAgainPercent) || 0,
      recommendPercent: Number(stats[0]?.recommendPercent) || 0,
    };
  }

  async getCourseStats(courseId: string): Promise<{
    totalReviews: number;
    averageRating: number;
  }> {
    const stats = await db.select({
      totalReviews: count(),
      averageRating: sql<number>`AVG(${reviews.overall})`,
    })
    .from(reviews)
    .where(and(
      eq(reviews.courseId, courseId),
      eq(reviews.status, 'published')
    ));
    
    return {
      totalReviews: stats[0]?.totalReviews || 0,
      averageRating: Number(stats[0]?.averageRating) || 0,
    };
  }
}

export const storage = new DatabaseStorage();
