/**
 * Template System Overhaul -- Exhaustive Test Generator
 * 
 * Generates one HTML file for every new and improved layout,
 * exercising section roles, density presets, and creative options.
 */

import { generateVisualization } from '../dist/tools/generate_visualization.js';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = join(__dirname, '..', '..', 'test_outputs', 'template_overhaul');
mkdirSync(outputDir, { recursive: true });

let passed = 0;
let failed = 0;
const errors = [];

async function generate(name, input) {
  try {
    const result = await generateVisualization(input);
    const filePath = join(outputDir, `${name}.html`);
    writeFileSync(filePath, result.html);
    const kb = (result.stats.fileSize / 1024).toFixed(0);
    const diagrams = result.stats.diagramsRendered;
    const total = result.stats.sectionsRendered;
    const warns = result.errors.length;
    console.log(`  OK  ${name.padEnd(40)} ${diagrams}/${total} diagrams  ${kb}KB${warns ? `  (${warns} warnings)` : ''}`);
    if (result.errors.length > 0) {
      result.errors.forEach(e => console.log(`      WARN: ${e}`));
    }
    passed++;
    return result;
  } catch (err) {
    console.log(`  FAIL  ${name.padEnd(38)} ${err.message}`);
    errors.push({ name, error: err.message });
    failed++;
    return null;
  }
}

