"""
Quick script to check payment status via API
Usage: python quick_check_payment.py <order_number> <token>
"""

import requests
import sys

API_URL = "https://api.neointegratech.com/api"

def check_order_payment(order_number: str, token: str):
    """Check payment status for an order"""
    print(f"\n{'='*60}")
    print(f"CHECKING ORDER: {order_number}")
    print(f"{'='*60}\n")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        # Get order by number
        print(f"1. Getting order details...")
        order_response = requests.get(f"{API_URL}/orders/number/{order_number}", headers=headers, timeout=10)
        
        if order_response.status_code != 200:
            print(f"❌ Order not found: {order_response.status_code}")
            return
        
        order = order_response.json()
        print(f"✅ Order found: {order['service_name']}")
        print(f"   Status: {order['status'].upper()}")
        print(f"   Amount: Rp {order['total_price']:,.0f}")
        
        # Get payment for this order
        print(f"\n2. Getting payment details...")
        payment_response = requests.get(f"{API_URL}/payments/order/{order['id']}", headers=headers, timeout=10)
        
        if payment_response.status_code != 200:
            print(f"❌ Payment not found")
            return
        
        payments = payment_response.json()
        payment = payments[0] if isinstance(payments, list) else payments
        
        print(f"✅ Payment found: #{payment['id']}")
        print(f"   Status: {payment['status'].upper()}")
        print(f"   VA Number: {payment.get('va_number')}")
        print(f"   iPaymu TrxID: {payment.get('ipaymu_transaction_id')}")
        
        # Check status from iPaymu
        if payment['status'] == 'pending':
            print(f"\n3. Checking status from iPaymu API...")
            check_url = f"{API_URL}/payments/{payment['id']}/check-status"
            check_response = requests.post(check_url, headers=headers, timeout=30)
            
            if check_response.status_code == 200:
                updated_payment = check_response.json()
                print(f"✅ Status checked successfully!")
                print(f"   New Status: {updated_payment['status'].upper()}")
                
                if updated_payment['status'] == 'success':
                    print(f"   🎉 PAYMENT SUCCESSFUL!")
                    print(f"   Paid At: {updated_payment.get('paid_at')}")
                elif updated_payment['status'] == 'pending':
                    print(f"   ⏳ Still pending - payment not yet received by iPaymu")
                else:
                    print(f"   ⚠️ Payment status: {updated_payment['status']}")
            else:
                print(f"❌ Failed to check status: {check_response.status_code}")
                print(f"   Response: {check_response.text}")
        else:
            print(f"\n✅ Payment already in final state: {payment['status'].upper()}")
        
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("\n❌ Usage: python quick_check_payment.py <order_number> <token>")
        print("\nExample:")
        print("  python quick_check_payment.py ORD-20260202-060535 eyJhbGc...")
        print("\nTo get token:")
        print("  1. Login to https://neointegratech.com")
        print("  2. Open DevTools (F12) → Console")
        print("  3. Type: localStorage.getItem('access_token')")
        print("  4. Copy the token\n")
        sys.exit(1)
    
    order_number = sys.argv[1]
    token = sys.argv[2]
    
    check_order_payment(order_number, token)
