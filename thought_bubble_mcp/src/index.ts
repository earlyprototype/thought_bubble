#!/usr/bin/env node

/**
 * thought_bubble MCP Server
 * 
 * Transforms documentation into beautiful interactive HTML visualizations
 * using AI-powered analysis and Mermaid diagrams.
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
  type GenerateVisualizationInput
} from './tools/generate_visualization.js';

/**
 * Create and configure the MCP server
 */
const server = new Server(
  {
    name: 'thought-bubble-mcp-server',
    version: '0.1.0',
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
  return {
    tools: [
      {
        name: 'analyze_content',
        description: 'Analyze documentation content to identify systems, workflows, data models, and relationships that would benefit from visualization. Returns a prompt for LLM analysis.',
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
        description: 'Generate an interactive HTML visualization with Mermaid diagrams for selected systems. Returns prompts for: (1) generating Mermaid diagrams, (2) creating the final HTML.',
        inputSchema: {
          type: 'object',
          properties: {
            content: {
              type: 'string',
              description: 'The original documentation content'
            },
            selectedSystems: {
              type: 'array',
              description: 'Array of selected systems with their preferred diagram types',
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
                    enum: ['flowchart', 'sequence', 'class', 'er', 'state', 'c4'],
                    description: 'Type of Mermaid diagram to generate'
                  }
                },
                required: ['id', 'title', 'description', 'diagramType']
              }
            },
            theme: {
              type: 'string',
              enum: ['professional', 'dark', 'technical', 'minimal', 'creative'],
              default: 'professional',
              description: 'Visual theme for the HTML output'
            },
            navigationStyle: {
              type: 'string',
              enum: ['sidebar', 'tabs', 'minimal'],
              default: 'sidebar',
              description: 'Navigation pattern to use'
            }
          },
          required: ['content', 'selectedSystems']
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
      // Validate input
      const input = analyzeContentSchema.parse(args) as AnalyzeContentInput;
      
      // Generate analysis prompt
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
      // Validate input
      const input = generateVisualizationSchema.parse(args) as GenerateVisualizationInput;
      
      // Generate visualization prompts
      const result = generateVisualization(input);
      
      const responseText = `STEP 1: GENERATE MERMAID DIAGRAMS

Send this prompt to your LLM to generate Mermaid diagram code:

---
${result.step1_mermaid_prompt}
---

STEP 2: GENERATE FINAL HTML

After receiving the Mermaid diagrams from the LLM, construct the final HTML generation prompt by:

1. Parsing the Mermaid code blocks from the LLM response
2. Building the final prompt that includes:
   - Original content: ${input.content.substring(0, 100)}...
   - Generated Mermaid diagrams
   - Theme: ${input.theme}
   - Navigation: ${input.navigationStyle}

The final prompt will instruct the LLM to create a complete, self-contained HTML file with:
- Inline CSS and JavaScript
- Mermaid diagrams embedded in appropriate sections
- Responsive design
- ${input.navigationStyle} navigation
- ${input.theme} theme

Send the final prompt to the LLM to receive your complete HTML visualization.`;

      return {
        content: [
          {
            type: 'text',
            text: responseText
          }
        ]
      };
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
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Log to stderr (stdout is reserved for MCP protocol messages)
  console.error('thought_bubble MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
