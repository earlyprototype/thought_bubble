# Examples Generation Plan

## Overview
Generate professional examples demonstrating thought_bubble v0.2.0 capabilities:
- Individual D3 feature examples (showcasing new capabilities)
- 3 full documentation examples from test docs

---

## Part 1: Individual D3 Feature Examples

### 1. Annotations Example
**File:** `examples/d3_annotations_example.html`

**Content:** Revenue growth chart demonstrating annotation system

**MCP Call:**
```json
{
  "content": "Revenue Growth Analysis",
  "selectedSystems": [{
    "id": 1,
    "title": "Quarterly Revenue Growth",
    "description": "Revenue performance across Q1-Q4 with key milestones annotated",
    "diagramType": "line",
    "chartData": [
      {"x": "Q1 2026", "y": 1200000},
      {"x": "Q2 2026", "y": 1850000},
      {"x": "Q3 2026", "y": 2100000},
      {"x": "Q4 2026", "y": 3200000}
    ],
    "chartOptions": {
      "title": "Quarterly Revenue ($)",
      "curve": "smooth",
      "emphasis": "glow",
      "annotations": [
        {"label": "Product launch", "x": "Q2 2026", "y": 1850000, "dx": 10, "dy": -20},
        {"label": "Enterprise deals", "x": "Q4 2026", "y": 3200000, "dx": 10, "dy": -20}
      ]
    }
  }],
  "theme": "tokyo_night",
  "layout": "minimal",
  "title": "D3 Annotations Example",
  "subtitle": "Key data point labels with positioning"
}
```

---

### 2. Curve Types Example
**File:** `examples/d3_curves_example.html`

**Content:** Same dataset rendered with 4 different curve interpolations

**MCP Call:**
```json
{
  "content": "Curve Type Comparison",
  "selectedSystems": [
    {
      "id": 1,
      "title": "Smooth (Monotone) - Default for Time Series",
      "description": "Monotone cubic interpolation prevents overshooting",
      "diagramType": "line",
      "chartData": [
        {"x": "Jan", "y": 45},
        {"x": "Feb", "y": 82},
        {"x": "Mar", "y": 65},
        {"x": "Apr", "y": 110},
        {"x": "May", "y": 95}
      ],
      "chartOptions": {
        "curve": "smooth",
        "emphasis": "glow"
      }
    },
    {
      "id": 2,
      "title": "Natural (Catmull-Rom) - Organic Curves",
      "description": "Natural cubic spline for flowing data",
      "diagramType": "line",
      "chartData": [
        {"x": "Jan", "y": 45},
        {"x": "Feb", "y": 82},
        {"x": "Mar", "y": 65},
        {"x": "Apr", "y": 110},
        {"x": "May", "y": 95}
      ],
      "chartOptions": {
        "curve": "natural",
        "emphasis": "glow"
      }
    },
    {
      "id": 3,
      "title": "Sharp (Linear) - Raw Data Points",
      "description": "Direct point-to-point connection showing exact inflections",
      "diagramType": "line",
      "chartData": [
        {"x": "Jan", "y": 45},
        {"x": "Feb", "y": 82},
        {"x": "Mar", "y": 65},
        {"x": "Apr", "y": 110},
        {"x": "May", "y": 95}
      ],
      "chartOptions": {
        "curve": "sharp",
        "emphasis": "shadow"
      }
    },
    {
      "id": 4,
      "title": "Step - Discrete Changes",
      "description": "Step function for state transitions and discrete data",
      "diagramType": "line",
      "chartData": [
        {"x": "Jan", "y": 45},
        {"x": "Feb", "y": 82},
        {"x": "Mar", "y": 65},
        {"x": "Apr", "y": 110},
        {"x": "May", "y": 95}
      ],
      "chartOptions": {
        "curve": "step",
        "emphasis": "lift"
      }
    }
  ],
  "theme": "github_dark",
  "layout": "comparison",
  "title": "D3 Curve Types",
  "subtitle": "Line interpolation methods compared",
  "density": "comfortable"
}
```

---

### 3. Color Strategies Example
**File:** `examples/d3_colorstrategies_example.html`

**Content:** Four charts demonstrating different color approaches

