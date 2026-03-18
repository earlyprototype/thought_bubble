# thought_bubble MCP Server -- Architecture Reference

**Version:** 0.2.0
**Last Updated:** March 2026
**Purpose:** Complete structural reference for any LLM or developer working on this codebase.

---

## v0.2.0 Major Changes (March 2026)

### Architectural Enhancements
- **13 layout templates** replacing the original 6 (sidebar, magazine, presentation, dashboard, minimal, editorial + 7 new: comparison, briefing, tutorial, scorecard, report, dossier, dialogue)
- **Section roles system** for semantic visual structure (metric, pull-quote, lead, statement, full-width, supporting)
- **Density presets** for context-appropriate spacing (compact, comfortable, spacious)
- **chartOptions fully exposed** to LLM with emphasis, curve, animation, colorStrategy, annotations, patterns

### Renderer Capabilities
- **3 new chart types**: sankey, radial, treemap
- **SVG filter library**: glow, premium glow, inner shadow for emphasis effects
- **Curve type mapping**: smooth, natural, sharp, step for line/area charts
- **Color strategy engine**: categorical, sequential, diverging, monochrome
- **Pattern encoding**: accessible fills for WCAG compliance
- **Annotation system**: data point labels with positioning

### Schema & Interface
- `role` field on Section interface and selectedSystems
- `density` top-level parameter
- `animation` field on Section interface
- Full chartOptions exposure in both Zod and JSON schemas
- 13 layout enum values with composition guidance
- Enriched theme descriptions with personality

---

## Overview

thought_bubble is an MCP (Model Context Protocol) server that transforms content into self-contained HTML visualisations with server-side rendered SVG charts and diagrams. It communicates with an LLM via the MCP protocol -- the LLM makes creative decisions, the server renders them.

**Runtime:** Node.js >= 18, TypeScript, ESM modules
**Key dependencies:** `@modelcontextprotocol/sdk`, `d3` (v7), `d3-sankey`, `beautiful-mermaid`, `jsdom`, `zod`
**Build:** `tsc` compiles to `dist/`. Entry point: `dist/index.js`

---

## Data Flow

```
LLM calls tool via MCP
        |
        v
index.ts (MCP server, tool registration, request routing)
        |
        +-- analyze_content --> templates.ts (returns ANALYSIS_PROMPT text to LLM)
        |
        +-- generate_visualization --> generate_visualization.ts
        |       |
        |       +-- Zod validates input
        |       +-- getTheme() resolves ThemeName --> ThemeTokens
        |       +-- FOR EACH selectedSystem:
        |       |       +-- Mermaid? --> mermaid_renderer.ts --> SVG string
        |       |       +-- D3?     --> data_transformer.ts --> d3_renderer.ts --> SVG string
        |       +-- Builds Section[] array
        |       +-- Calls buildHTML() in html_builder.ts
        |       +-- Writes HTML file to test_outputs/
        |       +-- Returns file path + stats
        |
        +-- generate_mermaid_prompt --> templates.ts (returns MERMAID_GENERATION_PROMPT to LLM)
        +-- list_themes --> returns theme metadata
        +-- get_design_guide --> reads markdown from DesignTeam/DesignGuide/
```

---

## File Structure

```
thought_bubble_mcp/
  src/
    index.ts                          # MCP server entry point
    types.ts                          # Shared type definitions
    tools/
      analyze_content.ts              # Analysis tool
      generate_visualization.ts       # Main rendering pipeline
    renderers/
      d3_renderer.ts                  # All D3 chart rendering
      mermaid_renderer.ts             # Mermaid diagram rendering
      data_transformer.ts             # Input data normalisation
    builders/
      html_builder.ts                 # HTML assembly and layout system
    themes/
      types.ts                        # ThemeTokens interface and CSS generation
      definitions.ts                  # 12 theme definitions
      index.ts                        # Theme system exports
      fonts.ts                        # Font loading infrastructure
      svg_processor.ts                # Post-render SVG colour replacement
    prompts/
      templates.ts                    # LLM prompt templates
  DesignTeam/
    DesignGuide/
      DesignGuide.md                  # Master design philosophy (dev audience)
      POV.md                          # Curated extract for LLM consumption
      Typography.md                   # Font pairings by theme
      Layouts.md                      # Layout templates and selection guidance
      D3StyleGuide.md                 # D3 chart styling reference
      ColorTheory.md                  # Colour strategy principles
      Spacing.md                      # 8px grid system
```

