# Per-Workspace MCP Configuration Guide

## Why Per-Workspace Configuration?

Some MCP servers (like Timepon and fckgit) need to know which workspace they're operating in. Cursor doesn't automatically pass this information, so you need to configure it per-workspace.

## Quick Setup

### Method 1: Use the Installer (Recommended)

```powershell
cd C:\path\to\your\workspace
powershell -ExecutionPolicy Bypass -File C:\Users\Fab2\Desktop\AI\_timecop\mcp-server\install-to-workspace.ps1
```

### Method 2: Manual Configuration

1. Create `.cursor` folder in your workspace root
2. Copy `mcp-server/mcp.json.template` to `.cursor/mcp.json`
3. Done! The `${workspaceFolder}` variable auto-detects your workspace

## Cursor Configuration Variables

Use these in your `.cursor/mcp.json`:

| Variable | Description | Example |
|----------|-------------|---------|
| `${workspaceFolder}` | Full path to workspace root | `C:\Users\Fab2\Desktop\AI\MyProject` |
| `${workspaceFolderBasename}` | Workspace folder name only | `MyProject` |
| `${env:VAR_NAME}` | Reference system environment variables | `${env:HOME}` |

## Example Workspace Configuration

**File: `.cursor/mcp.json`**

```json
{
  "mcpServers": {
    "timepon": {
      "command": "node",
      "args": ["C:\\Users\\Fab2\\Desktop\\AI\\_timecop\\mcp-server\\index.js"],
      "env": {
        "TIMEPON_WORKSPACE": "${workspaceFolder}"
      }
    }
  }
}
```

## How It Works

1. **Global config** (`~/.cursor/mcp.json`) - applies to all workspaces
2. **Local config** (`.cursor/mcp.json` in workspace) - overrides global for that workspace
3. Variables like `${workspaceFolder}` are resolved when Cursor loads the workspace

## Fixing fckgit

If your fckgit isn't working, create `.cursor/mcp.json` in each project:

```json
{
  "mcpServers": {
    "fckgit": {
      "command": "python",
      "args": ["-m", "mcp_server"],
      "cwd": "C:\\Users\\Fab2\\Desktop\\AI\\_tools\\_fckgit",
      "env": {
        "GEMINI_API_KEY": "${env:GEMINI_API_KEY}",
        "WORKSPACE_ROOT": "${workspaceFolder}"
      }
    }
  }
}
```

Note: Set your `GEMINI_API_KEY` as a system environment variable, or reference it from your global config.

Check if fckgit supports a workspace env var in its documentation.

## Troubleshooting

### MCP Configuration Errors
- JSON doesn't support comments - keep config files clean
- Check for trailing commas
- Validate JSON syntax at jsonlint.com

### Server Not Starting
1. Check Cursor's Tools & MCP settings for errors
2. Verify `node_modules` are installed for Node.js servers
3. Check file paths are absolute and correct
4. Restart Cursor after config changes

### Multiple Workspaces
Each workspace needs its own `.cursor/mcp.json`. The installer handles this automatically.
