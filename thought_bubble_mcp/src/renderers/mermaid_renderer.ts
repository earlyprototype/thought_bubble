/**
 * Mermaid Diagram Renderer
 * 
 * Wraps beautiful-mermaid to provide server-side SVG rendering
 * with thought_bubble's unified theme system.
 */

import { renderMermaid, renderMermaidAscii } from 'beautiful-mermaid';
import type { ThemeTokens } from '../themes/types.js';
import { processSvgForDynamicTheming } from '../themes/svg_processor.js';

/**
 * Mermaid diagram types supported by beautiful-mermaid
 * 
 * NOTE: C4 diagrams are NOT supported by beautiful-mermaid.
 * Use flowcharts with subgraphs for architecture diagrams instead.
 */
export type MermaidDiagramType = 
  | 'flowchart'
  | 'sequence'
  | 'class'
  | 'er'
  | 'state';

/**
 * Options for rendering Mermaid diagrams
 */
export interface MermaidRenderOptions {
  /** Whether to render with transparent background */
  transparent?: boolean;
  /** Font family to use */
  font?: string;
}

/**
 * Result of rendering a Mermaid diagram
 */
export interface MermaidRenderResult {
  /** The rendered SVG string */
  svg: string;
  /** Whether rendering was successful */
  success: boolean;
  /** Error message if rendering failed */
  error?: string;
}

/**
 * Check if a diagram type is a Mermaid type
 * NOTE: C4 is NOT supported by beautiful-mermaid
 */
export function isMermaidDiagramType(type: string): type is MermaidDiagramType {
  return ['flowchart', 'sequence', 'class', 'er', 'state'].includes(type);
}

/**
 * Sanitise Mermaid code to prevent potential security issues
 * 
 * @param code - Raw Mermaid code
 * @returns Sanitised code or throws error if dangerous content detected
 */
function sanitiseMermaidCode(code: string): string {
  const trimmed = code.trim();
  
  if (!trimmed) {
    throw new Error('Empty diagram code');
  }
  
  // Check for dangerous patterns
  const dangerousPatterns = [
    /<script/i,           // Script tags
    /javascript:/i,       // JavaScript protocols
    /on\w+\s*=/i,         // Event handlers (onclick, onerror, etc.)
    /<iframe/i,           // Iframes
    /<object/i,           // Object tags
    /<embed/i,            // Embed tags
    /%3Cscript/i,         // URL-encoded script
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(trimmed)) {
      throw new Error('Potentially dangerous content detected in diagram code');
    }
  }
  
  // Check for disallowed Mermaid directives (if any)
  // Mermaid has %%{init:} directives that could potentially be abused
  const initDirectivePattern = /%%\{init:/i;
  if (initDirectivePattern.test(trimmed)) {
    // For now, we'll allow init directives but log a warning
    // Could be made more strict if security requires it
    console.warn('Init directive found in Mermaid code - review for security');
  }
  
  return trimmed;
}

/**
 * Render a Mermaid diagram to SVG using beautiful-mermaid
 * 
 * @param code - Mermaid diagram code
 * @param theme - Theme tokens for styling
 * @param options - Additional rendering options
 * @returns Rendered SVG string
 */
