/**
 * Timeline Example Generator
 * 
 * Creates an example HTML file showcasing the new timeline chart
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { renderTimelineChart, type TimelineData } from './d3_renderer.js';
import { renderMermaidDiagram } from './mermaid_renderer.js';
import { buildHTML, type Section } from '../builders/html_builder.js';
import { getTheme } from '../themes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const theme = getTheme('tokyo_night');

// Sample timeline data - Product Development Milestones
const TIMELINE_DATA: TimelineData[] = [
  { 
    event: 'Project Kickoff', 
    date: '2025-01-15',
    description: 'Initial planning and team assembly'
  },
  { 
    event: 'Requirements Finalized', 
    date: '2025-02-01',
    description: 'All feature requirements documented'
  },
  { 
    event: 'Design Phase Complete', 
    date: '2025-02-20',
    description: 'UI/UX designs approved'
  },
  { 
    event: 'Alpha Release', 
    date: '2025-03-15',
    description: 'Internal testing begins'
  },
  { 
    event: 'Beta Release', 
    date: '2025-04-01',
    description: 'Limited public testing'
  },
  { 
    event: 'Production Launch', 
    date: '2025-05-01',
    description: 'Full public release'
  },
];

// Flowchart showing timeline integration
const FLOWCHART = `graph TD
    A[Timeline Visualization] --> B{Data Type}
    B -->|Events| C[Timeline Chart]
    B -->|Tasks| D[Gantt Chart]
    C --> E[Horizontal Layout]
    C --> F[Vertical Layout]
    D --> G[Task Scheduling]`;

async function main() {
  console.log('Generating timeline example...\n');

  // Render timeline chart (horizontal)
  console.log('Rendering horizontal timeline...');
  const horizontalTimeline = renderTimelineChart(TIMELINE_DATA, theme, {
    title: 'Product Development Timeline (Horizontal)',
    orientation: 'horizontal',
  });

  if (!horizontalTimeline.success) {
    console.error('Failed to render horizontal timeline:', horizontalTimeline.error);
    return;
  }

  // Render timeline chart (vertical)
  console.log('Rendering vertical timeline...');
  const verticalTimeline = renderTimelineChart(TIMELINE_DATA, theme, {
    title: 'Product Development Timeline (Vertical)',
    orientation: 'vertical',
  });

  if (!verticalTimeline.success) {
    console.error('Failed to render vertical timeline:', verticalTimeline.error);
    return;
  }

  // Render flowchart
  console.log('Rendering flowchart...');
  const flowchartResult = await renderMermaidDiagram(FLOWCHART, theme);

  if (!flowchartResult.success) {
    console.error('Failed to render flowchart:', flowchartResult.error);
    return;
  }

  // Build sections
  const sections: Section[] = [
    {
      id: 'intro',
      title: 'Timeline Chart Overview',
      content: `<p>The timeline chart is a new D3 visualization type added to thought_bubble. Unlike Gantt charts which show task durations, timeline charts display discrete events at specific points in time.</p>
      <p><strong>Key Features:</strong></p>
      <ul style="margin-left: 20px; margin-top: 10px;">
        <li>Horizontal or vertical orientation</li>
        <li>Alternating event positions for clarity</li>
        <li>Event markers with custom colours</li>
        <li>Date labels and optional descriptions</li>
        <li>Themeable with all 12 thought_bubble themes</li>
      </ul>`,
    },
    {
      id: 'horizontal',
      title: 'Horizontal Timeline',
      content: '<p>Events are displayed along a horizontal time axis, with alternating positions above and below the axis line. This layout is ideal for viewing chronological progression at a glance.</p>',
      diagram: {
        svg: horizontalTimeline.svg,
        caption: 'Horizontal timeline showing product development milestones',
      },
    },
    {
      id: 'vertical',
      title: 'Vertical Timeline',
      content: '<p>Events are displayed along a vertical time axis, with alternating positions left and right. This layout is better for displaying many events or when vertical space is available.</p>',
      diagram: {
        svg: verticalTimeline.svg,
        caption: 'Vertical timeline showing the same milestones',
      },
    },
    {
      id: 'integration',
      title: 'Timeline vs Gantt',
      content: '<p>Timeline charts complement Gantt charts by focusing on discrete events rather than task durations. Use timeline charts for milestones, historical events, or any point-in-time data.</p>',
      diagram: {
        svg: flowchartResult.svg,
        caption: 'Decision flow for choosing between timeline and Gantt charts',
      },
    },
  ];

  // Generate HTML
  console.log('Building HTML...');
  const html = buildHTML({
    title: 'Timeline Chart Example - thought_bubble',
    subtitle: 'New D3 Timeline Visualization',
    theme: 'tokyo_night',
    navigationStyle: 'sidebar',
    sections,
    enableThemeSwitcher: true,
  });

  // Write to file
  const outputDir = path.resolve(__dirname, '../../../examples');
  const outputPath = path.join(outputDir, 'timeline_chart_example.html');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, html, 'utf-8');

  const stats = fs.statSync(outputPath);
  console.log(`\nSuccess! Timeline example written to:\n  ${outputPath}`);
  console.log(`File size: ${(stats.size / 1024).toFixed(1)} KB`);
  console.log('\nTimeline chart implementation verified.');
}

main().catch(console.error);
