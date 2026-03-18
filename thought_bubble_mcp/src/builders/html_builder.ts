/**
 * HTML Builder
 * 
 * Generates self-contained HTML files with embedded SVGs,
 * themed styling, and interactive features.
 */

import { themes, themeToCSSVariables, type ThemeTokens, type ThemeName } from '../themes/index.js';
import { generateFontHTML, getThemeFontFamilies } from '../themes/fonts.js';

/**
 * Section roles control visual treatment within a layout.
 * Layouts that don't support a given role treat it as 'default'.
 */
export type SectionRole =
  | 'default' | 'metric' | 'pull-quote' | 'lead'
  | 'statement' | 'full-width' | 'supporting';

/**
 * Section content for the HTML output
 */
export interface Section {
  id: string;
  title: string;
  content: string;
  diagram?: {
    svg: string;
    caption?: string;
  };
  animation?: 'stagger' | 'draw' | 'grow' | 'fade' | 'none';
  role?: SectionRole;
}

/**
 * Navigation styles
 */
export type NavigationStyle = 'sidebar' | 'tabs' | 'minimal';

/**
 * Layout templates
 */
export type LayoutTemplate =
  | 'sidebar' | 'magazine' | 'presentation' | 'dashboard' | 'minimal' | 'editorial'
  | 'comparison' | 'briefing' | 'tutorial' | 'scorecard' | 'report' | 'dossier' | 'dialogue';

/**
 * Density presets control spacing intensity across all layouts.
 */
export type DensityPreset = 'compact' | 'comfortable' | 'spacious';

/**
 * HTML builder options
 */
export interface HTMLBuilderOptions {
  title: string;
  subtitle?: string;
  theme: ThemeName;
  navigationStyle: NavigationStyle;
  /** Layout template - overrides navigationStyle if specified */
  layout?: LayoutTemplate;
  sections: Section[];
  enableThemeSwitcher?: boolean;
  footer?: string;
  /** Hero section for magazine layout */
  hero?: {
    title: string;
    subtitle?: string;
    metric?: { value: string; label: string };
  };
  density?: DensityPreset;
}

/**
 * Generate CSS variables from all themes for live switching
 */
function generateThemeCSS(): string {
  let css = '';
  
  // Default theme (Tokyo Night)
  const defaultTheme = themes.tokyo_night;
  const defaultVars = themeToCSSVariables(defaultTheme);
  css += ':root {\n';
  for (const [key, value] of Object.entries(defaultVars)) {
    css += `  ${key}: ${value};\n`;
  }
  css += '}\n\n';

  // Theme-specific classes
  for (const [name, theme] of Object.entries(themes)) {
    const vars = themeToCSSVariables(theme);
    css += `[data-theme="${name}"] {\n`;
    for (const [key, value] of Object.entries(vars)) {
      css += `  ${key}: ${value};\n`;
    }
    css += '}\n\n';
  }

  return css;
}

/**
 * Generate base CSS styles
 */