export async function renderMermaidDiagram(
  code: string,
  theme: ThemeTokens,
  options: MermaidRenderOptions = {}
): Promise<MermaidRenderResult> {
  try {
    // Sanitise the input code
    let cleanCode: string;
    try {
      cleanCode = sanitiseMermaidCode(code);
    } catch (sanitiseError) {
      return {
        svg: createErrorSvg(
          sanitiseError instanceof Error ? sanitiseError.message : 'Invalid input',
          theme
        ),
        success: false,
        error: sanitiseError instanceof Error ? sanitiseError.message : 'Invalid input',
      };
    }
    
    // Validate diagram type
    const validation = validateMermaidSyntax(cleanCode);
    if (!validation.valid) {
      return {
        svg: createErrorSvg(validation.error || 'Invalid diagram', theme),
        success: false,
        error: validation.error,
      };
    }

    // Build beautiful-mermaid options from theme
    const renderOptions = {
      bg: theme.core.bg,
      fg: theme.core.fg,
      accent: theme.core.accent,
      muted: theme.core.muted,
      // Use theme UI colors for enrichment
      line: theme.ui.border,
      surface: theme.ui.surface,
      border: theme.ui.border,
      // Optional overrides
      transparent: options.transparent ?? false,
      font: options.font ?? 'Inter, system-ui, sans-serif',
    };

    // Render the diagram
    const rawSvg = await renderMermaid(cleanCode, renderOptions);
    
    // Post-process SVG to use CSS variables for dynamic theming
    const svg = processSvgForDynamicTheming(rawSvg, theme);

    return {
      svg,
      success: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Mermaid rendering error:', errorMessage);
    
    return {
      svg: createErrorSvg(errorMessage, theme),
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Render a Mermaid diagram to ASCII/Unicode text
 * Useful for terminal output or text-based contexts
 * 
 * @param code - Mermaid diagram code
 * @param useAscii - Use pure ASCII instead of Unicode box-drawing
 * @returns ASCII/Unicode representation of the diagram
 */
export function renderMermaidToAscii(
  code: string,
  useAscii: boolean = false
): string {
  try {
    const cleanCode = code.trim();
    if (!cleanCode) {
      return '(Empty diagram)';
    }
    
    return renderMermaidAscii(cleanCode, {
      useAscii,
      paddingX: 5,
      paddingY: 3,
      boxBorderPadding: 1,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return `(Error rendering diagram: ${errorMessage})`;
  }
}

/**
 * Batch render multiple Mermaid diagrams
 * 
 * @param diagrams - Array of diagram code strings
 * @param theme - Theme tokens for styling
 * @param options - Additional rendering options
 * @returns Array of render results
 */
export async function renderMermaidDiagrams(
  diagrams: string[],
  theme: ThemeTokens,
  options: MermaidRenderOptions = {}
): Promise<MermaidRenderResult[]> {
  return Promise.all(
    diagrams.map(code => renderMermaidDiagram(code, theme, options))
  );
}

/**
 * Create an error SVG placeholder when rendering fails
 */
function createErrorSvg(message: string, theme: ThemeTokens): string {
  const escapedMessage = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200">
  <rect width="400" height="200" fill="${theme.core.bg}" rx="8"/>
  <rect x="10" y="10" width="380" height="180" fill="${theme.ui.surface}" stroke="${theme.semantic.error}" stroke-width="2" rx="6"/>
  <text x="200" y="80" text-anchor="middle" fill="${theme.semantic.error}" font-family="Inter, system-ui, sans-serif" font-size="16" font-weight="600">
    Diagram Rendering Error
  </text>
  <text x="200" y="120" text-anchor="middle" fill="${theme.core.muted}" font-family="Inter, system-ui, sans-serif" font-size="12">
    ${escapedMessage.substring(0, 50)}${escapedMessage.length > 50 ? '...' : ''}
  </text>
</svg>`;
}

/**
 * Validate Mermaid diagram syntax
 * 
 * @param code - Mermaid diagram code to validate
 * @returns Validation result
 */
export function validateMermaidSyntax(code: string): { valid: boolean; type?: MermaidDiagramType; error?: string } {
  const cleanCode = code.trim();
  
  if (!cleanCode) {
    return { valid: false, error: 'Empty diagram code' };
  }

  // Check for common diagram type declarations
  // NOTE: C4 diagrams are NOT supported by beautiful-mermaid
  const diagramPatterns: { pattern: RegExp; type: MermaidDiagramType }[] = [
    { pattern: /^(graph|flowchart)\s+(TD|TB|BT|LR|RL)/im, type: 'flowchart' },
    { pattern: /^sequenceDiagram/im, type: 'sequence' },
    { pattern: /^classDiagram/im, type: 'class' },
    { pattern: /^erDiagram/im, type: 'er' },
    { pattern: /^stateDiagram(-v2)?/im, type: 'state' },
  ];

  for (const { pattern, type } of diagramPatterns) {
    if (pattern.test(cleanCode)) {
      return { valid: true, type };
    }
  }

  // Check if user tried to use unsupported C4
  if (/^C4(Context|Container|Component|Dynamic|Deployment)/im.test(cleanCode)) {
    return { 
      valid: false, 
      error: 'C4 diagrams are not supported. Use flowcharts with subgraphs for architecture diagrams instead.' 
    };
  }

  // No recognized diagram type
  return { 
    valid: false, 
    error: 'Unrecognized diagram type. Supported: flowchart, sequence, class, er, state' 
  };
}

export default {
  renderMermaidDiagram,
  renderMermaidDiagrams,
  renderMermaidToAscii,
  validateMermaidSyntax,
  isMermaidDiagramType,
};
