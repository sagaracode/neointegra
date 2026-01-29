"""
Test Script untuk memverifikasi API Flow:
1. Register/Login user
2. Get Services
3. Create Order
4. Create Payment
5. Get Order & Payment details

Jalankan: python test_api_flow.py
"""

import httpx
import asyncio

# Configuration
BASE_URL = "http://localhost:8000/api"
# Production: BASE_URL = "https://api.neointegratech.com/api"

TEST_EMAIL = "testuser@example.com"
TEST_PASSWORD = "testpassword123"
TEST_NAME = "Test User"

class APITester:
    def __init__(self, base_url):
        self.base_url = base_url
        self.token = None
        self.user = None
        
    async def register(self):
        """Register new user"""
        print("\n[1] REGISTERING NEW USER...")
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/auth/register",
                json={
                    "email": TEST_EMAIL,
                    "password": TEST_PASSWORD,
                    "full_name": TEST_NAME,
                    "phone": "08123456789"
                }
            )
            if response.status_code == 201:
                print(f"   ✅ User registered: {TEST_EMAIL}")
                return True
            elif response.status_code == 400:
                print(f"   ⚠️  User already exists, will try login")
                return True
            else:
                print(f"   ❌ Registration failed: {response.status_code}")
                print(f"      {response.text}")
                return False
    
    async def login(self):
        """Login user and get token"""
        print("\n[2] LOGGING IN...")
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/auth/login",
                json={
                    "email": TEST_EMAIL,
                    "password": TEST_PASSWORD
                }
            )
            if response.status_code == 200:
                data = response.json()
                self.token = data.get("access_token")
                self.user = data.get("user")
                print(f"   ✅ Logged in as: {self.user.get('email')}")
                print(f"   Token: {self.token[:50]}...")
                return True
            else:
                print(f"   ❌ Login failed: {response.status_code}")
                print(f"      {response.text}")
                return False
    
    async def init_services(self):
        """Initialize services"""
        print("\n[3] INITIALIZING SERVICES...")
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.base_url}/admin/init-services")
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ Services initialized: {data.get('message')}")
                return True
            else:
                print(f"   ❌ Failed: {response.status_code} - {response.text}")
                return False
    
    async def get_services(self):
        """Get available services"""
        print("\n[4] GETTING SERVICES...")
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.base_url}/services/")
            if response.status_code == 200:
                services = response.json()
                print(f"   ✅ Found {len(services)} services:")
                for svc in services:
                    print(f"      - {svc.get('name')} (slug: {svc.get('slug')}) - Rp {svc.get('price'):,.0f}")
                return services
            else:
                print(f"   ❌ Failed: {response.status_code} - {response.text}")
                return []
    
    async def create_order(self, service_slug="website"):
        """Create order"""
        print(f"\n[5] CREATING ORDER for service: {service_slug}...")
        if not self.token:
            print("   ❌ Not authenticated!")
            return None
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/orders/",
                json={
                    "service_slug": service_slug,
                    "quantity": 1,
                    "notes": f"Test order for {service_slug}"
                },
                headers={"Authorization": f"Bearer {self.token}"}
            )
            if response.status_code == 201:
                order = response.json()
                print(f"   ✅ Order created!")
                print(f"      Order Number: {order.get('order_number')}")
                print(f"      Service: {order.get('service_name')}")
                print(f"      Total: Rp {order.get('total_price'):,.0f}")
                print(f"      Status: {order.get('status')}")
                return order
            else:
                print(f"   ❌ Failed: {response.status_code}")
                print(f"      {response.text}")
                return None
    
    async def create_payment(self, order_id, amount, method="va", channel="bca"):
        """Create payment for order"""
        print(f"\n[6] CREATING PAYMENT for order ID: {order_id}...")
        if not self.token:
            print("   ❌ Not authenticated!")
            return None
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{self.base_url}/payments/",
                json={
                    "order_id": order_id,
                    "payment_method": method,
                    "payment_channel": channel,
                    "amount": amount
                },
                headers={"Authorization": f"Bearer {self.token}"}
            )
            if response.status_code == 201:
                payment = response.json()
                print(f"   ✅ Payment created!")
                print(f"      Payment ID: {payment.get('id')}")
                print(f"      Method: {payment.get('payment_method')} - {payment.get('payment_channel')}")
                print(f"      Amount: Rp {payment.get('amount'):,.0f}")
                print(f"      Status: {payment.get('status')}")
                if payment.get('payment_url'):
                    print(f"      💳 Payment URL: {payment.get('payment_url')}")
                if payment.get('va_number'):
                    print(f"      🏦 VA Number: {payment.get('va_number')}")
                return payment
            else:
                print(f"   ❌ Failed: {response.status_code}")
                print(f"      {response.text}")
                return None
    
    async def get_orders(self):
        """Get user's orders"""
        print("\n[7] GETTING USER ORDERS...")
        if not self.token:
            print("   ❌ Not authenticated!")
            return []
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/orders/",
                headers={"Authorization": f"Bearer {self.token}"}
            )
            if response.status_code == 200:
                orders = response.json()
                print(f"   ✅ Found {len(orders)} orders:")
                for order in orders:
                    print(f"      - {order.get('order_number')} | {order.get('service_name')} | Rp {order.get('total_price'):,.0f} | {order.get('status')}")
                return orders
            else:
                print(f"   ❌ Failed: {response.status_code}")
                return []
    
    async def get_order_payments(self, order_id):
        """Get payments for order"""
        print(f"\n[8] GETTING PAYMENTS for order ID: {order_id}...")
        if not self.token:
            print("   ❌ Not authenticated!")
            return []
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/payments/order/{order_id}",
                headers={"Authorization": f"Bearer {self.token}"}
            )
            if response.status_code == 200:
                payments = response.json()
                print(f"   ✅ Found {len(payments)} payments:")
                for p in payments:
                    print(f"      - ID: {p.get('id')} | {p.get('payment_method')} | Rp {p.get('amount'):,.0f} | {p.get('status')}")
                    if p.get('payment_url'):
                        print(f"        URL: {p.get('payment_url')}")
                return payments
            else:
                print(f"   ❌ Failed: {response.status_code}")
                return []


