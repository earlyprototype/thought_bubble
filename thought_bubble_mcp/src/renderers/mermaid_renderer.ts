/**
 * Mermaid Diagram Renderer
 * 
 * Wraps beautiful-mermaid to provide server-side SVG rendering
 * with thought_bubble's unified theme system.
 */

import { renderMermaid, renderMermaidAscii } from 'beautiful-mermaid';
import { JSDOM } from 'jsdom';
import { html, parseFragment, type DefaultTreeAdapterTypes } from 'parse5';
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
const labelHandlers = new Set(`
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

// A bare boolean attribute establishes markup even when it touches a comparison operand.
const booleanAttributes = new Set(`
  allowfullscreen allowpaymentrequest async autofocus autoplay checked compact controls credentialless
  declare default defer disabled
  disablepictureinpicture disableremoteplayback formnovalidate hidden inert ismap itemscope loop
  multiple muted nohref nomodule noresize noshade novalidate nowrap open playsinline readonly
  required reversed selected truespeed typemustmatch
`.trim().split(/\s+/));

// Content attribute spellings, including names such as "class" and "for" whose
// DOM properties have different names. A value or position matters for these:
// "title=hint" is an attribute, but "the title changes" is a phrase.
const globalAttributes = new Set(`
  accesskey autocapitalize autocorrect autofocus class contenteditable dir draggable enterkeyhint
  exportparts id inputmode is itemid itemprop itemref itemtype lang nonce part popover role slot
  spellcheck style tabindex title translate virtualkeyboardpolicy writingsuggestions
`.trim().split(/\s+/));

// Void and foreign elements never take the comparison exception.
const voidElements = new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));
const elementAttributes: Record<string, string> = {
  a: 'attributionsrc charset coords download href hreflang name ping referrerpolicy rel rev shape target type',
  audio: 'controlslist crossorigin preload src',
  blockquote: 'cite', body: 'alink background bgcolor link text vlink',
  button: 'command commandfor formaction formenctype formmethod formtarget name popovertarget popovertargetaction type value',
  canvas: 'height width', caption: 'align', colgroup: 'align char charoff span valign width',
  data: 'value', del: 'cite datetime', details: 'name', dialog: 'closedby', div: 'align',
  fieldset: 'form name', font: 'color face size',
  form: 'accept accept-charset action autocomplete enctype method name rel target',
  frameset: 'cols rows', html: 'manifest version', iframe: 'allow csp height loading name referrerpolicy sandbox src srcdoc width',
  ins: 'cite datetime', label: 'for form', legend: 'align', li: 'type value', map: 'name',
  menu: 'label type', meter: 'form high low max min optimum value',
  object: 'archive border classid codebase codetype data form height name standby type usemap width',
  ol: 'start type', optgroup: 'label', option: 'label value', output: 'for form name', p: 'align',
  pre: 'width', progress: 'max value', q: 'cite',
  script: 'attributionsrc blocking charset crossorigin fetchpriority integrity referrerpolicy src type',
  select: 'autocomplete form name size', slot: 'name', style: 'blocking media type',
  table: 'align bgcolor border cellpadding cellspacing frame rules summary width',
  tbody: 'align char charoff valign', td: 'abbr align axis bgcolor char charoff colspan headers height rowspan scope valign width',
  template: 'shadowrootmode', textarea: 'autocomplete cols dirname form maxlength minlength name placeholder rows wrap',
  tfoot: 'align char charoff valign', th: 'abbr align axis bgcolor char charoff colspan headers height rowspan scope valign width',
  thead: 'align char charoff valign', time: 'datetime', tr: 'align bgcolor char charoff valign',
  ul: 'type', video: 'controlslist crossorigin height poster preload src width',
};

const labelWindow = new JSDOM().window;
// Include the handlers exposed by JSDOM, including element-specific ones.
for (const type of Object.getOwnPropertyNames(labelWindow)) {
  if (/^(?:HTML|SVG)\w*Element$/.test(type)) {
    for (const name of Object.getOwnPropertyNames(labelWindow[type].prototype)) {
      if (name.startsWith('on')) labelHandlers.add(name);
    }
  }
}

// HTML uses the same syntax for a bare attribute and a word in a sentence.
// Check the operands and the positions of parsed names within the intervening
// expression. Keep the source words because the HTML parser drops duplicates.
function joinsLabelComparisons(label: string, element: DefaultTreeAdapterTypes.Element): boolean {
  const location = element.sourceCodeLocation;
  const start = location?.startTag;
  if (!start || location.endTag || element.namespaceURI !== html.NS.HTML || voidElements.has(element.tagName)) {
    return false;
  }

  const before = label.slice(0, start.startOffset).trimEnd();
  const after = label.slice(start.endOffset);
  const tag = label.slice(start.startOffset, start.endOffset - 1).trimEnd();
  if (!/[\w)\]]$/.test(before) || !/^=?\s*[+-]?(?:[\w(]|\.\d)/.test(after) ||
      !/\s[\w.]+(?:\([\w., ]*\))?$/.test(tag) || /["'/]/.test(tag)) return false;

  if (element.attrs.some(({ name }) => booleanAttributes.has(name) || /^(?:aria|data)-/.test(name))) return false;

  const specific = Object.hasOwn(elementAttributes, element.tagName) ? elementAttributes[element.tagName].split(' ') : [];
  const [, ...words] = tag.replace(/\s*=\s*/g, '=').split(/\s+/);
  return words.every((word, index) => {
    const name = word.split('=', 1)[0].toLowerCase();
    if (word.includes('=') && (index === 0 || !/^[\w.-]+=[\w.-]+[,;]?$/.test(word))) return false;
    if (labelHandlers.has(name)) return index > 0 && index < words.length - 1;
    if (globalAttributes.has(name) || specific.includes(name)) {
      if (index === 0 || word.includes('=')) return false;
      // A named operand such as "id" can follow a logical operator.
      if (index === words.length - 1) return /^(?:&&|\|\||and|or)$/i.test(words[index - 1]);
      return /^[\w,;.-]+$/.test(words[index - 1]) && /^[\w,;.-]+$/.test(words[index + 1]);
    }
    return true;
  });
}

function labelHasEventAttribute(label: string): boolean {
  if (!label.includes('<') || !/\bon/i.test(label)) return false;

  const fragment = parseFragment(label, { sourceCodeLocationInfo: true });
  const parsed = new Set<number>();
  const pending = fragment.childNodes.map(node => ({ node, inMarkup: false }));
  while (pending.length) {
    const { node, inMarkup } = pending.pop()!;
    if (!('tagName' in node)) continue;
    let markup = inMarkup;
    if (node.sourceCodeLocation) {
      parsed.add(node.sourceCodeLocation.startOffset);
      markup ||= !joinsLabelComparisons(label, node);
      if (markup && node.attrs.some(({ name }) => labelHandlers.has(name))) return true;
    }
    // Successive comparisons can appear nested in the parse tree. Only children
    // of actual markup inherit its status.
    const children = 'content' in node ? node.content.childNodes : node.childNodes;
    for (const child of children) pending.push({ node: child, inMarkup: markup });
  }

  // The HTML tree builder can discard a tag, including its attributes, in some
  // contexts (for example a standalone <body>). Check any such original tag.
  const tags = label.matchAll(/<([a-z][\w:.-]*)(?=[\s/>])((?:[^<>"']|"[^"]*"|'[^']*')*)>/gi);
  for (const match of tags) {
    const attributes = match[2];
    if (parsed.has(match.index) || !/\bon/i.test(attributes)) continue;
    const [tag] = parseFragment(`<span${attributes}>`).childNodes;
    if (tag && 'attrs' in tag && tag.attrs.some(({ name }) => labelHandlers.has(name))) return true;
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
