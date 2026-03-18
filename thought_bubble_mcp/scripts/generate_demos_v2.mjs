/**
 * Demo Set 2 - Three fresh showcase pieces
 * 
 * 1. Editorial: "The Weight of Legacy Code" (gruvbox)
 * 2. Magazine: "Nomad Coffee Co. Growth Report" (github_light)
 * 3. Dashboard: "ML Model Observatory" (tokyo_night)
 */

import { generateVisualization } from '../dist/tools/generate_visualization.js';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = join(__dirname, '..', '..', 'test_outputs');
mkdirSync(outputDir, { recursive: true });

async function generateAll() {
  console.log('Generating demo set 2...\n');

  // =========================================================================
  // DEMO 1: Editorial - "The Weight of Legacy Code" (gruvbox)
  // =========================================================================
  console.log('1/3  Editorial: The Weight of Legacy Code');

  const editorial = await generateVisualization({
    content: 'An analysis of technical debt accumulation patterns in a ten-year-old SaaS platform, examining how architectural decisions compound over time.',
    title: 'The Weight of Legacy Code',
    subtitle: 'A Post-Mortem on Technical Debt at Scale',
    theme: 'gruvbox',
    navigationStyle: 'minimal',
    layout: 'editorial',
    enableThemeSwitcher: true,
    selectedSystems: [
      {
        id: 1,
        title: 'Debt Accumulation Over Time',
        description: 'Technical debt measured in estimated remediation hours grew exponentially after Year 4, when the original architects left and documentation coverage dropped below 30%. The inflection point is unmistakable.',
        diagramType: 'area',
        chartData: [
          { x: 'Y1', y: 120 },
          { x: 'Y2', y: 180 },
          { x: 'Y3', y: 240 },
          { x: 'Y4', y: 310 },
          { x: 'Y5', y: 520 },
          { x: 'Y6', y: 890 },
          { x: 'Y7', y: 1340 },
          { x: 'Y8', y: 1820 },
          { x: 'Y9', y: 2400 },
          { x: 'Y10', y: 3100 },
        ],
        chartOptions: { title: 'Estimated Remediation Hours', yLabel: 'Hours' },
      },
      {
        id: 2,
        title: 'Where the Debt Lives',
        description: 'The payment processing module alone accounts for 28% of all identified technical debt, a consequence of its role as the integration point for seven external providers added over successive years without a unifying abstraction.',
        diagramType: 'treemap',
        chartData: [
          { label: 'Payment Processing', value: 870 },
          { label: 'User Management', value: 520 },
          { label: 'Reporting Engine', value: 410 },
          { label: 'API Layer', value: 380 },
          { label: 'Notification System', value: 290 },
          { label: 'Search Index', value: 240 },
          { label: 'Billing Logic', value: 210 },
          { label: 'Admin Panel', value: 180 },
        ],
        chartOptions: { title: 'Debt by Module (Remediation Hours)' },
      },
      {
        id: 3,
        title: 'Dependency Graph',
        description: 'The coupling between modules tells a story of expedient shortcuts. Payment processing has bidirectional dependencies with five other modules, making isolated testing effectively impossible.',
        diagramType: 'flowchart',
        mermaidCode: `flowchart TD
    subgraph Core
        API[API Layer]
        Auth[Authentication]
        Users[User Management]
    end
    
    subgraph Business
        Pay[Payment Processing]
        Bill[Billing Logic]
        Report[Reporting]
    end
    
    subgraph Infrastructure
        Notify[Notifications]
        Search[Search Index]
        Admin[Admin Panel]
    end
    
    API --> Auth
    API --> Users
    API --> Pay
    Users --> Auth
    Users --> Notify
    Pay --> Bill
    Pay --> Users
    Pay --> Notify
    Pay --> Report
    Bill --> Report
    Bill --> Users
    Report --> Search
    Admin --> Users
    Admin --> Report
    Admin --> Pay
    
    style Pay fill:#fb4934
    style Bill fill:#fe8019
    style Report fill:#fabd2f`,
      },
      {
        id: 4,
        title: 'Developer Sentiment by Quarter',
        description: 'Internal developer satisfaction surveys paint a clear picture: morale tracks inversely with debt load. The brief recovery in Q3 2024 corresponds to a focused debt sprint that cleared 400 hours of backlog.',
        diagramType: 'line',
        chartData: [
          { x: 'Q1 23', y: 72 },
          { x: 'Q2 23', y: 68 },
          { x: 'Q3 23', y: 61 },
          { x: 'Q4 23', y: 55 },
          { x: 'Q1 24', y: 48 },
          { x: 'Q2 24', y: 42 },
          { x: 'Q3 24', y: 58 },
          { x: 'Q4 24', y: 51 },
          { x: 'Q1 25', y: 44 },
        ],
        chartOptions: { title: 'Developer Satisfaction Score (0-100)', yLabel: 'Score' },
      },
      {
        id: 5,
        title: 'Cost of Change by Module Age',
        description: 'Modules older than five years cost roughly four times as much to modify as newer ones, measured in developer-hours per feature point. The relationship is not linear but follows a rough power curve.',
        diagramType: 'bar',
        chartData: [
          { label: '< 1 year', value: 4 },
          { label: '1-2 years', value: 7 },
          { label: '2-3 years', value: 11 },
          { label: '3-5 years', value: 16 },
          { label: '5-7 years', value: 24 },
          { label: '7-10 years', value: 38 },
        ],
        chartOptions: { title: 'Hours per Feature Point by Module Age', yLabel: 'Hours' },
      },
    ],
  });

  const editorialPath = join(outputDir, 'demo2_editorial_legacy.html');
  writeFileSync(editorialPath, editorial.html);
  console.log(`   ${editorial.stats.diagramsRendered} diagrams, ${(editorial.stats.fileSize / 1024).toFixed(0)}KB`);
  if (editorial.errors.length) console.log(`   Errors: ${editorial.errors.join(', ')}`);

  // =========================================================================
  // DEMO 2: Magazine - "Nomad Coffee Co." (github_light)
  // =========================================================================
  console.log('\n2/3  Magazine: Nomad Coffee Co. Growth Report');

  const magazine = await generateVisualization({
    content: 'Nomad Coffee Co. annual report covering expansion from 3 to 14 locations, supply chain optimisation, and the launch of a direct-to-consumer subscription model.',
    title: 'Nomad Coffee Co.',
    subtitle: '2025 Annual Growth Report',
    theme: 'github_light',
    navigationStyle: 'minimal',
    layout: 'magazine',
    enableThemeSwitcher: true,
    hero: {
      title: 'Brewing Something Bigger',
      subtitle: 'From three neighbourhood shops to a vertically integrated coffee company in under two years',
      metric: { value: '14', label: 'Locations Nationwide' },
    },
    selectedSystems: [
      {
        id: 1,
        title: 'Revenue by Channel',
        description: 'The supply chain tells the real story. Tracking every dollar from origin to cup reveals that the new subscription model already outperforms wholesale despite launching only nine months ago.',
        diagramType: 'sankey',
        chartData: [
          {
            nodes: [
              { id: 'retail', label: 'Retail Shops' },
              { id: 'subscription', label: 'Subscriptions' },
              { id: 'wholesale', label: 'Wholesale' },
              { id: 'events', label: 'Events' },
              { id: 'coffee', label: 'Coffee Sales' },
              { id: 'food', label: 'Food & Pastry' },
              { id: 'merch', label: 'Merchandise' },
              { id: 'beans', label: 'Bean Bags' },
              { id: 'profit', label: 'Gross Profit' },
              { id: 'cogs', label: 'Cost of Goods' },
            ],
            links: [
              { source: 'retail', target: 'coffee', value: 2800 },
              { source: 'retail', target: 'food', value: 1600 },
              { source: 'retail', target: 'merch', value: 400 },
              { source: 'subscription', target: 'beans', value: 1800 },
              { source: 'wholesale', target: 'beans', value: 900 },
              { source: 'events', target: 'coffee', value: 500 },
              { source: 'events', target: 'food', value: 300 },
              { source: 'coffee', target: 'profit', value: 2100 },
              { source: 'coffee', target: 'cogs', value: 1200 },
              { source: 'food', target: 'profit', value: 950 },
              { source: 'food', target: 'cogs', value: 950 },
              { source: 'merch', target: 'profit', value: 280 },
              { source: 'merch', target: 'cogs', value: 120 },
              { source: 'beans', target: 'profit', value: 1620 },
              { source: 'beans', target: 'cogs', value: 1080 },
            ],
          },
        ],
        chartOptions: { title: 'Revenue Flow ($K, Annual)' },
      },
      {
        id: 2,
        title: 'Monthly Revenue Growth',
        description: 'The subscription launch in April created a visible step change. Monthly revenue doubled between March and September, with subscription revenue growing at 22% month-over-month.',
        diagramType: 'area',
        chartData: [
          { x: 'Jan', y: 320 },
          { x: 'Feb', y: 340 },
          { x: 'Mar', y: 360 },
          { x: 'Apr', y: 420 },
          { x: 'May', y: 480 },
          { x: 'Jun', y: 540 },
          { x: 'Jul', y: 590 },
          { x: 'Aug', y: 640 },
          { x: 'Sep', y: 710 },
          { x: 'Oct', y: 750 },
          { x: 'Nov', y: 780 },
          { x: 'Dec', y: 820 },
        ],
        chartOptions: { title: 'Monthly Revenue ($K)', yLabel: '$K' },
      },
      {
        id: 3,
        title: 'Customer Satisfaction by Touchpoint',
        description: 'Radial view of NPS scores across every customer interaction point. The subscription experience scores highest, validating the investment in packaging and fulfilment.',
        diagramType: 'radial',
        chartData: [
          { label: 'In-Store', value: 78 },
          { label: 'Subscription Box', value: 92 },
          { label: 'Mobile App', value: 71 },
          { label: 'Website', value: 65 },
          { label: 'Events', value: 85 },
          { label: 'Wholesale Partners', value: 58 },
        ],
        chartOptions: { title: 'NPS Score by Channel' },
      },
      {
        id: 4,
        title: 'Menu Category Performance',
        description: 'Specialty drinks drive the highest margin per transaction. The seasonal single-origin programme introduced in Q3 lifted average ticket by 18%.',
        diagramType: 'bar',
        chartData: [
          { label: 'Espresso', value: 34 },
          { label: 'Filter', value: 18 },
          { label: 'Specialty', value: 42 },
          { label: 'Cold Brew', value: 28 },
          { label: 'Pastry', value: 15 },
          { label: 'Retail Bags', value: 22 },
        ],
        chartOptions: { title: 'Gross Margin by Category (%)', yLabel: '%' },
      },
      {
        id: 5,
        title: 'Expansion Timeline',
        description: 'From the flagship Shoreditch location to nationwide presence in 22 months.',
        diagramType: 'timeline',
        chartData: [
          { event: 'Shoreditch Flagship', date: '2024-01-15', description: 'First location opens' },
          { event: 'Camden Market', date: '2024-04-01', description: 'Pop-up turns permanent' },
          { event: 'Roastery Launch', date: '2024-06-15', description: 'In-house roasting begins' },
          { event: 'Subscription Beta', date: '2025-02-01', description: '500 founding members' },
          { event: 'Series A Close', date: '2025-05-01', description: 'Raised 2.4M' },
          { event: '10th Location', date: '2025-09-15', description: 'Manchester flagship' },
          { event: '14 Locations', date: '2025-11-30', description: 'Nationwide presence' },
        ],
        chartOptions: { title: 'Key Milestones' },
      },
    ],
  });

  const magazinePath = join(outputDir, 'demo2_magazine_coffee.html');
  writeFileSync(magazinePath, magazine.html);
  console.log(`   ${magazine.stats.diagramsRendered} diagrams, ${(magazine.stats.fileSize / 1024).toFixed(0)}KB`);
  if (magazine.errors.length) console.log(`   Errors: ${magazine.errors.join(', ')}`);

  // =========================================================================
  // DEMO 3: Dashboard - "ML Model Observatory" (tokyo_night)
  // =========================================================================
  console.log('\n3/3  Dashboard: ML Model Observatory');

  const dashboard = await generateVisualization({
    content: 'Machine learning model monitoring dashboard tracking inference performance, drift detection, and resource utilisation across production models.',
    title: 'Model Observatory',
    subtitle: 'Production ML Monitoring',
    theme: 'tokyo_night',
    navigationStyle: 'minimal',
    layout: 'dashboard',
    enableThemeSwitcher: true,
    selectedSystems: [
      {
        id: 1,
        title: 'Inference Latency Trend',
        description: 'Model serving latency across the fleet. The recommender model shows periodic spikes during batch retraining windows.',
        diagramType: 'line',
        chartData: [
          { x: 'Mon', y: 12 },
          { x: 'Tue', y: 14 },
          { x: 'Wed', y: 11 },
          { x: 'Thu', y: 28 },
          { x: 'Fri', y: 15 },
          { x: 'Sat', y: 9 },
          { x: 'Sun', y: 8 },
        ],
        chartOptions: { title: 'p95 Inference Latency (ms)', yLabel: 'ms' },
      },
      {
        id: 2,
        title: 'Model Accuracy by Domain',
        description: 'Accuracy metrics across production models. The fraud detection model maintains the highest precision, as expected given the asymmetric cost of false negatives.',
        diagramType: 'radial',
        chartData: [
          { label: 'Fraud Detection', value: 97 },
          { label: 'Recommender', value: 84 },
          { label: 'NLP Classifier', value: 91 },
          { label: 'Image Tagger', value: 88 },
          { label: 'Pricing Model', value: 79 },
          { label: 'Churn Predictor', value: 82 },
        ],
        chartOptions: { title: 'Model Accuracy (%)' },
      },
      {
        id: 3,
        title: 'GPU Utilisation by Model',
        description: 'Compute allocation across the model fleet. The image processing pipeline consumes the largest share despite serving the fewest requests.',
        diagramType: 'treemap',
        chartData: [
          { label: 'Image Tagger', value: 42 },
          { label: 'Recommender', value: 28 },
          { label: 'NLP Classifier', value: 18 },
          { label: 'Fraud Detection', value: 8 },
          { label: 'Pricing Model', value: 6 },
          { label: 'Churn Predictor', value: 4 },
        ],
        chartOptions: { title: 'GPU Hours per Day' },
      },
      {
        id: 4,
        title: 'Data Drift Detection',
        description: 'Feature drift scores over the past month. Values above 0.15 trigger automatic retraining. The pricing model crossed threshold twice.',
        diagramType: 'area',
        chartData: [
          { x: 'W1', y: 0.04 },
          { x: 'W2', y: 0.07 },
          { x: 'W3', y: 0.12 },
          { x: 'W4', y: 0.18 },
          { x: 'W5', y: 0.09 },
          { x: 'W6', y: 0.06 },
          { x: 'W7', y: 0.11 },
          { x: 'W8', y: 0.16 },
        ],
        chartOptions: { title: 'Feature Drift Score (Pricing Model)', yLabel: 'KL Divergence' },
      },
      {
        id: 5,
        title: 'Request Volume by Model',
        description: 'Daily inference request distribution. The recommender handles 10x the volume of any other model.',
        diagramType: 'bar',
        chartData: [
          { label: 'Recommender', value: 2400 },
          { label: 'NLP', value: 890 },
          { label: 'Fraud', value: 650 },
          { label: 'Image', value: 240 },
          { label: 'Pricing', value: 180 },
          { label: 'Churn', value: 95 },
        ],
        chartOptions: { title: 'Daily Requests (K)', yLabel: 'Thousands' },
      },
      {
        id: 6,
        title: 'ML Pipeline Architecture',
        description: 'The end-to-end pipeline from data ingestion through training to serving, with automated monitoring at each stage.',
        diagramType: 'flowchart',
        mermaidCode: `flowchart TD
    subgraph Ingestion
        Stream([Event Stream]) --> Lake[(Data Lake)]
        Lake --> Features[Feature Store]
    end
    
    subgraph Training
        Features --> Prep[Data Prep]
        Prep --> Train[Model Training]
        Train --> Eval{Evaluation}
        Eval -->|Pass| Registry[Model Registry]
        Eval -->|Fail| Retrain[Queue Retrain]
    end
    
    subgraph Serving
        Registry --> Deploy[Canary Deploy]
        Deploy --> Serve[Model Server]
        Serve --> Monitor[Drift Monitor]
        Monitor -->|Drift| Retrain
    end
    
    style Stream fill:#7aa2f7
    style Registry fill:#9ece6a
    style Monitor fill:#e0af68
    style Retrain fill:#f7768e`,
      },
    ],
  });

  const dashboardPath = join(outputDir, 'demo2_dashboard_ml.html');
  writeFileSync(dashboardPath, dashboard.html);
  console.log(`   ${dashboard.stats.diagramsRendered} diagrams, ${(dashboard.stats.fileSize / 1024).toFixed(0)}KB`);
  if (dashboard.errors.length) console.log(`   Errors: ${dashboard.errors.join(', ')}`);

  console.log('\nAll three demos generated.');
}

generateAll().catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
