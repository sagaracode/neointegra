"""
Cek status backend production dan endpoint availability
"""
import requests
import time

PRODUCTION_URL = "https://api.neointegratech.com"

def check_endpoint(url, description):
    """Check if endpoint exists"""
    try:
        response = requests.get(url, timeout=5)
        return response.status_code, response.status_code != 404
    except:
        return 0, False

def main():
    print("="*70)
    print("  Backend Production Status Check")
    print("="*70)
    
    endpoints = [
        ("/", "Root"),
        ("/api", "API Root"),
        ("/api/services/", "Services List"),
        ("/api/admin/init-services", "Admin Init"),
        ("/api/admin/add-test-service", "Add Test Service (NEW)"),
    ]
    
    print(f"\n📡 Checking: {PRODUCTION_URL}")
    print()
    
    all_ok = True
    for path, desc in endpoints:
        url = f"{PRODUCTION_URL}{path}"
        status, exists = check_endpoint(url, desc)
        
        if exists:
            print(f"✅ {desc:30} → {status}")
        else:
            print(f"❌ {desc:30} → {status if status else 'TIMEOUT'}")
            if "add-test-service" in path.lower():
                all_ok = False
    
    print()
    print("="*70)
    
    if all_ok:
        print("✅ Backend production sudah redeploy!")
        print("   Endpoint /api/admin/add-test-service sudah tersedia")
        print()
        print("👉 Jalankan: python force_add_test_service.py")
    else:
        print("⏳ Backend production belum redeploy")
        print("   Endpoint /api/admin/add-test-service belum tersedia")
        print()
        print("Solusi sementara:")
        print("1. Tunggu 2-3 menit untuk auto-redeploy")
        print("2. Atau manual trigger redeploy di dashboard hosting")
        print("3. Atau jalankan SQL script: backend/add_test_service.sql")
        print("   di database production via phpMyAdmin/MySQL client")
    
    print("="*70)

if __name__ == "__main__":
    main()
