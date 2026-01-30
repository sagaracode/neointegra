"""
Database seeder for initial data
Run: python -m app.seed
"""
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import bcrypt

from .database import SessionLocal, init_db
from .models import User, Service, Subscription, Order, Payment

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def seed_services(db: Session):
    """Seed initial services"""
    services_data = [
        {
            "name": "Paket All In Service",
            "slug": "all-in",
            "description": "Paket paling hemat & optimal untuk bisnis jangka panjang. Sudah termasuk Website, SEO, Mail Server, Cloudflare, dan Hosting.",
            "category": "package",
            "price": 81000000,
            "duration_days": 365,
            "features": '["Website Service - Custom UI/UX", "SEO Service (12 bulan)", "Mail Server Service", "Cloudflare Protection", "Hosting Performa Tinggi", "Support Teknis Lengkap"]'
        },
        {
            "name": "Website Service",
            "slug": "website",
            "description": "Website Service Profesional - Pembuatan website custom dengan performa tinggi.",
            "category": "web",
            "price": 36000000,
            "duration_days": 365,
            "features": '["Custom UI/UX", "Hosting Performa Tinggi", "Optimasi Kecepatan", "Maintenance & Update", "Backup & Keamanan", "Support Teknis"]'
        },
        {
            "name": "SEO Service",
            "slug": "seo",
            "description": "SEO Service Berkelanjutan (12 Bulan) - Optimasi mesin pencari profesional.",
            "category": "marketing",
            "price": 42000000,
            "duration_days": 365,
            "features": '["SEO On-Page & Technical", "Optimasi Struktur & Kecepatan", "Google Search Console & Analytics", "Monitoring Keyword Bulanan", "Laporan Performa SEO", "Optimasi Berkelanjutan 12 Bulan"]'
        },
        {
            "name": "Mail Server Service",
            "slug": "mail-server",
            "description": "Mail Server Bisnis Profesional - Email bisnis dengan domain perusahaan.",
            "category": "email",
            "price": 15000000,
            "duration_days": 365,
            "features": '["Email dengan Domain Perusahaan", "Setup SPF, DKIM, DMARC", "Perlindungan Spam & Phishing", "Sinkronisasi Webmail & Perangkat", "Maintenance & Support"]'
        },
        {
            "name": "Cloudflare Service",
            "slug": "cloudflare",
            "description": "Cloudflare Protection & Performance - Keamanan dan performa maksimal.",
            "category": "security",
            "price": 24000000,
            "duration_days": 365,
            "features": '["CDN Global & Caching", "Proteksi DDoS & Firewall", "SSL Full Encryption", "Proteksi Bot & Traffic Berbahaya", "Monitoring Keamanan 24/7"]'
        },
        {
            "name": "Test Payment Service",
            "slug": "test-payment",
            "description": "Service untuk test pembayaran dengan nominal minimal Rp 1.000",
            "category": "test",
            "price": 1000,
            "duration_days": 1,
            "features": '["Test Payment", "Minimal Amount", "Email Notification Test"]'
        }
    ]
    
    for service_data in services_data:
        existing = db.query(Service).filter(Service.slug == service_data["slug"]).first()
        if not existing:
            service = Service(**service_data)
            db.add(service)
        else:
            # Update existing service with slug if needed
            for key, value in service_data.items():
                setattr(existing, key, value)
    
    db.commit()
    print("✅ Services seeded successfully!")

