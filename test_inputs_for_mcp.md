# Test Input Documents for thought_bubble MCP Tool

These are raw text documents you can feed to the `analyze_content` tool to test the visualization pipeline with any LLM.

---

## Test 1: Technical Architecture Document

```
Microservices Migration Strategy for E-commerce Platform

Background:
Our current monolithic e-commerce platform processes 50,000 orders per day across three markets (UK, DE, FR). The system was built in 2019 as a Rails monolith with PostgreSQL and Redis. As we scale to 15 markets by 2027, we need to decompose the monolith into services that can be independently deployed and scaled.

Current Architecture:
The monolith contains six major modules: authentication, product catalogue, inventory management, order processing, payment integration, and notifications. All modules share a single database schema with 180 tables. Deployment requires a full application restart, limiting us to weekly releases.

Proposed Architecture:
We will extract services in three phases over 18 months:

Phase 1 (Months 1-6): Extract authentication service
- Separate user identity into dedicated PostgreSQL instance
- Implement JWT-based auth with 15-minute token expiry
- Migrate 2.4M user records
- Deploy behind feature flag with gradual rollout

Phase 2 (Months 7-12): Extract inventory and order services
- Implement event-driven communication via RabbitMQ
- Split order and inventory databases
- Introduce saga pattern for distributed transactions
- Estimated 40% reduction in order processing latency

Phase 3 (Months 13-18): Extract payment and notification services
- Isolate PCI-compliant payment processing
- Implement async notification queue
- Complete migration to service mesh (Istio)

Technical Risks:
1. Data consistency: Moving from ACID to eventual consistency requires application-level compensation logic
2. Observability: Distributed tracing must be implemented before service extraction begins
3. Team readiness: Only 3 of 12 engineers have production microservices experience
4. Cost: Infrastructure costs estimated to increase 35% in first year before optimization

Success Metrics:
- Deployment frequency: from weekly to daily
- MTTR: from 4 hours to 30 minutes
- P95 latency: maintain current 280ms or improve
- Zero customer-facing incidents during migration

Migration will be considered complete when all six services are deployed independently and the monolith codebase is archived.
```

---

## Test 2: Business Strategy Document

```
Q4 2025 Board Report - Acme SaaS Growth Trajectory

Executive Summary:
Acme ended 2025 with $4.2M ARR (annual recurring revenue), up 180% YoY. This report details our Q4 performance, customer acquisition efficiency, and 2026 growth plan.

Revenue Performance:
Q4 revenue hit $1.15M, representing 37% sequential growth from Q3. This acceleration was driven by three enterprise deals ($150K+ ACV each) and strong expansion revenue from the mid-market segment. Monthly recurring revenue (MRR) reached $385K by December 31st.

Customer Metrics:
- Total customers: 247 (up from 142 in Q3)
- Enterprise customers (>$100K ACV): 8 (up from 3)
- Net revenue retention: 135%
- Gross churn: 2.1% (down from 3.8% in Q3)
- Average contract value: $17,000

Customer Acquisition:
We spent $420K on sales and marketing in Q4, acquiring 105 new customers at a blended CAC of $4,000. Enterprise CAC is $38,000 but these customers have 3.2x higher LTV. Our CAC payback period improved to 11 months from 14 months in Q3.

Product Development:
Engineering shipped 47 features in Q4, including the long-awaited API v2 and enterprise SSO. API adoption is at 23% of active customers (target: 40% by Q2 2026). Our NPS score improved from 58 to 67, driven by faster support response times and fewer critical bugs.

Team Growth:
Headcount reached 32 (up from 24 in Q3). Key hires: VP of Sales, two senior engineers, three customer success managers. We maintained our 2:1 ratio of engineering to all other functions.

2026 Plan:
We are targeting $12M ARR by end of 2026, requiring 185% growth. This plan assumes:
- 40% of revenue from enterprise (8+ deals)
- Expansion into two new markets (DACH and Nordics)
- Product-led growth motion contributing 25% of new ARR
- Series A raise of $8M in Q2 to fund go-to-market acceleration

Key risks: enterprise sales cycle volatility, churn in SMB segment, competitive pressure from two well-funded challengers.
```

---

## Test 3: Tutorial / Educational Content

```
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

## Test 4: Decision Document / ADR

```
Architecture Decision Record: Database Selection for Analytics Platform

Context:
We are building a real-time analytics platform that ingests 500GB of event data per day from our mobile and web applications. The system must support complex aggregations, time-series queries, and ad-hoc exploration by product managers and data scientists. Current prototype uses PostgreSQL but query performance degrades beyond 100M rows.

Decision:
Should we adopt ClickHouse (columnar OLAP database) or continue with PostgreSQL and add read replicas?

