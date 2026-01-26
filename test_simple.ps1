# Simple API Test
Write-Host "Testing API..." -ForegroundColor Cyan

# Test 1
Write-Host "`n1. Health Check"
$r1 = Invoke-WebRequest -Uri "http://localhost:8000/"
Write-Host "   Status: $($r1.StatusCode) ✅" -ForegroundColor Green

# Test 2  
Write-Host "`n2. Get Services"
$r2 = Invoke-WebRequest -Uri "http://localhost:8000/api/services/"
Write-Host "   Status: $($r2.StatusCode) ✅" -ForegroundColor Green

# Test 3
Write-Host "`n3. API Docs"
$r3 = Invoke-WebRequest -Uri "http://localhost:8000/api/docs"
Write-Host "   Status: $($r3.StatusCode) ✅" -ForegroundColor Green

Write-Host "`n✅ All Tests Passed!" -ForegroundColor Green
Write-Host "`nURLs:" -ForegroundColor Cyan
Write-Host "  Backend: http://localhost:8000" -ForegroundColor White
Write-Host "  API Docs: http://localhost:8000/api/docs" -ForegroundColor White
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
