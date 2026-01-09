# Quick Start Guide

Get your thought_bubble MCP server running in 5 minutes.

## Step 1: Build the Server

```bash
cd thought_bubble_mcp
npm install
npm run build
```

## Step 2: Configure Your AI Client

### For Claude Desktop

Edit `~/.config/claude/claude_desktop_config.json` (macOS/Linux) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "thought-bubble": {
      "command": "node",
      "args": ["C:/Users/Fab2/Desktop/AI/_tools/_thought_bubble/thought_bubble_mcp/dist/index.js"]
    }
  }
}
```

**Important**: Use the **absolute path** to `dist/index.js`

### For Cursor

Create or edit `.cursor/mcp.json` in your workspace:

```json
{
  "mcpServers": {
    "thought-bubble": {
      "command": "node",
      "args": ["C:/Users/Fab2/Desktop/AI/_tools/_thought_bubble/thought_bubble_mcp/dist/index.js"]
    }
  }
}
```

## Step 3: Restart Your AI Client

- **Claude Desktop**: Quit and restart the application
- **Cursor**: Restart the IDE

## Step 4: Test It

Open a conversation with your AI assistant and try:

```
Can you use the thought-bubble tools to analyze this content?

# E-commerce Platform

Our platform has three main components:

1. User Service - Handles authentication and user profiles
2. Order Service - Manages shopping cart and orders
3. Payment Service - Processes payments via Stripe

The user registration flow:
1. User submits email and password
2. System validates credentials
3. Sends verification email
4. User clicks link to activate account
```

## Expected Workflow

1. **AI calls `analyze_content`** with your content
2. **AI receives analysis prompt** and sends it to the LLM
3. **LLM identifies systems** (e.g., "1. User Registration Flow", "2. Microservices Architecture")
4. **AI asks you** which systems to visualise
5. **You respond** "1 and 2" or similar
6. **AI calls `generate_visualization`** with your selections
7. **AI generates Mermaid diagrams** for selected systems
8. **AI generates final HTML** with embedded diagrams
9. **You receive** a beautiful, interactive HTML file

## Troubleshooting

### "Tool not found"

- Check the absolute path in your config file
- Ensure you ran `npm run build`
- Restart your AI client

### "Command not found"

- Verify Node.js is installed: `node --version` (need v18+)
- Use absolute path to node if needed: `C:/Program Files/nodejs/node.exe`

### Check Server Logs

**Claude Desktop**:
```bash
# macOS
tail -f ~/Library/Logs/Claude/mcp*.log

# Windows (PowerShell)
Get-Content "$env:APPDATA\Claude\logs\mcp*.log" -Wait
```

**Cursor**: Check the Output panel → MCP Servers

## Next Steps

- Try different themes: `professional`, `dark`, `technical`
- Experiment with diagram types: `flowchart`, `sequence`, `class`, `er`
- Customize navigation: `sidebar`, `tabs`, `minimal`

## Example Commands

```
"Analyze this API documentation and create a visualization with dark theme"

"Create a flowchart for the authentication process and an ER diagram for the database"

"Generate a visualization with sidebar navigation and professional theme"
```

---

**Enjoy creating beautiful visualisations!**