Option A: Migrate to ClickHouse
ClickHouse is an open-source columnar database optimized for analytical queries. It can ingest 50-200K rows/second and handles queries on billions of rows in seconds.

Advantages:
- Query performance: 10-100x faster than PostgreSQL on analytical workloads
- Compression: stores data at 10:1 compression ratio (saves 80% on storage costs)
- Horizontal scaling: can shard across 10+ nodes as data grows
- Strong time-series support: native Date/DateTime types and specialized functions
- Active open-source community and good documentation

Disadvantages:
- Team has zero ClickHouse experience (learning curve estimated at 4-6 weeks)
- No support for transactions or updates (append-only, requires delete/reinsert for corrections)
- Limited ecosystem: fewer BI tools have native connectors
- Migration effort: estimated 8 weeks to migrate schema, ETL pipelines, and queries
- Operational complexity: requires dedicated DBA knowledge for production tuning

Cost: Self-hosted on AWS EC2: 3x r5.4xlarge nodes = $3,600/month. Estimated 2 weeks setup + ongoing 0.3 FTE for ops.

Option B: Scale PostgreSQL with Read Replicas
Keep PostgreSQL as the analytical database but add 3-5 read replicas to distribute query load.

Advantages:
- Team expertise: all engineers know PostgreSQL
- Transactional support: can update/delete records easily
- Rich ecosystem: every BI tool works with PostgreSQL
- Incremental approach: can add replicas gradually
- Lower risk: no migration, no new operational burden

Disadvantages:
- Query performance: still fundamentally limited by row-oriented storage
- Cost: 5x db.r5.4xlarge RDS instances = $7,200/month (2x more expensive than ClickHouse)
- Scaling ceiling: read replicas help with concurrency but not single-query performance
- Replication lag: replicas can be 5-30 seconds behind primary
- Does not address root cause: data volume will keep growing

Trade-offs:
ClickHouse offers better performance and lower cost but requires upfront migration investment and ongoing specialized knowledge. PostgreSQL is safe and familiar but will hit scaling limits within 12-18 months as data volume grows.

Risk Analysis:
ClickHouse risks: team learning curve, migration bugs, production incidents due to unfamiliarity. Mitigation: hire 1 contractor with ClickHouse experience, run both systems in parallel for 4 weeks.

PostgreSQL risks: query performance continues degrading, replica lag causes stale data issues, costs spiral. Mitigation: implement aggressive data retention (90 days only), partition tables by month.

Recommendation:
Adopt ClickHouse. The performance and cost advantages justify the migration effort. Our data volume is growing 15% per month, which means PostgreSQL will become untenable by mid-2026 regardless. Better to migrate now than in a crisis.

Implementation Plan:
1. Week 1-2: Hire ClickHouse consultant, set up dev cluster, migrate schema
2. Week 3-4: Backfill last 90 days of data, dual-write to both databases
3. Week 5-6: Migrate queries and dashboards, run both systems in parallel
4. Week 7-8: Cutover analytics traffic to ClickHouse, keep PostgreSQL as backup
5. Week 9-10: Monitor for issues, optimize ClickHouse configuration
6. Week 11-12: Decommission PostgreSQL analytics replica, archive historical data

Success criteria: P95 query latency <2s (currently 18s), storage cost <$4K/month, zero data loss during migration.
```

---

## Test 5: Process Documentation / Runbook

```
Incident Response Runbook - Production Database Outage

Overview:
This runbook guides the on-call engineer through responding to a production database outage. Follow steps in order. Do not skip steps even if you think you know the problem.

Detection:
You will be paged by PagerDuty with alert "PostgreSQL Primary Unreachable" or "Database Connection Pool Exhausted". The alert fires when >50% of health checks fail over a 2-minute window.

Step 1: Acknowledge and Assess (0-5 minutes)
Acknowledge the page in PagerDuty. Check the status page - is this a known issue? Look at Datadog dashboard "Database Health". Check three metrics: connection pool usage, query latency P95, and replica lag. If connection pool is at 100% but latency is normal, this is likely a connection leak (skip to Step 5). If latency is >5s and replica lag is increasing, this is a query performance issue (skip to Step 6). If you see "Connection refused" errors, the database may be down (continue to Step 2).

Step 2: Verify Database Status (5-10 minutes)
SSH into the bastion host and attempt to connect to the primary database using psql. If connection fails, check if the database process is running (pg_isready command). If the process is down, check system logs (/var/log/postgresql/postgresql.log) for error messages. Common causes: out of memory, disk full, corrupted data files, failed automatic restart.

