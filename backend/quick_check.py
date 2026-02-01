#!/usr/bin/env python3
"""Quick check RSPPN data and issue"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.database import SessionLocal
from app.models import User, Order, Payment, Subscription
from datetime import datetime

db = SessionLocal()

print("="*60)
print("QUICK CHECK: web@rsppn.co.id")
print("="*60)

# 1. Check user
user = db.query(User).filter(User.email == "web@rsppn.co.id").first()
if not user:
    print("❌ User tidak ditemukan!")
    exit(1)
print(f"✅ User: {user.email} (ID: {user.id})")

# 2. Check orders
orders = db.query(Order).filter(Order.user_id == user.id).all()
print(f"\n📦 Orders: {len(orders)} order(s)")
for order in orders:
    print(f"  - {order.order_number}")
    print(f"    Status: {order.status}")
    print(f"    Subscription ID: {order.subscription_id}")
    print(f"    Amount: Rp {order.total_price:,.0f}")

# 3. Check payments
payments = db.query(Payment).join(Order).filter(Order.user_id == user.id).all()
print(f"\n💳 Payments: {len(payments)} payment(s)")
for payment in payments:
    print(f"  - Payment #{payment.id}")
    print(f"    Status: {payment.status}")
    print(f"    Amount: Rp {payment.amount:,.0f}")
    if payment.paid_at:
        print(f"    Paid at: {payment.paid_at}")

# 4. Check subscriptions
subs = db.query(Subscription).filter(Subscription.user_id == user.id).all()
print(f"\n📅 Subscriptions: {len(subs)} subscription(s)")
for sub in subs:
    print(f"  - Subscription #{sub.id}")
    print(f"    Package: {sub.package_name}")
    print(f"    Status: {sub.status}")
    print(f"    Start: {sub.start_date}")
    print(f"    End: {sub.end_date}")
    days_left = (sub.end_date - datetime.utcnow()).days
    print(f"    Days left: {days_left} hari")

# 5. Check renewal button conditions
print("\n"+"="*60)
print("KONDISI TOMBOL PERPANJANG:")
print("="*60)

if orders:
    order = orders[0]
    print(f"Order status: {order.status}")
    print(f"  ✅ Completed/Paid? {order.status in ['completed', 'paid']}")
    print(f"Order subscription_id: {order.subscription_id}")
    print(f"  ✅ Punya subscription? {order.subscription_id is not None}")

if subs:
    sub = subs[0]
    print(f"\nSubscription exists? {sub is not None}")
    print(f"  ✅ Ada subscription di database")
    
print("\n🔍 KESIMPULAN:")
if orders and subs and orders[0].status in ['completed', 'paid'] and orders[0].subscription_id:
    print("✅ SEMUA KONDISI TERPENUHI!")
    print("✅ Tombol 'Perpanjang Sekarang' SEHARUSNYA MUNCUL")
    print("\n⚠️ Jika tombol tidak muncul di frontend:")
    print("   1. Frontend belum ter-reload dengan kode terbaru")
    print("   2. API /subscriptions/my-subscriptions tidak dipanggil")
    print("   3. Token JWT expired/invalid")
    print("   4. State 'subscription' di React masih null")
else:
    print("❌ Ada kondisi yang tidak terpenuhi")
    if not orders or orders[0].status not in ['completed', 'paid']:
        print("   - Order belum completed/paid")
    if not orders or not orders[0].subscription_id:
        print("   - Order tidak punya subscription_id")
    if not subs:
        print("   - User tidak punya subscription")

db.close()
print("\n" + "="*60)
