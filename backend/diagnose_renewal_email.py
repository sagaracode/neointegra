import requests
import json

API_URL = "https://api.neointegratech.com/api"

print("=== Testing Email Notification in Production ===")
print()
print("Issue: User tidak menerima email setelah klik perpanjangan")
print()

# Try different test scenarios
print("📋 Diagnosis:")
print()

# 1. Check if backend is accessible
try:
    health = requests.get("https://api.neointegratech.com/docs")
    print(f"✅ Backend is accessible (status {health.status_code})")
except Exception as e:
    print(f"❌ Backend not accessible: {e}")
    exit(1)

# 2. Check environment variables issue
print()
print("🔍 Possible Root Causes:")
print()
print("1. Environment Variables belum di-set di Coolify Backend:")
print("   MAIL_SERVER=smtp.hostinger.com")
print("   MAIL_PORT=587")
print("   MAIL_USERNAME=hello@neointegratech.com")
print("   MAIL_PASSWORD=CimoksagaraL9#")
print("   MAIL_FROM=hello@neointegratech.com")
print()
print("2. Backend belum di-redeploy setelah update kode")
print()
print("3. Email sending function tidak dipanggil saat renewal")
print()
print("=" * 60)
print("RECOMMENDATION:")
print("=" * 60)
print()
print("1. ✅ Set MAIL_* environment variables di Coolify backend")
print("2. ✅ Redeploy backend service")
print("3. ✅ Check backend logs untuk error email sending")
print("4. ✅ Test forgot password untuk verifikasi SMTP working")
print()
print("Untuk test email configuration, jalankan:")
print("  python test_production_forgot_password.py")
print()
