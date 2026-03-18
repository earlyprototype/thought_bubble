# thought_bubble MCP Server

**Transform documentation into beautiful interactive HTML visualisations** using the Model Context Protocol.

This MCP server enables AI assistants (Claude, ChatGPT, Cursor) to analyse documentation and generate stunning, self-contained HTML visualisations with server-side rendered Mermaid diagrams and D3 charts.

## Features

- **Server-Side SVG Rendering**: Uses beautiful-mermaid for Mermaid diagrams and D3 for charts
- **12 Curated Themes**: 7 new stunning themes (Tokyo Night, Dracula, Gruvbox, Solarized, GitHub) + 5 original themes
- **Self-Contained Output**: No CDN dependencies - works completely offline
- **Live Theme Switching**: Users can switch themes in the browser without regenerating
- **D3 Chart Support**: Bar, pie, donut, line, area, gantt, timeline, and quadrant charts
- **AI-Powered Analysis**: Identifies systems, workflows, data models, and relationships
- **Responsive Design**: Mobile-first, works on all screen sizes

## What's New in v0.2.0

- **beautiful-mermaid integration** - Server-side SVG rendering with stunning aesthetics
- **D3 charts** - Bar, pie, line, gantt, and more
- **12 themes** - Tokyo Night (default), Dracula, Gruvbox, Solarized Dark/Light, GitHub Dark/Light, plus 5 original themes
- **No CDN required** - Fully self-contained HTML output
- **Live theme switching** - Built-in theme picker in generated HTML

## Installation

See **[INSTALLATION.md](./INSTALLATION.md)** for complete setup instructions.

### Quick Start

**Automated Installer (Recommended for Cursor):**

```powershell
cd C:\path\to\your\workspace
powershell -ExecutionPolicy Bypass -File C:\Users\Fab2\Desktop\AI\_tools\_thought_bubble\thought_bubble_mcp\install-to-workspace.ps1
```

**Manual Build:**

```bash
git clone <repository-url>
cd thought_bubble_mcp
npm install
npm run build
```

## Configuration

### Per-Workspace Configuration (Recommended)

Create `.cursor/mcp.json` in your workspace root:

```json
{
  "mcpServers": {
    "thought-bubble": {
      "command": "node",
      "args": [
        "C:\\path\\to\\thought_bubble_mcp\\dist\\index.js"
      ],
      "env": {
        "THOUGHT_BUBBLE_WORKSPACE": "${workspaceFolder}",
        "NODE_ENV": "production"
      }
    }
  }
}
```

## Usage

The server exposes four tools:

### Tool 1: `analyze_content`

Analyses your documentation to identify visualisation opportunities.

```json
{
  "content": "Your documentation text here..."
}
```

### Tool 2: `generate_visualization`

Generates complete HTML with server-side rendered SVG diagrams.

```json
{
  "content": "Original documentation",
  "selectedSystems": [
    {
      "id": 1,
      "title": "User Authentication Flow",
      "description": "Login process with OAuth",
      "diagramType": "flowchart",
      "mermaidCode": "graph TD\n  A[Start] --> B{Auth?}\n  B -->|Yes| C[Dashboard]\n  B -->|No| D[Login]"
    },
    {
      "id": 2,
      "title": "Project Progress",
      "description": "Progress by phase",
      "diagramType": "bar",
      "chartData": [
        {"label": "Planning", "value": 100},
        {"label": "Design", "value": 85},
        {"label": "Development", "value": 60}
      ]
    }
  ],
  "theme": "tokyo_night",
  "navigationStyle": "sidebar",
  "enableThemeSwitcher": true
}
```

### Tool 3: `generate_mermaid_prompt`

Generates a prompt for the LLM to create Mermaid diagram code.

### Tool 4: `list_themes`

Lists all 12 available themes with their details.

## Themes

