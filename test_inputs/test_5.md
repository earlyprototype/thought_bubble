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