/**
 * SVG Post-Processor for Dynamic Theming
 * 
 * Replaces hardcoded theme colours in SVG strings with CSS variable references.
 * This enables live theme switching by allowing SVGs to inherit from page CSS variables.
 */

import type { ThemeTokens } from './types.js';

/**
 * Mapping of CSS variable names to their semantic purpose
 */
const CSS_VAR_MAPPING = {
  // Core colours
  bg: '--bg',
  fg: '--fg',
  accent: '--accent',
  muted: '--muted',
  
  // UI colours
  surface: '--surface',
  border: '--border',
  textSecondary: '--text-secondary',
  
  // Semantic colours
  success: '--success',
  warning: '--warning',
  error: '--error',
  info: '--info',
  
  // Scale colours
  scale1: '--scale-1',
  scale2: '--scale-2',
  scale3: '--scale-3',
  scale4: '--scale-4',
  scale5: '--scale-5',
} as const;

/**
 * Extract all colour values from a theme that should be replaced with CSS variables
 */
function extractThemeColours(theme: ThemeTokens): Map<string, string> {
  const colourMap = new Map<string, string>();
  
  // Core colours
  colourMap.set(normaliseColour(theme.core.bg), CSS_VAR_MAPPING.bg);
  colourMap.set(normaliseColour(theme.core.fg), CSS_VAR_MAPPING.fg);
  colourMap.set(normaliseColour(theme.core.accent), CSS_VAR_MAPPING.accent);
  colourMap.set(normaliseColour(theme.core.muted), CSS_VAR_MAPPING.muted);
  
  // UI colours
  colourMap.set(normaliseColour(theme.ui.surface), CSS_VAR_MAPPING.surface);
  colourMap.set(normaliseColour(theme.ui.border), CSS_VAR_MAPPING.border);
  colourMap.set(normaliseColour(theme.ui.textSecondary), CSS_VAR_MAPPING.textSecondary);
  
  // Semantic colours
  colourMap.set(normaliseColour(theme.semantic.success), CSS_VAR_MAPPING.success);
  colourMap.set(normaliseColour(theme.semantic.warning), CSS_VAR_MAPPING.warning);
  colourMap.set(normaliseColour(theme.semantic.error), CSS_VAR_MAPPING.error);
  colourMap.set(normaliseColour(theme.semantic.info), CSS_VAR_MAPPING.info);
  
  // Primary scale colours (used for D3 charts)
  theme.scales.primary.forEach((colour, index) => {
    const varName = `--scale-${index + 1}` as const;
    colourMap.set(normaliseColour(colour), varName);
  });
  
  return colourMap;
}

/**
 * Normalise a colour string to lowercase for consistent matching
 * Handles hex colours in various formats
 */
function normaliseColour(colour: string): string {
  return colour.toLowerCase().trim();
}

/**
 * Escape special regex characters in a string
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Process an SVG string to replace hardcoded theme colours with CSS variables
 * 
 * @param svg - The SVG string to process
 * @param theme - The theme that was used to render the SVG
 * @returns Processed SVG string with CSS variable references
 */
export function processSvgForDynamicTheming(svg: string, theme: ThemeTokens): string {
  const colourMap = extractThemeColours(theme);
  let processedSvg = svg;
  
  // CRITICAL: Remove inline CSS variable definitions from SVG style attributes
  // beautiful-mermaid sets style="--bg:#xxx;--fg:#xxx;..." which overrides page CSS
  // We need to strip these so the SVG inherits from the page's CSS variables
  processedSvg = stripInlineCssVariables(processedSvg);
  
  // Process each colour mapping
  for (const [colour, cssVar] of colourMap) {
    // Match the colour in various contexts:
    // - fill="..." or fill='...'
    // - stroke="..." or stroke='...'
    // - stop-color="..." (for gradients)
    // - style="...color:..." (inline styles)
    // - style="...fill:..." (inline styles)
    // - style="...stroke:..." (inline styles)
    // - style="...background:..." (inline styles)
    
    // Pattern for attribute values (fill="#abc", stroke='#abc')
    const attrPattern = new RegExp(
      `((?:fill|stroke|stop-color|flood-color|lighting-color)\\s*=\\s*["'])${escapeRegex(colour)}(["'])`,
      'gi'
    );
    processedSvg = processedSvg.replace(attrPattern, `$1var(${cssVar})$2`);
    
    // Pattern for inline style properties
    // Handles: style="fill: #abc" or style="fill:#abc;stroke:#def"
    const stylePattern = new RegExp(
      `((?:fill|stroke|color|background|background-color|stop-color)\\s*:\\s*)${escapeRegex(colour)}`,
      'gi'
    );
    processedSvg = processedSvg.replace(stylePattern, `$1var(${cssVar})`);
  }
  
  // Handle colours with alpha (e.g., "#7aa2f720" for 20% opacity)
  // These need special handling as they combine colour + opacity
  processedSvg = processAlphaColours(processedSvg, theme);
  
  return processedSvg;
}

