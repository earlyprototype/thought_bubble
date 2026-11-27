/**
 * Mermaid Diagram Renderer
 * 
 * Wraps beautiful-mermaid to provide server-side SVG rendering
 * with thought_bubble's unified theme system.
 */

import { renderMermaid, renderMermaidAscii } from 'beautiful-mermaid';
import { JSDOM } from 'jsdom';
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

function hasEventAttribute(element: Element): boolean {
  return element.getAttributeNames().some(name => /^on./i.test(name));
}

const dangerousContentError = 'Potentially dangerous content detected in diagram code';

// Inline handlers that JSDOM does not expose on all elements, including window,
// media, SVG animation and legacy clipboard events.
const otherLabelHandlers = new Set(`
  onafterprint onanimationcancel onanimationend onanimationiteration onanimationstart onbeforecopy
  onbeforecut onbeforepaste onbeforeprint onbeforeunload onbegin oncommand oncontentvisibilityautostatechange
  ondevicemotion ondeviceorientation ondeviceorientationabsolute onencrypted onend onenterpictureinpicture
  onfocusin onfocusout onfreeze onfullscreenchange onfullscreenerror ongamepadconnected ongamepaddisconnected
  ongotpointercapture onhashchange onlanguagechange onleavepictureinpicture onlostpointercapture onmessage
  onmessageerror onmousewheel onoffline ononline onorientationchange onpagehide onpagereveal onpageshow
  onpageswap onpointercancel onpointerdown onpointerenter onpointerleave onpointerlockchange onpointerlockerror
  onpointermove onpointerout onpointerover onpointerrawupdate onpointerup onpopstate onprerenderingchange
  onreadystatechange onrejectionhandled onrepeat onresume onscrollsnapchange onscrollsnapchanging onsearch
  onselectionchange onselectstart onstorage ontransitioncancel ontransitionend ontransitionrun ontransitionstart
  onunhandledrejection onunload onvisibilitychange onwaitingforkey onwebkitfullscreenchange onwebkitfullscreenerror
  onzoom
`.trim().split(/\s+/));

// Standalone SVG tags need an SVG parent for the HTML fragment parser.
const svgLabelTags = new Set(`
  altGlyph altGlyphDef altGlyphItem animate animateColor animateMotion animateTransform circle clipPath
  color-profile cursor defs desc ellipse feBlend feColorMatrix
  feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feDistantLight
  feDropShadow feFlood feFuncA feFuncB feFuncG feFuncR feGaussianBlur feImage feMerge feMergeNode
  feMorphology feOffset fePointLight feSpecularLighting feSpotLight feTile feTurbulence filter
  font-face font-face-format font-face-name font-face-src font-face-uri foreignObject g glyph glyphRef
  hkern image line linearGradient marker mask metadata missing-glyph mpath path pattern polygon polyline
  radialGradient rect set stop switch symbol text textPath tref tspan use view vkern
`.trim().toLowerCase().split(/\s+/));
// JSDOM gives these HTML tags the same interface as unrecognized names.
const otherHtmlTags = new Set('applet bgsound blink isindex keygen menuitem multicol nextid search spacer'.split(' '));
const labelWindow = new JSDOM().window;

function parseLabelTag(tag: string, name: string): Element | null {
  // The fragment parser discards document and frameset tags.
  if (['html', 'head', 'body', 'frameset', 'frame'].includes(name)) {
    const markup = name === 'frame' ? `<frameset>${tag}</frameset>` : tag;
    return new labelWindow.DOMParser().parseFromString(markup, 'text/html').querySelector(name);
  }

  const template = labelWindow.document.createElement('template');
  if (svgLabelTags.has(name)) {
    template.innerHTML = `<svg>${tag}</svg>`;
    return template.content.firstElementChild?.firstElementChild ?? null;
  }

  template.innerHTML = tag;
  const element = template.content.firstElementChild;
  // A variable in a comparison can look like an unknown tag, as in "x<y ... z>0".
  if (element instanceof labelWindow.HTMLUnknownElement && !otherHtmlTags.has(name)) return null;
  return element;
}

function joinsLabelComparisons(label: string, start: number, tag: string): boolean {
  // In "a<b ... and c>= -1", the match ends at ">" before the optional "=" and signed operand.
  const afterAngle = label.slice(start + tag.length);
  if (!/\w\s*$/.test(label.slice(0, start)) || !/^=?\s*[+-]?\w/.test(afterAngle)) {
    return false;
  }

  const clauses = tag.slice(1, -1).trim().split(/\s*(?:&&|\|\||\b(?:and|or|if)\b)\s*/i);
  // The first clause starts with the operand (b) and may continue with prose.
  // An attribute assignment here still goes through the markup parser.
  return clauses.length > 1 &&
    /^[\w.\s]+$/.test(clauses[0]) &&
    /^[\w.]+$/.test(clauses[clauses.length - 1]);
}

function labelHasEventAttribute(label: string): boolean {
  const tags = label.matchAll(/<([a-z][\w:.-]*)(?=[\s/>])(?:[^<>"']|"[^"]*"|'[^']*')*>/gi);
  for (const match of tags) {
    const [tag, tagName] = match;
    if (joinsLabelComparisons(label, match.index, tag)) continue;
    const element = parseLabelTag(tag, tagName.toLowerCase());
    if (element?.getAttributeNames().some(name =>
      name.startsWith('on') && (name in element || otherLabelHandlers.has(name))
    )) return true;
  }
  return false;
}

function svgHasEventAttribute(rawSvg: string): boolean {
  if (!/\bon/i.test(rawSvg)) return false;
  const svg = JSDOM.fragment(rawSvg);
  for (const element of svg.querySelectorAll('*')) {
    if (hasEventAttribute(element)) return true;
    if (element.localName === 'text' && labelHasEventAttribute(element.textContent ?? '')) return true;
  }
  return false;
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
    /<iframe/i,           // Iframes
    /<object/i,           // Object tags
    /<embed/i,            // Embed tags
    /%3Cscript/i,         // URL-encoded script
  ];
  
  if (dangerousPatterns.some(pattern => pattern.test(trimmed))) {
    throw new Error(dangerousContentError);
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

    if (svgHasEventAttribute(rawSvg)) {
      return { success: false, error: dangerousContentError, svg: createErrorSvg(dangerousContentError, theme) };
    }
    
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