function generateBaseCSS(): string {
  return `
/* Density layer -- overridden by data-density attribute on body */
:root {
  --layout-gap: 24px;
  --section-padding-v: 24px;
  --section-padding-h: 24px;
}
[data-density="compact"] {
  --layout-gap: 16px;
  --section-padding-v: 16px;
  --section-padding-h: 16px;
}
[data-density="comfortable"] {
  --layout-gap: 24px;
  --section-padding-v: 24px;
  --section-padding-h: 24px;
}
[data-density="spacious"] {
  --layout-gap: 32px;
  --section-padding-v: 32px;
  --section-padding-h: 32px;
}
@media (max-width: 768px) {
  [data-density="spacious"] {
    --layout-gap: 24px;
    --section-padding-v: 24px;
    --section-padding-h: 20px;
  }
  [data-density="comfortable"] {
    --layout-gap: 20px;
    --section-padding-v: 20px;
    --section-padding-h: 16px;
  }
}

/* Reset & Base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  line-height: 1.6;
  background: var(--bg);
  color: var(--fg);
  min-height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Typography Scale (1.25 ratio - Major Third) */
:root {
  --text-xs: 0.64rem;
  --text-sm: 0.8rem;
  --text-base: 1rem;
  --text-lg: 1.25rem;
  --text-xl: 1.563rem;
  --text-2xl: 1.953rem;
  --text-3xl: 2.441rem;
  --text-4xl: 3.052rem;
  --leading-tight: 1.2;
  --leading-snug: 1.35;
  --leading-normal: 1.6;
  --leading-relaxed: 1.75;
  --tracking-tight: -0.02em;
  --tracking-normal: 0;
  --tracking-wide: 0.05em;
}

/* Spacing System (8px grid) */
:root {
  --space-0: 0;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --space-9: 96px;
  --space-10: 128px;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
}

h1 { 
  font-size: var(--text-3xl); 
  font-weight: 400; 
  margin-bottom: 0.5rem; 
  letter-spacing: -0.03em;
}

h2 { 
  font-size: var(--text-2xl); 
  font-weight: 400; 
  margin-bottom: 1rem; 
}

h3 { 
  font-size: var(--text-xl); 
  font-weight: 500; 
  margin-bottom: 0.75rem;
  line-height: var(--leading-snug);
}

p { 
  margin-bottom: 1rem; 
  line-height: var(--leading-normal);
}

code, pre, .mono {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

a {
  color: var(--accent);
  text-decoration: none;
  transition: opacity 0.2s;
}
a:hover { opacity: 0.8; }

/* Layout */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px;
}

/* Header */
.header {
  text-align: center;
  padding: 40px 0 48px;
  margin-bottom: 40px;
}

.header h1 {
  color: var(--fg);
}

.header .subtitle {
  color: var(--text-secondary);
  font-size: 0.85rem;
  margin-top: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* Theme Switcher */
.theme-switcher {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.theme-switcher select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--fg);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.theme-switcher select:hover {
  border-color: var(--accent);
}

.theme-switcher select:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent)20;
}

/* Cards */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: var(--section-padding-v) var(--section-padding-h);
  margin-bottom: var(--layout-gap);
  box-shadow: 0 1px 3px 0 var(--shadow);
  transition: border-color 0.2s;
}

.card:hover {
  border-color: var(--accent);
}

/* Minimal layout: strip card chrome -- charts sit in page flow, not boxes */
.layout-minimal .card {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
}
.layout-minimal .card:hover {
  border-color: transparent;
}
.layout-minimal .diagram-container {
  background: transparent;
  padding: 0;
  margin: 32px 0;
}

.minimal-hero {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 64px 24px;
}

.minimal-hero.fill-viewport {
  min-height: 100vh;
}

.minimal-hero h1 {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: 300;
  letter-spacing: -0.03em;
  margin-bottom: 16px;
}

.minimal-hero .subtitle {
  font-size: var(--text-lg);
  color: var(--text-secondary);
  margin-bottom: 48px;
}

.minimal-hero .diagram-container {
  max-width: 1000px;
  width: 100%;
}

.minimal-supporting {
  max-width: 720px;
  margin: 0 auto;
  padding: 64px 24px;
}

.card h2 {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 16px;
}


/* Diagram Container */
.diagram-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  background: transparent;
  border-radius: 4px;
  overflow: auto;
  margin-top: 16px;
  position: relative;
}

.diagram-container svg {
  max-width: 100%;
  height: auto;
}

.diagram-caption {
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 12px;
  font-style: italic;
}

/* D3 Chart Hover States */
.diagram-container svg .bar,
.diagram-container svg .pie-slice,
.diagram-container svg .gantt-bar,
.diagram-container svg .data-point {
  transition: transform 0.15s ease, filter 0.15s ease, opacity 0.15s ease;
}

.diagram-container svg .bar:hover {
  transform: scaleY(1.02);
  transform-origin: bottom;
  transform-box: fill-box;
  filter: brightness(1.08);
}

.diagram-container svg .pie-slice:hover {
  transform: scale(1.02);
  transform-origin: center;
  filter: brightness(1.05);
}

.diagram-container svg .gantt-bar:hover {
  transform: scaleY(1.05);
  transform-origin: center;
  filter: brightness(1.05);
}

.diagram-container svg .data-point:hover {
  transform: scale(1.3);
  filter: brightness(1.1);
}

/* Chart Tooltip */
.chart-tooltip {
  position: absolute;
  visibility: hidden;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 12px 16px;
  box-shadow: 0 4px 16px var(--shadow);
  font-size: 13px;
  pointer-events: none;
  z-index: 1000;
  max-width: 250px;
  transition: opacity 0.15s ease;
}

.chart-tooltip .tooltip-label {
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--fg);
}

.chart-tooltip .tooltip-value {
  font-family: var(--font-mono);
  font-size: 16px;
  color: var(--emphasis);
}

.chart-tooltip .tooltip-secondary {
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 4px;
}

/* D3 Chart Entry Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes growBar {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}

@keyframes drawLine {
  from {
    stroke-dashoffset: 1000;
  }
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes staggerFade {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .diagram-container svg {
    animation: fadeIn 0.3s ease-out;
  }

  .diagram-container svg .bar {
    animation: growBar 0.4s cubic-bezier(0.22, 1, 0.36, 1) backwards;
    transform-origin: bottom;
    transform-box: fill-box;
  }

  .diagram-container svg .bar:nth-child(1) { animation-delay: 0.05s; }
  .diagram-container svg .bar:nth-child(2) { animation-delay: 0.1s; }
  .diagram-container svg .bar:nth-child(3) { animation-delay: 0.15s; }
  .diagram-container svg .bar:nth-child(4) { animation-delay: 0.2s; }
  .diagram-container svg .bar:nth-child(5) { animation-delay: 0.25s; }
  .diagram-container svg .bar:nth-child(6) { animation-delay: 0.3s; }
  .diagram-container svg .bar:nth-child(7) { animation-delay: 0.35s; }
  .diagram-container svg .bar:nth-child(8) { animation-delay: 0.4s; }
  .diagram-container svg .bar:nth-child(n+9) { animation-delay: 0.4s; }

  .diagram-container svg .data-point {
    animation: fadeInUp 0.4s ease-out backwards;
  }

  .diagram-container svg .data-point:nth-child(1) { animation-delay: 0.1s; }
  .diagram-container svg .data-point:nth-child(2) { animation-delay: 0.15s; }
  .diagram-container svg .data-point:nth-child(3) { animation-delay: 0.2s; }
  .diagram-container svg .data-point:nth-child(4) { animation-delay: 0.25s; }
  .diagram-container svg .data-point:nth-child(5) { animation-delay: 0.3s; }
  .diagram-container svg .data-point:nth-child(n+6) { animation-delay: 0.3s; }
}

.diagram-container svg .pie-slice {
  animation: fadeIn 0.5s ease-out backwards;
}

.diagram-container svg .pie-slice:nth-child(1) { animation-delay: 0.05s; }
.diagram-container svg .pie-slice:nth-child(2) { animation-delay: 0.1s; }
.diagram-container svg .pie-slice:nth-child(3) { animation-delay: 0.15s; }
.diagram-container svg .pie-slice:nth-child(4) { animation-delay: 0.2s; }
.diagram-container svg .pie-slice:nth-child(5) { animation-delay: 0.25s; }

/* Animation targeting via data-animation attribute */
@media (prefers-reduced-motion: no-preference) {
  [data-animation="draw"] svg path[fill="none"] {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: drawLine 1.5s ease-out 0.3s forwards;
  }

  [data-animation="stagger"] svg .bar,
  [data-animation="stagger"] svg .pie-slice {
    animation: staggerFade 0.4s cubic-bezier(0.22, 1, 0.36, 1) backwards;
  }

  [data-animation="grow"] svg .bar {
    animation: growBar 0.6s cubic-bezier(0.22, 1, 0.36, 1) backwards;
    transform-origin: bottom;
    transform-box: fill-box;
  }

  [data-animation="fade"] svg {
    animation: fadeIn 0.6s ease-out;
  }

  [data-animation="none"] svg,
  [data-animation="none"] svg .bar,
  [data-animation="none"] svg .data-point,
  [data-animation="none"] svg .pie-slice {
    animation: none !important;
  }
}

/* Section Entry Choreography */
@keyframes tb-enter {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: no-preference) {
  .tb-section-enter {
    animation: tb-enter 280ms ease-out both;
  }
  .tb-section-enter:nth-child(2) { animation-delay: 60ms; }
  .tb-section-enter:nth-child(3) { animation-delay: 120ms; }
  .tb-section-enter:nth-child(4) { animation-delay: 180ms; }
  .tb-section-enter:nth-child(5) { animation-delay: 240ms; }
  .tb-section-enter:nth-child(n+6) { animation-delay: 240ms; }
}

/* Grid Layout */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--layout-gap);
}

/* Sidebar Navigation */
.layout-sidebar {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 280px;
  background: var(--surface);
  border-right: 1px solid var(--border);
  padding: 24px;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
}

.sidebar h2 {
  font-size: 1.1rem;
  color: var(--fg);
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

.sidebar nav a {
  display: block;
  padding: 10px 16px;
  margin: 4px 0;
  border-radius: 8px;
  color: var(--fg);
  transition: all 0.2s;
}

.sidebar nav a:hover {
  background: var(--border);
}

.sidebar nav a.active {
  background: var(--accent);
  color: var(--bg);
}

.main-content {
  margin-left: 280px;
  flex: 1;
  padding: 40px;
}

/* Tab Navigation */
.tabs-container {
  margin-bottom: 24px;
}

.tab-buttons {
  display: flex;
  gap: 4px;
  border-bottom: 2px solid var(--border);
  padding-bottom: 0;
}

.tab-button {
  padding: 12px 24px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
}

.tab-button:hover {
  color: var(--fg);
}

.tab-button.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

.tab-content {
  display: none;
  padding: 24px 0;
}

.tab-content.active {
  display: block;
}

/* Section */
.section {
  margin-bottom: calc(var(--layout-gap) * 1.5);
}

/* Footer */
.footer {
  text-align: center;
  padding: 24px;
  border-top: 1px solid var(--border);
  margin-top: 40px;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* ============================================
   MAGAZINE LAYOUT
   ============================================ */
.layout-magazine {
  display: flex;
  flex-direction: column;
}

.magazine-hero {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 64px 24px;
  background: linear-gradient(180deg, var(--surface) 0%, var(--bg) 100%);
  border-bottom: 1px solid var(--border);
}

.magazine-hero h1 {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: 300;
  letter-spacing: -0.03em;
  margin-bottom: 16px;
  max-width: 900px;
}

.magazine-hero .subtitle {
  font-size: var(--text-lg);
  color: var(--text-secondary);
  max-width: 600px;
  line-height: var(--leading-relaxed);
}

.magazine-hero .hero-metric {
  margin-top: 48px;
  padding: 32px 48px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 8px 32px var(--shadow);
}

.magazine-hero .hero-metric .value {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: 300;
  color: var(--emphasis);
}

.magazine-hero .hero-metric .label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  margin-top: 8px;
}

.magazine-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 64px 24px;
}

.magazine-section {
  margin-bottom: 80px;
}

.magazine-section.full-width {
  max-width: none;
  margin-left: -24px;
  margin-right: -24px;
  padding: 48px 24px;
}

.magazine-section:first-child .magazine-grid {
  grid-template-columns: 1fr;
}

.magazine-section:first-child .magazine-visual {
  max-width: 60%;
  margin: 0 auto;
}

.magazine-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
}

.magazine-grid.reverse {
  direction: rtl;
}

.magazine-grid.reverse > * {
  direction: ltr;
}

.magazine-text {
  max-width: 520px;
}

.magazine-text h2 {
  font-family: var(--font-display);
  margin-bottom: 16px;
}

.magazine-text p {
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
}

.pull-quote {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-style: italic;
  color: var(--emphasis);
  border-left: 4px solid var(--accent);
  padding-left: 24px;
  margin: 48px 0;
  max-width: 720px;
}

.magazine-lead {
  max-width: 900px;
  margin: 0 auto 64px;
  text-align: center;
}

.magazine-lead p {
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
  color: var(--fg);
}

.magazine-rhythm-break {
  margin-top: 96px;
}

/* ============================================
   PRESENTATION LAYOUT
   ============================================ */
.layout-presentation {
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
  height: 100vh;
}

.presentation-slide {
  min-height: 100vh;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 64px;
  position: relative;
}

.presentation-slide:nth-child(even) {
  background: transparent;
}

.presentation-content {
  max-width: 1000px;
  text-align: center;
}

.presentation-content h2 {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  margin-bottom: 24px;
}

.presentation-content p {
  font-size: var(--text-lg);
  color: var(--text-secondary);
  margin-bottom: 32px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.presentation-visual {
  margin-top: 32px;
  width: 100%;
  max-width: 900px;
}

.slide-indicator {
  position: fixed;
  right: 32px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 100;
}

.slide-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--border);
  cursor: pointer;
  transition: all 0.2s;
}

.slide-dot.active {
  background: var(--accent);
  transform: scale(1.3);
}

.slide-statement .presentation-content {
  max-width: 15ch;
}
.slide-statement .presentation-content h2 {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: 300;
  letter-spacing: -0.03em;
  line-height: var(--leading-tight);
}

.slide-full-width .presentation-visual {
  max-width: 100%;
  max-height: 80vh;
}
.slide-full-width .presentation-content p {
  font-size: var(--text-base);
  max-width: 500px;
}

.slide-metric .presentation-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.slide-metric .metric-display {
  font-family: var(--font-mono);
  font-size: 6rem;
  font-weight: 300;
  color: var(--emphasis);
  line-height: 1;
  margin-bottom: 16px;
}
.slide-metric .metric-label {
  font-size: var(--text-lg);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}

/* ============================================
   DASHBOARD LAYOUT
   ============================================ */
.layout-dashboard {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.dashboard-header {
  padding: 24px 32px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-header h1 {
  font-family: var(--font-display);
  font-size: var(--text-xl);
}

.dashboard-tabs {
  display: flex;
  gap: 8px;
}

.dashboard-tab {
  padding: 8px 16px;
  border-radius: 6px;
  background: transparent;
  border: 1px solid transparent;
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.dashboard-tab:hover {
  background: var(--bg);
}

.dashboard-tab.active {
  background: var(--accent);
  color: var(--bg);
}

.dashboard-content {
  flex: 1;
  padding: 32px;
}

.metric-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--layout-gap);
  margin-bottom: var(--layout-gap);
}

.metric-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: var(--section-padding-v) var(--section-padding-h);
  transition: all 0.2s;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px var(--shadow);
}

.metric-card .label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  margin-bottom: 8px;
}

.metric-card .value {
  font-family: var(--font-mono);
  font-size: var(--text-2xl);
  font-weight: 300;
  color: var(--emphasis);
}

.metric-card .change {
  font-size: var(--text-sm);
  margin-top: 8px;
}

.metric-card .change.positive {
  color: var(--success);
}

.metric-card .change.negative {
  color: var(--error);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--layout-gap);
}

.dashboard-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: var(--section-padding-v) var(--section-padding-h);
}

.dashboard-card.span-8 {
  grid-column: span 8;
}

.dashboard-card.span-6 {
  grid-column: span 6;
}

.dashboard-card.span-4 {
  grid-column: span 4;
}

.dashboard-card.span-12 {
  grid-column: span 12;
}

.dashboard-card.primary {
  border-color: var(--accent);
  box-shadow: 0 2px 12px var(--shadow);
}

.dashboard-card h3 {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

/* ============================================
   EDITORIAL LAYOUT
   ============================================ */
.layout-editorial {
  max-width: 720px;
  margin: 0 auto;
  padding: 64px 24px;
}

.layout-editorial .editorial-header {
  text-align: center;
  margin-bottom: 64px;
}

.layout-editorial .editorial-header h1 {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: 300;
  letter-spacing: -0.03em;
  margin-bottom: 16px;
}

.layout-editorial .editorial-header .subtitle {
  color: var(--text-secondary);
  font-size: var(--text-base);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.layout-editorial .editorial-section {
  margin-bottom: 56px;
}

.layout-editorial .editorial-section h2 {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 24px;
  color: var(--text-secondary);
}

.layout-editorial .editorial-section .content {
  text-align: justify;
  hyphens: auto;
  line-height: var(--leading-relaxed);
  max-width: 65ch;
}

.layout-editorial .editorial-section .diagram-container {
  background: transparent;
  border-radius: 0;
  padding: 0;
  margin: 32px 0;
}

.layout-editorial .editorial-section .diagram-caption {
  text-align: center;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  margin-top: 12px;
  font-style: italic;
}

.layout-editorial .editorial-section.breakout {
  width: 100vw;
  max-width: 1200px;
  margin-left: 50%;
  transform: translateX(-50%);
}

.layout-editorial .editorial-section.breakout .diagram-container {
  max-width: 100%;
}

/* ============================================
   COMPARISON LAYOUT
   ============================================ */
.layout-comparison {
  max-width: 1400px;
  margin: 0 auto;
  padding: 48px 24px;
}

.comparison-header {
  text-align: center;
  margin-bottom: 48px;
}

.comparison-header h1 {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 300;
  margin-bottom: 12px;
}

.comparison-header .subtitle {
  color: var(--text-secondary);
  font-size: var(--text-base);
}

.comparison-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--layout-gap);
  margin-bottom: 48px;
}

.comparison-column {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: var(--section-padding-v) var(--section-padding-h);
}

.comparison-column h2 {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--accent);
}

.comparison-shared {
  margin-top: 48px;
}

.comparison-shared h2 {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  text-align: center;
  margin-bottom: 24px;
}

/* ============================================
   BRIEFING LAYOUT
   ============================================ */
.layout-briefing {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
}

.briefing-header {
  margin-bottom: 32px;
}

.briefing-header h1 {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  margin-bottom: 8px;
}

.briefing-header .subtitle {
  color: var(--text-secondary);
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}

.briefing-lead {
  margin-bottom: 32px;
}

.briefing-lead .card {
  padding: var(--section-padding-v) var(--section-padding-h);
}

.briefing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--layout-gap);
  margin-bottom: 32px;
}

.briefing-grid .card {
  margin-bottom: 0;
}

.stats-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--layout-gap);
  margin-bottom: 32px;
}

.stats-strip .metric-card {
  text-align: center;
}

.briefing-actions {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: var(--section-padding-v) var(--section-padding-h);
}

.briefing-actions h2 {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  margin-bottom: 16px;
}

/* ============================================
   TUTORIAL LAYOUT
   ============================================ */
.layout-tutorial {
  max-width: 900px;
  margin: 0 auto;
  padding: 48px 24px;
}

.tutorial-header {
  text-align: center;
  margin-bottom: 64px;
}

.tutorial-header h1 {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 300;
  margin-bottom: 12px;
}

.tutorial-header .subtitle {
  color: var(--text-secondary);
}

.tutorial-progress {
  width: 100%;
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  margin-top: 24px;
  overflow: hidden;
}

.tutorial-progress-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.tutorial-steps {
  position: relative;
  padding-left: 48px;
}

.tutorial-steps::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--border);
}

.tutorial-step {
  position: relative;
  margin-bottom: 48px;
}

.tutorial-step-number {
  position: absolute;
  left: -48px;
  top: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--accent);
  color: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 600;
  z-index: 1;
}

.tutorial-step h2 {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  margin-bottom: 12px;
}

.tutorial-step .content {
  line-height: var(--leading-relaxed);
  margin-bottom: 16px;
}

.tutorial-takeaway {
  background: var(--surface);
  border-left: 3px solid var(--accent);
  border-radius: 0 8px 8px 0;
  padding: 16px 20px;
  margin-top: 16px;
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

/* ============================================
   SCORECARD LAYOUT
   ============================================ */
.layout-scorecard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px;
}

.scorecard-header {
  text-align: center;
  margin-bottom: 48px;
}

.scorecard-header h1 {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 300;
  margin-bottom: 12px;
}

.scorecard-overall {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 48px;
}

.scorecard-grade {
  font-family: var(--font-mono);
  font-size: 5rem;
  font-weight: 300;
  line-height: 1;
  margin-bottom: 8px;
}

.scorecard-grade-label {
  font-size: var(--text-lg);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}

.scorecard-categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--layout-gap);
  margin-bottom: 48px;
}

.scorecard-category {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: var(--section-padding-v) var(--section-padding-h);
  border-top: 4px solid var(--border);
}

.scorecard-category.status-success { border-top-color: var(--success); }
.scorecard-category.status-warning { border-top-color: var(--warning); }
.scorecard-category.status-error   { border-top-color: var(--error); }
.scorecard-category.status-info    { border-top-color: var(--info); }

.scorecard-category h3 {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  margin-bottom: 8px;
}

.scorecard-category .score {
  font-family: var(--font-mono);
  font-size: var(--text-2xl);
  font-weight: 300;
  margin-bottom: 8px;
}

.scorecard-breakdown {
  margin-bottom: 48px;
}

.scorecard-breakdown h2 {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  text-align: center;
  margin-bottom: 24px;
}

.scorecard-findings {
  max-width: 720px;
  margin: 0 auto;
}

.scorecard-findings h2 {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  margin-bottom: 16px;
}

/* ============================================
   REPORT LAYOUT
   ============================================ */
.layout-report {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
}

.report-cover {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 64px 24px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 48px;
}

.report-cover h1 {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: 300;
  letter-spacing: -0.03em;
  margin-bottom: 16px;
}

.report-cover .subtitle {
  color: var(--text-secondary);
  font-size: var(--text-lg);
  margin-bottom: 32px;
}

.report-cover .report-meta {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.report-toc {
  margin-bottom: 48px;
  padding: 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.report-toc h2 {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}

.report-toc ol {
  list-style: none;
  counter-reset: toc-counter;
  padding: 0;
}

.report-toc li {
  counter-increment: toc-counter;
  margin-bottom: 8px;
}

.report-toc li::before {
  content: counter(toc-counter) '. ';
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

.report-toc a {
  color: var(--fg);
  text-decoration: none;
}

.report-toc a:hover {
  color: var(--accent);
}

.report-section {
  margin-bottom: 48px;
  padding-top: 24px;
}

.report-section h2 {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  margin-bottom: 16px;
}

.report-section h2 .section-number {
  color: var(--text-secondary);
  font-family: var(--font-mono);
  margin-right: 8px;
}

.report-section.supporting {
  border-top: 1px solid var(--border);
  padding-top: 32px;
  opacity: 0.85;
}

.report-section .content {
  line-height: var(--leading-relaxed);
  max-width: 65ch;
}

@media print {
  .layout-report {
    max-width: none;
    padding: 0;
  }
  .report-section {
    page-break-before: auto;
    page-break-inside: avoid;
  }
  .report-cover {
    page-break-after: always;
  }
  .report-toc {
    page-break-after: always;
  }
  .theme-switcher { display: none; }
  .footer { display: none; }
  body {
    font-size: 12pt;
    color: #000;
    background: #fff;
  }
}

/* ============================================
   DOSSIER LAYOUT
   ============================================ */
.layout-dossier {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px;
}

.dossier-profile {
  text-align: center;
  margin-bottom: 48px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--border);
}

.dossier-profile h1 {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 300;
  margin-bottom: 8px;
}

.dossier-profile .dossier-identifiers {
  color: var(--text-secondary);
  font-size: var(--text-sm);
  letter-spacing: var(--tracking-wide);
}

.dossier-profile .dossier-headline-metric {
  margin-top: 24px;
}

.dossier-profile .dossier-headline-metric .value {
  font-family: var(--font-mono);
  font-size: var(--text-3xl);
  color: var(--emphasis);
}

.dossier-profile .dossier-headline-metric .label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}

.dossier-facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--layout-gap);
  margin-bottom: 48px;
}

.dossier-fact {
  text-align: center;
  padding: 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.dossier-fact .label {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  margin-bottom: 4px;
}

.dossier-fact .value {
  font-family: var(--font-mono);
  font-size: var(--text-lg);
  color: var(--emphasis);
}

.dossier-narrative {
  max-width: 720px;
  margin: 0 auto 48px;
  line-height: var(--leading-relaxed);
}

.dossier-narrative h2 {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  margin-bottom: 16px;
}

.dossier-deep-dives {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: var(--layout-gap);
  margin-bottom: 48px;
}

.dossier-deep-dive {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: var(--section-padding-v) var(--section-padding-h);
}

.dossier-deep-dive h3 {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

.dossier-statement {
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 300;
  color: var(--emphasis);
  padding: 48px 0;
}

/* ============================================
   DIALOGUE LAYOUT
   ============================================ */
.layout-dialogue {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px;
}

.dialogue-question {
  text-align: center;
  padding: 64px 24px;
  margin-bottom: 48px;
}

.dialogue-question h1 {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 300;
  letter-spacing: -0.02em;
  max-width: 20ch;
  margin: 0 auto 16px;
}

.dialogue-question .subtitle {
  color: var(--text-secondary);
  font-size: var(--text-base);
}

.dialogue-positions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--layout-gap);
  margin-bottom: 48px;
}

.dialogue-position {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: var(--section-padding-v) var(--section-padding-h);
}

.dialogue-position h2 {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--accent);
}

.dialogue-position .content {
  line-height: var(--leading-relaxed);
}

.dialogue-tradeoffs {
  max-width: 720px;
  margin: 0 auto 48px;
  padding: var(--section-padding-v) var(--section-padding-h);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.dialogue-tradeoffs h2 {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  text-align: center;
  margin-bottom: 16px;
}

.dialogue-conclusion {
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
}

.dialogue-conclusion h2 {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  margin-bottom: 16px;
}

.dialogue-conclusion .content {
  line-height: var(--leading-relaxed);
}

@media (max-width: 768px) {
  .dialogue-positions {
    grid-template-columns: 1fr;
  }
  .comparison-columns {
    grid-template-columns: 1fr;
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .metric-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard-card.span-8,
  .dashboard-card.span-6,
  .dashboard-card.span-4 {
    grid-column: span 1;
  }
  
  .magazine-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .magazine-grid.reverse {
    direction: ltr;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 20px;
  }
  
  h1 { font-size: 1.75rem; }
  h2 { font-size: 1.35rem; }
  
  .grid {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    position: relative;
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
  
  .main-content {
    margin-left: 0;
    padding: 20px;
  }
  
  .theme-switcher {
    position: relative;
    top: auto;
    right: auto;
    margin-bottom: 20px;
  }
  
  .metric-cards {
    grid-template-columns: 1fr;
  }
  
  .magazine-hero {
    min-height: 50vh;
    padding: 48px 20px;
  }
  
  .magazine-hero h1 {
    font-size: var(--text-2xl);
  }
  
  .presentation-slide {
    padding: 32px 20px;
  }
  
  .slide-indicator {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  
  .layout-presentation {
    scroll-snap-type: none;
  }
}
`;
}