Step 3: Check Replica Health (10-12 minutes)
Can you connect to any read replica? If yes, confirm replica lag is not increasing. If replicas are healthy, consider promoting a replica to primary (this is a major decision - consult with senior engineer unless customer impact is severe). If replicas are also down, this indicates a network partition or AWS availability zone issue (skip to Step 8).

Step 4: Initial Mitigation - Failover to Replica (12-20 minutes)
If primary is down but replicas are healthy, initiate failover. This requires three actions: promote replica to primary (pg_promote command), update application configuration to point to new primary IP, restart application servers to pick up new config. Expected downtime: 3-5 minutes. After failover, update status page and notify incident channel in Slack.

Step 5: Connection Leak Resolution (Alternative Path)
If connection pool is exhausted, identify long-running queries (SELECT * FROM pg_stat_activity WHERE state != 'idle' ORDER BY query_start). Kill any queries running >5 minutes that are not batch jobs (pg_terminate_backend(pid)). Restart the application to reset connection pools. This is a temporary fix - file a bug to investigate the connection leak.

Step 6: Query Performance Issue (Alternative Path)
If latency is high but the database is responsive, identify slow queries (SELECT query, mean_exec_time FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10). Check for missing indexes on large tables. If a batch job is running during business hours, pause it. Increase database instance size if CPU is maxed out (this requires a few minutes of downtime). Scale horizontally by adding read replicas if read queries are the bottleneck.

Step 7: Disk Full Resolution
If disk is >95% full, the database will stop accepting writes. Immediate action: delete old WAL files (but keep last 24 hours), run VACUUM on largest tables to reclaim space, increase disk size (requires downtime for some database engines). Long-term: implement automatic log rotation and old data archival.

Step 8: Network / AWS Availability Zone Failure
If both primary and replicas are unreachable, check AWS status page for outages in our region (us-east-1). If AWS reports an AZ outage, our database may be affected if not deployed multi-AZ. Contact AWS support (we have Enterprise Support). Consider launching a new database in a different AZ from latest snapshot (30-60 minutes). Update status page with estimated resolution time.

Step 9: Post-Mitigation Monitoring (20-60 minutes)
After primary issue is resolved, monitor for 30 minutes. Watch connection pool usage, query latency, error rates in application logs, and user-reported issues in support channel. If metrics return to normal and no new errors appear, page out and downgrade incident severity. If issues persist, escalate to senior engineer or CTO.

Step 10: Post-Incident Review (Within 24 hours)
Write an incident report covering: timeline of events, root cause, user impact (customers affected, minutes of downtime), actions taken, what went well, what could be improved. Schedule a blameless post-mortem meeting. Create Jira tickets for any identified action items (fix the bug, add monitoring, update runbook, etc.).

Key Contacts:
- On-call engineer: check PagerDuty schedule
- Escalation: Senior Engineer (John), CTO (Sarah)
- AWS Support: 1-800-XXX-XXXX (case priority: urgent/critical)
- Customer comms: Update status page first, then notify via email if downtime >15 minutes

Common Pitfalls:
- Do not restart the database without checking logs (may lose diagnostic information)
- Do not promote a replica with significant lag (data loss)
- Do not panic and make hasty changes (follow the runbook)
- Always update the status page (customers need visibility)

This runbook was last updated: January 2026. If you encounter a scenario not covered here, document it and update the runbook after the incident.
```

---

## Test 6: Competitive Analysis / Market Research

```
Project Management Software Market Analysis - 2026

Market Overview:
The project management software market is valued at $6.8B in 2026, growing at 11% annually. We analyzed six major players (Asana, Monday.com, ClickUp, Linear, Notion, Jira) across seven dimensions: ease of use, feature depth, customization, integrations, pricing, performance, and mobile experience.

Asana:
Market position: Established player with strong brand recognition in enterprise market. 140,000+ paying customers. IPO in 2020, current valuation ~$5B.

Strengths: Excellent onboarding flow, intuitive UI that non-technical teams adopt easily. Strong portfolio management features (roadmaps, goals, workload balancing). Best-in-class integrations (200+ apps). Reliable uptime (99.9% in 2025).

Weaknesses: Limited customization (rigid project structures), expensive at scale ($24.99/user/month for premium features), slower performance with large projects (>500 tasks), mobile app lacks feature parity with desktop.

Ideal customer: Marketing teams, enterprise PMOs, cross-functional initiatives requiring collaboration with non-technical stakeholders.

Scores: Ease of Use (9/10), Features (7/10), Customization (5/10), Integrations (9/10), Pricing (6/10), Performance (7/10), Mobile (6/10). Overall: 7/10.

Monday.com:
Market position: Fast-growing challenger focused on visual workflows. IPO in 2021, strong revenue growth (58% YoY). Notable for aggressive marketing.

