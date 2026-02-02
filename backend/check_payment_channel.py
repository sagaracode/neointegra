"""
Check payment record in production database
"""
import requests

API_URL = "https://api.neointegratech.com/api"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtY3RpdG9odWRveW9AZ21haWwuY29tIiwiZXhwIjoxNzcwNjE3MTIyfQ.Ea8mot-O9UlVtAb1JP0vPfvSiXiqs8ENLV7peH7RYRM"

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

# Get order
order_response = requests.get(f"{API_URL}/orders/number/ORD-20260202-060535", headers=headers)
order = order_response.json()

print(f"Order ID: {order['id']}")
print(f"Order Number: {order['order_number']}")

# Get payment
payment_response = requests.get(f"{API_URL}/payments/order/{order['id']}", headers=headers)
payment = payment_response.json()

if isinstance(payment, list):
    payment = payment[0]

print(f"\nPayment Details:")
print(f"  ID: {payment['id']}")
print(f"  Payment Method: {payment['payment_method']}")
print(f"  Payment Channel: {payment['payment_channel']}")  # INI YANG PENTING
print(f"  VA Number: {payment['va_number']}")
print(f"  Status: {payment['status']}")
print(f"  iPaymu TrxID: {payment.get('ipaymu_transaction_id')}")
