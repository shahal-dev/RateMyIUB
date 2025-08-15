# RateMyIUB - Professor & Course Rating Platform

## Overview

RateMyIUB is a modern web application designed for Independent University Bangladesh (IUB) students to rate professors and courses. The platform provides structured feedback collection, data visualization through charts and analytics, and comprehensive filtering capabilities by department, course, semester, and tags. Built as a secure, scalable solution with university email verification, the application serves both students for feedback submission and faculty for profile management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application uses a modern React-based frontend built with TypeScript and Vite for fast development and optimized builds. The UI is constructed using shadcn/ui components with Tailwind CSS for styling, providing a consistent and accessible design system. Client-side routing is handled by React Router, supporting multiple page types including professor profiles, course pages, department views, search results, and review submission forms.

### Backend Architecture
The backend is built on Node.js with Express.js, providing RESTful APIs for all data operations. The server architecture includes:
- Express.js server with TypeScript for type safety
- Middleware for request logging and error handling
- Route registration system for API endpoints
- Storage abstraction layer for database operations

### Data Storage Solutions
The application uses PostgreSQL as the primary database, configured with Drizzle ORM for type-safe database operations and schema management. The database schema includes:
- Users table integrated with Clerk authentication
- Departments, courses, and professors with relational data
- Reviews system with voting and reporting capabilities
- Offerings table to track course-professor relationships across semesters

### Authentication and Authorization
Authentication is handled through Clerk, providing secure user management with university email verification (@iub.edu.bd domain). The system supports multiple user roles (student, faculty, admin) with different permission levels. User data is synchronized between Clerk and the local database for extended profile information.

### Database Schema Design
The schema follows a normalized relational design with the following key entities:
- Users with Clerk integration and role-based access
- Departments with multi-language support (English/Bengali)
- Courses linked to departments with credit information
- Professors with department associations and slug-based URLs
- Reviews with structured ratings and comment system
- Review votes for community moderation
- Reports system for content moderation

### UI Component System
The frontend uses a comprehensive component library based on Radix UI primitives with shadcn/ui styling. Components are organized into reusable UI elements (buttons, cards, forms) and application-specific components (rating displays, department grids, headers). The design system supports responsive layouts and accessibility standards.

### Development and Build Pipeline
The project uses Vite for development with hot module replacement and optimized production builds. TypeScript configuration covers both client and server code with strict type checking. The build process includes client-side bundling and server-side compilation with esbuild for production deployment.

## External Dependencies

### Database and ORM
- **PostgreSQL** - Primary database with Neon serverless option
- **Drizzle ORM** - Type-safe database operations with schema migrations
- **@neondatabase/serverless** - Serverless PostgreSQL connection handling

### Authentication Service
- **Clerk** - Complete authentication solution with university email verification
- **@clerk/backend** and **@clerk/clerk-react** - Server and client-side authentication

### UI and Styling Framework
- **Tailwind CSS** - Utility-first CSS framework with custom design tokens
- **Radix UI** - Comprehensive primitive components for accessibility
- **shadcn/ui** - Pre-built component system with consistent styling
- **Lucide React** - Icon library for UI elements

### Development Tools
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing for single-page application
- **TanStack Query** - Server state management and caching
- **React Hook Form** - Form handling with validation
- **TypeScript** - Static type checking across the entire codebase

### Data Visualization
- **Chart.js** - Planned for professor rating visualizations and analytics
- Custom components for rating displays and statistical charts

### Form Handling and Validation
- **React Hook Form** - Form state management
- **@hookform/resolvers** - Form validation integration
- **Zod** - Schema validation with Drizzle integration

The architecture prioritizes type safety, performance, and maintainability while providing a solid foundation for scaling the professor and course rating functionality.