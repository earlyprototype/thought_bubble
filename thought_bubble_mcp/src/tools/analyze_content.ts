/**
 * Tool 1: Analyze content and identify systems/workflows/data models
 */

import { z } from 'zod';
import { ANALYSIS_PROMPT, formatAnalysisForUser } from '../prompts/templates.js';
import type { AnalysisResult, IdentifiedItem } from '../types.js';

export const analyzeContentSchema = z.object({
  content: z.string().describe('The documentation or content to analyze for visualization opportunities')
});

export type AnalyzeContentInput = z.infer<typeof analyzeContentSchema>;

/**
 * Analyzes content and returns identified systems/workflows/data models
 * This tool returns a prompt that should be sent to an LLM for analysis
 */
export function analyzeContent(input: AnalyzeContentInput): string {
  // Replace content placeholder in the analysis prompt
  const prompt = ANALYSIS_PROMPT.replace('{content}', input.content);
  
  return prompt;
}

/**
 * Helper function to parse LLM's analysis response into structured format
 * This would typically be called after the LLM responds to the analysis prompt
 * 
 * NOTE: In actual usage, the AI client will handle the LLM call and parsing.
 * This is provided as reference for the expected data structure.
 */
export function parseAnalysisResponse(llmResponse: string): AnalysisResult {
  // This is a simplified parser - in production you'd want more robust parsing
  const items: IdentifiedItem[] = [];
  let currentCategory: IdentifiedItem['category'] = 'WORKFLOW';
  let itemId = 1;

  const lines = llmResponse.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Detect category headers
    if (trimmed.includes('WORKFLOW')) {
      currentCategory = 'WORKFLOW';
    } else if (trimmed.includes('SYSTEM')) {
      currentCategory = 'SYSTEM';
    } else if (trimmed.includes('DATA MODEL')) {
      currentCategory = 'DATA_MODEL';
    } else if (trimmed.includes('RELATIONSHIP')) {
      currentCategory = 'RELATIONSHIP';
    }
    
    // Parse numbered items (e.g., "1. User Registration Flow - ...")
    const itemMatch = trimmed.match(/^\d+\.\s+(.+?)\s*[-–]\s*(.+)$/);
    if (itemMatch) {
      items.push({
        id: itemId++,
        category: currentCategory,
        title: itemMatch[1].trim(),
        description: itemMatch[2].trim()
      });
    }
  }

  return {
    items,
    summary: formatAnalysisForUser(items)
  };
}
