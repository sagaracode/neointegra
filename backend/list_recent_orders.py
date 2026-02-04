"""
List all recent orders
"""
from app.database import SessionLocal
from app.models import Order, Payment, User
from datetime import datetime, timedelta

db = SessionLocal()

try:
    # Get orders from today
    today = datetime.now().date()
    orders = db.query(Order).filter(
        Order.created_at >= today
    ).order_by(Order.created_at.desc()).all()
    
    print(f"\n📦 Orders from today ({today}):")
    print(f"="*80)
    
    if not orders:
        print(f"\n❌ No orders found from today!")
    
    for order in orders:
        user = db.query(User).filter(User.id == order.user_id).first()
        payment = db.query(Payment).filter(Payment.order_id == order.id).first()
        
        print(f"\n📝 Order: {order.order_number}")
        print(f"   User: {user.email if user else 'N/A'}")
        print(f"   Service: {order.service_name}")
        print(f"   Total: Rp {order.total_price:,}")
        print(f"   Order Status: {order.status}")
        if payment:
            print(f"   Payment Status: {payment.status}")
            print(f"   Payment Method: {payment.payment_method}")
            print(f"   VA Number: {payment.va_number if payment.va_number else 'N/A'}")
        else:
            print(f"   Payment: Not created yet")
        print(f"   Created: {order.created_at}")
        print(f"-"*80)
    
    # Also check last 5 orders regardless of date
    print(f"\n\n📋 Last 5 orders (any date):")
    print(f"="*80)
    recent_orders = db.query(Order).order_by(Order.created_at.desc()).limit(5).all()
    
    for order in recent_orders:
        user = db.query(User).filter(User.id == order.user_id).first()
        print(f"\n• {order.order_number}")
        print(f"  User: {user.email if user else 'N/A'}")
        print(f"  Service: {order.service_name}")
        print(f"  Status: {order.status}")
        print(f"  Created: {order.created_at}")
    
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    import traceback
    traceback.print_exc()
finally:
    db.close()
