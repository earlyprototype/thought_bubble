/**
 * Proof of Concept: Unified Theming for beautiful-mermaid + D3
 * 
 * This script validates that:
 * 1. beautiful-mermaid renders with our theme tokens
 * 2. D3 renders server-side with jsdom
 * 3. Both outputs share the same visual language
 * 4. The resulting HTML is self-contained and works offline
 */

import { renderMermaid } from 'beautiful-mermaid';
import * as d3 from 'd3';
import { JSDOM } from 'jsdom';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { tokyoNight, themeToCSS, themeToCSSVariables } from '../themes/index.js';
import type { ThemeTokens } from '../themes/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Render a Mermaid diagram using beautiful-mermaid with our theme
 */
async function renderMermaidWithTheme(code: string, theme: ThemeTokens): Promise<string> {
  const svg = await renderMermaid(code, {
    bg: theme.core.bg,
    fg: theme.core.fg,
    accent: theme.core.accent,
    muted: theme.core.muted,
  });
  return svg;
}

/**
 * Render a D3 bar chart server-side using jsdom
 */
function renderD3BarChart(data: { label: string; value: number }[], theme: ThemeTokens): string {
  // Create a virtual DOM
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  const document = dom.window.document;
  const body = d3.select(document.body);

  // Chart dimensions
  const width = 600;
  const height = 400;
  const margin = { top: 40, right: 30, bottom: 60, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Create SVG
  const svg = body.append('svg')
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('font-family', 'Inter, system-ui, sans-serif');

  // Background
  svg.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', theme.core.bg);

  // Chart group
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Scales
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.label))
    .range([0, innerWidth])
    .padding(0.3);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value) || 0])
    .nice()
    .range([innerHeight, 0]);

  // Color scale using theme primary colors
  const colorScale = d3.scaleOrdinal<string>()
    .domain(data.map(d => d.label))
    .range(theme.scales.primary);

  // Grid lines
  g.append('g')
    .attr('class', 'grid')
    .call(d3.axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickFormat(() => ''))
    .selectAll('line')
    .attr('stroke', theme.ui.border)
    .attr('stroke-opacity', 0.5);

  g.selectAll('.grid .domain').remove();

  // Bars
  g.selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => xScale(d.label) || 0)
    .attr('y', d => yScale(d.value))
    .attr('width', xScale.bandwidth())
    .attr('height', d => innerHeight - yScale(d.value))
    .attr('fill', d => colorScale(d.label))
    .attr('rx', 4)
    .attr('ry', 4);

  // X axis
  g.append('g')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale))
    .selectAll('text')
    .attr('fill', theme.core.fg)
    .attr('font-size', '12px');

  g.selectAll('.domain, .tick line')
    .attr('stroke', theme.core.muted);

  // Y axis
  g.append('g')
    .call(d3.axisLeft(yScale))
    .selectAll('text')
    .attr('fill', theme.core.fg)
    .attr('font-size', '12px');

  // Title
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', 25)
    .attr('text-anchor', 'middle')
    .attr('fill', theme.core.fg)
    .attr('font-size', '16px')
    .attr('font-weight', '600')
    .text('Project Progress by Phase');

  // Value labels on bars
  g.selectAll('.label')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'label')
    .attr('x', d => (xScale(d.label) || 0) + xScale.bandwidth() / 2)
    .attr('y', d => yScale(d.value) - 8)
    .attr('text-anchor', 'middle')
    .attr('fill', theme.core.fg)
    .attr('font-size', '12px')
    .attr('font-weight', '500')
    .text(d => d.value + '%');

  return body.html();
}

/**
 * Generate the complete HTML file
 */
