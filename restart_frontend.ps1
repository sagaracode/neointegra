# Restart Frontend Script
Write-Host "🔄 Restarting Frontend Server..." -ForegroundColor Cyan

# Kill existing Node processes
Write-Host "Stopping existing servers..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Start frontend
Write-Host "`nStarting frontend on port 5173..." -ForegroundColor Green
Set-Location D:\WEBSITES\frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host "`n✅ Frontend server starting..." -ForegroundColor Green
Write-Host "`n⏳ Tunggu 5 detik..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Test connection
Write-Host "`nTesting connection..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -Method GET -TimeoutSec 5
    Write-Host "✅ SUCCESS! Website running at: http://localhost:5173" -ForegroundColor Green
    Start-Process "http://localhost:5173"
} catch {
    Write-Host "⚠️ Server masih starting up, coba buka manual:" -ForegroundColor Yellow
    Write-Host "   http://localhost:5173" -ForegroundColor Cyan
}
