#!/usr/bin/env python3
"""
Fix: Set subscription_id pada order RSPPN agar tombol perpanjang muncul
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from app.database import SessionLocal
from app.models import User, Order, Subscription

db = SessionLocal()
user = db.query(User).filter(User.email == "web@rsppn.co.id").first()
if not user:
    print("❌ User tidak ditemukan!")
    exit(1)
order = db.query(Order).filter(Order.user_id == user.id).first()
sub = db.query(Subscription).filter(Subscription.user_id == user.id).first()
if not order or not sub:
    print("❌ Order atau subscription tidak ditemukan!")
    exit(1)
order.subscription_id = sub.id
order.updated_at = sub.updated_at

db.commit()
print(f"✅ Berhasil set order.subscription_id = {sub.id}")
print(f"Order: {order.order_number}, Subscription: {sub.package_name}")
db.close()
