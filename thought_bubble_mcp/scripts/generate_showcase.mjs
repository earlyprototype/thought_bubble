#!/usr/bin/env node
/**
 * Comprehensive Showcase Generator for thought_bubble
 * 
 * Generates example outputs demonstrating all capabilities:
 * - All 13 layouts
 * - Section roles (metric, pull-quote, lead, statement, full-width, supporting)
 * - Density presets (compact, comfortable, spacious)
 * - Hero sections
 * - Chart styling (emphasis, curve, animation, colorStrategy, annotations)
 * - All diagram types (flowchart, sequence, er, class, state)
 * - All chart types (bar, line, area, donut, radial, gantt, timeline, quadrant, sankey, treemap)
 */

import { generateVisualization } from '../dist/tools/generate_visualization.js';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = join(__dirname, '..', '..', 'showcase_examples');
mkdirSync(outputDir, { recursive: true });

let generated = 0;

async function showcase(name, input) {
  try {
    console.log(`\nGenerating: ${name}`);
    const result = await generateVisualization(input);
    const filePath = join(outputDir, `${name}.html`);
    writeFileSync(filePath, result.html);
    
    const kb = (result.stats.fileSize / 1024).toFixed(1);
    console.log(`  ✓ ${result.stats.diagramsRendered}/${result.stats.sectionsRendered} diagrams | ${kb}KB | ${result.stats.theme} theme`);
    if (result.errors.length > 0) {
      result.errors.forEach(e => console.log(`    ⚠ ${e}`));
    }
    generated++;
    return result;
  } catch (err) {
    console.error(`  ✗ Failed: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log('═'.repeat(80));
  console.log('thought_bubble MCP Showcase Generator');
  console.log('═'.repeat(80));
  console.log(`Output directory: ${outputDir}\n`);

  // =========================================================================
  // 1. DASHBOARD with Metric Cards
  // =========================================================================
  console.log('\n━━━ DASHBOARD LAYOUT ━━━');
  
  await showcase('01_dashboard_saas_metrics', {
    content: 'Real-time SaaS health metrics for March 2026',
    title: 'SaaS Health Dashboard',
    subtitle: 'Real-time Metrics - March 2026',
    theme: 'github_light',
    layout: 'dashboard',
    density: 'compact',
    enableThemeSwitcher: true,
    selectedSystems: [
      {
        id: 1,
        title: 'MRR',
        description: '$847,200',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        role: 'metric',
      },
      {
        id: 2,
        title: 'Active Users',
        description: '12,408',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        role: 'metric',
      },
      {
        id: 3,
        title: 'Churn Rate',
        description: '1.8%',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        role: 'metric',
      },
      {
        id: 4,
        title: 'NPS Score',
        description: '72',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        role: 'metric',
      },
      {
        id: 5,
        title: 'Revenue Growth',
        description: 'Monthly recurring revenue trend showing consistent growth with Q4 acceleration',
        diagramType: 'area',
        chartData: [
          { x: 'Apr', y: 520 }, { x: 'May', y: 548 }, { x: 'Jun', y: 590 },
          { x: 'Jul', y: 615 }, { x: 'Aug', y: 642 }, { x: 'Sep', y: 680 },
          { x: 'Oct', y: 710 }, { x: 'Nov', y: 740 }, { x: 'Dec', y: 695 },
          { x: 'Jan', y: 760 }, { x: 'Feb', y: 805 }, { x: 'Mar', y: 847 },
        ],
        chartOptions: {
          title: 'MRR Trend ($K)',
          yLabel: '$K',
          curve: 'smooth',
          emphasis: 'glow',
          colorStrategy: 'sequential',
          annotations: [
            { label: 'Holiday dip', x: 'Dec', y: 695, dy: -15 },
            { label: 'Record high', x: 'Mar', y: 847, dy: -15 },
          ],
        },
      },
      {
        id: 6,
        title: 'Customer Segments',
        description: 'Revenue distribution by customer tier. Enterprise dominates at 52% of MRR.',
        diagramType: 'donut',
        chartData: [
          { label: 'Enterprise', value: 52 },
          { label: 'Mid-Market', value: 28 },
          { label: 'SMB', value: 15 },
          { label: 'Startup', value: 5 },
        ],
        chartOptions: { title: 'MRR by Segment (%)' },
      },
    ],
  });

  // =========================================================================
  // 2. MAGAZINE with Hero, Pull-Quote, Lead, Full-Width
  // =========================================================================
  console.log('\n━━━ MAGAZINE LAYOUT ━━━');
  
  await showcase('02_magazine_dx_revolution', {
    content: 'How modern engineering teams are investing in developer experience to achieve 4x productivity gains.',
    title: 'The Developer Experience Revolution',
    subtitle: 'Internal Tooling as Competitive Advantage',
    theme: 'minimal',
    layout: 'magazine',
    density: 'spacious',
    enableThemeSwitcher: true,
    hero: {
      title: 'The Developer Experience Revolution',
      subtitle: 'How the best engineering teams are winning with internal tooling',
      metric: { value: '4.2x', label: 'Productivity Multiplier' },
    },
    selectedSystems: [
      {
        id: 1,
        title: 'The Thesis',
        description: '<p>Developer experience is not about making developers happy. It is about removing friction from the feedback loop between intention and outcome. The best DX investments are invisible — they eliminate steps that engineers didn\'t even realise they were taking.</p>',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        role: 'lead',
      },
      {
        id: 2,
        title: '',
        description: 'Teams that invest 20% of engineering capacity in developer tooling ship 4x faster than those that invest less than 5%.',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        role: 'pull-quote',
      },
      {
        id: 3,
        title: 'The Data',
        description: 'Correlation between percentage of engineering time allocated to internal tooling and measured deployment frequency across 247 companies.',
        diagramType: 'line',
        chartData: [
          { x: '5%', y: 2 },
          { x: '10%', y: 5 },
          { x: '15%', y: 12 },
          { x: '20%', y: 24 },
          { x: '25%', y: 38 },
          { x: '30%', y: 45 },
        ],
        chartOptions: {
          title: 'Deploys/Week vs DX Investment',
          yLabel: 'Deploys per Week',
          xLabel: 'DX Investment (% of eng time)',
          curve: 'natural',
          emphasis: 'glow',
          animation: 'draw',
        },
      },
      {
        id: 4,
        title: 'Where Teams Invest',
        description: 'The highest-impact DX investments are CI/CD pipelines and local development environments. Documentation consistently ranks lowest despite being cited as the biggest pain point.',
        diagramType: 'bar',
        chartData: [
          { label: 'CI/CD', value: 35 },
          { label: 'Local Dev', value: 28 },
          { label: 'Testing', value: 18 },
          { label: 'Monitoring', value: 12 },
          { label: 'Docs', value: 7 },
        ],
        chartOptions: {
          title: 'DX Budget Allocation (%)',
          colorStrategy: 'sequential',
          emphasis: 'shadow',
        },
        role: 'full-width',
      },
    ],
  });

  // =========================================================================
  // 3. PRESENTATION with Statement, Metric, Full-Width Slides
  // =========================================================================
  console.log('\n━━━ PRESENTATION LAYOUT ━━━');
  
  await showcase('03_presentation_board_update', {
    content: 'Q1 2026 board presentation for Acme Corp',
    title: 'Q1 2026 Board Update',
    subtitle: 'Acme Corp Quarterly Review',
    theme: 'dark',
    layout: 'presentation',
    density: 'comfortable',
    enableThemeSwitcher: true,
    selectedSystems: [
      {
        id: 1,
        title: 'We are profitable.',
        description: 'For the first time in company history, Acme Corp achieved positive net income in Q1 2026.',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        role: 'statement',
      },
      {
        id: 2,
        title: '$12.4M',
        description: 'Q1 2026 Revenue',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        role: 'metric',
      },
      {
        id: 3,
        title: 'Revenue Trajectory',
        description: 'Four consecutive quarters of accelerating growth',
        diagramType: 'area',
        chartData: [
          { x: 'Q2 25', y: 7.2 },
          { x: 'Q3 25', y: 8.8 },
          { x: 'Q4 25', y: 10.6 },
          { x: 'Q1 26', y: 12.4 },
        ],
        chartOptions: {
          title: 'Quarterly Revenue ($M)',
          curve: 'smooth',
          emphasis: 'glow',
          animation: 'draw',
        },
        role: 'full-width',
      },
      {
        id: 4,
        title: '142%',
        description: 'Net Revenue Retention',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        role: 'metric',
      },
    ],
  });

  // =========================================================================
  // 4. COMPARISON with Radial Charts
  // =========================================================================
  console.log('\n━━━ COMPARISON LAYOUT ━━━');
  
  await showcase('04_comparison_cloud_providers', {
    content: 'Cloud provider evaluation for infrastructure migration',
    title: 'Cloud Provider Evaluation',
    subtitle: 'AWS vs GCP vs Azure — Technical Comparison',
    theme: 'tokyo_night',
    layout: 'comparison',
    density: 'comfortable',
    enableThemeSwitcher: true,
    selectedSystems: [
      {
        id: 1,
        title: 'AWS',
        description: '<p><strong>Market leader</strong> with broadest service catalogue. 200+ services, strongest enterprise tooling.</p><p>Strengths: mature ecosystem, deepest Kubernetes support, best-in-class IAM.<br>Weaknesses: complex pricing, UI/UX debt.</p>',
        diagramType: 'radial',
        chartData: [
          { label: 'Compute', value: 92 },
          { label: 'Storage', value: 88 },
          { label: 'Networking', value: 85 },
          { label: 'AI/ML', value: 78 },
          { label: 'DevOps', value: 90 },
          { label: 'Cost', value: 65 },
        ],
        chartOptions: {
          title: 'Capability Score (0-100)',
          colorStrategy: 'monochrome',
          emphasis: 'glow',
        },
      },
      {
        id: 2,
        title: 'Google Cloud',
        description: '<p><strong>Best-in-class</strong> data and ML infrastructure. Strongest Kubernetes offering (GKE).</p><p>Strengths: BigQuery, Vertex AI, networking performance.<br>Weaknesses: smaller service catalogue, enterprise sales maturity.</p>',
        diagramType: 'radial',
        chartData: [
          { label: 'Compute', value: 85 },
          { label: 'Storage', value: 82 },
          { label: 'Networking', value: 90 },
          { label: 'AI/ML', value: 95 },
          { label: 'DevOps', value: 82 },
          { label: 'Cost', value: 78 },
        ],
        chartOptions: {
          title: 'Capability Score (0-100)',
          colorStrategy: 'monochrome',
          emphasis: 'glow',
        },
      },
      {
        id: 3,
        title: 'Cost Projection',
        description: 'Monthly spend based on our workload profile. GCP offers 18% savings.',
        diagramType: 'bar',
        chartData: [
          { label: 'AWS', value: 47200 },
          { label: 'GCP', value: 38600 },
          { label: 'Azure', value: 42100 },
        ],
        chartOptions: {
          title: 'Estimated Monthly Cost ($)',
          yLabel: 'USD',
          colorStrategy: 'categorical',
          emphasis: 'lift',
          annotations: [{ label: 'Best value', x: 'GCP', y: 38600, dy: -20 }],
        },
        role: 'supporting',
      },
    ],
  });

  // =========================================================================
  // 5. BRIEFING with Lead and Stats Strip
  // =========================================================================
  console.log('\n━━━ BRIEFING LAYOUT ━━━');
  
  await showcase('05_briefing_sprint_review', {
    content: 'Sprint 47 review for Platform Engineering team',
    title: 'Sprint 47 Review',
    subtitle: 'Platform Engineering — 2 Week Sprint ending 14 Mar 2026',
    theme: 'github_dark',
    layout: 'briefing',
    density: 'compact',
    enableThemeSwitcher: true,
    selectedSystems: [
      {
        id: 1,
        title: 'Velocity Recovered',
        description: 'The team delivered 68 story points against a 65-point commitment — a 105% completion rate. Velocity has recovered from the holiday dip in Sprint 45.',
        diagramType: 'line',
        chartData: [
          { x: 'S43', y: 62 },
          { x: 'S44', y: 58 },
          { x: 'S45', y: 41 },
          { x: 'S46', y: 55 },
          { x: 'S47', y: 68 },
        ],
        chartOptions: {
          title: 'Story Points Delivered',
          yLabel: 'Points',
          curve: 'smooth',
          emphasis: 'glow',
          animation: 'draw',
          annotations: [
            { label: 'Holiday sprint', x: 'S45', y: 41, dy: -15 },
            { label: 'Current', x: 'S47', y: 68, dy: -15 },
          ],
        },
        role: 'lead',
      },
      {
        id: 10,
        title: '68 pts',
        description: 'Delivered',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        role: 'metric',
      },
      {
        id: 11,
        title: '105%',
        description: 'Completion',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        role: 'metric',
      },
      {
        id: 12,
        title: '0',
        description: 'Bugs Shipped',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        role: 'metric',
      },
      {
        id: 13,
        title: '23',
        description: 'PRs Merged',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        role: 'metric',
      },
      {
        id: 2,
        title: 'Work Breakdown',
        description: 'Feature work dominated this sprint as the team closed the authentication overhaul epic.',
        diagramType: 'donut',
        chartData: [
          { label: 'Features', value: 45 },
          { label: 'Tech Debt', value: 15 },
          { label: 'Bugs', value: 5 },
          { label: 'Infra', value: 3 },
        ],
        chartOptions: { title: 'Points by Category' },
      },
      {
        id: 3,
        title: 'Next Sprint Actions',
        description: '<ul><li>Close remaining 3 tickets on auth epic</li><li>Begin database migration planning</li><li>Schedule tech debt day (Wednesday)</li><li>Review runbooks for on-call rotation</li></ul>',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        role: 'supporting',
      },
    ],
  });

  // =========================================================================
  // 6. TUTORIAL with Numbered Steps
  // =========================================================================
  console.log('\n━━━ TUTORIAL LAYOUT ━━━');
  
  await showcase('06_tutorial_rest_api_design', {
    content: 'Step-by-step guide to REST API design from scratch',
    title: 'Designing Your First REST API',
    subtitle: 'From Resource Modelling to Production Deployment',
    theme: 'gruvbox',
    layout: 'tutorial',
    density: 'spacious',
    enableThemeSwitcher: true,
    selectedSystems: [
      {
        id: 1,
        title: 'Define Your Resources',
        description: 'Start by identifying the nouns in your domain. Each resource maps to a collection endpoint.',
        diagramType: 'er',
        mermaidCode: `erDiagram
    USER ||--o{ ORDER : places
    USER {
        int id PK
        string email
        string name
    }
    ORDER ||--|{ ORDER_ITEM : contains
    ORDER {
        int id PK
        date created_at
        string status
    }
    ORDER_ITEM }o--|| PRODUCT : references
    PRODUCT {
        int id PK
        string name
        decimal price
    }`,
        chartOptions: { title: 'Domain Model' },
      },
      {
        id: 2,
        title: 'Design Your Endpoints',
        description: 'Map resources to HTTP methods. Use plural nouns for collection endpoints.',
        diagramType: 'flowchart',
        mermaidCode: `flowchart TD
    Client([Client]) --> GET_ALL["GET /users"]
    Client --> GET_ONE["GET /users/:id"]
    Client --> POST["POST /users"]
    Client --> PUT["PUT /users/:id"]
    Client --> DELETE["DELETE /users/:id"]
    
    GET_ALL --> List[List Collection]
    GET_ONE --> Detail[Single Resource]
    POST --> Create[Create Resource]
    PUT --> Update[Replace Resource]
    DELETE --> Remove[Remove Resource]`,
        chartOptions: { title: 'RESTful Routing' },
      },
      {
        id: 3,
        title: 'Handle Errors Consistently',
        description: 'Use standard HTTP status codes. Return structured error bodies. Never return 200 for errors.',
        diagramType: 'bar',
        chartData: [
          { label: '200 OK', value: 72 },
          { label: '201 Created', value: 15 },
          { label: '400 Bad Request', value: 6 },
          { label: '401 Unauthorised', value: 3 },
          { label: '404 Not Found', value: 2 },
          { label: '500 Server Error', value: 2 },
        ],
        chartOptions: {
          title: 'Response Code Distribution (%)',
          yLabel: '%',
          colorStrategy: 'sequential',
        },
        role: 'statement',
      },
      {
        id: 4,
        title: 'Implement Authentication',
        description: 'Choose between session-based auth (stateful) and JWT (stateless). For third-party APIs, use OAuth 2.0.',
        diagramType: 'sequence',
        mermaidCode: `sequenceDiagram
    participant C as Client
    participant A as Auth Server
    participant R as Resource Server
    
    C->>A: POST /auth/token (credentials)
    A-->>C: { access_token, refresh_token }
    C->>R: GET /users (Bearer token)
    R-->>C: { data: [...] }
    
    Note over C,R: Token expires after 15 minutes
    
    C->>A: POST /auth/refresh (refresh_token)
    A-->>C: { access_token }`,
        chartOptions: { title: 'JWT Authentication Flow' },
      },
    ],
  });

  // =========================================================================
  // 7. SCORECARD with Overall Score and Categories
  // =========================================================================
  console.log('\n━━━ SCORECARD LAYOUT ━━━');
  
  await showcase('07_scorecard_security_audit', {
    content: 'Q1 2026 security posture assessment',
    title: 'Security Posture Assessment',
    subtitle: 'Acme Corp — Q1 2026 Audit Results',
    theme: 'solarized_dark',
    layout: 'scorecard',
    density: 'comfortable',
    enableThemeSwitcher: true,
    selectedSystems: [
      {
        id: 1,
        title: 'B+',
        description: 'Overall Security Grade — up from B- last quarter',
        diagramType: 'radial',
        chartData: [
          { label: 'Infrastructure', value: 85 },
          { label: 'Application', value: 72 },
          { label: 'Data', value: 90 },
          { label: 'Identity', value: 88 },
          { label: 'Compliance', value: 78 },
        ],
        chartOptions: {
          title: 'Domain Scores',
          colorStrategy: 'sequential',
          emphasis: 'glow',
        },
        role: 'metric',
      },
      {
        id: 2,
        title: 'Infrastructure Security',
        description: '<p>Score: 85/100</p><p>Network segmentation improved. Remaining gap: 3 legacy servers without automated patching.</p>',
        diagramType: 'bar',
        chartData: [
          { label: 'Patching', value: 78 },
          { label: 'Segmentation', value: 92 },
          { label: 'Monitoring', value: 88 },
          { label: 'Backup', value: 82 },
        ],
        chartOptions: {
          title: 'Sub-scores',
          colorStrategy: 'sequential',
        },
      },
      {
        id: 3,
        title: 'Application Security',
        description: '<p>Score: 72/100</p><p>SAST integrated into CI pipeline. DAST coverage still at 60% of endpoints.</p>',
        diagramType: 'bar',
        chartData: [
          { label: 'SAST', value: 85 },
          { label: 'DAST', value: 60 },
          { label: 'Dependencies', value: 72 },
          { label: 'Code Review', value: 70 },
        ],
        chartOptions: {
          title: 'Sub-scores',
          colorStrategy: 'sequential',
        },
      },
      {
        id: 4,
        title: 'Vulnerability Trend',
        description: 'Critical and high-severity counts over six months. Downward trend reflects shift-left security impact.',
        diagramType: 'line',
        chartData: [
          { x: 'Oct', y: 24, series: 'Critical' },
          { x: 'Nov', y: 18, series: 'Critical' },
          { x: 'Dec', y: 15, series: 'Critical' },
          { x: 'Jan', y: 12, series: 'Critical' },
          { x: 'Feb', y: 8, series: 'Critical' },
          { x: 'Mar', y: 5, series: 'Critical' },
          { x: 'Oct', y: 42, series: 'High' },
          { x: 'Nov', y: 38, series: 'High' },
          { x: 'Dec', y: 35, series: 'High' },
          { x: 'Jan', y: 30, series: 'High' },
          { x: 'Feb', y: 22, series: 'High' },
          { x: 'Mar', y: 18, series: 'High' },
        ],
        chartOptions: {
          title: 'Open Vulnerabilities by Severity',
          yLabel: 'Count',
          curve: 'smooth',
          emphasis: 'glow',
        },
        role: 'full-width',
      },
      {
        id: 5,
        title: 'Recommendations',
        description: '<ol><li>Extend DAST coverage to 100% of endpoints by Q2</li><li>Migrate 3 legacy servers to automated patching</li><li>Implement RASP for payment services</li><li>Conduct red team exercise in Q2</li></ol>',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        role: 'supporting',
      },
    ],
  });

  // =========================================================================
  // 8. REPORT with Cover, TOC, Sections
  // =========================================================================
  console.log('\n━━━ REPORT LAYOUT ━━━');
  
  await showcase('08_report_rfc_microservices', {
    content: 'RFC for migrating monolith to service-oriented architecture',
    title: 'RFC-0042: Service Decomposition Strategy',
    subtitle: 'Migrating from Monolith to Services — A Phased Approach',
    theme: 'professional',
    layout: 'report',
    density: 'comfortable',
    enableThemeSwitcher: true,
    selectedSystems: [
      {
        id: 1,
        title: 'Background',
        description: '<p>The current monolithic architecture has served us well for four years, but now exhibits classic symptoms of scale strain: deployment frequency dropped from daily to weekly, test suites take 45 minutes, and team coupling means a change to billing requires coordination with the search team.</p>',
        diagramType: 'flowchart',
        mermaidCode: `flowchart TD
    subgraph Monolith["Current Monolith"]
        Auth[Auth Module]
        Billing[Billing Module]
        Search[Search Module]
        Notify[Notifications]
        Core[Core Logic]
    end
    
    Auth --> Core
    Billing --> Core
    Search --> Core
    Notify --> Core
    
    style Monolith fill:#f8f9fa,stroke:#dee2e6`,
        chartOptions: { title: 'Current Architecture' },
      },
      {
        id: 2,
        title: 'Proposed Architecture',
        description: '<p>Target state separates each bounded context into independently deployable services via async events (RabbitMQ) and synchronous gRPC where latency requirements demand it.</p>',
        diagramType: 'flowchart',
        mermaidCode: `flowchart LR
    Gateway([API Gateway]) --> AuthS[Auth Service]
    Gateway --> BillingS[Billing Service]
    Gateway --> SearchS[Search Service]
    Gateway --> CoreS[Core Service]
    
    AuthS --> EventBus[Event Bus]
    BillingS --> EventBus
    CoreS --> EventBus
    EventBus --> NotifyS[Notification Service]
    EventBus --> AnalyticsS[Analytics Service]
    
    style EventBus fill:#4caf50
    style Gateway fill:#2196f3`,
        chartOptions: { title: 'Target Service Architecture' },
      },
      {
        id: 3,
        title: 'Migration Timeline',
        description: '<p>Four phases over 12 months. Each phase delivers a working, deployable state — no big bang cutover.</p>',
        diagramType: 'gantt',
        chartData: [
          { task: 'Phase 1: Auth extraction', start: '2026-04-01', end: '2026-06-30', category: 'Phase 1' },
          { task: 'Phase 2: Billing extraction', start: '2026-06-01', end: '2026-09-30', category: 'Phase 2' },
          { task: 'Phase 3: Search extraction', start: '2026-08-01', end: '2026-11-30', category: 'Phase 3' },
          { task: 'Phase 4: Core decomposition', start: '2026-10-01', end: '2027-03-31', category: 'Phase 4' },
          { task: 'Event bus infrastructure', start: '2026-04-01', end: '2026-07-31', category: 'Infra' },
          { task: 'Observability platform', start: '2026-04-01', end: '2026-05-31', category: 'Infra' },
        ],
        chartOptions: { title: 'Migration Roadmap' },
      },
      {
        id: 4,
        title: 'Risk Assessment',
        description: '<p>Key risks and mitigations identified during architectural review.</p>',
        diagramType: 'quadrant',
        chartData: [
          { label: 'Data consistency', x: 0.8, y: 0.9 },
          { label: 'Team skill gaps', x: 0.6, y: 0.5 },
          { label: 'Vendor lock-in', x: 0.3, y: 0.4 },
          { label: 'Latency increase', x: 0.7, y: 0.6 },
          { label: 'Deployment complexity', x: 0.5, y: 0.7 },
        ],
        chartOptions: {
          title: 'Risk Matrix (Probability vs Impact)',
          xLabel: 'Probability',
          yLabel: 'Impact',
        },
      },
      {
        id: 5,
        title: 'Appendix A: Service Inventory',
        description: '<p>Detailed service catalogue with ownership and SLO targets. See companion spreadsheet for full resource estimates.</p>',
        diagramType: 'bar',
        chartData: [
          { label: 'Auth', value: 2 },
          { label: 'Billing', value: 3 },
          { label: 'Search', value: 2 },
          { label: 'Core', value: 5 },
          { label: 'Notifications', value: 1 },
          { label: 'Analytics', value: 2 },
        ],
        chartOptions: {
          title: 'Team Size per Service (FTE)',
          yLabel: 'Engineers',
        },
        role: 'supporting',
      },
    ],
  });

  // =========================================================================
  // 9. DOSSIER with Hero, Facts, Lead, Statement
  // =========================================================================
  console.log('\n━━━ DOSSIER LAYOUT ━━━');
  
  await showcase('09_dossier_company_profile_stripe', {
    content: 'Deep-dive research profile on Stripe as a technology company',
    title: 'Stripe, Inc.',
    subtitle: 'Payments Infrastructure — Founded 2010 — San Francisco, CA',
    theme: 'dracula',
    layout: 'dossier',
    density: 'comfortable',
    enableThemeSwitcher: true,
    hero: {
      title: 'Stripe',
      subtitle: 'Internet payments infrastructure',
      metric: { value: '$91B', label: 'Valuation (2025)' },
    },
    selectedSystems: [
      {
        id: 10,
        title: 'Founded',
        description: '2010',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        role: 'metric',
      },
      {
        id: 11,
        title: 'Employees',
        description: '~8,000',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        role: 'metric',
      },
      {
        id: 12,
        title: 'Payment Volume',
        description: '$1T+',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        role: 'metric',
      },
      {
        id: 13,
        title: 'Countries',
        description: '46+',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        role: 'metric',
      },
      {
        id: 14,
        title: 'Revenue (est.)',
        description: '$16B+',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        role: 'metric',
      },
      {
        id: 1,
        title: 'Company Overview',
        description: '<p>Stripe provides payment processing infrastructure for internet businesses. Unlike traditional payment processors, Stripe has expanded into adjacent financial services: lending (Stripe Capital), corporate cards (Stripe Treasury), fraud prevention (Radar), and business incorporation (Atlas). This platform play creates switching costs that pure payment processors cannot match.</p>',
        diagramType: 'sankey',
        chartData: [{
          nodes: [
            { id: 'payments', label: 'Payments' },
            { id: 'billing', label: 'Billing' },
            { id: 'connect', label: 'Connect' },
            { id: 'radar', label: 'Radar' },
            { id: 'volume', label: 'Volume Fees' },
            { id: 'platform', label: 'Platform Fees' },
            { id: 'revenue', label: 'Revenue' },
          ],
          links: [
            { source: 'payments', target: 'volume', value: 8000 },
            { source: 'billing', target: 'platform', value: 2500 },
            { source: 'connect', target: 'platform', value: 3000 },
            { source: 'connect', target: 'volume', value: 1500 },
            { source: 'radar', target: 'platform', value: 800 },
            { source: 'volume', target: 'revenue', value: 9500 },
            { source: 'platform', target: 'revenue', value: 6500 },
          ],
        }],
        chartOptions: { title: 'Revenue Flow by Product ($M)' },
        role: 'lead',
      },
      {
        id: 2,
        title: 'Revenue Growth',
        description: 'Revenue has compounded at 35%+ annually, driven by new customer acquisition and wallet share expansion.',
        diagramType: 'area',
        chartData: [
          { x: '2019', y: 2.5 },
          { x: '2020', y: 4.2 },
          { x: '2021', y: 7.4 },
          { x: '2022', y: 10.5 },
          { x: '2023', y: 12.8 },
          { x: '2024', y: 14.5 },
          { x: '2025', y: 16.2 },
        ],
        chartOptions: {
          title: 'Estimated Revenue ($B)',
          yLabel: 'Billions (USD)',
          curve: 'smooth',
          emphasis: 'glow',
          animation: 'draw',
          annotations: [{ label: 'COVID tailwind', x: '2021', y: 7.4, dy: -20 }],
        },
      },
      {
        id: 3,
        title: 'Competitive Positioning',
        description: 'Stripe occupies the developer-first quadrant with highest API quality. Adyen competes on enterprise, PayPal leads in consumer reach.',
        diagramType: 'quadrant',
        chartData: [
          { label: 'Stripe', x: 0.9, y: 0.85 },
          { label: 'Adyen', x: 0.7, y: 0.75 },
          { label: 'PayPal/Braintree', x: 0.5, y: 0.6 },
          { label: 'Square', x: 0.6, y: 0.5 },
          { label: 'Checkout.com', x: 0.65, y: 0.55 },
        ],
        chartOptions: {
          title: 'Payment Platform Landscape',
          xLabel: 'Developer Experience',
          yLabel: 'Enterprise Readiness',
        },
      },
      {
        id: 99,
        title: '',
        description: 'Stripe has become the plumbing of internet commerce — invisible when it works, catastrophic when it doesn\'t. The question is no longer whether Stripe will dominate payments, but whether it can successfully expand into adjacent financial services representing a $10T+ addressable market.',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        role: 'statement',
      },
    ],
  });

  // =========================================================================
  // 10. DIALOGUE with Parallel Arguments
  // =========================================================================
  console.log('\n━━━ DIALOGUE LAYOUT ━━━');
  
  await showcase('10_dialogue_build_vs_buy', {
    content: 'Architecture Decision Record: build or buy observability platform?',
    title: 'Build vs Buy: Observability Platform',
    subtitle: 'ADR-0019 — Custom Stack or Datadog?',
    theme: 'technical',
    layout: 'dialogue',
    density: 'comfortable',
    enableThemeSwitcher: true,
    selectedSystems: [
      {
        id: 1,
        title: 'Position A: Build Custom',
        description: '<p><strong>Argument:</strong> We have unique observability requirements around multi-tenant isolation and custom SLO computation that no vendor supports natively. Our scale (200B events/day) means vendor pricing is prohibitive at $2.4M/year.</p><p><strong>Evidence:</strong> Open-source stack (Prometheus + Grafana + Loki + Tempo) covers 80% of requirements. Custom alerting is competitive advantage.</p><p><strong>Risk:</strong> 4-6 engineer-months to build, ongoing 0.5 FTE maintenance.</p>',
        diagramType: 'bar',
        chartData: [
          { label: 'Year 1 Build', value: 420 },
          { label: 'Year 2 Maintain', value: 180 },
          { label: 'Year 3 Maintain', value: 180 },
        ],
        chartOptions: {
          title: 'Custom Stack Cost ($K)',
          yLabel: 'USD (thousands)',
          colorStrategy: 'monochrome',
        },
      },
      {
        id: 2,
        title: 'Position B: Buy Datadog',
        description: '<p><strong>Argument:</strong> Datadog is market leader with broadest integration catalogue. Time-to-value measured in days. Engineering team should focus on product, not infrastructure tooling.</p><p><strong>Evidence:</strong> 3 of 5 peer companies use Datadog. Their APM and log management are best-in-class. Recent AI capabilities address custom SLO need.</p><p><strong>Risk:</strong> Vendor lock-in, pricing escalation at renewal, 30-day migration effort.</p>',
        diagramType: 'bar',
        chartData: [
          { label: 'Year 1 License', value: 800 },
          { label: 'Year 2 License', value: 880 },
          { label: 'Year 3 License', value: 960 },
        ],
        chartOptions: {
          title: 'Datadog Cost ($K)',
          yLabel: 'USD (thousands)',
          colorStrategy: 'monochrome',
        },
      },
      {
        id: 3,
        title: 'Trade-offs Analysis',
        description: '<p>The core trade-off is engineering time vs ongoing cost. Building saves $1.86M over 3 years but consumes 4-6 months of senior engineer capacity. Hidden cost of build is opportunity cost: those engineers could ship 2-3 product features instead.</p>',
        diagramType: 'line',
        chartData: [
          { x: 'Month 0', y: 0, series: 'Build' },
          { x: 'Month 6', y: 420, series: 'Build' },
          { x: 'Month 12', y: 510, series: 'Build' },
          { x: 'Month 24', y: 690, series: 'Build' },
          { x: 'Month 36', y: 870, series: 'Build' },
          { x: 'Month 0', y: 0, series: 'Buy' },
          { x: 'Month 6', y: 400, series: 'Buy' },
          { x: 'Month 12', y: 800, series: 'Buy' },
          { x: 'Month 24', y: 1680, series: 'Buy' },
          { x: 'Month 36', y: 2640, series: 'Buy' },
        ],
        chartOptions: {
          title: 'Cumulative Cost Comparison ($K)',
          yLabel: 'USD (thousands)',
          curve: 'smooth',
          emphasis: 'glow',
          annotations: [{ label: 'Breakeven', x: 'Month 12', y: 800, dy: -20 }],
        },
        role: 'full-width',
      },
      {
        id: 4,
        title: 'Decision: Hybrid Approach',
        description: '<p>Adopt Datadog for APM and infrastructure monitoring (immediate value, best-in-class). Build custom SLO computation and multi-tenant dashboards on Prometheus (our unique requirements no vendor serves well).</p><p>Estimated Year 1 cost: $620K (60% of vendor cost, 90% of value).</p>',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        role: 'supporting',
      },
    ],
  });

  // =========================================================================
  // 11. EDITORIAL with Full-Width Breakout
  // =========================================================================
  console.log('\n━━━ EDITORIAL LAYOUT ━━━');
  
  await showcase('11_editorial_technical_debt', {
    content: 'An essay on entropy in software systems',
    title: 'On the Nature of Technical Debt',
    subtitle: 'A Meditation on Entropy in Software Systems',
    theme: 'solarized_light',
    layout: 'editorial',
    density: 'spacious',
    enableThemeSwitcher: true,
    selectedSystems: [
      {
        id: 1,
        title: 'The Metaphor is Wrong',
        description: '<p>Technical debt is not debt. Debt implies a conscious borrowing decision with a known repayment schedule. Most so-called technical debt is entropy — the natural degradation of system coherence as requirements evolve faster than architecture.</p><p>The distinction matters because it changes the intervention. Debt is resolved by paying it off. Entropy is managed by continuous investment in system legibility.</p>',
        diagramType: 'line',
        chartData: [
          { x: 'Year 1', y: 95, series: 'Coherence' },
          { x: 'Year 2', y: 82, series: 'Coherence' },
          { x: 'Year 3', y: 68, series: 'Coherence' },
          { x: 'Year 4', y: 55, series: 'Coherence' },
          { x: 'Year 5', y: 42, series: 'Coherence' },
          { x: 'Year 1', y: 5, series: 'Entropy' },
          { x: 'Year 2', y: 18, series: 'Entropy' },
          { x: 'Year 3', y: 32, series: 'Entropy' },
          { x: 'Year 4', y: 45, series: 'Entropy' },
          { x: 'Year 5', y: 58, series: 'Entropy' },
        ],
        chartOptions: {
          title: 'System Coherence vs Entropy Over Time',
          yLabel: 'Score',
          curve: 'smooth',
        },
      },
      {
        id: 2,
        title: 'The Taxonomy of Decay',
        description: '<p>Not all system degradation is equal. A more useful taxonomy distinguishes between deliberate shortcuts (actual debt), accumulated complexity (entropy), and knowledge loss (amnesia).</p>',
        diagramType: 'treemap',
        chartData: [
          { label: 'Deliberate Shortcuts', value: 25 },
          { label: 'Accidental Complexity', value: 35 },
          { label: 'Knowledge Loss', value: 20 },
          { label: 'Dependency Rot', value: 15 },
          { label: 'Test Debt', value: 5 },
        ],
        chartOptions: { title: 'Sources of System Degradation' },
        role: 'full-width',
      },
      {
        id: 3,
        title: 'The Cost of Coherence',
        description: '<p>Maintaining system coherence requires continuous investment. The optimal allocation appears to be 15-20% of engineering capacity dedicated to refactoring, documentation, and architectural stewardship. Teams that allocate less than 10% experience exponential growth in incident frequency.</p>',
        diagramType: 'bar',
        chartData: [
          { label: '<5%', value: 18 },
          { label: '5-10%', value: 8 },
          { label: '10-15%', value: 4 },
          { label: '15-20%', value: 2 },
          { label: '>20%', value: 1.5 },
        ],
        chartOptions: {
          title: 'Incidents/Month vs Maintenance Investment',
          xLabel: 'Maintenance Budget (% of Eng Time)',
          yLabel: 'Monthly Incidents',
          colorStrategy: 'diverging',
        },
      },
    ],
  });

  // =========================================================================
  // 12. MINIMAL with Visual-First Hero
  // =========================================================================
  console.log('\n━━━ MINIMAL LAYOUT ━━━');
  
  await showcase('12_minimal_energy_transition', {
    content: 'Single-topic deep dive on global renewable energy capacity growth',
    title: 'Global Energy Transition',
    subtitle: 'Renewable Energy Capacity Growth 2020-2025',
    theme: 'creative',
    layout: 'minimal',
    density: 'spacious',
    enableThemeSwitcher: true,
    selectedSystems: [
      {
        id: 1,
        title: 'Renewable Capacity Growth',
        description: 'Global installed renewable energy capacity has grown at 12% compound annual rate, with solar leading the acceleration.',
        diagramType: 'area',
        chartData: [
          { x: '2020', y: 2800 },
          { x: '2021', y: 3100 },
          { x: '2022', y: 3400 },
          { x: '2023', y: 3800 },
          { x: '2024', y: 4300 },
          { x: '2025', y: 4900 },
        ],
        chartOptions: {
          title: 'Global Renewable Capacity (GW)',
          yLabel: 'Gigawatts',
          curve: 'smooth',
          emphasis: 'glow',
          animation: 'grow',
          annotations: [{ label: 'IRA effect', x: '2023', y: 3800, dy: -20 }],
        },
      },
      {
        id: 2,
        title: 'Source Breakdown',
        description: 'Solar PV now represents the largest single source of new capacity additions, surpassing wind for the first time in 2023.',
        diagramType: 'donut',
        chartData: [
          { label: 'Solar PV', value: 42 },
          { label: 'Wind', value: 28 },
          { label: 'Hydro', value: 18 },
          { label: 'Biomass', value: 7 },
          { label: 'Geothermal', value: 5 },
        ],
        chartOptions: { title: 'New Capacity Additions by Source (2025, %)' },
      },
    ],
  });

  // =========================================================================
  // 13. SIDEBAR (Legacy but Still Functional)
  // =========================================================================
  console.log('\n━━━ SIDEBAR LAYOUT (Legacy) ━━━');
  
  await showcase('13_sidebar_api_documentation', {
    content: 'API reference documentation with multiple endpoints',
    title: 'REST API Documentation',
    subtitle: 'Version 2.0',
    theme: 'github_light',
    layout: 'sidebar',
    density: 'comfortable',
    enableThemeSwitcher: true,
    selectedSystems: [
      {
        id: 1,
        title: 'Authentication',
        description: 'All API requests require authentication via JWT tokens in the Authorization header.',
        diagramType: 'sequence',
        mermaidCode: `sequenceDiagram
    participant C as Client
    participant A as API
    C->>A: POST /auth/login
    A-->>C: { token: "jwt..." }
    C->>A: GET /users (Bearer jwt...)
    A-->>C: { users: [...] }`,
        chartOptions: { title: 'Auth Flow' },
      },
      {
        id: 2,
        title: 'User Endpoints',
        description: 'CRUD operations for user resources.',
        diagramType: 'flowchart',
        mermaidCode: `flowchart TD
    GET[GET /users] --> List[List All Users]
    GET_ID[GET /users/:id] --> Single[Get Single User]
    POST[POST /users] --> Create[Create User]
    PUT[PUT /users/:id] --> Update[Update User]
    DELETE[DELETE /users/:id] --> Remove[Delete User]`,
        chartOptions: { title: 'User Resource Endpoints' },
      },
      {
        id: 3,
        title: 'Rate Limits',
        description: 'API rate limits vary by endpoint and authentication tier.',
        diagramType: 'bar',
        chartData: [
          { label: 'Anonymous', value: 10 },
          { label: 'Basic', value: 100 },
          { label: 'Pro', value: 1000 },
          { label: 'Enterprise', value: 10000 },
        ],
        chartOptions: {
          title: 'Requests per Minute by Tier',
          yLabel: 'Requests/min',
          colorStrategy: 'sequential',
        },
      },
    ],
  });

  // =========================================================================
  // Summary
  // =========================================================================
  console.log('\n' + '═'.repeat(80));
  console.log(`✓ Generated ${generated} showcase examples`);
  console.log(`✓ Output: ${outputDir}`);
  console.log('═'.repeat(80));
  console.log('\nCapabilities Demonstrated:');
  console.log('  • All 13 layouts (dashboard, magazine, presentation, comparison, etc.)');
  console.log('  • Section roles (metric, pull-quote, lead, statement, full-width, supporting)');
  console.log('  • Density presets (compact, comfortable, spacious)');
  console.log('  • Hero sections (magazine, dossier)');
  console.log('  • Chart styling (emphasis, curve, animation, colorStrategy, annotations)');
  console.log('  • All diagram types (flowchart, sequence, er, class, state)');
  console.log('  • All chart types (bar, line, area, donut, radial, gantt, timeline, quadrant, sankey, treemap)');
  console.log('  • 10 different themes');
  console.log('═'.repeat(80));
}

main().catch(err => {
  console.error('Showcase generation failed:', err);
  process.exit(1);
});