---

## Critical Files -- Detailed Reference

### `src/index.ts` -- MCP Server Entry Point

**Role:** Registers all 5 tools with the MCP SDK, defines their JSON Schema input specifications, and routes incoming tool calls to handler functions.

**CRITICAL DETAIL -- Dual Schema Problem:**
The `generate_visualization` tool has its input schema defined in TWO places that MUST stay in sync:
1. **JSON Schema** in `index.ts` (lines ~124-215) -- this is what the LLM reads when deciding how to call the tool. It defines the enum values, field descriptions, and structural constraints the LLM sees.
2. **Zod Schema** in `generate_visualization.ts` (lines ~48-97) -- this validates the actual input at runtime.

If you add a field or enum value to one and not the other, either the LLM won't know about it (missing from JSON Schema) or the input will fail validation (missing from Zod).

**Tools registered:**

| Tool | Handler | Purpose |
|------|---------|---------|
| `analyze_content` | `analyzeContent()` | Returns `ANALYSIS_PROMPT` template text to the LLM |
| `generate_visualization` | `generateVisualization()` | Main rendering pipeline -- produces HTML file |
| `generate_mermaid_prompt` | `generateMermaidPrompt()` | Returns Mermaid generation prompt to the LLM |
| `list_themes` | inline | Returns all theme metadata |
| `get_design_guide` | inline | Reads and returns design guide markdown files |

**Key section -- tool description (lines ~100-123):**
The `generate_visualization` tool description is the primary creative brief the LLM reads. It contains the Cool-kid Test, anti-patterns, layout selection guidance, and design requirements. This text is read by the LLM every time it considers calling the tool. It is the most important piece of copy in the entire codebase for influencing output quality.

**Legacy field -- navigationStyle (lines ~186-191):**
Still present in JSON Schema and Zod schema. Accepts `'sidebar' | 'tabs' | 'minimal'`. When `layout` is not provided, `buildHTML` derives the effective layout from this: `sidebar` and `tabs` both map to sidebar layout, `minimal` maps to minimal layout. New code should always use `layout` explicitly.

**Key section -- diagramType enum (lines ~151-155):**
```
'flowchart', 'sequence', 'class', 'er', 'state',
'bar', 'pie', 'donut', 'line', 'area', 'gantt', 'timeline', 'quadrant',
'sankey', 'radial', 'treemap'
```
This is the menu the LLM orders from. If a type is not here, the LLM cannot select it.

---

### `src/tools/generate_visualization.ts` -- Main Rendering Pipeline

**Role:** Validates input, orchestrates rendering, assembles sections, calls the HTML builder.

**Key interfaces:**

```typescript
// Zod schema -- runtime validation of LLM input (v0.2.0)
generateVisualizationSchema = z.object({
  content: z.string(),
  selectedSystems: z.array(z.object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    diagramType: z.enum([...]),       // Must match index.ts enum
    mermaidCode: z.string().optional(),
    chartData: z.array(z.any()).optional(),
    chartOptions: z.object({
      title: z.string().optional(),
      xLabel: z.string().optional(),
      yLabel: z.string().optional(),
      // v0.2.0 additions:
      emphasis: z.enum(['glow', 'shadow', 'lift', 'none']).optional(),
      curve: z.enum(['smooth', 'sharp', 'step', 'natural']).optional(),
      animation: z.enum(['stagger', 'draw', 'grow', 'fade', 'none']).optional(),
      colorStrategy: z.enum(['categorical', 'sequential', 'diverging', 'monochrome']).optional(),
      annotations: z.array(z.object({
        label: z.string(),
        x: z.union([z.string(), z.number()]),
        y: z.number(),
        dx: z.number().optional(),
        dy: z.number().optional(),
      })).optional(),
      patterns: z.boolean().optional(),
    }).optional(),
    role: z.enum(['default', 'metric', 'pull-quote', 'lead', 'statement', 'full-width', 'supporting']).optional(),
  })),
  theme: z.enum([...]),
  layout: z.enum([...]).optional(),      // 13 layouts in v0.2.0
  density: z.enum(['compact', 'comfortable', 'spacious']).optional().default('comfortable'),
  hero: z.object({...}).optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  enableThemeSwitcher: z.boolean().default(true),
});
```

