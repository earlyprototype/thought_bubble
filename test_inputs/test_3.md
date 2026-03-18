Building a REST API with Node.js and Express - Complete Guide

Introduction:
This guide walks you through building a production-ready REST API from scratch. We'll build a task management API with authentication, database persistence, validation, error handling, and testing. By the end, you'll understand API design principles and have a deployable application.

Step 1: Set Up Your Project
Create a new directory and initialize npm. Install Express (web framework), PostgreSQL client (pg), bcrypt (password hashing), and jsonwebtoken (authentication). Your package.json should include express@4.18, pg@8.11, bcrypt@5.1, and jsonwebtoken@9.0.

Step 2: Design Your Data Model
A task has an ID, title, description, status (todo/in-progress/done), created_at timestamp, and user_id (foreign key). A user has an ID, email (unique), password_hash, and created_at timestamp. This is a one-to-many relationship: one user owns many tasks.

Step 3: Create Database Schema
Write a migration script that creates two tables. The users table has id (serial primary key), email (varchar unique not null), password_hash (varchar not null), and created_at (timestamp default now). The tasks table has id (serial primary key), title (varchar not null), description (text), status (varchar default 'todo'), user_id (integer references users), and created_at (timestamp default now).

Step 4: Implement Authentication
Create a POST /auth/register endpoint that accepts email and password. Hash the password with bcrypt (10 rounds), insert the user record, and return a JWT containing the user ID. Create a POST /auth/login endpoint that looks up the user by email, compares the password hash, and returns a JWT if valid. Tokens should expire after 24 hours.

Step 5: Add Authentication Middleware
Write middleware that extracts the JWT from the Authorization header, verifies it, and attaches the decoded user ID to the request object. All task endpoints should use this middleware to ensure only authenticated users can access their tasks.

Step 6: Implement CRUD Endpoints
- GET /tasks: Return all tasks for the authenticated user
- POST /tasks: Create a new task with title and description
- GET /tasks/:id: Return a single task (verify ownership)
- PATCH /tasks/:id: Update title, description, or status (verify ownership)
- DELETE /tasks/:id: Delete a task (verify ownership)

All endpoints should validate input (title required, status must be todo/in-progress/done), return appropriate status codes (200, 201, 400, 401, 404, 500), and include error messages in a consistent format.

Step 7: Error Handling
Wrap all async routes in a try-catch block. Database errors should return 500. Validation errors should return 400 with specific field errors. Authentication failures should return 401. Authorization failures (wrong user) should return 403. Missing resources should return 404.

Step 8: Write Tests
Use Jest and Supertest. Write integration tests that:
- Register a user and receive a token
- Login with correct credentials succeeds, wrong credentials fails
- Create a task requires authentication
- Users can only see their own tasks
- Update and delete verify task ownership

Aim for 80%+ code coverage on routes and middleware.

Step 9: Deploy to Production
Set up a PostgreSQL database (suggest Railway or Render). Add environment variables for DATABASE_URL and JWT_SECRET. Use a process manager like PM2. Enable CORS for your frontend domain. Add rate limiting (express-rate-limit) to prevent abuse. Log errors to a service like Sentry.

Common Mistakes to Avoid:
- Storing passwords in plain text (always hash)
- Not validating input (leads to injection attacks)
- Returning 200 for errors (use proper status codes)
- Not verifying task ownership (security vulnerability)
- Committing secrets to git (use .env files)

Next Steps:
Add pagination for large task lists, implement task filtering and sorting, add task categories or tags, implement task sharing between users, add webhooks for task status changes.
```

---