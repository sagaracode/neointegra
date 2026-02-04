"""
Direct database update untuk payment ORD-20260204-155309
Jalankan di terminal backend production
"""
import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# Get database URL from environment or use default
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/dbname")

print("\n" + "="*60)
print("DIRECT DATABASE UPDATE - PAYMENT")
print("="*60)

order_number = "ORD-20260204-155309"
va_number = "9881988123522890"

try:
    # Create engine
    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    print(f"\n✅ Connected to database")
    
    # Step 1: Check current status
    print(f"\n📋 Step 1: Checking current status...")
    query = text("""
        SELECT 
            o.id as order_id,
            o.order_number,
            o.status as order_status,
            o.service_name,
            o.total_price,
            p.id as payment_id,
            p.status as payment_status,
            p.va_number,
            p.amount
        FROM orders o
        LEFT JOIN payments p ON p.order_id = o.id
        WHERE o.order_number = :order_number
    """)
    
    result = session.execute(query, {"order_number": order_number}).fetchone()
    
    if not result:
        print(f"❌ Order {order_number} not found!")
        session.close()
        exit(1)
    
    print(f"\n📦 Current Status:")
    print(f"   Order ID: {result.order_id}")
    print(f"   Order Number: {result.order_number}")
    print(f"   Service: {result.service_name}")
    print(f"   Total: Rp {result.total_price:,}")
    print(f"   Order Status: {result.order_status}")
    
    if result.payment_id:
        print(f"   Payment ID: {result.payment_id}")
        print(f"   Payment Status: {result.payment_status}")
        print(f"   VA Number: {result.va_number}")
        print(f"   Amount: Rp {result.amount:,}")
    else:
        print(f"   ❌ No payment record found!")
    
    # Step 2: Update payment
    if result.payment_id:
        print(f"\n📝 Step 2: Updating payment to SUCCESS...")
        update_payment = text("""
            UPDATE payments 
            SET status = 'success', 
                paid_at = NOW()
            WHERE id = :payment_id
        """)
        session.execute(update_payment, {"payment_id": result.payment_id})
        print(f"✅ Payment updated to SUCCESS")
    else:
        print(f"\n⚠️  Creating payment record...")
        create_payment = text("""
            INSERT INTO payments (order_id, amount, payment_method, payment_channel, status, va_number, created_at, paid_at)
            VALUES (:order_id, :amount, 'va', 'bni', 'success', :va_number, NOW(), NOW())
        """)
        session.execute(create_payment, {
            "order_id": result.order_id,
            "amount": result.total_price,
            "va_number": va_number
        })
        print(f"✅ Payment record created")
    
    # Step 3: Update order
    print(f"\n📝 Step 3: Updating order to PAID...")
    update_order = text("""
        UPDATE orders 
        SET status = 'paid'
        WHERE id = :order_id
    """)
    session.execute(update_order, {"order_id": result.order_id})
    print(f"✅ Order updated to PAID")
    
    # Commit changes
    session.commit()
    
    # Step 4: Verify
    print(f"\n📋 Step 4: Verifying changes...")
    verify_result = session.execute(query, {"order_number": order_number}).fetchone()
    
    print(f"\n" + "="*60)
    print(f"✅ UPDATE SUCCESSFUL!")
    print(f"="*60)
    print(f"\n📊 Final Status:")
    print(f"   Order Number: {verify_result.order_number}")
    print(f"   Order Status: {verify_result.order_status}")
    print(f"   Payment Status: {verify_result.payment_status}")
    print(f"   VA Number: {verify_result.va_number}")
    
    print(f"\n✅ Silakan refresh halaman dashboard!")
    print(f"   Order {order_number} sekarang berstatus PAID")
    
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    session.rollback()
    import traceback
    traceback.print_exc()
    
    print(f"\n💡 Make sure:")
    print(f"   1. DATABASE_URL environment variable is set correctly")
    print(f"   2. Database is accessible from this terminal")
    print(f"   3. You have permission to update records")
    
finally:
    session.close()
