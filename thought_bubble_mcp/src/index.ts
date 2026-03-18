#!/usr/bin/env node

/**
 * thought_bubble MCP Server
 * 
 * Transforms documentation into beautiful interactive HTML visualizations
 * using AI-powered analysis and server-side rendered Mermaid/D3 diagrams.
 * 
 * Features:
 * - 12 curated themes (7 new + 5 original)
 * - Server-side SVG rendering with beautiful-mermaid
 * - D3 chart support (bar, pie, line, gantt, etc.)
 * - Self-contained HTML output (no CDN dependencies)
 * - Live theme switching
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { 
  analyzeContent, 
  analyzeContentSchema,
  type AnalyzeContentInput 
} from './tools/analyze_content.js';

import {
  generateVisualization,
  generateVisualizationSchema,
  generateMermaidPrompt,
  parseMermaidResponse,
  getThemeNames,
  type GenerateVisualizationInput
} from './tools/generate_visualization.js';

import { getTheme, themes } from './themes/index.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Create and configure the MCP server
 */
const server = new Server(
  {
    name: 'thought-bubble-mcp-server',
    version: '0.2.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Handler: List available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const themeNames = getThemeNames();
  
  return {
    tools: [
      {
        name: 'analyze_content',
        description: `thought_bubble is a communication platform — analyse content to identify how its story should be told visually, not just what data can be charted.

Returns a prompt with design guidelines for selecting appropriate layouts and diagram types.

LAYOUT SELECTION GUIDANCE (follow when recommending):
- Magazine: investor updates, case studies, quarterly reports (needs hero + key metric)
- Dashboard: KPI monitoring, metrics overview (needs metric-role sections at top)
- Presentation: pitch decks, board presentations (one visual per slide)
- Sidebar: API docs, technical reference with 7+ sections
- Minimal: single-topic deep dives, explainers
- Editorial: single-topic narratives, academic style
- Comparison: vendor evaluation, A/B tests, tech stack decisions
- Briefing: sprint reviews, weekly summaries, status updates
- Tutorial: onboarding docs, step-by-step guides, workshops
- Scorecard: maturity assessments, health checks, audits
- Report: RFCs, compliance docs, annual reports (print-friendly)
- Dossier: research synthesis, company profiles, market analysis
- Dialogue: ADRs, buy-vs-build decisions, structured for/against

The analysis will identify WORKFLOWS, SYSTEMS, DATA MODELS, and METRICS suitable for visualization.`,
        inputSchema: {
          type: 'object',
          properties: {
            content: {
              type: 'string',
              description: 'The documentation or content to analyze for visualization opportunities'
            }
          },
          required: ['content']
        }
      },
      {
        name: 'generate_visualization',
        description: `thought_bubble is a communication platform that uses diagrams and charts as its medium. It is not a charting library, not a dashboard generator, and not a slide deck wrapper. Every output must pass the Cool-kid Test: "Would I be embarrassed to show this in a design agency pitch AND at a mixed-media gallery opening in Friedrichshain-Kreuzberg at 3am on a Tuesday?" If yes, it does not ship.

Before generating, call get_design_guide to understand layout selection, typography, and chart styling principles. Three anti-patterns to actively avoid:
- The Sidebar Default: not every page is a docs site. Match layout to how the reader consumes the content.
- The Excel Export: if the chart could have been made in a spreadsheet, it has no identity. Annotate, distinguish, tell a story.
- The Font Famine: one typeface doing the work of three is a design failure. Use display + body at minimum.

LAYOUT SELECTION (choose based on content):
- magazine: hero section + alternating content grids (for reports, updates)
- dashboard: metric cards + responsive chart grid (for KPIs, monitoring)
- presentation: full-height slides with snap scroll (for pitches, reviews)
- sidebar: fixed navigation + scrollable content (for docs, references)
- minimal: single-column, visual-focused (for deep dives)
- editorial: centred academic style (for narratives, explainers)
- comparison: parallel columns for A/B evaluation (vendor eval, tech decisions)
- briefing: lead item + grid + stats strip (sprint reviews, status updates)
- tutorial: numbered steps with progress spine (guides, onboarding)
- scorecard: overall score + category cards with semantic colours (audits, assessments)
- report: cover + TOC + numbered sections, print-friendly (RFCs, compliance)
- dossier: profile header + facts + narrative + deep dives (research, company profiles)
- dialogue: central question + parallel arguments + trade-offs (ADRs, decision docs)

DESIGN REQUIREMENTS:
- Gradient fills on charts (not flat colours)
- Hover states and tooltips on interactive elements
- Annotate key data points — charts tell stories, not just display numbers
- 8px spacing grid, 24px minimum padding
- 2+ font families (display + body minimum), 65ch max line width

Supports 12 themes with theme-specific typography via Google Fonts.`,
        inputSchema: {
          type: 'object',
          properties: {
            content: {
              type: 'string',
              description: 'The original documentation content'
            },
            selectedSystems: {
              type: 'array',
              description: 'Array of selected systems with their diagram specifications',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'number',
                    description: 'The ID of the identified item'
                  },
                  title: {
                    type: 'string',
                    description: 'The title of the system/workflow'
                  },
                  description: {
                    type: 'string',
                    description: 'Brief description of the item'
                  },
                  diagramType: {
                    type: 'string',
                    enum: [
                      'flowchart', 'sequence', 'class', 'er', 'state',
                      'bar', 'pie', 'donut', 'line', 'area', 'gantt', 'timeline', 'quadrant',
                      'sankey', 'radial', 'treemap'
                    ],
                    description: 'Section type. Charts: bar (exact comparison), line (trends over time), area (cumulative/volume), pie/donut (composition, max 6 slices), radial (multi-axis comparison), gantt (project timelines), timeline (event sequences), quadrant (2D positioning), sankey (flow volumes), treemap (hierarchical proportions). Diagrams: flowchart (processes), sequence (interactions), class (data models), er (schemas), state (transitions). Use bar when comparison matters. Use line for temporal trends. Never use pie for more than 6 categories.'
                  },
                  mermaidCode: {
                    type: 'string',
                    description: 'Mermaid diagram code (required for flowchart, sequence, class, er, state). Note: C4 not supported.'
                  },
                  chartData: {
                    type: 'array',
                    description: 'Data array for D3 charts (required for bar, pie, donut, line, area, gantt, timeline, quadrant, sankey, radial, treemap)',
                    items: { type: 'object' }
                  },
                  chartOptions: {
                    type: 'object',
                    description: 'Chart display options and creative levers',
                    properties: {
                      title: { type: 'string' },
                      xLabel: { type: 'string' },
                      yLabel: { type: 'string' },
                      emphasis: {
                        type: 'string',
                        enum: ['glow', 'shadow', 'lift', 'none'],
                        description: 'How to highlight key data. glow: luminous halo on peak values (best on dark themes). shadow: depth via drop shadow. lift: slight scale transform. none: flat.'
                      },
                      curve: {
                        type: 'string',
                        enum: ['smooth', 'sharp', 'step', 'natural'],
                        description: 'Line/area interpolation. smooth: monotone (time series). natural: organic curves. sharp: raw data points. step: discrete changes.'
                      },
                      animation: {
                        type: 'string',
                        enum: ['stagger', 'draw', 'grow', 'fade', 'none'],
                        description: 'Entry animation. stagger: elements appear sequentially. draw: line draws itself. grow: bars grow from baseline. fade: opacity transition. none: instant.'
                      },
                      colorStrategy: {
                        type: 'string',
                        enum: ['categorical', 'sequential', 'diverging', 'monochrome'],
                        description: 'Colour approach. categorical: distinct colours per group. sequential: light-to-dark for magnitude. diverging: two-pole scale for deviation. monochrome: single hue with depth.'
                      },
                      annotations: {
                        type: 'array',
                        description: 'Key data point annotations. Every chart should tell a story -- annotations are how.',
                        items: {
                          type: 'object',
                          properties: {
                            label: { type: 'string' },
                            x: { oneOf: [{ type: 'string' }, { type: 'number' }] },
                            y: { type: 'number' },
                            dx: { type: 'number' },
                            dy: { type: 'number' }
                          },
                          required: ['label', 'x', 'y']
                        }
                      },
                      patterns: {
                        type: 'boolean',
                        description: 'Add pattern fills alongside colour for accessibility (WCAG). Only use when explicitly required for accessibility compliance -- not a default visual treatment.'
                      }
                    }
                  },
                  role: {
                    type: 'string',
                    enum: ['default', 'metric', 'pull-quote', 'lead', 'statement', 'full-width', 'supporting'],
                    description: 'Section role controlling visual treatment. metric: KPI card (dashboard). pull-quote: display-font blockquote (magazine). lead: wider opening paragraph. statement: large centred text (presentation). full-width: breakout visual. supporting: appendix/secondary.'
                  }
                },
                required: ['id', 'title', 'description', 'diagramType']
              }
            },
            theme: {
              type: 'string',
              enum: themeNames,
              default: 'tokyo_night',
              description: 'Visual theme. tokyo_night: modern tech, confident, Satoshi + Inter (technical content). dracula: dark, focused, gothic, Space Grotesk + IBM Plex (dramatic, deep dives). gruvbox: warm, retro-modern, earthy, Fraunces + Source Sans (editorial, essays). solarized_dark/solarized_light: scientific precision, Roboto Slab + Noto Sans (research, data-heavy). github_light: clean corporate, Inter + system (enterprise, documentation). github_dark: modern developer, Inter + system (technical, dev-facing). professional: polished business (reports, corporate). dark: high-contrast dark (presentations, demos). technical: engineering precision (architecture, specs). minimal: refined quiet, Cormorant + Lora (deep dives, academic). creative: bold expressive, Clash Display + Cabinet Grotesk (pitches, marketing).'
            },
            navigationStyle: {
              type: 'string',
              enum: ['sidebar', 'tabs', 'minimal'],
              default: 'sidebar',
              description: 'Navigation pattern (legacy - use layout instead for new templates)'
            },
            layout: {
              type: 'string',
              enum: [
                'sidebar', 'magazine', 'presentation', 'dashboard', 'minimal', 'editorial',
                'comparison', 'briefing', 'tutorial', 'scorecard', 'report', 'dossier', 'dialogue'
              ],
              description: 'Layout template. editorial: centred single-column, academic style (essays, narratives). magazine: hero + alternating grids (reports, case studies). presentation: full-viewport snap-scroll slides (pitches, reviews). dashboard: metric cards + chart grid (KPIs, monitoring). sidebar: fixed nav + scrollable content (docs, 7+ sections). minimal: visual-first hero (deep dives). comparison: parallel columns for A/B evaluation (vendor eval, tech decisions). briefing: lead item + grid + stats strip (sprint reviews, status updates). tutorial: numbered steps with progress spine (guides, onboarding). scorecard: overall score + semantic-colour category cards (audits, assessments). report: cover + TOC + numbered sections, print-friendly (RFCs, compliance). dossier: profile header + facts strip + narrative + deep dives (research, company profiles). dialogue: central question + parallel arguments + trade-offs (ADRs, decision docs).'
            },
            hero: {
              type: 'object',
              description: 'Hero section for magazine and dossier layouts - displays key metric prominently',
              properties: {
                title: {
                  type: 'string',
                  description: 'Hero headline (e.g., "From Zero to $10M ARR in 18 Months")'
                },
                subtitle: {
                  type: 'string',
                  description: 'Hero subheadline'
                },
                metric: {
                  type: 'object',
                  description: 'Featured metric to display prominently',
                  properties: {
                    value: { type: 'string', description: 'Metric value (e.g., "$9.4M")' },
                    label: { type: 'string', description: 'Metric label (e.g., "Annual Revenue")' }
                  }
                }
              }
            },
            title: {
              type: 'string',
              description: 'Page title'
            },
            subtitle: {
              type: 'string',
              description: 'Page subtitle'
            },
            enableThemeSwitcher: {
              type: 'boolean',
              default: true,
              description: 'Include theme switcher dropdown in output'
            },
            density: {
              type: 'string',
              enum: ['compact', 'comfortable', 'spacious'],
              default: 'comfortable',
              description: 'Spacing density. compact: tight information-dense (dashboards, briefings). comfortable: balanced default. spacious: generous whitespace (editorial, minimal).'
            }
          },
          required: ['content', 'selectedSystems']
        }
      },
      {
        name: 'generate_mermaid_prompt',
        description: 'Generate a prompt for the LLM to create Mermaid diagram code. Use this when you need the LLM to generate diagram code first.',
        inputSchema: {
          type: 'object',
          properties: {
            content: {
              type: 'string',
              description: 'The documentation content'
            },
            selectedSystems: {
              type: 'array',
              description: 'Systems that need Mermaid diagrams',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  title: { type: 'string' },
                  description: { type: 'string' },
                  diagramType: {
                    type: 'string',
                    enum: ['flowchart', 'sequence', 'class', 'er', 'state']
                  }
                },
                required: ['id', 'title', 'description', 'diagramType']
              }
            }
          },
          required: ['content', 'selectedSystems']
        }
      },
      {
        name: 'list_themes',
        description: 'List all available themes with their details (name, mode, category)',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'get_design_guide',
        description: 'Get the thought_bubble design system guidelines directly from source markdown files. Use this before generating visualizations to understand design principles, layout selection, typography, D3 styling, spacing, and quality standards.',
        inputSchema: {
          type: 'object',
          properties: {
            section: {
              type: 'string',
              enum: ['design', 'layouts', 'typography', 'd3', 'spacing', 'color', 'pov'],
              default: 'design',
              description: 'Which guide to retrieve: design (overview), layouts (layout templates), typography (font system), d3 (chart styling), spacing (grid system), color (color theory), pov (product philosophy and quality gates)'
            }
          }
        }
      }
    ]
  };
});

