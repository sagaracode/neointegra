"""
Test RSPPN login directly
"""
import requests
import json

# API endpoint
API_URL = "http://localhost:8000/api"  # Local testing
# API_URL = "https://api.neointegratech.com/api"  # Production

def test_login():
    url = f"{API_URL}/auth/login"
    data = {
        "email": "web@rsppn.co.id",
        "password": "rsppn178#"
    }
    
    print(f"Testing login to: {url}")
    print(f"Credentials: {data}")
    print("")
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("\n✅ Login successful!")
            token = response.json().get("access_token")
            print(f"Access Token: {token[:50]}...")
        else:
            print("\n❌ Login failed!")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_login()
