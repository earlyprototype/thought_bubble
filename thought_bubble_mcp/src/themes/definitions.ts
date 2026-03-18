/**
 * Theme Definitions for thought_bubble
 * 
 * 12 curated themes: 7 new visually stunning themes + 5 original themes
 * All themes use the unified ThemeTokens interface for consistency.
 */

import type { ThemeTokens, ThemeRegistry, ThemeName } from './types.js';

// ============================================================================
// NEW THEMES (7)
// ============================================================================

/**
 * Tokyo Night - Popular VSCode theme with purple/blue aesthetics
 * Source: https://github.com/enkia/tokyo-night-vscode-theme
 */
export const tokyoNight: ThemeTokens = {
  id: 'tokyo_night',
  name: 'Tokyo Night',
  category: 'new',
  mode: 'dark',
  core: {
    bg: '#1a1b26',
    fg: '#a9b1d6',
    accent: '#7aa2f7',
    muted: '#565f89',
  },
  scales: {
    primary: ['#7aa2f7', '#bb9af7', '#7dcfff', '#9ece6a', '#e0af68'],
    sequential: ['#1a1b26', '#24283b', '#343b58', '#414868', '#565f89', '#787c99', '#9aa5ce', '#a9b1d6', '#c0caf5'],
    diverging: ['#f7768e', '#ff9e64', '#e0af68', '#d5d6db', '#a9b1d6', '#9aa5ce', '#7dcfff', '#7aa2f7', '#bb9af7', '#9d7cd8', '#ff007c'],
  },
  semantic: {
    success: '#9ece6a',
    warning: '#e0af68',
    error: '#f7768e',
    info: '#7dcfff',
  },
  ui: {
    surface: '#24283b',
    border: '#414868',
    shadow: 'rgba(0, 0, 0, 0.5)',
    textSecondary: '#565f89',
  },
  typography: {
    display: {
      family: 'Clash Display',
      fallback: 'Georgia, serif',
      weights: '300;400;500',
    },
    body: {
      family: 'Switzer',
      fallback: 'system-ui, sans-serif',
      weights: '400;500',
    },
    mono: {
      family: 'Commit Mono',
      fallback: 'JetBrains Mono, monospace',
      weights: '400;700',
    },
    googleFontsUrl: null,
  },
};

/**
 * Dracula - Dark theme with vibrant purple, pink, and cyan
 * Source: https://draculatheme.com/contribute
 */
export const dracula: ThemeTokens = {
  id: 'dracula',
  name: 'Dracula',
  category: 'new',
  mode: 'dark',
  core: {
    bg: '#282a36',
    fg: '#f8f8f2',
    accent: '#bd93f9',
    muted: '#6272a4',
  },
  scales: {
    primary: ['#bd93f9', '#ff79c6', '#8be9fd', '#50fa7b', '#ffb86c'],
    sequential: ['#282a36', '#343746', '#404256', '#4d4e66', '#6272a4', '#7e8ab4', '#9aa2c4', '#b6bbd4', '#f8f8f2'],
    diverging: ['#ff5555', '#ff6e6e', '#ff9580', '#ffb86c', '#f1fa8c', '#e6e6e6', '#8be9fd', '#79d4e8', '#69c0d7', '#50fa7b', '#3de068'],
  },
  semantic: {
    success: '#50fa7b',
    warning: '#ffb86c',
    error: '#ff5555',
    info: '#8be9fd',
  },
  ui: {
    surface: '#343746',
    border: '#44475a',
    shadow: 'rgba(0, 0, 0, 0.4)',
    textSecondary: '#6272a4',
  },
  typography: {
    display: {
      family: 'Satoshi',
      fallback: 'Inter, sans-serif',
      weights: '400;500;700',
    },
    body: {
      family: 'IBM Plex Sans',
      fallback: 'system-ui, sans-serif',
      weights: '400;500',
    },
    mono: {
      family: 'IBM Plex Mono',
      fallback: 'Fira Code, monospace',
      weights: '400;500',
    },
    googleFontsUrl: null,
  },
};

/**
 * Gruvbox - Retro groove color scheme with warm tones
 * Source: https://github.com/morhetz/gruvbox
 */
