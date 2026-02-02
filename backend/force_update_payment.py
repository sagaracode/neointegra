"""
Force update payment status by creating new transaction check
Since user already paid and got confirmation email
"""
import requests
import sys

API_URL = "https://api.neointegratech.com/api"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtY3RpdG9odWRveW9AZ21haWwuY29tIiwiZXhwIjoxNzcwNjE3MTIyfQ.Ea8mot-O9UlVtAb1JP0vPfvSiXiqs8ENLV7peH7RYRM"

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

print("\n" + "="*60)
print("FORCE UPDATE PAYMENT STATUS")
print("="*60 + "\n")

# Get order
print("1. Getting order...")
order_response = requests.get(f"{API_URL}/orders/number/ORD-20260202-060535", headers=headers, timeout=10)
order = order_response.json()
print(f"   Order ID: {order['id']}")
print(f"   Order Status: {order['status']}")

# Get payment
print("\n2. Getting payment...")
payment_response = requests.get(f"{API_URL}/payments/order/{order['id']}", headers=headers, timeout=10)
payments = payment_response.json()
payment = payments[0] if isinstance(payments, list) else payments

print(f"   Payment ID: {payment['id']}")
print(f"   Current Status: {payment['status']}")
print(f"   VA Number: {payment['va_number']}")

# If payment is failed but user says they paid, we need to manually update
if payment['status'] in ['failed', 'pending']:
    print(f"\n3. User confirmed payment is COMPLETED")
    print(f"   Trying to check status from iPaymu...")
    
    try:
        check_url = f"{API_URL}/payments/{payment['id']}/check-status"
        check_response = requests.post(check_url, headers=headers, timeout=30)
        
        if check_response.status_code == 200:
            updated_payment = check_response.json()
            print(f"\n   ✅ Status checked!")
            print(f"   New Status: {updated_payment['status'].upper()}")
            
            if updated_payment['status'] == 'success':
                print(f"\n   🎉 PAYMENT CONFIRMED AS SUCCESS!")
                print(f"   Order should now show as PAID")
            else:
                print(f"\n   ⚠️ iPaymu says status is: {updated_payment['status']}")
                print(f"   This might mean:")
                print(f"   - Payment not yet received by iPaymu")
                print(f"   - Different VA number was paid")
                print(f"   - Payment to different merchant")
        else:
            print(f"\n   ❌ Check failed: {check_response.status_code}")
            print(f"   Response: {check_response.text}")
            
    except Exception as e:
        print(f"\n   ❌ Error checking status: {str(e)}")

else:
    print(f"\n✅ Payment already in final status: {payment['status']}")

print("\n" + "="*60)
print("DONE")
print("="*60 + "\n")