/**
 * Handler: Call a tool
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'analyze_content') {
      const input = analyzeContentSchema.parse(args) as AnalyzeContentInput;
      const prompt = analyzeContent(input);
      
      return {
        content: [
          {
            type: 'text',
            text: 'ANALYSIS PROMPT FOR LLM:\n\n' + prompt + '\n\n---\n\nSend this prompt to your LLM to identify visualization opportunities. The LLM will return a structured list of systems, workflows, and data models found in the content.'
          }
        ]
      };
    }

    if (name === 'generate_visualization') {
      const input = generateVisualizationSchema.parse(args) as GenerateVisualizationInput;
      const result = await generateVisualization(input);
      
      const config = getWorkspaceConfig();
      const outputDir = path.join(config.workspace, 'test_outputs');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const filename = `visualization_${Date.now()}.html`;
      const outputPath = path.join(outputDir, filename);
      fs.writeFileSync(outputPath, result.html, 'utf-8');

      const statsBlock = `Stats:\n- Theme: ${result.stats.theme}\n- Layout: ${result.stats.layout}\n- Sections: ${result.stats.sectionsRendered}\n- Diagrams rendered: ${result.stats.diagramsRendered}\n- File size: ${(result.stats.fileSize / 1024).toFixed(1)} KB`;

      if (result.success) {
        return {
          content: [
            {
              type: 'text',
              text: `HTML visualization generated successfully!\n\nFile: ${outputPath}\n\n${statsBlock}`
            }
          ]
        };
      } else {
        return {
          content: [
            {
              type: 'text',
              text: `HTML visualization generated with warnings:\n\nFile: ${outputPath}\n\nErrors:\n${result.errors.map(e => '- ' + e).join('\n')}\n\n${statsBlock}`
            }
          ]
        };
      }
    }

    if (name === 'generate_mermaid_prompt') {
      const input = z.object({
        content: z.string(),
        selectedSystems: z.array(z.object({
          id: z.number(),
          title: z.string(),
          description: z.string(),
          diagramType: z.enum(['flowchart', 'sequence', 'class', 'er', 'state'])
        }))
      }).parse(args);

      const prompt = generateMermaidPrompt(input);
      
      return {
        content: [
          {
            type: 'text',
            text: `MERMAID GENERATION PROMPT:\n\n${prompt}\n\n---\n\nSend this prompt to the LLM. Once you receive the Mermaid code, use generate_visualization with the mermaidCode field populated.`
          }
        ]
      };
    }

    if (name === 'list_themes') {
      const themeList = Object.entries(themes).map(([id, theme]) => ({
        id,
        name: theme.name,
        mode: theme.mode,
        category: theme.category,
        colors: {
          background: theme.core.bg,
          foreground: theme.core.fg,
          accent: theme.core.accent,
        }
      }));

      const newThemes = themeList.filter(t => t.category === 'new');
      const originalThemes = themeList.filter(t => t.category === 'original');

      let output = '# Available Themes\n\n';
      output += '## New Themes (7)\n\n';
      newThemes.forEach(t => {
        output += `- **${t.name}** (${t.id}): ${t.mode} mode\n`;
        output += `  - Background: ${t.colors.background}\n`;
        output += `  - Foreground: ${t.colors.foreground}\n`;
        output += `  - Accent: ${t.colors.accent}\n\n`;
      });

      output += '## Original Themes (5)\n\n';
      originalThemes.forEach(t => {
        output += `- **${t.name}** (${t.id}): ${t.mode} mode\n`;
        output += `  - Background: ${t.colors.background}\n`;
        output += `  - Foreground: ${t.colors.foreground}\n`;
        output += `  - Accent: ${t.colors.accent}\n\n`;
      });

      return {
        content: [
          {
            type: 'text',
            text: output
          }
        ]
      };
    }

    if (name === 'get_design_guide') {
      const section = (args as any)?.section || 'design';
      
      // Map section names to actual markdown files
      const fileMap: Record<string, string> = {
        'design': 'DesignGuide.md',
        'layouts': 'Layouts.md',
        'typography': 'Typography.md',
        'd3': 'D3StyleGuide.md',
        'spacing': 'Spacing.md',
        'color': 'ColorTheory.md',
        'pov': 'POV.md'
      };
      
      const filename = fileMap[section];
      if (!filename) {
        throw new McpError(
          ErrorCode.InvalidParams,
          `Unknown section: ${section}. Valid sections: ${Object.keys(fileMap).join(', ')}`
        );
      }
      
      // Read from actual source files
      const guidePath = path.resolve(__dirname, '../../DesignTeam/DesignGuide', filename);
      
      try {
        const guideContent = fs.readFileSync(guidePath, 'utf-8');
        
        return {
          content: [
            {
              type: 'text',
              text: `# Design Guide: ${section}\n\n${guideContent}\n\n---\n\nSource: DesignTeam/DesignGuide/${filename}`
            }
          ]
        };
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to read design guide: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    throw new McpError(
      ErrorCode.MethodNotFound,
      `Unknown tool: ${name}`
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`
      );
    }
    throw error;
  }
});

/**
 * Get workspace configuration
 */
function getWorkspaceConfig() {
  const workspace = process.env.THOUGHT_BUBBLE_WORKSPACE;
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  return {
    workspace: workspace || process.cwd(),
    nodeEnv,
    hasWorkspaceConfig: !!workspace
  };
}

/**
 * Graceful shutdown -- ensures server.close() is called when
 * Cursor kills the MCP process or an unrecoverable error occurs.
 */
const cleanup = () => {
  console.error('thought_bubble MCP Server shutting down...');
  server.close();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

process.on('exit', () => {
  console.error('thought_bubble MCP Server exited');
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  cleanup();
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  const config = getWorkspaceConfig();
  
  // Log to stderr (stdout is reserved for MCP protocol messages)
  console.error('thought_bubble MCP Server v0.2.0 running on stdio');
  console.error('Features: beautiful-mermaid + D3 | 12 themes | Server-side SVG');
  console.error('Workspace:', config.workspace);
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
