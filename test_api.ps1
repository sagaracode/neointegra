# API Testing Script
# Test all backend endpoints

Write-Host "🧪 Testing NeoIntegraTech API..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8000"
$apiUrl = "$baseUrl/api"

# Test 1: Health Check
Write-Host "1. Testing Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/" -Method GET
    $data = $response.Content | ConvertFrom-Json
    Write-Host "   ✅ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   📦 Response: $($data.app)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Get Services
Write-Host "2. Testing GET /api/services/..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$apiUrl/services/" -Method GET
    $services = $response.Content | ConvertFrom-Json
    Write-Host "   ✅ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   📦 Services Count: $($services.Count)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: API Documentation
Write-Host "3. Testing API Docs..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$apiUrl/docs" -Method GET
    Write-Host "   ✅ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   📚 Swagger UI Available" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Register (Should fail without data - expected)
Write-Host "4. Testing POST /api/auth/register (without data)..." -ForegroundColor Yellow
try {
    $headers = @{ "Content-Type" = "application/json" }
    $body = "{}"
    $response = Invoke-WebRequest -Uri "$apiUrl/auth/register" -Method POST -Headers $headers -Body $body
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Yellow
} catch {
    if ($_.Exception.Response.StatusCode -eq 422) {
        Write-Host "   ✅ Expected validation error (422)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Unexpected Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# Test 5: Login (Should fail without data - expected)
Write-Host "5. Testing POST /api/auth/login (without data)..." -ForegroundColor Yellow
try {
    $headers = @{ "Content-Type" = "application/json" }
    $body = "{}"
    $response = Invoke-WebRequest -Uri "$apiUrl/auth/login" -Method POST -Headers $headers -Body $body
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Yellow
} catch {
    if ($_.Exception.Response.StatusCode -eq 422) {
        Write-Host "   ✅ Expected validation error (422)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Unexpected Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# Test 6: Get User Profile (Should fail - no auth)
Write-Host "6. Testing GET /api/users/me (without auth)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$apiUrl/users/me" -Method GET
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Yellow
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "   ✅ Expected unauthorized error (401)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Unexpected Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

Write-Host "✅ API Testing Complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "   - Backend is running on: http://localhost:8000" -ForegroundColor White
Write-Host "   - API Documentation: http://localhost:8000/api/docs" -ForegroundColor White
Write-Host "   - Frontend is running on: http://localhost:3000" -ForegroundColor White