async function main() {
  console.log('='.repeat(80));
  console.log('TEMPLATE SYSTEM OVERHAUL -- EXHAUSTIVE TESTS');
  console.log('='.repeat(80));
  console.log(`Output: ${outputDir}\n`);

  // =========================================================================
  // 1. COMPARISON LAYOUT
  // =========================================================================
  console.log('--- COMPARISON LAYOUT ---');

  await generate('comparison_vendor_eval', {
    content: 'Evaluating cloud providers for primary infrastructure migration.',
    title: 'Cloud Provider Evaluation',
    subtitle: 'AWS vs GCP vs Azure -- Technical Comparison',
    theme: 'tokyo_night',
    layout: 'comparison',
    density: 'comfortable',
    enableThemeSwitcher: true,
    selectedSystems: [
      {
        id: 1,
        title: 'AWS',
        description: '<p>Market leader with broadest service catalogue. 200+ services, strongest enterprise tooling. Higher base cost offset by volume discounts and reserved pricing.</p><p>Strengths: mature ecosystem, deepest Kubernetes support, best-in-class IAM. Weaknesses: complex pricing, UI/UX debt.</p>',
        diagramType: 'radial',
        chartData: [
          { label: 'Compute', value: 92 },
          { label: 'Storage', value: 88 },
          { label: 'Networking', value: 85 },
          { label: 'AI/ML', value: 78 },
          { label: 'DevOps', value: 90 },
          { label: 'Cost', value: 65 },
        ],
        chartOptions: { title: 'Capability Score (0-100)', colorStrategy: 'monochrome', emphasis: 'glow' },
        role: 'default',
      },
      {
        id: 2,
        title: 'Google Cloud',
        description: '<p>Best-in-class data and ML infrastructure. Strongest Kubernetes offering (GKE). Competitive pricing with sustained use discounts.</p><p>Strengths: BigQuery, Vertex AI, networking performance. Weaknesses: smaller service catalogue, enterprise sales maturity.</p>',
        diagramType: 'radial',
        chartData: [
          { label: 'Compute', value: 85 },
          { label: 'Storage', value: 82 },
          { label: 'Networking', value: 90 },
          { label: 'AI/ML', value: 95 },
          { label: 'DevOps', value: 82 },
          { label: 'Cost', value: 78 },
        ],
        chartOptions: { title: 'Capability Score (0-100)', colorStrategy: 'monochrome', emphasis: 'glow' },
        role: 'default',
      },
      {
        id: 3,
        title: 'Cost Projection Comparison',
        description: 'Projected monthly spend based on our workload profile. GCP offers 18% savings over AWS at equivalent configuration.',
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
          emphasis: 'glow',
          annotations: [
            { label: 'Best value', x: 'GCP', y: 38600, dy: -20 },
          ],
        },
        role: 'supporting',
      },
    ],
  });

  // =========================================================================
  // 2. BRIEFING LAYOUT
  // =========================================================================
  console.log('\n--- BRIEFING LAYOUT ---');

  await generate('briefing_sprint_review', {
    content: 'Sprint 47 review for the Platform Engineering team.',
    title: 'Sprint 47 Review',
    subtitle: 'Platform Engineering -- 2 Week Sprint ending 14 Mar 2026',
    theme: 'github_dark',
    layout: 'briefing',
    density: 'compact',
    enableThemeSwitcher: true,
    selectedSystems: [
      {
        id: 1,
        title: 'Velocity Trend',
        description: 'Velocity recovered from the holiday dip in Sprint 45. The team delivered 68 story points against a 65-point commitment -- a 105% completion rate.',
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
          annotations: [
            { label: 'Holiday sprint', x: 'S45', y: 41, dy: -15 },
            { label: 'Current', x: 'S47', y: 68, dy: -15 },
          ],
        },
        role: 'lead',
      },
      {
        id: 10,
        title: 'Points Delivered',
        description: '68',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        chartOptions: {},
        role: 'metric',
      },
      {
        id: 11,
        title: 'Completion Rate',
        description: '105%',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        chartOptions: {},
        role: 'metric',
      },
      {
        id: 12,
        title: 'Bugs Shipped',
        description: '0',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        chartOptions: {},
        role: 'metric',
      },
      {
        id: 13,
        title: 'PRs Merged',
        description: '23',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        chartOptions: {},
        role: 'metric',
      },
      {
        id: 2,
        title: 'Work Breakdown',
        description: 'Feature work dominated this sprint as the team pushed to close the authentication overhaul epic.',
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
        title: 'PR Cycle Time',
        description: 'Median time from PR open to merge. The auth overhaul PRs skewed the average upward.',
        diagramType: 'bar',
        chartData: [
          { label: 'Auth', value: 18.5 },
          { label: 'API', value: 4.2 },
          { label: 'Frontend', value: 6.1 },
          { label: 'Infra', value: 3.8 },
          { label: 'Tests', value: 2.1 },
        ],
        chartOptions: { title: 'Median PR Cycle Time (hours)', yLabel: 'Hours', colorStrategy: 'sequential' },
      },
      {
        id: 4,
        title: 'Next Sprint Actions',
        description: '<ul><li>Close remaining 3 tickets on auth epic</li><li>Begin database migration planning</li><li>Schedule tech debt day (Wednesday)</li><li>Review and update runbooks for on-call rotation</li></ul>',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        chartOptions: {},
        role: 'supporting',
      },
    ],
  });

  // =========================================================================
  // 3. TUTORIAL LAYOUT
  // =========================================================================
  console.log('\n--- TUTORIAL LAYOUT ---');

  await generate('tutorial_api_design', {
    content: 'Step-by-step guide to designing a REST API from scratch.',
    title: 'Designing Your First REST API',
    subtitle: 'A Practical Guide from Resource Modelling to Production Deployment',
    theme: 'gruvbox',
    layout: 'tutorial',
    density: 'spacious',
    enableThemeSwitcher: true,
    selectedSystems: [
      {
        id: 1,
        title: 'Define Your Resources',
        description: 'Start by identifying the nouns in your domain. Each resource maps to a collection endpoint. Resist the urge to model verbs as resources -- that leads to RPC-over-REST.',
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
        description: 'Map resources to HTTP methods. GET for reading, POST for creating, PUT for replacing, PATCH for partial updates, DELETE for removal. Use plural nouns for collection endpoints.',
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
        chartOptions: { title: 'RESTful Routing Pattern' },
      },
      {
        id: 3,
        title: 'Handle Errors Consistently',
        description: 'Use standard HTTP status codes. Return structured error bodies with a machine-readable code, human-readable message, and optional detail field. Never return 200 for errors.',
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
          title: 'Typical Response Code Distribution (%)',
          yLabel: '%',
          colorStrategy: 'sequential',
        },
        role: 'statement',
      },
      {
        id: 4,
        title: 'Implement Authentication',
        description: 'Choose between session-based auth (stateful, simpler) and JWT (stateless, scalable). For APIs consumed by third parties, use OAuth 2.0 with API keys for identification and tokens for authorisation.',
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
      {
        id: 5,
        title: 'Monitor and Iterate',
        description: 'Track four golden signals: latency, traffic, errors, and saturation. Set up dashboards before launch, not after. The best API design is informed by real usage patterns, not speculation.',
        diagramType: 'area',
        chartData: [
          { x: 'Week 1', y: 120 },
          { x: 'Week 2', y: 340 },
          { x: 'Week 3', y: 580 },
          { x: 'Week 4', y: 890 },
          { x: 'Week 5', y: 1200 },
          { x: 'Week 6', y: 1650 },
          { x: 'Week 7', y: 2100 },
          { x: 'Week 8', y: 2800 },
        ],
        chartOptions: {
          title: 'API Requests per Day (Post-Launch)',
          yLabel: 'Requests/day',
          curve: 'smooth',
          emphasis: 'glow',
          annotations: [
            { label: 'Public launch', x: 'Week 3', y: 580, dy: -20 },
            { label: 'Featured on HN', x: 'Week 6', y: 1650, dy: -20 },
          ],
        },
      },
    ],
  });

  // =========================================================================
  // 4. SCORECARD LAYOUT
  // =========================================================================
  console.log('\n--- SCORECARD LAYOUT ---');

  await generate('scorecard_security_audit', {
    content: 'Q1 2026 security posture assessment for Acme Corp.',
    title: 'Security Posture Assessment',
    subtitle: 'Acme Corp -- Q1 2026 Audit Results',
    theme: 'solarized_dark',
    layout: 'scorecard',
    density: 'comfortable',
    enableThemeSwitcher: true,
    selectedSystems: [
      {
        id: 1,
        title: 'B+',
        description: 'Overall Security Grade -- up from B- last quarter',
        diagramType: 'radial',
        chartData: [
          { label: 'Infrastructure', value: 85 },
          { label: 'Application', value: 72 },
          { label: 'Data', value: 90 },
          { label: 'Identity', value: 88 },
          { label: 'Compliance', value: 78 },
        ],
        chartOptions: { title: 'Domain Scores', colorStrategy: 'sequential', emphasis: 'glow' },
        role: 'metric',
      },
      {
        id: 2,
        title: 'Infrastructure Security',
        description: '<p>Score: 85/100</p><p>Network segmentation improved. Firewall rules reviewed and tightened. Remaining gap: 3 legacy servers without automated patching.</p>',
        diagramType: 'bar',
        chartData: [
          { label: 'Patching', value: 78 },
          { label: 'Segmentation', value: 92 },
          { label: 'Monitoring', value: 88 },
          { label: 'Backup', value: 82 },
        ],
        chartOptions: { title: 'Sub-scores', colorStrategy: 'sequential' },
      },
      {
        id: 3,
        title: 'Application Security',
        description: '<p>Score: 72/100</p><p>SAST integrated into CI pipeline. Two critical vulnerabilities found and remediated. DAST coverage still at 60% of endpoints.</p>',
        diagramType: 'bar',
        chartData: [
          { label: 'SAST', value: 85 },
          { label: 'DAST', value: 60 },
          { label: 'Dependencies', value: 72 },
          { label: 'Code Review', value: 70 },
        ],
        chartOptions: { title: 'Sub-scores', colorStrategy: 'sequential' },
      },
      {
        id: 4,
        title: 'Vulnerability Trend',
        description: 'Critical and high-severity vulnerability counts over the past six months. The downward trend reflects the impact of the shift-left security programme.',
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
        description: '<ol><li>Extend DAST coverage to 100% of public endpoints by end of Q2</li><li>Migrate remaining 3 legacy servers to automated patching</li><li>Implement runtime application self-protection (RASP) for payment services</li><li>Conduct red team exercise in Q2</li></ol>',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        chartOptions: {},
        role: 'supporting',
      },
    ],
  });

  // =========================================================================
  // 5. REPORT LAYOUT
  // =========================================================================
  console.log('\n--- REPORT LAYOUT ---');

  await generate('report_rfc', {
    content: 'RFC for migrating the monolith to a service-oriented architecture.',
    title: 'RFC-0042: Service Decomposition Strategy',
    subtitle: 'Migrating from Monolith to Services -- A Phased Approach',
    theme: 'professional',
    layout: 'report',
    density: 'comfortable',
    enableThemeSwitcher: true,
    selectedSystems: [
      {
        id: 1,
        title: 'Background and Motivation',
        description: '<p>The current monolithic architecture has served us well for four years, but is now exhibiting classic symptoms of scale strain: deployment frequency has dropped from daily to weekly, test suites take 45 minutes, and team coupling means a change to billing logic requires coordination with the search team.</p><p>This RFC proposes a phased decomposition into bounded-context services, starting with the domains that have the clearest boundaries and highest change frequency.</p>',
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
        title: 'Proposed Target Architecture',
        description: '<p>The target state separates each bounded context into an independently deployable service communicating via async events where possible and synchronous gRPC where latency requirements demand it.</p>',
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
        description: '<p>The migration is planned across four phases over 12 months. Each phase delivers a working, deployable state -- there is no "big bang" cutover.</p>',
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
        description: '<p>Key risks and mitigations identified during the architectural review.</p>',
        diagramType: 'quadrant',
        chartData: [
          { label: 'Data consistency', x: 0.8, y: 0.9 },
          { label: 'Team skill gaps', x: 0.6, y: 0.5 },
          { label: 'Vendor lock-in', x: 0.3, y: 0.4 },
          { label: 'Latency increase', x: 0.7, y: 0.6 },
          { label: 'Deployment complexity', x: 0.5, y: 0.7 },
          { label: 'Monitoring gaps', x: 0.4, y: 0.8 },
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
        description: '<p>Detailed service catalogue with ownership, SLO targets, and dependency mappings. See the companion spreadsheet for full resource estimates.</p>',
        diagramType: 'bar',
        chartData: [
          { label: 'Auth', value: 2 },
          { label: 'Billing', value: 3 },
          { label: 'Search', value: 2 },
          { label: 'Core', value: 5 },
          { label: 'Notifications', value: 1 },
          { label: 'Analytics', value: 2 },
        ],
        chartOptions: { title: 'Estimated Team Size per Service (FTE)', yLabel: 'Engineers' },
        role: 'supporting',
      },
    ],
  });

  // =========================================================================
  // 6. DOSSIER LAYOUT
  // =========================================================================
  console.log('\n--- DOSSIER LAYOUT ---');

  await generate('dossier_company_profile', {
    content: 'Deep-dive research profile on Stripe as a technology company.',
    title: 'Stripe, Inc.',
    subtitle: 'Payments Infrastructure -- Founded 2010 -- San Francisco, CA',
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
        chartOptions: {},
        role: 'metric',
      },
      {
        id: 11,
        title: 'Employees',
        description: '~8,000',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        chartOptions: {},
        role: 'metric',
      },
      {
        id: 12,
        title: 'Payment Volume',
        description: '$1T+',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        chartOptions: {},
        role: 'metric',
      },
      {
        id: 13,
        title: 'Countries',
        description: '46+',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        chartOptions: {},
        role: 'metric',
      },
      {
        id: 14,
        title: 'Revenue (est.)',
        description: '$16B+',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        chartOptions: {},
        role: 'metric',
      },
      {
        id: 1,
        title: 'Company Overview',
        description: '<p>Stripe provides payment processing infrastructure for internet businesses. The company\'s core thesis is that commerce on the internet is still fundamentally constrained by the difficulty of moving money. Their API-first approach has made them the default choice for developer-led companies.</p><p>Unlike traditional payment processors, Stripe has expanded into adjacent financial services: lending (Stripe Capital), corporate cards (Stripe Treasury), fraud prevention (Radar), and business incorporation (Atlas). This platform play creates switching costs that pure payment processors cannot match.</p>',
        diagramType: 'sankey',
        chartData: [{
          nodes: [
            { id: 'payments', label: 'Payments' },
            { id: 'billing', label: 'Billing' },
            { id: 'connect', label: 'Connect' },
            { id: 'radar', label: 'Radar' },
            { id: 'atlas', label: 'Atlas' },
            { id: 'revenue', label: 'Revenue' },
            { id: 'volume', label: 'Volume Fees' },
            { id: 'platform', label: 'Platform Fees' },
          ],
          links: [
            { source: 'payments', target: 'volume', value: 8000 },
            { source: 'billing', target: 'platform', value: 2500 },
            { source: 'connect', target: 'platform', value: 3000 },
            { source: 'connect', target: 'volume', value: 1500 },
            { source: 'radar', target: 'platform', value: 800 },
            { source: 'atlas', target: 'platform', value: 200 },
            { source: 'volume', target: 'revenue', value: 9500 },
            { source: 'platform', target: 'revenue', value: 6500 },
          ],
        }],
        chartOptions: { title: 'Revenue Flow by Product Line (est. $M)' },
        role: 'lead',
      },
      {
        id: 2,
        title: 'Revenue Growth Trajectory',
        description: 'Stripe\'s revenue has compounded at 35%+ annually, driven by both new customer acquisition and expanding wallet share within existing accounts.',
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
          annotations: [
            { label: 'COVID tailwind', x: '2021', y: 7.4, dy: -20 },
          ],
        },
      },
      {
        id: 3,
        title: 'Competitive Positioning',
        description: 'Stripe occupies the developer-first quadrant with the highest API quality scores. Adyen competes on enterprise features, while PayPal leads in consumer reach.',
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
        title: 'Stripe has become the plumbing of internet commerce -- invisible when it works, catastrophic when it doesn\'t.',
        description: 'The question is no longer whether Stripe will dominate payments, but whether it can successfully expand into the adjacent financial services that represent a $10T+ addressable market.',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        chartOptions: {},
        role: 'statement',
      },
    ],
  });

  // =========================================================================
  // 7. DIALOGUE LAYOUT
  // =========================================================================
  console.log('\n--- DIALOGUE LAYOUT ---');

  await generate('dialogue_build_vs_buy', {
    content: 'Architecture Decision Record: should we build or buy our observability platform?',
    title: 'Build vs Buy: Observability Platform',
    subtitle: 'ADR-0019 -- Should we build a custom observability stack or adopt Datadog?',
    theme: 'technical',
    layout: 'dialogue',
    density: 'comfortable',
    enableThemeSwitcher: true,
    selectedSystems: [
      {
        id: 1,
        title: 'Position A: Build Custom',
        description: '<p><strong>Argument:</strong> We have unique observability requirements around multi-tenant isolation and custom SLO computation that no vendor supports natively. Our scale (200B events/day) means vendor pricing is prohibitive at $2.4M/year.</p><p><strong>Evidence:</strong> The open-source stack (Prometheus + Grafana + Loki + Tempo) covers 80% of requirements. Custom alerting logic is a competitive advantage.</p><p><strong>Risk:</strong> Estimated 4-6 engineer-months to build, ongoing maintenance burden of 0.5 FTE.</p>',
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
        description: '<p><strong>Argument:</strong> Datadog is the market leader with the broadest integration catalogue. Time-to-value is measured in days, not months. The engineering team should focus on product, not infrastructure tooling.</p><p><strong>Evidence:</strong> 3 of our 5 peer companies use Datadog. Their APM and log management are best-in-class. The recent acquisition of observability AI capabilities addresses our custom SLO need.</p><p><strong>Risk:</strong> Vendor lock-in, pricing escalation at renewal, 30-day migration effort.</p>',
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
        description: '<p>The core trade-off is engineering time vs. ongoing cost. Building saves $1.86M over 3 years but consumes 4-6 months of senior engineer capacity and creates a permanent maintenance liability. The hidden cost of build is opportunity cost: those engineers could ship 2-3 product features instead.</p>',
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
          annotations: [
            { label: 'Breakeven', x: 'Month 12', y: 800, dy: -20 },
          ],
        },
        role: 'full-width',
      },
      {
        id: 4,
        title: 'Recommendation',
        description: '<p><strong>Decision: Build a hybrid approach.</strong></p><p>Adopt Datadog for APM and infrastructure monitoring (immediate value, best-in-class). Build custom SLO computation and multi-tenant dashboards on top of Prometheus (our unique requirements that no vendor serves well).</p><p>Estimated Year 1 cost: $620K (Datadog reduced tier + custom SLO build). This captures 90% of the vendor value at 60% of the cost while preserving our competitive advantage in tenant-level observability.</p>',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        chartOptions: {},
        role: 'supporting',
      },
    ],
  });

  // =========================================================================
  // 8. IMPROVED DASHBOARD (with metric roles)
  // =========================================================================
  console.log('\n--- IMPROVED EXISTING LAYOUTS ---');

  await generate('dashboard_with_metrics', {
    content: 'SaaS metrics dashboard using the new metric role system.',
    title: 'SaaS Health Dashboard',
    subtitle: 'March 2026',
    theme: 'github_light',
    layout: 'dashboard',
    density: 'compact',
    enableThemeSwitcher: true,
    selectedSystems: [
      {
        id: 10,
        title: 'MRR',
        description: '$847K',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        chartOptions: {},
        role: 'metric',
      },
      {
        id: 11,
        title: 'Churn Rate',
        description: '1.8%',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        chartOptions: {},
        role: 'metric',
      },
      {
        id: 12,
        title: 'NPS',
        description: '72',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        chartOptions: {},
        role: 'metric',
      },
      {
        id: 13,
        title: 'CAC Payback',
        description: '8 months',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        chartOptions: {},
        role: 'metric',
      },
      {
        id: 1,
        title: 'Revenue Trend',
        description: 'Monthly recurring revenue over the past 12 months, showing consistent growth with seasonal dips in December.',
        diagramType: 'area',
        chartData: [
          { x: 'Apr', y: 520 }, { x: 'May', y: 548 }, { x: 'Jun', y: 590 },
          { x: 'Jul', y: 615 }, { x: 'Aug', y: 642 }, { x: 'Sep', y: 680 },
          { x: 'Oct', y: 710 }, { x: 'Nov', y: 740 }, { x: 'Dec', y: 695 },
          { x: 'Jan', y: 760 }, { x: 'Feb', y: 805 }, { x: 'Mar', y: 847 },
        ],
        chartOptions: {
          title: 'MRR ($K)',
          yLabel: '$K',
          curve: 'smooth',
          emphasis: 'glow',
          annotations: [
            { label: 'Holiday dip', x: 'Dec', y: 695, dy: -15 },
            { label: 'Record', x: 'Mar', y: 847, dy: -15 },
          ],
        },
      },
      {
        id: 2,
        title: 'Customer Segments',
        description: 'Revenue distribution by customer segment. Enterprise contracts represent 52% of MRR.',
        diagramType: 'donut',
        chartData: [
          { label: 'Enterprise', value: 52 },
          { label: 'Mid-Market', value: 28 },
          { label: 'SMB', value: 15 },
          { label: 'Startup', value: 5 },
        ],
        chartOptions: { title: 'MRR by Segment (%)' },
      },
      {
        id: 3,
        title: 'Feature Adoption',
        description: 'Percentage of active users engaging with each feature. Low adoption of the API suggests documentation or onboarding issues.',
        diagramType: 'bar',
        chartData: [
          { label: 'Dashboard', value: 94 },
          { label: 'Reports', value: 78 },
          { label: 'Alerts', value: 65 },
          { label: 'Integrations', value: 52 },
          { label: 'API', value: 23 },
        ],
        chartOptions: {
          title: 'Feature Adoption (%)',
          yLabel: '%',
          colorStrategy: 'sequential',
        },
      },
    ],
  });

  // =========================================================================
  // 9. IMPROVED MAGAZINE (with pull-quote and lead roles)
  // =========================================================================
  await generate('magazine_with_roles', {
    content: 'Testing magazine layout with pull quotes, lead sections, and explicit full-width.',
    title: 'The State of Developer Experience',
    subtitle: 'How the best engineering teams are investing in DX',
    theme: 'minimal',
    layout: 'magazine',
    density: 'spacious',
    enableThemeSwitcher: true,
    hero: {
      title: 'The Developer Experience Revolution',
      subtitle: 'Internal tooling has become the highest-leverage investment in engineering productivity',
      metric: { value: '4.2x', label: 'Productivity Multiplier' },
    },
    selectedSystems: [
      {
        id: 1,
        title: 'The Thesis',
        description: '<p>Developer experience is not about making developers happy. It is about removing friction from the feedback loop between intention and outcome. The best DX investments are invisible -- they eliminate steps that engineers didn\'t even realise they were taking.</p>',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        chartOptions: {},
        role: 'lead',
      },
      {
        id: 99,
        title: '',
        description: 'The teams that invest 20% of engineering capacity in developer tooling ship 4x faster than those that invest less than 5%.',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        chartOptions: {},
        role: 'pull-quote',
      },
      {
        id: 2,
        title: 'DX Investment vs Velocity',
        description: 'Correlation between percentage of engineering time allocated to internal tooling and measured deployment frequency.',
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
        },
      },
      {
        id: 3,
        title: 'Where Teams Invest',
        description: 'The highest-impact DX investments are CI/CD pipelines and local development environments. Documentation and onboarding consistently rank lowest despite being cited as the biggest pain point.',
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
        },
        role: 'full-width',
      },
    ],
  });

  // =========================================================================
  // 10. IMPROVED PRESENTATION (with slide types)
  // =========================================================================
  await generate('presentation_with_slide_types', {
    content: 'Board presentation testing statement, metric, and full-width slide roles.',
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
        chartOptions: {},
        role: 'statement',
      },
      {
        id: 2,
        title: '$12.4M',
        description: 'Q1 2026 Revenue',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        chartOptions: {},
        role: 'metric',
      },
      {
        id: 3,
        title: 'Revenue Trajectory',
        description: 'Four quarters of accelerating growth culminating in the $12.4M milestone.',
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
        },
        role: 'full-width',
      },
      {
        id: 4,
        title: 'Market Position',
        description: 'We have moved from challenger to leader quadrant in every analyst report this quarter.',
        diagramType: 'quadrant',
        chartData: [
          { label: 'Acme Corp', x: 0.85, y: 0.82 },
          { label: 'Competitor A', x: 0.7, y: 0.75 },
          { label: 'Competitor B', x: 0.55, y: 0.6 },
          { label: 'Competitor C', x: 0.4, y: 0.45 },
        ],
        chartOptions: {
          title: 'Market Position Map',
          xLabel: 'Completeness of Vision',
          yLabel: 'Ability to Execute',
        },
      },
      {
        id: 5,
        title: '142%',
        description: 'Net Revenue Retention',
        diagramType: 'bar',
        chartData: [{ label: 'x', value: 1 }],
        chartOptions: {},
        role: 'metric',
      },
    ],
  });

  // =========================================================================
  // 11. IMPROVED EDITORIAL (with full-width breakout)
  // =========================================================================
  await generate('editorial_with_breakout', {
    content: 'Testing editorial layout with full-width breakout sections.',
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
        description: '<p>Technical debt is not debt. Debt implies a conscious borrowing decision with a known repayment schedule. Most so-called technical debt is entropy -- the natural degradation of system coherence as requirements evolve faster than architecture.</p><p>The distinction matters because it changes the intervention. Debt is resolved by paying it off. Entropy is managed by continuous investment in system legibility.</p>',
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
        chartOptions: { title: 'Sources of System Degradation (Typical Codebase)' },
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
  // 12. IMPROVED MINIMAL (visual-first hero)
  // =========================================================================
  await generate('minimal_visual_hero', {
    content: 'Testing the redesigned minimal layout with visual-first hero.',
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
          annotations: [
            { label: 'IRA effect', x: '2023', y: 3800, dy: -20 },
          ],
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
  // RESULTS
  // =========================================================================
  console.log('\n' + '='.repeat(80));
  console.log(`RESULTS: ${passed} passed, ${failed} failed, ${passed + failed} total`);
  if (errors.length > 0) {
    console.log('\nFailed tests:');
    errors.forEach(e => console.log(`  - ${e.name}: ${e.error}`));
  }
  console.log('='.repeat(80));
}

main().catch(err => {
  console.error('Test runner failed:', err);
  process.exit(1);
});
