"""
Direct database update menggunakan existing app database connection
Bisa dijalankan langsung di terminal backend production
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal
from app.models import Order, Payment
from datetime import datetime

print("\n" + "="*60)
print("DIRECT DATABASE UPDATE - PAYMENT")
print("="*60)

order_number = "ORD-20260204-155309"
va_number = "9881988123522890"

db = SessionLocal()

try:
    # Step 1: Get order
    print(f"\n📋 Step 1: Finding order...")
    order = db.query(Order).filter(Order.order_number == order_number).first()
    
    if not order:
        print(f"❌ Order {order_number} not found!")
        db.close()
        exit(1)
    
    print(f"\n📦 Order Found:")
    print(f"   Order ID: {order.id}")
    print(f"   Order Number: {order.order_number}")
    print(f"   Service: {order.service_name}")
    print(f"   Total: Rp {order.total_price:,}")
    print(f"   Current Status: {order.status}")
    
    # Step 2: Get or create payment
    payment = db.query(Payment).filter(Payment.order_id == order.id).first()
    
    if payment:
        print(f"\n💳 Payment Found:")
        print(f"   Payment ID: {payment.id}")
        print(f"   Current Status: {payment.status}")
        print(f"   VA Number: {payment.va_number}")
        print(f"   Amount: Rp {payment.amount:,}")
        
        if payment.status == 'success':
            print(f"\n✅ Payment already SUCCESS!")
            print(f"✅ Order already PAID!")
            db.close()
            exit(0)
        
        print(f"\n📝 Step 2: Updating payment to SUCCESS...")
        payment.status = 'success'
        payment.paid_at = datetime.now()
        print(f"✅ Payment updated")
    else:
        print(f"\n⚠️  Payment not found, creating new record...")
        payment = Payment(
            order_id=order.id,
            amount=order.total_price,
            payment_method='va',
            payment_channel='bni',
            status='success',
            va_number=va_number,
            created_at=datetime.now(),
            paid_at=datetime.now()
        )
        db.add(payment)
        print(f"✅ Payment record created")
    
    # Step 3: Update order
    print(f"\n📝 Step 3: Updating order to PAID...")
    order.status = 'paid'
    print(f"✅ Order updated")
    
    # Commit
    print(f"\n💾 Committing changes to database...")
    db.commit()
    
    # Refresh to get latest data
    db.refresh(order)
    db.refresh(payment)
    
    # Verify
    print(f"\n" + "="*60)
    print(f"✅ UPDATE SUCCESSFUL!")
    print(f"="*60)
    print(f"\n📊 Final Status:")
    print(f"   Order Number: {order.order_number}")
    print(f"   Order Status: {order.status}")
    print(f"   Service: {order.service_name}")
    print(f"   Total: Rp {order.total_price:,}")
    print(f"   Payment ID: {payment.id}")
    print(f"   Payment Status: {payment.status}")
    print(f"   VA Number: {payment.va_number}")
    print(f"   Paid At: {payment.paid_at}")
    
    print(f"\n✅ DONE! Silakan refresh halaman dashboard.")
    print(f"   Order {order_number} sekarang berstatus PAID")
    
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    db.rollback()
    import traceback
    traceback.print_exc()
    
    print(f"\n💡 Troubleshooting:")
    print(f"   1. Make sure you're in the backend directory")
    print(f"   2. Make sure DATABASE_URL is configured in .env")
    print(f"   3. Make sure database is accessible")
    
finally:
    db.close()

print(f"\n" + "="*60)
