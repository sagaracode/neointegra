"""
Manual update payment status based on iPaymu confirmation
Use this when callback fails but payment is confirmed in iPaymu dashboard
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

# Database URL (production)
DATABASE_URL = "sqlite:////app/data/neointegratech.db"

# For local testing, use local db
if os.path.exists("./neointegratech.db"):
    DATABASE_URL = "sqlite:///./neointegratech.db"
    print(f"Using LOCAL database")
else:
    print(f"Using PRODUCTION database at /app/data/")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def manual_update_payment():
    """Manually update payment based on iPaymu confirmation"""
    db = SessionLocal()
    
    try:
        # Data from iPaymu dashboard
        payment_id = 1  # Payment ID from our database
        ipaymu_transaction_id = "31312022"
        ipaymu_status = "berhasil"  # from iPaymu
        order_number = "ORD-20260202-060535"
        
        print(f"\n{'='*60}")
        print(f"MANUAL PAYMENT UPDATE")
        print(f"{'='*60}\n")
        
        # Import models
        from app.models import Payment, Order
        
        # Get payment
        payment = db.query(Payment).filter(Payment.id == payment_id).first()
        
        if not payment:
            print(f"❌ Payment #{payment_id} not found!")
            return
        
        print(f"Current Payment Status:")
        print(f"  ID: {payment.id}")
        print(f"  Status: {payment.status}")
        print(f"  iPaymu TrxID: {payment.ipaymu_transaction_id}")
        print(f"  Amount: Rp {payment.amount:,.0f}")
        
        # Get order
        order = db.query(Order).filter(Order.id == payment.order_id).first()
        
        print(f"\nCurrent Order Status:")
        print(f"  Order Number: {order.order_number}")
        print(f"  Status: {order.status}")
        
        # Update payment
        print(f"\n{'='*60}")
        print(f"UPDATING TO SUCCESS...")
        print(f"{'='*60}\n")
        
        payment.ipaymu_transaction_id = ipaymu_transaction_id
        payment.status = "success"
        payment.paid_at = datetime.utcnow()
        
        # Update order
        order.status = "paid"
        
        db.commit()
        
        print(f"✅ Payment updated successfully!")
        print(f"  New Status: {payment.status}")
        print(f"  iPaymu TrxID: {payment.ipaymu_transaction_id}")
        print(f"  Paid At: {payment.paid_at}")
        
        print(f"\n✅ Order updated successfully!")
        print(f"  New Status: {order.status}")
        
        print(f"\n{'='*60}")
        print(f"UPDATE COMPLETED!")
        print(f"{'='*60}\n")
        
        print(f"Next steps:")
        print(f"  1. Refresh website dashboard")
        print(f"  2. Check order status should be 'PAID'")
        print(f"  3. Payment should appear in history")
        
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    manual_update_payment()