**MCP Call:**
```json
{
  "content": "Color Strategy Demonstration",
  "selectedSystems": [
    {
      "id": 1,
      "title": "Categorical - Distinct Groups",
      "description": "Each category gets a unique color from the theme palette",
      "diagramType": "bar",
      "chartData": [
        {"label": "Product A", "value": 85},
        {"label": "Product B", "value": 72},
        {"label": "Product C", "value": 91},
        {"label": "Product D", "value": 68},
        {"label": "Product E", "value": 79}
      ],
      "chartOptions": {
        "colorStrategy": "categorical",
        "animation": "grow"
      }
    },
    {
      "id": 2,
      "title": "Sequential - Light to Dark",
      "description": "Magnitude encoding using graduated color intensity",
      "diagramType": "bar",
      "chartData": [
        {"label": "Level 1", "value": 20},
        {"label": "Level 2", "value": 40},
        {"label": "Level 3", "value": 60},
        {"label": "Level 4", "value": 80},
        {"label": "Level 5", "value": 100}
      ],
      "chartOptions": {
        "colorStrategy": "sequential",
        "animation": "grow"
      }
    },
    {
      "id": 3,
      "title": "Diverging - Two-Pole Scale",
      "description": "Deviation from midpoint with two contrasting colors",
      "diagramType": "bar",
      "chartData": [
        {"label": "Q1", "value": -15},
        {"label": "Q2", "value": -8},
        {"label": "Q3", "value": 5},
        {"label": "Q4", "value": 22},
        {"label": "Q5", "value": 35}
      ],
      "chartOptions": {
        "colorStrategy": "diverging",
        "animation": "grow"
      }
    },
    {
      "id": 4,
      "title": "Monochrome - Single Hue with Depth",
      "description": "Accent color with opacity/lightness variation for emphasis",
      "diagramType": "bar",
      "chartData": [
        {"label": "Jan", "value": 45},
        {"label": "Feb", "value": 62},
        {"label": "Mar", "value": 78},
        {"label": "Apr", "value": 91},
        {"label": "May", "value": 103}
      ],
      "chartOptions": {
        "colorStrategy": "monochrome",
        "emphasis": "glow",
        "animation": "grow"
      }
    }
  ],
  "theme": "dracula",
  "layout": "dashboard",
  "title": "D3 Color Strategies",
  "subtitle": "Categorical, sequential, diverging, and monochrome approaches",
  "density": "comfortable"
}
```

---

### 4. Emphasis Effects Example
**File:** `examples/d3_emphasis_example.html`

**Content:** Three charts showing glow, shadow, and lift emphasis techniques

**MCP Call:**
```json
{
  "content": "Emphasis Effects Demonstration",
  "selectedSystems": [
    {
      "id": 1,
      "title": "Glow - Luminous Halo (Best on Dark Themes)",
      "description": "Premium glow effect highlighting peak data points",
      "diagramType": "bar",
      "chartData": [
        {"label": "Mon", "value": 45},
        {"label": "Tue", "value": 62},
        {"label": "Wed", "value": 91},
        {"label": "Thu", "value": 78},
        {"label": "Fri", "value": 103}
      ],
      "chartOptions": {
        "emphasis": "glow",
        "colorStrategy": "monochrome",
        "animation": "grow"
      },
      "role": "full-width"
    },
    {
      "id": 2,
      "title": "Shadow - Depth via Drop Shadow",
      "description": "Subtle depth effect lifting important elements",
      "diagramType": "bar",
      "chartData": [
        {"label": "Mon", "value": 45},
        {"label": "Tue", "value": 62},
        {"label": "Wed", "value": 91},
        {"label": "Thu", "value": 78},
        {"label": "Fri", "value": 103}
      ],
      "chartOptions": {
        "emphasis": "shadow",
        "colorStrategy": "categorical",
        "animation": "stagger"
      }
    },
    {
      "id": 3,
      "title": "Lift - Scale Transform",
      "description": "Subtle scale increase on key elements for prominence",
      "diagramType": "bar",
      "chartData": [
        {"label": "Mon", "value": 45},
        {"label": "Tue", "value": 62},
        {"label": "Wed", "value": 91},
        {"label": "Thu", "value": 78},
        {"label": "Fri", "value": 103}
      ],
      "chartOptions": {
        "emphasis": "lift",
        "colorStrategy": "sequential",
        "animation": "grow"
      }
    }
  ],
  "theme": "tokyo_night",
  "layout": "magazine",
  "title": "D3 Emphasis Effects",
  "subtitle": "Glow, shadow, and lift techniques for highlighting key data",
  "density": "spacious"
}
```