/**
 * Generate theme switcher JavaScript
 */
function generateThemeSwitcherJS(): string {
  return `
// Theme definitions for live switching
const themeData = ${JSON.stringify(
  Object.entries(themes).map(([id, theme]) => ({
    id,
    name: theme.name,
    category: theme.category,
    mode: theme.mode,
  })),
  null,
  2
)};

// Per-document localStorage key — scoped to this document's title so each
// thought_bubble output remembers its own theme without affecting others.
var storageKey = 'tb-theme:' + document.title;

// Set theme and persist the choice for this document only
function setTheme(themeName) {
  document.documentElement.setAttribute('data-theme', themeName);
  try { localStorage.setItem(storageKey, themeName); } catch(e) {}
  const select = document.getElementById('theme-select');
  if (select) select.value = themeName;
}

// Initialize: use the user's saved choice for this document if it exists,
// otherwise fall back to the server-rendered default.
function initTheme() {
  var defaultTheme = document.documentElement.getAttribute('data-theme') || 'tokyo_night';
  var saved;
  try { saved = localStorage.getItem(storageKey); } catch(e) {}
  setTheme(saved || defaultTheme);
}

// Run on load
document.addEventListener('DOMContentLoaded', initTheme);
`;
}

/**
 * Generate navigation JavaScript
 */
