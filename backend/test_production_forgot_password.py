import requests
import json

# Production API URL
API_URL = "https://api.neointegratech.com"

print("=== Testing Production Forgot Password ===")
print(f"API URL: {API_URL}")
print()

# Test email
test_email = input("Enter email address to test: ")

print(f"\n🔄 Sending forgot password request for: {test_email}")
print()

try:
    # Call forgot password endpoint
    # Try both with and without /api prefix
    endpoints_to_test = [
        f"{API_URL}/auth/forgot-password",
        f"{API_URL}/api/auth/forgot-password"
    ]
    
    for endpoint in endpoints_to_test:
        print(f"🔄 Testing endpoint: {endpoint}")
        response = requests.post(
            endpoint,
            json={"email": test_email},
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 404:
            break
    
    print(f"Response Headers: {dict(response.headers)}")
    print()
    
    try:
        response_data = response.json()
        print(f"Response Body:")
        print(json.dumps(response_data, indent=2))
    except:
        print(f"Response Text: {response.text}")
    
    print()
    
    if response.status_code == 200:
        print("✅ Request successful!")
        print("Check your email inbox (and spam folder)")
    else:
        print(f"❌ Request failed with status {response.status_code}")
        
except requests.exceptions.ConnectionError as e:
    print(f"❌ Connection Error: Cannot connect to {API_URL}")
    print(f"Error: {e}")
    
except requests.exceptions.Timeout:
    print(f"❌ Timeout: Server took too long to respond")
    
except Exception as e:
    print(f"❌ Error: {type(e).__name__}: {str(e)}")
    import traceback
    traceback.print_exc()

print()
print("=== Additional Debugging ===")

# Test if API is reachable
try:
    health_check = requests.get(f"{API_URL}/docs", timeout=5)
    print(f"✅ API is reachable (docs endpoint returned {health_check.status_code})")
except:
    print(f"❌ API is not reachable")

# Test auth endpoint availability
try:
    # Try to access a public endpoint
    test_endpoint = requests.get(f"{API_URL}/", timeout=5)
    print(f"✅ Root endpoint returned {test_endpoint.status_code}")
except Exception as e:
    print(f"❌ Cannot access root endpoint: {e}")
