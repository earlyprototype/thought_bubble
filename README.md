![Thought Bubble](thought-bubble-banner.svg)

# thought_bubble

**Abrakedabra - your boring documents are now a lovely website with logical flow**

Transform any documentation, system architecture, or plan into beautiful interactive HTML visualizations using AI.

## What Is This?

A prompt-engineering framework that enables LLMs to generate stunning, interactive HTML visualizations from any structured content. No build tools, no frameworks - just pure HTML, CSS, and JavaScript that works everywhere.

## 🚀 NEW: MCP Server Available!

**thought_bubble now has a Model Context Protocol (MCP) server!** This enables seamless integration with AI assistants like Claude Desktop, Cursor, and any MCP-compatible client.

**Benefits:**
- ✅ **Automated analysis** - AI identifies systems, workflows, and data models in your content
- ✅ **Smart diagram generation** - Automatic Mermaid diagram creation (flowchart, sequence, ER, class, state, C4)
- ✅ **One-command workflow** - Just say "visualize this" and the AI handles everything
- ✅ **No copy-paste** - Direct integration with your AI assistant

**Quick Setup:** See [`thought_bubble_mcp/START_HERE.md`](thought_bubble_mcp/START_HERE.md) for 5-minute installation.

## How It Works

### With MCP Server (Recommended)
1. **You say:** "Analyze and visualize this documentation"
2. **AI analyzes:** Identifies systems, workflows, data models automatically
3. **You select:** Choose which items to visualize
4. **AI generates:** Creates Mermaid diagrams + complete HTML
5. **You open:** Beautiful visualization in your browser

### Manual Method
1. **You provide:** Your content (markdown, JSON, text, diagrams)
2. **LLM receives:** Prompt template + your content + design asset library
3. **LLM generates:** Custom interactive HTML visualization
4. **You open:** The HTML file in any browser

## Quick Start

### Option 1: MCP Server (Best Experience)

**For Claude Desktop / Cursor / MCP Clients:**

```bash
cd thought_bubble_mcp
npm install && npm run build
```

Then add to your MCP config and restart your AI client. See full instructions in [`thought_bubble_mcp/QUICKSTART.md`](thought_bubble_mcp/QUICKSTART.md)

**Usage:**
```
"Use thought-bubble tools to analyze this content and create a visualization:

[paste your documentation]"
```

### Option 2: Use with Claude/ChatGPT (Manual)

```
1. Copy the contents of prompt_template.md
2. Attach your source document/content
3. Send to your LLM
4. Receive beautiful HTML visualization
```

### Option 3: Use with Cursor/AI IDE

```
1. Open your documentation file
2. Reference this repo: @thought_bubble
3. Say: "Visualize this using thought_bubble"
4. AI generates custom HTML
```

## What Can You Visualize?

- System architectures
- Development plans
- API documentation
- Organization charts
- Project roadmaps
- Process flows
- Data models
- Integration guides
- Technical specifications
- Knowledge bases
- Anything with structure!

## Features

### Rich Component Library

- **20+ card styles** (info, stats, features, timelines)
- **Navigation patterns** (sidebar, tabs, breadcrumbs, sticky headers)
- **Diagram support** (Mermaid, flowcharts, class diagrams)
- **Interactive elements** (accordions, tabs, tooltips, modals)
- **Layout systems** (grid, masonry, timeline, kanban)

### Professional Design

- **5 color themes** (professional, creative, technical, minimal, dark)
- **Responsive layouts** (mobile, tablet, desktop)
- **Smooth animations** (scroll effects, hover states, transitions)
- **Accessibility** (ARIA labels, keyboard navigation, contrast)

### Self-Contained

- No build process required
- No dependencies (except optional Mermaid CDN)
- Single HTML file output
- Works offline (after first load)
- Copy-paste deployable

## Examples

See the `examples/` folder for:

- **system_architecture.html** - Technical system integration visualization
- **project_plan.html** - Development roadmap with milestones
- **org_structure.html** - Organization hierarchy and teams

## Files in This Repo

```
thought_bubble/
├── README.md                          # This file
├── prompt_template.md                 # Copy-paste prompt for LLM
├── base_template.html                 # Core HTML structure
├── thought_bubble_mcp/                # MCP Server (NEW!)
│   ├── START_HERE.md                 # MCP quick start guide
│   ├── QUICKSTART.md                 # 5-minute setup
│   ├── README.md                     # Complete MCP documentation
│   ├── src/                          # TypeScript source code
│   └── dist/                         # Built server (after npm run build)
├── LLM_Design_Assets/
│   ├── design_rules.md               # Design guidance for LLM
│   ├── components/
│   │   ├── cards.html                # Card component library
│   │   ├── navigation.html           # Navigation patterns
│   │   ├── diagrams.html             # Diagram examples
│   │   ├── layouts.html              # Layout systems
│   │   └── interactive.html          # Interactive elements
│   └── styles/
│       ├── color_schemes.css         # Theme definitions
│       ├── animations.css            # Animation library
│       └── responsive.css            # Responsive utilities
└── examples/                          # Example visualizations
```

## Usage Tips

### For Best Results:

1. **Provide structure** - The more organized your content, the better the output
2. **Specify preferences** - Tell the LLM which components/theme you want
3. **Include diagrams** - Mermaid diagrams render beautifully
4. **Define sections** - Clear section headers help create navigation
5. **Add metadata** - Status, dates, authors enhance the visualization

### Example Prompt:

```
Using thought_bubble, create an interactive HTML visualization of this content.

Theme: Professional
Include: Sidebar navigation, Mermaid diagrams, stat cards, timeline layout
Focus: Make complex relationships easy to understand

[Your content here]
```

## Customization

The LLM can customize:
- Color schemes and themes
- Component selection
- Layout structure
- Navigation style
- Animation intensity
- Content organization

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS, Android)

## MCP Server Tools

The thought_bubble MCP server exposes two powerful tools:

### 1. `analyze_content`
Analyzes your documentation to identify:
- Workflows (processes, sequences, flows)
- Systems (architectures, components, services)
- Data Models (entities, schemas, objects)
- Relationships (connections, integrations)

### 2. `generate_visualization`
Generates interactive HTML with:
- Mermaid diagrams (flowchart, sequence, class, ER, state, C4)
- Theme selection (professional, dark, technical, minimal, creative)
- Navigation styles (sidebar, tabs, minimal)
- Responsive design

**Learn more:** See [`thought_bubble_mcp/`](thought_bubble_mcp/) directory

## License

MIT License - Use freely in personal and commercial projects

## Credits

Created to make documentation beautiful and accessible.

## Contributing

Contributions welcome! Add new components, themes, examples, or enhance the MCP server via PR.

---

**Make your documentation unforgettable.**
