"""
Update existing RSPPN data: change dates from Feb 3 to Feb 7 (2025-2026)
Run this in production backend terminal
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal
from app.models import Order, Payment, Subscription, User
from datetime import datetime, timedelta

print("\n" + "="*60)
print("UPDATE RSPPN DATES: 3 Feb → 7 Feb (2025-2026)")
print("="*60)

db = SessionLocal()

try:
    # Get RSPPN user
    user = db.query(User).filter(User.email == "web@rsppn.co.id").first()
    
    if not user:
        print("\n❌ User web@rsppn.co.id not found!")
        db.close()
        exit(1)
    
    print(f"\n✅ Found user: {user.email}")
    print(f"   User ID: {user.id}")
    
    # Update subscription dates
    subscription = db.query(Subscription).filter(Subscription.user_id == user.id).first()
    
    if subscription:
        print(f"\n📅 Updating Subscription:")
        print(f"   Old start: {subscription.start_date}")
        print(f"   Old end: {subscription.end_date}")
        
        # Change from Feb 3 to Feb 7
        if subscription.start_date.month == 2 and subscription.start_date.day == 3:
            subscription.start_date = subscription.start_date.replace(day=7)
            print(f"   ✅ Updated start_date to: {subscription.start_date}")
        
        if subscription.end_date.month == 2 and subscription.end_date.day == 3:
            subscription.end_date = subscription.end_date.replace(day=7)
            print(f"   ✅ Updated end_date to: {subscription.end_date}")
    else:
        print(f"\n⚠️  No subscription found for {user.email}")
    
    # Update orders
    orders = db.query(Order).filter(Order.user_id == user.id).all()
    
    print(f"\n📦 Updating {len(orders)} order(s):")
    for order in orders:
        if order.created_at.month == 2 and order.created_at.day == 3:
            old_date = order.created_at
            order.created_at = order.created_at.replace(day=7)
            print(f"   ✅ Order {order.order_number}")
            print(f"      {old_date} → {order.created_at}")
            
            # Update order number if it contains the date
            if "20250203" in order.order_number:
                order.order_number = order.order_number.replace("20250203", "20250207")
                print(f"      Order number updated: {order.order_number}")
    
    # Update payments
    payments = db.query(Payment).join(Order).filter(Order.user_id == user.id).all()
    
    print(f"\n💳 Updating {len(payments)} payment(s):")
    for payment in payments:
        updated = False
        
        if payment.created_at and payment.created_at.month == 2 and payment.created_at.day == 3:
            old_date = payment.created_at
            payment.created_at = payment.created_at.replace(day=7)
            print(f"   ✅ Payment ID {payment.id}")
            print(f"      created_at: {old_date} → {payment.created_at}")
            updated = True
        
        if payment.paid_at and payment.paid_at.month == 2 and payment.paid_at.day == 3:
            old_date = payment.paid_at
            payment.paid_at = payment.paid_at.replace(day=7)
            print(f"      paid_at: {old_date} → {payment.paid_at}")
            updated = True
        
        # Update transaction IDs
        if payment.ipaymu_transaction_id and "20250203" in payment.ipaymu_transaction_id:
            old_id = payment.ipaymu_transaction_id
            payment.ipaymu_transaction_id = payment.ipaymu_transaction_id.replace("20250203", "20250207")
            print(f"      Transaction ID: {old_id} → {payment.ipaymu_transaction_id}")
            updated = True
        
        if payment.ipaymu_session_id and "20250203" in payment.ipaymu_session_id:
            old_id = payment.ipaymu_session_id
            payment.ipaymu_session_id = payment.ipaymu_session_id.replace("20250203", "20250207")
            print(f"      Session ID: {old_id} → {payment.ipaymu_session_id}")
            updated = True
        
        if not updated:
            print(f"   ⏭️  Payment ID {payment.id} - No update needed")
    
    # Commit changes
    print(f"\n💾 Committing changes to database...")
    db.commit()
    
    # Verify
    print(f"\n" + "="*60)
    print(f"✅ UPDATE COMPLETE!")
    print(f"="*60)
    
    if subscription:
        print(f"\n📊 Subscription:")
        print(f"   Start: {subscription.start_date}")
        print(f"   End: {subscription.end_date}")
    
    print(f"\n📦 Orders:")
    for order in orders:
        print(f"   {order.order_number} - {order.created_at}")
    
    print(f"\n💳 Payments:")
    for payment in payments:
        print(f"   ID {payment.id} - Created: {payment.created_at}, Paid: {payment.paid_at}")
    
    print(f"\n✅ DONE! Silakan refresh halaman dashboard.")
    print(f"   Tanggal sekarang akan menampilkan 7 Feb 2025")
    
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    db.rollback()
    import traceback
    traceback.print_exc()
    
finally:
    db.close()

print(f"\n" + "="*60)
