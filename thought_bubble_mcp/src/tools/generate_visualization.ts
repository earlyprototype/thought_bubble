/**
 * Tool 2: Generate visualization with selected systems and Mermaid diagrams
 */

import { z } from 'zod';
import { MERMAID_GENERATION_PROMPT, buildVisualizationPrompt } from '../prompts/templates.js';
import type { SelectedSystem, VisualizationResult } from '../types.js';

export const generateVisualizationSchema = z.object({
  content: z.string().describe('The original documentation content'),
  selectedSystems: z.array(z.object({
    id: z.number().describe('The ID of the identified item'),
    title: z.string().describe('The title of the system/workflow'),
    description: z.string().describe('Brief description of the item'),
    diagramType: z.enum(['flowchart', 'sequence', 'class', 'er', 'state', 'c4'])
      .describe('Type of Mermaid diagram to generate')
  })).describe('Array of selected systems with their preferred diagram types'),
  theme: z.enum(['professional', 'dark', 'technical', 'minimal', 'creative'])
    .default('professional')
    .describe('Visual theme for the HTML output'),
  navigationStyle: z.enum(['sidebar', 'tabs', 'minimal'])
    .default('sidebar')
    .describe('Navigation pattern to use')
});

export type GenerateVisualizationInput = z.infer<typeof generateVisualizationSchema>;

/**
 * Generates a multi-step prompt workflow:
 * 1. First prompt: Generate Mermaid diagrams for selected systems
 * 2. Second prompt: Generate complete HTML with diagrams embedded
 */
export function generateVisualization(input: GenerateVisualizationInput): {
  step1_mermaid_prompt: string;
  step2_instructions: string;
} {
  // Format selected items for the Mermaid generation prompt
  const selectedItemsText = input.selectedSystems
    .map((sys, idx) => 
      `${idx + 1}. ${sys.title} (${sys.description}) - Diagram type: ${sys.diagramType}`
    )
    .join('\n');

  // Step 1: Prompt to generate Mermaid diagrams
  const mermaidPrompt = MERMAID_GENERATION_PROMPT
    .replace('{selectedItems}', selectedItemsText)
    .replace('{content}', input.content);

  // Step 2: Instructions for the final HTML generation
  const step2Instructions = `After the LLM generates Mermaid diagrams, call this tool again with:
- The original content
- The generated Mermaid diagram code (as a JSON object mapping item IDs to diagram code)
- Theme: ${input.theme}
- Navigation style: ${input.navigationStyle}

Or, construct the final HTML prompt using the buildFinalPrompt helper.`;

  return {
    step1_mermaid_prompt: mermaidPrompt,
    step2_instructions: step2Instructions
  };
}

/**
 * Builds the final HTML generation prompt with Mermaid diagrams included
 * Call this after LLM has generated the Mermaid diagrams
 */
export function buildFinalPrompt(
  content: string,
  mermaidDiagrams: Record<number, string>,
  theme: string = 'professional',
  navigationStyle: string = 'sidebar'
): string {
  return buildVisualizationPrompt(content, mermaidDiagrams, theme, navigationStyle);
}

/**
 * Helper to parse Mermaid diagrams from LLM response
 * Expected format:
 * ### Diagram for Item 1
 * ```mermaid
 * graph TD
 *   A --> B
 * ```
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