**Rendering dispatch (lines ~130-194):**
```
if isMermaidDiagramType(system.diagramType):
    --> renderMermaidDiagram(system.mermaidCode, theme)
else if isD3ChartType(system.diagramType):
    --> transformChartData(system.chartData, system.diagramType)
    --> renderD3Chart(system.diagramType, transformedData, theme, system.chartOptions)
else:
    --> createPlaceholderSvg()
```

**Section construction (lines ~196-204):**
Each system becomes a `Section` object:
```typescript
{
  id: `section-${system.id}`,
  title: system.title,
  content: `<p>${system.description}</p>`,   // NOTE: description is wrapped in <p>
  diagram: {
    svg: svgContent,                          // Raw SVG/HTML string
    caption: system.chartOptions?.title,
  },
}
```
The `content` field is always a single `<p>` wrapping the description. The `diagram.svg` field contains the rendered SVG string. Both are injected raw into the HTML by the builder.

---

### `src/renderers/d3_renderer.ts` -- D3 Chart Rendering (~2040 lines)

**Role:** Server-side D3 chart rendering using jsdom. Produces static SVG strings.

**CRITICAL CONSTRAINT:** All rendering happens in a jsdom virtual DOM. D3 transitions and animations DO NOT execute. Any animation must be CSS `@keyframes` added by `html_builder.ts`, not D3 `.transition()` calls.

**Exported types:**

| Type | Fields | Used by |
|------|--------|---------|
| `D3ChartType` | Union of 11 chart type strings | Type guards, dispatch |
| `BarChartData` | `{label: string, value: number}` | Bar, radial charts |
| `PieChartData` | `{label: string, value: number}` | Pie, donut charts |
| `LineChartData` | `{x: any, y: number, series?: string}` | Line, area charts |
| `GanttChartData` | `{task, start, end, category?, progress?}` | Gantt charts |
| `TimelineData` | `{event, date, description?}` | Timeline charts |
| `QuadrantData` | `{label, x, y}` | Quadrant charts |
| `ChartAnnotation` | `{label, x, y, dx?, dy?}` | Annotations |
| `ChartOptions` | `{width?, height?, title?, xLabel?, yLabel?, showLegend?, showGrid?, emphasis?, curve?, animation?, colorStrategy?, annotations?, patterns?}` | All render functions |

**ChartOptions (v0.2.0 - fully exposed to LLM):**
- `emphasis` - Highlight technique (glow, shadow, lift, none)
- `curve` - Line/area interpolation (smooth, natural, sharp, step)
- `animation` - Entry animation (stagger, draw, grow, fade, none)
- `colorStrategy` - Color approach (categorical, sequential, diverging, monochrome)
- `annotations` - Array of data point labels with positioning
- `patterns` - Boolean flag for accessibility pattern fills

All creative levers are now exposed via both Zod and JSON schemas to the LLM.

**Key internal functions:**

- `createVirtualDOM()` -- creates jsdom instance, returns D3-wrapped body
- `createSvg(body, width, height, theme)` -- appends SVG element with viewBox, transparent background
- `createGradients(svg, theme, colors)` -- registers SVG `<defs>` with:
  - `bar-gradient-0..N` -- per-colour bar gradients (uses `shiftColor()` for opaque light/dark stops based on `theme.mode`)
  - `bar-gradient-max` -- accent emphasis gradient for highest-value bar
  - `area-gradient` -- accent fade for area charts
  - `drop-shadow` filter
