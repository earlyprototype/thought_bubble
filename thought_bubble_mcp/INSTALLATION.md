# Thought Bubble MCP Server - Installation Guide

## Prerequisites

- Node.js 18.0.0 or higher
- Cursor IDE
- Basic understanding of MCP (Model Context Protocol)

## Quick Installation

### Option 1: Automated Installer (Recommended)

Run this in your workspace directory:

```powershell
cd C:\path\to\your\workspace
powershell -ExecutionPolicy Bypass -File C:\Users\Fab2\Desktop\AI\_tools\_thought_bubble\thought_bubble_mcp\install-to-workspace.ps1
```

The installer will:
1. Build the server if needed
2. Create `.cursor/mcp.json` with proper configuration
3. Set up the `${workspaceFolder}` variable automatically

### Option 2: Manual Installation

1. **Build the server** (if not already built):

```powershell
cd C:\Users\Fab2\Desktop\AI\_tools\_thought_bubble\thought_bubble_mcp
npm install
npm run build
```

2. **Create `.cursor` directory** in your workspace:

```powershell
cd C:\path\to\your\workspace
mkdir .cursor
```

3. **Copy the template**:

```powershell
cp C:\Users\Fab2\Desktop\AI\_tools\_thought_bubble\thought_bubble_mcp\mcp.json.template .cursor\mcp.json
```

4. **Verify the paths** in `.cursor/mcp.json` are correct for your system.

## Configuration

### Workspace-Specific Configuration

The `.cursor/mcp.json` file uses the `${workspaceFolder}` variable which automatically resolves to your current workspace path:

```json
{
  "mcpServers": {
    "thought-bubble": {
      "command": "node",
      "args": [
        "C:\\Users\\Fab2\\Desktop\\AI\\_tools\\_thought_bubble\\thought_bubble_mcp\\dist\\index.js"
      ],
      "env": {
        "THOUGHT_BUBBLE_WORKSPACE": "${workspaceFolder}",
        "NODE_ENV": "production"
      }
    }
  }
}
```

### Environment Variables

- `THOUGHT_BUBBLE_WORKSPACE`: Automatically set to your workspace root via `${workspaceFolder}`
- `NODE_ENV`: Set to `production` or `development`

## Verification

1. **Restart Cursor** after creating the configuration
2. **Open Cursor Settings** > Tools & MCP
3. **Check for `thought-bubble`** in the MCP servers list
4. **View server logs** in the MCP settings to verify it started correctly

Expected log output:
```
thought_bubble MCP Server running on stdio
Workspace: C:\path\to\your\workspace
Workspace configured via env: true
Environment: production
```

## Multi-Workspace Setup

You can use the same installer for multiple workspaces. Each workspace will get its own independent configuration:

```powershell
# Workspace A
cd C:\Projects\WebApp
powershell -ExecutionPolicy Bypass -File C:\Users\Fab2\Desktop\AI\_tools\_thought_bubble\thought_bubble_mcp\install-to-workspace.ps1

# Workspace B
cd C:\Projects\API
powershell -ExecutionPolicy Bypass -File C:\Users\Fab2\Desktop\AI\_tools\_thought_bubble\thought_bubble_mcp\install-to-workspace.ps1
```

Each workspace will automatically track its own path via `${workspaceFolder}`.

## Troubleshooting

### Server Not Appearing in Cursor

**Cause:** Configuration not loaded or syntax error

**Solution:**
1. Check `.cursor/mcp.json` for JSON syntax errors
2. Verify file paths are absolute and use escaped backslashes: `C:\\path\\to\\file`
3. Restart Cursor completely

### Server Fails to Start

**Cause:** Server not built or Node.js not found

**Solution:**
1. Run `npm run build` in the `thought_bubble_mcp` directory
2. Verify `dist/index.js` exists
3. Check Node.js is installed: `node --version`

### Wrong Workspace Path

**Cause:** Using global config instead of local

**Solution:**
1. Ensure `.cursor/mcp.json` exists in your workspace root
2. Local configs override global configs
3. Verify `${workspaceFolder}` is used, not a hardcoded path

### Permission Errors

**Cause:** PowerShell execution policy

**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Updating

When updating the server:

1. Pull latest changes
2. Rebuild:
```powershell
cd C:\Users\Fab2\Desktop\AI\_tools\_thought_bubble\thought_bubble_mcp
npm install
npm run build
```
3. Restart Cursor

Your workspace configurations don't need to change unless the server path changes.

## Uninstallation

To remove thought-bubble from a workspace:

1. Delete `.cursor/mcp.json` or remove the `thought-bubble` entry
2. Restart Cursor

## Best Practices

- **Use local configs** (`.cursor/mcp.json`) for all workspace-specific servers
- **Use `${workspaceFolder}`** instead of hardcoded paths
- **Commit `.cursor/mcp.json`** to your project repository (if team uses same setup)
- **Keep one template** and copy it to new workspaces as needed

## Support

For issues or questions:
1. Check the server logs in Cursor's Tools & MCP settings
2. Review `CURSOR_WORKSPACE_VARIABLES.md` for detailed variable documentation
3. Check the project README for usage examples