Strengths: Highly visual interface with color-coded status columns. Excellent customization (custom fields, automations, formulas). Strong for CRM and sales pipeline management. Competitive pricing for small teams.

Weaknesses: Steep learning curve (paradox: customization creates complexity), performance issues with 1000+ items per board, integrations less mature than Asana, expensive for large teams (costs scale linearly).

Ideal customer: Sales teams, operations, small businesses that need visual project tracking without deep technical requirements.

Scores: Ease of Use (6/10), Features (8/10), Customization (9/10), Integrations (7/10), Pricing (7/10), Performance (6/10), Mobile (7/10). Overall: 7.1/10.

ClickUp:
Market position: "All-in-one" productivity platform attempting to replace multiple tools. Bootstrapped until Series A in 2020, now valued at $4B. Rapid feature development.

Strengths: Unmatched feature breadth (project management + docs + time tracking + goals + chat). Extremely customizable. Generous free tier. Strong community and frequent updates.

Weaknesses: Feature bloat creates overwhelming UI, inconsistent quality (some features feel beta), performance issues (slowest load times in our test), buggy (weekly reports of broken features), lacks focus.

Ideal customer: Small teams wanting an all-in-one tool, power users who want maximum customization, cost-conscious startups.

Scores: Ease of Use (5/10), Features (10/10), Customization (10/10), Integrations (8/10), Pricing (9/10), Performance (4/10), Mobile (5/10). Overall: 7.3/10.

Linear:
Market position: Developer-focused project management built by ex-Airbnb engineers. Cult following among technical teams. Series B (2022), ~$2B valuation. Prioritizes speed and design.

Strengths: Blazing fast (sub-100ms interactions), keyboard-first design, excellent for engineering workflows (GitHub integration, automatic issue linking), beautiful UI, opinionated simplicity prevents feature bloat.

Weaknesses: Limited to software development use cases (no marketing, HR, sales workflows), minimal customization (intentional design philosophy), no time tracking, expensive ($8-14/user/month with annual minimum).

Ideal customer: Engineering teams at tech companies, developer tools companies, product managers working with engineers.

Scores: Ease of Use (8/10), Features (6/10), Customization (4/10), Integrations (7/10), Pricing (6/10), Performance (10/10), Mobile (8/10). Overall: 7/10.

Notion:
Market position: Started as note-taking, evolved into all-in-one workspace. Viral growth, especially with individuals and startups. Series C valuation $10B. Known for flexibility.

Strengths: Ultimate flexibility (blocks-based, can build anything), excellent for documentation and wikis, strong template community, generous free tier, beautiful design.

Weaknesses: Poor project management features (lacks Gantt charts, dependencies, resource management), slow with large workspaces, no native time tracking, weak mobile experience for editing, not suitable for traditional PM workflows.

Ideal customer: Knowledge workers, content teams, startups wanting a single tool for docs + light project tracking.

Scores: Ease of Use (7/10), Features (5/10), Customization (9/10), Integrations (6/10), Pricing (8/10), Performance (5/10), Mobile (5/10). Overall: 6.4/10.

Jira:
Market position: The 800-pound gorilla. Atlassian's flagship product, dominant in enterprise software development. Part of a suite (Jira + Confluence + Bitbucket).

Strengths: Industry standard for software teams, unmatched issue tracking depth, powerful workflows and automations, mature integrations with dev tools, scales to 10,000+ users, enterprise-grade security and compliance.

Weaknesses: Terrible user experience (universally hated by new users), steep learning curve, slow and clunky UI, expensive at scale, overkill for simple projects, vendor lock-in to Atlassian ecosystem.

Ideal customer: Enterprise engineering organizations, teams with complex workflows requiring extensive customization, companies already invested in Atlassian suite.

Scores: Ease of Use (3/10), Features (9/10), Customization (8/10), Integrations (9/10), Pricing (5/10), Performance (5/10), Mobile (4/10). Overall: 6.1/10.

Market Gaps and Opportunities:
No tool excels at both ease of use AND customization (trade-off in product design). Performance is universally weak except Linear. Mobile experiences lag desktop by 2-3 years. No tool serves hybrid teams (tech + non-tech) well. Pricing models punish growth (per-seat pricing creates disincentives).

A new entrant could win by: combining Linear's speed with Asana's ease of use, offering flat-rate pricing, building mobile-first (not mobile-as-afterthought), focusing on hybrid team workflows (engineering + product + design collaborating).
```

---

## Usage Instructions

To test the MCP tool with these documents:

1. Call `analyze_content` with the content from any test document above
2. The tool will return structured analysis identifying visualizable systems, workflows, and data
3. Use the analysis results to call `generate_visualization` with appropriate parameters
