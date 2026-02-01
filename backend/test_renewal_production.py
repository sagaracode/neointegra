import requests
import json

API_URL = "https://api.neointegratech.com/api"

print("=== Testing Renewal Flow in Production ===")
print()

# Login as web@rsppn.co.id
print("🔄 Step 1: Login as web@rsppn.co.id")
login_response = requests.post(
    f"{API_URL}/auth/login",
    json={
        "email": "web@rsppn.co.id",
        "password": "rsppn178#"
    }
)

if login_response.status_code != 200:
    print(f"❌ Login failed: {login_response.status_code}")
    print(login_response.text)
    exit(1)

token = login_response.json()["access_token"]
print(f"✅ Login successful, token: {token[:20]}...")
print()

# Get user subscriptions
print("🔄 Step 2: Get active subscriptions")
headers = {"Authorization": f"Bearer {token}"}
subs_response = requests.get(f"{API_URL}/subscriptions/my-subscriptions", headers=headers)

if subs_response.status_code != 200:
    print(f"❌ Failed to get subscriptions: {subs_response.status_code}")
    print(subs_response.text)
    exit(1)

subscriptions = subs_response.json()
print(f"✅ Found {len(subscriptions)} subscription(s)")
if subscriptions:
    sub = subscriptions[0]
    print(f"   Subscription ID: {sub['id']}")
    print(f"   Service: {sub['service_name']}")
    print(f"   Status: {sub['status']}")
    print(f"   End Date: {sub['end_date']}")
    print()
    
    # Try renewal
    print(f"🔄 Step 3: Create renewal for subscription {sub['id']}")
    renewal_response = requests.post(
        f"{API_URL}/subscriptions/renew/{sub['id']}",
        headers=headers,
        json={
            "payment_method": "va",
            "payment_channel": "bca"
        }
    )
    
    print(f"Status: {renewal_response.status_code}")
    print(f"Response:")
    print(json.dumps(renewal_response.json(), indent=2))
    
    if renewal_response.status_code == 200:
        print()
        print("✅ Renewal order created successfully!")
        print()
        print("📧 Check if email was sent to: web@rsppn.co.id")
        print("   (Check inbox and spam folder)")
    else:
        print()
        print("❌ Renewal failed!")
else:
    print("⚠️  No active subscriptions found")