export const gruvbox: ThemeTokens = {
  id: 'gruvbox',
  name: 'Gruvbox',
  category: 'new',
  mode: 'dark',
  core: {
    bg: '#282828',
    fg: '#ebdbb2',
    accent: '#fe8019',
    muted: '#928374',
  },
  scales: {
    primary: ['#fe8019', '#fabd2f', '#b8bb26', '#83a598', '#d3869b'],
    sequential: ['#282828', '#3c3836', '#504945', '#665c54', '#7c6f64', '#928374', '#a89984', '#bdae93', '#ebdbb2'],
    diverging: ['#cc241d', '#d65d0e', '#fe8019', '#fabd2f', '#d79921', '#ebdbb2', '#b8bb26', '#98971a', '#689d6a', '#458588', '#076678'],
  },
  semantic: {
    success: '#b8bb26',
    warning: '#fabd2f',
    error: '#fb4934',
    info: '#83a598',
  },
  ui: {
    surface: '#3c3836',
    border: '#504945',
    shadow: 'rgba(0, 0, 0, 0.4)',
    textSecondary: '#928374',
  },
  typography: {
    display: {
      family: 'Vollkorn',
      fallback: 'Georgia, serif',
      weights: '400;500;600',
    },
    body: {
      family: 'Source Sans 3',
      fallback: 'system-ui, sans-serif',
      weights: '400;500',
    },
    mono: {
      family: 'Source Code Pro',
      fallback: 'monospace',
      weights: '400;500',
    },
    googleFontsUrl: null,
  },
};

/**
 * Solarized Dark - Precision colors for machines and people
 * Source: https://ethanschoonover.com/solarized/
 */
export const solarizedDark: ThemeTokens = {
  id: 'solarized_dark',
  name: 'Solarized Dark',
  category: 'new',
  mode: 'dark',
  core: {
    bg: '#002b36',
    fg: '#839496',
    accent: '#268bd2',
    muted: '#586e75',
  },
  scales: {
    primary: ['#268bd2', '#2aa198', '#859900', '#b58900', '#cb4b16'],
    sequential: ['#002b36', '#073642', '#1a4a52', '#2d5f62', '#3f7472', '#518a82', '#63a192', '#76b8a2', '#839496'],
    diverging: ['#dc322f', '#cb4b16', '#d56320', '#d87b2a', '#b58900', '#839496', '#2aa198', '#268bd2', '#6c71c4', '#859900', '#93a1a1'],
  },
  semantic: {
    success: '#859900',
    warning: '#b58900',
    error: '#dc322f',
    info: '#2aa198',
  },
  ui: {
    surface: '#073642',
    border: '#586e75',
    shadow: 'rgba(0, 0, 0, 0.3)',
    textSecondary: '#657b83',
  },
  typography: {
    display: {
      family: 'Newsreader',
      fallback: 'Georgia, serif',
      weights: '500;700',
    },
    body: {
      family: 'Literata',
      fallback: 'Georgia, serif',
      weights: '400;500',
    },
    mono: {
      family: 'Fira Code',
      fallback: 'monospace',
      weights: '400;500',
    },
    googleFontsUrl: null,
  },
};

/**
 * Solarized Light - Light variant of precision colors
 * Source: https://ethanschoonover.com/solarized/
 */
export const solarizedLight: ThemeTokens = {
  id: 'solarized_light',
  name: 'Solarized Light',
  category: 'new',
  mode: 'light',
  core: {
    bg: '#fdf6e3',
    fg: '#657b83',
    accent: '#268bd2',
    muted: '#93a1a1',
  },
  scales: {
    primary: ['#268bd2', '#2aa198', '#859900', '#b58900', '#cb4b16'],
    sequential: ['#fdf6e3', '#f5efe0', '#ede8dc', '#e5e1d8', '#d5d2ca', '#c5c3bc', '#93a1a1', '#839496', '#657b83'],
    diverging: ['#dc322f', '#cb4b16', '#d56320', '#d87b2a', '#b58900', '#657b83', '#2aa198', '#268bd2', '#6c71c4', '#859900', '#586e75'],
  },
  semantic: {
    success: '#859900',
    warning: '#b58900',
    error: '#dc322f',
    info: '#2aa198',
  },
  ui: {
    surface: '#eee8d5',
    border: '#93a1a1',
    shadow: 'rgba(0, 0, 0, 0.1)',
    textSecondary: '#93a1a1',
  },
  typography: {
    display: {
      family: 'Newsreader',
      fallback: 'Georgia, serif',
      weights: '500;700',
    },
    body: {
      family: 'Literata',
      fallback: 'Georgia, serif',
      weights: '400;500',
    },
    mono: {
      family: 'Fira Code',
      fallback: 'monospace',
      weights: '400;500',
    },
    googleFontsUrl: null,
  },
};

