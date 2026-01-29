#!/usr/bin/env python3
"""
Test script for production API (api.neointegratech.com)
"""
import requests
import json

BASE_URL = "https://api.neointegratech.com/api"

print("=" * 60)
print("   NEOINTEGRA TECH - PRODUCTION API TEST")
print("=" * 60)
print(f"Base URL: {BASE_URL}\n")

# 1. Test Services
print("[1] CHECKING SERVICES...")
try:
    r = requests.get(f"{BASE_URL}/services/", timeout=10)
    if r.status_code == 200:
        services = r.json()
        print(f"   ✅ Found {len(services)} services:")
        for s in services:
            print(f"      - {s['name']} (slug: {s['slug']}) - Rp {s['price']:,.0f}")
    else:
        print(f"   ❌ Failed: {r.status_code}")
except Exception as e:
    print(f"   ❌ Error: {e}")

# 2. Test Authentication
print("\n[2] TESTING LOGIN...")
try:
    login_data = {
        "username": "testuser@example.com",
        "password": "TestPassword123!"
    }
    r = requests.post(
        f"{BASE_URL}/auth/login", 
        data=login_data,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        timeout=10
    )
    if r.status_code == 200:
        token = r.json().get("access_token")
        print(f"   ✅ Login successful!")
        print(f"   Token: {token[:50]}...")
        
        # 3. Test Order Creation
        print("\n[3] TESTING ORDER CREATION...")
        headers = {"Authorization": f"Bearer {token}"}
        order_data = {
            "service_slug": "website",
            "quantity": 1,
            "notes": "Test order from production test script"
        }
        r = requests.post(
            f"{BASE_URL}/orders/",
            json=order_data,
            headers=headers,
            timeout=10
        )
        if r.status_code == 201:
            order = r.json()
            print(f"   ✅ Order created!")
            print(f"      Order Number: {order['order_number']}")
            print(f"      Service: {order['service_name']}")
            print(f"      Total: Rp {order['total_price']:,.0f}")
            
            # 4. Test Payment Creation
            print(f"\n[4] TESTING PAYMENT CREATION...")
            payment_data = {
                "order_id": order['id'],
                "payment_method": "va",
                "payment_channel": "bca",
                "amount": order['total_price']
            }
            r = requests.post(
                f"{BASE_URL}/payments/",
                json=payment_data,
                headers=headers,
                timeout=30
            )
            if r.status_code == 201:
                payment = r.json()
                print(f"   ✅ Payment created!")
                print(f"      Payment ID: {payment.get('id')}")
                print(f"      Transaction ID: {payment.get('transaction_id')}")
                print(f"      Payment URL: {payment.get('payment_url', 'N/A')[:60]}...")
            else:
                print(f"   ❌ Payment failed: {r.status_code}")
                print(f"      {r.text}")
        else:
            print(f"   ❌ Order failed: {r.status_code}")
            print(f"      {r.text}")
    else:
        print(f"   ⚠️  Login failed: {r.status_code}")
        print(f"   (This is OK if test user doesn't exist)")
except Exception as e:
    print(f"   ❌ Error: {e}")

# 5. Test Frontend Reachability
print("\n[5] CHECKING FRONTEND...")
try:
    r = requests.get("https://neointegratech.com", timeout=10)
    print(f"   ✅ Frontend accessible: {r.status_code}")
except Exception as e:
    print(f"   ❌ Frontend error: {e}")

print("\n" + "=" * 60)
print("   TEST COMPLETED!")
print("=" * 60)
