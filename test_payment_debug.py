import requests
import time

# Backend URL
BASE_URL = "http://localhost:8000/api"

def test_payment_creation():
    """Test payment creation with detailed logging"""
    
    print("\n" + "="*60)
    print("Testing Payment Creation with Debug Logging")
    print("="*60)
    
    # Step 1: Register user
    print("\n[1] Registering test user...")
    register_data = {
        "email": f"test_payment_{int(time.time())}@example.com",
        "password": "Test123!",
        "full_name": "Test Payment User",
        "phone": "08123456789"
    }
    
    response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
    print(f"Register Response: {response.status_code}")
    
    if response.status_code not in [200, 201]:
        print(f"Error: {response.text}")
        return
    
    user_data = response.json()
    token = user_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    print(f"✓ User registered: {user_data['user']['email']}")
    
    # Step 2: Create order
    print("\n[2] Creating order...")
    order_data = {
        "service_slug": "website",  # Using actual service slug from DB
        "quantity": 1,
        "notes": "Test payment debug"
    }
    
    response = requests.post(f"{BASE_URL}/orders", json=order_data, headers=headers)
    print(f"Order Response: {response.status_code}")
    
    if response.status_code != 201:
        print(f"Error: {response.text}")
        return
    
    order = response.json()
    print(f"✓ Order created: {order['order_number']}, Amount: Rp {order['total_price']:,.0f}")
    
    # Step 3: Create payment
    print("\n[3] Creating payment...")
    payment_data = {
        "order_id": order["id"],
        "payment_method": "va",
        "payment_channel": "bca",
        "amount": order["total_price"]
    }
    
    print(f"Payment request: {payment_data}")
    print("\n--- Watch backend terminal for detailed iPaymu logs ---\n")
    
    response = requests.post(f"{BASE_URL}/payments", json=payment_data, headers=headers)
    print(f"\nPayment Response Status: {response.status_code}")
    print(f"Payment Response Body: {response.text[:500]}")
    
    if response.status_code == 201:
        payment = response.json()
        print(f"\n✓ Payment created!")
        print(f"  Payment ID: {payment.get('id')}")
        print(f"  Status: {payment.get('status')}")
        print(f"  Payment URL: {payment.get('payment_url', 'NOT SET ❌')}")
        print(f"  VA Number: {payment.get('va_number', 'NOT SET ❌')}")
        print(f"  Transaction ID: {payment.get('ipaymu_transaction_id', 'NOT SET ❌')}")
        
        if not payment.get('payment_url'):
            print("\n⚠️ WARNING: payment_url is missing!")
            print("Check backend terminal for iPaymu API error details")
    else:
        print(f"\n❌ Payment creation failed!")
        print(f"Error: {response.text}")

if __name__ == "__main__":
    test_payment_creation()
