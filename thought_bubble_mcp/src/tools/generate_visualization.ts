/**
 * Tool: Generate Visualization
 * 
 * Generates beautiful HTML visualizations with server-side rendered
 * Mermaid diagrams and D3 charts using the unified theme system.
 */

import { z } from 'zod';
import { 
  renderMermaidDiagram, 
  isMermaidDiagramType,
  type MermaidDiagramType 
} from '../renderers/mermaid_renderer.js';
import { 
  renderD3Chart, 
  isD3ChartType,
  type D3ChartType 
} from '../renderers/d3_renderer.js';
import { 
  transformChartData 
} from '../renderers/data_transformer.js';
import { 
  buildHTML, 
  type Section, 
  type SectionRole,
  type NavigationStyle,
  type LayoutTemplate 
} from '../builders/html_builder.js';
import { 
  getTheme, 
  getThemeNames, 
  type ThemeName 
} from '../themes/index.js';
import { MERMAID_GENERATION_PROMPT } from '../prompts/templates.js';

/**
 * All supported diagram types
 */
export type DiagramType = MermaidDiagramType | D3ChartType;

/**
 * All theme names
 */
const allThemeNames = getThemeNames();

/**
 * Schema for generate_visualization tool
 */
export const generateVisualizationSchema = z.object({
  content: z.string().describe('The original documentation content'),
  selectedSystems: z.array(z.object({
    id: z.number().describe('The ID of the identified item'),
    title: z.string().describe('The title of the system/workflow'),
    description: z.string().describe('Brief description of the item'),
    diagramType: z.enum([
      // Mermaid types
      'flowchart', 'sequence', 'class', 'er', 'state',
      // D3 types
      'bar', 'pie', 'donut', 'line', 'area', 'gantt', 'timeline', 'quadrant',
      'sankey', 'radial', 'treemap'
    ]).describe('Type of diagram to generate'),
    // For Mermaid diagrams
    mermaidCode: z.string().optional().describe('Mermaid diagram code (for flowchart, sequence, class, er, state). Note: C4 not supported, use flowcharts with subgraphs.'),
    // For D3 charts
    chartData: z.array(z.any()).optional().describe('Data array for D3 charts'),
    chartOptions: z.object({
      title: z.string().optional(),
      xLabel: z.string().optional(),
      yLabel: z.string().optional(),
      emphasis: z.enum(['glow', 'shadow', 'lift', 'none']).optional()
        .describe('How to highlight key data. glow: luminous halo on peak values (best on dark themes). shadow: depth via drop shadow. lift: slight scale transform. none: flat.'),
      curve: z.enum(['smooth', 'sharp', 'step', 'natural']).optional()
        .describe('Line/area interpolation. smooth: monotone (time series). natural: organic curves. sharp: raw data points. step: discrete changes.'),
      animation: z.enum(['stagger', 'draw', 'grow', 'fade', 'none']).optional()
        .describe('Entry animation. stagger: elements appear sequentially. draw: line draws itself. grow: bars grow from baseline. fade: opacity transition. none: instant.'),
      colorStrategy: z.enum(['categorical', 'sequential', 'diverging', 'monochrome']).optional()
        .describe('Colour approach. categorical: distinct colours per group. sequential: light-to-dark for magnitude. diverging: two-pole scale for deviation. monochrome: single hue with depth.'),
      annotations: z.array(z.object({
        label: z.string(),
        x: z.union([z.string(), z.number()]),
        y: z.number(),
        dx: z.number().optional(),
        dy: z.number().optional(),
      })).optional()
        .describe('Key data point annotations. Every chart should tell a story -- annotations are how.'),
      patterns: z.boolean().optional()
        .describe('Add pattern fills alongside colour for accessibility (WCAG). Only use when explicitly required for accessibility compliance -- not a default visual treatment.'),
    }).optional().describe('Chart display options'),
    role: z.enum(['default', 'metric', 'pull-quote', 'lead', 'statement', 'full-width', 'supporting']).optional()
      .describe('Section role controlling visual treatment. metric: KPI card (dashboard). pull-quote: display-font blockquote (magazine). lead: wider opening paragraph. statement: large centred text (presentation). full-width: breakout visual. supporting: appendix/secondary.'),
  })).describe('Array of selected systems with their diagram specifications'),
  theme: z.enum([
    // New themes
    'tokyo_night', 'dracula', 'gruvbox', 'solarized_dark', 
    'solarized_light', 'github_light', 'github_dark',
    // Original themes  
    'professional', 'dark', 'technical', 'minimal', 'creative'
  ] as [ThemeName, ...ThemeName[]])
    .default('tokyo_night')
    .describe('Visual theme for the HTML output'),
  navigationStyle: z.enum(['sidebar', 'tabs', 'minimal'])
    .default('sidebar')
    .describe('Navigation pattern to use'),
  layout: z.enum([
    'sidebar', 'magazine', 'presentation', 'dashboard', 'minimal', 'editorial',
    'comparison', 'briefing', 'tutorial', 'scorecard', 'report', 'dossier', 'dialogue'
  ])
    .optional()
    .describe('Layout template. See layout descriptions in tool schema for guidance.'),
  hero: z.object({
    title: z.string().describe('Hero headline (for magazine and dossier layouts)'),
    subtitle: z.string().optional().describe('Hero subheadline'),
    metric: z.object({
      value: z.string().describe('Key metric value (e.g., "$9.4M")'),
      label: z.string().describe('Metric label (e.g., "Annual Revenue")'),
    }).optional().describe('Featured metric to display prominently'),
  }).optional().describe('Hero section configuration (used with magazine and dossier layouts)'),
  title: z.string().optional().describe('Page title'),
  subtitle: z.string().optional().describe('Page subtitle'),
  enableThemeSwitcher: z.boolean().default(true).describe('Include theme switcher in output'),
  density: z.enum(['compact', 'comfortable', 'spacious']).default('comfortable')
    .describe('Spacing density. compact: tight information-dense (dashboards, briefings). comfortable: balanced default. spacious: generous whitespace (editorial, minimal).'),
});

