/**
 * Prompt templates for thought_bubble visualization workflow
 */

import type { IdentifiedItem } from '../types.js';

export const ANALYSIS_PROMPT = `Analyze the following content and identify visualization opportunities.

Look for:
1. **WORKFLOWS** - Processes, flows, or sequences (e.g., user registration flow, payment processing)
2. **SYSTEMS** - Architectures, services, or system components (e.g., microservices, database schemas)
3. **DATA MODELS** - Entities, objects, or data structures (e.g., User object, Order schema)
4. **RELATIONSHIPS** - Connections, integrations, or dependencies between components

For each item you identify, provide:
- A clear, descriptive title
- A brief explanation of what it represents
- Why it would benefit from visualization

Return your analysis as a structured list with categories.

CONTENT TO ANALYZE:
---
{content}
---

Format your response as a numbered list organized by category (WORKFLOWS, SYSTEMS, DATA MODELS, RELATIONSHIPS).`;

export const MERMAID_GENERATION_PROMPT = `Generate Mermaid diagram code for the selected items.

For each selected item, choose the most appropriate diagram type:
- **flowchart** (graph TD/LR) - For processes, workflows, decision trees
- **sequence** - For interactions, API calls, communication flows
- **class** - For data models, object relationships, schemas
- **er** (Entity-Relationship) - For database schemas, data relationships
- **state** - For state machines, status transitions
- **c4** (Architecture) - For system architecture, component diagrams

Selected items:
{selectedItems}

Original content context:
---
{content}
---

For each selected item, generate clean, well-structured Mermaid diagram code.
Return the diagrams with clear labels indicating which item each diagram represents.`;

export function buildVisualizationPrompt(
  content: string,
  mermaidDiagrams: Record<number, string>,
  theme: string = 'professional',
  navigationStyle: string = 'sidebar'
): string {
  const diagramSection = Object.entries(mermaidDiagrams)
    .map(([id, code]) => `### Diagram for Item ${id}\n\`\`\`mermaid\n${code}\n\`\`\``)
    .join('\n\n');

  return `You are an expert at creating beautiful, interactive HTML visualizations from documentation and structured content.

Generate a **complete, self-contained HTML file** that visualizes the following content.

# REQUIREMENTS

1. **Include everything inline** (CSS in <style>, JS in <script>)
2. **Use CDN for Mermaid only** (https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js)
3. **Works immediately** when opened in a browser
4. **Fully responsive** (mobile, tablet, desktop)
5. **Includes navigation** (${navigationStyle} style)
6. **Uses semantic HTML** (proper heading hierarchy, ARIA labels)
7. **Theme**: ${theme}

# DESIGN PRINCIPLES

- **Visual Hierarchy** - Size, colour, spacing guide the eye
- **Consistency** - Uniform spacing, colours, typography
- **Progressive Disclosure** - Overview first, details on demand
- **Accessibility** - WCAG AA contrast (4.5:1), semantic HTML, keyboard navigation
- **Responsive** - Mobile-first, works on all screen sizes

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

Return ONLY the complete HTML code, no explanations.`;
}

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

  output += "Which items would you like me to create visualizations for?\n";
  output += "Respond with the numbers (e.g., '1, 3, 5' or '1-4, 7')";

  return output;
}