- `shiftColor(hex, amount)` -- derives lighter/darker opaque hex values. Positive amount lightens, negative darkens.
- `getThemeFontFamily(theme, role)` -- returns `var(--font-{role})` CSS variable string. All chart text MUST use `.style('font-family', ...)` not `.attr('font-family', ...)` for CSS variable resolution.
- `roundedTopRect(x, y, width, height, radius)` -- generates SVG path for bars with only top corners rounded.

**Render functions:**

| Function | Lines | Input type | Notes |
|----------|-------|------------|-------|
| `renderBarChart` | ~445 | `BarChartData[]` | Rounded top bars, max-bar emphasis, drop shadow, value labels |
| `renderPieChart` | ~611 | `PieChartData[]` | Also handles donut via `options.donut`. Label strategy: legend/slices/both |
| `renderLineChart` | ~760 | `LineChartData[]` | Also handles area via `options.area`. Data points with hover class |
| `renderGanttChart` | ~940 | `GanttChartData[]` | Pill-shaped bars, category colours |
| `renderQuadrantChart` | ~1078 | `QuadrantData[]` | Four background quadrants, data points |
| `renderTimelineChart` | ~1249 | `TimelineData[]` | Central spine, alternating labels |
| `renderSankeyChart` | ~1499 | `SankeyInputData` | Requires `{nodes, links}` structure |
| `renderRadialBarChart` | ~1616 | `BarChartData[]` | Circular bar chart |
| `renderTreemapChart` | ~1723 | `TreemapInputData` | Hierarchical rectangles |

**Post-processing:**
Every render function calls `processSvgForDynamicTheming(svgString, theme)` before returning. This replaces hardcoded hex colours with CSS variable references for live theme switching.

---

### `src/renderers/mermaid_renderer.ts` -- Mermaid Diagram Rendering

**Role:** Wraps `beautiful-mermaid` library for server-side SVG rendering of Mermaid diagrams.

**Flow:**
1. `sanitiseMermaidCode(code)` -- checks for XSS vectors (script tags, event handlers, iframes)
2. `validateMermaidSyntax(code)` -- validates diagram type declaration exists
3. `renderMermaid(code, options)` -- calls beautiful-mermaid with theme colours mapped to its options format
4. `processSvgForDynamicTheming(svg, theme)` -- replaces hardcoded colours with CSS variables

**Supported types:** flowchart, sequence, class, er, state. C4 is NOT supported.

**Theme mapping:** `theme.core` colours map directly to beautiful-mermaid's `bg`, `fg`, `accent`, `muted` options. `theme.ui` provides `line`, `surface`, `border`.

---

### `src/renderers/data_transformer.ts` -- Input Data Normalisation

**Role:** Transforms flexible LLM-provided data structures into the strict interfaces expected by each chart renderer.

**Key function:** `transformChartData(rawData, chartType)`

For each chart type, it tries multiple field names to find the right data:
- Bar/pie/donut: looks for `label`/`name`/`category`/`key` and `value`/`achieved`/`count`/`amount`
- Line/area: looks for `x`/`date`/`time`/`period` and `y`/`value`/`amount`
- Timeline: looks for `event`/`title`/`name` and `date`/`time`/`timestamp`
- Gantt: looks for `task`/`name` and `start`/`end` pairs
- Quadrant: looks for `label` and `x`/`y` pairs
- Sankey/treemap: passed through as-is (expects pre-structured data)

This flexibility is intentional -- LLMs don't always use consistent field names.

---

### `src/builders/html_builder.ts` -- HTML Assembly (~1756 lines)

**Role:** Assembles complete self-contained HTML files from sections, theme, and layout choice.

**Key interfaces:**

