/**
 * Generate 5 High-Impact Client Examples
 * 
 * Demonstrates thought_bubble's value for professional clients using NEW layouts:
 * 
 * CLIENT 1: Startup Founders
 *   - Example 1: Series A Investor Update (Magazine layout)
 * 
 * CLIENT 2: Product Managers
 *   - Example 2: Q1 Product Roadmap (Dashboard layout)
 *   - Example 3: Architecture Decision Record (Presentation layout)
 * 
 * CLIENT 3: Management Consultants
 *   - Example 4: VC Due Diligence Memo (Sidebar layout)
 *   - Example 5: Market Entry Strategy (Magazine layout)
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
// EXAMPLE 1: Series A Investor Update (MAGAZINE LAYOUT)
// Client: Startup Founders
// Impact: Close follow-on funding with compelling visual narrative
// ============================================================================

async function generateSeriesAUpdate() {
  console.log('\n1. Generating Series A Investor Update (Magazine)...');
  const theme = getTheme('gruvbox');

  // MRR Growth (D3 Line with area)
  const mrrData: LineChartData[] = [
    { x: '2025-01', y: 45 },
    { x: '2025-02', y: 62 },
    { x: '2025-03', y: 85 },
    { x: '2025-04', y: 112 },
    { x: '2025-05', y: 148 },
    { x: '2025-06', y: 195 },
    { x: '2025-07', y: 258 },
    { x: '2025-08', y: 342 },
    { x: '2025-09', y: 425 },
    { x: '2025-10', y: 512 },
    { x: '2025-11', y: 628 },
    { x: '2025-12', y: 785 },
  ];

  // Revenue by Segment (D3 Pie)
  const segmentData: PieChartData[] = [
    { label: 'Enterprise', value: 45 },
    { label: 'Mid-Market', value: 32 },
    { label: 'SMB', value: 18 },
    { label: 'API/Platform', value: 5 },
  ];

  // Key Metrics (D3 Bar)
  const metricsData: BarChartData[] = [
    { label: 'NRR', value: 142 },
    { label: 'Gross Margin', value: 82 },
    { label: 'CAC Payback', value: 8 },
    { label: 'LTV:CAC', value: 6 },
  ];

  // Milestone Timeline (D3 Timeline)
  const milestones: TimelineData[] = [
    { event: 'Seed Close', date: '2024-03-15', description: '$2.5M raised' },
    { event: 'Product Launch', date: '2024-06-01', description: 'Public beta' },
    { event: 'First Enterprise', date: '2024-09-20', description: '$120K ACV' },
    { event: '$500K ARR', date: '2025-04-01', description: 'Milestone hit' },
    { event: 'Series A Open', date: '2025-10-15', description: 'Targeting $15M' },
    { event: 'Series A Close', date: '2026-02-28', description: 'Target close' },
  ];

  // Competitive Position (D3 Quadrant)
  const competitive: QuadrantData[] = [
    { label: 'Us', x: 75, y: 85 },
    { label: 'Legacy Inc.', x: 30, y: 40 },
    { label: 'FastStart', x: 65, y: 55 },
    { label: 'TechGiant', x: 85, y: 35 },
    { label: 'NewCo', x: 50, y: 70 },
  ];

  const mrrSvg = renderLineChart(mrrData, theme, { title: 'Monthly Recurring Revenue ($K)', area: true });
  const segmentSvg = renderPieChart(segmentData, theme, { title: 'Revenue by Customer Segment', donut: true });
  const metricsSvg = renderBarChart(metricsData, theme, { title: 'Unit Economics Performance' });
  const milestoneSvg = renderTimelineChart(milestones, theme, { title: 'Company Milestones' });
  const competitiveSvg = renderQuadrantChart(competitive, theme, { 
    title: 'Competitive Landscape',
    quadrantLabels: ['Leaders', 'Innovators', 'Followers', 'Emerging'],
    xLabel: 'Product Completeness',
    yLabel: 'Execution Speed',
  });

  const sections: Section[] = [
    {
      id: 'traction',
      title: 'Revenue Trajectory',
      content: `<p>17x ARR growth in 12 months. December MRR of $785K represents <strong>$9.4M ARR run rate</strong>. 
      Growth accelerating with enterprise adoption - Q4 grew 53% quarter-over-quarter.</p>
      <p>Path to $25M ARR by end of 2026 with current trajectory and Series A investment.</p>`,
      diagram: { svg: mrrSvg.svg, caption: 'MRR progression showing consistent month-over-month acceleration' },
    },
    {
      id: 'segments',
      title: 'Customer Mix Evolution',
      content: `<p>Strategic shift towards Enterprise paying off. Enterprise now 45% of revenue (up from 20% in Q1). 
      Average contract value increased from $18K to $85K ARR. Mid-market remains strong growth engine.</p>`,
      diagram: { svg: segmentSvg.svg, caption: 'Revenue distribution by segment - Enterprise leading' },
    },
    {
      id: 'economics',
      title: 'Unit Economics',
      content: `<p>Best-in-class SaaS metrics. 142% net revenue retention driven by expansion revenue. 
      82% gross margin with infrastructure optimisations. CAC payback of 8 months with 6x LTV:CAC ratio.</p>`,
      diagram: { svg: metricsSvg.svg, caption: 'Key SaaS metrics (bars show performance vs. benchmark of 100)' },
    },
    {
      id: 'position',
      title: 'Competitive Moat',
      content: `<p>Only solution combining real-time collaboration with enterprise security. Technical moat: 
      proprietary sync engine 10x faster than competitors. 8 patents pending. Key wins against TechGiant at Fortune 500s.</p>`,
      diagram: { svg: competitiveSvg.svg, caption: 'Market positioning showing strong differentiation' },
    },
    {
      id: 'milestones',
      title: 'Journey to Series A',
      content: `<p>18 months from Seed to $10M ARR run rate. Every milestone hit on or ahead of schedule. 
      Series A targeting $15M at $120M pre-money to fund enterprise GTM and international expansion.</p>`,
      diagram: { svg: milestoneSvg.svg, caption: 'Key milestones achieved and upcoming' },
    },
  ];

  return buildHTML({
    title: 'Apex AI - Series A Investor Update',
    subtitle: 'Q4 2025 Performance Report',
    theme: 'gruvbox',
    navigationStyle: 'sidebar',
    layout: 'magazine',
    sections,
    enableThemeSwitcher: true,
    hero: {
      title: 'From Zero to $10M ARR in 18 Months',
      subtitle: 'Building the next-generation AI collaboration platform for enterprises',
      metric: { value: '$9.4M', label: 'Annual Recurring Revenue' },
    },
    footer: 'Confidential - Apex AI, Inc. - Investor Update January 2026',
  });
}

// ============================================================================
// EXAMPLE 2: Q1 Product Roadmap (DASHBOARD LAYOUT)
// Client: Product Managers
// Impact: Align engineering and executives on priorities
// ============================================================================

async function generateProductRoadmap() {
  console.log('\n2. Generating Q1 Product Roadmap (Dashboard)...');
  const theme = getTheme('tokyo_night');

  // Feature Gantt (D3 Gantt)
  const features: GanttChartData[] = [
    { task: 'AI Copilot v2', start: '2026-01-06', end: '2026-02-14', category: 'core', progress: 25 },
    { task: 'Enterprise SSO', start: '2026-01-13', end: '2026-02-07', category: 'enterprise', progress: 40 },
    { task: 'Mobile App Refresh', start: '2026-01-20', end: '2026-03-07', category: 'platform', progress: 10 },
    { task: 'Analytics Dashboard', start: '2026-02-03', end: '2026-03-14', category: 'core', progress: 0 },
    { task: 'API v3 Launch', start: '2026-02-17', end: '2026-03-21', category: 'platform', progress: 0 },
    { task: 'GDPR Compliance', start: '2026-01-06', end: '2026-01-31', category: 'enterprise', progress: 75 },
  ];

  // Priority Matrix (D3 Quadrant)
  const priorities: QuadrantData[] = [
    { label: 'AI Copilot v2', x: 90, y: 95 },
    { label: 'Enterprise SSO', x: 70, y: 90 },
    { label: 'Mobile Refresh', x: 85, y: 60 },
    { label: 'Analytics', x: 65, y: 75 },
    { label: 'API v3', x: 50, y: 55 },
    { label: 'GDPR', x: 40, y: 85 },
  ];

  // Team Allocation (D3 Pie)
  const allocation: PieChartData[] = [
    { label: 'AI/ML Team', value: 35 },
    { label: 'Platform', value: 25 },
    { label: 'Enterprise', value: 20 },
    { label: 'Mobile', value: 15 },
    { label: 'DevOps', value: 5 },
  ];

  // Sprint Velocity (D3 Bar)
  const velocity: BarChartData[] = [
    { label: 'Sprint 1', value: 42 },
    { label: 'Sprint 2', value: 48 },
    { label: 'Sprint 3', value: 45 },
    { label: 'Sprint 4', value: 52 },
    { label: 'Sprint 5', value: 58 },
    { label: 'Sprint 6', value: 55 },
  ];

  // Tech Debt Trend (D3 Line)
  const techDebt: LineChartData[] = [
    { x: 'Oct', y: 340 },
    { x: 'Nov', y: 315 },
    { x: 'Dec', y: 285 },
    { x: 'Jan', y: 260 },
    { x: 'Feb', y: 220 },
    { x: 'Mar', y: 180 },
  ];

  const ganttSvg = renderGanttChart(features, theme, { title: 'Q1 2026 Feature Timeline' });
  const prioritySvg = renderQuadrantChart(priorities, theme, {
    title: 'Feature Prioritisation Matrix',
    quadrantLabels: ['Must Have', 'Should Have', 'Could Have', 'Nice to Have'],
    xLabel: 'Revenue Impact',
    yLabel: 'Strategic Value',
  });
  const allocSvg = renderPieChart(allocation, theme, { title: 'Engineering Allocation', donut: true });
  const velocitySvg = renderBarChart(velocity, theme, { title: 'Sprint Velocity (Story Points)' });
  const debtSvg = renderLineChart(techDebt, theme, { title: 'Tech Debt Reduction (Hours)', area: true });

  const sections: Section[] = [
    {
      id: 'timeline',
      title: 'Feature Delivery Timeline',
      content: `<p>Six major initiatives in Q1. GDPR compliance on track for January deadline. 
      AI Copilot v2 is the flagship release - beta in February, GA in March.</p>`,
      diagram: { svg: ganttSvg.svg, caption: 'Gantt view with progress indicators' },
    },
    {
      id: 'priorities',
      title: 'Priority Matrix',
      content: `<p>Features plotted by revenue impact vs. strategic value. AI Copilot v2 and Enterprise SSO 
      are top-right quadrant priorities. Mobile refresh is high-effort but necessary for expansion.</p>`,
      diagram: { svg: prioritySvg.svg, caption: 'MoSCoW prioritisation framework' },
    },
    {
      id: 'allocation',
      title: 'Team Allocation',
      content: `<p>35% of engineering capacity dedicated to AI/ML initiatives. Enterprise features 
      getting 20% focus to support sales. DevOps maintaining platform stability with minimal allocation.</p>`,
      diagram: { svg: allocSvg.svg, caption: 'Engineering capacity by team' },
    },
    {
      id: 'velocity',
      title: 'Sprint Performance',
      content: `<p>Velocity trending up 38% since October. New estimation practices and reduced 
      meeting load contributing to gains. Target: 60 points/sprint by end of Q1.</p>`,
      diagram: { svg: velocitySvg.svg, caption: 'Story points completed per sprint' },
    },
    {
      id: 'debt',
      title: 'Tech Debt Paydown',
      content: `<p>Committed to 20% reduction in tech debt each quarter. Current burn rate on track. 
      Major wins: deprecated legacy auth system, migrated to new ORM, upgraded all dependencies.</p>`,
      diagram: { svg: debtSvg.svg, caption: 'Tech debt hours remaining (projected)' },
    },
  ];

  return buildHTML({
    title: 'Q1 2026 Product Roadmap',
    subtitle: 'Engineering & Product Alignment',
    theme: 'tokyo_night',
    navigationStyle: 'sidebar',
    layout: 'dashboard',
    sections,
    enableThemeSwitcher: true,
    footer: 'Product Team - Updated January 2026',
  });
}

// ============================================================================
// EXAMPLE 3: Architecture Decision Record (PRESENTATION LAYOUT)
// Client: Product Managers / Engineering Leads
// Impact: Get technical buy-in for major platform decisions
// ============================================================================

async function generateArchitectureDecision() {
  console.log('\n3. Generating Architecture Decision Record (Presentation)...');
  const theme = getTheme('github_dark');

  // Current vs Proposed Architecture (Mermaid)
  const currentArch = `graph TB
    subgraph current [Current: Monolith]
        App[Rails Monolith<br/>450K LOC]
        DB[(Single PostgreSQL<br/>2TB)]
        Cache[Redis Cache]
        
        App --> DB
        App --> Cache
    end
    
    style App fill:#f85149
    style DB fill:#f85149`;

  const proposedArch = `graph TB
    subgraph proposed [Proposed: Microservices]
        Gateway[API Gateway]
        
        Gateway --> Auth[Auth Service]
        Gateway --> Core[Core API]
        Gateway --> ML[ML Service]
        Gateway --> Search[Search Service]
        
        Auth --> AuthDB[(Auth DB)]
        Core --> CoreDB[(Core DB)]
        ML --> MLDB[(Vector DB)]
        Search --> Elastic[(Elasticsearch)]
    end
    
    style Gateway fill:#3fb950
    style Core fill:#3fb950
    style ML fill:#3fb950`;

  // Performance Comparison (D3 Bar)
  const perfData: BarChartData[] = [
    { label: 'Response Time', value: 340 },
    { label: 'Throughput', value: 280 },
    { label: 'Deploy Frequency', value: 520 },
    { label: 'Error Rate', value: 185 },
  ];

  // Migration Timeline (D3 Timeline)
  const migration: TimelineData[] = [
    { event: 'Phase 1: Auth', date: '2026-02-01', description: 'Extract auth service' },
    { event: 'Phase 2: Search', date: '2026-04-01', description: 'Elasticsearch migration' },
    { event: 'Phase 3: ML', date: '2026-06-01', description: 'ML pipeline extraction' },
    { event: 'Phase 4: Core', date: '2026-09-01', description: 'Core API split' },
    { event: 'Phase 5: Complete', date: '2026-12-01', description: 'Monolith retirement' },
  ];

  // Cost Projection (D3 Line)
  const costData: LineChartData[] = [
    { x: 'Q1', y: 45 },
    { x: 'Q2', y: 52 },
    { x: 'Q3', y: 48 },
    { x: 'Q4', y: 38 },
    { x: 'Q1+1', y: 32 },
    { x: 'Q2+1', y: 28 },
  ];

  // Risk Assessment (D3 Quadrant)
  const risks: QuadrantData[] = [
    { label: 'Data Migration', x: 80, y: 70 },
    { label: 'Service Discovery', x: 60, y: 45 },
    { label: 'Team Training', x: 40, y: 60 },
    { label: 'Downtime Risk', x: 75, y: 85 },
    { label: 'Cost Overrun', x: 55, y: 50 },
  ];

  const currentSvg = await renderMermaidDiagram(currentArch, theme);
  const proposedSvg = await renderMermaidDiagram(proposedArch, theme);
  const perfSvg = renderBarChart(perfData, theme, { title: 'Performance Improvement (% vs Current)' });
  const migrationSvg = renderTimelineChart(migration, theme, { title: 'Migration Phases' });
  const costSvg = renderLineChart(costData, theme, { title: 'Infrastructure Cost ($K/month)', area: true });
  const riskSvg = renderQuadrantChart(risks, theme, {
    title: 'Risk Assessment Matrix',
    quadrantLabels: ['Mitigate', 'Monitor', 'Accept', 'Avoid'],
    xLabel: 'Probability',
    yLabel: 'Impact',
  });

  const sections: Section[] = [
    {
      id: 'problem',
      title: 'The Problem',
      content: `<p>Our Rails monolith has reached its limits. <strong>450K lines of code</strong> in a single repository. 
      Deployment takes 45 minutes. A bug in billing can take down the entire platform.</p>
      <p>We're losing deals because we can't ship features fast enough.</p>`,
      diagram: { svg: currentSvg.svg, caption: 'Current architecture: single point of failure' },
    },
    {
      id: 'solution',
      title: 'Proposed Solution',
      content: `<p>Migrate to a microservices architecture. Domain-driven boundaries. Independent deployments. 
      Team autonomy. Start with Auth and Search - lowest risk, highest learning.</p>`,
      diagram: { svg: proposedSvg.svg, caption: 'Target state: distributed, resilient, scalable' },
    },
    {
      id: 'benefits',
      title: 'Expected Benefits',
      content: `<p>Based on our proof-of-concept with the notification service: 3.4x faster response times, 
      2.8x higher throughput, 5x more frequent deployments, 45% lower error rates.</p>`,
      diagram: { svg: perfSvg.svg, caption: 'Projected improvements based on pilot data' },
    },
    {
      id: 'timeline',
      title: 'Migration Plan',
      content: `<p>12-month incremental migration. No big bang. Each phase delivers standalone value. 
      Monolith continues serving traffic until each service proves stable.</p>`,
      diagram: { svg: migrationSvg.svg, caption: 'Strangler fig pattern - gradual extraction' },
    },
    {
      id: 'cost',
      title: 'Cost Analysis',
      content: `<p>Short-term cost increase during migration (dual infrastructure). Long-term savings of 38% 
      from right-sizing services. ROI positive by Q4 2026.</p>`,
      diagram: { svg: costSvg.svg, caption: 'Infrastructure cost projection' },
    },
    {
      id: 'risks',
      title: 'Risk Mitigation',
      content: `<p>Downtime risk is highest concern - mitigating with blue-green deployments and feature flags. 
      Data migration handled with CDC (Change Data Capture). Team training starting immediately.</p>`,
      diagram: { svg: riskSvg.svg, caption: 'Risk probability vs impact' },
    },
  ];

  return buildHTML({
    title: 'ADR-042: Microservices Migration',
    subtitle: 'Architecture Decision Record',
    theme: 'github_dark',
    navigationStyle: 'sidebar',
    layout: 'presentation',
    sections,
    enableThemeSwitcher: true,
    footer: 'Platform Architecture Team - Decision Required by Feb 1, 2026',
  });
}

// ============================================================================
// EXAMPLE 4: VC Due Diligence Memo (SIDEBAR LAYOUT)
// Client: Management Consultants / VC Partners
// Impact: Make informed investment decisions
// ============================================================================

async function generateVCDueDiligence() {
  console.log('\n4. Generating VC Due Diligence Memo (Sidebar)...');
  const theme = getTheme('solarized_dark');

  // Market Size (D3 Bar)
  const marketSize: BarChartData[] = [
    { label: 'TAM 2025', value: 48 },
    { label: 'TAM 2028', value: 125 },
    { label: 'SAM 2025', value: 12 },
    { label: 'SAM 2028', value: 38 },
    { label: 'SOM Current', value: 0.8 },
    { label: 'SOM Target', value: 4.5 },
  ];

  // Competitive Landscape (D3 Quadrant)
  const competitive: QuadrantData[] = [
    { label: 'Target', x: 70, y: 82 },
    { label: 'Incumbent A', x: 85, y: 45 },
    { label: 'Incumbent B', x: 75, y: 38 },
    { label: 'Startup X', x: 55, y: 75 },
    { label: 'Startup Y', x: 45, y: 68 },
  ];

  // Revenue Projection (D3 Line)
  const projection: LineChartData[] = [
    { x: '2024A', y: 2.4 },
    { x: '2025A', y: 8.2 },
    { x: '2026E', y: 22 },
    { x: '2027E', y: 48 },
    { x: '2028E', y: 85 },
  ];

  // Investment Returns (D3 Bar)
  const returns: BarChartData[] = [
    { label: 'Base Case', value: 4.2 },
    { label: 'Bull Case', value: 8.5 },
    { label: 'Bear Case', value: 1.8 },
  ];

  // Cap Table (D3 Pie)
  const capTable: PieChartData[] = [
    { label: 'Founders', value: 45 },
    { label: 'Seed Investors', value: 18 },
    { label: 'Series A (Proposed)', value: 22 },
    { label: 'ESOP', value: 15 },
  ];

  // Deal Timeline (D3 Gantt)
  const timeline: GanttChartData[] = [
    { task: 'Due Diligence', start: '2026-01-15', end: '2026-02-28', category: 'process' },
    { task: 'Term Sheet', start: '2026-02-15', end: '2026-03-01', category: 'legal' },
    { task: 'Legal Documentation', start: '2026-03-01', end: '2026-03-31', category: 'legal' },
    { task: 'Close', start: '2026-04-01', end: '2026-04-15', category: 'milestone' },
  ];

  const marketSvg = renderBarChart(marketSize, theme, { title: 'Market Sizing ($B)' });
  const competitiveSvg = renderQuadrantChart(competitive, theme, {
    title: 'Competitive Position',
    quadrantLabels: ['Leaders', 'Visionaries', 'Challengers', 'Niche'],
    xLabel: 'Market Presence',
    yLabel: 'Innovation Score',
  });
  const projectionSvg = renderLineChart(projection, theme, { title: 'Revenue Projection ($M)', area: true });
  const returnsSvg = renderBarChart(returns, theme, { title: 'Return Multiple (5yr)' });
  const capSvg = renderPieChart(capTable, theme, { title: 'Post-Money Cap Table' });
  const timelineSvg = renderGanttChart(timeline, theme, { title: 'Investment Timeline' });

  const sections: Section[] = [
    {
      id: 'summary',
      title: 'Investment Thesis',
      content: `<div style="background: var(--surface); padding: 20px; border-radius: 8px; border-left: 4px solid var(--accent);">
        <p><strong>Recommendation: INVEST</strong></p>
        <p>$15M Series A at $60M pre-money valuation. Target is building category-defining AI infrastructure 
        with strong technical moat, exceptional team, and clear path to $100M ARR.</p>
      </div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 20px;">
        <div style="background: var(--surface); padding: 16px; border-radius: 8px; text-align: center;">
          <div style="font-size: 1.5rem; font-weight: 600; color: var(--accent);">$8.2M</div>
          <div style="font-size: 0.85rem; color: var(--text-secondary);">2025 Revenue</div>
        </div>
        <div style="background: var(--surface); padding: 16px; border-radius: 8px; text-align: center;">
          <div style="font-size: 1.5rem; font-weight: 600; color: var(--accent);">142%</div>
          <div style="font-size: 0.85rem; color: var(--text-secondary);">Net Revenue Retention</div>
        </div>
        <div style="background: var(--surface); padding: 16px; border-radius: 8px; text-align: center;">
          <div style="font-size: 1.5rem; font-weight: 600; color: var(--accent);">4.2x</div>
          <div style="font-size: 0.85rem; color: var(--text-secondary);">Base Case Return</div>
        </div>
      </div>`,
    },
    {
      id: 'market',
      title: 'Market Opportunity',
      content: `<p>AI infrastructure market growing at 45% CAGR. TAM expanding from $48B to $125B by 2028. 
      Target's addressable market (SAM) is enterprise AI tooling - $12B today, $38B by 2028.</p>
      <p>Current market share of 0.8% with clear path to 4.5% via enterprise expansion.</p>`,
      diagram: { svg: marketSvg.svg, caption: 'TAM/SAM/SOM analysis showing expansion opportunity' },
    },
    {
      id: 'competitive',
      title: 'Competitive Analysis',
      content: `<p>Target positioned as innovation leader in uncrowded quadrant. Incumbents (A, B) have 
      market presence but lack modern architecture. Competing startups (X, Y) have funding but less traction.</p>
      <p><strong>Key differentiator:</strong> Only solution with sub-100ms inference at enterprise scale.</p>`,
      diagram: { svg: competitiveSvg.svg, caption: 'Gartner-style positioning matrix' },
    },
    {
      id: 'financials',
      title: 'Financial Projections',
      content: `<p>Conservative projections show 10x growth over 4 years. Base case assumes 65% YoY growth 
      (vs. 240% current). Path to profitability in 2028 without additional capital.</p>`,
      diagram: { svg: projectionSvg.svg, caption: 'Revenue trajectory (A=Actual, E=Estimate)' },
    },
    {
      id: 'returns',
      title: 'Return Analysis',
      content: `<p>Base case: 4.2x return ($63M) in 5 years. Bull case: 8.5x ($127M) if AI adoption accelerates. 
      Bear case: 1.8x ($27M) in down market with slower growth.</p>
      <p>IRR range: 15% (bear) to 52% (bull), with base case at 33%.</p>`,
      diagram: { svg: returnsSvg.svg, caption: 'Return multiple scenarios' },
    },
    {
      id: 'captable',
      title: 'Ownership Structure',
      content: `<p>Post-money cap table shows healthy founder ownership (45%) with aligned incentives. 
      Series A investors would own 22%. ESOP pool expanded to 15% to support hiring plan.</p>`,
      diagram: { svg: capSvg.svg, caption: 'Pro-forma cap table post-Series A' },
    },
    {
      id: 'timeline',
      title: 'Deal Timeline',
      content: `<p>Targeting April close. Due diligence in progress - no red flags identified. Term sheet 
      expected mid-February. Standard 45-day legal process.</p>`,
      diagram: { svg: timelineSvg.svg, caption: 'Path to close' },
    },
  ];

  return buildHTML({
    title: 'Investment Memo: Nexus AI Series A',
    subtitle: 'Due Diligence Summary',
    theme: 'solarized_dark',
    navigationStyle: 'sidebar',
    layout: 'sidebar',
    sections,
    enableThemeSwitcher: true,
    footer: 'Prepared by Sequoia Capital - Confidential - January 2026',
  });
}

// ============================================================================
// EXAMPLE 5: Market Entry Strategy (MAGAZINE LAYOUT)
// Client: Management Consultants
// Impact: Win client approval for strategic recommendations
// ============================================================================

async function generateMarketStrategy() {
  console.log('\n5. Generating Market Entry Strategy (Magazine)...');
  const theme = getTheme('professional');

  // Market Opportunity (D3 Bar)
  const opportunity: BarChartData[] = [
    { label: 'Germany', value: 8.4 },
    { label: 'France', value: 6.2 },
    { label: 'UK', value: 5.8 },
    { label: 'Nordics', value: 3.1 },
    { label: 'Benelux', value: 2.4 },
  ];

  // Entry Mode Analysis (D3 Quadrant)
  const entryMode: QuadrantData[] = [
    { label: 'Direct Sales', x: 85, y: 75 },
    { label: 'Partnership', x: 55, y: 85 },
    { label: 'Acquisition', x: 80, y: 45 },
    { label: 'Franchise', x: 35, y: 55 },
    { label: 'JV', x: 65, y: 65 },
  ];

  // Revenue Projection (D3 Line)
  const revenueProj: LineChartData[] = [
    { x: 'Y1', y: 2.5 },
    { x: 'Y2', y: 8.2 },
    { x: 'Y3', y: 18.5 },
    { x: 'Y4', y: 32.0 },
    { x: 'Y5', y: 48.0 },
  ];

  // Customer Segments (D3 Pie)
  const segments: PieChartData[] = [
    { label: 'Enterprise', value: 40 },
    { label: 'Mid-Market', value: 35 },
    { label: 'SMB', value: 20 },
    { label: 'Government', value: 5 },
  ];

  // Implementation Timeline (D3 Gantt)
  const implementation: GanttChartData[] = [
    { task: 'Market Research', start: '2026-01-01', end: '2026-03-31', category: 'planning', progress: 80 },
    { task: 'Legal Entity Setup', start: '2026-02-01', end: '2026-04-30', category: 'legal', progress: 20 },
    { task: 'Hire Country Manager', start: '2026-03-01', end: '2026-05-31', category: 'people', progress: 0 },
    { task: 'Partner Negotiations', start: '2026-04-01', end: '2026-07-31', category: 'partnerships', progress: 0 },
    { task: 'Product Localisation', start: '2026-05-01', end: '2026-08-31', category: 'product', progress: 0 },
    { task: 'GTM Launch', start: '2026-09-01', end: '2026-10-31', category: 'launch', progress: 0 },
  ];

  // Investment Required (D3 Bar)
  const investment: BarChartData[] = [
    { label: 'People', value: 4.2 },
    { label: 'Marketing', value: 2.8 },
    { label: 'Legal/Compliance', value: 1.5 },
    { label: 'Technology', value: 1.2 },
    { label: 'Operations', value: 0.8 },
  ];

  const opportunitySvg = renderBarChart(opportunity, theme, { title: 'Market Size by Country (€B)' });
  const entryModeSvg = renderQuadrantChart(entryMode, theme, {
    title: 'Entry Mode Evaluation',
    quadrantLabels: ['Preferred', 'Consider', 'Avoid', 'Not Viable'],
    xLabel: 'Control Level',
    yLabel: 'Speed to Market',
  });
  const revenueSvg = renderLineChart(revenueProj, theme, { title: 'Projected European Revenue (€M)', area: true });
  const segmentSvg = renderPieChart(segments, theme, { title: 'Target Customer Mix' });
  const implementSvg = renderGanttChart(implementation, theme, { title: 'Implementation Roadmap' });
  const investmentSvg = renderBarChart(investment, theme, { title: 'Investment Required (€M)' });

  const sections: Section[] = [
    {
      id: 'opportunity',
      title: 'The Opportunity',
      content: `<p>European market represents €26B opportunity with 18% CAGR. Germany alone is €8.4B - 
      larger than current US addressable market. Competitive landscape is fragmented with no clear leader.</p>
      <p><strong>First-mover advantage available in key verticals.</strong></p>`,
      diagram: { svg: opportunitySvg.svg, caption: 'Market size by country - Germany priority market' },
    },
    {
      id: 'segments',
      title: 'Target Segments',
      content: `<p>Enterprise segment offers highest ACV (€150K average) with longest sales cycles. 
      Mid-market provides volume and faster conversion. Government procurement requires local entity.</p>`,
      diagram: { svg: segmentSvg.svg, caption: 'Recommended customer mix for Year 1-3' },
    },
    {
      id: 'entry',
      title: 'Recommended Entry Mode',
      content: `<p>Analysis recommends <strong>Direct Sales + Strategic Partnership</strong> hybrid model. 
      Direct sales for enterprise control, partnerships for mid-market scale and local expertise.</p>
      <p>Acquisition considered but valuations too high (8-12x revenue for targets).</p>`,
      diagram: { svg: entryModeSvg.svg, caption: 'Entry mode analysis - speed vs control trade-off' },
    },
    {
      id: 'financials',
      title: 'Financial Projection',
      content: `<p>Conservative 5-year projection shows €48M revenue by Year 5. Breakeven in Year 3. 
      Assumes 25% market penetration in target segments. Gross margin consistent with US operations (78%).</p>`,
      diagram: { svg: revenueSvg.svg, caption: 'Revenue build showing path to profitability' },
    },
    {
      id: 'investment',
      title: 'Investment Requirements',
      content: `<p>Total investment: €10.5M over 18 months. Primary spend on people (€4.2M) including 
      Country Manager, 8 sales reps, and customer success. Marketing investment front-loaded for awareness.</p>`,
      diagram: { svg: investmentSvg.svg, caption: 'Investment allocation by category' },
    },
    {
      id: 'roadmap',
      title: 'Implementation Plan',
      content: `<p>9-month preparation phase followed by Q4 2026 launch. Critical path: Country Manager 
      hire (by May) and partner agreements (by July). Product localisation can run in parallel.</p>`,
      diagram: { svg: implementSvg.svg, caption: 'Phase-gated implementation with milestones' },
    },
  ];

  return buildHTML({
    title: 'European Market Entry Strategy',
    subtitle: 'Strategic Recommendations for Continental Expansion',
    theme: 'professional',
    navigationStyle: 'sidebar',
    layout: 'magazine',
    sections,
    enableThemeSwitcher: true,
    hero: {
      title: 'Capturing the €26B European Opportunity',
      subtitle: 'A phased approach to continental expansion with Germany as the beachhead market',
      metric: { value: '€48M', label: 'Year 5 Revenue Target' },
    },
    footer: 'Prepared by McKinsey & Company - Confidential - January 2026',
  });
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  console.log('='.repeat(70));
  console.log('Generating 5 High-Impact Client Examples');
  console.log('Using NEW layout templates: Magazine, Dashboard, Presentation');
  console.log('='.repeat(70));

  const outputDir = path.resolve(__dirname, '../../../examples');

  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate all five examples
  const html1 = await generateSeriesAUpdate();
  const html2 = await generateProductRoadmap();
  const html3 = await generateArchitectureDecision();
  const html4 = await generateVCDueDiligence();
  const html5 = await generateMarketStrategy();

  // Write files
  const files = [
    { name: 'client_series_a_update.html', content: html1 },
    { name: 'client_product_roadmap.html', content: html2 },
    { name: 'client_architecture_decision.html', content: html3 },
    { name: 'client_vc_due_diligence.html', content: html4 },
    { name: 'client_market_strategy.html', content: html5 },
  ];

  console.log('\n' + '='.repeat(70));
  console.log('Writing files...\n');

  for (const file of files) {
    const filePath = path.join(outputDir, file.name);
    fs.writeFileSync(filePath, file.content, 'utf-8');
    const stats = fs.statSync(filePath);
    console.log(`✓ ${file.name.padEnd(40)} ${(stats.size / 1024).toFixed(1)} KB`);
  }

  console.log(`\nOutput directory: ${outputDir}`);
  console.log('\n' + '='.repeat(70));
  console.log('CLIENT EXAMPLES SUMMARY');
  console.log('='.repeat(70));
  console.log(`
┌─────────────────────┬────────────────────────────────┬─────────────┐
│ Client              │ Example                        │ Layout      │
├─────────────────────┼────────────────────────────────┼─────────────┤
│ Startup Founders    │ Series A Investor Update       │ Magazine    │
│ Product Managers    │ Q1 Product Roadmap             │ Dashboard   │
│ Product Managers    │ Architecture Decision Record   │ Presentation│
│ VC Partners         │ Due Diligence Memo             │ Sidebar     │
│ Consultants         │ Market Entry Strategy          │ Magazine    │
└─────────────────────┴────────────────────────────────┴─────────────┘
`);
  console.log('D3 Charts Used:');
  console.log('  - Bar Charts (metrics, comparisons, market sizing)');
  console.log('  - Line Charts (growth trends, projections)');
  console.log('  - Pie/Donut Charts (segments, allocation)');
  console.log('  - Gantt Charts (timelines, roadmaps)');
  console.log('  - Timeline Charts (milestones, events)');
  console.log('  - Quadrant Charts (competitive analysis, prioritisation)');
  console.log('\n' + '='.repeat(70));
}

main().catch(console.error);
