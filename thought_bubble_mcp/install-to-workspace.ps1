# Thought Bubble MCP Server - Per-Workspace Installer
# This script creates a .cursor/mcp.json configuration in your workspace

param(
    [string]$WorkspacePath = (Get-Location).Path
)

$ErrorActionPreference = "Stop"

Write-Host "=== Thought Bubble MCP Server - Workspace Installer ===" -ForegroundColor Cyan
Write-Host ""

# Validate workspace path
if (-not (Test-Path $WorkspacePath)) {
    Write-Host "ERROR: Workspace path does not exist: $WorkspacePath" -ForegroundColor Red
    exit 1
}

Write-Host "Target Workspace: $WorkspacePath" -ForegroundColor Yellow

# Get the absolute path to this script's directory (the MCP server location)
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ServerPath = Join-Path $ScriptDir "dist\index.js"

# Check if server is built
if (-not (Test-Path $ServerPath)) {
    Write-Host ""
    Write-Host "WARNING: Server not built yet!" -ForegroundColor Yellow
    Write-Host "Building server now..." -ForegroundColor Yellow
    
    Push-Location $ScriptDir
    try {
        npm run build
        if ($LASTEXITCODE -ne 0) {
            throw "Build failed"
        }
    }
    finally {
        Pop-Location
    }
    
    if (-not (Test-Path $ServerPath)) {
        Write-Host "ERROR: Build failed - $ServerPath not found" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Build successful!" -ForegroundColor Green
}

# Create .cursor directory if it doesn't exist
$CursorDir = Join-Path $WorkspacePath ".cursor"
if (-not (Test-Path $CursorDir)) {
    Write-Host ""
    Write-Host "Creating .cursor directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $CursorDir -Force | Out-Null
}

# Create mcp.json configuration
$McpJsonPath = Join-Path $CursorDir "mcp.json"

# Convert Windows path to escaped JSON format
$ServerPathJson = $ServerPath.Replace('\', '\\')

$McpConfig = @"
{
  "mcpServers": {
    "thought-bubble": {
      "command": "node",
      "args": [
        "$ServerPathJson"
      ],
      "env": {
        "THOUGHT_BUBBLE_WORKSPACE": "`${workspaceFolder}",
        "NODE_ENV": "production"
      }
    }
  }
}
"@

# Check if mcp.json already exists
if (Test-Path $McpJsonPath) {
    Write-Host ""
    Write-Host "WARNING: $McpJsonPath already exists!" -ForegroundColor Yellow
    $response = Read-Host "Overwrite existing configuration? (y/N)"
    
    if ($response -ne 'y' -and $response -ne 'Y') {
        Write-Host "Installation cancelled." -ForegroundColor Yellow
        exit 0
    }
}

# Write the configuration
Write-Host ""
Write-Host "Creating MCP configuration..." -ForegroundColor Yellow
$McpConfig | Out-File -FilePath $McpJsonPath -Encoding UTF8 -NoNewline

# Verify the file was created
if (Test-Path $McpJsonPath) {
    Write-Host ""
    Write-Host "SUCCESS! Configuration created:" -ForegroundColor Green
    Write-Host "  $McpJsonPath" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Restart Cursor to load the new configuration" -ForegroundColor White
    Write-Host "  2. Check Tools & MCP settings in Cursor" -ForegroundColor White
    Write-Host "  3. Look for 'thought-bubble' in the MCP servers list" -ForegroundColor White
    Write-Host ""
    Write-Host "Configuration details:" -ForegroundColor Yellow
    Write-Host "  - Server: $ServerPath" -ForegroundColor White
    Write-Host "  - Workspace variable: `${workspaceFolder} (auto-resolves)" -ForegroundColor White
    Write-Host "  - Workspace: $WorkspacePath" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "ERROR: Failed to create configuration file" -ForegroundColor Red
    exit 1
}