export type GenerateVisualizationInput = z.infer<typeof generateVisualizationSchema>;

/**
 * Result of visualization generation
 */
export interface VisualizationResult {
  html: string;
  success: boolean;
  errors: string[];
  stats: {
    sectionsRendered: number;
    diagramsRendered: number;
    theme: string;
    layout: string;
    fileSize: number;
  };
}

/**
 * Generate complete HTML visualization with rendered diagrams
 */
export async function generateVisualization(
  input: GenerateVisualizationInput
): Promise<VisualizationResult> {
  const errors: string[] = [];
  const theme = getTheme(input.theme as ThemeName);
  
  // Build sections with rendered diagrams
  const sections: Section[] = [];
  let diagramsRendered = 0;

  for (const system of input.selectedSystems) {
    let svgContent = '';
    
    // Render appropriate diagram type
    if (isMermaidDiagramType(system.diagramType)) {
      // Mermaid diagram
      if (!system.mermaidCode) {
        errors.push(`Missing mermaidCode for item ${system.id}: ${system.title}`);
        svgContent = createPlaceholderSvg(
          `Mermaid code required for ${system.diagramType} diagram`,
          theme
        );
      } else {
        const result = await renderMermaidDiagram(system.mermaidCode, theme);
        if (result.success) {
          svgContent = result.svg;
          diagramsRendered++;
        } else {
          errors.push(`Mermaid render error for item ${system.id}: ${result.error}`);
          svgContent = result.svg; // Error SVG placeholder
        }
      }
    } else if (isD3ChartType(system.diagramType)) {
      // D3 chart
      if (!system.chartData || system.chartData.length === 0) {
        errors.push(`Missing chartData for item ${system.id}: ${system.title}`);
        svgContent = createPlaceholderSvg(
          `Chart data required for ${system.diagramType} chart`,
          theme
        );
      } else {
        try {
          // Transform data to match chart type requirements
          const transformedData = transformChartData(
            system.chartData,
            system.diagramType
          );
          
          const result = renderD3Chart(
            system.diagramType,
            transformedData as any,
            theme,
            system.chartOptions || {}
          );
          
          if (result.success) {
            svgContent = result.svg;
            diagramsRendered++;
          } else {
            errors.push(`D3 render error for item ${system.id}: ${result.error}`);
            svgContent = result.svg; // Error SVG placeholder
          }
        } catch (transformError) {
          const errorMsg = transformError instanceof Error ? transformError.message : 'Unknown transformation error';
          errors.push(`Data transformation error for item ${system.id}: ${errorMsg}`);
          svgContent = createPlaceholderSvg(
            `Data transformation failed: ${errorMsg}`,
            theme
          );
        }
      }
    } else {
      errors.push(`Unknown diagram type for item ${system.id}: ${system.diagramType}`);
      svgContent = createPlaceholderSvg(`Unknown diagram type: ${system.diagramType}`, theme);
    }

    sections.push({
      id: `section-${system.id}`,
      title: system.title,
      content: `<p>${system.description}</p>`,
      diagram: {
        svg: svgContent,
        caption: system.chartOptions?.title || undefined,
      },
      animation: system.chartOptions?.animation,
      role: (system.role as SectionRole) || 'default',
    });
  }

  // Generate HTML
  const html = buildHTML({
    title: input.title || 'Documentation Visualization',
    subtitle: input.subtitle,
    theme: input.theme as ThemeName,
    navigationStyle: input.navigationStyle as NavigationStyle,
    layout: input.layout as LayoutTemplate | undefined,
    sections,
    enableThemeSwitcher: input.enableThemeSwitcher,
    hero: input.hero,
    density: input.density as any,
  });

  return {
    html,
    success: errors.length === 0,
    errors,
    stats: {
      sectionsRendered: sections.length,
      diagramsRendered,
      theme: theme.name,
      layout: input.layout || 'sidebar',
      fileSize: Buffer.byteLength(html, 'utf-8'),
    },
  };
}

