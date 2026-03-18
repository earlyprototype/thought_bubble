/**
 * Generate visualizations for the three test documents
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { renderMermaidDiagram } from '../renderers/mermaid_renderer.js';
import { renderGanttChart, renderBarChart, type GanttChartData, type BarChartData } from '../renderers/d3_renderer.js';
import { buildHTML, type Section } from '../builders/html_builder.js';
import { getTheme } from '../themes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const theme = getTheme('tokyo_night');

// ============================================================================
// Document 1: API Integration
// ============================================================================

async function generateApiIntegration() {
  console.log('\n1. Generating API Integration visualization...');

  const authFlow = `graph TD
    A[Merchant Registration] --> B[Receive API Credentials]
    B --> C[Generate API Key]
    C --> D[Configure Webhooks]
    D --> E[Request with API Key]
    E --> F{Authentication Valid?}
    F -->|Yes| G[HMAC Signature Check]
    F -->|No| H[401 Unauthorized]
    G --> I{Signature Valid?}
    I -->|Yes| J[Process Request]
    I -->|No| H`;

  const paymentFlow = `sequenceDiagram
    participant Client
    participant Gateway as API Gateway
    participant Payment as Payment Service
    participant Fraud as Fraud Detection
    participant Webhook as Webhook Service
    
    Client->>Gateway: Payment Request
    Gateway->>Gateway: Validate Auth
    Gateway->>Payment: Check Card Details
    Payment->>Fraud: Analyze Transaction
    Fraud-->>Payment: Approved/Rejected
    alt Approved
        Payment->>Payment: Process Charge
        Payment->>Webhook: Send Event
        Webhook-->>Client: Notification
        Payment-->>Gateway: Success
        Gateway-->>Client: 200 OK
    else Rejected
        Payment-->>Gateway: Failed
        Gateway-->>Client: 402 Payment Required
    end`;

  const dataModel = `erDiagram
    CUSTOMER ||--o{ PAYMENT : places
    CUSTOMER ||--o{ SUBSCRIPTION : has
    CUSTOMER {
        string customer_id PK
        string email
        array payment_methods
        string default_payment_method
        object metadata
    }
    PAYMENT {
        string payment_id PK
        string customer_id FK
        integer amount
        string currency
        string status
        timestamp created_at
        object metadata
    }
    SUBSCRIPTION {
        string subscription_id PK
        string customer_id FK
        string plan_id
        string status
        timestamp current_period_start
        timestamp current_period_end
        boolean cancel_at_period_end
    }
    SUBSCRIPTION ||--o{ PAYMENT : generates`;

  const serviceArchitecture = `graph LR
    subgraph external [External Services]
        Stripe[Stripe<br/>Card Processing]
        PayPal[PayPal<br/>Digital Wallet]
        Plaid[Plaid<br/>Bank Verification]
        MaxMind[MaxMind<br/>Fraud Detection]
    end
    
    subgraph api [Core API Services]
        Gateway[API Gateway]
        Payment[Payment Service]
        Sub[Subscription Service]
        Refund[Refund Service]
        Webhook[Webhook Service]
    end
    
    subgraph internal [Internal Services]
        User[User Service]
        Analytics[Analytics Service]
        Compliance[Compliance Service]
    end
    
    Gateway --> Payment
    Gateway --> Sub
    Gateway --> Refund
    Payment --> Stripe
    Payment --> PayPal
    Payment --> MaxMind
    Sub --> Payment
    Refund --> Payment
    Payment --> Webhook
    Gateway --> User
    Payment --> Analytics
    Gateway --> Compliance`;

  const authSvg = await renderMermaidDiagram(authFlow, theme);
  const paymentSvg = await renderMermaidDiagram(paymentFlow, theme);
  const dataSvg = await renderMermaidDiagram(dataModel, theme);
  const archSvg = await renderMermaidDiagram(serviceArchitecture, theme);

  const sections: Section[] = [
    {
      id: 'overview',
      title: 'Payment Gateway API Overview',
      content: '<p>A comprehensive RESTful API for processing payments, managing subscriptions, and handling refunds with support for 150+ currencies and multiple payment methods.</p>',
    },
    {
      id: 'auth',
      title: 'Authentication Flow',
      content: '<p>Secure authentication using API keys and HMAC signatures over TLS 1.3. All requests require valid credentials and signature verification.</p>',
      diagram: {
        svg: authSvg.svg,
        caption: 'Authentication and request validation workflow',
      },
    },
    {
      id: 'payment',
      title: 'Payment Processing Sequence',
      content: '<p>Real-time payment processing with fraud detection, supporting credit cards, digital wallets, and bank transfers. Includes automatic retry logic for failed transactions.</p>',
      diagram: {
        svg: paymentSvg.svg,
        caption: 'Payment processing sequence with fraud detection',
      },
    },
    {
      id: 'architecture',
      title: 'Service Architecture',
      content: '<p>Microservices architecture integrating external payment providers (Stripe, PayPal, Plaid) with internal services for analytics, compliance, and user management.</p>',
      diagram: {
        svg: archSvg.svg,
        caption: 'System architecture showing service dependencies',
      },
    },
    {
      id: 'data',
      title: 'Data Models',
      content: '<p>Core entities: Customer, Payment, and Subscription. Customers can have multiple payments and subscriptions, with subscriptions generating recurring payments.</p>',
      diagram: {
        svg: dataSvg.svg,
        caption: 'Entity-relationship diagram',
      },
    },
  ];

  const html = buildHTML({
    title: 'Payment Gateway Integration API',
    subtitle: 'Technical Documentation Visualization',
    theme: 'tokyo_night',
    navigationStyle: 'sidebar',
    sections,
    enableThemeSwitcher: true,
  });

  return html;
}

// ============================================================================
// Document 2: Product Roadmap
// ============================================================================

async function generateProductRoadmap() {
  console.log('\n2. Generating Product Roadmap visualization...');

  const ganttData: GanttChartData[] = [
    { task: 'Phase 1: Foundation', start: '2026-01-01', end: '2026-01-28', category: 'Q1', progress: 0 },
    { task: 'Phase 2: Visualization Engine', start: '2026-01-29', end: '2026-02-25', category: 'Q1', progress: 0 },
    { task: 'Phase 3: Collaboration', start: '2026-02-26', end: '2026-03-25', category: 'Q1', progress: 0 },
    { task: 'Phase 4: AI Insights', start: '2026-03-26', end: '2026-05-14', category: 'Q2', progress: 0 },
    { task: 'Phase 5: NL Queries', start: '2026-05-15', end: '2026-06-25', category: 'Q2', progress: 0 },
    { task: 'Phase 6: Predictive Analytics', start: '2026-06-26', end: '2026-08-20', category: 'Q3', progress: 0 },
    { task: 'Phase 7: Integrations', start: '2026-08-21', end: '2026-09-24', category: 'Q3', progress: 0 },
    { task: 'Phase 8: Enterprise', start: '2026-09-25', end: '2026-11-26', category: 'Q4', progress: 0 },
    { task: 'Phase 9: Mobile Apps', start: '2026-11-27', end: '2026-12-24', category: 'Q4', progress: 0 },
  ];

  const teamData: BarChartData[] = [
    { label: 'Backend', value: 12 },
    { label: 'Frontend', value: 8 },
    { label: 'ML/Data Science', value: 8 },
    { label: 'Mobile', value: 4 },
    { label: 'DevOps', value: 3 },
  ];

  const dependencyFlow = `graph TD
    P1[Phase 1<br/>Foundation] --> P2[Phase 2<br/>Visualization]
    P1 --> P3[Phase 3<br/>Collaboration]
    P2 --> P4[Phase 4<br/>AI Insights]
    P3 --> P4
    P4 --> P5[Phase 5<br/>NL Queries]
    P5 --> P6[Phase 6<br/>Predictive Analytics]
    P6 --> P7[Phase 7<br/>Integrations]
    P7 --> P8[Phase 8<br/>Enterprise]
    P8 --> P9[Phase 9<br/>Mobile Apps]
    
    style P1 fill:#7aa2f7
    style P2 fill:#7aa2f7
    style P3 fill:#7aa2f7
    style P4 fill:#bb9af7
    style P5 fill:#bb9af7
    style P6 fill:#7dcfff
    style P7 fill:#7dcfff
    style P8 fill:#9ece6a
    style P9 fill:#9ece6a`;

  const ganttSvg = renderGanttChart(ganttData, theme, {
    title: '2026 Development Timeline - 9 Phases Across 4 Quarters',
  });

  const teamSvg = renderBarChart(teamData, theme, {
    title: 'Engineering Resource Allocation (35 Engineers)',
  });

  const depSvg = await renderMermaidDiagram(dependencyFlow, theme);

  const sections: Section[] = [
    {
      id: 'vision',
      title: 'Product Vision',
      content: `<p><strong>Goal:</strong> Build the most intuitive and powerful analytics platform for modern data teams, leveraging AI to automate insights and predictions.</p>
      <p><strong>Target:</strong> By end of 2026, achieve 10,000+ active workspaces, 50,000+ dashboards created, and $5M ARR.</p>`,
    },
    {
      id: 'timeline',
      title: 'Development Timeline',
      content: '<p>9 phases spanning 52 weeks across 4 quarters, progressing from foundational infrastructure through AI capabilities to enterprise features and mobile apps.</p>',
      diagram: {
        svg: ganttSvg.svg,
        caption: 'Gantt chart showing phase durations and quarter alignment',
      },
    },
    {
      id: 'dependencies',
      title: 'Phase Dependencies',
      content: '<p>Critical path: Foundation must complete before visualization and collaboration. AI features require Q1-Q2 data accumulation. Mobile apps need API stability from Q3.</p>',
      diagram: {
        svg: depSvg.svg,
        caption: 'Dependency flow showing phase relationships',
      },
    },
    {
      id: 'resources',
      title: 'Team Structure',
      content: '<p>35 total engineers distributed across 5 disciplines. Backend leads with 12 engineers for infrastructure and API work. ML/Data Science team of 8 will drive AI features in Q2-Q3.</p>',
      diagram: {
        svg: teamSvg.svg,
        caption: 'Engineering team allocation by discipline',
      },
    },
    {
      id: 'quarterly',
      title: 'Quarterly Breakdown',
      content: `<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 20px;">
        <div style="background: var(--surface); padding: 20px; border-radius: 8px; border-left: 4px solid #7aa2f7;">
          <h3 style="margin-bottom: 10px;">Q1 2026</h3>
          <ul style="margin-left: 20px;">
            <li><strong>Foundation:</strong> Real-time data ingestion, connectors</li>
            <li><strong>Visualization:</strong> Dashboard builder, 20+ charts</li>
            <li><strong>Collaboration:</strong> RBAC, sharing, integrations</li>
          </ul>
        </div>
        <div style="background: var(--surface); padding: 20px; border-radius: 8px; border-left: 4px solid #bb9af7;">
          <h3 style="margin-bottom: 10px;">Q2 2026</h3>
          <ul style="margin-left: 20px;">
            <li><strong>AI Insights:</strong> Anomaly detection, forecasting</li>
            <li><strong>NL Queries:</strong> Plain English to SQL, AI assistant</li>
          </ul>
        </div>
        <div style="background: var(--surface); padding: 20px; border-radius: 8px; border-left: 4px solid #7dcfff;">
          <h3 style="margin-bottom: 10px;">Q3 2026</h3>
          <ul style="margin-left: 20px;">
            <li><strong>Predictive:</strong> Time series forecasting, what-if scenarios</li>
            <li><strong>Integrations:</strong> Salesforce, HubSpot, Snowflake</li>
          </ul>
        </div>
        <div style="background: var(--surface); padding: 20px; border-radius: 8px; border-left: 4px solid #9ece6a;">
          <h3 style="margin-bottom: 10px;">Q4 2026</h3>
          <ul style="margin-left: 20px;">
            <li><strong>Enterprise:</strong> SSO, audit logs, SOC 2 certification</li>
            <li><strong>Mobile:</strong> iOS/Android native apps with offline mode</li>
          </ul>
        </div>
      </div>`,
    },
  ];

  const html = buildHTML({
    title: 'Product Roadmap 2026',
    subtitle: 'AI-Powered Analytics Platform Development Plan',
    theme: 'tokyo_night',
    navigationStyle: 'sidebar',
    sections,
    enableThemeSwitcher: true,
  });

  return html;
}

// ============================================================================
// Document 3: Organizational Structure
// ============================================================================

async function generateOrgStructure() {
  console.log('\n3. Generating Organizational Structure visualization...');

  const executiveHierarchy = `graph TD
    Board[Board of Directors] --> CEO[CEO<br/>Sarah Chen]
    
    CEO --> CTO[CTO<br/>Marcus Rodriguez<br/>320 engineers]
    CEO --> CPO[CPO<br/>Jennifer Williams<br/>45 product/design]
    CEO --> CFO[CFO<br/>David Park<br/>35 finance]
    CEO --> CMO[CMO<br/>Alexandra Novak<br/>55 marketing]
    CEO --> CSO[CSO<br/>Robert Thompson<br/>120 sales]
    CEO --> COO[COO<br/>Lisa Anderson<br/>85 operations]
    CEO --> CHRO[Chief People Officer<br/>Michael Kim<br/>40 HR]
    
    style CEO fill:#7aa2f7
    style CTO fill:#bb9af7
    style CPO fill:#bb9af7
    style CFO fill:#7dcfff
    style CMO fill:#7dcfff
    style CSO fill:#9ece6a
    style COO fill:#e0af68
    style CHRO fill:#f7768e`;

  const engineeringOrg = `graph TD
    CTO[CTO<br/>Marcus Rodriguez] --> VPPlatform[VP Platform<br/>James Mitchell<br/>95 engineers]
    CTO --> VPProduct[VP Product<br/>Priya Sharma<br/>110 engineers]
    CTO --> VPData[VP Data<br/>Carlos Mendez<br/>65 engineers]
    CTO --> VPSecurity[VP Security<br/>Amanda Foster<br/>50 engineers]
    
    VPPlatform --> Infra[Core Infrastructure<br/>25 engineers]
    VPPlatform --> Cloud[Cloud Services<br/>30 engineers]
    VPPlatform --> DB[Database Systems<br/>20 engineers]
    VPPlatform --> DevOps[DevOps/SRE<br/>20 engineers]
    
    VPProduct --> Frontend[Frontend Platform<br/>35 engineers]
    VPProduct --> Mobile[Mobile<br/>25 engineers]
    VPProduct --> API[API Services<br/>30 engineers]
    VPProduct --> Integration[Integration Platform<br/>20 engineers]
    
    VPData --> DataEng[Data Engineering<br/>25 engineers]
    VPData --> ML[Machine Learning<br/>20 engineers]
    VPData --> AnalyticsPlatform[Analytics Platform<br/>20 engineers]
    
    VPSecurity --> AppSec[Application Security<br/>15 engineers]
    VPSecurity --> InfraSec[Infrastructure Security<br/>15 engineers]
    VPSecurity --> SecOps[Security Operations<br/>20 engineers]
    
    style CTO fill:#7aa2f7
    style VPPlatform fill:#bb9af7
    style VPProduct fill:#bb9af7
    style VPData fill:#7dcfff
    style VPSecurity fill:#9ece6a`;

  const salesOrg = `graph TD
    CSO[CSO<br/>Robert Thompson] --> VPEnt[VP Enterprise<br/>Jonathan Baker<br/>$50M ARR]
    CSO --> VPMid[VP Mid-Market<br/>Sophia Martinez<br/>$30M ARR]
    CSO --> VPSMB[VP SMB<br/>Daniel Lee<br/>$15M ARR]
    
    VPEnt --> NAM[North America<br/>30 AEs]
    VPEnt --> EMEA[EMEA<br/>20 AEs]
    VPEnt --> APAC[APAC<br/>10 AEs]
    VPEnt --> EntSE[Sales Engineers<br/>15 SEs]
    
    VPMid --> Tech[Technology<br/>12 AEs]
    VPMid --> FinServ[Financial Services<br/>12 AEs]
    VPMid --> Healthcare[Healthcare<br/>11 AEs]
    VPMid --> MidSE[Sales Engineers<br/>10 SEs]
    
    VPSMB --> Inside[Inside Sales<br/>20 AEs]
    
    style CSO fill:#7aa2f7
    style VPEnt fill:#bb9af7
    style VPMid fill:#7dcfff
    style VPSMB fill:#9ece6a`;

  const decisionFlow = `graph LR
    subgraph strategic [Strategic Decisions]
        CEO_Exec[CEO + Exec Team] --> Board_Review{">$5M Investment?"}
        Board_Review -->|Yes| Board_Approval[Board Approval]
        Board_Review -->|No| Execute1[Execute]
        Board_Approval --> Execute1
    end
    
    subgraph product [Product Decisions]
        CPO_Team[CPO + VP Product<br/>+ Eng Leads] --> Quarterly[Quarterly Planning]
        Quarterly --> Exec_Review[Executive Review]
        Exec_Review --> Execute2[Execute]
    end
    
    subgraph engineering [Engineering Decisions]
        CTO_VP[CTO + VP Eng] --> RFC[RFC Process]
        RFC --> Peer_Review[Peer Review]
        Peer_Review --> Execute3[Execute]
    end
    
    subgraph resources [Resource Allocation]
        CFO_Heads[CFO + Dept Heads] --> Budget[Quarterly Budget]
        Budget --> Execute4[Execute]
    end`;

  const headcountData: BarChartData[] = [
    { label: 'Engineering', value: 320 },
    { label: 'Sales', value: 120 },
    { label: 'Customer Success', value: 95 },
    { label: 'Operations', value: 85 },
    { label: 'Marketing', value: 55 },
    { label: 'Product', value: 45 },
    { label: 'HR', value: 40 },
    { label: 'Finance', value: 35 },
  ];

  const growthData: BarChartData[] = [
    { label: 'Engineering', value: 440 },
    { label: 'Sales', value: 170 },
    { label: 'Customer Success', value: 125 },
    { label: 'Operations', value: 85 },
    { label: 'Marketing', value: 75 },
    { label: 'Product', value: 60 },
    { label: 'HR', value: 40 },
    { label: 'Finance', value: 35 },
  ];

  const execSvg = await renderMermaidDiagram(executiveHierarchy, theme);
  const engSvg = await renderMermaidDiagram(engineeringOrg, theme);
  const salesSvg = await renderMermaidDiagram(salesOrg, theme);
  const decisionSvg = await renderMermaidDiagram(decisionFlow, theme);
  const currentHeadcount = renderBarChart(headcountData, theme, {
    title: 'Current Headcount by Department (850 total)',
  });
  const projectedHeadcount = renderBarChart(growthData, theme, {
    title: 'Projected 2026 Year-End Headcount (1,020 total)',
  });

  const sections: Section[] = [
    {
      id: 'overview',
      title: 'Company Overview',
      content: '<p>TechCorp Global is a SaaS company providing cloud infrastructure solutions to enterprise clients. Operating across 15 countries with 850 employees, targeting 1,020 by end of 2026.</p>',
    },
    {
      id: 'executive',
      title: 'Executive Leadership',
      content: '<p>8 C-level executives reporting to the CEO, who reports to the Board of Directors. Total leadership span: 750+ employees across all functions.</p>',
      diagram: {
        svg: execSvg.svg,
        caption: 'Executive organizational hierarchy',
      },
    },
    {
      id: 'engineering',
      title: 'Engineering Organization',
      content: '<p>320 engineers across 4 divisions: Platform (95), Product (110), Data (65), and Security (50). Each VP manages 3-4 specialized teams.</p>',
      diagram: {
        svg: engSvg.svg,
        caption: 'Engineering organization structure with team sizes',
      },
    },
    {
      id: 'sales',
      title: 'Sales Organization',
      content: '<p>120 sales representatives across 3 segments: Enterprise ($50M ARR target), Mid-Market ($30M), and SMB ($15M). Total company ARR target: $95M.</p>',
      diagram: {
        svg: salesSvg.svg,
        caption: 'Sales organization by market segment and region',
      },
    },
    {
      id: 'decisions',
      title: 'Decision-Making Framework',
      content: '<p>Clear escalation paths for strategic, product, engineering, and resource allocation decisions. Board approval required for investments exceeding $5M.</p>',
      diagram: {
        svg: decisionSvg.svg,
        caption: 'Decision-making processes and approval workflows',
      },
    },
    {
      id: 'headcount',
      title: 'Current Headcount Distribution',
      content: '<p>Engineering represents 38% of total headcount (320/850), followed by Sales (14%) and Customer Success (11%). Heavy investment in technical capabilities.</p>',
      diagram: {
        svg: currentHeadcount.svg,
        caption: 'Headcount by department - current state',
      },
    },
    {
      id: 'growth',
      title: '2026 Growth Projections',
      content: '<p>Planned hiring: +170 employees (20% growth). Engineering adds 120 (+38%), Sales adds 50 (+42%), Customer Success adds 30 (+32%). Focus on scaling revenue-generating and technical teams.</p>',
      diagram: {
        svg: projectedHeadcount.svg,
        caption: 'Projected year-end headcount with growth',
      },
    },
  ];

  const html = buildHTML({
    title: 'TechCorp Global - Organizational Structure 2026',
    subtitle: 'Leadership Hierarchy and Team Distribution',
    theme: 'tokyo_night',
    navigationStyle: 'sidebar',
    sections,
    enableThemeSwitcher: true,
  });

  return html;
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  console.log('Generating visualizations for test documents...\n');
  console.log('='.repeat(60));

  const outputDir = path.resolve(__dirname, '../../../test_outputs');

  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate all three outputs
  const html1 = await generateApiIntegration();
  const html2 = await generateProductRoadmap();
  const html3 = await generateOrgStructure();

  // Write files
  const file1 = path.join(outputDir, 'api_integration_visualization.html');
  const file2 = path.join(outputDir, 'product_roadmap_visualization.html');
  const file3 = path.join(outputDir, 'org_structure_visualization.html');

  fs.writeFileSync(file1, html1, 'utf-8');
  fs.writeFileSync(file2, html2, 'utf-8');
  fs.writeFileSync(file3, html3, 'utf-8');

  const stats1 = fs.statSync(file1);
  const stats2 = fs.statSync(file2);
  const stats3 = fs.statSync(file3);

  console.log('\n' + '='.repeat(60));
  console.log('\nAll visualizations generated successfully!\n');
  console.log(`1. API Integration:     ${(stats1.size / 1024).toFixed(1)} KB`);
  console.log(`   ${file1}`);
  console.log(`\n2. Product Roadmap:     ${(stats2.size / 1024).toFixed(1)} KB`);
  console.log(`   ${file2}`);
  console.log(`\n3. Org Structure:       ${(stats3.size / 1024).toFixed(1)} KB`);
  console.log(`   ${file3}`);
  console.log('\n' + '='.repeat(60));
}

main().catch(console.error);