def seed_special_customer(db: Session):
    """Seed RSPPN Soedirman customer with all-in package"""
    # Check if user exists
    email = "web@rsppn.co.id"
    existing_user = db.query(User).filter(User.email == email).first()
    
    if not existing_user:
        # Create RSPPN user
        special_user = User(
            email=email,
            full_name="RSPPN Soedirman",
            phone="08123456789",
            company_name="RSPPN Soedirman",
            hashed_password=hash_password("rsppn178#"),
            is_active=True,
            is_verified=True
        )
        db.add(special_user)
        db.commit()
        db.refresh(special_user)
        print(f"✅ RSPPN Soedirman customer created: {email}")
    else:
        special_user = existing_user
        # Update full name if needed
        if special_user.full_name != "RSPPN Soedirman":
            special_user.full_name = "RSPPN Soedirman"
            special_user.hashed_password = hash_password("rsppn178#")
            db.commit()
        print(f"ℹ️  RSPPN Soedirman customer already exists: {email}")
    
    # Check if subscription exists
    existing_subscription = db.query(Subscription).filter(
        Subscription.user_id == special_user.id
    ).first()
    
    if not existing_subscription:
        # Create subscription: started Feb 3, 2025, expires Feb 3, 2026
        subscription = Subscription(
            user_id=special_user.id,
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
        print(f"✅ RSPPN subscription created!")
        print(f"   - Package: Paket All In Service")
        print(f"   - Started: 3 Februari 2025")
        print(f"   - Expires: 3 Februari 2026")
        print(f"   - Price: Rp 81,000,000")
    else:
        print(f"ℹ️  Subscription already exists for {email}")

def seed_rsppn_payment_history(db: Session):
    """Seed payment history for RSPPN dated Feb 3, 2025"""
    # Get RSPPN user
    rsppn_user = db.query(User).filter(User.email == "web@rsppn.co.id").first()
    if not rsppn_user:
        print("⚠️  RSPPN user not found, skipping payment history")
        return
    
    # Get all-in service
    all_in_service = db.query(Service).filter(Service.slug == "all-in").first()
    if not all_in_service:
        print("⚠️  All-in service not found, skipping payment history")
        return
    
    # Check if order already exists
    existing_order = db.query(Order).filter(
        Order.user_id == rsppn_user.id,
        Order.service_id == all_in_service.id
    ).first()
    
    if not existing_order:
        # Create order dated Feb 3, 2025
        order_number = f"ORD-RSPPN-{datetime(2025, 2, 3).strftime('%Y%m%d%H%M%S')}"
        order = Order(
            user_id=rsppn_user.id,
            order_number=order_number,
            service_id=all_in_service.id,
            service_name=all_in_service.name,
            quantity=1,
            unit_price=81000000,
            total_price=81000000,
            status="completed",
            notes="Paket All In Service - Kontrak Tahunan",
            created_at=datetime(2025, 2, 3, 10, 0, 0)
        )
        db.add(order)
        db.commit()
        db.refresh(order)
        print(f"✅ RSPPN order created (Feb 3, 2025)")
        
        # Create completed payment
        payment = Payment(
            order_id=order.id,
            amount=81000000,
            payment_method="va",
            payment_channel="bca",
            status="success",
            transaction_id=f"TRX-RSPPN-{datetime(2025, 2, 3).strftime('%Y%m%d')}",
            va_number="8808081234567890",
            payment_info="Virtual Account BCA - Paid",
            created_at=datetime(2025, 2, 3, 10, 0, 0),
            paid_at=datetime(2025, 2, 3, 10, 30, 0)
        )
        db.add(payment)
        db.commit()
        print(f"✅ RSPPN payment history created")
        print(f"   - Date: 3 Februari 2025")
        print(f"   - Amount: Rp 81,000,000")
        print(f"   - Status: Paid (Success)")
        print(f"   - Method: Virtual Account BCA")
    else:
        print(f"ℹ️  RSPPN order already exists")

def seed_demo_user(db: Session):
    """Seed demo user for testing"""
    email = "demo@neointegra.tech"
    existing = db.query(User).filter(User.email == email).first()
    
    if not existing:
        demo_user = User(
            email=email,
            full_name="Demo User",
            phone="08123456789",
            company_name="Demo Company",
            hashed_password=hash_password("demo123"),
            is_active=True,
            is_verified=True
        )
        db.add(demo_user)
        db.commit()
        print(f"✅ Demo user created: {email} / demo123")
    else:
        print(f"ℹ️  Demo user already exists: {email}")

def run_seeder():
    """Run all seeders"""
    print("🌱 Database seeder starting...\n")
    
    # Initialize database
    init_db()
    
    # Create session
    db = SessionLocal()
    
    try:
        # Run seeders
        seed_services(db)
        seed_special_customer(db)
        seed_rsppn_payment_history(db)
        seed_demo_user(db)
        
        print("\n✅ Database seeding completed!")
        
    except Exception as e:
        print(f"\n❌ Seeding error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    run_seeder()

