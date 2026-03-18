/**
 * Design System Showcase
 * 
 * Comprehensive examples pushing every capability of thought_bubble:
 * - All 5 layout templates
 * - All D3 chart types with advanced styling
 * - Theme-specific typography
 * - Professional use cases that demonstrate real value
 * 
 * Examples:
 * 1. State of AI 2026 Report (Magazine + Gruvbox)
 * 2. SaaS Metrics Command Centre (Dashboard + Tokyo Night)
 * 3. The Art of Data Storytelling (Presentation + Dracula)
 * 4. Climate Tech Investment Thesis (Magazine + Solarized Dark)
 * 5. Engineering Excellence Report (Dashboard + GitHub Dark)
 * 6. Startup Ecosystem Analysis (Sidebar + Creative)
 * 7. Personal Finance Tracker (Minimal + Professional)
 * 8. Product Launch War Room (Presentation + GitHub Light)
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
// EXAMPLE 1: State of AI 2026 Report
// Layout: Magazine | Theme: Gruvbox
// Showcases: Hero metrics, Line charts, Bar charts, Pie charts, Quadrant
// ============================================================================

async function generateStateOfAI() {
  console.log('\n📊 1. Generating State of AI 2026 Report (Magazine)...');
  const theme = getTheme('gruvbox');

  // AI Investment Trend (D3 Line)
  const investmentTrend: LineChartData[] = [
    { x: '2020', y: 36 },
    { x: '2021', y: 52 },
    { x: '2022', y: 48 },
    { x: '2023', y: 67 },
    { x: '2024', y: 96 },
    { x: '2025', y: 142 },
    { x: '2026', y: 215 },
  ];

  // AI Adoption by Industry (D3 Bar)
  const industryAdoption: BarChartData[] = [
    { label: 'Financial Services', value: 78 },
    { label: 'Healthcare', value: 72 },
    { label: 'Technology', value: 89 },
    { label: 'Retail', value: 64 },
    { label: 'Manufacturing', value: 58 },
    { label: 'Education', value: 45 },
  ];

  // AI Use Cases (D3 Pie)
  const useCases: PieChartData[] = [
    { label: 'Code Generation', value: 28 },
    { label: 'Customer Service', value: 22 },
    { label: 'Data Analysis', value: 18 },
    { label: 'Content Creation', value: 15 },
    { label: 'Process Automation', value: 12 },
    { label: 'Other', value: 5 },
  ];

  // AI Model Landscape (D3 Quadrant)
  const modelLandscape: QuadrantData[] = [
    { label: 'GPT-5', x: 92, y: 88 },
    { label: 'Claude 4', x: 88, y: 92 },
    { label: 'Gemini Ultra', x: 85, y: 78 },
    { label: 'Llama 4', x: 70, y: 82 },
    { label: 'Mistral Large', x: 65, y: 75 },
    { label: 'Grok 3', x: 72, y: 68 },
    { label: 'Open Source', x: 55, y: 85 },
  ];

  // Key Milestones (D3 Timeline)
  const milestones: TimelineData[] = [
    { event: 'GPT-4 Turbo', date: '2023-11-06', description: '128K context window' },
    { event: 'Gemini Launch', date: '2023-12-06', description: 'Multimodal from day one' },
    { event: 'Claude 3 Opus', date: '2024-03-04', description: 'New benchmark leader' },
    { event: 'GPT-4o', date: '2024-05-13', description: 'Omni-modal capabilities' },
    { event: 'Claude 3.5 Sonnet', date: '2024-06-20', description: 'Speed + capability' },
    { event: 'o1 Reasoning', date: '2024-09-12', description: 'Chain of thought' },
    { event: 'Agents Era', date: '2025-06-01', description: 'Autonomous AI systems' },
  ];

  // Compute Scaling (D3 Line - Area)
  const computeScaling: LineChartData[] = [
    { x: 'GPT-2', y: 1.5 },
    { x: 'GPT-3', y: 175 },
    { x: 'PaLM', y: 540 },
    { x: 'GPT-4', y: 1800 },
    { x: 'Gemini', y: 3200 },
    { x: 'GPT-5', y: 8500 },
  ];

  const investmentSvg = renderLineChart(investmentTrend, theme, { title: 'Global AI Investment ($B)', area: true });
  const industrySvg = renderBarChart(industryAdoption, theme, { title: 'AI Adoption by Industry (%)' });
  const useCasesSvg = renderPieChart(useCases, theme, { title: 'Top AI Use Cases 2026', donut: true });
  const landscapeSvg = renderQuadrantChart(modelLandscape, theme, {
    title: 'Foundation Model Landscape',
    quadrantLabels: ['Leaders', 'Challengers', 'Specialists', 'Emerging'],
    xLabel: 'Capability',
    yLabel: 'Accessibility',
  });
  const milestoneSvg = renderTimelineChart(milestones, theme, { title: 'AI Evolution Timeline' });
  const computeSvg = renderLineChart(computeScaling, theme, { title: 'Model Parameter Growth (Billions)', area: true });

  const sections: Section[] = [
    {
      id: 'investment',
      title: 'Investment Surge Continues',
      content: `<p>Global AI investment reached <strong>$215 billion</strong> in 2026, a 51% increase from 2025. 
      The majority flows into foundation models, AI infrastructure, and enterprise applications.</p>
      <p>Notable trend: Sovereign AI initiatives now account for 18% of investment, as nations race to develop 
      domestic capabilities.</p>`,
      diagram: { svg: investmentSvg.svg, caption: 'Seven-year investment trajectory showing exponential growth' },
    },
    {
      id: 'adoption',
      title: 'Enterprise Adoption Accelerates',
      content: `<p>Technology sector leads with 89% adoption, but healthcare (+24% YoY) and manufacturing (+31% YoY) 
      show the fastest growth. The "AI-native" generation of enterprises is emerging.</p>`,
      diagram: { svg: industrySvg.svg, caption: 'Percentage of enterprises with production AI deployments' },
    },
    {
      id: 'usecases',
      title: 'Code Generation Dominates',
      content: `<p>28% of all AI usage is now code generation—up from 12% in 2024. Developer productivity tools 
      have become the gateway drug for enterprise AI adoption. Customer service AI handles 40% of support 
      interactions globally.</p>`,
      diagram: { svg: useCasesSvg.svg, caption: 'Distribution of AI applications across use cases' },
    },
    {
      id: 'landscape',
      title: 'Foundation Model Wars',
      content: `<p>The foundation model landscape has consolidated around four major players, with open-source 
      alternatives rapidly closing the gap. Claude 4 and GPT-5 trade benchmark leadership monthly. 
      The real battleground has shifted to agents and tool use.</p>`,
      diagram: { svg: landscapeSvg.svg, caption: 'Model positioning by capability vs accessibility' },
    },
    {
      id: 'timeline',
      title: 'The Road to AGI',
      content: `<p>The pace of breakthroughs continues to accelerate. Each milestone unlocks new capabilities 
      that were considered impossible months earlier. The consensus view: AGI arrives between 2027-2030.</p>`,
      diagram: { svg: milestoneSvg.svg, caption: 'Key moments in AI evolution' },
    },
    {
      id: 'compute',
      title: 'Scaling Laws Hold',
      content: `<p>Despite predictions of diminishing returns, scaling laws continue to deliver. GPT-5's rumoured 
      8.5 trillion parameters (unconfirmed) pushed boundaries further. The constraint isn't algorithms—it's 
      electricity and chips.</p>`,
      diagram: { svg: computeSvg.svg, caption: 'Parameter count growth across model generations' },
    },
  ];

  return buildHTML({
    title: 'State of AI 2026',
    subtitle: 'Annual Industry Report',
    theme: 'gruvbox',
    navigationStyle: 'sidebar',
    layout: 'magazine',
    sections,
    enableThemeSwitcher: true,
    hero: {
      title: 'The Year AI Became Infrastructure',
      subtitle: 'From novelty to necessity: how artificial intelligence became as essential as electricity',
      metric: { value: '$215B', label: 'Global AI Investment' },
    },
    footer: 'State of AI Report 2026 • Thought Bubble Research',
  });
}

// ============================================================================
// EXAMPLE 2: SaaS Metrics Command Centre
// Layout: Dashboard | Theme: Tokyo Night
// Showcases: Metric cards, Multi-chart grid, Real-time feel
// ============================================================================

async function generateSaaSMetrics() {
  console.log('\n📈 2. Generating SaaS Metrics Command Centre (Dashboard)...');
  const theme = getTheme('tokyo_night');

  // MRR Trend (D3 Line)
  const mrrTrend: LineChartData[] = [
    { x: 'Jan', y: 285 },
    { x: 'Feb', y: 312 },
    { x: 'Mar', y: 348 },
    { x: 'Apr', y: 392 },
    { x: 'May', y: 425 },
    { x: 'Jun', y: 468 },
    { x: 'Jul', y: 512 },
    { x: 'Aug', y: 558 },
    { x: 'Sep', y: 612 },
    { x: 'Oct', y: 678 },
    { x: 'Nov', y: 745 },
    { x: 'Dec', y: 824 },
  ];

  // Cohort Retention (D3 Bar)
  const cohortRetention: BarChartData[] = [
    { label: 'Month 1', value: 100 },
    { label: 'Month 3', value: 82 },
    { label: 'Month 6', value: 68 },
    { label: 'Month 9', value: 61 },
    { label: 'Month 12', value: 56 },
    { label: 'Month 18', value: 52 },
    { label: 'Month 24', value: 48 },
  ];

  // Revenue by Plan (D3 Pie)
  const revenuePlan: PieChartData[] = [
    { label: 'Enterprise', value: 45 },
    { label: 'Business', value: 32 },
    { label: 'Pro', value: 18 },
    { label: 'Starter', value: 5 },
  ];

  // Customer Health (D3 Quadrant)
  const customerHealth: QuadrantData[] = [
    { label: 'Acme Corp', x: 85, y: 90 },
    { label: 'TechStart', x: 70, y: 85 },
    { label: 'BigRetail', x: 90, y: 65 },
    { label: 'FinanceHub', x: 40, y: 80 },
    { label: 'EduLearn', x: 60, y: 45 },
    { label: 'HealthCo', x: 75, y: 75 },
    { label: 'MediaGroup', x: 55, y: 60 },
    { label: 'LogiTech', x: 85, y: 85 },
  ];

  // Expansion/Churn (D3 Bar - showing both)
  const revenueMovement: BarChartData[] = [
    { label: 'New MRR', value: 124 },
    { label: 'Expansion', value: 86 },
    { label: 'Reactivation', value: 12 },
    { label: 'Contraction', value: -28 },
    { label: 'Churn', value: -45 },
  ];

  // Active Users (D3 Line)
  const activeUsers: LineChartData[] = [
    { x: 'W1', y: 12400 },
    { x: 'W2', y: 13200 },
    { x: 'W3', y: 14100 },
    { x: 'W4', y: 15800 },
    { x: 'W5', y: 16200 },
    { x: 'W6', y: 17500 },
    { x: 'W7', y: 18900 },
    { x: 'W8', y: 19600 },
  ];

  const mrrSvg = renderLineChart(mrrTrend, theme, { title: 'Monthly Recurring Revenue ($K)', area: true });
  const cohortSvg = renderBarChart(cohortRetention, theme, { title: 'Cohort Retention (%)' });
  const planSvg = renderPieChart(revenuePlan, theme, { title: 'Revenue by Plan', donut: true });
  const healthSvg = renderQuadrantChart(customerHealth, theme, {
    title: 'Customer Health Matrix',
    quadrantLabels: ['Champions', 'Growth', 'At Risk', 'Churn Risk'],
    xLabel: 'Engagement',
    yLabel: 'Satisfaction',
  });
  const movementSvg = renderBarChart(revenueMovement, theme, { title: 'MRR Movement ($K)' });
  const usersSvg = renderLineChart(activeUsers, theme, { title: 'Weekly Active Users' });

  const sections: Section[] = [
    {
      id: 'mrr',
      title: 'MRR Growth',
      content: `<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
        <div style="background: linear-gradient(135deg, var(--scale-1), var(--scale-2)); padding: 20px; border-radius: 12px; text-align: center;">
          <div style="font-size: 2rem; font-weight: 700; color: var(--fg);">$824K</div>
          <div style="font-size: 0.85rem; color: var(--text-secondary);">Current MRR</div>
          <div style="font-size: 0.8rem; color: var(--success);">↑ 10.6% MoM</div>
        </div>
        <div style="background: linear-gradient(135deg, var(--scale-2), var(--scale-3)); padding: 20px; border-radius: 12px; text-align: center;">
          <div style="font-size: 2rem; font-weight: 700; color: var(--fg);">$9.9M</div>
          <div style="font-size: 0.85rem; color: var(--text-secondary);">ARR</div>
          <div style="font-size: 0.8rem; color: var(--success);">↑ 189% YoY</div>
        </div>
        <div style="background: linear-gradient(135deg, var(--scale-3), var(--scale-4)); padding: 20px; border-radius: 12px; text-align: center;">
          <div style="font-size: 2rem; font-weight: 700; color: var(--fg);">142%</div>
          <div style="font-size: 0.85rem; color: var(--text-secondary);">Net Revenue Retention</div>
          <div style="font-size: 0.8rem; color: var(--success);">↑ 8pts YoY</div>
        </div>
        <div style="background: linear-gradient(135deg, var(--scale-4), var(--scale-5)); padding: 20px; border-radius: 12px; text-align: center;">
          <div style="font-size: 2rem; font-weight: 700; color: var(--fg);">2.1%</div>
          <div style="font-size: 0.85rem; color: var(--text-secondary);">Logo Churn</div>
          <div style="font-size: 0.8rem; color: var(--success);">↓ 0.4pts MoM</div>
        </div>
      </div>`,
      diagram: { svg: mrrSvg.svg, caption: '12-month MRR trajectory showing consistent growth' },
    },
    {
      id: 'retention',
      title: 'Cohort Analysis',
      content: `<p>Strong retention with 48% of customers retained at 24 months. The "aha moment" optimisation 
      in Q2 improved 90-day retention by 6 percentage points. Focus for Q1: reduce month 6 drop-off.</p>`,
      diagram: { svg: cohortSvg.svg, caption: 'Average retention by cohort age' },
    },
    {
      id: 'segments',
      title: 'Revenue Mix',
      content: `<p>Enterprise segment now 45% of revenue (up from 32% last year). Average Enterprise ACV 
      increased to $48K. Self-serve Starter tier drives 62% of new logos but only 5% of revenue.</p>`,
      diagram: { svg: planSvg.svg, caption: 'MRR distribution across pricing tiers' },
    },
    {
      id: 'movement',
      title: 'MRR Movement',
      content: `<p>Net new MRR of $149K this month. Expansion revenue ($86K) nearly equals new business ($124K)—
      a sign of healthy product-market fit. Contraction and churn offset by strong new and expansion.</p>`,
      diagram: { svg: movementSvg.svg, caption: 'Monthly MRR bridge showing all components' },
    },
    {
      id: 'health',
      title: 'Customer Health',
      content: `<p>8 key accounts plotted by engagement and satisfaction scores. Two accounts in "At Risk" 
      quadrant flagged for immediate CSM intervention. Champions driving 65% of referrals.</p>`,
      diagram: { svg: healthSvg.svg, caption: 'Top accounts by health score' },
    },
    {
      id: 'engagement',
      title: 'Product Engagement',
      content: `<p>Weekly active users up 58% over 8 weeks. New onboarding flow increased activation from 
      34% to 52%. Power user features seeing 3x adoption after launch of in-app guidance.</p>`,
      diagram: { svg: usersSvg.svg, caption: 'WAU trend showing accelerating adoption' },
    },
  ];

  return buildHTML({
    title: 'SaaS Metrics Command Centre',
    subtitle: 'Real-time Business Intelligence',
    theme: 'tokyo_night',
    navigationStyle: 'sidebar',
    layout: 'dashboard',
    sections,
    enableThemeSwitcher: true,
    footer: 'Data as of January 31, 2026 • Auto-refreshes daily',
  });
}

// ============================================================================
// EXAMPLE 3: The Art of Data Storytelling
// Layout: Presentation | Theme: Dracula
// Showcases: Full-screen slides, Teaching format, Meta demonstration
// ============================================================================

async function generateDataStorytelling() {
  console.log('\n🎨 3. Generating The Art of Data Storytelling (Presentation)...');
  const theme = getTheme('dracula');

  // Chart Type Effectiveness (D3 Bar)
  const chartEffectiveness: BarChartData[] = [
    { label: 'Bar Chart', value: 92 },
    { label: 'Line Chart', value: 88 },
    { label: 'Pie Chart', value: 65 },
    { label: 'Area Chart', value: 78 },
    { label: 'Scatter Plot', value: 71 },
    { label: 'Table', value: 45 },
  ];

  // Attention Retention (D3 Line)
  const attentionData: LineChartData[] = [
    { x: '0s', y: 100 },
    { x: '30s', y: 85 },
    { x: '60s', y: 72 },
    { x: '90s', y: 58 },
    { x: '120s', y: 45 },
    { x: '150s', y: 38 },
    { x: '180s', y: 32 },
  ];

  // Cognitive Load (D3 Pie)
  const cognitiveLoad: PieChartData[] = [
    { label: 'Visual Processing', value: 45 },
    { label: 'Reading Text', value: 30 },
    { label: 'Making Comparisons', value: 15 },
    { label: 'Finding Patterns', value: 10 },
  ];

  // Design Principles (D3 Quadrant)
  const designPrinciples: QuadrantData[] = [
    { label: 'Simplify', x: 90, y: 85 },
    { label: 'Highlight', x: 85, y: 75 },
    { label: 'Annotate', x: 75, y: 80 },
    { label: 'Compare', x: 70, y: 65 },
    { label: 'Animate', x: 55, y: 50 },
    { label: 'Decorate', x: 30, y: 25 },
  ];

  // Evolution of Viz (D3 Timeline)
  const vizHistory: TimelineData[] = [
    { event: 'Playfair Charts', date: '1786-01-01', description: 'First bar and line charts' },
    { event: 'Florence Nightingale', date: '1858-01-01', description: 'Polar area diagrams' },
    { event: 'Edward Tufte', date: '1983-01-01', description: 'Data-ink ratio concept' },
    { event: 'D3.js Released', date: '2011-02-18', description: 'Web visualisation revolution' },
    { event: 'Observable', date: '2018-01-01', description: 'Notebooks for data' },
    { event: 'AI-Assisted Viz', date: '2024-01-01', description: 'Automated insights' },
  ];

  const effectivenessSvg = renderBarChart(chartEffectiveness, theme, { title: 'Chart Comprehension Score (%)' });
  const attentionSvg = renderLineChart(attentionData, theme, { title: 'Audience Attention Over Time', area: true });
  const cognitiveSvg = renderPieChart(cognitiveLoad, theme, { title: 'Where Cognitive Effort Goes', donut: true });
  const principlesSvg = renderQuadrantChart(designPrinciples, theme, {
    title: 'Design Technique Effectiveness',
    quadrantLabels: ['Essential', 'Useful', 'Situational', 'Avoid'],
    xLabel: 'Clarity Impact',
    yLabel: 'Memorability',
  });
  const historySvg = renderTimelineChart(vizHistory, theme, { title: '240 Years of Data Visualisation' });

  const sections: Section[] = [
    {
      id: 'intro',
      title: 'Why Data Storytelling Matters',
      content: `<div style="font-size: 1.4rem; line-height: 1.8; max-width: 800px; margin: 0 auto;">
        <p style="margin-bottom: 2rem;"><em>"The greatest value of a picture is when it forces us to notice 
        what we never expected to see."</em></p>
        <p style="text-align: right;">— John Tukey, Exploratory Data Analysis</p>
      </div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 48px;">
        <div style="text-align: center; padding: 24px;">
          <div style="font-size: 3rem; font-weight: 700; color: var(--accent);">65%</div>
          <div style="color: var(--text-secondary);">of people are visual learners</div>
        </div>
        <div style="text-align: center; padding: 24px;">
          <div style="font-size: 3rem; font-weight: 700; color: var(--accent);">400%</div>
          <div style="color: var(--text-secondary);">faster visual processing than text</div>
        </div>
        <div style="text-align: center; padding: 24px;">
          <div style="font-size: 3rem; font-weight: 700; color: var(--accent);">6x</div>
          <div style="color: var(--text-secondary);">better recall with visuals</div>
        </div>
      </div>`,
    },
    {
      id: 'choosing',
      title: 'Choosing the Right Chart',
      content: `<p style="font-size: 1.1rem; margin-bottom: 24px;">Not all charts are created equal. 
      Comprehension studies show bar charts and line charts consistently outperform other formats 
      for most data types. Pie charts? Save them for showing parts of a whole—and only a few parts.</p>`,
      diagram: { svg: effectivenessSvg.svg, caption: 'Comprehension accuracy by chart type (n=1,200 participants)' },
    },
    {
      id: 'attention',
      title: 'The Attention Economy',
      content: `<p style="font-size: 1.1rem; margin-bottom: 24px;">You have 30 seconds to make your point. 
      After that, attention decays exponentially. Design your visualisation for the first impression—
      the insight should be obvious within 5 seconds.</p>`,
      diagram: { svg: attentionSvg.svg, caption: 'Audience attention retention during presentations' },
    },
    {
      id: 'cognitive',
      title: 'Cognitive Load Theory',
      content: `<p style="font-size: 1.1rem; margin-bottom: 24px;">45% of cognitive effort goes to visual 
      processing. Make that effort count. Remove chartjunk, use preattentive attributes (colour, position, 
      size), and guide the eye to what matters.</p>`,
      diagram: { svg: cognitiveSvg.svg, caption: 'Distribution of cognitive effort when viewing visualisations' },
    },
    {
      id: 'principles',
      title: 'Design Principles That Work',
      content: `<p style="font-size: 1.1rem; margin-bottom: 24px;">Four techniques in the "Essential" 
      quadrant: Simplify (remove non-data-ink), Highlight (draw attention to key findings), 
      Annotate (explain in context), Compare (show relationships). Decoration? Almost never worth it.</p>`,
      diagram: { svg: principlesSvg.svg, caption: 'Effectiveness matrix for visualisation techniques' },
    },
    {
      id: 'history',
      title: 'Standing on Giants',
      content: `<p style="font-size: 1.1rem; margin-bottom: 24px;">From William Playfair's invention of 
      the bar chart in 1786 to D3.js democratising web visualisation in 2011—we've been refining 
      the art of visual communication for 240 years. AI is the next chapter.</p>`,
      diagram: { svg: historySvg.svg, caption: 'Key milestones in data visualisation history' },
    },
  ];

  return buildHTML({
    title: 'The Art of Data Storytelling',
    subtitle: 'A Visual Guide to Visual Communication',
    theme: 'dracula',
    navigationStyle: 'sidebar',
    layout: 'presentation',
    sections,
    enableThemeSwitcher: true,
    footer: 'Press ← → to navigate • Thought Bubble Workshop Series',
  });
}

// ============================================================================
// EXAMPLE 4: Climate Tech Investment Thesis
// Layout: Magazine | Theme: Solarized Dark
// Showcases: Professional VC analysis, Market sizing, Competitive landscape
// ============================================================================

async function generateClimateTech() {
  console.log('\n🌍 4. Generating Climate Tech Investment Thesis (Magazine)...');
  const theme = getTheme('solarized_dark');

  // Market Size by Sector (D3 Bar)
  const marketSize: BarChartData[] = [
    { label: 'Clean Energy', value: 1200 },
    { label: 'Electric Transport', value: 850 },
    { label: 'Green Hydrogen', value: 320 },
    { label: 'Carbon Capture', value: 180 },
    { label: 'Sustainable Food', value: 420 },
    { label: 'Circular Economy', value: 280 },
  ];

  // Investment Flow (D3 Line)
  const investmentFlow: LineChartData[] = [
    { x: '2019', y: 18 },
    { x: '2020', y: 28 },
    { x: '2021', y: 52 },
    { x: '2022', y: 70 },
    { x: '2023', y: 65 },
    { x: '2024', y: 89 },
    { x: '2025', y: 128 },
    { x: '2026', y: 165 },
  ];

  // Portfolio Allocation (D3 Pie)
  const portfolioAllocation: PieChartData[] = [
    { label: 'Series A', value: 35 },
    { label: 'Series B', value: 30 },
    { label: 'Growth', value: 20 },
    { label: 'Seed', value: 15 },
  ];

  // Sector Positioning (D3 Quadrant)
  const sectorPosition: QuadrantData[] = [
    { label: 'Solar+Storage', x: 90, y: 75 },
    { label: 'EV Charging', x: 80, y: 85 },
    { label: 'Green H2', x: 60, y: 90 },
    { label: 'DAC', x: 45, y: 95 },
    { label: 'Alt Protein', x: 70, y: 65 },
    { label: 'Fusion', x: 25, y: 98 },
    { label: 'Battery Tech', x: 85, y: 70 },
  ];

  // Key Milestones (D3 Timeline)
  const policyMilestones: TimelineData[] = [
    { event: 'Paris Agreement', date: '2015-12-12', description: '1.5°C target set' },
    { event: 'EU Green Deal', date: '2019-12-11', description: '€1T mobilised' },
    { event: 'US IRA Passed', date: '2022-08-16', description: '$369B for climate' },
    { event: 'COP28 Agreement', date: '2023-12-13', description: 'Fossil fuel transition' },
    { event: 'EU CBAM Active', date: '2026-01-01', description: 'Carbon border tax' },
    { event: 'Net Zero 2050', date: '2050-01-01', description: 'Target deadline' },
  ];

  // Fund Performance (D3 Gantt)
  const fundTimeline: GanttChartData[] = [
    { task: 'Fund I (2019)', start: '2019-06-01', end: '2024-12-31', category: 'deployed', progress: 100 },
    { task: 'Fund II (2021)', start: '2021-03-01', end: '2026-12-31', category: 'active', progress: 75 },
    { task: 'Fund III (2024)', start: '2024-01-01', end: '2029-12-31', category: 'active', progress: 30 },
    { task: 'Fund IV (2026)', start: '2026-06-01', end: '2031-12-31', category: 'raising', progress: 0 },
  ];

  const marketSvg = renderBarChart(marketSize, theme, { title: 'Market Size by Sector ($B, 2026)' });
  const flowSvg = renderLineChart(investmentFlow, theme, { title: 'Climate Tech VC Investment ($B)', area: true });
  const allocSvg = renderPieChart(portfolioAllocation, theme, { title: 'Target Portfolio Mix', donut: true });
  const positionSvg = renderQuadrantChart(sectorPosition, theme, {
    title: 'Sector Investment Attractiveness',
    quadrantLabels: ['Deploy Now', 'Watch Closely', 'Patient Capital', 'Too Early'],
    xLabel: 'Technology Readiness',
    yLabel: 'Return Potential',
  });
  const policySvg = renderTimelineChart(policyMilestones, theme, { title: 'Policy Tailwinds' });
  const fundSvg = renderGanttChart(fundTimeline, theme, { title: 'Fund Deployment Timeline' });

  const sections: Section[] = [
    {
      id: 'thesis',
      title: 'Investment Thesis',
      content: `<p>Climate tech is experiencing its defining decade. The convergence of policy support (IRA, EU Green Deal), 
      technology cost curves (solar down 90%, batteries down 85%), and corporate commitments creates a 
      <strong>$3.2 trillion annual investment opportunity</strong> by 2030.</p>
      <p>Our thesis: back founders building infrastructure for the net-zero economy. Focus on sectors where 
      the technology works, the unit economics are proven, and the bottleneck is deployment capital.</p>`,
      diagram: { svg: flowSvg.svg, caption: 'VC investment trajectory in climate tech' },
    },
    {
      id: 'market',
      title: 'Market Opportunity',
      content: `<p>Clean energy and electric transport dominate today's market. The next decade will see 
      green hydrogen, carbon capture, and circular economy solutions scale from billions to hundreds of billions.</p>`,
      diagram: { svg: marketSvg.svg, caption: 'Addressable market by sector' },
    },
    {
      id: 'sectors',
      title: 'Sector Selection',
      content: `<p>We plot sectors by technology readiness (x-axis) against return potential (y-axis). 
      Sweet spot: Solar+Storage, EV Charging, Battery Tech. High risk, high reward: Green Hydrogen, DAC. 
      Patient capital required for Fusion.</p>`,
      diagram: { svg: positionSvg.svg, caption: 'Sector positioning for portfolio construction' },
    },
    {
      id: 'policy',
      title: 'Policy Tailwinds',
      content: `<p>Unprecedented policy support de-risks climate investments. The Inflation Reduction Act 
      alone provides $369B in incentives. EU CBAM creates carbon price parity. The regulatory direction 
      is locked in for decades.</p>`,
      diagram: { svg: policySvg.svg, caption: 'Key policy milestones driving investment' },
    },
    {
      id: 'portfolio',
      title: 'Portfolio Strategy',
      content: `<p>Diversified across stages: 15% Seed (technology risk), 35% Series A (market risk), 
      30% Series B (execution risk), 20% Growth (scale risk). Target 25 companies per fund, 
      $15-50M initial checks.</p>`,
      diagram: { svg: allocSvg.svg, caption: 'Target allocation by stage' },
    },
    {
      id: 'track',
      title: 'Track Record',
      content: `<p>Fund I (2019 vintage) showing 3.2x MOIC with 8 companies at Series C+. Fund II 
      on track with 2.1x at 75% deployed. Raising Fund IV at $800M to capture the deployment phase.</p>`,
      diagram: { svg: fundSvg.svg, caption: 'Fund deployment and lifecycle' },
    },
  ];

  return buildHTML({
    title: 'Climate Tech Investment Thesis',
    subtitle: 'Evergreen Capital Partners',
    theme: 'solarized_dark',
    navigationStyle: 'sidebar',
    layout: 'magazine',
    sections,
    enableThemeSwitcher: true,
    hero: {
      title: 'Backing the Net-Zero Economy',
      subtitle: 'A thesis for investing in climate solutions at the deployment tipping point',
      metric: { value: '$3.2T', label: 'Annual Opportunity by 2030' },
    },
    footer: 'Confidential • Evergreen Capital Partners LP • January 2026',
  });
}

// ============================================================================
// EXAMPLE 5: Engineering Excellence Report
// Layout: Dashboard | Theme: GitHub Dark
// Showcases: Developer metrics, Team performance, Technical health
// ============================================================================

async function generateEngineeringExcellence() {
  console.log('\n⚙️ 5. Generating Engineering Excellence Report (Dashboard)...');
  const theme = getTheme('github_dark');

  // Deployment Frequency (D3 Bar)
  const deployFreq: BarChartData[] = [
    { label: 'Mon', value: 12 },
    { label: 'Tue', value: 18 },
    { label: 'Wed', value: 24 },
    { label: 'Thu', value: 21 },
    { label: 'Fri', value: 15 },
  ];

  // Lead Time Trend (D3 Line)
  const leadTime: LineChartData[] = [
    { x: 'W1', y: 72 },
    { x: 'W2', y: 68 },
    { x: 'W3', y: 54 },
    { x: 'W4', y: 48 },
    { x: 'W5', y: 42 },
    { x: 'W6', y: 38 },
    { x: 'W7', y: 32 },
    { x: 'W8', y: 28 },
  ];

  // Code Coverage (D3 Pie)
  const codeCoverage: PieChartData[] = [
    { label: 'Covered', value: 78 },
    { label: 'Uncovered', value: 22 },
  ];

  // Team Allocation (D3 Pie)
  const teamAlloc: PieChartData[] = [
    { label: 'Features', value: 45 },
    { label: 'Tech Debt', value: 25 },
    { label: 'Bug Fixes', value: 15 },
    { label: 'Infrastructure', value: 15 },
  ];

  // DORA Metrics (D3 Quadrant)
  const doraMetrics: QuadrantData[] = [
    { label: 'Our Team', x: 78, y: 82 },
    { label: 'Industry Elite', x: 92, y: 95 },
    { label: 'Industry High', x: 75, y: 78 },
    { label: 'Industry Medium', x: 55, y: 55 },
    { label: 'Industry Low', x: 25, y: 30 },
  ];

  // Sprint Velocity (D3 Line)
  const velocity: LineChartData[] = [
    { x: 'S1', y: 42 },
    { x: 'S2', y: 45 },
    { x: 'S3', y: 48 },
    { x: 'S4', y: 52 },
    { x: 'S5', y: 55 },
    { x: 'S6', y: 58 },
    { x: 'S7', y: 54 },
    { x: 'S8', y: 62 },
  ];

  // Incident Trend (D3 Bar)
  const incidents: BarChartData[] = [
    { label: 'Oct', value: 8 },
    { label: 'Nov', value: 5 },
    { label: 'Dec', value: 3 },
    { label: 'Jan', value: 2 },
  ];

  const deploySvg = renderBarChart(deployFreq, theme, { title: 'Deployments This Week' });
  const leadTimeSvg = renderLineChart(leadTime, theme, { title: 'Lead Time (Hours)', area: true });
  const coverageSvg = renderPieChart(codeCoverage, theme, { title: 'Test Coverage', donut: true });
  const allocSvg = renderPieChart(teamAlloc, theme, { title: 'Engineering Time Allocation', donut: true });
  const doraSvg = renderQuadrantChart(doraMetrics, theme, {
    title: 'DORA Performance',
    quadrantLabels: ['Elite', 'High', 'Medium', 'Low'],
    xLabel: 'Deployment Frequency',
    yLabel: 'Change Failure Rate (Inverse)',
  });
  const velocitySvg = renderLineChart(velocity, theme, { title: 'Sprint Velocity (Points)' });
  const incidentSvg = renderBarChart(incidents, theme, { title: 'Production Incidents' });

  const sections: Section[] = [
    {
      id: 'dora',
      title: 'DORA Metrics',
      content: `<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
        <div style="background: var(--surface); padding: 20px; border-radius: 12px; border-left: 4px solid var(--success);">
          <div style="font-size: 1.8rem; font-weight: 700;">90/week</div>
          <div style="font-size: 0.85rem; color: var(--text-secondary);">Deploy Frequency</div>
          <div style="font-size: 0.75rem; color: var(--success);">Elite Performer</div>
        </div>
        <div style="background: var(--surface); padding: 20px; border-radius: 12px; border-left: 4px solid var(--success);">
          <div style="font-size: 1.8rem; font-weight: 700;">28 hrs</div>
          <div style="font-size: 0.85rem; color: var(--text-secondary);">Lead Time</div>
          <div style="font-size: 0.75rem; color: var(--success);">Elite Performer</div>
        </div>
        <div style="background: var(--surface); padding: 20px; border-radius: 12px; border-left: 4px solid var(--warning);">
          <div style="font-size: 1.8rem; font-weight: 700;">4.2%</div>
          <div style="font-size: 0.85rem; color: var(--text-secondary);">Change Failure</div>
          <div style="font-size: 0.75rem; color: var(--warning);">High Performer</div>
        </div>
        <div style="background: var(--surface); padding: 20px; border-radius: 12px; border-left: 4px solid var(--success);">
          <div style="font-size: 1.8rem; font-weight: 700;"><1 hr</div>
          <div style="font-size: 0.85rem; color: var(--text-secondary);">MTTR</div>
          <div style="font-size: 0.75rem; color: var(--success);">Elite Performer</div>
        </div>
      </div>`,
      diagram: { svg: doraSvg.svg, caption: 'Team performance vs industry benchmarks' },
    },
    {
      id: 'deploys',
      title: 'Deployment Pattern',
      content: `<p>90 deployments this week across 4 teams. Wednesday peak aligns with sprint mid-week pushes. 
      Friday deliberately lower to avoid weekend incidents. Zero deploy freezes this quarter.</p>`,
      diagram: { svg: deploySvg.svg, caption: 'Deployments by day of week' },
    },
    {
      id: 'leadtime',
      title: 'Lead Time Improvement',
      content: `<p>Lead time (commit to production) reduced from 72 hours to 28 hours over 8 weeks. 
      Key drivers: parallel CI pipelines, automated security scanning, streamlined review process.</p>`,
      diagram: { svg: leadTimeSvg.svg, caption: 'Lead time trend showing 61% improvement' },
    },
    {
      id: 'velocity',
      title: 'Team Velocity',
      content: `<p>Velocity stabilising at 58 points/sprint. Sprint 7 dip due to holiday week. 
      Predictability (std dev) improved from ±12 to ±6 points over the quarter.</p>`,
      diagram: { svg: velocitySvg.svg, caption: 'Sprint velocity trend' },
    },
    {
      id: 'quality',
      title: 'Code Quality',
      content: `<p>Test coverage at 78% (target: 80%). Coverage concentrated in core business logic (92%); 
      gaps primarily in legacy integration code scheduled for deprecation.</p>`,
      diagram: { svg: coverageSvg.svg, caption: 'Current test coverage distribution' },
    },
    {
      id: 'allocation',
      title: 'Time Allocation',
      content: `<p>45% feature work, 25% tech debt (up from 15%)—deliberate investment in platform stability. 
      Bug fixes down to 15% from 25% as quality initiatives pay off.</p>`,
      diagram: { svg: allocSvg.svg, caption: 'Where engineering time goes' },
    },
    {
      id: 'incidents',
      title: 'Reliability',
      content: `<p>Production incidents down 75% over 4 months. Only 2 incidents in January, both P3 (low impact). 
      No P1 incidents for 62 days. SLO compliance at 99.95%.</p>`,
      diagram: { svg: incidentSvg.svg, caption: 'Monthly incident trend' },
    },
  ];

  return buildHTML({
    title: 'Engineering Excellence Report',
    subtitle: 'January 2026 Dashboard',
    theme: 'github_dark',
    navigationStyle: 'sidebar',
    layout: 'dashboard',
    sections,
    enableThemeSwitcher: true,
    footer: 'Engineering Team • Updated Weekly • Data from GitHub & PagerDuty',
  });
}

// ============================================================================
// EXAMPLE 6: Startup Ecosystem Analysis
// Layout: Sidebar | Theme: Creative
// Showcases: Market research, Competitive analysis, Sector mapping
// ============================================================================

async function generateStartupEcosystem() {
  console.log('\n🚀 6. Generating Startup Ecosystem Analysis (Sidebar)...');
  const theme = getTheme('creative');

  // Funding by Stage (D3 Bar)
  const fundingStage: BarChartData[] = [
    { label: 'Pre-Seed', value: 2.8 },
    { label: 'Seed', value: 8.5 },
    { label: 'Series A', value: 24.2 },
    { label: 'Series B', value: 38.5 },
    { label: 'Series C+', value: 62.1 },
  ];

  // Sector Distribution (D3 Pie)
  const sectorDist: PieChartData[] = [
    { label: 'AI/ML', value: 32 },
    { label: 'FinTech', value: 22 },
    { label: 'HealthTech', value: 18 },
    { label: 'Climate', value: 14 },
    { label: 'Enterprise', value: 10 },
    { label: 'Consumer', value: 4 },
  ];

  // Ecosystem Maturity (D3 Quadrant)
  const ecosystemMap: QuadrantData[] = [
    { label: 'San Francisco', x: 95, y: 90 },
    { label: 'New York', x: 85, y: 75 },
    { label: 'London', x: 78, y: 82 },
    { label: 'Berlin', x: 65, y: 70 },
    { label: 'Singapore', x: 72, y: 65 },
    { label: 'Tel Aviv', x: 70, y: 78 },
    { label: 'Toronto', x: 55, y: 58 },
    { label: 'Paris', x: 60, y: 62 },
  ];

  // Unicorn Trend (D3 Line)
  const unicornTrend: LineChartData[] = [
    { x: '2015', y: 82 },
    { x: '2016', y: 156 },
    { x: '2017', y: 220 },
    { x: '2018', y: 326 },
    { x: '2019', y: 452 },
    { x: '2020', y: 498 },
    { x: '2021', y: 958 },
    { x: '2022', y: 1180 },
    { x: '2023', y: 1210 },
    { x: '2024', y: 1342 },
    { x: '2025', y: 1485 },
  ];

  // Exit Activity (D3 Timeline)
  const exitActivity: TimelineData[] = [
    { event: 'Stripe DPO', date: '2025-03-15', description: '$95B valuation' },
    { event: 'Databricks IPO', date: '2025-06-20', description: '$68B market cap' },
    { event: 'Canva IPO', date: '2025-09-10', description: '$45B market cap' },
    { event: 'Discord IPO', date: '2025-11-05', description: '$28B market cap' },
    { event: 'Figma (Adobe)', date: '2025-12-15', description: '$20B (revised)' },
  ];

  // Valuation Multiples (D3 Bar)
  const multiples: BarChartData[] = [
    { label: 'AI/ML', value: 28 },
    { label: 'FinTech', value: 12 },
    { label: 'SaaS', value: 15 },
    { label: 'Marketplace', value: 8 },
    { label: 'Consumer', value: 6 },
  ];

  const fundingSvg = renderBarChart(fundingStage, theme, { title: 'Avg. Round Size by Stage ($M)' });
  const sectorSvg = renderPieChart(sectorDist, theme, { title: '2025 Investment by Sector', donut: true });
  const ecosystemSvg = renderQuadrantChart(ecosystemMap, theme, {
    title: 'Global Startup Ecosystems',
    quadrantLabels: ['Global Leaders', 'Rising Hubs', 'Specialists', 'Emerging'],
    xLabel: 'Capital Access',
    yLabel: 'Talent Density',
  });
  const unicornSvg = renderLineChart(unicornTrend, theme, { title: 'Global Unicorn Count', area: true });
  const exitSvg = renderTimelineChart(exitActivity, theme, { title: 'Major 2025 Exits' });
  const multipleSvg = renderBarChart(multiples, theme, { title: 'Revenue Multiples (Median)' });

  const sections: Section[] = [
    {
      id: 'overview',
      title: 'Ecosystem Overview',
      content: `<p>The global startup ecosystem reached <strong>$620B in total funding</strong> in 2025, 
      rebounding from the 2022-2023 correction. AI continues to dominate deal flow, capturing 32% of 
      all venture capital. The unicorn count reached 1,485 companies globally.</p>`,
      diagram: { svg: unicornSvg.svg, caption: 'Cumulative unicorn count over time' },
    },
    {
      id: 'sectors',
      title: 'Sector Analysis',
      content: `<p>AI/ML captures the lion's share of investment, followed by FinTech and HealthTech. 
      Climate tech gaining momentum with 14% share (up from 8% in 2023). Consumer deals at historic lows.</p>`,
      diagram: { svg: sectorSvg.svg, caption: 'Investment distribution by sector' },
    },
    {
      id: 'stages',
      title: 'Stage Dynamics',
      content: `<p>Average Series B now $38.5M—double the 2019 level. Seed rounds holding steady as 
      capital recycling keeps early-stage ecosystem healthy. Mega-rounds ($100M+) driving up Series C+ average.</p>`,
      diagram: { svg: fundingSvg.svg, caption: 'Average round size by funding stage' },
    },
    {
      id: 'multiples',
      title: 'Valuation Environment',
      content: `<p>AI companies commanding 28x revenue multiples—nearly 2x the next highest sector (SaaS at 15x). 
      The "AI premium" is real but increasingly scrutinised. Consumer multiples compressed to 6x.</p>`,
      diagram: { svg: multipleSvg.svg, caption: 'Median revenue multiples by sector' },
    },
    {
      id: 'geography',
      title: 'Ecosystem Geography',
      content: `<p>San Francisco maintains dominance but share declining (from 42% to 35% of global VC). 
      London emerging as European leader. Singapore and Tel Aviv punching above weight. Toronto and Paris 
      accelerating with government AI initiatives.</p>`,
      diagram: { svg: ecosystemSvg.svg, caption: 'Ecosystem ranking by capital access and talent' },
    },
    {
      id: 'exits',
      title: 'Exit Activity',
      content: `<p>IPO window reopened in 2025 with landmark listings. Stripe's DPO at $95B validated 
      the private market. M&A picking up as strategic buyers seek AI capabilities. Total exit value: $180B.</p>`,
      diagram: { svg: exitSvg.svg, caption: 'Major liquidity events in 2025' },
    },
  ];

  return buildHTML({
    title: 'State of the Startup Ecosystem',
    subtitle: '2025 Global Analysis',
    theme: 'creative',
    navigationStyle: 'sidebar',
    layout: 'sidebar',
    sections,
    enableThemeSwitcher: true,
    footer: 'Venture Insights Research • Annual Report 2025',
  });
}

// ============================================================================
// EXAMPLE 7: Personal Finance Dashboard
// Layout: Minimal | Theme: Professional
// Showcases: Clean single-column, Personal use case, Simple elegance
// ============================================================================

async function generatePersonalFinance() {
  console.log('\n💰 7. Generating Personal Finance Dashboard (Minimal)...');
  const theme = getTheme('professional');

  // Net Worth Trend (D3 Line)
  const netWorth: LineChartData[] = [
    { x: 'Jan', y: 142 },
    { x: 'Feb', y: 148 },
    { x: 'Mar', y: 155 },
    { x: 'Apr', y: 151 },
    { x: 'May', y: 162 },
    { x: 'Jun', y: 175 },
    { x: 'Jul', y: 182 },
    { x: 'Aug', y: 188 },
    { x: 'Sep', y: 195 },
    { x: 'Oct', y: 204 },
    { x: 'Nov', y: 218 },
    { x: 'Dec', y: 232 },
  ];

  // Asset Allocation (D3 Pie)
  const assetAlloc: PieChartData[] = [
    { label: 'Equities', value: 55 },
    { label: 'Bonds', value: 20 },
    { label: 'Real Estate', value: 15 },
    { label: 'Cash', value: 8 },
    { label: 'Crypto', value: 2 },
  ];

  // Monthly Spending (D3 Bar)
  const spending: BarChartData[] = [
    { label: 'Housing', value: 2200 },
    { label: 'Food', value: 850 },
    { label: 'Transport', value: 420 },
    { label: 'Entertainment', value: 380 },
    { label: 'Utilities', value: 280 },
    { label: 'Shopping', value: 450 },
    { label: 'Health', value: 180 },
  ];

  // Savings Rate (D3 Line)
  const savingsRate: LineChartData[] = [
    { x: 'Jan', y: 22 },
    { x: 'Feb', y: 25 },
    { x: 'Mar', y: 28 },
    { x: 'Apr', y: 24 },
    { x: 'May', y: 32 },
    { x: 'Jun', y: 35 },
    { x: 'Jul', y: 33 },
    { x: 'Aug', y: 38 },
    { x: 'Sep', y: 36 },
    { x: 'Oct', y: 40 },
    { x: 'Nov', y: 42 },
    { x: 'Dec', y: 45 },
  ];

  // Investment Performance (D3 Bar)
  const investmentPerf: BarChartData[] = [
    { label: 'S&P 500 ETF', value: 24 },
    { label: 'Tech ETF', value: 32 },
    { label: 'Bond Fund', value: 5 },
    { label: 'REIT', value: 12 },
    { label: 'Int\'l ETF', value: 18 },
  ];

  // Financial Goals (D3 Gantt)
  const goals: GanttChartData[] = [
    { task: 'Emergency Fund', start: '2024-01-01', end: '2025-06-30', category: 'savings', progress: 100 },
    { task: 'House Deposit', start: '2024-06-01', end: '2027-12-31', category: 'savings', progress: 45 },
    { task: 'Retirement (FIRE)', start: '2020-01-01', end: '2040-01-01', category: 'investing', progress: 18 },
    { task: 'Kids Education', start: '2024-01-01', end: '2036-09-01', category: 'savings', progress: 8 },
  ];

  const netWorthSvg = renderLineChart(netWorth, theme, { title: '2025 Net Worth ($K)', area: true });
  const allocSvg = renderPieChart(assetAlloc, theme, { title: 'Asset Allocation', donut: true });
  const spendingSvg = renderBarChart(spending, theme, { title: 'Monthly Spending ($)' });
  const savingsSvg = renderLineChart(savingsRate, theme, { title: 'Savings Rate (%)' });
  const perfSvg = renderBarChart(investmentPerf, theme, { title: 'YTD Investment Returns (%)' });
  const goalsSvg = renderGanttChart(goals, theme, { title: 'Financial Goals Progress' });

  const sections: Section[] = [
    {
      id: 'networth',
      title: 'Net Worth',
      content: `<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 24px;">
        <div style="background: var(--surface); padding: 20px; border-radius: 8px; text-align: center;">
          <div style="font-size: 2rem; font-weight: 600; color: var(--success);">$232K</div>
          <div style="font-size: 0.85rem; color: var(--text-secondary);">Total Net Worth</div>
        </div>
        <div style="background: var(--surface); padding: 20px; border-radius: 8px; text-align: center;">
          <div style="font-size: 2rem; font-weight: 600; color: var(--accent);">+$90K</div>
          <div style="font-size: 0.85rem; color: var(--text-secondary);">2025 Growth</div>
        </div>
        <div style="background: var(--surface); padding: 20px; border-radius: 8px; text-align: center;">
          <div style="font-size: 2rem; font-weight: 600; color: var(--info);">63%</div>
          <div style="font-size: 0.85rem; color: var(--text-secondary);">YoY Increase</div>
        </div>
      </div>
      <p>Strong year driven by consistent saving, market returns, and bonus allocation to investments.</p>`,
      diagram: { svg: netWorthSvg.svg, caption: 'Monthly net worth progression' },
    },
    {
      id: 'allocation',
      title: 'Portfolio Allocation',
      content: `<p>Balanced allocation with 55% equities. Gradually reducing equity exposure as approaching 
      house deposit target. Crypto position capped at 2%—fun money only.</p>`,
      diagram: { svg: allocSvg.svg, caption: 'Current asset allocation' },
    },
    {
      id: 'spending',
      title: 'Monthly Budget',
      content: `<p>Average monthly spending: $4,760. Housing is the largest expense (46%). 
      Food spending increased this year—more dining out. Considering meal prep to optimise.</p>`,
      diagram: { svg: spendingSvg.svg, caption: 'Average monthly spending by category' },
    },
    {
      id: 'savings',
      title: 'Savings Progress',
      content: `<p>Savings rate improved from 22% to 45% over the year. December boost from year-end bonus. 
      Target for 2026: maintain 40%+ average savings rate.</p>`,
      diagram: { svg: savingsSvg.svg, caption: 'Monthly savings rate progression' },
    },
    {
      id: 'performance',
      title: 'Investment Returns',
      content: `<p>Portfolio returned 22% YTD. Tech ETF led at 32% (but higher volatility). 
      Bond allocation underperformed but provided stability during March correction.</p>`,
      diagram: { svg: perfSvg.svg, caption: 'Year-to-date returns by holding' },
    },
    {
      id: 'goals',
      title: 'Financial Goals',
      content: `<p>Emergency fund complete. House deposit at 45%—on track for 2027. FIRE journey at 18%—
      long road but compound interest is friend. Kids education fund started early.</p>`,
      diagram: { svg: goalsSvg.svg, caption: 'Long-term financial goal tracking' },
    },
  ];

  return buildHTML({
    title: 'Personal Finance Dashboard',
    subtitle: '2025 Year in Review',
    theme: 'professional',
    navigationStyle: 'minimal',
    layout: 'minimal',
    sections,
    enableThemeSwitcher: true,
    footer: 'Personal Use Only • Updated Monthly',
  });
}

// ============================================================================
// EXAMPLE 8: Product Launch War Room
// Layout: Presentation | Theme: GitHub Light
// Showcases: Launch playbook, GTM slides, Countdown energy
// ============================================================================

async function generateProductLaunch() {
  console.log('\n🚀 8. Generating Product Launch War Room (Presentation)...');
  const theme = getTheme('github_light');

  // Launch Timeline (D3 Gantt)
  const launchTimeline: GanttChartData[] = [
    { task: 'Beta Testing', start: '2026-01-06', end: '2026-01-24', category: 'testing', progress: 100 },
    { task: 'PR Embargo', start: '2026-01-20', end: '2026-02-03', category: 'marketing', progress: 60 },
    { task: 'Influencer Seeding', start: '2026-01-27', end: '2026-02-03', category: 'marketing', progress: 40 },
    { task: 'Launch Day', start: '2026-02-03', end: '2026-02-03', category: 'milestone', progress: 0 },
    { task: 'Post-Launch Support', start: '2026-02-03', end: '2026-02-17', category: 'support', progress: 0 },
    { task: 'Week 2 Push', start: '2026-02-10', end: '2026-02-14', category: 'marketing', progress: 0 },
  ];

  // Channel Mix (D3 Pie)
  const channelMix: PieChartData[] = [
    { label: 'Product Hunt', value: 30 },
    { label: 'Twitter/X', value: 25 },
    { label: 'Email List', value: 20 },
    { label: 'Reddit', value: 12 },
    { label: 'LinkedIn', value: 8 },
    { label: 'Press', value: 5 },
  ];

  // Launch Targets (D3 Bar)
  const launchTargets: BarChartData[] = [
    { label: 'Day 1 Signups', value: 5000 },
    { label: 'Week 1 WAU', value: 2500 },
    { label: 'Week 1 Paid', value: 250 },
    { label: 'PH Votes', value: 1000 },
    { label: 'Press Mentions', value: 15 },
  ];

  // Competitive Position (D3 Quadrant)
  const competitive: QuadrantData[] = [
    { label: 'Our Product', x: 85, y: 90 },
    { label: 'Competitor A', x: 70, y: 65 },
    { label: 'Competitor B', x: 80, y: 50 },
    { label: 'Competitor C', x: 45, y: 75 },
  ];

  // Historical Launches (D3 Line)
  const historicalLaunches: LineChartData[] = [
    { x: 'v1.0', y: 800 },
    { x: 'v1.5', y: 1200 },
    { x: 'v2.0', y: 3500 },
    { x: 'v2.5', y: 4200 },
    { x: 'v3.0 (Target)', y: 5000 },
  ];

  // Readiness Checklist (D3 Bar)
  const readiness: BarChartData[] = [
    { label: 'Engineering', value: 100 },
    { label: 'Marketing', value: 85 },
    { label: 'Sales', value: 90 },
    { label: 'Support', value: 95 },
    { label: 'Legal', value: 100 },
  ];

  const timelineSvg = renderGanttChart(launchTimeline, theme, { title: 'Launch Week Timeline' });
  const channelSvg = renderPieChart(channelMix, theme, { title: 'Launch Channel Mix', donut: true });
  const targetsSvg = renderBarChart(launchTargets, theme, { title: 'Launch KPI Targets' });
  const competitiveSvg = renderQuadrantChart(competitive, theme, {
    title: 'Competitive Positioning',
    quadrantLabels: ['Leader', 'Challenger', 'Follower', 'Niche'],
    xLabel: 'Features',
    yLabel: 'User Experience',
  });
  const historySvg = renderLineChart(historicalLaunches, theme, { title: 'Launch Performance History (Day 1 Signups)' });
  const readinessSvg = renderBarChart(readiness, theme, { title: 'Department Readiness (%)' });

  const sections: Section[] = [
    {
      id: 'countdown',
      title: 'T-3 Days to Launch',
      content: `<div style="text-align: center; padding: 40px;">
        <div style="font-size: 6rem; font-weight: 800; color: var(--accent); letter-spacing: -0.05em;">v3.0</div>
        <div style="font-size: 1.5rem; color: var(--text-secondary); margin-top: 12px;">February 3, 2026 • 9:00 AM PST</div>
        <div style="display: flex; justify-content: center; gap: 24px; margin-top: 40px;">
          <div style="text-align: center;">
            <div style="font-size: 3rem; font-weight: 700;">3</div>
            <div style="font-size: 0.9rem; color: var(--text-secondary);">DAYS</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 3rem; font-weight: 700;">14</div>
            <div style="font-size: 0.9rem; color: var(--text-secondary);">HOURS</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 3rem; font-weight: 700;">22</div>
            <div style="font-size: 0.9rem; color: var(--text-secondary);">MINUTES</div>
          </div>
        </div>
      </div>`,
    },
    {
      id: 'timeline',
      title: 'Launch Timeline',
      content: `<p>Beta testing complete. PR embargo lifts February 3 at 9 AM. Influencer previews going 
      out this week. All hands on deck for launch day support rotation.</p>`,
      diagram: { svg: timelineSvg.svg, caption: 'Critical path to launch' },
    },
    {
      id: 'targets',
      title: 'Success Metrics',
      content: `<p>Primary KPI: 5,000 Day 1 signups. Secondary: 250 paid conversions in Week 1. 
      Product Hunt target: #1 Product of the Day (need 1,000+ votes). Press: 15 coverage pieces.</p>`,
      diagram: { svg: targetsSvg.svg, caption: 'Launch targets by metric' },
    },
    {
      id: 'channels',
      title: 'Go-to-Market',
      content: `<p>Product Hunt is primary channel (30% of expected traffic). Twitter/X thread strategy 
      with founder story. Email blast to 45K list at T+2 hours. Reddit AMAs scheduled for r/startups and r/SaaS.</p>`,
      diagram: { svg: channelSvg.svg, caption: 'Expected traffic by channel' },
    },
    {
      id: 'competitive',
      title: 'Why We Win',
      content: `<p>We're launching with the most complete feature set AND the best UX in the market. 
      Competitor A has features but clunky. Competitor B has UX but missing key features. We have both.</p>`,
      diagram: { svg: competitiveSvg.svg, caption: 'Market positioning at launch' },
    },
    {
      id: 'history',
      title: 'Launch Track Record',
      content: `<p>Each launch bigger than the last. v2.0 was our breakout (3,500 signups). 
      v3.0 has 3x the marketing budget and 10x the audience. Target: 5,000 is aggressive but achievable.</p>`,
      diagram: { svg: historySvg.svg, caption: 'Historical launch performance' },
    },
    {
      id: 'readiness',
      title: 'Team Readiness',
      content: `<p>All departments green. Marketing at 85%—final assets being polished. Engineering 
      feature-frozen and on bug watch. Support scripts ready. Legal sign-off complete.</p>
      <p style="text-align: center; margin-top: 32px; font-size: 1.5rem; font-weight: 600; color: var(--success);">
        GO FOR LAUNCH
      </p>`,
      diagram: { svg: readinessSvg.svg, caption: 'Readiness by department' },
    },
  ];

  return buildHTML({
    title: 'v3.0 Launch War Room',
    subtitle: 'All Hands Briefing',
    theme: 'github_light',
    navigationStyle: 'sidebar',
    layout: 'presentation',
    sections,
    enableThemeSwitcher: true,
    footer: 'Launch Date: February 3, 2026 • CONFIDENTIAL',
  });
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  console.log('═'.repeat(70));
  console.log('  DESIGN SYSTEM SHOWCASE');
  console.log('  Demonstrating all layouts, themes, and D3 capabilities');
  console.log('═'.repeat(70));

  const outputDir = path.resolve(__dirname, '../../../examples');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate all examples
  const examples = [
    { name: 'showcase_state_of_ai.html', fn: generateStateOfAI },
    { name: 'showcase_saas_metrics.html', fn: generateSaaSMetrics },
    { name: 'showcase_data_storytelling.html', fn: generateDataStorytelling },
    { name: 'showcase_climate_tech.html', fn: generateClimateTech },
    { name: 'showcase_engineering.html', fn: generateEngineeringExcellence },
    { name: 'showcase_startup_ecosystem.html', fn: generateStartupEcosystem },
    { name: 'showcase_personal_finance.html', fn: generatePersonalFinance },
    { name: 'showcase_product_launch.html', fn: generateProductLaunch },
  ];

  const results: { name: string; size: number }[] = [];

  for (const example of examples) {
    const html = await example.fn();
    const filePath = path.join(outputDir, example.name);
    fs.writeFileSync(filePath, html, 'utf-8');
    const stats = fs.statSync(filePath);
    results.push({ name: example.name, size: stats.size / 1024 });
  }

  console.log('\n' + '═'.repeat(70));
  console.log('  FILES GENERATED');
  console.log('═'.repeat(70) + '\n');

  for (const result of results) {
    console.log(`  ✓ ${result.name.padEnd(40)} ${result.size.toFixed(1)} KB`);
  }

  console.log(`\n  Output: ${outputDir}\n`);

  console.log('═'.repeat(70));
  console.log('  SHOWCASE SUMMARY');
  console.log('═'.repeat(70));
  console.log(`
  ┌────────────────────────────────────────┬─────────────┬──────────────────┐
  │ Example                                │ Layout      │ Theme            │
  ├────────────────────────────────────────┼─────────────┼──────────────────┤
  │ State of AI 2026 Report                │ Magazine    │ Gruvbox          │
  │ SaaS Metrics Command Centre            │ Dashboard   │ Tokyo Night      │
  │ The Art of Data Storytelling           │ Presentation│ Dracula          │
  │ Climate Tech Investment Thesis         │ Magazine    │ Solarized Dark   │
  │ Engineering Excellence Report          │ Dashboard   │ GitHub Dark      │
  │ Startup Ecosystem Analysis             │ Sidebar     │ Creative         │
  │ Personal Finance Dashboard             │ Minimal     │ Professional     │
  │ Product Launch War Room                │ Presentation│ GitHub Light     │
  └────────────────────────────────────────┴─────────────┴──────────────────┘

  D3 CHART COVERAGE:
  ✓ Bar Charts      - metrics, comparisons, performance
  ✓ Line Charts     - trends, projections, time series
  ✓ Area Charts     - volume, growth, accumulation
  ✓ Pie/Donut       - composition, allocation, distribution
  ✓ Gantt Charts    - timelines, roadmaps, project plans
  ✓ Timeline Charts - milestones, history, events
  ✓ Quadrant Charts - positioning, prioritisation, analysis

  LAYOUT COVERAGE:
  ✓ Magazine        - Hero sections, alternating grids
  ✓ Dashboard       - Metric cards, responsive grids
  ✓ Presentation    - Full-screen slides, snap scroll
  ✓ Sidebar         - Classic navigation, content focus
  ✓ Minimal         - Clean single-column, elegant simplicity

  THEME COVERAGE:
  ✓ Gruvbox         - Warm, retro, readable
  ✓ Tokyo Night     - Modern, developer-friendly
  ✓ Dracula         - Dark, focused, dramatic
  ✓ Solarized Dark  - Precise, analytical, professional
  ✓ GitHub Dark     - Developer native, familiar
  ✓ GitHub Light    - Clean, bright, accessible
  ✓ Creative        - Bold, expressive, colourful
  ✓ Professional    - Corporate, trustworthy, classic
`);
  console.log('═'.repeat(70));
}

main().catch(console.error);
