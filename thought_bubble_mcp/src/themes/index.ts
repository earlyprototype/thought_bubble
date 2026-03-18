/**
 * Theme System Exports
 */

// Types
export type {
  ThemeTokens,
  ThemeName,
  ThemeRegistry,
  CoreColors,
  ColorScales,
  SemanticColors,
  UIColors,
} from './types.js';

// Helper functions from types
export {
  themeToCSSVariables,
  themeToCSS,
} from './types.js';

// Theme definitions
export {
  themes,
  getTheme,
  getThemeNames,
  getThemesByCategory,
  getThemesByMode,
  defaultTheme,
  // Individual themes
  tokyoNight,
  dracula,
  gruvbox,
  solarizedDark,
  solarizedLight,
  githubLight,
  githubDark,
  professional,
  dark,
  technical,
  minimal,
  creative,
} from './definitions.js';

// SVG processor for dynamic theming
export {
  processSvgForDynamicTheming,
  processSvgsForDynamicTheming,
  svgUsesCssVariables,
} from './svg_processor.js';

// Font infrastructure
export {
  generateFontHTML,
  getThemeFontFamilies,
  fontRegistry,
  type FontSource,
  type FontFaceSource,
} from './fonts.js';
