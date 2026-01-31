"""
Check RSPPN data - Subscription, Orders, and Payments
"""
from app.database import SessionLocal
from app.models import User, Service, Order, Payment, Subscription
from datetime import datetime

db = SessionLocal()

print("="*70)
print("CHECKING RSPPN DATA")
print("="*70)

# 1. Check User
user = db.query(User).filter(User.email == "web@rsppn.co.id").first()
if not user:
    print("❌ User web@rsppn.co.id NOT FOUND!")
    db.close()
    exit()

print(f"\n✅ User: {user.email}")
print(f"   Name: {user.full_name}")
print(f"   ID: {user.id}")

# 2. Check Orders
orders = db.query(Order).filter(Order.user_id == user.id).all()
print(f"\n📦 Orders: {len(orders)}")
for order in orders:
    print(f"\n  Order #{order.id}: {order.order_number}")
    print(f"    Service: {order.service_name}")
    print(f"    Status: {order.status}")
    print(f"    Amount: Rp {order.total_price:,.0f}")
    print(f"    Created: {order.created_at}")
    
    # Check payment
    payment = db.query(Payment).filter(Payment.order_id == order.id).first()
    if payment:
        print(f"    Payment: {payment.status}")
        if payment.va_number:
            print(f"    VA: {payment.va_number}")

# 3. Check Subscription
subscriptions = db.query(Subscription).filter(Subscription.user_id == user.id).all()
print(f"\n📅 Subscriptions: {len(subscriptions)}")
for sub in subscriptions:
    print(f"\n  Subscription #{sub.id}")
    print(f"    Package: {sub.package_name if hasattr(sub, 'package_name') else 'N/A'}")
    print(f"    Status: {sub.status}")
    print(f"    Start: {sub.start_date}")
    print(f"    End: {sub.end_date}")
    print(f"    Created: {sub.created_at}")

# 4. Check what's missing
print("\n" + "="*70)
print("ANALYSIS")
print("="*70)

if len(orders) == 0:
    print("❌ NO ORDERS - Tombol tidak akan muncul")
else:
    completed_orders = [o for o in orders if o.status in ['completed', 'paid']]
    if len(completed_orders) == 0:
        print("❌ NO COMPLETED ORDERS - Tombol tidak akan muncul")
        print("   Ubah status order menjadi 'completed' atau 'paid'")
    else:
        print(f"✅ {len(completed_orders)} Completed/Paid orders found")

if len(subscriptions) == 0:
    print("❌ NO SUBSCRIPTION - Tombol tidak akan muncul")
    print("   Jalankan script setup untuk membuat subscription")
else:
    print(f"✅ {len(subscriptions)} Subscription(s) found")

print("\n" + "="*70)
print("SOLUTION")
print("="*70)

if len(orders) == 0 or len(subscriptions) == 0:
    print("\n🔧 Run this command to create data:")
    print("   python3 setup_rsppn_complete.py")
else:
    completed_orders = [o for o in orders if o.status in ['completed', 'paid']]
    if len(completed_orders) > 0 and len(subscriptions) > 0:
        print("\n✅ DATA LENGKAP - Tombol seharusnya muncul!")
        print("\n📝 Pastikan:")
        print("   1. Frontend sudah di-redeploy")
        print("   2. Clear browser cache")
        print("   3. Refresh halaman dashboard")
    else:
        print("\n🔧 Update order status to completed:")
        print("   python3 << 'EOF'")
        print("from app.database import SessionLocal")
        print("from app.models import Order")
        print("db = SessionLocal()")
        print(f"order = db.query(Order).filter(Order.user_id == {user.id}).first()")
        print("if order:")
        print("    order.status = 'completed'")
        print("    db.commit()")
        print("    print('✅ Order status updated')")
        print("db.close()")
        print("EOF")

db.close()