/**
 * Generate a prompt for the LLM to create Mermaid diagrams
 * Use this when you don't have Mermaid code yet
 */
export function generateMermaidPrompt(input: {
  content: string;
  selectedSystems: Array<{
    id: number;
    title: string;
    description: string;
    diagramType: MermaidDiagramType;
  }>;
}): string {
  const selectedItemsText = input.selectedSystems
    .map((sys, idx) => 
      `${idx + 1}. ${sys.title} (${sys.description}) - Diagram type: ${sys.diagramType}`
    )
    .join('\n');

  return MERMAID_GENERATION_PROMPT
    .replace('{selectedItems}', selectedItemsText)
    .replace('{content}', input.content);
}

/**
 * Parse Mermaid diagrams from LLM response
 */
export function parseMermaidResponse(llmResponse: string): Record<number, string> {
  const diagrams: Record<number, string> = {};
  
  // Match patterns like "### Diagram for Item 1" followed by mermaid code blocks
  const diagramPattern = /###\s+Diagram for Item\s+(\d+)\s*\n```mermaid\s*\n([\s\S]+?)\n```/g;
  
  let match;
  while ((match = diagramPattern.exec(llmResponse)) !== null) {
    const itemId = parseInt(match[1], 10);
    const diagramCode = match[2].trim();
    diagrams[itemId] = diagramCode;
  }
  
  return diagrams;
}

/**
 * Create a placeholder SVG for missing content
 */
function createPlaceholderSvg(message: string, theme: any): string {
  const escapedMessage = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="150" viewBox="0 0 400 150">
  <rect width="400" height="150" fill="${theme.core.bg}" rx="8"/>
  <rect x="10" y="10" width="380" height="130" fill="${theme.ui.surface}" stroke="${theme.ui.border}" stroke-width="1" rx="6" stroke-dasharray="5,5"/>
  <text x="200" y="70" text-anchor="middle" fill="${theme.core.muted}" font-family="Inter, system-ui, sans-serif" font-size="14">
    ${escapedMessage.substring(0, 50)}${escapedMessage.length > 50 ? '...' : ''}
  </text>
  <text x="200" y="95" text-anchor="middle" fill="${theme.core.muted}" font-family="Inter, system-ui, sans-serif" font-size="12">
    Provide diagram code to render
  </text>
</svg>`;
}

/**
 * Get available theme names
 */
export { getThemeNames };

export default {
  generateVisualization,
  generateMermaidPrompt,
  parseMermaidResponse,
  getThemeNames,
};
