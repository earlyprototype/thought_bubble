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