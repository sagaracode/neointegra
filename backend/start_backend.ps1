# Start Backend Script
Write-Host "Starting NeoIntegraTech Backend..." -ForegroundColor Green

# Set working directory
Set-Location D:\WEBSITES\backend

# Activate virtual environment
& .\venv_fixed\Scripts\Activate.ps1

# Set Python path
$env:PYTHONPATH = "D:\WEBSITES\backend"

# Start uvicorn
Write-Host "Backend will be available at: http://localhost:8000" -ForegroundColor Cyan
Write-Host "API Documentation: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

uvicorn app.main:app --reload --port 8000 --host 0.0.0.0
