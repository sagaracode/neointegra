"""
Login dan update payment untuk akun mctitohudoyo@gmail.com
"""
import requests

API_URL = "https://api.neointegratech.com/api"

print("\n" + "="*60)
print("UPDATE PAYMENT - AKUN MCTITOHUDOYO@GMAIL.COM")
print("="*60)

# Login
print("\n📡 Logging in...")
login_data = {
    "email": "mctitohudoyo@gmail.com",
    "password": "asdasdasd"
}

try:
    login_response = requests.post(
        f"{API_URL}/auth/login",
        json=login_data,
        timeout=10
    )
    
    print(f"Login Response Code: {login_response.status_code}")
    
    if login_response.status_code == 200:
        token_data = login_response.json()
        print(f"Token Data: {token_data}")
        
        # Check if access_token or token key exists
        token = token_data.get('access_token') or token_data.get('token')
        
        if not token:
            print(f"\n❌ No token in response!")
            print(f"   Response keys: {token_data.keys()}")
            exit(1)
        
        print(f"✅ Login successful!")
        print(f"   Token: {token[:50]}...")
        
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        # Get orders
        print(f"\n📡 Getting orders...")
        orders_response = requests.get(
            f"{API_URL}/orders",
            headers=headers,
            timeout=10
        )
        
        if orders_response.status_code == 200:
            orders = orders_response.json()
            print(f"\n✅ Found {len(orders)} order(s)")
            
            # Find the specific order
            order_number = "ORD-20260204-155309"
            target_order = next((o for o in orders if o['order_number'] == order_number), None)
            
            if target_order:
                print(f"\n📦 Order found:")
                print(f"   Order Number: {target_order['order_number']}")
                print(f"   Service: {target_order['service_name']}")
                print(f"   Total: Rp {target_order['total_price']:,}")
                print(f"   Current Status: {target_order['status']}")
                
                # Get payments
                print(f"\n📡 Getting payments...")
                payments_response = requests.get(
                    f"{API_URL}/payments",
                    headers=headers,
                    timeout=10
                )
                
                if payments_response.status_code == 200:
                    payments = payments_response.json()
                    payment = next((p for p in payments if p['order_id'] == target_order['id']), None)
                    
                    if payment:
                        print(f"\n💳 Payment found:")
                        print(f"   Payment ID: {payment['id']}")
                        print(f"   Status: {payment['status']}")
                        print(f"   VA Number: {payment.get('va_number', 'N/A')}")
                        print(f"   Amount: Rp {payment['amount']:,}")
                        
                        if payment['status'] == 'success':
                            print(f"\n✅ Payment already SUCCESS!")
                        else:
                            # Try to check payment status (simulate payment)
                            print(f"\n📡 Checking payment status...")
                            check_response = requests.post(
                                f"{API_URL}/payments/{payment['id']}/check-status",
                                headers=headers,
                                json={},
                                timeout=10
                            )
                            
                            print(f"   Response Code: {check_response.status_code}")
                            
                            if check_response.status_code == 200:
                                result = check_response.json()
                                print(f"\n✅ Payment check response:")
                                print(f"   Status: {result.get('status', 'N/A')}")
                                print(f"   Message: {result.get('message', 'N/A')}")
                                
                                # Get updated order
                                updated_order_response = requests.get(
                                    f"{API_URL}/orders",
                                    headers=headers,
                                    timeout=10
                                )
                                
                                if updated_order_response.status_code == 200:
                                    updated_orders = updated_order_response.json()
                                    updated_target = next((o for o in updated_orders if o['order_number'] == order_number), None)
                                    
                                    if updated_target:
                                        print(f"\n📊 Updated Status:")
                                        print(f"   Order Status: {updated_target['status']}")
                                        
                                        # Get updated payment
                                        updated_payments_response = requests.get(
                                            f"{API_URL}/payments",
                                            headers=headers,
                                            timeout=10
                                        )
                                        
                                        if updated_payments_response.status_code == 200:
                                            updated_payments = updated_payments_response.json()
                                            updated_payment = next((p for p in updated_payments if p['id'] == payment['id']), None)
                                            
                                            if updated_payment:
                                                print(f"   Payment Status: {updated_payment['status']}")
                                                
                                                if updated_payment['status'] == 'success':
                                                    print(f"\n" + "="*60)
                                                    print(f"✅ PAYMENT BERHASIL DIUPDATE!")
                                                    print(f"="*60)
                                                    print(f"\n✅ Silakan refresh halaman dashboard!")
                                                else:
                                                    print(f"\n⚠️  Payment masih status: {updated_payment['status']}")
                                                    print(f"\n💡 Kemungkinan iPaymu belum menerima pembayaran.")
                                                    print(f"   Atau gunakan SQL manual di server.")
                            else:
                                print(f"\n❌ Failed to check payment status")
                                print(f"   Response: {check_response.text}")
                                print(f"\n💡 Gunakan SQL manual di server:")
                                print(f"\n   UPDATE payments SET status='success', paid_at=NOW() WHERE id={payment['id']};")
                                print(f"   UPDATE orders SET status='paid' WHERE id={target_order['id']};")
                    else:
                        print(f"\n❌ Payment not found for this order!")
                else:
                    print(f"\n❌ Failed to get payments: {payments_response.status_code}")
            else:
                print(f"\n❌ Order {order_number} not found!")
                print(f"\n📋 Available orders:")
                for order in orders:
                    print(f"   • {order['order_number']} - {order['service_name']} - {order['status']}")
        else:
            print(f"\n❌ Failed to get orders: {orders_response.status_code}")
            print(f"   Response: {orders_response.text}")
    else:
        print(f"\n❌ Login failed: {login_response.status_code}")
        print(f"   Response: {login_response.text}")
        
except requests.exceptions.Timeout:
    print(f"\n❌ Request timeout!")
except requests.exceptions.ConnectionError:
    print(f"\n❌ Connection error!")
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    import traceback
    traceback.print_exc()
