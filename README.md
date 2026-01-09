![Thought Bubble](thought-bubble-banner.svg)

# thought_bubble [+ MCP]

**Abrakedabra - your boring documents are now a lovely website with workflow diagrams**

Transform any documentation, system architecture, or plan into beautiful interactive HTML visualisations using AI.

## What Is This?

An LLM-integrated one-shot tool that generates pretty, interactive HTML visualisations with embedded (Mermaid code-based) workflow and system diagrams from any structured content. No build tools, no frameworks - just pure HTML, CSS, and JavaScript that works everywhere.

## 🚀 NEW: MCP Server Available!

**thought_bubble now has a Model Context Protocol (MCP) server!** This enables seamless integration with AI assistants like Claude Desktop, Cursor, and any MCP-compatible client.

**Benefits:**
- ✅ **Automated analysis** - AI identifies systems, workflows, and data models in your content
- ✅ **Smart diagram generation** - Automatic Mermaid diagram creation (flowchart, sequence, ER, class, state, C4)
- ✅ **One-command workflow** - Just say "visualise this" and the AI handles everything
- ✅ **No copy-paste** - Direct integration with your AI assistant

**Quick Setup:** See [`thought_bubble_mcp/START_HERE.md`](thought_bubble_mcp/START_HERE.md) for 5-minute installation.

## How It Works

### With MCP Server (Recommended)
1. **You say:** "Analyse and visualise this documentation"
2. **AI analyses:** Identifies systems, workflows, data models automatically
3. **You select:** Choose which items to visualise
4. **AI generates:** Creates Mermaid diagrams + complete HTML
5. **You open:** Beautiful visualisation in your browser

### Manual Method
1. **You provide:** Your content (markdown, JSON, text, diagrams)
         |
2. **LLM receives:** Prompt template + your content + design asset library
3. **LLM detects:** Workflows, system architecture, processes + relationships
4. **LLM generates:** Mermaid diagram code + custom HTML
         |
5. **You open:** The HTML file in any browser
6. **You experience:** Clarity and joy

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
"Use thought-bubble tools to analyse this content and create a visualisation:

[paste your documentation]"
```

### Option 2: Use with Claude/ChatGPT (Manual)

```
1. Copy the contents of prompt_template.md
2. Attach your source document/content
3. Send to your LLM
4. Receive beautiful HTML visualisation
```

### Option 3: Use with Cursor/AI IDE

```
1. Open your documentation file
2. Reference this repo: @thought_bubble
3. Say: "Visualise this using thought_bubble"
4. AI generates custom HTML
```

## What Can You Visualise?

- System architectures
- Development plans
- API documentation
- Organisation charts
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

- **system_architecture.html** - Technical system integration visualisation
- **project_plan.html** - Development roadmap with milestones
- **org_structure.html** - Organisation hierarchy and teams

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
└── examples/                          # Example visualisations
```

## Usage Tips

### For Best Results:

1. **Provide structure** - The more organised your content, the better the output
2. **Specify preferences** - Tell the LLM which components/theme you want
3. **Include diagrams** - Mermaid diagrams render beautifully
4. **Define sections** - Clear section headers help create navigation
5. **Add metadata** - Status, dates, authors enhance the visualisation

### Example Prompt:

```
Using thought_bubble, create an interactive HTML visualisation of this content.

Theme: Professional
Include: Sidebar navigation, Mermaid diagrams, stat cards, timeline layout
Focus: Make complex relationships easy to understand

[Your content here]
```

## Customisation

The LLM can customise:
- Color schemes and themes
- Component selection
- Layout structure
- Navigation style
- Animation intensity
- Content organisation

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS, Android)

## MCP Server Tools

The thought_bubble MCP server exposes two powerful tools:

### 1. `analyse_content`
Analyses your documentation to identify:
- Workflows (processes, sequences, flows)
- Systems (architectures, components, services)
- Data Models (entities, schemas, objects)
- Relationships (connections, integrations)

### 2. `generate_visualisation`
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
