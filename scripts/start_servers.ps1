# MunLink Zambales - Start Servers
Write-Host "Starting MunLink Zambales Project..." -ForegroundColor Green

# Get the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Backend API
Write-Host "Starting Backend API..." -ForegroundColor Yellow
$backendPath = Join-Path $scriptDir "apps\api"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; python app.py"

# Wait a moment
Start-Sleep -Seconds 2

# Start Frontend Web
Write-Host "Starting Frontend Web..." -ForegroundColor Yellow
$frontendPath = Join-Path $scriptDir "apps\web"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev"

# Wait a moment
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   Servers Started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend API:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend Web: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Opening application in browser..." -ForegroundColor Yellow

# Open browser
Start-Process "http://localhost:3000"

Write-Host "Done! Check the opened terminal windows for server logs." -ForegroundColor Green
