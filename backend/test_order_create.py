"""
Test create order dengan service test-payment
Mensimulasikan request seperti dari frontend
"""
import requests
import json

PRODUCTION_URL = "https://api.neointegratech.com"

def test_create_order_with_test_payment():
    """Test create order endpoint dengan service test-payment"""
    
    print("="*70)
    print("  TEST: Create Order dengan test-payment")
    print("="*70)
    
    # Data seperti dari frontend
    order_data = {
        "service_slug": "test-payment",
        "quantity": 1,
        "notes": "Test Payment - Rp 5.000"
    }
    
    print(f"\n📡 URL: {PRODUCTION_URL}/api/orders/")
    print(f"📝 Data: {json.dumps(order_data, indent=2)}")
    
    # Test tanpa auth (harus 401)
    print("\n1️⃣ Test tanpa authentication:")
    try:
        r = requests.post(
            f"{PRODUCTION_URL}/api/orders/",
            json=order_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        print(f"   Status: {r.status_code}")
        print(f"   Response: {r.text[:200]}")
        
        if r.status_code == 401:
            print("   ✅ Expected: Auth required")
        elif r.status_code == 404:
            data = r.json()
            detail = data.get('detail', '')
            if 'test-payment' in detail and 'tidak ditemukan' in detail:
                print("   ❌ PROBLEM: Service test-payment tidak ditemukan di database!")
                print("   🔧 Solusi: Hit /api/admin/init-services untuk add service")
            else:
                print(f"   ❌ NOT FOUND: {detail}")
        else:
            print(f"   ⚠️ Unexpected status: {r.status_code}")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Verify service exists
    print("\n2️⃣ Verify service test-payment exists:")
    try:
        r = requests.get(f"{PRODUCTION_URL}/api/services/", timeout=10)
        services = r.json()
        test_service = next((s for s in services if s['slug'] == 'test-payment'), None)
        
        if test_service:
            print(f"   ✅ Service test-payment FOUND:")
            print(f"      Name: {test_service['name']}")
            print(f"      Slug: {test_service['slug']}")
            print(f"      Price: Rp {test_service['price']:,.0f}")
        else:
            print("   ❌ Service test-payment NOT FOUND!")
            print("\n   🔧 Fixing: Adding service via init-services...")
            fix = requests.get(f"{PRODUCTION_URL}/api/admin/init-services", timeout=10)
            print(f"   Fix response: {fix.json()}")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")

    print("\n" + "="*70)
    print("  RESULT")
    print("="*70)
    print("""
Jika test tanpa auth mengembalikan 401 (Auth required):
✅ Endpoint bekerja dengan benar!

Langkah selanjutnya:
1. Pastikan frontend sudah redeploy (tunggu ~2-3 menit)
2. Hard refresh browser: Ctrl+Shift+R
3. Login dan test payment di: https://neointegratech.com/test-payment

Jika masih error, cek:
- Console browser (F12) untuk error detail
- Network tab untuk melihat request/response
""")

if __name__ == "__main__":
    test_create_order_with_test_payment()
