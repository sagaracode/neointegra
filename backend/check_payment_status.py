"""
Script untuk manually check payment status dari production
Gunakan script ini untuk:
1. Check status payment yang masih pending
2. Force update status dari iPaymu API
3. Debug payment yang stuck
"""

import requests
import sys

# Production API URL
API_URL = "https://api.neointegratech.com/api"

def check_payment_status(payment_id: int, token: str):
    """Check payment status by payment ID"""
    print(f"\n{'='*60}")
    print(f"CHECKING PAYMENT STATUS - ID: {payment_id}")
    print(f"{'='*60}\n")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        # Call check-status endpoint
        url = f"{API_URL}/payments/{payment_id}/check-status"
        print(f"📡 Calling: POST {url}")
        
        response = requests.post(url, headers=headers, timeout=30)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"\n✅ SUCCESS - Payment Status Updated!")
            print(f"\nPayment Details:")
            print(f"  - ID: {data.get('id')}")
            print(f"  - Order ID: {data.get('order_id')}")
            print(f"  - Amount: Rp {data.get('amount'):,.0f}")
            print(f"  - Method: {data.get('payment_method')}")
            print(f"  - Channel: {data.get('payment_channel')}")
            print(f"  - Status: {data.get('status').upper()}")
            print(f"  - iPaymu TrxID: {data.get('ipaymu_transaction_id')}")
            print(f"  - VA Number: {data.get('va_number')}")
            
            if data.get('paid_at'):
                print(f"  - Paid At: {data.get('paid_at')}")
            
            return data
            
        elif response.status_code == 404:
            print(f"\n❌ ERROR: Payment not found or you don't have access")
            
        elif response.status_code == 401:
            print(f"\n❌ ERROR: Unauthorized - Token invalid atau expired")
            print("Silakan login ulang untuk mendapatkan token baru")
            
        else:
            print(f"\n❌ ERROR: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.Timeout:
        print(f"\n⏱️ TIMEOUT: Request took too long")
        
    except requests.exceptions.ConnectionError:
        print(f"\n🔌 CONNECTION ERROR: Cannot connect to server")
        
    except Exception as e:
        print(f"\n❌ UNEXPECTED ERROR: {str(e)}")
    
    return None


def list_pending_payments(token: str):
    """List all orders with pending status"""
    print(f"\n{'='*60}")
    print(f"LISTING PENDING ORDERS")
    print(f"{'='*60}\n")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        url = f"{API_URL}/orders/"
        response = requests.get(url, headers=headers, params={"status": "pending"}, timeout=30)
        
        if response.status_code == 200:
            orders = response.json()
            
            if not orders:
                print("✅ No pending orders found")
                return []
            
            print(f"Found {len(orders)} pending order(s):\n")
            
            for order in orders:
                print(f"Order #{order.get('order_number')}:")
                print(f"  - Service: {order.get('service_name')}")
                print(f"  - Amount: Rp {order.get('total_amount'):,.0f}")
                print(f"  - Status: {order.get('status').upper()}")
                
                # Get payment info
                if order.get('id'):
                    payment_url = f"{API_URL}/payments/order/{order['id']}"
                    payment_response = requests.get(payment_url, headers=headers, timeout=10)
                    
                    if payment_response.status_code == 200:
                        payments = payment_response.json()
                        if payments:
                            payment = payments[0] if isinstance(payments, list) else payments
                            print(f"  - Payment ID: {payment.get('id')}")
                            print(f"  - Payment Status: {payment.get('status').upper()}")
                            print(f"  - VA Number: {payment.get('va_number')}")
                
                print()
            
            return orders
            
        else:
            print(f"❌ ERROR: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
    
    return []


def main():
    print("\n" + "="*60)
    print("PAYMENT STATUS CHECKER - Production")
    print("="*60)
    
    # Get token from user
    print("\n📝 Cara mendapatkan token:")
    print("1. Login ke https://neointegratech.com")
    print("2. Buka browser DevTools (F12)")
    print("3. Ke tab Console")
    print("4. Ketik: localStorage.getItem('access_token')")
    print("5. Copy token yang muncul (tanpa tanda kutip)\n")
    
    token = input("🔑 Masukkan access token: ").strip()
    
    if not token:
        print("❌ Token tidak boleh kosong!")
        return
    
    while True:
        print("\n" + "="*60)
        print("MENU:")
        print("1. Check payment status by ID")
        print("2. List all pending orders")
        print("3. Exit")
        print("="*60)
        
        choice = input("\nPilih menu (1-3): ").strip()
        
        if choice == "1":
            payment_id = input("\nMasukkan Payment ID: ").strip()
            
            if not payment_id.isdigit():
                print("❌ Payment ID harus berupa angka!")
                continue
            
            check_payment_status(int(payment_id), token)
            
        elif choice == "2":
            list_pending_payments(token)
            
        elif choice == "3":
            print("\n👋 Bye!")
            break
            
        else:
            print("❌ Pilihan tidak valid!")


if __name__ == "__main__":
    main()
