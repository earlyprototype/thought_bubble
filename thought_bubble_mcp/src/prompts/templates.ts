/**
 * Prompt templates for thought_bubble visualization workflow
 */

import type { IdentifiedItem } from '../types.js';

export const ANALYSIS_PROMPT = `Analyze the following content and identify visualization opportunities.

Before making layout or chart recommendations, call get_design_guide with section: 'pov' to understand the product philosophy, quality gates, and anti-patterns that guide all thought_bubble output.

Look for:
1. **WORKFLOWS** - Processes, flows, or sequences (e.g., user registration flow, payment processing)
2. **SYSTEMS** - Architectures, services, or system components (e.g., microservices, database schemas)
3. **DATA MODELS** - Entities, objects, or data structures (e.g., User object, Order schema)
4. **RELATIONSHIPS** - Connections, integrations, or dependencies between components
5. **METRICS/KPIs** - Numbers, trends, comparisons that would benefit from charts

For each item you identify, provide:
- A clear, descriptive title
- A brief explanation of what it represents
- Recommended diagram/chart type

**Based on the content type, also recommend a LAYOUT:**
Use the get_design_guide tool to see layout selection criteria, or apply these heuristics:
- Investor update, quarterly report → Magazine (with hero metric)
- KPI dashboard, metrics → Dashboard (with metric cards)
- Pitch deck, presentation → Presentation (slide-based)
- Technical documentation → Sidebar (reference navigation)
- Single topic deep-dive → Minimal (focused)
- Essays, narratives, explainers → Editorial (academic style)
- Vendor evaluation, A/B tests, tech stack decisions → Comparison (parallel columns)
- Sprint reviews, weekly summaries, status updates → Briefing (lead item + stats strip)
- Onboarding docs, step-by-step guides, workshops → Tutorial (numbered steps with progress spine)
- Maturity assessments, health checks, audits → Scorecard (overall score + category cards)
- RFCs, compliance docs, annual reports → Report (print-friendly, numbered sections, TOC)
- Research synthesis, company profiles, market analysis → Dossier (facts + narrative + deep dives)
- ADRs, buy-vs-build decisions, structured for/against → Dialogue (parallel arguments + trade-offs)

**SECTION ROLES (assign to identified items based on their function):**
When identifying items, specify a role to control visual treatment:
- **metric**: For KPIs, key numbers, headline stats (e.g., "$12.4M ARR", "142% NRR", "0 bugs shipped")
  → Use in: Dashboard (KPI cards), Briefing (stats strip), Scorecard (overall grade), Presentation (metric slides), Dossier (facts strip)
- **pull-quote**: For standout insights, key takeaways, memorable statements
  → Use in: Magazine, Editorial (to break up long prose with emphasis)
- **lead**: For opening paragraphs that set context, introduce the narrative
  → Use in: Magazine (wider opening section), Briefing (headline item), Dossier (overview)
- **statement**: For bold declarations, theses, conclusions (e.g., "We are profitable.", "The metaphor is wrong.")
  → Use in: Presentation (statement slides), Editorial (thesis), Dialogue (verdict), Dossier (so-what)
- **full-width**: For charts/diagrams that need breakout width to breathe, show detail, or emphasize importance
  → Use in: Editorial (breakout charts), Scorecard (trend analysis), Presentation (visual slides), Comparison, Report, Dialogue (trade-offs chart)
- **supporting**: For appendices, recommendations, next steps, supplementary material
  → Use in: Briefing (action items), Tutorial (next steps), Report (appendices), Scorecard (recommendations), Dialogue (implementation plan)
- **default**: Standard section treatment (most sections should use this)

IMPORTANT: Not every section needs a special role. Most should be 'default'. Only assign roles when the content specifically benefits from the visual treatment.

**STYLE RECOMMENDATIONS:**
Based on the content tone, also recommend a STYLE APPROACH:
- Content tone (formal/corporate, technical, creative, editorial, casual)
- Theme suggestion with reasoning (e.g., "github_light for corporate reports, tokyo_night for technical docs, gruvbox for retro/warm, solarized for readability")
- Density: compact (data-heavy, many small charts), comfortable (balanced), spacious (narrative-led, fewer visuals)
- Diagram vs chart balance: prefer Mermaid for processes/architecture, D3 for quantitative data. Do NOT use pie charts for more than 6 categories. Use bar charts when exact comparison matters. Use line/area for trends over time.
- Caption approach: use contextual insight captions (e.g., "Revenue grew 34% QoQ") not diagram-type labels like "Pie Diagram"

**HERO SECTIONS (for Magazine and Dossier layouts):**
If recommending Magazine or Dossier layout and the content has a standout metric or headline, recommend a hero section:
- title: The headline (e.g., "From Zero to $10M ARR in 18 Months")
- subtitle: Supporting context
- metric: { value: "$10M", label: "Annual Revenue" } - the key number to emphasize

**CHART STYLING OPTIONS (recommend when appropriate):**
For D3 charts, suggest styling to enhance storytelling:
- **emphasis**: glow (luminous halo, best on dark themes), shadow (depth), lift (scale transform), none (flat)
- **curve** (line/area charts): smooth (time series), sharp (raw data), step (discrete changes), natural (organic)
- **animation**: stagger (sequential), draw (line draws itself), grow (bars from baseline), fade (opacity), none
- **colorStrategy**: categorical (distinct per group), sequential (magnitude), diverging (two-pole), monochrome (single hue)
- **annotations**: Always recommend annotations for key insights (e.g., { label: "Peak quarter", x: "Q3", y: 125, dy: -20 })
- **patterns**: Only suggest if accessibility (WCAG) compliance is explicitly required

IMPORTANT WORKFLOW INSTRUCTION:
After presenting your analysis, STOP and ask the user which items they want to visualize. 
DO NOT automatically proceed to generate visualizations or call the generate_visualization tool.
WAIT for the user to explicitly select which numbered items they'd like to visualize.

CONTENT TO ANALYZE:
---
{content}
---

Format your response as:
1. Numbered list by category (WORKFLOWS, SYSTEMS, DATA MODELS, METRICS)
   - Include recommended diagram/chart type for each
   - Specify section role if applicable (metric, pull-quote, lead, statement, full-width, supporting)
   - Suggest chart styling options where appropriate (emphasis, curve, annotations)
2. Recommended layout with reasoning
3. Recommended style approach (theme, density, caption style)
4. Hero section recommendation (if Magazine/Dossier layout)
5. Ask: "Which items would you like me to visualize? Please select by number (e.g., 1, 3, 5)"

EXAMPLE OUTPUT FORMAT:
## Identified Items:
METRICS:
1. Revenue trend over 12 months - line chart, role: lead, emphasis: glow, curve: smooth, annotations: [peak quarter, holiday dip]
2. MRR - bar chart, role: metric (displays as KPI card with large number)
3. Customer segments breakdown - donut chart, colorStrategy: categorical

WORKFLOWS:
4. Payment processing flow - sequence diagram

## Recommendations:
- Layout: Dashboard (this is KPI-focused monitoring content)
- Theme: github_light (corporate, professional)
- Density: comfortable
- Hero: Not needed (dashboard layout doesn't use hero sections)`;

