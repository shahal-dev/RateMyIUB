import { pgTable, text, serial, integer, boolean, uuid, timestamp, real, jsonb, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - integrates with Clerk
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().$type<'student' | 'faculty' | 'admin'>().default('student'),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  isVerified: boolean("is_verified").default(false),
  universityIdHash: text("university_id_hash"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
});

// Departments
export const departments = pgTable("departments", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  nameEn: text("name_en").notNull(),
  nameBn: text("name_bn"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Courses
export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  departmentId: uuid("department_id").references(() => departments.id),
  code: text("code").notNull(),
  titleEn: text("title_en").notNull(),
  titleBn: text("title_bn"),
  credits: integer("credits"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    codeIdx: uniqueIndex("courses_code_idx").on(table.code),
  };
});

// Professors
export const professors = pgTable("professors", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: text("full_name").notNull(),
  slug: text("slug").notNull().unique(),
  departments: jsonb("departments").$type<string[]>(),
  bio: text("bio"),
  claimedByUserId: uuid("claimed_by_user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Course offerings (sections)
export const offerings = pgTable("offerings", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id").references(() => courses.id),
  professorId: uuid("professor_id").references(() => professors.id),
  semester: text("semester").$type<'Spring' | 'Summer' | 'Autumn' | 'Fall' | 'Winter'>(),
  year: integer("year"),
  section: text("section"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reviews
export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  professorId: uuid("professor_id").references(() => professors.id),
  courseId: uuid("course_id").references(() => courses.id),
  offeringId: uuid("offering_id").references(() => offerings.id),
  semester: text("semester"),
  year: integer("year"),
  section: text("section"),
  overall: integer("overall").$type<1 | 2 | 3 | 4 | 5>(),
  clarity: integer("clarity").$type<1 | 2 | 3 | 4 | 5>(),
  engagement: integer("engagement").$type<1 | 2 | 3 | 4 | 5>(),
  fairness: integer("fairness").$type<1 | 2 | 3 | 4 | 5>(),
  grading: integer("grading").$type<1 | 2 | 3 | 4 | 5>(),
  workload: integer("workload").$type<1 | 2 | 3 | 4 | 5>(),
  difficulty: integer("difficulty").$type<1 | 2 | 3 | 4 | 5>(),
  wouldTakeAgain: boolean("would_take_again"),
  recommend: boolean("recommend"),
  delivery: text("delivery").$type<'in_person' | 'online' | 'hybrid'>(),
  attendanceMandatory: boolean("attendance_mandatory"),
  gradeReceived: text("grade_received").$type<'A' | 'B' | 'C' | 'D' | 'F' | 'W' | 'NA'>(),
  hoursPerWeek: integer("hours_per_week"),
  tags: jsonb("tags").$type<string[]>(),
  comment: text("comment"),
  sentiment: real("sentiment"),
  toxicityScore: real("toxicity_score"),
  status: text("status").$type<'published' | 'pending' | 'rejected' | 'removed'>().default('published'),
  helpfulCount: integer("helpful_count").default(0),
  notHelpfulCount: integer("not_helpful_count").default(0),
  reportsCount: integer("reports_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  editedUntil: timestamp("edited_until"),
}, (table) => {
  return {
    uniqueReview: uniqueIndex("unique_review_idx").on(
      table.userId,
      table.professorId,
      table.courseId,
      table.semester,
      table.year,
      table.section
    ),
  };
});

// Review votes
export const reviewVotes = pgTable("review_votes", {
  id: uuid("id").primaryKey().defaultRandom(),
  reviewId: uuid("review_id").references(() => reviews.id),
  userId: uuid("user_id").references(() => users.id),
  vote: text("vote").$type<'helpful' | 'not_helpful'>(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    uniqueVote: uniqueIndex("unique_vote_idx").on(table.userId, table.reviewId),
  };
});

// Reports
export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  reviewId: uuid("review_id").references(() => reviews.id),
  reporterUserId: uuid("reporter_user_id").references(() => users.id),
  reason: text("reason").$type<'harassment' | 'privacy' | 'spam' | 'inaccurate' | 'other'>(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Auth logs
export const authLogs = pgTable("auth_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  action: text("action"),
  meta: jsonb("meta"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Moderation logs
export const moderationLogs = pgTable("moderation_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorUserId: uuid("actor_user_id").references(() => users.id),
  action: text("action"),
  meta: jsonb("meta"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema types
export const insertUserSchema = createInsertSchema(users);
export const insertDepartmentSchema = createInsertSchema(departments);
export const insertCourseSchema = createInsertSchema(courses);
export const insertProfessorSchema = createInsertSchema(professors);
export const insertOfferingSchema = createInsertSchema(offerings);
export const insertReviewSchema = createInsertSchema(reviews);
export const insertReviewVoteSchema = createInsertSchema(reviewVotes);
export const insertReportSchema = createInsertSchema(reports);

// Inferred types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Department = typeof departments.$inferSelect;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Professor = typeof professors.$inferSelect;
export type InsertProfessor = z.infer<typeof insertProfessorSchema>;
export type Offering = typeof offerings.$inferSelect;
export type InsertOffering = z.infer<typeof insertOfferingSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type ReviewVote = typeof reviewVotes.$inferSelect;
export type InsertReviewVote = z.infer<typeof insertReviewVoteSchema>;
export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;

// Controlled tags
export const CONTROLLED_TAGS = [
  "Tough Exams",
  "Lenient Grader",
  "Heavy Projects",
  "Light Workload",
  "Interactive",
  "Attendance Strict",
  "Slides Heavy",
  "Research Oriented",
  "Practical Labs",
  "Group Work",
  "Theory Focused",
  "Curve Grading",
  "Pop Quizzes",
  "Recorded Lectures",
  "Clear Explanation",
  "Engaging",
  "Fair Grading",
  "Helpful",
  "Organized"
] as const;

export type ControlledTag = typeof CONTROLLED_TAGS[number];
