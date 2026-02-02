"""
Deep diagnosis untuk test payment error
"""
import requests
import json

PRODUCTION_URL = "https://api.neointegratech.com"

def test_orders_endpoint():
    """Test orders endpoint dengan berbagai cara"""
    
    print("="*70)
    print("  DEEP DIAGNOSIS: Orders Endpoint")
    print("="*70)
    
    # 1. Test tanpa auth
    print("\n1. Test POST /api/orders/ tanpa auth:")
    try:
        r = requests.post(f"{PRODUCTION_URL}/api/orders/", json={}, timeout=10)
        print(f"   Status: {r.status_code}")
        print(f"   Response: {r.text[:200]}")
    except Exception as e:
        print(f"   Error: {e}")
    
    # 2. Test dengan trailing slash vs tanpa
    print("\n2. Test URL variations:")
    urls = [
        "/api/orders/",
        "/api/orders",
        "/orders/",
        "/orders",
    ]
    for url in urls:
        try:
            r = requests.post(f"{PRODUCTION_URL}{url}", json={}, timeout=5)
            status = "✅" if r.status_code in [401, 422, 200] else "❌"
            print(f"   {status} POST {url} → {r.status_code}")
        except Exception as e:
            print(f"   ❌ POST {url} → ERROR: {e}")
    
    # 3. Test OPTIONS (preflight CORS)
    print("\n3. Test OPTIONS (CORS preflight):")
    try:
        r = requests.options(f"{PRODUCTION_URL}/api/orders/", timeout=5)
        print(f"   Status: {r.status_code}")
        print(f"   CORS Headers:")
        for h in ['Access-Control-Allow-Origin', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Headers']:
            print(f"     {h}: {r.headers.get(h, 'NOT SET')}")
    except Exception as e:
        print(f"   Error: {e}")
    
    # 4. Check services endpoint
    print("\n4. Verify services available:")
    try:
        r = requests.get(f"{PRODUCTION_URL}/api/services/", timeout=10)
        if r.status_code == 200:
            services = r.json()
            print(f"   Total services: {len(services)}")
            for s in services:
                marker = "👉" if s['slug'] == 'test-payment' else "  "
                print(f"   {marker} {s['slug']}: Rp {s['price']:,.0f}")
        else:
            print(f"   Error: {r.status_code}")
    except Exception as e:
        print(f"   Error: {e}")
    
    # 5. Test dengan data lengkap tapi tanpa auth
    print("\n5. Test POST dengan data lengkap (tanpa auth):")
    data = {
        "service_slug": "test-payment",
        "quantity": 1,
        "notes": "Test Payment - Rp 5.000"
    }
    try:
        r = requests.post(
            f"{PRODUCTION_URL}/api/orders/", 
            json=data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        print(f"   Status: {r.status_code}")
        print(f"   Response: {r.text[:300]}")
        # 401 = OK (auth required), 404 = PROBLEM (endpoint not found)
        if r.status_code == 401:
            print("   ✅ Endpoint exists, auth required (expected)")
        elif r.status_code == 404:
            print("   ❌ Endpoint NOT FOUND - routing problem!")
        elif r.status_code == 422:
            print("   ✅ Endpoint exists, validation error")
    except Exception as e:
        print(f"   Error: {e}")

def check_backend_version():
    """Check backend version/health"""
    print("\n" + "="*70)
    print("  Backend Version Check")
    print("="*70)
    
    try:
        r = requests.get(f"{PRODUCTION_URL}/", timeout=5)
        if r.status_code == 200:
            data = r.json()
            print(f"\n   App: {data.get('app')}")
            print(f"   Version: {data.get('version')}")
            print(f"   Status: {data.get('status')}")
            print(f"   CORS: {data.get('cors')}")
    except Exception as e:
        print(f"   Error: {e}")
    
    # Check health
    try:
        r = requests.get(f"{PRODUCTION_URL}/health", timeout=5)
        if r.status_code == 200:
            data = r.json()
            print(f"   Database: {data.get('database')}")
    except Exception as e:
        print(f"   Error: {e}")

def check_api_root():
    """Check API root for available endpoints"""
    print("\n" + "="*70)
    print("  API Endpoints Check")
    print("="*70)
    
    try:
        r = requests.get(f"{PRODUCTION_URL}/api", timeout=5)
        if r.status_code == 200:
            data = r.json()
            print(f"\n   Message: {data.get('message')}")
            print(f"   Version: {data.get('version')}")
            print(f"   Endpoints:")
            endpoints = data.get('endpoints', {})
            for name, path in endpoints.items():
                print(f"     - {name}: {path}")
    except Exception as e:
        print(f"   Error: {e}")

if __name__ == "__main__":
    check_backend_version()
    check_api_root()
    test_orders_endpoint()
    
    print("\n" + "="*70)
    print("  DIAGNOSIS COMPLETE")
    print("="*70)