---

### 5. Pattern Encoding Example
**File:** `examples/d3_patterns_example.html`

**Content:** Accessible chart with pattern fills for WCAG compliance

**MCP Call:**
```json
{
  "content": "Pattern Encoding for Accessibility",
  "selectedSystems": [{
    "id": 1,
    "title": "Market Share by Region (Accessible)",
    "description": "Pattern fills ensure charts are readable without relying solely on color - critical for colorblind users and print",
    "diagramType": "bar",
    "chartData": [
      {"label": "North America", "value": 35},
      {"label": "Europe", "value": 28},
      {"label": "Asia Pacific", "value": 22},
      {"label": "Latin America", "value": 10},
      {"label": "Middle East", "value": 5}
    ],
    "chartOptions": {
      "patterns": true,
      "colorStrategy": "categorical",
      "animation": "grow",
      "title": "Global Market Share (%)"
    },
    "role": "full-width"
  }],
  "theme": "solarized_light",
  "layout": "minimal",
  "title": "Pattern Encoding for Accessibility",
  "subtitle": "WCAG-compliant visualizations with texture patterns",
  "density": "spacious"
}
```

---

## Part 2: Full Documentation Examples

### Example 1: Payment Gateway API Documentation
**File:** `examples/payment_gateway_integration.html`
**Source:** test_doc_1_api_integration.md
**Layout:** sidebar (technical documentation with 7+ sections)
**Theme:** technical
**Density:** comfortable

**Key Visualizations:**
- Authentication flow (sequence diagram)
- Service architecture (flowchart)
- Payment processing workflow (sequence diagram)
- Data models (ER diagram or class diagram)
- Integration dependencies (flowchart)

---

### Example 2: Product Roadmap 2026
**File:** `examples/product_roadmap_2026.html`
**Source:** test_doc_2_product_roadmap.md
**Layout:** magazine (narrative with hero section)
**Theme:** gruvbox
**Density:** comfortable

**Key Visualizations:**
- Phase timeline (gantt chart)
- Team allocation (bar chart with sequential colors)
- Success metrics progression (line chart with annotations)
- Resource distribution (donut/pie chart)
- Dependencies flow (sankey or flowchart)

**Hero Section:**
- Title: "Product Roadmap 2026 - AI-Powered Analytics Platform"
- Metric: {"value": "$5M ARR", "label": "Year-End Target"}

---

### Example 3: TechCorp Organizational Structure
**File:** `examples/techcorp_org_structure.html`
**Source:** test_doc_3_org_structure.md
**Layout:** dossier (intelligence/profile format)
**Theme:** professional
**Density:** comfortable

**Key Visualizations:**
- Executive hierarchy (flowchart)
- Department sizes (bar chart with categorical colors)
- Team distribution (treemap)
- Growth projections (area chart with annotations)
- Decision-making framework (flowchart)

**Hero/Profile Section:**
- Company: TechCorp Global
- Facts: 850 employees, 15 countries, 8 executives, 320 engineers

---

## Generation Instructions

1. Use MCP `analyze_content` tool on each source document
2. Select appropriate systems for visualization
3. Call `generate_visualization` with the JSON structures above
4. Save outputs to examples/ directory
5. Test in browser with theme switcher
6. Update examples/README.md with new structure

---

## New examples/ Directory Structure

```
examples/
├── README.md                              # Updated documentation
├── d3_annotations_example.html           # Individual feature demo
├── d3_curves_example.html                # Individual feature demo
├── d3_colorstrategies_example.html       # Individual feature demo
├── d3_emphasis_example.html              # Individual feature demo
├── d3_patterns_example.html              # Individual feature demo
├── payment_gateway_integration.html      # Full doc example
├── product_roadmap_2026.html             # Full doc example
├── techcorp_org_structure.html           # Full doc example
└── [Legacy examples removed or archived]
```

---

## README.md Structure

### D3 Feature Examples
- Annotations
- Curve Types
- Color Strategies
- Emphasis Effects
- Pattern Encoding

### Full Documentation Examples
- Payment Gateway API (Sidebar layout, technical theme)
- Product Roadmap (Magazine layout, narrative)
- Org Structure (Dossier layout, intelligence)

### How to Use
- Copy and modify
- Learn from examples
- Component reference
