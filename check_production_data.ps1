# QUERY CURRENT PRODUCTION DATABASE STATUS
# Script ini untuk check status database production via API

Write-Host "`n=========================================="
Write-Host "CHECK PRODUCTION DATABASE STATUS"
Write-Host "==========================================`n"

# Ask for token
Write-Host "📝 Cara mendapatkan token:"
Write-Host "1. Login ke https://neointegratech.com"
Write-Host "2. Buka browser DevTools (F12)"
Write-Host "3. Ke tab Console"
Write-Host "4. Ketik: localStorage.getItem('access_token')"
Write-Host "5. Copy token yang muncul (tanpa tanda kutip)`n"

$token = Read-Host "🔑 Masukkan access token"

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host "❌ Token tidak boleh kosong!" -ForegroundColor Red
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$baseUrl = "https://api.neointegratech.com/api"

Write-Host "`nQuerying production API...`n"

# Check health
Write-Host "1️⃣ Health Check:" -ForegroundColor Cyan
try {
    $health = Invoke-RestMethod -Uri "https://api.neointegratech.com/health" -Method Get -TimeoutSec 10
    Write-Host "   ✅ Backend is UP" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Backend is DOWN or not responding" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
}

Write-Host "`n2️⃣ Database Statistics:" -ForegroundColor Cyan

# Get users count
try {
    $profile = Invoke-RestMethod -Uri "$baseUrl/users/profile" -Method Get -Headers $headers -TimeoutSec 10
    Write-Host "   ✅ User Profile: $($profile.full_name) ($($profile.email))" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Cannot fetch user profile" -ForegroundColor Red
}

# Get orders
try {
    $orders = Invoke-RestMethod -Uri "$baseUrl/orders/" -Method Get -Headers $headers -TimeoutSec 10
    Write-Host "   📦 Total Orders: $($orders.Count)" -ForegroundColor Yellow
    
    $pending = $orders | Where-Object { $_.status -eq "pending" }
    $paid = $orders | Where-Object { $_.status -eq "paid" }
    
    Write-Host "      - Pending: $($pending.Count)" -ForegroundColor Yellow
    Write-Host "      - Paid: $($paid.Count)" -ForegroundColor Green
    
    if ($orders.Count -gt 0) {
        Write-Host "`n   Recent Orders:" -ForegroundColor Cyan
        $orders | Select-Object -First 5 | ForEach-Object {
            Write-Host "      - #$($_.order_number): $($_.service_name) - $($_.status) - Rp $($_.total_amount)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "   ❌ Cannot fetch orders: $_" -ForegroundColor Red
}

# Get payments
Write-Host "`n3️⃣ Payment Status:" -ForegroundColor Cyan
try {
    # Get all orders then check their payments
    $allOrders = Invoke-RestMethod -Uri "$baseUrl/orders/" -Method Get -Headers $headers -TimeoutSec 10
    
    $paymentStats = @{
        pending = 0
        success = 0
        failed = 0
    }
    
    foreach ($order in $allOrders) {
        try {
            $payments = Invoke-RestMethod -Uri "$baseUrl/payments/order/$($order.id)" -Method Get -Headers $headers -TimeoutSec 5
            if ($payments) {
                $payment = if ($payments -is [Array]) { $payments[0] } else { $payments }
                $paymentStats[$payment.status]++
            }
        } catch {
            # Skip if no payment
        }
    }
    
    Write-Host "   💳 Total Payments: $($paymentStats.pending + $paymentStats.success + $paymentStats.failed)" -ForegroundColor Yellow
    Write-Host "      - Pending: $($paymentStats.pending)" -ForegroundColor Yellow
    Write-Host "      - Success: $($paymentStats.success)" -ForegroundColor Green
    Write-Host "      - Failed: $($paymentStats.failed)" -ForegroundColor Red
    
} catch {
    Write-Host "   ❌ Cannot fetch payments: $_" -ForegroundColor Red
}

Write-Host "`n=========================================="
Write-Host "STATUS CHECK COMPLETED"
Write-Host "==========================================`n"

Write-Host "⚠️  IMPORTANT:" -ForegroundColor Yellow
Write-Host "   Database ini akan HILANG jika redeploy tanpa persistent volume!"
Write-Host "   Segera setup volume di Coolify (lihat COOLIFY_SETUP.md)`n"
