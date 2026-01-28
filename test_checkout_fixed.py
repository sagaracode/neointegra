import requests
import json

# API Base URL
BASE_URL = "http://localhost:8000/api"

def test_checkout_flow():
    """Test complete checkout flow"""
    
    print("=" * 60)
    print("TESTING CHECKOUT FLOW")
    print("=" * 60)
    
    # Step 1: Login
    print("\n1. Login dengan demo@neointegra.tech...")
    login_response = requests.post(
        f"{BASE_URL}/auth/login",
        json={
            "email": "demo@neointegra.tech",
            "password": "demo123"
        }
    )
    
    if login_response.status_code != 200:
        print(f"❌ Login gagal: {login_response.status_code}")
        print(login_response.text)
        return
    
    token = login_response.json()["access_token"]
    print(f"✅ Login berhasil! Token: {token[:20]}...")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Step 2: Get services
    print("\n2. Mengambil daftar services...")
    services_response = requests.get(f"{BASE_URL}/services/", headers=headers)
    
    if services_response.status_code != 200:
        print(f"❌ Get services gagal: {services_response.status_code}")
        print(services_response.text)
        return
    
    services = services_response.json()
    print(f"✅ Berhasil get {len(services)} services")
    print(f"   Services: {[s['name'] for s in services]}")
    
    # Step 3: Create order untuk service pertama
    test_service = services[0]
    print(f"\n3. Membuat order untuk '{test_service['name']}'...")
    print(f"   Slug: {test_service['slug']}")
    
    order_response = requests.post(
        f"{BASE_URL}/orders/",
        headers=headers,
        json={
            "service_slug": test_service["slug"],
            "quantity": 1,
            "notes": "Test order from automated test"
        }
    )
    
    if order_response.status_code != 201:
        print(f"❌ Create order gagal: {order_response.status_code}")
        print(order_response.text)
        return
    
    order_data = order_response.json()
    order_id = order_data["id"]
    total_price = order_data["total_price"]
    
    print(f"✅ Order berhasil dibuat!")
    print(f"   Order ID: {order_id}")
    print(f"   Order Number: {order_data['order_number']}")
    print(f"   Total Price: Rp {total_price:,}")
    
    # Step 4: Create payment - ENDPOINT YANG BENAR: /payments/ (bukan /payments/create)
    print(f"\n4. Membuat payment untuk order ID {order_id}...")
    print(f"   Endpoint: POST {BASE_URL}/payments/")
    
    payment_response = requests.post(
        f"{BASE_URL}/payments/",  # BENAR: gunakan /payments/ bukan /payments/create
        headers=headers,
        json={
            "order_id": order_id,
            "payment_method": "va",
            "payment_channel": "bca",
            "amount": total_price
        }
    )
    
    print(f"   Status code: {payment_response.status_code}")
    
    if payment_response.status_code == 201:
        payment_data = payment_response.json()
        print(f"✅ Payment berhasil dibuat!")
        print(f"   Payment ID: {payment_data['id']}")
        print(f"   Status: {payment_data['status']}")
        
        if payment_data.get('payment_url'):
            print(f"   Payment URL: {payment_data['payment_url']}")
            print(f"\n🎉 CHECKOUT FLOW BERHASIL!")
            print(f"   User seharusnya redirect ke: {payment_data['payment_url']}")
        else:
            print(f"   ⚠️  Payment dibuat tapi tidak ada payment_url")
            if payment_data.get('va_number'):
                print(f"   VA Number: {payment_data['va_number']}")
    
    elif payment_response.status_code == 405:
        print(f"❌ PAYMENT GAGAL - 405 Method Not Allowed")
        print(f"   Ini berarti endpoint tidak ditemukan atau method salah")
        print(f"   Response: {payment_response.text}")
    else:
        print(f"❌ Payment gagal: {payment_response.status_code}")
        print(f"   Response: {payment_response.text}")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    try:
        test_checkout_flow()
    except requests.exceptions.ConnectionError:
        print("❌ Tidak bisa connect ke backend. Pastikan backend running di http://localhost:8000")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
