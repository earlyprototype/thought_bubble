# thought_bubble Theme Guide

This guide covers all 12 available themes in thought_bubble, including colour palettes, usage recommendations, and customisation options.

## Theme Overview

thought_bubble includes **12 curated themes**: 7 new visually stunning themes from popular code editors and design systems, plus 5 original themes for comparison and backwards compatibility.

### Quick Reference

| Theme | Mode | Category | Best For |
|-------|------|----------|----------|
| Tokyo Night | Dark | New | Technical documentation, code-heavy content |
| Dracula | Dark | New | Creative projects, developer portfolios |
| Gruvbox | Dark | New | Retro aesthetics, warm comfortable reading |
| Solarized Dark | Dark | New | Academic papers, long-form documentation |
| Solarized Light | Light | New | Academic papers, print-friendly content |
| GitHub Light | Light | New | Clean documentation, familiar corporate style |
| GitHub Dark | Dark | New | Modern dark mode, GitHub-style docs |
| Professional | Light | Original | Corporate documentation, business reports |
| Dark | Dark | Original | Generic dark mode |
| Technical | Dark | Original | Technical specifications, API docs |
| Minimal | Light | Original | Clean, distraction-free reading |
| Creative | Light | Original | Marketing materials, creative briefs |

---

## New Themes (7)

### Tokyo Night

A popular VSCode theme with elegant purple and blue tones. Perfect for technical documentation.

**Colours:**
- Background: `#1a1b26`
- Foreground: `#a9b1d6`
- Accent: `#7aa2f7`
- Success: `#9ece6a`
- Warning: `#e0af68`
- Error: `#f7768e`

**Use when:** Creating developer-focused documentation, API references, or technical guides.

---

### Dracula

A dark theme with vibrant purple, pink, and cyan accents. Eye-catching and distinctive.

**Colours:**
- Background: `#282a36`
- Foreground: `#f8f8f2`
- Accent: `#bd93f9`
- Success: `#50fa7b`
- Warning: `#ffb86c`
- Error: `#ff5555`

**Use when:** Building creative portfolios, developer blogs, or projects that need personality.

---

### Gruvbox

A retro colour scheme with warm, earthy tones. Comfortable for extended reading.

**Colours:**
- Background: `#282828`
- Foreground: `#ebdbb2`
- Accent: `#fe8019`
- Success: `#b8bb26`
- Warning: `#fabd2f`
- Error: `#fb4934`

**Use when:** Creating documentation that will be read for extended periods, or when you want a warm, inviting feel.

---

### Solarized Dark

Ethan Schoonover's precision colour scheme. Excellent colour contrast and accessibility.

**Colours:**
- Background: `#002b36`
- Foreground: `#839496`
- Accent: `#268bd2`
- Success: `#859900`
- Warning: `#b58900`
- Error: `#dc322f`

**Use when:** Academic papers, research documentation, or anywhere accessibility is paramount.

---

### Solarized Light

The light variant of Solarized. Clean and professional with excellent readability.

**Colours:**
- Background: `#fdf6e3`
- Foreground: `#657b83`
- Accent: `#268bd2`
- Success: `#859900`
- Warning: `#b58900`
- Error: `#dc322f`

**Use when:** Print-friendly documentation, academic content, or users who prefer light themes.

---

### GitHub Light

GitHub's familiar light theme. Clean, professional, and universally recognisable.

**Colours:**
- Background: `#ffffff`
- Foreground: `#24292f`
- Accent: `#0969da`
- Success: `#1a7f37`
- Warning: `#9a6700`
- Error: `#cf222e`

**Use when:** Open source documentation, README files, or corporate documentation.

---

### GitHub Dark

GitHub's dark theme. Modern and comfortable for extended use.

**Colours:**
- Background: `#0d1117`
- Foreground: `#c9d1d9`
- Accent: `#58a6ff`
- Success: `#3fb950`
- Warning: `#d29922`
- Error: `#f85149`

**Use when:** Modern documentation, developer tools, or users who prefer dark interfaces.

---

## Original Themes (5)

These themes are preserved from the original thought_bubble for backwards compatibility and comparison.

### Professional

Corporate blue/slate theme. The original default.

**Colours:**
- Background: `#ffffff`
- Foreground: `#333333`
- Accent: `#3498db`

**Use when:** Corporate documentation, business reports, formal presentations.

---

### Dark

Generic dark mode theme.

**Colours:**
- Background: `#1a1a1a`
- Foreground: `#e5e5e5`
- Accent: `#60a5fa`

**Use when:** Dark mode preference without specific aesthetic requirements.

---

### Technical

Cyan/green on dark background. Terminal-inspired.

**Colours:**
- Background: `#0f172a`
- Foreground: `#f1f5f9`
- Accent: `#00d9ff`

**Use when:** Technical specifications, CLI documentation, developer tools.

---

### Minimal

Pure black and white minimalist design.

**Colours:**
- Background: `#ffffff`
- Foreground: `#1a202c`
- Accent: `#3182ce`

**Use when:** Distraction-free reading, content-first documentation.

---

### Creative

Purple gradient theme for creative projects.

**Colours:**
- Background: `#ffffff`
- Foreground: `#2d3748`
- Accent: `#667eea`

**Use when:** Marketing materials, creative briefs, design documentation.

---

## Theme Switching

All generated HTML files include a theme switcher dropdown (unless disabled). Users can:

1. **Switch themes instantly** - No page reload required
2. **Persist preferences** - Theme choice saved to localStorage
3. **Override defaults** - Users can use any theme regardless of generation setting

### Disabling Theme Switcher

If you want a fixed theme without user switching:

```typescript
generateVisualization({
  // ... other options
  enableThemeSwitcher: false
});
```

