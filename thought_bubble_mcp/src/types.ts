/**
 * Types for thought_bubble MCP server
 */

export interface IdentifiedItem {
  id: number;
  category: 'WORKFLOW' | 'SYSTEM' | 'DATA_MODEL' | 'RELATIONSHIP';
  title: string;
  description: string;
}

export interface AnalysisResult {
  items: IdentifiedItem[];
  summary: string;
}

export interface SelectedSystem {
  id: number;
  diagramType: 'flowchart' | 'sequence' | 'class' | 'er' | 'state' | 'c4';
}

export interface VisualizationResult {
  htmlPrompt: string;
  mermaidDiagrams: Record<number, string>;
  metadata: {
    selectedCount: number;
    theme: string;
    navigationStyle: string;
  };
}