/**
 * GitHub Light - Clean and familiar light theme
 * Source: https://primer.style/primitives/colors
 */
export const githubLight: ThemeTokens = {
  id: 'github_light',
  name: 'GitHub Light',
  category: 'new',
  mode: 'light',
  core: {
    bg: '#ffffff',
    fg: '#24292f',
    accent: '#0969da',
    muted: '#57606a',
  },
  scales: {
    primary: ['#0969da', '#8250df', '#bf3989', '#cf222e', '#e16f24'],
    sequential: ['#ffffff', '#f6f8fa', '#eaeef2', '#d0d7de', '#afb8c1', '#8c959f', '#6e7781', '#57606a', '#24292f'],
    diverging: ['#cf222e', '#da3633', '#e85d5d', '#f08989', '#f8b4b4', '#d0d7de', '#79c0ff', '#54aeff', '#218bff', '#0969da', '#0550ae'],
  },
  semantic: {
    success: '#1a7f37',
    warning: '#9a6700',
    error: '#cf222e',
    info: '#0969da',
  },
  ui: {
    surface: '#f6f8fa',
    border: '#d0d7de',
    shadow: 'rgba(31, 35, 40, 0.12)',
    textSecondary: '#57606a',
  },
  typography: {
    display: {
      family: 'Atkinson Hyperlegible Next',
      fallback: '-apple-system, BlinkMacSystemFont, sans-serif',
      weights: '600;700',
    },
    body: {
      family: 'Atkinson Hyperlegible Next',
      fallback: '-apple-system, BlinkMacSystemFont, sans-serif',
      weights: '400;500',
    },
    mono: {
      family: 'JetBrains Mono',
      fallback: 'Fira Code, monospace',
      weights: '400;500',
    },
    googleFontsUrl: null,
  },
};

/**
 * GitHub Dark - Clean and familiar dark theme
 * Source: https://primer.style/primitives/colors
 */
export const githubDark: ThemeTokens = {
  id: 'github_dark',
  name: 'GitHub Dark',
  category: 'new',
  mode: 'dark',
  core: {
    bg: '#0d1117',
    fg: '#c9d1d9',
    accent: '#58a6ff',
    muted: '#8b949e',
  },
  scales: {
    primary: ['#58a6ff', '#a371f7', '#db61a2', '#f85149', '#db6d28'],
    sequential: ['#0d1117', '#161b22', '#21262d', '#30363d', '#484f58', '#6e7681', '#8b949e', '#b1bac4', '#c9d1d9'],
    diverging: ['#f85149', '#ff7b72', '#ffa198', '#ffc6bf', '#ffdcd7', '#30363d', '#79c0ff', '#58a6ff', '#388bfd', '#1f6feb', '#0550ae'],
  },
  semantic: {
    success: '#3fb950',
    warning: '#d29922',
    error: '#f85149',
    info: '#58a6ff',
  },
  ui: {
    surface: '#161b22',
    border: '#30363d',
    shadow: 'rgba(0, 0, 0, 0.4)',
    textSecondary: '#8b949e',
  },
  typography: {
    display: {
      family: 'Atkinson Hyperlegible Next',
      fallback: '-apple-system, BlinkMacSystemFont, sans-serif',
      weights: '600;700',
    },
    body: {
      family: 'Atkinson Hyperlegible Next',
      fallback: '-apple-system, BlinkMacSystemFont, sans-serif',
      weights: '400;500',
    },
    mono: {
      family: 'JetBrains Mono',
      fallback: 'Fira Code, monospace',
      weights: '400;500',
    },
    googleFontsUrl: null,
  },
};

// ============================================================================
// ORIGINAL THEMES (5) - Converted to new token system
// ============================================================================

/**
 * Professional - Corporate blue/slate theme (original default)
 * Source: Original thought_bubble theme
 */
