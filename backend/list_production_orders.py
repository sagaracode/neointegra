"""
List all recent orders from production API
"""
import requests

API_URL = "https://api.neointegratech.com/api"

print("\n" + "="*60)
print("LIST RECENT ORDERS - PRODUCTION")
print("="*60)

token = input("\n🔑 Masukkan access token: ").strip()

if not token:
    print("❌ Token harus diisi!")
    exit(1)

headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

try:
    print(f"\n📡 Getting your orders...")
    response = requests.get(
        f"{API_URL}/orders",
        headers=headers,
        timeout=10
    )
    
    if response.status_code == 200:
        orders = response.json()
        
        if not orders:
            print(f"\n❌ No orders found for your account!")
        else:
            print(f"\n✅ Found {len(orders)} order(s):\n")
            print("="*80)
            
            for order in orders[-10:]:  # Show last 10 orders
                print(f"\n📦 Order: {order['order_number']}")
                print(f"   Service: {order['service_name']}")
                print(f"   Total: Rp {order['total_price']:,}")
                print(f"   Status: {order['status']}")
                print(f"   Created: {order['created_at']}")
                print("-"*80)
            
            # Also check payments
            print(f"\n\n💳 Checking your payments...")
            payments_response = requests.get(
                f"{API_URL}/payments",
                headers=headers,
                timeout=10
            )
            
            if payments_response.status_code == 200:
                payments = payments_response.json()
                print(f"\n✅ Found {len(payments)} payment(s):\n")
                print("="*80)
                
                for payment in payments[-10:]:  # Show last 10 payments
                    print(f"\n💳 Payment ID: {payment['id']}")
                    print(f"   Order ID: {payment['order_id']}")
                    print(f"   Amount: Rp {payment['amount']:,}")
                    print(f"   Status: {payment['status']}")
                    print(f"   Method: {payment.get('payment_method', 'N/A')}")
                    print(f"   Channel: {payment.get('payment_channel', 'N/A')}")
                    print(f"   VA Number: {payment.get('va_number', 'N/A')}")
                    print(f"   Created: {payment.get('created_at', 'N/A')}")
                    print("-"*80)
            else:
                print(f"\n❌ Failed to get payments: {payments_response.status_code}")
    else:
        print(f"\n❌ Failed to get orders: {response.status_code}")
        print(f"   Response: {response.text}")
        
except requests.exceptions.Timeout:
    print(f"\n❌ Request timeout!")
except requests.exceptions.ConnectionError:
    print(f"\n❌ Connection error!")
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    import traceback
    traceback.print_exc()
