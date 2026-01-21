# MCP Configuration Guide: Per-Project Workspace Setup

## Overview

This guide explains how we configured the `thought_bubble` MCP server to work correctly with Cursor's per-project workspace setup using absolute paths in the MCP configuration file.

## The Challenge

MCP servers require absolute paths in their configuration because:
1. MCP runs as a separate process outside the IDE
2. The server needs to locate compiled JavaScript files at runtime
3. Relative paths would be ambiguous (relative to what?)

## Our Implementation

### Configuration Location

**File:** `C:\Users\Fab2\.cursor\mcp.json`

This is Cursor's global MCP configuration file where all MCP servers are registered.

### Thought Bubble Configuration

```json
{
  "mcpServers": {
    "thought-bubble": {
      "command": "node",
      "args": [
        "C:\\Users\\Fab2\\Desktop\\AI\\_tools\\_thought_bubble\\thought_bubble_mcp\\dist\\index.js"
      ]
    }
  }
}
```

### Key Implementation Details

1. **Absolute Path Used:**
   - Full path: `C:\Users\Fab2\Desktop\AI\_tools\_thought_bubble\thought_bubble_mcp\dist\index.js`
   - Points directly to the compiled JavaScript entry point
   - No ambiguity about project location

2. **Path Format (Windows):**
   - Uses double backslashes `\\` for JSON escaping
   - Standard Windows path convention
   - Alternative: Forward slashes `/` also work in Node.js on Windows

3. **Command Structure:**
   - `command`: `"node"` - Uses the globally installed Node.js runtime
   - `args`: Array containing the absolute path to the compiled MCP server

## How To Replicate This Setup

### For New Users Installing thought_bubble

1. **Clone or download the repository** to your desired location:
   ```bash
   git clone https://github.com/earlyprototype/thought_bubble.git
   # Or download and extract to: C:\your\preferred\path\thought_bubble
   ```

2. **Build the MCP server:**
   ```bash
   cd thought_bubble/thought_bubble_mcp
   npm install
   npm run build
   ```

3. **Get the absolute path:**
   ```bash
   # Windows PowerShell
   cd thought_bubble_mcp\dist
   Get-Location | Select-Object -ExpandProperty Path
   # This returns something like: C:\your\path\thought_bubble\thought_bubble_mcp\dist
   ```

4. **Update your MCP configuration:**
   - Open `C:\Users\[YourUsername]\.cursor\mcp.json` (create if it doesn't exist)
   - Add the thought-bubble server configuration:
   
   ```json
   {
     "mcpServers": {
       "thought-bubble": {
         "command": "node",
         "args": [
           "C:\\your\\path\\thought_bubble\\thought_bubble_mcp\\dist\\index.js"
         ]
       }
     }
   }
   ```

5. **Restart Cursor** for changes to take effect

### Path Format Examples

**Windows:**
```json
"args": ["C:\\Users\\Fab2\\Desktop\\AI\\_tools\\_thought_bubble\\thought_bubble_mcp\\dist\\index.js"]
```

**macOS/Linux:**
```json
"args": ["/Users/username/projects/thought_bubble/thought_bubble_mcp/dist/index.js"]
```

**Windows (forward slash alternative):**
```json
"args": ["C:/Users/Fab2/Desktop/AI/_tools/_thought_bubble/thought_bubble_mcp/dist/index.js"]
```

## Benefits of This Approach

1. **Reliability:** Server always knows where to find its files
2. **Portability:** Configuration works regardless of which project is open
3. **Simplicity:** No environment variables or complex path resolution needed
4. **Consistency:** Standard MCP configuration pattern

## Important Notes

### After Moving the Project

If you move the `thought_bubble` folder to a new location:

1. Rebuild the project (just to be safe):
   ```bash
   cd thought_bubble/thought_bubble_mcp
   npm run build
   ```

2. Update the path in `mcp.json` to reflect the new location

3. Restart Cursor

### Multiple Installations

You can have multiple versions of thought_bubble installed:

```json
{
  "mcpServers": {
    "thought-bubble-stable": {
      "command": "node",
      "args": ["C:\\projects\\thought_bubble_stable\\thought_bubble_mcp\\dist\\index.js"]
    },
    "thought-bubble-dev": {
      "command": "node",
      "args": ["C:\\dev\\thought_bubble\\thought_bubble_mcp\\dist\\index.js"]
    }
  }
}
```

Just ensure each server has a unique name in the configuration.

## Verification

To verify your MCP server is configured correctly:

1. Restart Cursor
2. Open any file in Cursor
3. Check the MCP status (usually in the bottom status bar or MCP panel)
4. You should see "thought-bubble" listed as an available MCP server
5. Test it by asking: "Use thought-bubble tools to show me what you can do"

## Troubleshooting

### Server Not Appearing

- Check the path is correct and points to `index.js` in the `dist` folder
- Ensure you ran `npm run build` in the `thought_bubble_mcp` directory
- Check for typos in the JSON (common: single `\` instead of `\\`)
- Restart Cursor after configuration changes

### Server Fails to Start

- Check Node.js is installed: `node --version` (requires v16+)
- Verify the dist folder exists and contains `index.js`
- Check Cursor's MCP logs for specific error messages

### Path Issues on Windows

If you see escape sequence errors, remember:
- JSON requires `\\` for backslashes
- Or use forward slashes: `C:/path/to/file`

## Our Specific Setup

**User:** Fab2  
**OS:** Windows 10/11  
**Project Location:** `C:\Users\Fab2\Desktop\AI\_tools\_thought_bubble`  
**MCP Config:** `C:\Users\Fab2\.cursor\mcp.json`  
**Entry Point:** `C:\Users\Fab2\Desktop\AI\_tools\_thought_bubble\thought_bubble_mcp\dist\index.js`

This configuration allows the MCP to work across all projects opened in Cursor, regardless of the current workspace folder, because the path is absolute and globally configured.

## Related Documentation

- [MCP Installation Guide](thought_bubble_mcp/START_HERE.md)
- [MCP Architecture](thought_bubble_mcp/ARCHITECTURE.md)
- [Project README](README.md)

---

**Last Updated:** January 2026  
**Configuration Version:** 1.0
