"""
Simple test - just get user info with token
"""
import requests

API_URL = "https://api.neointegratech.com/api"

print("\n" + "="*60)
print("TEST AUTH TOKEN")
print("="*60)

# Login
print("\n📡 Logging in...")
login_data = {
    "email": "mctitohudoyo@gmail.com",
    "password": "asdasdasd"
}

login_response = requests.post(
    f"{API_URL}/auth/login",
    json=login_data,
    timeout=10
)

if login_response.status_code == 200:
    token_data = login_response.json()
    token = token_data.get('access_token')
    
    print(f"✅ Got token: {token[:30]}...")
    
    # Test 1: Get current user
    print(f"\n📡 Test 1: Get current user (me)...")
    headers = {"Authorization": f"Bearer {token}"}
    
    me_response = requests.get(
        f"{API_URL}/auth/me",
        headers=headers,
        timeout=10
    )
    
    print(f"Response Code: {me_response.status_code}")
    if me_response.status_code == 200:
        user = me_response.json()
        print(f"✅ User: {user.get('email')}")
    else:
        print(f"❌ Response: {me_response.text}")
    
    # Test 2: Get orders with lowercase authorization header
    print(f"\n📡 Test 2: Get orders (lowercase header)...")
    orders_response = requests.get(
        f"{API_URL}/orders",
        headers={"authorization": f"Bearer {token}"},  # lowercase
        timeout=10
    )
    
    print(f"Response Code: {orders_response.status_code}")
    if orders_response.status_code == 200:
        orders = orders_response.json()
        print(f"✅ Found {len(orders)} orders")
        for order in orders:
            print(f"   • {order['order_number']} - {order['status']}")
    else:
        print(f"❌ Response: {orders_response.text}")
else:
    print(f"❌ Login failed: {login_response.status_code}")
    print(f"Response: {login_response.text}")
