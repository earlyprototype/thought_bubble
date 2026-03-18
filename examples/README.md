# thought_bubble Examples

Self-contained HTML visualisations demonstrating thought_bubble v0.2.0 capabilities. All examples include live theme switchers and work offline.

---

## Full Documentation Examples

Real documentation transformed into interactive visualisations showcasing complete workflows.

### Payment Gateway Integration API
**File:** `payment_gateway_integration.html`

**Layout:** Sidebar (technical documentation)  
**Theme:** Technical  
**Content:** RESTful API for payment processing, subscriptions, and refunds

**Demonstrates:**
- Sequence diagrams (authentication flow, payment processing)
- Flowchart (service architecture, failed payment handling)
- ER diagram (data model relationships)
- Multi-section technical documentation with navigation
- Theme switcher with 12 themes

**Best For:** Technical documentation, API references, system integration guides

---

### Product Roadmap 2026
**File:** `product_roadmap_2026.html`

**Layout:** Magazine (narrative with hero section)  
**Theme:** Gruvbox  
**Content:** AI-powered analytics platform development roadmap across 9 phases

**Demonstrates:**
- Hero section with key metric ($5M ARR target)
- Gantt chart with annotations (development timeline)
- Donut chart (resource allocation)
- Area chart with curve styling and annotations (adoption metrics)
- Flowchart (phase dependencies)
- Bar chart with sequential colors (risk assessment)
- Section roles (lead, metric, full-width, supporting)

**Best For:** Strategic roadmaps, quarterly reports, investor updates

---

### TechCorp Organizational Structure
**File:** `techcorp_org_structure.html`

**Layout:** Dossier (intelligence/profile format)  
**Theme:** Professional  
**Content:** Enterprise org structure with 850 employees across 8 departments

**Demonstrates:**
- Hero section with company profile (850 employees metric)
- Flowchart (executive hierarchy, decision framework)
- Bar charts with different color strategies (department sizes, challenges)
- Area chart with annotations (growth projections)
- Theme switcher
- Metric role sections

**Best For:** Org charts, company profiles, research synthesis, market analysis

---

## D3 Chart Examples

Individual examples showcasing D3 capabilities.

### D3 Annotations
**File:** `d3_annotations.html`

**Feature:** Data point labels with positioning  
**Chart Type:** Line chart  
**Layout:** Minimal

Demonstrates annotation system with labels like "Product launch +54%" and "Enterprise deals +73%" positioned with dx/dy offsets. Essential for storytelling with data.

---

### D3 Curve Types
**File:** `d3_curves.html`

**Feature:** Line interpolation methods  
**Chart Types:** 4 line charts  
**Layout:** Dashboard

Compares smooth (monotone), natural (Catmull-Rom), sharp (linear), and step interpolations side-by-side using the same dataset. Shows when to use each curve type.

---

### D3 Color Strategies
**File:** `d3_colorstrategies.html`

**Feature:** Color encoding approaches  
**Chart Types:** 4 bar charts  
**Layout:** Dashboard

Demonstrates categorical (distinct groups), sequential (magnitude), diverging (two-pole), and monochrome (single hue) color strategies. Shows appropriate use cases for each.

---

### D3 Emphasis Effects
**File:** `d3_emphasis.html`

**Feature:** Visual emphasis techniques  
**Chart Types:** 3 bar charts  
**Layout:** Magazine

Compares glow (luminous halo, best on dark themes), shadow (depth via drop shadow), and lift (scale transform) effects for highlighting key data points.

---

### Pattern Encoding for Accessibility
**File:** `d3_patterns.html`

**Feature:** WCAG-compliant pattern fills  
**Chart Type:** Bar chart  
**Layout:** Minimal  
**Theme:** Solarized Light

Demonstrates pattern fills alongside color for colorblind accessibility and print compatibility. Critical for public-facing and compliance-required visualizations.

---

### Sankey & Radial Charts
**File:** `d3_sankey_radial.html`

**Feature:** Flow and circular comparison charts  
**Chart Types:** Sankey diagram, radial bar chart  
**Layout:** Magazine

- **Sankey:** Flow volumes (revenue streams from channels to products)
- **Radial:** Multi-axis comparison in circular layout (capability scoring)

---

## Legacy Examples

Older examples from pre-v0.2.0 demonstrating original capabilities.

### Pattern-Rule Integration
**File:** `pattern_rule_integration_example.html`

Original example - technical knowledge graph documentation with class diagrams, property lists, and code blocks.

### System Architecture
**File:** `system_architecture_example.html`

Microservices architecture with Mermaid diagrams and component cards.

### Learning Path
**File:** `learning_path_example.html`

Educational journey with timeline layout, progress bars, and accordion FAQs.

### Travel Itinerary
**File:** `travel_itinerary_example.html`

Trip planner with day-by-day cards, budget breakdown, and comparison tables.

### E-Commerce Platform
**File:** `ecommerce_platform_visualization.html`

Platform documentation with service flows.

### Team Framework
**File:** `Team_Framework_Visualization_example.html`

Team operational framework documentation.

---

## How to Use

### View in Browser
Simply open any HTML file:
```bash
# Windows
start examples/payment_gateway_integration.html

# macOS
open examples/payment_gateway_integration.html

# Linux
xdg-open examples/payment_gateway_integration.html
```

### Copy and Customize
All examples are self-contained. Copy the HTML and modify content, colors, or structure as needed.

### Learn from Examples
Study the source to understand:
- How layouts structure content
- How section roles control visual treatment
- How chart options affect rendering
- How themes apply across components
- How density presets adjust spacing

---

## What's Demonstrated

All examples include:
- **13 layout templates** (sidebar, magazine, presentation, dashboard, minimal, editorial, comparison, briefing, tutorial, scorecard, report, dossier, dialogue)
- **Section roles** (metric, pull-quote, lead, statement, full-width, supporting)
- **Density presets** (compact, comfortable, spacious)
- **Advanced chart options** (annotations, curve types, color strategies, emphasis effects, patterns)
- **New chart types** (sankey, radial, treemap)
- **Theme switcher** (12 themes with live switching)

---

## Browser Compatibility

All examples work in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS, Android)

Requires JavaScript enabled for Mermaid diagrams and interactivity.

---

## Need Help?

- Main documentation: `../README.md`
- MCP server docs: `../thought_bubble_mcp/README.md`
- Architecture reference: `../thought_bubble_mcp/ARCHITECTURE.md`
- Design guides: `../DesignTeam/DesignGuide/`
