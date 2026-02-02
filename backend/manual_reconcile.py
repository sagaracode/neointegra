"""
API call to manually reconcile payment with iPaymu transaction ID
For payments that succeeded in iPaymu but callback failed
"""
import requests

API_URL = "https://api.neointegratech.com/api"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtY3RpdG9odWRveW9AZ21haWwuY29tIiwiZXhwIjoxNzcwNjE3MTIyfQ.Ea8mot-O9UlVtAb1JP0vPfvSiXiqs8ENLV7peH7RYRM"

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

print("\n" + "="*60)
print("MANUAL PAYMENT RECONCILIATION")
print("="*60 + "\n")

# Data from iPaymu dashboard
payment_id = 1
ipaymu_trx_id = "31312022"
order_number = "ORD-20260202-060535"

print(f"Payment ID: {payment_id}")
print(f"iPaymu Transaction ID: {ipaymu_trx_id}")
print(f"Order Number: {order_number}")

# Try to manually trigger callback
print(f"\n1. Simulating iPaymu callback...")

callback_data = {
    "trx_id": ipaymu_trx_id,
    "status": "berhasil",
    "status_code": "1",
    "sid": order_number,
    "reference_id": order_number
}

try:
    callback_url = f"{API_URL}/payments/callback"
    response = requests.post(callback_url, json=callback_data, timeout=10)
    
    print(f"   Response: {response.status_code}")
    print(f"   Body: {response.text}")
    
    if response.status_code == 200:
        print(f"\n✅ Callback processed successfully!")
    else:
        print(f"\n⚠️ Callback returned non-200 status")
        
except Exception as e:
    print(f"\n❌ Callback failed: {str(e)}")

# Check updated status
print(f"\n2. Checking updated payment status...")

try:
    check_response = requests.get(f"{API_URL}/payments/{payment_id}", headers=headers, timeout=10)
    
    if check_response.status_code == 200:
        payment = check_response.json()
        print(f"\n   Payment Status: {payment['status'].upper()}")
        print(f"   iPaymu TrxID: {payment.get('ipaymu_transaction_id')}")
        
        if payment['status'] == 'success':
            print(f"\n   🎉 PAYMENT IS NOW SUCCESS!")
        else:
            print(f"\n   ⚠️ Payment still {payment['status']}")
    else:
        print(f"   ❌ Failed to get payment: {check_response.status_code}")
        
except Exception as e:
    print(f"   ❌ Error: {str(e)}")

# Check order status
print(f"\n3. Checking order status...")

try:
    order_response = requests.get(f"{API_URL}/orders/number/{order_number}", headers=headers, timeout=10)
    
    if order_response.status_code == 200:
        order = order_response.json()
        print(f"\n   Order Status: {order['status'].upper()}")
        
        if order['status'] == 'paid':
            print(f"\n   🎉 ORDER IS NOW PAID!")
        else:
            print(f"\n   ⚠️ Order still {order['status']}")
    else:
        print(f"   ❌ Failed to get order: {order_response.status_code}")
        
except Exception as e:
    print(f"   ❌ Error: {str(e)}")

print(f"\n" + "="*60)
print("DONE")
print("="*60 + "\n")