export const professional: ThemeTokens = {
  id: 'professional',
  name: 'Professional',
  category: 'original',
  mode: 'light',
  core: {
    bg: '#ffffff',
    fg: '#333333',
    accent: '#3498db',
    muted: '#7f8c8d',
  },
  scales: {
    primary: ['#3498db', '#2c3e50', '#e74c3c', '#27ae60', '#f39c12'],
    sequential: ['#ffffff', '#f8f9fa', '#ecf0f1', '#dee2e6', '#bdc3c7', '#95a5a6', '#7f8c8d', '#6c757d', '#333333'],
    diverging: ['#e74c3c', '#ec7063', '#f1948a', '#f5b7b1', '#fadbd8', '#ffffff', '#aed6f1', '#85c1e9', '#5dade2', '#3498db', '#2980b9'],
  },
  semantic: {
    success: '#27ae60',
    warning: '#f39c12',
    error: '#e74c3c',
    info: '#3498db',
  },
  ui: {
    surface: '#f8f9fa',
    border: '#e0e0e0',
    shadow: 'rgba(0, 0, 0, 0.1)',
    textSecondary: '#7f8c8d',
  },
  typography: {
    display: {
      family: 'Plus Jakarta Sans',
      fallback: 'Inter, sans-serif',
      weights: '400;500;600',
    },
    body: {
      family: 'Source Serif 4',
      fallback: 'Georgia, serif',
      weights: '400;500',
    },
    mono: {
      family: 'JetBrains Mono',
      fallback: 'monospace',
      weights: '400;500',
    },
    googleFontsUrl: null,
  },
};

/**
 * Dark - Generic dark mode theme (original)
 * Source: Original thought_bubble theme
 */
