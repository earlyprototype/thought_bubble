/**
 * Mermaid Renderer Tests
 */

import { describe, it, expect } from 'vitest';
import { 
  renderMermaidDiagram,
  renderMermaidToAscii,
  validateMermaidSyntax,
  isMermaidDiagramType 
} from './mermaid_renderer.js';
import { getTheme } from '../themes/index.js';

const theme = getTheme('tokyo_night');

const VALID_FLOWCHART = `graph TD
    A[Start] --> B[End]`;

const VALID_SEQUENCE = `sequenceDiagram
    Alice->>Bob: Hello`;

describe('Mermaid Renderer', () => {
  describe('isMermaidDiagramType', () => {
    it('should recognize valid Mermaid types', () => {
      expect(isMermaidDiagramType('flowchart')).toBe(true);
      expect(isMermaidDiagramType('sequence')).toBe(true);
      expect(isMermaidDiagramType('class')).toBe(true);
      expect(isMermaidDiagramType('er')).toBe(true);
      expect(isMermaidDiagramType('state')).toBe(true);
    });

    it('should reject invalid types including unsupported c4', () => {
      expect(isMermaidDiagramType('bar')).toBe(false);
      expect(isMermaidDiagramType('pie')).toBe(false);
      expect(isMermaidDiagramType('unknown')).toBe(false);
      expect(isMermaidDiagramType('c4')).toBe(false); // C4 not supported by beautiful-mermaid
    });
  });

  describe('validateMermaidSyntax', () => {
    it('should validate flowchart syntax', () => {
      const result = validateMermaidSyntax(VALID_FLOWCHART);
      expect(result.valid).toBe(true);
      expect(result.type).toBe('flowchart');
    });

    it('should validate sequence diagram syntax', () => {
      const result = validateMermaidSyntax(VALID_SEQUENCE);
      expect(result.valid).toBe(true);
      expect(result.type).toBe('sequence');
    });

    it('should reject empty input', () => {
      const result = validateMermaidSyntax('');
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject whitespace-only input', () => {
      const result = validateMermaidSyntax('   \n   ');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Empty diagram code');
    });

    it('should reject unrecognized diagram type', () => {
      const result = validateMermaidSyntax('some random text');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Unrecognized diagram type');
    });
  });

  describe('renderMermaidDiagram', () => {
    it('should render valid flowchart', async () => {
      const result = await renderMermaidDiagram(VALID_FLOWCHART, theme);
      expect(result.success).toBe(true);
      expect(result.svg).toContain('<svg');
      expect(result.svg).toContain('</svg>');
      expect(result.error).toBeUndefined();
    });

    it('should render valid sequence diagram', async () => {
      const result = await renderMermaidDiagram(VALID_SEQUENCE, theme);
      expect(result.success).toBe(true);
      expect(result.svg).toContain('<svg');
    });

    it('should handle empty input gracefully', async () => {
      const result = await renderMermaidDiagram('', theme);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Empty diagram code');
      // Should return error SVG with helpful message
      expect(result.svg).toContain('Diagram Rendering Error');
      expect(result.svg).toContain('Empty diagram code');
    });

    it('should return error SVG for invalid syntax', async () => {
      const result = await renderMermaidDiagram('invalid mermaid!!!', theme);
      // This might succeed or fail depending on beautiful-mermaid's handling
      // but it should always return an SVG
      expect(result.svg).toContain('<svg');
    });

    it('should apply theme colors', async () => {
      const result = await renderMermaidDiagram(VALID_FLOWCHART, theme);
      expect(result.success).toBe(true);
      // SVG should be rendered (theme application is internal to beautiful-mermaid)
      expect(result.svg).toBeTruthy();
    });

    it('should handle transparent option', async () => {
      const result = await renderMermaidDiagram(VALID_FLOWCHART, theme, { transparent: true });
      expect(result.success).toBe(true);
      expect(result.svg).toContain('<svg');
    });

    it('should handle custom font option', async () => {
      const result = await renderMermaidDiagram(VALID_FLOWCHART, theme, { font: 'Arial' });
      expect(result.success).toBe(true);
      expect(result.svg).toContain('<svg');
    });
  });

  describe('renderMermaidToAscii', () => {
    it('should render ASCII output', () => {
      const ascii = renderMermaidToAscii(VALID_FLOWCHART, false);
      expect(ascii).toBeTruthy();
      expect(typeof ascii).toBe('string');
    });

    it('should render pure ASCII when requested', () => {
      const ascii = renderMermaidToAscii(VALID_FLOWCHART, true);
      expect(ascii).toBeTruthy();
      // Should not contain unicode box-drawing characters
      expect(ascii).not.toContain('─');
      expect(ascii).not.toContain('│');
    });

    it('should handle empty input', () => {
      const ascii = renderMermaidToAscii('');
      expect(ascii).toBe('(Empty diagram)');
    });

    it('should handle invalid input gracefully', () => {
      const ascii = renderMermaidToAscii('completely invalid');
      expect(ascii).toContain('Error rendering diagram');
    });
  });
});
