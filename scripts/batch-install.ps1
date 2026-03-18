# Batch installer for thought_bubble MCP across multiple workspaces
$ErrorActionPreference = "Continue"

$installer = "C:\Users\Fab2\Desktop\AI\_tools\_thought_bubble\thought_bubble_mcp\install-to-workspace.ps1"

# Folders starting with '_' in AI root
$underscoreFolders = @(
    "C:\Users\Fab2\Desktop\AI\_data",
    "C:\Users\Fab2\Desktop\AI\_img_Gen",
    "C:\Users\Fab2\Desktop\AI\_learn",
    "C:\Users\Fab2\Desktop\AI\_plasticFlower",
    "C:\Users\Fab2\Desktop\AI\_prompt",
    "C:\Users\Fab2\Desktop\AI\_Research",
    "C:\Users\Fab2\Desktop\AI\_SimGenesis",
    "C:\Users\Fab2\Desktop\AI\_timecop",
    "C:\Users\Fab2\Desktop\AI\_tools",
    "C:\Users\Fab2\Desktop\AI\_write"
)

# All folders in _tools (except current _thought_bubble)
$toolsFolders = @(
    "C:\Users\Fab2\Desktop\AI\_tools\Experiments",
    "C:\Users\Fab2\Desktop\AI\_tools\_bullship",
    "C:\Users\Fab2\Desktop\AI\_tools\_fckgit",
    "C:\Users\Fab2\Desktop\AI\_tools\_kanbanger",
    "C:\Users\Fab2\Desktop\AI\_tools\_metube"
)

$allWorkspaces = $underscoreFolders + $toolsFolders
$successCount = 0
$failCount = 0
$skippedCount = 0

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Thought Bubble MCP - Batch Installer" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Installing to $($allWorkspaces.Count) workspaces..." -ForegroundColor Yellow
Write-Host ""

foreach ($workspace in $allWorkspaces) {
    if (-not (Test-Path $workspace)) {
        Write-Host "[SKIP] $workspace (does not exist)" -ForegroundColor Yellow
        $skippedCount++
        continue
    }
    
    Write-Host "[INSTALLING] $workspace" -ForegroundColor Cyan
    Push-Location $workspace
    
    try {
        # Run installer with automatic 'y' response if config exists
        $output = & powershell -ExecutionPolicy Bypass -File $installer 2>&1
        
        if ($LASTEXITCODE -eq 0 -or $output -match "SUCCESS") {
            Write-Host "[SUCCESS] $workspace" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "[FAILED] $workspace" -ForegroundColor Red
            $failCount++
        }
    }
    catch {
        Write-Host "[ERROR] $workspace - $($_.Exception.Message)" -ForegroundColor Red
        $failCount++
    }
    finally {
        Pop-Location
    }
    
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installation Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Success: $successCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor Red
Write-Host "Skipped: $skippedCount" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  - Restart Cursor for each workspace you want to use" -ForegroundColor White
Write-Host "  - Or reload MCP from Settings > Tools & MCP" -ForegroundColor White
Write-Host ""