```typescript
export type SectionRole =
  | 'default' | 'metric' | 'pull-quote' | 'lead'
  | 'statement' | 'full-width' | 'supporting';

interface Section {
  id: string;
  title: string;
  content: string;        // HTML string, injected raw
  diagram?: {
    svg: string;           // SVG/HTML string, injected raw via ${section.diagram.svg}
    caption?: string;
  };
  animation?: 'stagger' | 'draw' | 'grow' | 'fade' | 'none';
  role?: SectionRole;
}

type NavigationStyle = 'sidebar' | 'tabs' | 'minimal';  // Legacy, use layout instead
type LayoutTemplate = 
  | 'sidebar' | 'magazine' | 'presentation' | 'dashboard' | 'minimal' | 'editorial'
  | 'comparison' | 'briefing' | 'tutorial' | 'scorecard' | 'report' | 'dossier' | 'dialogue';
type Density = 'compact' | 'comfortable' | 'spacious';

interface HTMLBuilderOptions {
  title: string;
  subtitle?: string;
  theme: ThemeName;
  navigationStyle: NavigationStyle;  // Legacy, overridden by layout if present
  layout?: LayoutTemplate;
  density?: Density;
  sections: Section[];
  enableThemeSwitcher?: boolean;
  footer?: string;
  hero?: { title: string; subtitle?: string; metric?: { value: string; label: string } };
}
```

**Section roles (v0.2.0):**
- `metric` - Large KPI cards with value + label styling
- `pull-quote` - Display-font blockquote with accent border
- `lead` - Wider opening paragraph (900px vs 720px body width)
- `statement` - Large centred text for key messages
- `full-width` - Breakout visual spanning viewport width
- `supporting` - Appendix/secondary content with reduced prominence

`diagram` is optional in the `Section` interface. The builder handles missing diagrams. However, `generate_visualization.ts` always constructs a diagram object.

**Layout resolution (line ~1281):**
`effectiveLayout = layout || (navigationStyle === 'sidebar' ? 'sidebar' : navigationStyle === 'tabs' ? 'sidebar' : 'minimal')`
If the LLM provides both `layout` and `navigationStyle`, `layout` wins.

**HTML assembly order:**
1. `generateFontLinks()` -- collects ALL font families across ALL 12 themes, generates `<link>` tags for Google Fonts and Fontshare CDN
2. `generateThemeCSS()` -- generates CSS variable blocks for ALL themes as `[data-theme="xxx"] { ... }` selectors
3. `generateBaseCSS()` -- base styles: reset, typography scale (1.25 ratio), spacing system (8px grid), heading styles, cards, diagram containers, hover states, animation keyframes, section entry choreography, layout-specific CSS for all 6 layouts
4. Layout builder function -- routes to specific builder based on layout choice
5. JavaScript -- theme switcher (per-document localStorage persistence), IntersectionObserver for section entry animations, presentation navigation (if applicable)

**Layout builders (v0.2.0 - 13 layouts):**

| Function | Layout | Pattern | HTML Structure |
|----------|--------|---------|----------------|
| `buildSidebarLayout` | sidebar | Hierarchical | Fixed 280px sidebar nav + scrollable main |
| `buildMinimalLayout` | minimal | Single focus | Visual-first hero (first diagram 70vh), supporting prose below |
| `buildEditorialLayout` | editorial | Narrative | 720px centred column, small-caps headers, justified text |
| `buildMagazineLayout` | magazine | Narrative | 70vh hero + alternating grid, pull quotes, full-width breakouts |
| `buildPresentationLayout` | presentation | Sequential | 100vh snap-scroll slides with statement/metric/visual variations |
| `buildDashboardLayout` | dashboard | Hub-and-spoke | Metric card row + 12-column chart grid with span variations |
| `buildComparisonLayout` | comparison | Comparative | Parallel columns (2-3 contenders) + shared comparison section |
| `buildBriefingLayout` | briefing | Digest | Lead item (40vh) + medium grid + inline stats strip + actions |
| `buildTutorialLayout` | tutorial | Instructional | Numbered steps with progress spine, concept → demo → takeaway |
| `buildScorecardLayout` | scorecard | Evaluative | Overall score + semantic-color category cards + breakdown |
| `buildReportLayout` | report | Formal hierarchical | Cover page + auto-generated TOC + numbered sections + print styles |
| `buildDossierLayout` | dossier | Intelligence | Profile header + facts strip + narrative + deep dives |
| `buildDialogueLayout` | dialogue | Argumentative | Central question + parallel argument columns + trade-offs + conclusion |

