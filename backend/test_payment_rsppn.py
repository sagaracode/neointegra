"""
Test pembayaran untuk akun web@rsppn.co.id
Script ini akan mensimulasikan alur pembayaran untuk menemukan masalah
"""
import requests
import json
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:8000/api"
EMAIL = "web@rsppn.co.id"
PASSWORD = "RSppn2024!"  # Password default dari setup script

def print_section(title):
    """Print formatted section header"""
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}")

def test_login():
    """Test login and get token"""
    print_section("1. LOGIN")
    
    url = f"{BASE_URL}/auth/login"
    data = {
        "username": EMAIL,
        "password": PASSWORD
    }
    
    print(f"POST {url}")
    print(f"Data: {json.dumps(data, indent=2)}")
    
    try:
        response = requests.post(url, data=data)
        print(f"\nStatus: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            token = response.json().get('access_token')
            print(f"\n✅ Login berhasil!")
            print(f"Token: {token[:50]}...")
            return token
        else:
            print(f"\n❌ Login gagal!")
            return None
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        return None

def test_create_order(token):
    """Test create order"""
    print_section("2. CREATE ORDER")
    
    url = f"{BASE_URL}/orders/"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    data = {
        "service_slug": "web-development",  # Pilih service yang ada
        "quantity": 1,
        "notes": "Test order from script"
    }
    
    print(f"POST {url}")
    print(f"Headers: Authorization: Bearer {token[:30]}...")
    print(f"Data: {json.dumps(data, indent=2)}")
    
    try:
        response = requests.post(url, json=data, headers=headers)
        print(f"\nStatus: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code in [200, 201]:
            order = response.json()
            print(f"\n✅ Order berhasil dibuat!")
            print(f"Order ID: {order['id']}")
            print(f"Order Number: {order['order_number']}")
            print(f"Total: Rp {order['total_price']:,.0f}")
            return order
        else:
            print(f"\n❌ Order gagal!")
            return None
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

def test_create_payment(token, order, bank_code="bca"):
    """Test create payment"""
    print_section(f"3. CREATE PAYMENT ({bank_code.upper()})")
    
    url = f"{BASE_URL}/payments/"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    data = {
        "order_id": order['id'],
        "payment_method": "va",
        "payment_channel": bank_code,
        "amount": order['total_price']
    }
    
    print(f"POST {url}")
    print(f"Headers: Authorization: Bearer {token[:30]}...")
    print(f"Data: {json.dumps(data, indent=2)}")
    
    try:
        response = requests.post(url, json=data, headers=headers)
        print(f"\nStatus: {response.status_code}")
        
        # Try to print response even if not JSON
        try:
            response_data = response.json()
            print(f"Response: {json.dumps(response_data, indent=2)}")
        except:
            print(f"Response (raw): {response.text}")
        
        if response.status_code in [200, 201]:
            payment = response.json()
            print(f"\n✅ Payment berhasil dibuat!")
            print(f"Payment ID: {payment['id']}")
            print(f"VA Number: {payment.get('va_number', 'TIDAK ADA')}")
            print(f"Payment URL: {payment.get('payment_url', 'TIDAK ADA')}")
            print(f"Status: {payment['status']}")
            
            if not payment.get('va_number'):
                print(f"\n⚠️  WARNING: VA Number tidak ada!")
                print(f"Ini mungkin penyebab masalah!")
            
            return payment
        else:
            print(f"\n❌ Payment gagal!")
            print(f"Error detail: {response.text}")
            return None
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

def test_all_banks(token, order):
    """Test payment with all available banks"""
    print_section("4. TEST SEMUA BANK")
    
    banks = ['bca', 'bni', 'bri', 'mandiri', 'cimb', 'permata', 'bsi', 'danamon']
    results = {}
    
    for bank in banks:
        print(f"\n--- Testing {bank.upper()} ---")
        payment = test_create_payment(token, order, bank)
        
        if payment:
            has_va = bool(payment.get('va_number'))
            results[bank] = {
                'success': True,
                'has_va': has_va,
                'va_number': payment.get('va_number'),
                'payment_id': payment.get('id')
            }
        else:
            results[bank] = {
                'success': False,
                'has_va': False,
                'va_number': None,
                'payment_id': None
            }
    
    # Summary
    print_section("SUMMARY")
    for bank, result in results.items():
        status = "✅" if result['success'] and result['has_va'] else "❌"
        va_status = f"VA: {result['va_number']}" if result['va_number'] else "NO VA"
        print(f"{status} {bank.upper():10} - {va_status}")

def main():
    """Main test flow"""
    print("=" * 60)
    print(" TEST PEMBAYARAN - AKUN WEB@RSPPN.CO.ID")
    print("=" * 60)
    print(f" Waktu: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f" Base URL: {BASE_URL}")
    print(f" Email: {EMAIL}")
    print("=" * 60)
    
    # Step 1: Login
    token = test_login()
    if not token:
        print("\n❌ Test dibatalkan: Login gagal")
        return
    
    # Step 2: Create Order
    order = test_create_order(token)
    if not order:
        print("\n❌ Test dibatalkan: Order gagal")
        return
    
    # Step 3: Test Payment (single bank first)
    print("\n" + "="*60)
    print("Pilih test mode:")
    print("1. Test single bank (BCA)")
    print("2. Test all banks (8 banks)")
    choice = input("Pilih (1/2): ").strip()
    
    if choice == "2":
        test_all_banks(token, order)
    else:
        payment = test_create_payment(token, order, "bca")
        if payment:
            print("\n✅ Test selesai - Payment berhasil")
        else:
            print("\n❌ Test selesai - Payment gagal")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Test dibatalkan oleh user")
    except Exception as e:
        print(f"\n\n❌ Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()
