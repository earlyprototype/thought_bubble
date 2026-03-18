#Requires -RunAsAdministrator
# fix-hns.ps1 -- Recovery script for Windows HNS memory leak
# Run this from an elevated PowerShell prompt when Cursor freezes
# due to HNS (Host Network Service) consuming excessive memory.

Write-Host "Stopping WSL..."
wsl --shutdown
Start-Sleep -Seconds 3

Write-Host "Stopping HNS service..."
Stop-Service hns -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

Write-Host "Restarting HNS service..."
Start-Service hns

Write-Host ""
Write-Host "Done. HNS memory should be released."
Write-Host "Restart Cursor IDE manually."