**Section role rendering (v0.2.0):**
- `role: 'metric'` → Generates `.metric-card` elements with large value display
- `role: 'pull-quote'` → Generates `<blockquote class="pull-quote">` with display font
- `role: 'lead'` → First section wider (900px) with larger text
- `role: 'statement'` → Large centred text (display font, max-width 15ch)
- `role: 'full-width'` → Section breaks out to viewport width (1200px max)
- `role: 'supporting'` → Reduced prominence styling for appendices

Previously "dead CSS" (`.pull-quote`, `.metric-card`) is now actively used by the section roles system.

**Theme switching (JavaScript):**
- `initTheme()` -- reads from per-document localStorage key (`tb-theme:` + `document.title`), falls back to `data-theme` attribute on `<html>`
- `setTheme(name)` -- sets `data-theme` attribute on `<html>`, saves to per-document localStorage key
- This prevents theme choice in one file from leaking to other files

**Animation system:**
- `@keyframes growBar` -- bars grow from scaleY(0) to scaleY(1)
- `@keyframes fadeInUp` -- opacity 0 + translateY(20px) to visible
- `@keyframes drawLine` -- stroke-dashoffset animation
- `@keyframes fadeIn` -- simple opacity transition
- `@keyframes tb-enter` -- section entry choreography (opacity + translateY)
- All wrapped in `@media (prefers-reduced-motion: no-preference)`
- Staggered delays via `nth-child` selectors (bars, data points, pie slices)
- `IntersectionObserver` appends `tb-section-enter` class when sections enter viewport

---

### `src/themes/types.ts` -- Theme Token System

**Role:** Defines the `ThemeTokens` interface and CSS variable generation.

**ThemeTokens structure:**
```typescript
{
  id: string,              // e.g. 'dracula'
  name: string,            // e.g. 'Dracula'
  category: 'new' | 'original',
  mode: 'dark' | 'light',  // CRITICAL: used by d3_renderer gradient logic
  core: {
    bg: string,            // Main background
    fg: string,            // Main foreground/text
    accent: string,        // Primary accent
    muted: string,         // Secondary/muted
  },
  scales: {
    primary: [5 colours],   // Categorical -- distinct categories
    sequential: [9 colours], // Magnitude -- light to dark
    diverging: [11 colours], // Deviation -- two-pole scale
  },
  semantic: {
    success, warning, error, info
  },
  ui: {
    surface: string,       // Elevated surfaces (cards, panels)
    border: string,
    shadow: string,        // With alpha
    textSecondary: string,
  },
  typography: {
    display: { family, fallback, weights },
    body: { family, fallback, weights },
    mono: { family, fallback, weights },
    googleFontsUrl: string | null,
  },
}
```

**`themeToCSSVariables(theme)`** converts tokens to CSS custom properties:
- `--bg`, `--fg`, `--accent`, `--muted`
- `--emphasis` (= fg), `--highlight` (= accent at 15% alpha)
- `--success`, `--warning`, `--error`, `--info`
- `--surface`, `--border`, `--shadow`, `--text-secondary`
- `--scale-1` through `--scale-5` (from `scales.primary`)
- `--font-display`, `--font-body`, `--font-mono` (full font-family strings with fallbacks)

**NOTE:** `scales.sequential` (9 colours) and `scales.diverging` (11 colours) are defined on every theme but are NOT currently exposed as CSS variables. They are available in TypeScript via `theme.scales.sequential` but only `scales.primary` reaches CSS.

---