---

## Customisation

### Using Themes Programmatically

```typescript
import { getTheme, themes } from './themes/index.js';

// Get a specific theme
const tokyoNight = getTheme('tokyo_night');

// Access theme properties
console.log(tokyoNight.core.bg);      // '#1a1b26'
console.log(tokyoNight.core.accent);  // '#7aa2f7'
console.log(tokyoNight.scales.primary); // ['#7aa2f7', '#bb9af7', ...]

// List all themes
Object.keys(themes); // ['tokyo_night', 'dracula', ...]
```

### Theme Token Structure

Each theme follows this structure:

```typescript
interface ThemeTokens {
  id: string;           // 'tokyo_night'
  name: string;         // 'Tokyo Night'
  category: 'new' | 'original';
  mode: 'dark' | 'light';
  
  core: {
    bg: string;         // Background
    fg: string;         // Foreground/text
    accent: string;     // Primary accent
    muted: string;      // Secondary/muted
  };
  
  scales: {
    primary: string[];  // 5-colour categorical
    sequential: string[]; // 9-colour gradient
    diverging: string[]; // 11-colour diverging
  };
  
  semantic: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  
  ui: {
    surface: string;    // Card backgrounds
    border: string;     // Borders
    shadow: string;     // Box shadows
    textSecondary: string;
  };
  
  typography: {
    display: { family: string; fallback: string; weights: string; };
    body: { family: string; fallback: string; weights: string; };
    mono: { family: string; fallback: string; weights: string; };
    googleFontsUrl: string | null;
  };
}
```

---

## Typography System

Each theme includes carefully selected font pairings with three roles:

| Role | Purpose | Example (Tokyo Night) |
|------|---------|----------------------|
| **Display** | Headlines, hero text | Satoshi |
| **Body** | Narrative text | Inter |
| **Mono** | Code, data | JetBrains Mono |

### Theme Font Pairings

| Theme | Display | Body | Mono |
|-------|---------|------|------|
| Tokyo Night | Satoshi | Inter | JetBrains Mono |
| Dracula | Space Grotesk | IBM Plex Sans | IBM Plex Mono |
| Gruvbox | Fraunces | Source Sans 3 | Source Code Pro |
| Solarized | Newsreader | Literata | Fira Code |
| GitHub | Inter | Inter | JetBrains Mono |
| Professional | Plus Jakarta Sans | Source Serif 4 | JetBrains Mono |
| Dark | Outfit | Inter | Fira Code |
| Technical | Azeret Mono | Inter | Azeret Mono |
| Minimal | Cormorant | Lora | Courier Prime |
| Creative | DM Sans | DM Sans | Victor Mono |

Fonts are automatically loaded from Google Fonts. All fonts include system fallbacks for offline use.

---

## Layout Templates

thought_bubble now supports 5 layout templates to match different content types:

| Layout | Best For | Features |
|--------|----------|----------|
| **Sidebar** | Reference docs, long-form analysis | Fixed left navigation, content scrolling |
| **Magazine** | Reports, case studies, narratives | Full-width hero, alternating content/visual grid |
| **Presentation** | Investor decks, pitches, reviews | 100vh slides, snap scrolling, pagination dots |
| **Dashboard** | Metrics, KPIs, monitoring | Metric cards grid, flexible chart sizing |
| **Minimal** | Single-focus, deep dives | No navigation, visual-first |

### Using Layouts

```typescript
import { buildHTML } from './builders/html_builder.js';

buildHTML({
  title: 'Q4 Investor Update',
  layout: 'magazine',  // or 'sidebar', 'presentation', 'dashboard', 'minimal'
  theme: 'tokyo_night',
  sections: [...],
  hero: {
    title: 'Record Growth Quarter',
    subtitle: 'Revenue up 47% YoY',
    metric: { value: '$12.4M', label: 'ARR' }
  }
});
```

---

## Accessibility

All themes meet WCAG AA contrast requirements (4.5:1 minimum for normal text). The theme system:

- Validates contrast ratios during development
- Uses semantic colour naming
- Supports `prefers-reduced-motion` media query
- Maintains keyboard navigation regardless of theme

---

## Comparison: New vs Original

| Aspect | New Themes | Original Themes |
|--------|------------|-----------------|
| Source | Popular editor themes | Custom designed |
| Colour Depth | Rich, curated palettes | Basic palettes |
| D3 Integration | Dedicated colour scales | Derived scales |
| Recognition | Familiar to developers | Unique to thought_bubble |
| Updates | Based on upstream themes | Static |

---

## Recommendations by Use Case

### Documentation Type

| Type | Recommended Theme |
|------|------------------|
| API Reference | Tokyo Night, GitHub Dark |
| User Guide | GitHub Light, Solarized Light |
| Internal Docs | Professional, Minimal |
| Open Source | GitHub Light, GitHub Dark |
| Creative Brief | Dracula, Creative |
| Academic Paper | Solarized Light, Solarized Dark |

### Audience

| Audience | Recommended Theme |
|----------|------------------|
| Developers | Tokyo Night, Dracula, GitHub Dark |
| Executives | Professional, Minimal |
| Designers | Dracula, Creative |
| General Public | GitHub Light, Solarized Light |
| Mixed (with switcher) | Tokyo Night (default) |

---

## Migration from v0.1.x

If upgrading from a previous version:

1. **Theme names unchanged** for original 5 themes
2. **Default theme changed** from `professional` to `tokyo_night`
3. **New themes available** without code changes
4. **Theme switcher** now included by default

To maintain previous behaviour:

```typescript
generateVisualization({
  theme: 'professional',
  enableThemeSwitcher: false,
  // ... other options
});
```