export const MERMAID_GENERATION_PROMPT = `Generate Mermaid diagram code for the selected items.

## DIAGRAM TYPE SELECTION

Choose the most appropriate diagram type:
- **flowchart** (graph TD/LR) - Processes, workflows, decision trees, architecture (use subgraphs)
- **sequence** - API calls, interactions, communication flows
- **class** - Data models, object relationships, schemas
- **er** (Entity-Relationship) - Database schemas, data relationships
- **state** - State machines, status transitions

NOTE: C4 diagrams are NOT supported. Use flowcharts with subgraphs for architecture diagrams.

## CRITICAL: NODE LABELS AND LINE BREAKS

**DO NOT use HTML tags in Mermaid node labels:**
- ❌ WRONG: \`Phase1[Phase 1<br/>Week 1-4]\` (renders literally as "Phase 1<br/>Week 1-4")
- ❌ WRONG: \`Phase1[Phase 1<br>Week 1-4]\` (still renders literally)
- ✅ CORRECT: \`Phase1[Phase 1: Week 1-4]\` (single line with colon or dash)
- ✅ CORRECT: \`Phase1[Phase 1 - Foundation]\` (keep labels concise)

**Best practices for node labels:**
- Keep labels short and single-line
- Use colons, dashes, or commas to separate info instead of line breaks
- If you need to show multiple pieces of info, use arrow labels or subgraphs
- Descriptive edge labels can supplement short node names

## MERMAID STYLING

Apply styling directly in the Mermaid code:
- Use \`style NodeId fill:#color\` for important nodes
- Use semantic colours: green for success paths, red for errors, blue for primary
- Add subgraphs to group related elements
- Include descriptive labels on arrows

Example with styling:
\`\`\`mermaid
flowchart TD
    Start([Begin]) --> Process[Process Data]
    Process --> Decision{Valid?}
    Decision -->|Yes| Success[Complete]
    Decision -->|No| Error[Handle Error]
    
    style Start fill:#4ade80
    style Success fill:#4ade80
    style Error fill:#f87171
\`\`\`

Selected items:
{selectedItems}

Original content context:
---
{content}
---

For each selected item:
1. Choose the appropriate diagram type
2. Generate clean, well-structured Mermaid code
3. Apply styling to highlight key paths/states
4. Include descriptive labels
5. Return with clear labels indicating which item each diagram represents`;

