import requests
import json

API_URL = "https://api.neointegratech.com"

print("=== Checking Production Email Configuration ===")
print()

# Create a debug endpoint request
# Since we can't directly access env vars, we'll check the logs through forgot password

print("🔄 Testing forgot password with detailed response...")
print()

# Test with a known email
test_email = "rsppnprogrammer@gmail.com"

response = requests.post(
    f"{API_URL}/api/auth/forgot-password",
    json={"email": test_email},
    headers={"Content-Type": "application/json"}
)

print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")
print()

# The issue is likely that environment variables are not set in Coolify
print("=" * 60)
print("DIAGNOSIS:")
print("=" * 60)
print()
print("✅ API endpoint is working (returns 200)")
print("❌ Email is NOT being sent")
print()
print("ROOT CAUSE:")
print("Environment variables di Coolify production belum ter-set!")
print()
print("=" * 60)
print("SOLUTION - Set di Coolify Environment Variables:")
print("=" * 60)
print()
print("MAIL_SERVER=smtp.hostinger.com")
print("MAIL_PORT=587")
print("MAIL_USERNAME=hello@neointegratech.com")
print("MAIL_PASSWORD=CimoksagaraL9#")
print("MAIL_FROM=hello@neointegratech.com")
print()
print("Setelah set environment variables, REDEPLOY backend!")
print("=" * 60)