async def main():
    print("=" * 60)
    print("   NEOINTEGRA TECH - API FLOW TEST")
    print("=" * 60)
    print(f"Base URL: {BASE_URL}")
    
    tester = APITester(BASE_URL)
    
    # Step 1: Register
    await tester.register()
    
    # Step 2: Login
    if not await tester.login():
        print("\n❌ Cannot proceed without login!")
        return
    
    # Step 3: Init services
    await tester.init_services()
    
    # Step 4: Get services
    services = await tester.get_services()
    if not services:
        print("\n❌ No services available!")
        return
    
    # Step 5: Create order for first service
    first_service = services[0]
    order = await tester.create_order(first_service.get("slug"))
    if not order:
        print("\n❌ Failed to create order!")
        return
    
    # Step 6: Create payment
    payment = await tester.create_payment(
        order_id=order.get("id"),
        amount=order.get("total_price"),
        method="va",
        channel="bca"
    )
    
    # Step 7: Get all orders
    await tester.get_orders()
    
    # Step 8: Get payments for this order
    if order:
        await tester.get_order_payments(order.get("id"))
    
    print("\n" + "=" * 60)
    print("   TEST COMPLETED!")
    print("=" * 60)
    
    if payment and payment.get("payment_url"):
        print(f"\n🎉 SUCCESS! Payment URL: {payment.get('payment_url')}")
    elif payment and payment.get("va_number"):
        print(f"\n🎉 SUCCESS! VA Number: {payment.get('va_number')}")
    else:
        print("\n⚠️  Check the output above for any errors")


if __name__ == "__main__":
    asyncio.run(main())