### `src/themes/definitions.ts` -- Theme Definitions

**Role:** Contains all 12 theme objects as `ThemeTokens` exports.

| Theme | Mode | Category | Display Font | Body Font | Personality |
|-------|------|----------|-------------|-----------|-------------|
| tokyo_night | dark | new | Satoshi | Inter | Modern tech, confident |
| dracula | dark | new | Space Grotesk | IBM Plex Sans | Dark, focused, slightly gothic |
| gruvbox | dark | new | Vollkorn | Source Sans 3 | Warm, retro-modern, earthy |
| solarized_dark | dark | new | Newsreader | Literata | Academic, precise, timeless |
| solarized_light | light | new | Newsreader | Literata | Academic, precise, timeless |
| github_light | light | new | Atkinson Hyperlegible Next | Atkinson Hyperlegible Next | Developer-focused, accessible |
| github_dark | dark | new | Atkinson Hyperlegible Next | Atkinson Hyperlegible Next | Developer-focused, accessible |
| professional | light | original | Plus Jakarta Sans | Source Serif 4 | Corporate, trustworthy |
| dark | dark | original | Outfit | Inter | Sleek, minimal, contemporary |
| technical | dark | original | Azeret Mono | Inter | Engineering, precise |
| minimal | light | original | Cormorant | Lora | Refined, quiet, sophisticated |
| creative | light | original | DM Sans | Inter | Bold, expressive, playful |

**NOTE:** Some font families in `definitions.ts` don't match `Typography.md` exactly. The Typography guide describes Dracula with "Space Grotesk" for display but `definitions.ts` uses "Satoshi" for display. Similarly, Creative should use "Clash Display" per the guide but uses "DM Sans". These are known divergences between aspiration (guide) and implementation (code).

---

### `src/themes/svg_processor.ts` -- SVG Post-Processor

**Role:** Replaces hardcoded hex colour values in SVG strings with CSS variable references, enabling live theme switching.

**How it works:**
1. `extractThemeColours(theme)` builds a `Map<hexColour, cssVarName>` from the theme
2. For each mapping, it runs regex replacement in two contexts:
   - SVG attributes: `fill="#abc"`, `stroke="#abc"`, `stop-color="#abc"`, `flood-color="#abc"`
   - Inline styles: `style="fill: #abc"`, `style="color: #abc"`
3. `stripInlineCssVariables(svg)` removes `--var: #value;` definitions from style attributes (beautiful-mermaid injects these, which would override page CSS)
4. `processAlphaColours(svg, theme)` handles 8-digit hex colours by converting the alpha component to a `fill-opacity` attribute