export const dark: ThemeTokens = {
  id: 'dark',
  name: 'Dark',
  category: 'original',
  mode: 'dark',
  core: {
    bg: '#1a1a1a',
    fg: '#e5e5e5',
    accent: '#60a5fa',
    muted: '#a3a3a3',
  },
  scales: {
    primary: ['#60a5fa', '#818cf8', '#f472b6', '#34d399', '#fbbf24'],
    sequential: ['#1a1a1a', '#262626', '#333333', '#404040', '#525252', '#737373', '#a3a3a3', '#d4d4d4', '#e5e5e5'],
    diverging: ['#f472b6', '#f69dc9', '#f8c9dc', '#fce4ec', '#fdf2f8', '#404040', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8'],
  },
  semantic: {
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
  },
  ui: {
    surface: '#2d2d2d',
    border: '#404040',
    shadow: 'rgba(0, 0, 0, 0.4)',
    textSecondary: '#a3a3a3',
  },
  typography: {
    display: {
      family: 'General Sans',
      fallback: 'Inter, sans-serif',
      weights: '300;400;500',
    },
    body: {
      family: 'Inter',
      fallback: 'system-ui, sans-serif',
      weights: '400;500',
    },
    mono: {
      family: 'Fira Code',
      fallback: 'monospace',
      weights: '400;500',
    },
    googleFontsUrl: null,
  },
};

/**
 * Technical - Cyan/green on dark for technical docs (original)
 * Source: Original thought_bubble theme
 */
export const technical: ThemeTokens = {
  id: 'technical',
  name: 'Technical',
  category: 'original',
  mode: 'dark',
  core: {
    bg: '#0f172a',
    fg: '#f1f5f9',
    accent: '#00d9ff',
    muted: '#64748b',
  },
  scales: {
    primary: ['#00d9ff', '#00ff88', '#fbbf24', '#f472b6', '#a78bfa'],
    sequential: ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0', '#f1f5f9'],
    diverging: ['#ff006e', '#ff3d8a', '#ff79a6', '#ffb4c2', '#ffd9e2', '#334155', '#66ffcc', '#33ffb8', '#00ff88', '#00d9ff', '#00b8d9'],
  },
  semantic: {
    success: '#10b981',
    warning: '#fbbf24',
    error: '#ef4444',
    info: '#00d9ff',
  },
  ui: {
    surface: '#1e293b',
    border: '#334155',
    shadow: 'rgba(0, 0, 0, 0.5)',
    textSecondary: '#94a3b8',
  },
  typography: {
    display: {
      family: 'Azeret Mono',
      fallback: 'Fira Code, monospace',
      weights: '500;700',
    },
    body: {
      family: 'Inter',
      fallback: 'system-ui, sans-serif',
      weights: '400;500',
    },
    mono: {
      family: 'Azeret Mono',
      fallback: 'Fira Code, monospace',
      weights: '400;500',
    },
    googleFontsUrl: null,
  },
};

/**
 * Minimal - Pure black/white minimalist theme (original)
 * Source: Original thought_bubble theme
 */
export const minimal: ThemeTokens = {
  id: 'minimal',
  name: 'Minimal',
  category: 'original',
  mode: 'light',
  core: {
    bg: '#ffffff',
    fg: '#1a202c',
    accent: '#3182ce',
    muted: '#718096',
  },
  scales: {
    primary: ['#3182ce', '#4a5568', '#38a169', '#dd6b20', '#9f7aea'],
    sequential: ['#ffffff', '#f7fafc', '#edf2f7', '#e2e8f0', '#cbd5e0', '#a0aec0', '#718096', '#4a5568', '#1a202c'],
    diverging: ['#c53030', '#e53e3e', '#fc8181', '#feb2b2', '#fed7d7', '#e2e8f0', '#90cdf4', '#63b3ed', '#4299e1', '#3182ce', '#2b6cb0'],
  },
  semantic: {
    success: '#38a169',
    warning: '#dd6b20',
    error: '#e53e3e',
    info: '#3182ce',
  },
  ui: {
    surface: '#fafafa',
    border: '#e2e8f0',
    shadow: 'rgba(0, 0, 0, 0.05)',
    textSecondary: '#718096',
  },
  typography: {
    display: {
      family: 'Cormorant',
      fallback: 'Georgia, serif',
      weights: '300;400;500',
    },
    body: {
      family: 'Lora',
      fallback: 'Georgia, serif',
      weights: '400;500',
    },
    mono: {
      family: 'Commit Mono',
      fallback: 'Courier New, monospace',
      weights: '400',
    },
    googleFontsUrl: null,
  },
};

/**
 * Creative - Purple gradient theme for creative projects (original)
 * Source: Original thought_bubble theme
 */
export const creative: ThemeTokens = {
  id: 'creative',
  name: 'Creative',
  category: 'original',
  mode: 'light',
  core: {
    bg: '#ffffff',
    fg: '#2d3748',
    accent: '#667eea',
    muted: '#718096',
  },
  scales: {
    primary: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'],
    sequential: ['#ffffff', '#f5f7fa', '#edf1f7', '#e2e8f0', '#c3cfe2', '#a5b4d0', '#718096', '#4a5568', '#2d3748'],
    diverging: ['#f093fb', '#e879f9', '#d946ef', '#c026d3', '#a21caf', '#f5f7fa', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1'],
  },
  semantic: {
    success: '#4facfe',
    warning: '#ffd89b',
    error: '#f093fb',
    info: '#5ddef4',
  },
  ui: {
    surface: '#f5f7fa',
    border: '#e2e8f0',
    shadow: 'rgba(102, 126, 234, 0.15)',
    textSecondary: '#718096',
  },
  typography: {
    display: {
      family: 'DM Sans',
      fallback: 'Inter, sans-serif',
      weights: '600;700',
    },
    body: {
      family: 'DM Sans',
      fallback: 'Inter, sans-serif',
      weights: '400;500',
    },
    mono: {
      family: 'Victor Mono',
      fallback: 'Fira Code, monospace',
      weights: '400;500',
    },
    googleFontsUrl: null,
  },
};

// ============================================================================
// THEME REGISTRY
// ============================================================================

/**
 * Complete registry of all available themes
 */
export const themes: ThemeRegistry = {
  // New themes
  tokyo_night: tokyoNight,
  dracula: dracula,
  gruvbox: gruvbox,
  solarized_dark: solarizedDark,
  solarized_light: solarizedLight,
  github_light: githubLight,
  github_dark: githubDark,
  // Original themes
  professional: professional,
  dark: dark,
  technical: technical,
  minimal: minimal,
  creative: creative,
};

/**
 * Get a theme by name
 */
export function getTheme(name: ThemeName): ThemeTokens {
  const theme = themes[name];
  if (!theme) {
    throw new Error(`Unknown theme: ${name}`);
  }
  return theme;
}

/**
 * Get all theme names
 */
export function getThemeNames(): ThemeName[] {
  return Object.keys(themes) as ThemeName[];
}

/**
 * Get themes by category
 */
export function getThemesByCategory(category: 'new' | 'original'): ThemeTokens[] {
  return Object.values(themes).filter(theme => theme.category === category);
}

/**
 * Get themes by mode
 */
export function getThemesByMode(mode: 'dark' | 'light'): ThemeTokens[] {
  return Object.values(themes).filter(theme => theme.mode === mode);
}

/**
 * Default theme
 */
export const defaultTheme: ThemeName = 'tokyo_night';
