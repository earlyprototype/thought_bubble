/**
 * Unified Theme Token System for thought_bubble
 * 
 * This interface defines the structure that both beautiful-mermaid and D3
 * can consume for consistent styling across all diagram types.
 */

/**
 * Core theme tokens used by beautiful-mermaid
 */
export interface CoreColors {
  /** Main background color */
  bg: string;
  /** Main foreground/text color */
  fg: string;
  /** Primary accent color for highlights and emphasis */
  accent: string;
  /** Secondary/muted color for less prominent elements */
  muted: string;
}

/**
 * Color scales for D3 data visualizations
 */
export interface ColorScales {
  /** 5-color categorical scale for distinct categories */
  primary: [string, string, string, string, string];
  /** 9-color sequential scale for continuous data (light to dark) */
  sequential: [string, string, string, string, string, string, string, string, string];
  /** 11-color diverging scale for data with a meaningful midpoint */
  diverging: [string, string, string, string, string, string, string, string, string, string, string];
}

/**
 * Semantic colors for status and feedback
 */
export interface SemanticColors {
  /** Success states, confirmations, positive outcomes */
  success: string;
  /** Warning states, caution, attention needed */
  warning: string;
  /** Error states, failures, destructive actions */
  error: string;
  /** Informational states, neutral notifications */
  info: string;
}

/**
 * UI element colors for page chrome and components
 */
export interface UIColors {
  /** Elevated surface color (cards, panels) */
  surface: string;
  /** Border and divider color */
  border: string;
  /** Box shadow color (with alpha) */
  shadow: string;
  /** Secondary text color */
  textSecondary: string;
}

/**
 * Typography definitions for theme-specific font pairings
 * Each theme has three font roles: display, body, and mono
 */
export interface Typography {
  /** Display font for headlines, hero text, emotional impact */
  display: {
    family: string;
    fallback: string;
    weights: string;
  };
  /** Body font for narrative text, descriptions, readable content */
  body: {
    family: string;
    fallback: string;
    weights: string;
  };
  /** Mono font for code, data, technical precision */
  mono: {
    family: string;
    fallback: string;
    weights: string;
  };
  /** Google Fonts import URL (or null if using system/local fonts) */
  googleFontsUrl: string | null;
}

/**
 * Complete theme token definition
 */
export interface ThemeTokens {
  /** Theme identifier (e.g., 'tokyo_night', 'dracula') */
  id: string;
  /** Human-readable theme name */
  name: string;
  /** Theme category for grouping in UI */
  category: 'new' | 'original';
  /** Whether this is a dark or light theme */
  mode: 'dark' | 'light';
  
  /** Core colors for beautiful-mermaid */
  core: CoreColors;
  
  /** Color scales for D3 charts */
  scales: ColorScales;
  
  /** Semantic colors for status indicators */
  semantic: SemanticColors;
  
  /** UI element colors */
  ui: UIColors;
  
  /** Typography settings for theme-specific font pairings */
  typography: Typography;
}

/**
 * Theme name literals for type safety
 */
export type ThemeName = 
  // New themes
  | 'tokyo_night'
  | 'dracula'
  | 'gruvbox'
  | 'solarized_dark'
  | 'solarized_light'
  | 'github_light'
  | 'github_dark'
  // Original themes
  | 'professional'
  | 'dark'
  | 'technical'
  | 'minimal'
  | 'creative';

/**
 * Theme registry type
 */
export type ThemeRegistry = Record<ThemeName, ThemeTokens>;

/**
 * Helper to extract CSS variables from a theme
 */
export function themeToCSSVariables(theme: ThemeTokens): Record<string, string> {
  // Derive --highlight from accent at reduced opacity (hex + 26 = ~15% alpha)
  const highlightColor = theme.core.accent + '26';
  
  return {
    // Core colors
    '--bg': theme.core.bg,
    '--fg': theme.core.fg,
    '--accent': theme.core.accent,
    '--muted': theme.core.muted,
    // Semantic colour layers
    '--emphasis': theme.core.fg,
    '--highlight': highlightColor,
    // Semantic colors
    '--success': theme.semantic.success,
    '--warning': theme.semantic.warning,
    '--error': theme.semantic.error,
    '--info': theme.semantic.info,
    // UI colors
    '--surface': theme.ui.surface,
    '--border': theme.ui.border,
    '--shadow': theme.ui.shadow,
    '--text-secondary': theme.ui.textSecondary,
    // Color scales
    '--scale-1': theme.scales.primary[0],
    '--scale-2': theme.scales.primary[1],
    '--scale-3': theme.scales.primary[2],
    '--scale-4': theme.scales.primary[3],
    '--scale-5': theme.scales.primary[4],
    // Typography
    '--font-display': `'${theme.typography.display.family}', ${theme.typography.display.fallback}`,
    '--font-body': `'${theme.typography.body.family}', ${theme.typography.body.fallback}`,
    '--font-mono': `'${theme.typography.mono.family}', ${theme.typography.mono.fallback}`,
  };
}

/**
 * Generate CSS string from theme
 */
export function themeToCSS(theme: ThemeTokens): string {
  const vars = themeToCSSVariables(theme);
  const cssLines = Object.entries(vars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');
  return `:root {\n${cssLines}\n}`;
}