**CRITICAL IMPLICATION FOR NEW CODE:**
Any new SVG element that uses a theme colour (e.g., in a new filter's `flood-color`) will be automatically processed IF the colour value exactly matches a value in the theme. Colours derived via `shiftColor()` will NOT match and will NOT be replaced -- they will be baked in as static hex values. This is acceptable for gradient stops but would be a problem for primary UI elements.

---

### `src/themes/fonts.ts` -- Font Loading Infrastructure

**Role:** Manages font loading via Google Fonts `<link>` tags and Fontshare CSS API links.

**`fontRegistry`:** A lookup table mapping font family names to their source configuration. Supports two types:
- `'google'` -- generates a `<link>` to Google Fonts
- `'fontface'` -- Fontshare fonts are also loaded via `<link>` to their CSS API endpoint

**`generateFontHTML(fontFamilies)`:** Takes an array of family names, deduplicates, looks up each in the registry, and produces the appropriate `<link>` tags with preconnect hints.

**`getThemeFontFamilies(typography)`:** Extracts the three family names (display, body, mono) from a theme's typography definition.

---

### `src/prompts/templates.ts` -- LLM Prompt Templates

**Role:** Contains prompt templates that the server returns to the LLM as text guidance.

**`ANALYSIS_PROMPT`:**
Used by `analyze_content` tool. Tells the LLM to look for: WORKFLOWS, SYSTEMS, DATA MODELS, RELATIONSHIPS, METRICS/KPIs. Includes layout selection heuristics and style recommendations. Instructs the LLM to STOP and ask the user before generating.

**`MERMAID_GENERATION_PROMPT`:**
Used by `generate_mermaid_prompt` tool. Guides the LLM in writing Mermaid diagram code with styling. Includes supported diagram types and example syntax.

**`buildVisualizationPrompt()`:**
Legacy function for generating a full HTML prompt. Not used in the current direct-rendering pipeline.

**`formatAnalysisForUser()`:**
Formats identified items into a numbered list for user presentation.

---

### `src/types.ts` -- Shared Types

Contains legacy type definitions. `IdentifiedItem`, `AnalysisResult`, `SelectedSystem`, and `VisualizationResult` are used by the analysis workflow but not by the direct rendering pipeline.

---

## Design Guide Files

Located at `DesignTeam/DesignGuide/`. These are reference documents for the development team. The `get_design_guide` tool serves them to the LLM on request.

| File | Audience | Purpose |
|------|----------|---------|
| `DesignGuide.md` | Dev team | Master design philosophy, quality gates, anti-patterns |
| `POV.md` | LLM (curated extract) | Cool-kid Test, Three Pillars, anti-patterns, quality gates |
| `Typography.md` | Dev team | Font pairings per theme with personality descriptions, type scale, line height, letter spacing, measure rules |
| `Layouts.md` | Dev team | Layout archetypes with ASCII wireframes, selection matrix, responsive breakpoints, design notes per layout |
| `D3StyleGuide.md` | Dev team | SVG filters, curve types, colour science, animation choreography, accessibility patterns, scrollytelling, performance, chart-specific guidelines |
| `ColorTheory.md` | Dev team | Colour purpose hierarchy, colour budget, sequential/diverging/categorical strategies, opacity as dimension, accessible palettes |
| `Spacing.md` | Dev team | 8px grid system, component spacing, chart margins, responsive spacing, spacing crimes |

---

## Known Architectural Gaps (As of March 2026)

### Resolved (v0.2.0)
- ~~ChartOptions is under-exposed~~ - **RESOLVED**: Full chartOptions now exposed including emphasis, curve, animation, colorStrategy, annotations, patterns
- ~~Dead CSS for pull-quote and metric-card~~ - **RESOLVED**: Section roles system now generates these elements
- ~~No section-level variation~~ - **RESOLVED**: Section roles (metric, pull-quote, lead, statement, full-width, supporting) implemented
- ~~6 layouts only~~ - **RESOLVED**: 13 layout templates now available

### Remaining

1. **Description is flattened.** `generate_visualization.ts` wraps `system.description` in `<p>` tags. The `Section.content` field accepts any HTML but receives only a single paragraph.

2. **diagramType is required.** The Zod schema requires it, but the `Section.diagram` field is optional. Sections cannot currently be prose-only.

3. **Theme definitions drift from Typography.md.** Some font pairings in `definitions.ts` don't match the Typography guide's recommendations (Dracula display, Creative display).

4. **scales.sequential and scales.diverging are not CSS-variable accessible.** Only `scales.primary` is exposed as `--scale-1` through `--scale-5`. Sequential (9 colours) and diverging (11 colours) are only available in TypeScript at render time.

5. **Hero is not universally available.** The `hero` schema field is consumed by `buildMagazineLayout()` and `buildDossierLayout()` but other layouts ignore it.

### Design Decisions (Not Gaps)

- **Pattern encoding is opt-in.** `patterns: true` must be explicitly requested rather than being automatic. This is intentional - patterns add visual complexity and should only be used when accessibility requires it.
- **Animation respects prefers-reduced-motion.** All animations are wrapped in `@media (prefers-reduced-motion: no-preference)` which means users who have requested reduced motion will see instant transitions. This is correct accessibility behavior.
- **C4 diagrams not supported.** beautiful-mermaid library doesn't support C4 syntax. This is a known limitation of the underlying renderer.