export function buildVisualizationPrompt(
  content: string,
  mermaidDiagrams: Record<number, string>,
  theme: string = 'professional',
  navigationStyle: string = 'sidebar',
  layout?: string
): string {
  const diagramSection = Object.entries(mermaidDiagrams)
    .map(([id, code]) => `### Diagram for Item ${id}\n\`\`\`mermaid\n${code}\n\`\`\``)
    .join('\n\n');

  const layoutToUse = layout || navigationStyle;

  return `You are an expert at creating beautiful, interactive HTML visualizations from documentation and structured content.

Generate a **complete, self-contained HTML file** that visualizes the following content.

# REQUIREMENTS

1. **Include everything inline** (CSS in <style>, JS in <script>)
2. **Use CDN for Mermaid only** (https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js)
3. **Works immediately** when opened in a browser
4. **Fully responsive** (mobile, tablet, desktop)
5. **Layout**: ${layoutToUse}
6. **Uses semantic HTML** (proper heading hierarchy, ARIA labels)
7. **Theme**: ${theme}

# DESIGN SYSTEM

Use the get_design_guide MCP tool to retrieve full design guidelines. Key principles:
- Typography: Use 2+ font families, 65ch max line width
- D3 Charts: Gradient fills, hover states, tooltips, annotations
- Spacing: 8px grid, 24px minimum padding
- Layouts: Match layout to content purpose

# MERMAID DIAGRAMS TO INCLUDE

${diagramSection}

# ORIGINAL CONTENT

---
${content}
---

# OUTPUT FORMAT

Generate a single, complete HTML file that:
- Includes all the Mermaid diagrams in appropriate sections
- Presents all other content in well-structured cards/sections
- Has smooth navigation between sections
- Looks professional and polished

# MERMAID INITIALIZATION - CRITICAL

If using sidebar navigation with hidden sections (display: none), you MUST use this pattern:

\`\`\`javascript
// Initialize Mermaid with startOnLoad: false
mermaid.initialize({ 
    startOnLoad: false,
    theme: 'default',
    logLevel: 'error',
    securityLevel: 'loose'
});

// Make all sections visible for rendering
document.querySelectorAll('.section').forEach(s => s.style.display = 'block');

// Render all diagrams
mermaid.run().then(() => {
    // After rendering, hide non-active sections
    document.querySelectorAll('.section').forEach(s => {
        if (!s.classList.contains('active')) {
            s.style.display = 'none';
        }
    });
});

// Sidebar navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const target = item.getAttribute('data-section');
        
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        
        document.querySelectorAll('.section').forEach(s => {
            if (s.id === target) {
                s.classList.add('active');
                s.style.display = 'block';
            } else {
                s.classList.remove('active');
                s.style.display = 'none';
            }
        });
    });
});
\`\`\`

WHY: Mermaid cannot render diagrams in elements with display: none. This pattern temporarily shows all sections during initial render, then hides them after Mermaid completes.

# QUALITY ASSURANCE

CRITICAL: After generating the HTML, thoroughly validate all Mermaid diagram syntax:
- Check for proper opening/closing of code blocks (\`\`\`mermaid and \`\`\`)
- Verify correct Mermaid syntax (proper node definitions, arrow syntax, etc.)
- Ensure no special characters are unescaped (quotes, brackets, pipes)
- Validate graph direction declarations (TD, LR, etc.)
- Check for balanced parentheses, brackets, and braces
- Confirm all node IDs are valid (no spaces, special chars)

If you find ANY syntax errors, fix them before returning the HTML.

Return ONLY the complete HTML code, no explanations.`;
}