/**
 * Strip inline CSS variable definitions from SVG style attributes
 * 
 * beautiful-mermaid outputs: style="--bg:#1a1b26;--fg:#a9b1d6;...;background:var(--bg)"
 * We need to remove the --variable:#value; parts so the SVG inherits from page CSS
 * but keep other style properties like background:var(--bg)
 */
function stripInlineCssVariables(svg: string): string {
  // Match style attributes and process them
  return svg.replace(
    /style="([^"]*)"/gi,
    (match, styleContent) => {
      // Split into individual declarations
      const declarations = styleContent.split(';').filter((d: string) => d.trim());
      
      // Filter out CSS variable definitions (--name:value) but keep property usages
      const filtered = declarations.filter((decl: string) => {
        const trimmed = decl.trim();
        // Remove if it's a CSS variable definition (starts with --)
        // e.g., "--bg:#1a1b26" or "--fg: #a9b1d6"
        return !trimmed.match(/^--[\w-]+\s*:/);
      });
      
      // Rejoin remaining declarations
      const cleanedStyle = filtered.join(';');
      
      // If style is empty after cleaning, remove the attribute entirely
      if (!cleanedStyle.trim()) {
        return '';
      }
      
      return `style="${cleanedStyle}"`;
    }
  );
}

/**
 * Process colours with alpha values (8-digit hex or rgba)
 * These are commonly used for semi-transparent fills in charts
 */
function processAlphaColours(svg: string, theme: ThemeTokens): string {
  const colourMap = extractThemeColours(theme);
  let processedSvg = svg;
  
  // Check for 8-digit hex colours (e.g., #7aa2f720)
  // These are the base colour + alpha as last 2 hex digits
  for (const [baseColour, cssVar] of colourMap) {
    if (baseColour.startsWith('#') && baseColour.length === 7) {
      // Match 8-digit hex where first 6 digits match base colour
      const hexPattern = new RegExp(
        `((?:fill|stroke)\\s*=\\s*["'])${escapeRegex(baseColour)}([0-9a-f]{2})(["'])`,
        'gi'
      );
      
      // Convert hex alpha to decimal (e.g., 20 hex = ~0.13 decimal)
      processedSvg = processedSvg.replace(hexPattern, (match, prefix, alpha, suffix) => {
        const opacity = parseInt(alpha, 16) / 255;
        // Can't use CSS var with opacity directly in SVG, so we use fill-opacity
        return `${prefix}var(${cssVar})${suffix} fill-opacity="${opacity.toFixed(2)}"`;
      });
    }
  }
  
  return processedSvg;
}

/**
 * Batch process multiple SVGs for dynamic theming
 */
export function processSvgsForDynamicTheming(svgs: string[], theme: ThemeTokens): string[] {
  return svgs.map(svg => processSvgForDynamicTheming(svg, theme));
}

/**
 * Check if an SVG already uses CSS variables (i.e., already processed)
 */
export function svgUsesCssVariables(svg: string): boolean {
  return /var\(--(?:bg|fg|accent|muted|surface|border|scale-\d)\)/.test(svg);
}

export default {
  processSvgForDynamicTheming,
  processSvgsForDynamicTheming,
  svgUsesCssVariables,
};
