# MunLink Zambales - Start Project Script
Write-Host "========================================" -ForegroundColor Green
Write-Host "   MunLink Zambales - Starting Project" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Starting Backend API Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps\api; python app.py"

Start-Sleep -Seconds 3

Write-Host "Starting Frontend Web Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps\web; npm run dev"

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   Servers Starting..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend API:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend Web: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Opening application in browser..." -ForegroundColor Yellow

Start-Sleep -Seconds 2
Start-Process "http://localhost:3000"