export const DESIGN_THINKING_ADDENDUM = `## Design Thinking Framework

When selecting chart types and visual treatments, consider:

### Context determines technique
- **Government/Enterprise**: Conservative palettes, accessible patterns, clear labels. Avoid decorative effects.
- **Marketing/Creative**: Bold gradients, animations, emphasis effects. Push visual boundaries.
- **Scientific/Research**: Precise axes, minimal decoration, sequential colour scales. Data integrity first.
- **Editorial/Narrative**: Story annotations, pull quotes, monochrome with accent. Content leads.

### Audience determines complexity
- **Executives**: High-level KPIs, max 3-4 charts, dashboard or magazine layout. Lead with the headline number.
- **Analysts**: Dense grids, cross-referenced charts, sequential/diverging scales. Detail is expected.
- **General public**: Simple bar/line charts, large labels, pattern encoding for accessibility. Clarity over sophistication.
- **Technical teams**: Architecture diagrams, Mermaid flowcharts, code-adjacent. Precision over polish.

### Chart selection matrix
- **Comparison** -> Bar (vertical or horizontal), grouped bar
- **Trend over time** -> Line, area (cumulative volume)
- **Composition** -> Pie/donut (max 6 slices), treemap (hierarchical)
- **Distribution** -> Bar histogram, area
- **Relationship** -> Quadrant, sankey (flow volumes)
- **Part-to-whole** -> Donut, treemap, stacked bar
- **Flow/process** -> Sankey, flowchart (Mermaid)
- **Timeline** -> Timeline, Gantt
- **Multi-axis comparison** -> Radial bar

### Data volume thresholds
- < 50 data points: SVG (current renderer) is optimal
- 50-500 data points: SVG works but consider aggregation
- 500+ data points: Canvas rendering recommended (future capability)`;

export function formatAnalysisForUser(items: IdentifiedItem[]): string {
  const grouped: Record<string, IdentifiedItem[]> = {
    WORKFLOW: [],
    SYSTEM: [],
    DATA_MODEL: [],
    RELATIONSHIP: []
  };

  items.forEach(item => {
    grouped[item.category].push(item);
  });

  let output = "I've identified these visualization opportunities:\n\n";

  const categoryTitles: Record<string, string> = {
    WORKFLOW: 'WORKFLOWS',
    SYSTEM: 'SYSTEMS', 
    DATA_MODEL: 'DATA MODELS',
    RELATIONSHIP: 'RELATIONSHIPS'
  };

  for (const [category, categoryItems] of Object.entries(grouped)) {
    if (categoryItems.length > 0) {
      output += `${categoryTitles[category]}:\n`;
      categoryItems.forEach(item => {
        output += `${item.id}. ${item.title} - ${item.description}\n`;
      });
      output += '\n';
    }
  }

  output += "I'll also recommend a style approach (theme, density, caption style) based on the content tone.\n\n";
  output += "Which items would you like me to create visualizations for?\n";
  output += "Respond with the numbers (e.g., '1, 3, 5' or '1-4, 7')";

  return output;
}
