"""
Force update payment via API (Production)
"""
import requests

API_URL = "https://api.neointegratech.com/api"

# Token dari localStorage
print("\n" + "="*60)
print("FORCE UPDATE PAYMENT - PRODUCTION")
print("="*60)

token = input("\n🔑 Masukkan access token: ").strip()
order_number = input("📦 Masukkan Order Number (e.g., ORD-20260204-155309): ").strip()

if not token or not order_number:
    print("❌ Token dan Order Number harus diisi!")
    exit(1)

headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

try:
    # Get order details
    print(f"\n📡 Getting order details...")
    order_response = requests.get(
        f"{API_URL}/orders/number/{order_number}",
        headers=headers,
        timeout=10
    )
    
    if order_response.status_code == 200:
        order = order_response.json()
        print(f"\n✅ Order found:")
        print(f"   Order Number: {order['order_number']}")
        print(f"   Service: {order['service_name']}")
        print(f"   Total: Rp {order['total_price']:,}")
        print(f"   Current Status: {order['status']}")
        
        # Get payment for this order
        print(f"\n📡 Checking payment...")
        payments_response = requests.get(
            f"{API_URL}/payments",
            headers=headers,
            timeout=10
        )
        
        if payments_response.status_code == 200:
            payments = payments_response.json()
            payment = next((p for p in payments if p['order_id'] == order['id']), None)
            
            if payment:
                print(f"\n💳 Payment found:")
                print(f"   Payment ID: {payment['id']}")
                print(f"   Status: {payment['status']}")
                print(f"   VA Number: {payment.get('va_number', 'N/A')}")
                
                # Force update payment
                confirm = input(f"\n⚠️  Update payment status ke SUCCESS? (yes/no): ").strip().lower()
                
                if confirm == 'yes':
                    print(f"\n📡 Updating payment status...")
                    update_response = requests.post(
                        f"{API_URL}/payments/{payment['id']}/force-success",
                        headers=headers,
                        json={},
                        timeout=10
                    )
                    
                    if update_response.status_code == 200:
                        result = update_response.json()
                        print(f"\n" + "="*60)
                        print(f"✅ PAYMENT UPDATED SUCCESSFULLY!")
                        print(f"="*60)
                        print(f"\n📊 Updated Status:")
                        print(f"   Order Status: {result.get('order_status', 'N/A')}")
                        print(f"   Payment Status: {result.get('payment_status', 'N/A')}")
                        print(f"\n✅ Silakan refresh halaman dashboard!")
                    else:
                        # Try alternative: manual update via payment check-status
                        print(f"\n⚠️  Force-success endpoint not available. Trying manual method...")
                        print(f"\n📡 Manually updating to database...")
                        
                        # Use direct database update (you need to run this on server)
                        print(f"\n📋 Run this command on your server:")
                        print(f"\n" + "="*60)
                        print(f"UPDATE payments SET status='success', paid_at=NOW() WHERE id={payment['id']};")
                        print(f"UPDATE orders SET status='paid' WHERE id={order['id']};")
                        print(f"="*60)
                else:
                    print(f"\n❌ Cancelled!")
            else:
                print(f"\n❌ Payment not found for this order!")
                print(f"\n💡 Payment might need to be created first.")
        else:
            print(f"\n❌ Failed to get payments: {payments_response.status_code}")
            print(f"   Response: {payments_response.text}")
    else:
        print(f"\n❌ Order not found: {order_response.status_code}")
        print(f"   Response: {order_response.text}")
        print(f"\n💡 Make sure:")
        print(f"   1. Order number is correct")
        print(f"   2. You're logged in as the order owner")
        print(f"   3. Token is valid")
        
except requests.exceptions.Timeout:
    print(f"\n❌ Request timeout! Server might be slow.")
except requests.exceptions.ConnectionError:
    print(f"\n❌ Connection error! Check your internet connection.")
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    import traceback
    traceback.print_exc()
