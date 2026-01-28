import requests
import json

# Test 1: Get all services
print("=" * 50)
print("TEST 1: Get All Services")
print("=" * 50)
response = requests.get("http://localhost:8000/api/services")
print(f"Status: {response.status_code}")
if response.status_code == 200:
    services = response.json()
    for service in services:
        print(f"- {service['name']} (slug: {service.get('slug', 'NO SLUG')})")
print()

# Test 2: Login
print("=" * 50)
print("TEST 2: Login")
print("=" * 50)
login_data = {
    "email": "demo@neointegra.tech",
    "password": "demo123"
}
response = requests.post("http://localhost:8000/api/auth/login", json=login_data)
print(f"Status: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    token = data.get("access_token")
    print(f"✅ Login success! Token: {token[:20]}...")
else:
    print(f"❌ Login failed: {response.text}")
    exit(1)
print()

# Test 3: Create order with slug
print("=" * 50)
print("TEST 3: Create Order with Slug")
print("=" * 50)
order_data = {
    "service_slug": "all-in",
    "quantity": 1,
    "notes": "Test order from Python script"
}
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}
response = requests.post("http://localhost:8000/api/orders", json=order_data, headers=headers)
print(f"Status: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")
print()

print("✅ All tests completed!")
