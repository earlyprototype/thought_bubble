# thought_bubble MCP Server

**Transform documentation into beautiful interactive HTML visualisations** using the Model Context Protocol.

This MCP server enables AI assistants (Claude, ChatGPT, Cursor) to analyse documentation and generate stunning, interactive HTML visualisations with Mermaid diagrams.

## Features

- **Automated Analysis**: Identifies systems, workflows, data models, and relationships in your content
- **AI-Powered**: Leverages LLMs for intelligent content analysis and diagram generation
- **Mermaid Integration**: Generates appropriate diagram types (flowcharts, sequence, class, ER, state, C4)
- **Professional Output**: Creates complete, self-contained HTML files with responsive design
- **Customisable**: Choose themes and navigation styles

## Installation

### From NPM (when published)

```bash
npm install -g @thought-bubble/mcp-server
```

### From Source

```bash
git clone <repository-url>
cd thought_bubble_mcp
npm install
npm run build
```

## Configuration

Add this to your MCP client configuration file:

### Claude Desktop / Cursor

Create or edit `~/.config/claude/claude_desktop_config.json` (macOS/Linux) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "thought-bubble": {
      "command": "npx",
      "args": ["-y", "@thought-bubble/mcp-server"]
    }
  }
}
```

### For Local Development

```json
{
  "mcpServers": {
    "thought-bubble": {
      "command": "node",
      "args": ["/absolute/path/to/thought_bubble_mcp/dist/index.js"]
    }
  }
}
```

## Usage

The server exposes two tools that work together:

### Tool 1: `analyze_content`

Analyses your documentation to identify visualisation opportunities.

**Input:**
```json
{
  "content": "Your documentation text here..."
}
```

**Output:**
A prompt for your LLM to analyse the content and identify:
- Workflows (processes, flows, sequences)
- Systems (architectures, services, components)
- Data Models (entities, objects, schemas)
- Relationships (connections, integrations)

### Tool 2: `generate_visualization`

Generates the final HTML visualisation with Mermaid diagrams.

**Input:**
```json
{
  "content": "Original documentation",
  "selectedSystems": [
    {
      "id": 1,
      "title": "User Authentication Flow",
      "description": "Login process with OAuth",
      "diagramType": "flowchart"
    },
    {
      "id": 3,
      "title": "Database Schema",
      "description": "User and Order tables",
      "diagramType": "er"
    }
  ],
  "theme": "professional",
  "navigationStyle": "sidebar"
}
```

**Output:**
Two-step prompts:
1. Generate Mermaid diagram code for selected systems
2. Generate complete HTML visualisation

## Workflow Example

Here's how to use the tools with an AI assistant:

**Step 1: Analyse Content**
```
User: Use the analyze_content tool with my API documentation
AI: [Calls tool, receives analysis prompt]
AI: [Sends prompt to LLM, receives identified systems]
AI: I found 5 systems:
    1. Authentication Flow
    2. Payment Processing
    3. User Schema
    ...
    Which would you like to visualise?
```

**Step 2: Generate Visualisation**
```
User: Let's visualise items 1, 2, and 3
AI: [Calls generate_visualization tool]
AI: [Receives Mermaid generation prompt]
AI: [Sends to LLM, gets Mermaid diagrams]
AI: [Receives final HTML generation prompt]
AI: [Sends to LLM, gets complete HTML]
AI: Here's your interactive visualisation! [Provides HTML file]
```

## Themes

- `professional` - Clean, corporate design
- `dark` - Dark mode with high contrast
- `technical` - Developer-focused styling
- `minimal` - Stripped-down, essential elements
- `creative` - Bold colours and modern design

## Navigation Styles

- `sidebar` - Fixed sidebar navigation (recommended for 5+ sections)
- `tabs` - Tab-based navigation
- `minimal` - Simple anchor navigation

## Diagram Types

| Type | Best For |
|------|----------|
| `flowchart` | Processes, workflows, decision trees |
| `sequence` | API calls, interactions, message flows |
| `class` | Object models, data structures |
| `er` | Database schemas, entity relationships |
| `state` | State machines, status transitions |
| `c4` | System architecture, component diagrams |

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Watch mode for development
npm run watch

# Test locally
node dist/index.js
```

## Project Structure

```
thought_bubble_mcp/
├── src/
│   ├── index.ts              # Main MCP server
│   ├── tools/
│   │   ├── analyze_content.ts       # Tool 1: Content analysis
│   │   └── generate_visualization.ts # Tool 2: HTML generation
│   ├── prompts/
│   │   └── templates.ts      # Prompt templates
│   └── types.ts              # TypeScript interfaces
├── package.json
├── tsconfig.json
└── README.md
```

## Troubleshooting

### Server not appearing in AI client

1. Check the configuration file path is correct
2. Restart your AI client application
3. Check logs: `tail -f ~/Library/Logs/Claude/mcp*.log` (macOS)

### Tool calls failing

1. Ensure you've run `npm run build`
2. Check the command path in your config
3. Try running manually: `node dist/index.js`

### Mermaid diagrams not rendering

The generated HTML includes Mermaid via CDN. Ensure:
1. Internet connection for first load
2. Browser JavaScript is enabled
3. No CSP restrictions blocking CDN

## Contributing

Contributions welcome! Please ensure:
- TypeScript types are correct
- Code follows existing patterns
- README is updated for new features

## Licence

MIT

## Related Projects

- [thought_bubble](https://github.com/your-org/thought_bubble) - Core visualisation framework
- [Model Context Protocol](https://modelcontextprotocol.io) - MCP specification
- [Mermaid](https://mermaid.js.org) - Diagram rendering

---

**Make your documentation unforgettable with thought_bubble MCP Server**
