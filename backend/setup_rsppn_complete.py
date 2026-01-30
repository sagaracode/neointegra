"""
Complete RSPPN Data Setup - Payment History & Subscription
"""
import bcrypt
from datetime import datetime
from app.database import SessionLocal
from app.models import User, Service, Order, Payment, Subscription

def setup_rsppn_complete():
    db = SessionLocal()
    
    try:
        print("=" * 70)
        print("RSPPN COMPLETE DATA SETUP")
        print("=" * 70)
        
        # 1. Get or create RSPPN user
        email = "web@rsppn.co.id"
        password = "rsppn178#"
        
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"\n❌ User not found. Creating...")
            user = User(
                email=email,
                full_name="RSPPN Soedirman",
                phone="08123456789",
                company_name="RSPPN Soedirman",
                hashed_password=bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
                is_active=True,
                is_verified=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"✅ User created")
        else:
            print(f"\n✅ User found: {user.email}")
            # Update to ensure correct data
            user.full_name = "RSPPN Soedirman"
            user.company_name = "RSPPN Soedirman"
            user.hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            user.is_active = True
            user.is_verified = True
            db.commit()
            print(f"   Updated credentials")
        
        # 2. Get all-in service
        all_in_service = db.query(Service).filter(Service.slug == "all-in").first()
        if not all_in_service:
            print(f"\n❌ All-in service not found!")
            print(f"   Run: python -m app.seed")
            return False
        
        print(f"\n✅ Service found: {all_in_service.name}")
        print(f"   Price: Rp {all_in_service.price:,.0f}")
        
        # 3. Create/Update Order
        order = db.query(Order).filter(
            Order.user_id == user.id,
            Order.service_id == all_in_service.id
        ).first()
        
        if not order:
            print(f"\n📦 Creating order...")
            order_number = f"ORD-RSPPN-{datetime(2025, 2, 3).strftime('%Y%m%d%H%M%S')}"
            order = Order(
                user_id=user.id,
                order_number=order_number,
                service_id=all_in_service.id,
                service_name=all_in_service.name,
                quantity=1,
                unit_price=81000000,
                total_price=81000000,
                status="completed",
                notes="Paket All In Service - Pembayaran Initial",
                created_at=datetime(2025, 2, 3, 10, 0, 0)
            )
            db.add(order)
            db.commit()
            db.refresh(order)
            print(f"✅ Order created: {order.order_number}")
        else:
            print(f"\n✅ Order exists: {order.order_number}")
            # Update status to completed
            order.status = "completed"
            db.commit()
        
        # 4. Create/Update Payment
        payment = db.query(Payment).filter(Payment.order_id == order.id).first()
        
        if not payment:
            print(f"\n💳 Creating payment...")
            payment = Payment(
                order_id=order.id,
                amount=81000000,
                payment_method="va",
                payment_channel="bca",
                status="success",
                ipaymu_transaction_id="IPAYMU-RSPPN-20250203",
                ipaymu_session_id="SESSION-RSPPN-20250203",
                va_number="8808081234567890",
                created_at=datetime(2025, 2, 3, 10, 0, 0),
                paid_at=datetime(2025, 2, 3, 10, 30, 0)
            )
            db.add(payment)
            db.commit()
            db.refresh(payment)
            print(f"✅ Payment created: {payment.ipaymu_transaction_id}")
        else:
            print(f"\n✅ Payment exists: {payment.ipaymu_transaction_id}")
            # Update to success status
            payment.status = "success"
            if not payment.paid_at:
                payment.paid_at = datetime(2025, 2, 3, 10, 30, 0)
            db.commit()
        
        # 5. Create/Update Subscription
        subscription = db.query(Subscription).filter(
            Subscription.user_id == user.id
        ).first()
        
        if not subscription:
            print(f"\n📅 Creating subscription...")
            subscription = Subscription(
                user_id=user.id,
                package_name="Paket All In Service",
                package_type="yearly",
                start_date=datetime(2025, 2, 3),
                end_date=datetime(2026, 2, 3),
                price=81000000,
                renewal_price=81000000,
                is_active=True,
                status="active",
                features='["Website Service", "SEO Service (12 bulan)", "Mail Server Service", "Cloudflare Protection", "Hosting Performa Tinggi", "Support Teknis Lengkap"]'
            )
            db.add(subscription)
            db.commit()
            db.refresh(subscription)
            print(f"✅ Subscription created")
        else:
            print(f"\n✅ Subscription exists")
            # Update subscription details
            subscription.package_name = "Paket All In Service"
            subscription.start_date = datetime(2025, 2, 3)
            subscription.end_date = datetime(2026, 2, 3)
            subscription.price = 81000000
            subscription.renewal_price = 81000000
            subscription.is_active = True
            subscription.status = "active"
            db.commit()
            print(f"   Updated subscription")
        
        # 6. Summary
        print(f"\n" + "=" * 70)
        print(f"✅ RSPPN DATA COMPLETE!")
        print(f"=" * 70)
        print(f"\n📋 Summary:")
        print(f"   User: {user.email}")
        print(f"   Full Name: {user.full_name}")
        print(f"   Company: {user.company_name}")
        print(f"\n   Order: {order.order_number}")
        print(f"   Service: {order.service_name}")
        print(f"   Amount: Rp {order.total_price:,.0f}")
        print(f"   Status: {order.status}")
        print(f"\n   Payment: {payment.ipaymu_transaction_id}")
        print(f"   Method: {payment.payment_method.upper()} - {payment.payment_channel.upper()}")
        print(f"   Status: {payment.status}")
        print(f"   Paid At: {payment.paid_at}")
        print(f"\n   Subscription: {subscription.package_name}")
        print(f"   Start: {subscription.start_date.strftime('%d %B %Y')}")
        print(f"   End: {subscription.end_date.strftime('%d %B %Y')}")
        print(f"   Renewal Price: Rp {subscription.renewal_price:,.0f}")
        print(f"   Status: {subscription.status}")
        print(f"\n✅ You can now login and see payment history!")
        print(f"=" * 70)
        
        return True
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    success = setup_rsppn_complete()
    if success:
        print("\n✅ Run this in production after deployment!")
    else:
        print("\n❌ Failed. Check errors above.")