function generateNavigationJS(style: NavigationStyle): string {
  if (style === 'sidebar') {
    return `
// Sidebar navigation
document.querySelectorAll('.sidebar nav a').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').slice(1);
    
    // Update active link
    document.querySelectorAll('.sidebar nav a').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
    
    // Scroll to section
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Update active link on scroll
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('.section[id]');
  const scrollPos = window.scrollY + 150;
  
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    
    if (scrollPos >= top && scrollPos < top + height) {
      document.querySelectorAll('.sidebar nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        }
      });
    }
  });
});
`;
  }

  if (style === 'tabs') {
    return `
// Tab navigation
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', function() {
    const tabId = this.getAttribute('data-tab');
    
    // Update buttons
    document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
      if (content.getAttribute('id') === tabId) {
        content.classList.add('active');
      }
    });
  });
});
`;
  }

  // Minimal navigation - just smooth scrolling
  return `
// Smooth scroll for any anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
`;
}

/**
 * Generate font loading HTML for all themes.
 * Uses the font registry to support both Google Fonts and Fontshare CDN.
 */
function generateFontLinks(): string {
  const allFamilies: string[] = [];
  for (const theme of Object.values(themes)) {
    allFamilies.push(...getThemeFontFamilies(theme.typography));
  }
  return generateFontHTML(allFamilies);
}

/**
 * Generate JavaScript for presentation layout
 */
function generatePresentationJS(): string {
  return `
// Presentation slide indicator
const slides = document.querySelectorAll('.presentation-slide');
const dots = document.querySelectorAll('.slide-dot');

if (slides.length && dots.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = Array.from(slides).indexOf(entry.target);
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === index);
        });
      }
    });
  }, { threshold: 0.5 });

  slides.forEach(slide => observer.observe(slide));

  // Click to navigate
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      slides[i].scrollIntoView({ behavior: 'smooth' });
    });
  });
}
`;
}

/**
 * Generate the complete HTML document
 */