### New Themes (7)
| Theme | Mode | Description |
|-------|------|-------------|
| `tokyo_night` | Dark | Popular VSCode theme, purple/blue |
| `dracula` | Dark | Vibrant purple, pink, cyan |
| `gruvbox` | Dark | Retro warm tones |
| `solarized_dark` | Dark | Academic precision colours |
| `solarized_light` | Light | Clean, print-friendly |
| `github_light` | Light | Familiar, clean |
| `github_dark` | Dark | Modern GitHub dark |

### Original Themes (5)
| Theme | Mode | Description |
|-------|------|-------------|
| `professional` | Light | Corporate blue/slate |
| `dark` | Dark | Generic dark mode |
| `technical` | Dark | Cyan/green terminal style |
| `minimal` | Light | Black/white minimalist |
| `creative` | Light | Purple gradients |

See **[THEMES.md](./THEMES.md)** for detailed theme documentation.

## Diagram Types

### Mermaid Diagrams (beautiful-mermaid)
| Type | Best For |
|------|----------|
| `flowchart` | Processes, workflows, decision trees |
| `sequence` | API calls, interactions, message flows |
| `class` | Object models, data structures |
| `er` | Database schemas, entity relationships |
| `state` | State machines, status transitions |
| `c4` | System architecture, component diagrams |

### D3 Charts
| Type | Best For |
|------|----------|
| `bar` | Categorical comparisons |
| `pie` / `donut` | Part-to-whole relationships |
| `line` / `area` | Trends over time |
| `gantt` | Project timelines, schedules |
| `timeline` | Chronological events |
| `quadrant` | Priority matrices, positioning |

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Watch mode for development
npm run watch

# Run proof of concept
node dist/renderers/proof_of_concept.js
```

## Project Structure

```
thought_bubble_mcp/
├── src/
│   ├── index.ts                    # Main MCP server
│   ├── tools/
│   │   ├── analyze_content.ts      # Content analysis
│   │   └── generate_visualization.ts # HTML generation
│   ├── renderers/
│   │   ├── mermaid_renderer.ts     # beautiful-mermaid wrapper
│   │   └── d3_renderer.ts          # D3 chart rendering
│   ├── builders/
│   │   └── html_builder.ts         # HTML generation
│   ├── themes/
│   │   ├── types.ts                # Theme interfaces
│   │   ├── definitions.ts          # 12 theme definitions
│   │   └── index.ts                # Theme exports
│   └── prompts/
│       └── templates.ts            # LLM prompt templates
├── package.json
├── tsconfig.json
├── THEMES.md                       # Theme documentation
└── README.md
```

## Troubleshooting

### Server not appearing in AI client

1. Check the configuration file path is correct
2. Restart your AI client application
3. Check logs for errors

### Tool calls failing

1. Ensure you've run `npm run build`
2. Check the command path in your config
3. Try running manually: `node dist/index.js`

### Diagrams not rendering correctly

1. For Mermaid: ensure `mermaidCode` is valid Mermaid syntax
2. For D3 charts: ensure `chartData` is an array of objects with correct properties
3. Check console for error messages

## Migration from v0.1.x

1. **Default theme changed**: From `professional` to `tokyo_night`
2. **New tools available**: `generate_mermaid_prompt`, `list_themes`
3. **Input format updated**: `mermaidCode` is now optional (for Mermaid types) and `chartData` added (for D3 types)
4. **Theme switcher**: Now included by default (disable with `enableThemeSwitcher: false`)

## Contributing

Contributions welcome! Please ensure:
- TypeScript types are correct
- Code follows existing patterns
- README is updated for new features
- Themes meet WCAG AA contrast requirements

## Licence

MIT

## Related Projects

- [thought_bubble](https://github.com/your-org/thought_bubble) - Core visualisation framework
- [Model Context Protocol](https://modelcontextprotocol.io) - MCP specification
- [beautiful-mermaid](https://github.com/lukilabs/beautiful-mermaid) - Server-side Mermaid rendering
- [D3.js](https://d3js.org) - Data visualisation library

---

**Make your documentation unforgettable with thought_bubble MCP Server**