function generateHTML(
  mermaidSvg: string,
  d3Svg: string,
  theme: ThemeTokens
): string {
  const cssVars = themeToCSSVariables(theme);
  const cssVarsString = Object.entries(cssVars)
    .map(([key, value]) => `    ${key}: ${value};`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>thought_bubble - Proof of Concept: ${theme.name} Theme</title>
  <style>
    :root {
${cssVarsString}
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      background: var(--bg);
      color: var(--fg);
      min-height: 100vh;
      padding: 40px;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border);
    }
    
    h1 {
      font-size: 2.5rem;
      margin-bottom: 10px;
      color: var(--accent);
    }
    
    .subtitle {
      color: var(--text-secondary);
      font-size: 1.1rem;
    }
    
    .theme-badge {
      display: inline-block;
      background: var(--surface);
      border: 1px solid var(--border);
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 0.85rem;
      color: var(--accent);
      margin-top: 10px;
    }
    
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 30px;
      margin-bottom: 40px;
    }
    
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 20px var(--shadow);
    }
    
    .card h2 {
      font-size: 1.25rem;
      margin-bottom: 16px;
      color: var(--fg);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .card h2::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 20px;
      background: var(--accent);
      border-radius: 2px;
    }
    
    .diagram-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 300px;
      overflow: auto;
    }
    
    .diagram-container svg {
      max-width: 100%;
      height: auto;
    }
    
    .color-palette {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 20px;
    }
    
    .color-swatch {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      border: 1px solid var(--border);
    }
    
    .meta {
      text-align: center;
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid var(--border);
    }
    
    .meta strong {
      color: var(--fg);
    }
    
    @media (max-width: 768px) {
      body {
        padding: 20px;
      }
      
      h1 {
        font-size: 1.75rem;
      }
      
      .grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>thought_bubble</h1>
      <p class="subtitle">Proof of Concept: Unified Theming for Mermaid + D3</p>
      <span class="theme-badge">${theme.name} Theme (${theme.mode})</span>
    </header>
    
    <div class="grid">
      <div class="card">
        <h2>Mermaid Diagram (beautiful-mermaid)</h2>
        <div class="diagram-container">
          ${mermaidSvg}
        </div>
      </div>
      
      <div class="card">
        <h2>D3 Bar Chart (server-side rendered)</h2>
        <div class="diagram-container">
          ${d3Svg}
        </div>
      </div>
    </div>
    
    <div class="card">
      <h2>Theme Color Palette</h2>
      <p style="color: var(--text-secondary); margin-bottom: 16px;">
        Primary scale colours used across both diagram types for visual consistency.
      </p>
      <div class="color-palette">
        ${theme.scales.primary.map(color => 
          `<div class="color-swatch" style="background: ${color};" title="${color}"></div>`
        ).join('\n        ')}
      </div>
    </div>
    
    <div class="meta">
      <p>
        <strong>Self-contained HTML</strong> - No external dependencies required.
        Both SVGs are embedded directly, using the <strong>${theme.name}</strong> theme tokens.
      </p>
      <p style="margin-top: 8px;">
        Generated by thought_bubble MCP Server
      </p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Main execution
 */
async function main() {
  console.log('Starting proof of concept...\n');

  const theme = tokyoNight;
  console.log(`Using theme: ${theme.name} (${theme.mode})`);

  // Sample Mermaid diagram
  const mermaidCode = `
graph TD
    A[User Request] --> B{Authentication}
    B -->|Valid| C[Process Request]
    B -->|Invalid| D[Return Error]
    C --> E{Authorization}
    E -->|Allowed| F[Execute Action]
    E -->|Denied| G[Access Denied]
    F --> H[Return Response]
    G --> H
    D --> H
`;

  console.log('Rendering Mermaid diagram...');
  const mermaidSvg = await renderMermaidWithTheme(mermaidCode, theme);
  console.log('  Done: Mermaid SVG generated');

  // Sample D3 data
  const chartData = [
    { label: 'Planning', value: 100 },
    { label: 'Design', value: 85 },
    { label: 'Development', value: 60 },
    { label: 'Testing', value: 35 },
    { label: 'Deployment', value: 10 },
  ];

  console.log('Rendering D3 bar chart...');
  const d3Svg = renderD3BarChart(chartData, theme);
  console.log('  Done: D3 SVG generated');

  // Generate HTML
  console.log('Generating HTML file...');
  const html = generateHTML(mermaidSvg, d3Svg, theme);

  // Write to file
  const outputDir = path.resolve(__dirname, '../../../examples');
  const outputPath = path.join(outputDir, 'proof_of_concept_tokyo_night.html');
  
  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, html, 'utf-8');
  console.log(`\nSuccess! Output written to:\n  ${outputPath}`);
  
  // Stats
  const stats = fs.statSync(outputPath);
  console.log(`\nFile size: ${(stats.size / 1024).toFixed(1)} KB`);
  console.log('\nOpen the HTML file in a browser to verify visual cohesion.');
}

main().catch(console.error);
