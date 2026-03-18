/**
 * Generate example HTML files showcasing different themes
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { renderMermaidDiagram } from './mermaid_renderer.js';
import { renderBarChart, renderPieChart, renderGanttChart } from './d3_renderer.js';
import { buildHTML, type Section } from '../builders/html_builder.js';
import { 
  getTheme, 
  getThemesByCategory,
  type ThemeTokens,
  type ThemeName 
} from '../themes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sample Mermaid diagrams
const FLOWCHART = `graph TD
    A[User Request] --> B{Authentication}
    B -->|Valid| C[Process Request]
    B -->|Invalid| D[Return Error]
    C --> E{Authorization}
    E -->|Allowed| F[Execute Action]
    E -->|Denied| G[Access Denied]
    F --> H[Return Response]
    G --> H
    D --> H`;

const SEQUENCE = `sequenceDiagram
    participant U as User
    participant A as API Gateway
    participant S as Auth Service
    participant D as Database
    
    U->>A: Login Request
    A->>S: Validate Credentials
    S->>D: Query User
    D-->>S: User Data
    S-->>A: Auth Token
    A-->>U: Login Success`;

const CLASS_DIAGRAM = `classDiagram
    class User {
        +String id
        +String name
        +String email
        +login()
        +logout()
    }
    class Order {
        +String id
        +Date created
        +Float total
        +process()
        +cancel()
    }
    class Product {
        +String id
        +String name
        +Float price
    }
    User "1" --> "*" Order : places
    Order "*" --> "*" Product : contains`;

// Sample chart data
const BAR_DATA = [
  { label: 'Q1 2025', value: 125 },
  { label: 'Q2 2025', value: 180 },
  { label: 'Q3 2025', value: 220 },
  { label: 'Q4 2025', value: 165 },
];

const PIE_DATA = [
  { label: 'Frontend', value: 35 },
  { label: 'Backend', value: 40 },
  { label: 'DevOps', value: 15 },
  { label: 'Design', value: 10 },
];

const GANTT_DATA = [
  { task: 'Planning', start: '2025-01-01', end: '2025-01-15', category: 'Phase 1', progress: 100 },
  { task: 'Design', start: '2025-01-10', end: '2025-02-01', category: 'Phase 1', progress: 100 },
  { task: 'Development', start: '2025-01-25', end: '2025-03-15', category: 'Phase 2', progress: 75 },
  { task: 'Testing', start: '2025-03-01', end: '2025-03-25', category: 'Phase 2', progress: 30 },
  { task: 'Deployment', start: '2025-03-20', end: '2025-04-01', category: 'Phase 3', progress: 0 },
];

/**
 * Generate a comprehensive example for a theme
 */
async function generateThemeExample(theme: ThemeTokens): Promise<string> {
  console.log(`  Generating example for ${theme.name}...`);
  
  // Render diagrams
  const flowchartResult = await renderMermaidDiagram(FLOWCHART, theme);
  const sequenceResult = await renderMermaidDiagram(SEQUENCE, theme);
  const classResult = await renderMermaidDiagram(CLASS_DIAGRAM, theme);
  const barResult = renderBarChart(BAR_DATA, theme, { title: 'Quarterly Revenue' });
  const pieResult = renderPieChart(PIE_DATA, theme, { title: 'Team Allocation' });
  const ganttResult = renderGanttChart(GANTT_DATA, theme, { title: 'Project Timeline' });
  
  // Build sections
  const sections: Section[] = [
    {
      id: 'overview',
      title: 'System Overview',
      content: `<p>This example demonstrates the <strong>${theme.name}</strong> theme with both Mermaid diagrams and D3 charts. The theme uses a ${theme.mode} colour palette with carefully selected colours for optimal readability.</p>`,
      diagram: {
        svg: flowchartResult.svg,
        caption: 'Authentication Flow (Mermaid Flowchart)',
      },
    },
    {
      id: 'api-flow',
      title: 'API Communication',
      content: '<p>Sequence diagram showing the interaction between system components during user authentication.</p>',
      diagram: {
        svg: sequenceResult.svg,
        caption: 'API Sequence Diagram',
      },
    },
    {
      id: 'data-model',
      title: 'Data Model',
      content: '<p>Class diagram representing the core entities and their relationships in the system.</p>',
      diagram: {
        svg: classResult.svg,
        caption: 'Entity Relationships (Mermaid Class Diagram)',
      },
    },
    {
      id: 'metrics',
      title: 'Business Metrics',
      content: '<p>D3 bar chart showing quarterly revenue performance.</p>',
      diagram: {
        svg: barResult.svg,
        caption: 'Revenue by Quarter (D3 Bar Chart)',
      },
    },
    {
      id: 'resources',
      title: 'Resource Allocation',
      content: '<p>D3 pie chart showing team distribution across functions.</p>',
      diagram: {
        svg: pieResult.svg,
        caption: 'Team Distribution (D3 Pie Chart)',
      },
    },
    {
      id: 'timeline',
      title: 'Project Timeline',
      content: '<p>D3 Gantt chart showing project phases and progress.</p>',
      diagram: {
        svg: ganttResult.svg,
        caption: 'Development Schedule (D3 Gantt Chart)',
      },
    },
  ];
  
  // Generate HTML
  return buildHTML({
    title: `thought_bubble - ${theme.name} Theme`,
    subtitle: `Example visualization showcasing ${theme.mode} mode with Mermaid + D3`,
    theme: theme.id as ThemeName,
    navigationStyle: 'sidebar',
    sections,
    enableThemeSwitcher: true,
  });
}

/**
 * Main execution
 */
async function main() {
  console.log('Generating example HTML files...\n');
  
  const outputDir = path.resolve(__dirname, '../../../examples');
  
  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Generate examples for select themes
  const themesToGenerate: ThemeName[] = [
    'tokyo_night',
    'dracula',
    'github_light',
    'solarized_dark',
    'professional',
  ];
  
  for (const themeName of themesToGenerate) {
    const theme = getTheme(themeName);
    const html = await generateThemeExample(theme);
    
    const fileName = `theme_showcase_${themeName}.html`;
    const outputPath = path.join(outputDir, fileName);
    
    fs.writeFileSync(outputPath, html, 'utf-8');
    
    const stats = fs.statSync(outputPath);
    console.log(`    Written: ${fileName} (${(stats.size / 1024).toFixed(1)} KB)`);
  }
  
  console.log('\nExample generation complete!');
  console.log(`Output directory: ${outputDir}`);
}

main().catch(console.error);
