/**
 * Generate 5 High-Impact Showcase Examples
 * 
 * Demonstrates thought_bubble's value for professional clients:
 * 1. Startup Investor Update (Product/Strategy)
 * 2. Quarterly Business Review (Consultant/Analyst)
 * 3. API Documentation Portal (DevRel/Tech Docs)
 * 4. Project Post-Mortem (Product Manager)
 * 5. M&A Due Diligence Brief (Consultant)
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { renderMermaidDiagram } from '../renderers/mermaid_renderer.js';
import { 
  renderBarChart, 
  renderPieChart, 
  renderLineChart, 
  renderGanttChart, 
  renderTimelineChart,
  renderQuadrantChart,
  type BarChartData, 
  type PieChartData, 
  type LineChartData,
  type GanttChartData,
  type TimelineData,
  type QuadrantData,
} from '../renderers/d3_renderer.js';
import { buildHTML, type Section } from '../builders/html_builder.js';
import { getTheme } from '../themes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// EXAMPLE 1: Startup Investor Update
// Target: Product Managers, Founders, Strategy Teams
// Theme: Tokyo Night (modern, tech-forward)
// ============================================================================

async function generateStartupInvestorUpdate() {
  console.log('\n1. Generating Startup Investor Update...');
  const theme = getTheme('tokyo_night');

  // System Architecture (Mermaid)
  const architecture = `graph TB
    subgraph clients [Client Applications]
        Web[Web App<br/>React + Next.js]
        Mobile[Mobile Apps<br/>iOS & Android]
        API_Clients[API Partners<br/>REST/GraphQL]
    end
    
    subgraph gateway [API Gateway Layer]
        Kong[Kong Gateway<br/>Rate Limiting & Auth]
        Cache[Redis Cache<br/>Session & Response]
    end
    
    subgraph services [Microservices]
        Auth[Auth Service<br/>JWT & OAuth2]
        Core[Core API<br/>Business Logic]
        ML[ML Pipeline<br/>Recommendations]
        Notif[Notification<br/>Service]
    end
    
    subgraph data [Data Layer]
        PG[(PostgreSQL<br/>Primary Data)]
        Elastic[(Elasticsearch<br/>Search & Analytics)]
        S3[(S3<br/>Media Storage)]
    end
    
    Web --> Kong
    Mobile --> Kong
    API_Clients --> Kong
    Kong --> Cache
    Kong --> Auth
    Kong --> Core
    Core --> ML
    Core --> Notif
    Core --> PG
    ML --> Elastic
    Notif --> S3`;

  // User Journey (Mermaid)
  const userJourney = `graph LR
    A[Landing Page] --> B{Has Account?}
    B -->|No| C[Sign Up Flow]
    B -->|Yes| D[Login]
    C --> E[Onboarding]
    D --> F[Dashboard]
    E --> F
    F --> G[Create Project]
    G --> H[Invite Team]
    H --> I[Active Usage]
    I --> J[Upgrade to Pro]
    J --> K[Enterprise Interest]
    
    style A fill:#7aa2f7
    style F fill:#9ece6a
    style J fill:#e0af68
    style K fill:#bb9af7`;

  // Monthly Active Users (D3 Line)
  const mauData: LineChartData[] = [
    { x: '2025-07', y: 1200 },
    { x: '2025-08', y: 2100 },
    { x: '2025-09', y: 3800 },
    { x: '2025-10', y: 6200 },
    { x: '2025-11', y: 9500 },
    { x: '2025-12', y: 14200 },
    { x: '2026-01', y: 21000 },
  ];

  // Revenue Breakdown (D3 Pie)
  const revenueData: PieChartData[] = [
    { label: 'Pro Subscriptions', value: 45 },
    { label: 'Enterprise', value: 32 },
    { label: 'API Usage', value: 15 },
    { label: 'Services', value: 8 },
  ];

  // Runway & Milestones (D3 Gantt)
  const runwayData: GanttChartData[] = [
    { task: 'Series A Close', start: '2026-01-01', end: '2026-02-15', category: 'funding' },
    { task: 'Enterprise Launch', start: '2026-02-01', end: '2026-04-30', category: 'product' },
    { task: 'APAC Expansion', start: '2026-03-15', end: '2026-06-30', category: 'growth' },
    { task: 'Series B Target', start: '2026-06-01', end: '2026-09-30', category: 'funding' },
    { task: '100K Users', start: '2026-04-01', end: '2026-08-31', category: 'growth' },
  ];

  // MRR Growth (D3 Bar)
  const mrrData: BarChartData[] = [
    { label: 'Aug', value: 12 },
    { label: 'Sep', value: 28 },
    { label: 'Oct', value: 52 },
    { label: 'Nov', value: 89 },
    { label: 'Dec', value: 142 },
    { label: 'Jan', value: 215 },
  ];

  const archSvg = await renderMermaidDiagram(architecture, theme);
  const journeySvg = await renderMermaidDiagram(userJourney, theme);
  const mauSvg = renderLineChart(mauData, theme, { title: 'Monthly Active Users (MAU)', area: true });
  const revenueSvg = renderPieChart(revenueData, theme, { title: 'Revenue Mix Q4 2025', donut: true });
  const runwaySvg = renderGanttChart(runwayData, theme, { title: '2026 Roadmap & Milestones' });
  const mrrSvg = renderBarChart(mrrData, theme, { title: 'MRR Growth ($K)' });

  const sections: Section[] = [
    {
      id: 'highlights',
      title: 'Q4 2025 Highlights',
      content: `<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 20px;">
        <div style="background: var(--surface); padding: 20px; border-radius: 12px; text-align: center;">
          <div style="font-size: 2.5rem; font-weight: 700; color: var(--accent);">21K</div>
          <div style="color: var(--text-secondary);">Monthly Active Users</div>
          <div style="color: var(--success); font-size: 0.9rem;">+75% MoM</div>
        </div>
        <div style="background: var(--surface); padding: 20px; border-radius: 12px; text-align: center;">
          <div style="font-size: 2.5rem; font-weight: 700; color: var(--accent);">$215K</div>
          <div style="color: var(--text-secondary);">Monthly Recurring Revenue</div>
          <div style="color: var(--success); font-size: 0.9rem;">+51% MoM</div>
        </div>
        <div style="background: var(--surface); padding: 20px; border-radius: 12px; text-align: center;">
          <div style="font-size: 2.5rem; font-weight: 700; color: var(--accent);">18</div>
          <div style="color: var(--text-secondary);">Enterprise Clients</div>
          <div style="color: var(--success); font-size: 0.9rem;">+6 this quarter</div>
        </div>
        <div style="background: var(--surface); padding: 20px; border-radius: 12px; text-align: center;">
          <div style="font-size: 2.5rem; font-weight: 700; color: var(--accent);">14mo</div>
          <div style="color: var(--text-secondary);">Runway Remaining</div>
          <div style="color: var(--info); font-size: 0.9rem;">Series A in progress</div>
        </div>
      </div>`,
    },
    {
      id: 'growth',
      title: 'User Growth Trajectory',
      content: '<p>Achieved product-market fit in Q3 with organic growth accelerating. Viral coefficient of 1.4 with 60-day payback period on paid acquisition.</p>',
      diagram: { svg: mauSvg.svg, caption: 'MAU growth showing 10x increase since July launch' },
    },
    {
      id: 'revenue',
      title: 'Revenue Performance',
      content: '<p>Strong unit economics with 78% gross margin. Enterprise segment growing fastest at 15% week-over-week. Average contract value increased 40% to $24K ARR.</p>',
      diagram: { svg: mrrSvg.svg, caption: 'MRR growth trajectory - targeting $500K by Q2 2026' },
    },
    {
      id: 'mix',
      title: 'Revenue Mix',
      content: '<p>Diversified revenue streams with enterprise adoption exceeding projections. API monetisation launched in November, already 15% of revenue.</p>',
      diagram: { svg: revenueSvg.svg, caption: 'Revenue distribution showing healthy enterprise mix' },
    },
    {
      id: 'architecture',
      title: 'Technical Architecture',
      content: '<p>Scalable microservices architecture built for enterprise. SOC 2 Type II certification in progress. 99.97% uptime in Q4.</p>',
      diagram: { svg: archSvg.svg, caption: 'Production infrastructure supporting 21K MAU' },
    },
    {
      id: 'journey',
      title: 'User Conversion Funnel',
      content: '<p>Optimised onboarding increased activation rate from 23% to 41%. Pro conversion rate at 8.2%, enterprise interest from 12% of Pro users.</p>',
      diagram: { svg: journeySvg.svg, caption: 'User journey from acquisition to enterprise expansion' },
    },
    {
      id: 'roadmap',
      title: '2026 Roadmap',
      content: '<p>Series A close expected February. Enterprise features launching Q1. APAC expansion beginning Q2 with Singapore office.</p>',
      diagram: { svg: runwaySvg.svg, caption: 'Key milestones and runway planning' },
    },
  ];

  return buildHTML({
    title: 'NexusAI - Series A Investor Update',
    subtitle: 'Q4 2025 Performance & 2026 Outlook',
    theme: 'tokyo_night',
    navigationStyle: 'sidebar',
    sections,
    enableThemeSwitcher: true,
    footer: 'Confidential - NexusAI Inc. Investor Update January 2026',
  });
}

// ============================================================================
// EXAMPLE 2: Quarterly Business Review (QBR)
// Target: Management Consultants, Business Analysts
// Theme: Professional (clean, corporate)
// ============================================================================

async function generateQuarterlyBusinessReview() {
  console.log('\n2. Generating Quarterly Business Review...');
  const theme = getTheme('professional');

  // Process Improvement Flow (Mermaid)
  const processFlow = `graph TD
    subgraph current [Current State - Q3]
        A1[Manual Data Entry<br/>4 hrs/day] --> A2[Excel Processing<br/>2 hrs/day]
        A2 --> A3[Email Reports<br/>1 hr/day]
        A3 --> A4[Management Review<br/>Weekly]
    end
    
    subgraph future [Future State - Q1 2026]
        B1[Automated Ingestion<br/>Real-time] --> B2[Cloud Processing<br/>5 min/batch]
        B2 --> B3[Dashboard Updates<br/>Auto-refresh]
        B3 --> B4[Continuous Monitoring<br/>Real-time alerts]
    end
    
    A4 -.->|Transformation| B1
    
    style A1 fill:#e74c3c
    style A2 fill:#e74c3c
    style B1 fill:#27ae60
    style B2 fill:#27ae60
    style B3 fill:#27ae60
    style B4 fill:#27ae60`;

  // Department Reorg (Mermaid)
  const orgChange = `graph TB
    CEO[CEO<br/>Sarah Mitchell]
    
    CEO --> COO[COO<br/>Operations]
    CEO --> CTO[CTO<br/>Technology]
    CEO --> CFO[CFO<br/>Finance]
    CEO --> CMO[CMO<br/>Marketing]
    
    COO --> Ops1[Supply Chain]
    COO --> Ops2[Customer Success]
    COO --> Ops3[Quality Assurance]
    
    CTO --> Tech1[Engineering]
    CTO --> Tech2[Data & Analytics]
    CTO --> Tech3[IT Infrastructure]
    
    CFO --> Fin1[Accounting]
    CFO --> Fin2[FP&A]
    CFO --> Fin3[Procurement]
    
    CMO --> Mkt1[Brand]
    CMO --> Mkt2[Growth]
    CMO --> Mkt3[Product Marketing]
    
    style CEO fill:#3498db
    style COO fill:#2c3e50
    style CTO fill:#2c3e50
    style CFO fill:#2c3e50
    style CMO fill:#2c3e50`;

  // KPI Performance (D3 Bar)
  const kpiData: BarChartData[] = [
    { label: 'Revenue', value: 112 },
    { label: 'Gross Margin', value: 98 },
    { label: 'NPS', value: 125 },
    { label: 'Employee Sat.', value: 94 },
    { label: 'Churn Rate', value: 156 },
  ];

  // Revenue Trend (D3 Line)
  const revenueTrend: LineChartData[] = [
    { x: 'Q1 24', y: 42 },
    { x: 'Q2 24', y: 48 },
    { x: 'Q3 24', y: 52 },
    { x: 'Q4 24', y: 61 },
    { x: 'Q1 25', y: 68 },
    { x: 'Q2 25', y: 74 },
    { x: 'Q3 25', y: 82 },
    { x: 'Q4 25', y: 94 },
  ];

  // Department Contribution (D3 Pie)
  const deptRevenue: PieChartData[] = [
    { label: 'Enterprise Sales', value: 42 },
    { label: 'Mid-Market', value: 28 },
    { label: 'SMB', value: 18 },
    { label: 'Partnerships', value: 12 },
  ];

  // Initiative Timeline (D3 Timeline)
  const initiatives: TimelineData[] = [
    { event: 'CRM Migration Complete', date: '2025-10-15', description: 'Salesforce to HubSpot' },
    { event: 'New Pricing Launched', date: '2025-11-01', description: '15% uplift achieved' },
    { event: 'APAC Team Hired', date: '2025-11-20', description: '12 new hires' },
    { event: 'SOC 2 Certified', date: '2025-12-05', description: 'Type II compliance' },
    { event: 'Enterprise Portal Live', date: '2026-01-10', description: 'Self-service dashboard' },
  ];

  const processSvg = await renderMermaidDiagram(processFlow, theme);
  const orgSvg = await renderMermaidDiagram(orgChange, theme);
  const kpiSvg = renderBarChart(kpiData, theme, { title: 'KPI Performance vs Target (%)' });
  const revSvg = renderLineChart(revenueTrend, theme, { title: 'Quarterly Revenue ($M)', area: true });
  const deptSvg = renderPieChart(deptRevenue, theme, { title: 'Revenue by Segment' });
  const timelineSvg = renderTimelineChart(initiatives, theme, { title: 'Q4 Key Initiatives' });

  const sections: Section[] = [
    {
      id: 'summary',
      title: 'Executive Summary',
      content: `<p>Q4 2025 delivered strong results with revenue exceeding target by 12%. Key achievements include SOC 2 certification, successful CRM migration, and APAC expansion. Churn reduction initiatives exceeded expectations with 44% improvement.</p>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 20px;">
        <div style="background: var(--surface); padding: 16px; border-radius: 8px; border-left: 4px solid var(--success);">
          <strong>Revenue:</strong> $94M (+15% YoY)
        </div>
        <div style="background: var(--surface); padding: 16px; border-radius: 8px; border-left: 4px solid var(--success);">
          <strong>NPS:</strong> 72 (+18 pts)
        </div>
        <div style="background: var(--surface); padding: 16px; border-radius: 8px; border-left: 4px solid var(--success);">
          <strong>Churn:</strong> 2.1% (-1.6 pts)
        </div>
      </div>`,
    },
    {
      id: 'kpis',
      title: 'KPI Scorecard',
      content: '<p>Performance against targets shows strong execution across most metrics. Churn reduction (156% of target) driven by customer success investments. Employee satisfaction below target due to reorg transition.</p>',
      diagram: { svg: kpiSvg.svg, caption: 'Green = exceeded target, values show % of target achieved' },
    },
    {
      id: 'revenue',
      title: 'Revenue Trajectory',
      content: '<p>Eight consecutive quarters of growth. Q4 acceleration driven by enterprise deals closing faster post-SOC 2 certification. Pipeline for Q1 2026 is 2.3x target.</p>',
      diagram: { svg: revSvg.svg, caption: 'Quarterly revenue trend showing consistent growth' },
    },
    {
      id: 'segments',
      title: 'Segment Performance',
      content: '<p>Enterprise continues to dominate at 42% of revenue. Mid-market growth accelerating with new self-service tools. Partnership channel exceeding expectations.</p>',
      diagram: { svg: deptSvg.svg, caption: 'Revenue contribution by business segment' },
    },
    {
      id: 'initiatives',
      title: 'Strategic Initiatives',
      content: '<p>All major Q4 initiatives delivered on time. CRM migration completed under budget. Enterprise portal launched ahead of schedule with positive early feedback.</p>',
      diagram: { svg: timelineSvg.svg, caption: 'Major milestones achieved in Q4 2025' },
    },
    {
      id: 'transformation',
      title: 'Process Transformation',
      content: '<p>Operations efficiency programme on track. Phase 1 automation reducing manual work by 85%. Full rollout expected Q1 2026 with projected $2.4M annual savings.</p>',
      diagram: { svg: processSvg.svg, caption: 'Before/after process automation transformation' },
    },
    {
      id: 'org',
      title: 'Organisation Structure',
      content: '<p>Q4 reorg complete with new CMO hire and consolidated operations function. Data & Analytics now reports to CTO to accelerate AI initiatives.</p>',
      diagram: { svg: orgSvg.svg, caption: 'Updated executive structure effective January 2026' },
    },
  ];

  return buildHTML({
    title: 'Quarterly Business Review - Q4 2025',
    subtitle: 'Acme Corporation Executive Summary',
    theme: 'professional',
    navigationStyle: 'sidebar',
    sections,
    enableThemeSwitcher: true,
    footer: 'Prepared by McKinley Consulting Group - January 2026',
  });
}

// ============================================================================
// EXAMPLE 3: API Documentation Portal
// Target: Developer Relations, Technical Documentation Teams
// Theme: GitHub Dark (developer-friendly)
// ============================================================================

async function generateAPIDocumentation() {
  console.log('\n3. Generating API Documentation Portal...');
  const theme = getTheme('github_dark');

  // Authentication Flow (Mermaid Sequence)
  const authFlow = `sequenceDiagram
    participant Client
    participant Gateway as API Gateway
    participant Auth as Auth Service
    participant Token as Token Store
    participant API as Resource API
    
    Client->>Gateway: POST /oauth/token
    Gateway->>Auth: Validate credentials
    Auth->>Token: Generate JWT
    Token-->>Auth: Access + Refresh tokens
    Auth-->>Gateway: Token response
    Gateway-->>Client: 200 OK + tokens
    
    Note over Client,API: Subsequent API calls
    
    Client->>Gateway: GET /api/resource
    Note right of Client: Authorization: Bearer {token}
    Gateway->>Auth: Validate JWT
    Auth-->>Gateway: Valid + user context
    Gateway->>API: Forward request
    API-->>Gateway: Resource data
    Gateway-->>Client: 200 OK + data`;

  // Data Model (Mermaid ER)
  const dataModel = `erDiagram
    ORGANIZATION ||--o{ WORKSPACE : contains
    ORGANIZATION ||--o{ USER : employs
    WORKSPACE ||--o{ PROJECT : contains
    PROJECT ||--o{ DOCUMENT : contains
    USER ||--o{ DOCUMENT : creates
    USER }o--o{ WORKSPACE : "member of"
    
    ORGANIZATION {
        uuid id PK
        string name
        string plan
        timestamp created_at
    }
    WORKSPACE {
        uuid id PK
        uuid org_id FK
        string name
        json settings
    }
    PROJECT {
        uuid id PK
        uuid workspace_id FK
        string name
        string status
    }
    DOCUMENT {
        uuid id PK
        uuid project_id FK
        uuid author_id FK
        string title
        text content
        timestamp updated_at
    }
    USER {
        uuid id PK
        uuid org_id FK
        string email
        string role
    }`;

  // API Usage by Endpoint (D3 Bar)
  const usageData: BarChartData[] = [
    { label: '/documents', value: 2400000 },
    { label: '/projects', value: 1800000 },
    { label: '/search', value: 1200000 },
    { label: '/users', value: 890000 },
    { label: '/workspaces', value: 650000 },
    { label: '/auth', value: 420000 },
  ];

  // Response Time Trend (D3 Line)
  const latencyData: LineChartData[] = [
    { x: 'Week 1', y: 145 },
    { x: 'Week 2', y: 142 },
    { x: 'Week 3', y: 138 },
    { x: 'Week 4', y: 128 },
    { x: 'Week 5', y: 124 },
    { x: 'Week 6', y: 118 },
    { x: 'Week 7', y: 112 },
    { x: 'Week 8', y: 105 },
  ];

  // Error Rate by Category (D3 Pie)
  const errorData: PieChartData[] = [
    { label: '4xx Client', value: 62 },
    { label: '5xx Server', value: 8 },
    { label: 'Timeout', value: 18 },
    { label: 'Rate Limited', value: 12 },
  ];

  // API Changelog (D3 Timeline)
  const changelog: TimelineData[] = [
    { event: 'v2.0 Released', date: '2025-09-01', description: 'GraphQL support added' },
    { event: 'Rate Limits Updated', date: '2025-10-15', description: '10K req/min for Pro' },
    { event: 'Batch Endpoints', date: '2025-11-20', description: 'Bulk operations API' },
    { event: 'Webhooks v2', date: '2025-12-10', description: 'Retry & filtering' },
    { event: 'SDK 3.0', date: '2026-01-05', description: 'TypeScript rewrite' },
  ];

  const authSvg = await renderMermaidDiagram(authFlow, theme);
  const modelSvg = await renderMermaidDiagram(dataModel, theme);
  const usageSvg = renderBarChart(usageData, theme, { title: 'API Calls by Endpoint (Last 30 Days)' });
  const latencySvg = renderLineChart(latencyData, theme, { title: 'P95 Response Time (ms)' });
  const errorSvg = renderPieChart(errorData, theme, { title: 'Error Distribution', donut: true });
  const changelogSvg = renderTimelineChart(changelog, theme, { title: 'API Changelog' });

  const sections: Section[] = [
    {
      id: 'overview',
      title: 'API Overview',
      content: `<p>The DocuFlow API provides programmatic access to documents, projects, and workspaces. Built on REST principles with optional GraphQL support.</p>
      <div style="background: var(--surface); padding: 16px; border-radius: 8px; font-family: monospace; margin-top: 16px;">
        <div style="color: var(--text-secondary);">Base URL</div>
        <div style="color: var(--accent);">https://api.docuflow.io/v2</div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 16px;">
        <div style="background: var(--surface); padding: 16px; border-radius: 8px;">
          <strong>Rate Limit:</strong> 1,000 req/min (Free), 10,000 req/min (Pro)
        </div>
        <div style="background: var(--surface); padding: 16px; border-radius: 8px;">
          <strong>Auth:</strong> OAuth 2.0 / API Key
        </div>
        <div style="background: var(--surface); padding: 16px; border-radius: 8px;">
          <strong>Format:</strong> JSON (REST) / GraphQL
        </div>
      </div>`,
    },
    {
      id: 'auth',
      title: 'Authentication Flow',
      content: '<p>OAuth 2.0 with JWT tokens. Access tokens expire in 1 hour, refresh tokens in 30 days. All requests must include <code>Authorization: Bearer {token}</code> header.</p>',
      diagram: { svg: authSvg.svg, caption: 'OAuth 2.0 authentication and API request flow' },
    },
    {
      id: 'model',
      title: 'Data Model',
      content: '<p>Hierarchical structure: Organizations contain Workspaces, which contain Projects and Documents. Users belong to Organizations and can be members of multiple Workspaces.</p>',
      diagram: { svg: modelSvg.svg, caption: 'Entity relationship diagram showing core data model' },
    },
    {
      id: 'usage',
      title: 'Endpoint Usage',
      content: '<p>Document operations dominate API traffic. Search endpoint seeing 40% growth month-over-month as AI features gain adoption.</p>',
      diagram: { svg: usageSvg.svg, caption: 'Request volume by endpoint - last 30 days' },
    },
    {
      id: 'performance',
      title: 'Performance Metrics',
      content: '<p>P95 latency improved 28% over 8 weeks following database optimisation and edge caching rollout. Target: sub-100ms by Q2.</p>',
      diagram: { svg: latencySvg.svg, caption: 'P95 response time trend showing continuous improvement' },
    },
    {
      id: 'errors',
      title: 'Error Analysis',
      content: '<p>62% of errors are client-side (4xx) - primarily invalid parameters and authentication issues. Server errors at historic low of 0.02%.</p>',
      diagram: { svg: errorSvg.svg, caption: 'Error distribution by category' },
    },
    {
      id: 'changelog',
      title: 'Recent Changes',
      content: '<p>Major releases in Q4 include GraphQL support, enhanced webhooks, and TypeScript SDK. Breaking changes communicated 90 days in advance.</p>',
      diagram: { svg: changelogSvg.svg, caption: 'API version history and major releases' },
    },
  ];

  return buildHTML({
    title: 'DocuFlow API Documentation',
    subtitle: 'Developer Reference & Platform Metrics',
    theme: 'github_dark',
    navigationStyle: 'sidebar',
    sections,
    enableThemeSwitcher: true,
    footer: 'DocuFlow API v2.3 - Documentation generated January 2026',
  });
}

// ============================================================================
// EXAMPLE 4: Project Post-Mortem
// Target: Product Managers, Engineering Leads
// Theme: Dracula (focused, serious)
// ============================================================================

async function generateProjectPostMortem() {
  console.log('\n4. Generating Project Post-Mortem...');
  const theme = getTheme('dracula');

  // Root Cause Analysis (Mermaid)
  const rootCause = `graph TD
    Incident[Production Outage<br/>3.5 hours downtime]
    
    Incident --> Direct[Direct Cause:<br/>Database connection pool exhausted]
    
    Direct --> C1[Slow queries<br/>from new feature]
    Direct --> C2[Connection leak<br/>in retry logic]
    Direct --> C3[No pool size<br/>monitoring]
    
    C1 --> R1[Missing index<br/>on user_events]
    C1 --> R2[N+1 query<br/>in report generation]
    
    C2 --> R3[Exception handler<br/>not releasing connections]
    
    C3 --> R4[Alerting gap<br/>in runbook]
    
    style Incident fill:#ff5555
    style Direct fill:#ffb86c
    style C1 fill:#8be9fd
    style C2 fill:#8be9fd
    style C3 fill:#8be9fd
    style R1 fill:#50fa7b
    style R2 fill:#50fa7b
    style R3 fill:#50fa7b
    style R4 fill:#50fa7b`;

  // Resolution Workflow (Mermaid Sequence)
  const resolution = `sequenceDiagram
    participant PagerDuty
    participant OnCall as On-Call Engineer
    participant SRE as SRE Team
    participant DB as Database Team
    participant Comms as Communications
    
    PagerDuty->>OnCall: Alert: API Error Rate > 50%
    OnCall->>OnCall: Initial triage (5 min)
    OnCall->>SRE: Escalate - widespread impact
    
    par Parallel Response
        SRE->>SRE: Scale up API instances
        DB->>DB: Investigate DB metrics
        Comms->>Comms: Draft status update
    end
    
    DB-->>SRE: Found: Connection pool exhausted
    SRE->>DB: Request emergency pool increase
    DB->>DB: Increase pool + restart
    
    Note over OnCall,DB: Service recovering
    
    SRE-->>Comms: Confirmed resolution
    Comms->>Comms: Post all-clear`;

  // Incident Timeline (D3 Timeline)
  const timeline: TimelineData[] = [
    { event: 'Deployment completed', date: '2026-01-15T14:30:00', description: 'v2.4.1 to production' },
    { event: 'First error alerts', date: '2026-01-15T15:45:00', description: 'Error rate spike detected' },
    { event: 'Incident declared', date: '2026-01-15T15:52:00', description: 'SEV1 - widespread impact' },
    { event: 'Root cause identified', date: '2026-01-15T16:35:00', description: 'DB connection exhaustion' },
    { event: 'Mitigation applied', date: '2026-01-15T17:15:00', description: 'Pool size increased' },
    { event: 'Service restored', date: '2026-01-15T17:48:00', description: 'All systems nominal' },
    { event: 'All-clear announced', date: '2026-01-15T18:20:00', description: 'Monitoring confirmed' },
  ];

  // Impact Metrics (D3 Bar)
  const impactData: BarChartData[] = [
    { label: 'Failed Requests', value: 284000 },
    { label: 'Affected Users', value: 12400 },
    { label: 'Support Tickets', value: 342 },
    { label: 'SLA Credits ($)', value: 8500 },
  ];

  // Error Rate During Incident (D3 Line)
  const errorRate: LineChartData[] = [
    { x: '15:30', y: 0.5 },
    { x: '15:45', y: 12 },
    { x: '16:00', y: 48 },
    { x: '16:15', y: 67 },
    { x: '16:30', y: 72 },
    { x: '16:45', y: 65 },
    { x: '17:00', y: 58 },
    { x: '17:15', y: 35 },
    { x: '17:30', y: 12 },
    { x: '17:45', y: 2 },
    { x: '18:00', y: 0.4 },
  ];

  // Action Items Priority (D3 Quadrant)
  const actionItems: QuadrantData[] = [
    { label: 'Add DB pool monitoring', x: 90, y: 85 },
    { label: 'Fix connection leak', x: 85, y: 95 },
    { label: 'Add missing index', x: 75, y: 70 },
    { label: 'Update runbook', x: 60, y: 50 },
    { label: 'Load test new features', x: 70, y: 80 },
    { label: 'Review deploy process', x: 40, y: 60 },
  ];

  const rootCauseSvg = await renderMermaidDiagram(rootCause, theme);
  const resolutionSvg = await renderMermaidDiagram(resolution, theme);
  const timelineSvg = renderTimelineChart(timeline, theme, { title: 'Incident Timeline', orientation: 'horizontal' });
  const impactSvg = renderBarChart(impactData, theme, { title: 'Incident Impact Summary' });
  const errorSvg = renderLineChart(errorRate, theme, { title: 'Error Rate During Incident (%)' });
  const prioritySvg = renderQuadrantChart(actionItems, theme, { 
    title: 'Action Item Prioritisation',
    quadrantLabels: ['Do Now', 'Plan', 'Delegate', 'Backlog'],
    xLabel: 'Effort',
    yLabel: 'Impact',
  });

  const sections: Section[] = [
    {
      id: 'summary',
      title: 'Incident Summary',
      content: `<div style="background: var(--surface); border-left: 4px solid var(--error); padding: 20px; border-radius: 8px;">
        <p><strong>Incident ID:</strong> INC-2026-0115-001</p>
        <p><strong>Severity:</strong> SEV1 - Critical</p>
        <p><strong>Duration:</strong> 3 hours 28 minutes (15:52 - 19:20 UTC)</p>
        <p><strong>Services Affected:</strong> Core API, Web Application, Mobile Apps</p>
        <p><strong>Customer Impact:</strong> 12,400 users experienced errors or degraded service</p>
      </div>`,
    },
    {
      id: 'timeline',
      title: 'Incident Timeline',
      content: '<p>Deployment at 14:30 introduced slow queries that gradually exhausted the database connection pool, leading to cascading failures starting at 15:45.</p>',
      diagram: { svg: timelineSvg.svg, caption: 'Chronological sequence of events' },
    },
    {
      id: 'errorrate',
      title: 'Error Rate Progression',
      content: '<p>Error rate peaked at 72% before mitigation took effect. Full recovery achieved by 18:00 UTC.</p>',
      diagram: { svg: errorSvg.svg, caption: 'API error rate during the incident window' },
    },
    {
      id: 'impact',
      title: 'Business Impact',
      content: '<p>284K failed requests affecting 12.4K users. 342 support tickets raised. $8,500 in SLA credits issued to enterprise customers.</p>',
      diagram: { svg: impactSvg.svg, caption: 'Quantified impact across key metrics' },
    },
    {
      id: 'rootcause',
      title: 'Root Cause Analysis',
      content: '<p>Primary cause: Database connection pool exhaustion. Contributing factors: Missing index, N+1 query pattern, connection leak in retry logic, and monitoring gap.</p>',
      diagram: { svg: rootCauseSvg.svg, caption: '5 Whys analysis showing cause chain' },
    },
    {
      id: 'resolution',
      title: 'Resolution Process',
      content: '<p>Incident declared at 15:52. Parallel investigation by SRE and Database teams. Emergency pool size increase at 17:15 resolved the immediate issue.</p>',
      diagram: { svg: resolutionSvg.svg, caption: 'Response coordination and resolution steps' },
    },
    {
      id: 'actions',
      title: 'Action Items',
      content: `<p>Six action items identified. Immediate priorities: Fix connection leak (P0), add database pool monitoring (P0), add missing index (P1).</p>`,
      diagram: { svg: prioritySvg.svg, caption: 'Prioritisation matrix - impact vs effort' },
    },
  ];

  return buildHTML({
    title: 'Incident Post-Mortem: January 15th Outage',
    subtitle: 'INC-2026-0115-001 - Database Connection Pool Exhaustion',
    theme: 'dracula',
    navigationStyle: 'sidebar',
    sections,
    enableThemeSwitcher: true,
    footer: 'Blameless Post-Mortem - Engineering Team - January 2026',
  });
}

// ============================================================================
// EXAMPLE 5: M&A Due Diligence Brief
// Target: Management Consultants, Investment Analysts
// Theme: Solarized Dark (professional, analytical)
// ============================================================================

async function generateMADueDiligence() {
  console.log('\n5. Generating M&A Due Diligence Brief...');
  const theme = getTheme('solarized_dark');

  // Target Company Org Structure (Mermaid)
  const orgStructure = `graph TB
    Board[Board of Directors<br/>5 members]
    
    Board --> CEO[CEO<br/>James Chen<br/>Founder]
    
    CEO --> CTO[CTO<br/>Maria Santos<br/>Co-founder, 15% equity]
    CEO --> CFO[CFO<br/>Robert Kim<br/>Hired 2023]
    CEO --> COO[COO<br/>Lisa Park<br/>COO since 2024]
    CEO --> CSO[Chief Sales<br/>David Miller<br/>45 sales reps]
    
    CTO --> Eng[Engineering<br/>62 engineers]
    CTO --> Product[Product<br/>18 PMs]
    
    CFO --> Finance[Finance<br/>12 staff]
    CFO --> Legal[Legal<br/>4 attorneys]
    
    COO --> Ops[Operations<br/>28 staff]
    COO --> CS[Customer Success<br/>35 CSMs]
    
    style CEO fill:#268bd2
    style CTO fill:#2aa198
    style CFO fill:#859900
    style COO fill:#b58900
    style CSO fill:#cb4b16`;

  // Integration Plan (Mermaid)
  const integrationPlan = `graph LR
    subgraph day1 [Day 1-30: Stabilisation]
        D1[Announce Deal] --> D2[Retain Key Talent]
        D2 --> D3[Customer Comms]
        D3 --> D4[Systems Access]
    end
    
    subgraph month2 [Month 2-3: Integration]
        M1[Finance Integration] --> M2[HR Consolidation]
        M2 --> M3[Tech Assessment]
        M3 --> M4[Sales Alignment]
    end
    
    subgraph month4 [Month 4-6: Optimisation]
        O1[Product Roadmap] --> O2[Cross-sell Launch]
        O2 --> O3[Cost Synergies]
        O3 --> O4[Org Finalisation]
    end
    
    D4 --> M1
    M4 --> O1
    
    style D1 fill:#268bd2
    style M1 fill:#2aa198
    style O1 fill:#859900`;

  // Revenue Growth (D3 Line)
  const revenueGrowth: LineChartData[] = [
    { x: '2021', y: 8.2 },
    { x: '2022', y: 14.5 },
    { x: '2023', y: 24.8 },
    { x: '2024', y: 38.2 },
    { x: '2025', y: 52.6 },
  ];

  // Revenue by Segment (D3 Bar)
  const segmentRevenue: BarChartData[] = [
    { label: 'Enterprise', value: 28.4 },
    { label: 'Mid-Market', value: 15.2 },
    { label: 'SMB', value: 6.8 },
    { label: 'Services', value: 2.2 },
  ];

  // Customer Concentration (D3 Pie)
  const customerConc: PieChartData[] = [
    { label: 'Top 10 Customers', value: 35 },
    { label: 'Next 40', value: 30 },
    { label: 'Long Tail (200+)', value: 35 },
  ];

  // Market Positioning (D3 Quadrant)
  const marketPosition: QuadrantData[] = [
    { label: 'Target Co.', x: 75, y: 70 },
    { label: 'Competitor A', x: 85, y: 60 },
    { label: 'Competitor B', x: 45, y: 80 },
    { label: 'Competitor C', x: 60, y: 45 },
    { label: 'Acquirer', x: 40, y: 55 },
  ];

  // Deal Timeline (D3 Gantt)
  const dealTimeline: GanttChartData[] = [
    { task: 'Due Diligence', start: '2026-01-15', end: '2026-03-15', category: 'legal' },
    { task: 'Regulatory Filing', start: '2026-02-01', end: '2026-04-30', category: 'legal' },
    { task: 'Shareholder Vote', start: '2026-03-01', end: '2026-03-31', category: 'governance' },
    { task: 'Integration Planning', start: '2026-02-15', end: '2026-05-15', category: 'operations' },
    { task: 'Expected Close', start: '2026-05-01', end: '2026-05-31', category: 'milestone' },
    { task: 'Day 1 Execution', start: '2026-06-01', end: '2026-06-30', category: 'operations' },
  ];

  const orgSvg = await renderMermaidDiagram(orgStructure, theme);
  const integrationSvg = await renderMermaidDiagram(integrationPlan, theme);
  const revenueSvg = renderLineChart(revenueGrowth, theme, { title: 'Revenue Growth ($M)', area: true });
  const segmentSvg = renderBarChart(segmentRevenue, theme, { title: '2025 Revenue by Segment ($M)' });
  const concSvg = renderPieChart(customerConc, theme, { title: 'Customer Revenue Concentration' });
  const marketSvg = renderQuadrantChart(marketPosition, theme, { 
    title: 'Competitive Positioning',
    quadrantLabels: ['Leaders', 'Challengers', 'Niche', 'Emerging'],
    xLabel: 'Market Share',
    yLabel: 'Growth Rate',
  });
  const timelineSvg = renderGanttChart(dealTimeline, theme, { title: 'Transaction Timeline' });

  const sections: Section[] = [
    {
      id: 'summary',
      title: 'Deal Summary',
      content: `<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
        <div style="background: var(--surface); padding: 20px; border-radius: 8px;">
          <h3 style="margin-bottom: 12px;">Target Company</h3>
          <p><strong>Name:</strong> CloudSync Technologies Inc.</p>
          <p><strong>Founded:</strong> 2018 (San Francisco, CA)</p>
          <p><strong>Employees:</strong> 224</p>
          <p><strong>2025 Revenue:</strong> $52.6M</p>
          <p><strong>Gross Margin:</strong> 78%</p>
        </div>
        <div style="background: var(--surface); padding: 20px; border-radius: 8px;">
          <h3 style="margin-bottom: 12px;">Transaction Details</h3>
          <p><strong>Deal Value:</strong> $285M</p>
          <p><strong>Multiple:</strong> 5.4x Revenue</p>
          <p><strong>Structure:</strong> 70% Cash / 30% Stock</p>
          <p><strong>Expected Close:</strong> Q2 2026</p>
          <p><strong>Synergies (Y3):</strong> $18M</p>
        </div>
      </div>`,
    },
    {
      id: 'financials',
      title: 'Financial Performance',
      content: '<p>Consistent 50%+ YoY growth since 2021. Strong unit economics with 78% gross margin and 18-month LTV:CAC ratio of 4.2x. Path to profitability visible by 2027.</p>',
      diagram: { svg: revenueSvg.svg, caption: 'Five-year revenue trajectory showing consistent growth' },
    },
    {
      id: 'segments',
      title: 'Revenue Breakdown',
      content: '<p>Enterprise accounts for 54% of revenue with strong expansion. Mid-market showing fastest growth at 65% YoY. Services revenue from implementation and training.</p>',
      diagram: { svg: segmentSvg.svg, caption: '2025 revenue by customer segment' },
    },
    {
      id: 'concentration',
      title: 'Customer Analysis',
      content: '<p>Healthy customer distribution with no single customer >8% of revenue. Top 10 customers at 35% - within acceptable range. Net revenue retention of 125%.</p>',
      diagram: { svg: concSvg.svg, caption: 'Customer concentration risk assessment' },
    },
    {
      id: 'market',
      title: 'Competitive Position',
      content: '<p>Strong challenger position with differentiated AI capabilities. Acquirer + Target combined would create market leader with 28% share. Key differentiator: real-time sync technology.</p>',
      diagram: { svg: marketSvg.svg, caption: 'Market positioning vs key competitors' },
    },
    {
      id: 'org',
      title: 'Organisation Structure',
      content: '<p>Lean leadership team with strong technical co-founder. Key person risk: CTO (15% equity) essential for product roadmap. Retention packages recommended for top 12 engineers.</p>',
      diagram: { svg: orgSvg.svg, caption: 'Current executive structure and headcount' },
    },
    {
      id: 'integration',
      title: 'Integration Approach',
      content: '<p>Phased integration over 6 months. Day 1 focus on talent retention and customer communication. Technology integration in months 2-3. Cross-sell opportunities from month 4.</p>',
      diagram: { svg: integrationSvg.svg, caption: '100-day integration plan' },
    },
    {
      id: 'timeline',
      title: 'Transaction Timeline',
      content: '<p>Due diligence completing March 2026. Regulatory approval expected Q1 (low risk, no competition concerns). Shareholder vote scheduled March. Close targeted May 2026.</p>',
      diagram: { svg: timelineSvg.svg, caption: 'Key workstreams and milestones to close' },
    },
  ];

  return buildHTML({
    title: 'M&A Due Diligence: CloudSync Technologies',
    subtitle: 'Confidential Investment Memorandum',
    theme: 'solarized_dark',
    navigationStyle: 'sidebar',
    sections,
    enableThemeSwitcher: true,
    footer: 'Prepared by Sterling Partners Advisory - Confidential - January 2026',
  });
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  console.log('Generating 5 High-Impact Showcase Examples...\n');
  console.log('='.repeat(60));

  const outputDir = path.resolve(__dirname, '../../../examples');

  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate all five examples
  const html1 = await generateStartupInvestorUpdate();
  const html2 = await generateQuarterlyBusinessReview();
  const html3 = await generateAPIDocumentation();
  const html4 = await generateProjectPostMortem();
  const html5 = await generateMADueDiligence();

  // Write files
  const files = [
    { name: 'startup_investor_update.html', content: html1 },
    { name: 'quarterly_business_review.html', content: html2 },
    { name: 'api_documentation_portal.html', content: html3 },
    { name: 'project_postmortem.html', content: html4 },
    { name: 'ma_due_diligence.html', content: html5 },
  ];

  console.log('\n' + '='.repeat(60));
  console.log('\nAll showcase examples generated successfully!\n');

  for (const file of files) {
    const filePath = path.join(outputDir, file.name);
    fs.writeFileSync(filePath, file.content, 'utf-8');
    const stats = fs.statSync(filePath);
    console.log(`- ${file.name.padEnd(35)} ${(stats.size / 1024).toFixed(1)} KB`);
  }

  console.log(`\nOutput directory: ${outputDir}`);
  console.log('\n' + '='.repeat(60));
}

main().catch(console.error);
