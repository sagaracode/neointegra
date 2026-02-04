"""
Force update test payment ke status success
"""
from app.database import SessionLocal
from app.models import Order, Payment, User
from datetime import datetime

db = SessionLocal()

try:
    order_number = "ORD-20260204-155309"
    
    # Get order
    order = db.query(Order).filter(Order.order_number == order_number).first()
    
    if not order:
        print(f"❌ Order {order_number} tidak ditemukan!")
        exit(1)
    
    print(f"\n📦 Order Details:")
    print(f"   Order Number: {order.order_number}")
    print(f"   Service: {order.service_name}")
    print(f"   Total: Rp {order.total_price:,}")
    print(f"   Status: {order.status}")
    
    # Get or create payment
    payment = db.query(Payment).filter(Payment.order_id == order.id).first()
    
    if not payment:
        print(f"\n💳 Payment not found, creating new payment record...")
        payment = Payment(
            order_id=order.id,
            amount=order.total_price,
            payment_method="va",
            payment_channel="bni",
            status="success",
            va_number="9881988123522890",
            created_at=datetime.now(),
            paid_at=datetime.now()
        )
        db.add(payment)
        print(f"✅ Payment record created")
    else:
        print(f"\n💳 Payment found, updating status...")
        payment.status = "success"
        payment.paid_at = datetime.now()
        print(f"✅ Payment updated to success")
    
    # Update order status
    print(f"\n📝 Updating order status...")
    order.status = "paid"
    
    db.commit()
    
    print(f"\n" + "="*60)
    print(f"✅ PAYMENT UPDATED SUCCESSFULLY!")
    print(f"="*60)
    print(f"\n📊 Final Status:")
    print(f"   Order: {order.order_number}")
    print(f"   Order Status: {order.status}")
    print(f"   Payment Status: {payment.status}")
    print(f"   VA Number: {payment.va_number}")
    print(f"   Paid At: {payment.paid_at}")
    print(f"\n✅ Silakan refresh halaman dashboard!")
    
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    db.rollback()
finally:
    db.close()