export function buildHTML(options: HTMLBuilderOptions): string {
  const {
    title,
    subtitle,
    theme,
    navigationStyle,
    layout,
    sections,
    enableThemeSwitcher = true,
    footer,
    hero,
    density = 'comfortable',
  } = options;

  const fontLinks = generateFontLinks();
  const themeCSS = generateThemeCSS();
  const baseCSS = generateBaseCSS();
  const themeSwitcherJS = enableThemeSwitcher ? generateThemeSwitcherJS() : '';
  
  // Determine effective layout
  const effectiveLayout = layout || (navigationStyle === 'sidebar' ? 'sidebar' : navigationStyle === 'tabs' ? 'sidebar' : 'minimal');
  
  // Generate appropriate navigation JS
  let navigationJS = '';
  if (effectiveLayout === 'sidebar') {
    navigationJS = generateNavigationJS('sidebar');
  } else if (effectiveLayout === 'presentation') {
    navigationJS = generatePresentationJS();
  } else {
    navigationJS = generateNavigationJS('minimal');
  }

  // Build content based on layout
  let bodyContent = '';

  switch (effectiveLayout) {
    case 'magazine':
      bodyContent = buildMagazineLayout(title, subtitle, sections, enableThemeSwitcher, theme, hero);
      break;
    case 'presentation':
      bodyContent = buildPresentationLayout(title, subtitle, sections, enableThemeSwitcher, theme);
      break;
    case 'dashboard':
      bodyContent = buildDashboardLayout(title, subtitle, sections, enableThemeSwitcher, theme);
      break;
    case 'sidebar':
      bodyContent = buildSidebarLayout(title, subtitle, sections, enableThemeSwitcher, theme);
      break;
    case 'editorial':
      bodyContent = buildEditorialLayout(title, subtitle, sections, enableThemeSwitcher, theme);
      break;
    case 'comparison':
      bodyContent = buildComparisonLayout(title, subtitle, sections, enableThemeSwitcher, theme);
      break;
    case 'briefing':
      bodyContent = buildBriefingLayout(title, subtitle, sections, enableThemeSwitcher, theme);
      break;
    case 'tutorial':
      bodyContent = buildTutorialLayout(title, subtitle, sections, enableThemeSwitcher, theme);
      break;
    case 'scorecard':
      bodyContent = buildScorecardLayout(title, subtitle, sections, enableThemeSwitcher, theme);
      break;
    case 'report':
      bodyContent = buildReportLayout(title, subtitle, sections, enableThemeSwitcher, theme);
      break;
    case 'dossier':
      bodyContent = buildDossierLayout(title, subtitle, sections, enableThemeSwitcher, theme, hero);
      break;
    case 'dialogue':
      bodyContent = buildDialogueLayout(title, subtitle, sections, enableThemeSwitcher, theme);
      break;
    case 'minimal':
    default:
      bodyContent = buildMinimalLayout(title, subtitle, sections, enableThemeSwitcher, theme);
      break;
  }

  // Footer (skip for presentation layout)
  const footerHTML = effectiveLayout === 'presentation' 
    ? '' 
    : (footer
        ? `<footer class="footer">${footer}</footer>`
        : `<footer class="footer">Generated by thought_bubble</footer>`);

  // Section entry choreography: observe sections/cards for first viewport reveal.
  // Presentation layout uses slide activation events instead (threshold 0.5 via
  // generatePresentationJS), so we skip the default observer for .presentation-slide.
  const sectionEntryJS = `
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var isPresentation = document.querySelector('.presentation-container');
  var selector = isPresentation
    ? '.presentation-slide'
    : '.section, .card, .magazine-section, .editorial-section, .dashboard-card, .comparison-column, .tutorial-step, .scorecard-category, .report-section, .dossier-deep-dive, .dialogue-position, .briefing-grid .card';
  var threshold = isPresentation ? 0.5 : 0.1;
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('tb-section-enter');
        io.unobserve(e.target);
      }
    });
  }, { threshold: threshold });
  document.querySelectorAll(selector).forEach(function(el) { io.observe(el); });
})();
`;

  return `<!DOCTYPE html>
<html lang="en" data-theme="${theme}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${subtitle || title}">
  <meta name="generator" content="thought_bubble MCP Server">
  <title>${title}</title>
${fontLinks}
  <style>
${themeCSS}
${baseCSS}
  </style>
</head>
<body data-density="${density}">
${bodyContent}
${footerHTML}
  <script>
${themeSwitcherJS}
${navigationJS}
${sectionEntryJS}
  </script>
</body>
</html>`;
}

/**
 * Build sidebar layout
 */
function buildSidebarLayout(
  title: string,
  subtitle: string | undefined,
  sections: Section[],
  enableThemeSwitcher: boolean,
  activeTheme?: string
): string {
  const themeSwitcherHTML = enableThemeSwitcher ? buildThemeSwitcher(activeTheme) : '';

  const navLinks = sections
    .map((s, i) => `<a href="#${s.id}"${i === 0 ? ' class="active"' : ''}>${s.title}</a>`)
    .join('\n            ');

  const sectionsHTML = sections
    .map(section => buildSection(section))
    .join('\n');

  return `
  ${themeSwitcherHTML}
  <div class="layout-sidebar">
    <aside class="sidebar">
      <h2>${title}</h2>
      <nav>
        ${navLinks}
      </nav>
    </aside>
    <main class="main-content">
      <header class="header">
        <h1>${title}</h1>
        ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}
      </header>
      ${sectionsHTML}
    </main>
  </div>`;
}

/**
 * Build tabs layout
 */
function buildTabsLayout(
  title: string,
  subtitle: string | undefined,
  sections: Section[],
  enableThemeSwitcher: boolean,
  activeTheme?: string
): string {
  const themeSwitcherHTML = enableThemeSwitcher ? buildThemeSwitcher(activeTheme) : '';

  const tabButtons = sections
    .map((s, i) => `<button class="tab-button${i === 0 ? ' active' : ''}" data-tab="${s.id}">${s.title}</button>`)
    .join('\n          ');

  const tabContents = sections
    .map((section, i) => `
        <div id="${section.id}" class="tab-content${i === 0 ? ' active' : ''}">
          ${buildSectionContent(section)}
        </div>`)
    .join('\n');

  return `
  ${themeSwitcherHTML}
  <div class="container">
    <header class="header">
      <h1>${title}</h1>
      ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}
    </header>
    <div class="tabs-container">
      <div class="tab-buttons">
        ${tabButtons}
      </div>
      ${tabContents}
    </div>
  </div>`;
}

/**
 * Build minimal layout
 */
function buildMinimalLayout(
  title: string,
  subtitle: string | undefined,
  sections: Section[],
  enableThemeSwitcher: boolean,
  activeTheme?: string
): string {
  const themeSwitcherHTML = enableThemeSwitcher ? buildThemeSwitcher(activeTheme) : '';

  const heroIdx = sections.findIndex(s => s.diagram);
  const isSingleSection = sections.length === 1;

  if (heroIdx >= 0) {
    const heroSection = sections[heroIdx];
    const remaining = sections.filter((_, i) => i !== heroIdx);
    const fillClass = isSingleSection ? ' fill-viewport' : '';
    const animAttr = heroSection.animation ? ` data-animation="${heroSection.animation}"` : '';

    const heroHTML = `
    <div class="minimal-hero${fillClass}">
      <h1>${title}</h1>
      ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}
      <div class="diagram-container"${animAttr}>
        ${heroSection.diagram!.svg}
      </div>
      ${heroSection.diagram!.caption ? `<p class="diagram-caption">${heroSection.diagram!.caption}</p>` : ''}
    </div>`;

    const supportingHTML = remaining.length > 0
      ? `<div class="minimal-supporting">${remaining.map(section => `
        <section class="section">
          <h2>${section.title}</h2>
          <div class="content">${section.content}</div>
          ${section.diagram ? `<div class="diagram-container"${section.animation ? ` data-animation="${section.animation}"` : ''}>${section.diagram.svg}</div>` : ''}
        </section>`).join('\n')}</div>`
      : '';

    return `
  ${themeSwitcherHTML}
  <div class="layout-minimal">
    ${heroHTML}
    ${supportingHTML}
  </div>`;
  }

  const sectionsHTML = sections
    .map(section => buildSection(section))
    .join('\n');

  return `
  ${themeSwitcherHTML}
  <div class="container layout-minimal">
    <header class="header">
      <h1>${title}</h1>
      ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}
    </header>
    ${sectionsHTML}
  </div>`;
}

/**
 * Build editorial layout - single-column, no cards, academic style
 */
