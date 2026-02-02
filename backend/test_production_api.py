"""
Test production API endpoints
Run: python test_production_api.py
"""
import requests
import json

PRODUCTION_URL = "https://api.neointegratech.com"

def test_endpoint(method, path, description):
    """Test a single endpoint"""
    url = f"{PRODUCTION_URL}{path}"
    print(f"\n{'='*60}")
    print(f"Testing: {description}")
    print(f"Method: {method}")
    print(f"URL: {url}")
    print(f"{'='*60}")
    
    try:
        if method == "GET":
            response = requests.get(url, timeout=10)
        elif method == "POST":
            response = requests.post(url, json={}, timeout=10)
        else:
            print(f"❌ Unsupported method: {method}")
            return False
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            print(f"✅ SUCCESS")
            try:
                data = response.json()
                print(f"Response preview: {json.dumps(data, indent=2)[:200]}...")
            except:
                print(f"Response: {response.text[:200]}...")
            return True
        elif response.status_code == 404:
            print(f"❌ NOT FOUND (404)")
            print(f"Response: {response.text[:200]}")
            return False
        elif response.status_code == 422:
            print(f"⚠️  VALIDATION ERROR (422) - Expected for POST without data")
            return True
        else:
            print(f"⚠️  Status: {response.status_code}")
            print(f"Response: {response.text[:200]}")
            return False
            
    except requests.exceptions.ConnectionError:
        print(f"❌ Connection Error - Cannot connect to {url}")
        return False
    except requests.exceptions.Timeout:
        print(f"❌ Timeout")
        return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def main():
    print("="*60)
    print("  Production API Endpoint Tester")
    print("="*60)
    
    endpoints = [
        ("GET", "/", "Root endpoint"),
        ("GET", "/health", "Health check"),
        ("GET", "/api", "API root (should 404 if no handler)"),
        ("GET", "/api/services/", "Get all services"),
        ("GET", "/api/admin/init-services", "Admin init services"),
        ("POST", "/api/orders/", "Create order (will fail without data)"),
    ]
    
    results = []
    for method, path, desc in endpoints:
        success = test_endpoint(method, path, desc)
        results.append((desc, success))
    
    print("\n" + "="*60)
    print("  SUMMARY")
    print("="*60)
    
    for desc, success in results:
        status = "✅" if success else "❌"
        print(f"{status} {desc}")
    
    print("\n" + "="*60)
    
    # Check critical endpoints
    critical = [r for r in results if "services" in r[0].lower() or "admin" in r[0].lower()]
    if all(r[1] for r in critical):
        print("✅ Critical endpoints OK - Backend is working!")
        print("   Sekarang bisa test payment di frontend")
    else:
        print("❌ Some critical endpoints failed")
        print("   Backend mungkin belum redeploy atau ada masalah routing")

if __name__ == "__main__":
    main()
