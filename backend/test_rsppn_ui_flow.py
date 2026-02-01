#!/usr/bin/env python3
"""
Test RSPPN UI/UX Flow - Comprehensive Testing
Simulates user login and checks if renewal button should appear
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000/api"

def test_rsppn_flow():
    print("=" * 70)
    print("🧪 TESTING RSPPN UI/UX FLOW")
    print("=" * 70)
    
    # Step 1: Login
    print("\n1️⃣  LOGIN TEST")
    print("-" * 70)
    login_res = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "web@rsppn.co.id",
        "password": "rsppn178#"
    })
    
    if login_res.status_code != 200:
        print(f"❌ Login gagal: {login_res.text}")
        return
    
    token = login_res.json()["access_token"]
    user_data = login_res.json()
    print(f"✅ Login berhasil")
    print(f"   Email: {user_data.get('email')}")
    print(f"   Name: {user_data.get('full_name')}")
    print(f"   Token: {token[:30]}...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Step 2: Get Orders
    print("\n2️⃣  ORDERS TEST")
    print("-" * 70)
    orders_res = requests.get(f"{BASE_URL}/orders", headers=headers)
    
    if orders_res.status_code != 200:
        print(f"❌ Get orders gagal: {orders_res.text}")
        return
    
    orders = orders_res.json()
    print(f"✅ Orders loaded: {len(orders)} order(s)")
    
    completed_orders = []
    for order in orders:
        print(f"\n   📦 Order: {order['order_number']}")
        print(f"      Service: {order['service_name']}")
        print(f"      Status: {order['status']}")
        print(f"      Total: Rp {order['total_price']:,}")
        print(f"      Created: {order['created_at']}")
        
        if order['status'] in ['completed', 'paid']:
            completed_orders.append(order)
            print(f"      ✅ Status memenuhi syarat untuk renewal")
        else:
            print(f"      ⚠️  Status tidak memenuhi syarat")
    
    # Step 3: Get Subscriptions
    print("\n3️⃣  SUBSCRIPTIONS TEST")
    print("-" * 70)
    subs_res = requests.get(f"{BASE_URL}/subscriptions/my-subscriptions", headers=headers)
    
    if subs_res.status_code != 200:
        print(f"❌ Get subscriptions gagal: {subs_res.text}")
        return
    
    subscriptions = subs_res.json()
    print(f"✅ Subscriptions loaded: {len(subscriptions)} subscription(s)")
    
    has_subscription = len(subscriptions) > 0
    
    for sub in subscriptions:
        print(f"\n   📅 Subscription ID: {sub['id']}")
        print(f"      Package: {sub.get('package_name', 'N/A')}")
        print(f"      Status: {sub['status']}")
        print(f"      Start: {sub['start_date']}")
        print(f"      End: {sub['end_date']}")
        
        # Calculate days remaining
        end_date = datetime.fromisoformat(sub['end_date'].replace('Z', '+00:00'))
        today = datetime.now(end_date.tzinfo)
        days_remaining = (end_date - today).days
        print(f"      Days Remaining: {days_remaining} hari")
        
        if sub['status'] == 'active':
            print(f"      ✅ Status aktif")
        else:
            print(f"      ⚠️  Status: {sub['status']}")
    
    # Step 4: Analyze Button Condition
    print("\n4️⃣  BUTTON CONDITION ANALYSIS")
    print("-" * 70)
    print(f"Kondisi untuk tombol 'Perpanjang Sekarang' muncul:")
    print(f"   • Order status = 'completed' OR 'paid': {len(completed_orders) > 0} ✅" if len(completed_orders) > 0 else f"   • Order status = 'completed' OR 'paid': False ❌")
    print(f"   • Has subscription: {has_subscription} ✅" if has_subscription else f"   • Has subscription: {has_subscription} ❌")
    
    should_show_button = len(completed_orders) > 0 and has_subscription
    
    print(f"\n{'🎉' if should_show_button else '❌'} RESULT: Tombol {'SEHARUSNYA MUNCUL' if should_show_button else 'TIDAK AKAN MUNCUL'}")
    
    if should_show_button:
        print(f"\n   ✅ Completed orders: {len(completed_orders)}")
        print(f"   ✅ Active subscriptions: {len(subscriptions)}")
        print(f"\n   📱 UI Expected Behavior:")
        print(f"      1. Dashboard → Pesanan Saya")
        print(f"      2. Card order ORD-RSPPN-* akan tampil")
        print(f"      3. Status badge: 'Selesai' (hijau)")
        print(f"      4. Tombol '🔄 Perpanjang Sekarang' di kanan bawah")
        print(f"      5. Warna tombol: Gradient hijau (emerald)")
    else:
        print(f"\n   ⚠️  Kemungkinan masalah:")
        if len(completed_orders) == 0:
            print(f"      • Tidak ada order dengan status completed/paid")
            print(f"      • Solusi: Update order status ke 'completed' atau 'paid'")
        if not has_subscription:
            print(f"      • Tidak ada subscription aktif")
            print(f"      • Solusi: Run setup_rsppn_complete.py")
    
    # Step 5: Frontend Code Check
    print("\n5️⃣  FRONTEND CODE REQUIREMENT")
    print("-" * 70)
    print("Code di Dashboard.jsx (DashboardOrders):")
    print("""
    const [subscription, setSubscription] = useState(null)
    
    useEffect(() => {
        loadOrders()
        loadSubscription()  // ← HARUS dipanggil
    }, [])
    
    const loadSubscription = async () => {
        const res = await api.get('/subscriptions/my-subscriptions')
        if (res.data && res.data.length > 0) {
            setSubscription(res.data[0])  // ← State ini digunakan
        }
    }
    
    // Kondisi tombol:
    {(order.status === 'completed' || order.status === 'paid') && subscription && (
        <button>🔄 Perpanjang Sekarang</button>
    )}
    """)
    
    print("\n✅ Checklist Frontend:")
    print("   □ loadSubscription() dipanggil di useEffect")
    print("   □ State subscription di-set dari API response")
    print("   □ Kondisi && subscription tidak null")
    print("   □ Browser console tidak ada error")
    print("   □ Network tab shows /subscriptions/my-subscriptions → 200")
    
    # Step 6: Deployment Check
    print("\n6️⃣  DEPLOYMENT CHECKLIST")
    print("-" * 70)
    print("   □ Backend deployed to Coolify")
    print("   □ Frontend deployed to Coolify")
    print("   □ Database di production sudah di-seed")
    print("   □ Browser cache di-clear")
    print("   □ Hard refresh (Cmd+Shift+R)")
    
    print("\n" + "=" * 70)
    print("✅ TEST SELESAI")
    print("=" * 70)

if __name__ == "__main__":
    try:
        test_rsppn_flow()
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