function buildEditorialLayout(
  title: string,
  subtitle: string | undefined,
  sections: Section[],
  enableThemeSwitcher: boolean,
  activeTheme?: string
): string {
  const themeSwitcherHTML = enableThemeSwitcher ? buildThemeSwitcher(activeTheme) : '';

  const sectionsHTML = sections
    .map(section => {
      const role = section.role || 'default';
      const breakoutClass = role === 'full-width' ? ' breakout' : '';
      let diagramHTML = '';
      const animAttr = section.animation ? ` data-animation="${section.animation}"` : '';
      if (section.diagram) {
        diagramHTML = `
        <div class="diagram-container"${animAttr}>
          ${section.diagram.svg}
        </div>
        ${section.diagram.caption ? `<p class="diagram-caption">${section.diagram.caption}</p>` : ''}`;
      }

      return `
      <section class="editorial-section${breakoutClass}">
        <h2>${section.title}</h2>
        <div class="content">${section.content}</div>
        ${diagramHTML}
      </section>`;
    })
    .join('\n');

  return `
  ${themeSwitcherHTML}
  <div class="layout-editorial">
    <header class="editorial-header">
      <h1>${title}</h1>
      ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}
    </header>
    ${sectionsHTML}
  </div>`;
}

/**
 * Build magazine layout - narrative-focused with hero and alternating content
 */
function buildMagazineLayout(
  title: string,
  subtitle: string | undefined,
  sections: Section[],
  enableThemeSwitcher: boolean,
  activeTheme?: string,
  hero?: { title: string; subtitle?: string; metric?: { value: string; label: string } }
): string {
  const themeSwitcherHTML = enableThemeSwitcher ? buildThemeSwitcher(activeTheme) : '';

  // Build hero section
  const heroTitle = hero?.title || title;
  const heroSubtitle = hero?.subtitle || subtitle;
  const heroMetric = hero?.metric 
    ? `<div class="hero-metric">
        <div class="value">${hero.metric.value}</div>
        <div class="label">${hero.metric.label}</div>
      </div>` 
    : '';

  let consecutiveDiagramCount = 0;
  const sectionsHTML = sections.map((section, i) => {
    const role = section.role || 'default';
    const animAttr = section.animation ? ` data-animation="${section.animation}"` : '';

    if (role === 'pull-quote') {
      consecutiveDiagramCount = 0;
      return `
      <blockquote class="pull-quote">${section.content.replace(/<\/?p>/g, '')}</blockquote>`;
    }

    if (role === 'lead') {
      consecutiveDiagramCount = 0;
      return `
      <section class="magazine-lead">
        <h2>${section.title}</h2>
        <div class="content">${section.content}</div>
      </section>`;
    }

    const isFullWidth = role === 'full-width';
    const isReverse = i % 2 === 1;
    const gridClass = isReverse ? 'magazine-grid reverse' : 'magazine-grid';
    const rhythmClass = consecutiveDiagramCount >= 3 ? ' magazine-rhythm-break' : '';
    const sectionClass = isFullWidth
      ? `magazine-section full-width${rhythmClass}`
      : `magazine-section${rhythmClass}`;

    if (section.diagram) {
      consecutiveDiagramCount++;
      return `
      <section class="${sectionClass}">
        <div class="${gridClass}">
          <div class="magazine-text">
            <h2>${section.title}</h2>
            <div class="content">${section.content}</div>
          </div>
          <div class="magazine-visual">
            <div class="diagram-container"${animAttr}>
              ${section.diagram.svg}
            </div>
            ${section.diagram.caption ? `<p class="diagram-caption">${section.diagram.caption}</p>` : ''}
          </div>
        </div>
      </section>`;
    }

    consecutiveDiagramCount = 0;
    return `
      <section class="${sectionClass}">
        <h2>${section.title}</h2>
        <div class="content">${section.content}</div>
      </section>`;
  }).join('\n');

  return `
  ${themeSwitcherHTML}
  <div class="layout-magazine">
    <header class="magazine-hero">
      <h1>${heroTitle}</h1>
      ${heroSubtitle ? `<p class="subtitle">${heroSubtitle}</p>` : ''}
      ${heroMetric}
    </header>
    <main class="magazine-content">
      ${sectionsHTML}
    </main>
  </div>`;
}

/**
 * Build presentation layout - slide-based with snap scrolling
 */
function buildPresentationLayout(
  title: string,
  subtitle: string | undefined,
  sections: Section[],
  enableThemeSwitcher: boolean,
  activeTheme?: string
): string {
  const themeSwitcherHTML = enableThemeSwitcher ? buildThemeSwitcher(activeTheme) : '';

  // Title slide
  const titleSlide = `
    <section class="presentation-slide">
      <div class="presentation-content">
        <h1>${title}</h1>
        ${subtitle ? `<p>${subtitle}</p>` : ''}
      </div>
    </section>`;

  const slidesHTML = sections.map(section => {
    const role = section.role || 'default';
    const animAttr = section.animation ? ` data-animation="${section.animation}"` : '';

    if (role === 'statement') {
      return `
    <section class="presentation-slide slide-statement">
      <div class="presentation-content">
        <h2>${section.content.replace(/<\/?p>/g, '')}</h2>
      </div>
    </section>`;
    }

    if (role === 'metric') {
      return `
    <section class="presentation-slide slide-metric">
      <div class="presentation-content">
        <div class="metric-display">${section.title}</div>
        <div class="metric-label">${section.content.replace(/<\/?p>/g, '')}</div>
      </div>
    </section>`;
    }

    const slideClass = role === 'full-width' ? 'presentation-slide slide-full-width' : 'presentation-slide';
    const visual = section.diagram 
      ? `<div class="presentation-visual">
          <div class="diagram-container"${animAttr}>
            ${section.diagram.svg}
          </div>
          ${section.diagram.caption ? `<p class="diagram-caption">${section.diagram.caption}</p>` : ''}
        </div>` 
      : '';
    
    return `
    <section class="${slideClass}">
      <div class="presentation-content">
        <h2>${section.title}</h2>
        <div class="content">${section.content}</div>
        ${visual}
      </div>
    </section>`;
  }).join('\n');

  // Slide indicators
  const slideCount = sections.length + 1;
  const indicators = Array.from({ length: slideCount }, (_, i) => 
    `<div class="slide-dot${i === 0 ? ' active' : ''}" data-slide="${i}"></div>`
  ).join('\n        ');

  return `
  ${themeSwitcherHTML}
  <div class="layout-presentation">
    ${titleSlide}
    ${slidesHTML}
  </div>
  <div class="slide-indicator">
    ${indicators}
  </div>`;
}

/**
 * Build dashboard layout - metrics and grid-based charts
 */
function buildDashboardLayout(
  title: string,
  subtitle: string | undefined,
  sections: Section[],
  enableThemeSwitcher: boolean,
  activeTheme?: string
): string {
  const themeSwitcherHTML = enableThemeSwitcher ? buildThemeSwitcher(activeTheme) : '';

  const metricSections = sections.filter(s => s.role === 'metric');
  const chartSections = sections.filter(s => s.role !== 'metric');

  let metricCardsHTML = '';
  if (metricSections.length > 0) {
    const cards = metricSections.map(section => `
      <div class="metric-card">
        <div class="label">${section.title}</div>
        <div class="value">${section.content.replace(/<\/?p>/g, '')}</div>
      </div>`).join('\n');
    metricCardsHTML = `<div class="metric-cards">${cards}</div>`;
  }

  const chartCardsHTML = chartSections.map((section, i) => {
    let spanClass: string;
    let extra = '';
    if (i === 0) { spanClass = 'span-8'; extra = ' primary'; }
    else if (i === 1) { spanClass = 'span-4'; }
    else { spanClass = 'span-6'; }
    const animAttr = section.animation ? ` data-animation="${section.animation}"` : '';
    
    return `
      <div class="dashboard-card ${spanClass}${extra}">
        <h3>${section.title}</h3>
        <div class="content">${section.content}</div>
        ${section.diagram ? `
          <div class="diagram-container"${animAttr}>
            ${section.diagram.svg}
          </div>
          ${section.diagram.caption ? `<p class="diagram-caption">${section.diagram.caption}</p>` : ''}
        ` : ''}
      </div>`;
  }).join('\n');

  return `
  ${themeSwitcherHTML}
  <div class="layout-dashboard">
    <header class="dashboard-header">
      <div>
        <h1>${title}</h1>
        ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}
      </div>
    </header>
    <main class="dashboard-content">
      ${metricCardsHTML}
      <div class="dashboard-grid">
        ${chartCardsHTML}
      </div>
    </main>
  </div>`;
}

/**
 * Build comparison layout -- parallel columns for A/B evaluation
 */
