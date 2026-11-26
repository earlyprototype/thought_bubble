import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod/v4';

import { analyzeContent, analyzeContentSchema } from './tools/analyze_content.js';
import {
  generateVisualization,
  generateVisualizationSchema,
  generateMermaidPrompt,
  generateMermaidPromptSchema,
} from './tools/generate_visualization.js';
import { themes } from './themes/index.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Create and configure the MCP server
 */
export const server = new Server(
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

const designGuideSchema = z.object({
  section: z.enum(['design', 'layouts', 'typography', 'd3', 'spacing', 'color', 'pov'])
    .default('design')
    .describe('Choose design for the overview, layouts for page templates, typography for fonts, d3 for chart styling, spacing for the grid, color for palettes, or pov for design principles.'),
});

function inputSchema(schema: z.ZodObject) {
  return z.toJSONSchema(schema, { target: 'draft-2020-12', io: 'input' });
}

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'analyze_content',
      description: `Use this when a user wants a visual HTML page from a document, report, spec or notes and you need to identify which sections to visualize. This is step 1 of 2.

RETURNS: A prompt to send to the LLM. It asks for candidate sections grouped by category, each with a title, description and suggested diagram or chart type. Ask the user which sections to keep, then pass their choices to generate_visualization as selectedSystems.

Choose visuals that explain the material. For example, show a workflow as a flowchart and a trend as a line chart.`,
      inputSchema: inputSchema(analyzeContentSchema),
    },
    {
      name: 'generate_visualization',
      description: `Use this when the user is ready to produce the final themed HTML page. This is step 2 of 2. Use analyze_content first to identify candidate sections, then supply the user's choices as selectedSystems. Mermaid diagrams require mermaidCode. D3 charts require chartData.

RETURNS: Writes a self-contained HTML page to <workspace>/test_outputs/visualization_<timestamp>.html and returns its file path, theme, layout and file size. The counts cover sections processed and successful renders before layout. A layout may omit some sections or visuals. Open the returned path to view the page. Diagrams and charts are embedded as server-rendered SVG and need no CDN to display. Theme fonts can load from external services.

For layout, typography or chart styling guidance, call get_design_guide. Match the layout to how the reader will use the page and annotate data points that explain the main finding.`,
      inputSchema: inputSchema(generateVisualizationSchema),
    },
    {
      name: 'generate_mermaid_prompt',
      description: `Use this when sections selected after analyze_content need Mermaid source before you call generate_visualization.

RETURNS: A prompt to send to the LLM. Put the resulting Mermaid source in the matching section's mermaidCode field.`,
      inputSchema: inputSchema(generateMermaidPromptSchema),
    },
    {
      name: 'list_themes',
      description: `Use this when choosing a theme for generate_visualization.

RETURNS: A Markdown list of theme names and IDs grouped by category, with each theme's mode, background, foreground and accent colors. Pass the chosen ID as theme.`,
      inputSchema: inputSchema(z.object({})),
    },
    {
      name: 'get_design_guide',
      description: `Use this when you need layout, typography, color or chart styling guidance before calling generate_visualization.

RETURNS: The requested design guide section as Markdown, or core design principles if the local guide is unavailable.`,
      inputSchema: inputSchema(designGuideSchema),
    },
  ],
}));

/**
 * Handler: Call a tool
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'analyze_content') {
      const input = analyzeContentSchema.parse(args);
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
      const input = generateVisualizationSchema.parse(args);
      const result = await generateVisualization(input);

      const config = getWorkspaceConfig();
      const outputDir = path.join(config.workspace, 'test_outputs');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const filename = `visualization_${Date.now()}.html`;
      const outputPath = path.join(outputDir, filename);
      fs.writeFileSync(outputPath, result.html, 'utf-8');

      const statsBlock = `Stats:\n- Theme: ${result.stats.theme}\n- Layout: ${result.stats.layout}\n- Sections processed: ${result.stats.sectionsRendered}\n- Successful renders before layout: ${result.stats.diagramsRendered}\n- File size: ${(result.stats.fileSize / 1024).toFixed(1)} KB`;

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
      const input = generateMermaidPromptSchema.parse(args);
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
      const { section } = designGuideSchema.parse(args ?? {});

      // Map section names to actual markdown files
      const fileMap = {
        'design': 'DesignGuide.md',
        'layouts': 'Layouts.md',
        'typography': 'Typography.md',
        'd3': 'D3StyleGuide.md',
        'spacing': 'Spacing.md',
        'color': 'ColorTheory.md',
        'pov': 'POV.md'
      };

      const filename = fileMap[section];
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
        // DesignTeam/DesignGuide is a gitignored local add-on, so a fresh
        // clone/install won't have it. Fall back instead of throwing.
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          return {
            content: [
              {
                type: 'text',
                text: `# Design Guide: ${section}\n\nThe full design guide (DesignTeam/DesignGuide/${filename}) is an optional local add-on and isn't included in this repository, so it isn't available here.\n\nCore principles to apply in the meantime:\n\n1. **Content First** -- visual design enhances the content, it doesn't distract from it.\n2. **Progressive Disclosure** -- lead with the overview, reveal detail on demand.\n3. **Consistency** -- uniform spacing, colours, and typography throughout.\n\n(See LLM_Design_Assets/ESSENTIAL_DESIGN_RULES.md for the fuller fallback rule set.)`
              }
            ]
          };
        }
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
        `Invalid parameters: ${error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`
      );
    }
    throw error;
  }
});

/**
 * Get workspace configuration
 */
export function getWorkspaceConfig() {
  const workspace = process.env.THOUGHT_BUBBLE_WORKSPACE;
  const nodeEnv = process.env.NODE_ENV || 'development';

  return {
    workspace: workspace || process.cwd(),
    nodeEnv,
    hasWorkspaceConfig: !!workspace
  };
}