function buildComparisonLayout(
  title: string,
  subtitle: string | undefined,
  sections: Section[],
  enableThemeSwitcher: boolean,
  activeTheme?: string
): string {
  const themeSwitcherHTML = enableThemeSwitcher ? buildThemeSwitcher(activeTheme) : '';

  const sharedSections = sections.filter(s => s.role === 'supporting' || s.role === 'full-width');
  const contenders = sections.filter(s => s.role !== 'supporting' && s.role !== 'full-width');

  const columnsHTML = contenders.map(section => {
    const animAttr = section.animation ? ` data-animation="${section.animation}"` : '';
    return `
      <div class="comparison-column">
        <h2>${section.title}</h2>
        <div class="content">${section.content}</div>
        ${section.diagram ? `
          <div class="diagram-container"${animAttr}>${section.diagram.svg}</div>
          ${section.diagram.caption ? `<p class="diagram-caption">${section.diagram.caption}</p>` : ''}
        ` : ''}
      </div>`;
  }).join('\n');

  const sharedHTML = sharedSections.map(section => {
    const animAttr = section.animation ? ` data-animation="${section.animation}"` : '';
    return `
      <div class="comparison-shared">
        <h2>${section.title}</h2>
        <div class="content">${section.content}</div>
        ${section.diagram ? `
          <div class="diagram-container"${animAttr}>${section.diagram.svg}</div>
          ${section.diagram.caption ? `<p class="diagram-caption">${section.diagram.caption}</p>` : ''}
        ` : ''}
      </div>`;
  }).join('\n');

  return `
  ${themeSwitcherHTML}
  <div class="layout-comparison">
    <header class="comparison-header">
      <h1>${title}</h1>
      ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}
    </header>
    <div class="comparison-columns">
      ${columnsHTML}
    </div>
    ${sharedHTML}
  </div>`;
}

/**
 * Build briefing layout -- digest format for status updates and reviews
 */
function buildBriefingLayout(
  title: string,
  subtitle: string | undefined,
  sections: Section[],
  enableThemeSwitcher: boolean,
  activeTheme?: string
): string {
  const themeSwitcherHTML = enableThemeSwitcher ? buildThemeSwitcher(activeTheme) : '';

  const metricSections = sections.filter(s => s.role === 'metric');
  const leadSection = sections.find(s => s.role === 'lead') || sections[0];
  const actionSection = sections.find(s => s.role === 'supporting');
  const gridSections = sections.filter(s =>
    s !== leadSection && s !== actionSection && s.role !== 'metric'
  );

  const leadHTML = leadSection ? (() => {
    const animAttr = leadSection.animation ? ` data-animation="${leadSection.animation}"` : '';
    return `
    <div class="briefing-lead">
      <div class="card">
        <h2>${leadSection.title}</h2>
        <div class="content">${leadSection.content}</div>
        ${leadSection.diagram ? `
          <div class="diagram-container"${animAttr}>${leadSection.diagram.svg}</div>
          ${leadSection.diagram.caption ? `<p class="diagram-caption">${leadSection.diagram.caption}</p>` : ''}
        ` : ''}
      </div>
    </div>`;
  })() : '';

  const gridHTML = gridSections.length > 0 ? `
    <div class="briefing-grid">
      ${gridSections.map(section => {
        const animAttr = section.animation ? ` data-animation="${section.animation}"` : '';
        return `
        <div class="card">
          <h3>${section.title}</h3>
          <div class="content">${section.content}</div>
          ${section.diagram ? `
            <div class="diagram-container"${animAttr}>${section.diagram.svg}</div>
            ${section.diagram.caption ? `<p class="diagram-caption">${section.diagram.caption}</p>` : ''}
          ` : ''}
        </div>`;
      }).join('\n')}
    </div>` : '';

  const statsHTML = metricSections.length > 0 ? `
    <div class="stats-strip">
      ${metricSections.map(s => `
        <div class="metric-card">
          <div class="label">${s.title}</div>
          <div class="value">${s.content.replace(/<\/?p>/g, '')}</div>
        </div>`).join('\n')}
    </div>` : '';

  const actionsHTML = actionSection ? `
    <div class="briefing-actions">
      <h2>${actionSection.title}</h2>
      <div class="content">${actionSection.content}</div>
    </div>` : '';

  return `
  ${themeSwitcherHTML}
  <div class="layout-briefing">
    <header class="briefing-header">
      <h1>${title}</h1>
      ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}
    </header>
    ${leadHTML}
    ${gridHTML}
    ${statsHTML}
    ${actionsHTML}
  </div>`;
}

/**
 * Build tutorial layout -- numbered steps with progress spine
 */
function buildTutorialLayout(
  title: string,
  subtitle: string | undefined,
  sections: Section[],
  enableThemeSwitcher: boolean,
  activeTheme?: string
): string {
  const themeSwitcherHTML = enableThemeSwitcher ? buildThemeSwitcher(activeTheme) : '';

  const stepsHTML = sections.map((section, i) => {
    const role = section.role || 'default';
    const animAttr = section.animation ? ` data-animation="${section.animation}"` : '';

    const takeaway = role === 'statement'
      ? `<div class="tutorial-takeaway">${section.content.replace(/<\/?p>/g, '')}</div>`
      : '';

    return `
      <div class="tutorial-step">
        <div class="tutorial-step-number">${i + 1}</div>
        <h2>${section.title}</h2>
        ${role !== 'statement' ? `<div class="content">${section.content}</div>` : ''}
        ${section.diagram ? `
          <div class="diagram-container"${animAttr}>${section.diagram.svg}</div>
          ${section.diagram.caption ? `<p class="diagram-caption">${section.diagram.caption}</p>` : ''}
        ` : ''}
        ${takeaway}
      </div>`;
  }).join('\n');

  return `
  ${themeSwitcherHTML}
  <div class="layout-tutorial">
    <header class="tutorial-header">
      <h1>${title}</h1>
      ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}
      <div class="tutorial-progress">
        <div class="tutorial-progress-fill" style="width: 0%"></div>
      </div>
    </header>
    <div class="tutorial-steps">
      ${stepsHTML}
    </div>
  </div>`;
}

/**
 * Build scorecard layout -- evaluative with overall score and category cards
 */
function buildScorecardLayout(
  title: string,
  subtitle: string | undefined,
  sections: Section[],
  enableThemeSwitcher: boolean,
  activeTheme?: string
): string {
  const themeSwitcherHTML = enableThemeSwitcher ? buildThemeSwitcher(activeTheme) : '';

  const overallSection = sections.find(s => s.role === 'metric');
  const categorySections = sections.filter(s => !s.role || s.role === 'default');
  const breakdownSection = sections.find(s => s.role === 'full-width');
  const findingsSection = sections.find(s => s.role === 'supporting');

  const overallHTML = overallSection ? `
    <div class="scorecard-overall">
      <div class="scorecard-grade">${overallSection.title}</div>
      <div class="scorecard-grade-label">${overallSection.content.replace(/<\/?p>/g, '')}</div>
      ${overallSection.diagram ? `
        <div class="diagram-container"${overallSection.animation ? ` data-animation="${overallSection.animation}"` : ''}>${overallSection.diagram.svg}</div>
      ` : ''}
    </div>` : '';

  const categoriesHTML = categorySections.length > 0 ? `
    <div class="scorecard-categories">
      ${categorySections.map(section => {
        const animAttr = section.animation ? ` data-animation="${section.animation}"` : '';
        return `
        <div class="scorecard-category">
          <h3>${section.title}</h3>
          <div class="content">${section.content}</div>
          ${section.diagram ? `
            <div class="diagram-container"${animAttr}>${section.diagram.svg}</div>
            ${section.diagram.caption ? `<p class="diagram-caption">${section.diagram.caption}</p>` : ''}
          ` : ''}
        </div>`;
      }).join('\n')}
    </div>` : '';

  const breakdownHTML = breakdownSection ? `
    <div class="scorecard-breakdown">
      <h2>${breakdownSection.title}</h2>
      <div class="diagram-container"${breakdownSection.animation ? ` data-animation="${breakdownSection.animation}"` : ''}>
        ${breakdownSection.diagram?.svg || ''}
      </div>
    </div>` : '';

  const findingsHTML = findingsSection ? `
    <div class="scorecard-findings">
      <h2>${findingsSection.title}</h2>
      <div class="content">${findingsSection.content}</div>
    </div>` : '';

  return `
  ${themeSwitcherHTML}
  <div class="layout-scorecard">
    <header class="scorecard-header">
      <h1>${title}</h1>
      ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}
    </header>
    ${overallHTML}
    ${categoriesHTML}
    ${breakdownHTML}
    ${findingsHTML}
  </div>`;
}

/**
 * Build report layout -- formal with cover, TOC, numbered sections, print styles
 */
function buildReportLayout(
  title: string,
  subtitle: string | undefined,
  sections: Section[],
  enableThemeSwitcher: boolean,
  activeTheme?: string
): string {
  const themeSwitcherHTML = enableThemeSwitcher ? buildThemeSwitcher(activeTheme) : '';

  const mainSections = sections.filter(s => s.role !== 'supporting');
  const appendices = sections.filter(s => s.role === 'supporting');

  const tocItems = [...mainSections, ...appendices].map((s, i) => {
    const num = i + 1;
    return `<li><a href="#${s.id}">${s.title}</a></li>`;
  }).join('\n');

  const allSections = [...mainSections, ...appendices];
  const sectionsHTML = allSections.map((section, i) => {
    const num = i + 1;
    const role = section.role || 'default';
    const supportingClass = role === 'supporting' ? ' supporting' : '';
    const animAttr = section.animation ? ` data-animation="${section.animation}"` : '';

    return `
      <section id="${section.id}" class="report-section${supportingClass}">
        <h2><span class="section-number">${num}.</span>${section.title}</h2>
        <div class="content">${section.content}</div>
        ${section.diagram ? `
          <div class="diagram-container"${animAttr}>${section.diagram.svg}</div>
          ${section.diagram.caption ? `<p class="diagram-caption">${section.diagram.caption}</p>` : ''}
        ` : ''}
      </section>`;
  }).join('\n');

  return `
  ${themeSwitcherHTML}
  <div class="layout-report">
    <div class="report-cover">
      <h1>${title}</h1>
      ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}
      <p class="report-meta">Generated by thought_bubble</p>
    </div>
    <nav class="report-toc">
      <h2>Contents</h2>
      <ol>${tocItems}</ol>
    </nav>
    ${sectionsHTML}
  </div>`;
}

/**
 * Build dossier layout -- intelligence product with profile, facts, narrative, deep-dives
 */
function buildDossierLayout(
  title: string,
  subtitle: string | undefined,
  sections: Section[],
  enableThemeSwitcher: boolean,
  activeTheme?: string,
  hero?: { title: string; subtitle?: string; metric?: { value: string; label: string } }
): string {
  const themeSwitcherHTML = enableThemeSwitcher ? buildThemeSwitcher(activeTheme) : '';

  const metricSections = sections.filter(s => s.role === 'metric');
  const leadSection = sections.find(s => s.role === 'lead');
  const statementSection = sections.find(s => s.role === 'statement');
  const deepDiveSections = sections.filter(s =>
    s.role !== 'metric' && s.role !== 'lead' && s.role !== 'statement'
  );

  const heroMetric = hero?.metric;
  const profileMetricHTML = heroMetric
    ? `<div class="dossier-headline-metric">
        <div class="value">${heroMetric.value}</div>
        <div class="label">${heroMetric.label}</div>
      </div>`
    : '';

  const factsHTML = metricSections.length > 0 ? `
    <div class="dossier-facts">
      ${metricSections.map(s => `
        <div class="dossier-fact">
          <div class="label">${s.title}</div>
          <div class="value">${s.content.replace(/<\/?p>/g, '')}</div>
        </div>`).join('\n')}
    </div>` : '';

  const narrativeHTML = leadSection ? `
    <div class="dossier-narrative">
      <h2>${leadSection.title}</h2>
      <div class="content">${leadSection.content}</div>
      ${leadSection.diagram ? `
        <div class="diagram-container"${leadSection.animation ? ` data-animation="${leadSection.animation}"` : ''}>${leadSection.diagram.svg}</div>
      ` : ''}
    </div>` : '';

  const deepDivesHTML = deepDiveSections.length > 0 ? `
    <div class="dossier-deep-dives">
      ${deepDiveSections.map(section => {
        const animAttr = section.animation ? ` data-animation="${section.animation}"` : '';
        return `
        <div class="dossier-deep-dive">
          <h3>${section.title}</h3>
          <div class="content">${section.content}</div>
          ${section.diagram ? `
            <div class="diagram-container"${animAttr}>${section.diagram.svg}</div>
            ${section.diagram.caption ? `<p class="diagram-caption">${section.diagram.caption}</p>` : ''}
          ` : ''}
        </div>`;
      }).join('\n')}
    </div>` : '';

  const statementHTML = statementSection
    ? `<div class="dossier-statement">${statementSection.content.replace(/<\/?p>/g, '')}</div>`
    : '';

  return `
  ${themeSwitcherHTML}
  <div class="layout-dossier">
    <header class="dossier-profile">
      <h1>${title}</h1>
      ${subtitle ? `<p class="dossier-identifiers">${subtitle}</p>` : ''}
      ${profileMetricHTML}
    </header>
    ${factsHTML}
    ${narrativeHTML}
    ${deepDivesHTML}
    ${statementHTML}
  </div>`;
}

/**
 * Build dialogue layout -- argumentative with parallel positions and trade-offs
 */
function buildDialogueLayout(
  title: string,
  subtitle: string | undefined,
  sections: Section[],
  enableThemeSwitcher: boolean,
  activeTheme?: string
): string {
  const themeSwitcherHTML = enableThemeSwitcher ? buildThemeSwitcher(activeTheme) : '';

  const positionSections = sections.filter(s => !s.role || s.role === 'default');
  const tradeoffSection = sections.find(s => s.role === 'full-width');
  const conclusionSection = sections.find(s => s.role === 'supporting' || s.role === 'statement');

  const positionsHTML = positionSections.map(section => {
    const animAttr = section.animation ? ` data-animation="${section.animation}"` : '';
    return `
      <div class="dialogue-position">
        <h2>${section.title}</h2>
        <div class="content">${section.content}</div>
        ${section.diagram ? `
          <div class="diagram-container"${animAttr}>${section.diagram.svg}</div>
          ${section.diagram.caption ? `<p class="diagram-caption">${section.diagram.caption}</p>` : ''}
        ` : ''}
      </div>`;
  }).join('\n');

  const tradeoffsHTML = tradeoffSection ? `
    <div class="dialogue-tradeoffs">
      <h2>${tradeoffSection.title}</h2>
      <div class="content">${tradeoffSection.content}</div>
      ${tradeoffSection.diagram ? `
        <div class="diagram-container"${tradeoffSection.animation ? ` data-animation="${tradeoffSection.animation}"` : ''}>${tradeoffSection.diagram.svg}</div>
      ` : ''}
    </div>` : '';

  const conclusionHTML = conclusionSection ? `
    <div class="dialogue-conclusion">
      <h2>${conclusionSection.title}</h2>
      <div class="content">${conclusionSection.content}</div>
      ${conclusionSection.diagram ? `
        <div class="diagram-container"${conclusionSection.animation ? ` data-animation="${conclusionSection.animation}"` : ''}>${conclusionSection.diagram.svg}</div>
      ` : ''}
    </div>` : '';

  return `
  ${themeSwitcherHTML}
  <div class="layout-dialogue">
    <div class="dialogue-question">
      <h1>${title}</h1>
      ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}
    </div>
    <div class="dialogue-positions">
      ${positionsHTML}
    </div>
    ${tradeoffsHTML}
    ${conclusionHTML}
  </div>`;
}

/**
 * Build theme switcher HTML
 */
function buildThemeSwitcher(activeTheme?: string): string {
  const newThemes = Object.entries(themes)
    .filter(([_, t]) => t.category === 'new')
    .map(([id, t]) => `<option value="${id}"${id === activeTheme ? ' selected' : ''}>${t.name}</option>`)
    .join('\n            ');

  const originalThemes = Object.entries(themes)
    .filter(([_, t]) => t.category === 'original')
    .map(([id, t]) => `<option value="${id}"${id === activeTheme ? ' selected' : ''}>${t.name}</option>`)
    .join('\n            ');

  return `
  <div class="theme-switcher">
    <select id="theme-select" onchange="setTheme(this.value)">
      <optgroup label="New Themes">
        ${newThemes}
      </optgroup>
      <optgroup label="Original Themes">
        ${originalThemes}
      </optgroup>
    </select>
  </div>`;
}

/**
 * Build a section
 */
function buildSection(section: Section): string {
  return `
      <section id="${section.id}" class="section">
        <div class="card">
          <h2>${section.title}</h2>
          ${buildSectionContent(section)}
        </div>
      </section>`;
}

/**
 * Build section content
 */
function buildSectionContent(section: Section): string {
  let content = `<div class="content">${section.content}</div>`;
  const animAttr = section.animation ? ` data-animation="${section.animation}"` : '';

  if (section.diagram) {
    content += `
          <div class="diagram-container"${animAttr}>
            ${section.diagram.svg}
          </div>`;
    if (section.diagram.caption) {
      content += `
          <p class="diagram-caption">${section.diagram.caption}</p>`;
    }
  }

  return content;
}

export default { buildHTML };
