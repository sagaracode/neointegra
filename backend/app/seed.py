"""
Database seeder for initial data
Run: python -m app.seed
"""
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import bcrypt

from .database import SessionLocal, init_db
from .models import User, Service, Subscription

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def seed_services(db: Session):
    """Seed initial services"""
    services_data = [
        {
            "name": "Jual Beli Domain",
            "description": "Registrasi dan transfer domain dengan 500+ TLD tersedia. Harga kompetitif dengan proses cepat.",
            "category": "domain",
            "price": 99000,
            "duration_days": 365,
            "features": '["500+ TLD", "DNS Management", "Transfer Mudah", "WHOIS Privacy"]'
        },
        {
            "name": "Langganan Cloudflare",
            "description": "CDN & Security premium dari Cloudflare untuk performa dan keamanan website optimal.",
            "category": "security",
            "price": 200000,
            "duration_days": 30,
            "features": '["CDN Global", "SSL/TLS", "DDoS Protection", "Web Analytics"]'
        },
        {
            "name": "Hosting",
            "description": "High-performance hosting dengan SSD NVMe, 99.9% uptime guarantee, dan support 24/7.",
            "category": "hosting",
            "price": 50000,
            "duration_days": 30,
            "features": '["SSD NVMe", "Free SSL", "99.9% Uptime", "Daily Backup"]'
        },
        {
            "name": "Mail Server",
            "description": "Email hosting profesional dengan custom domain untuk branding bisnis yang lebih baik.",
            "category": "email",
            "price": 25000,
            "duration_days": 30,
            "features": '["Custom Domain", "Unlimited Alias", "Anti-Spam", "Mobile Sync"]'
        },
        {
            "name": "SEO Service",
            "description": "Optimasi mesin pencari profesional untuk meningkatkan visibilitas dan traffic website Anda.",
            "category": "marketing",
            "price": 1500000,
            "duration_days": 30,
            "features": '["Keyword Research", "Link Building", "On-Page SEO", "Monthly Report"]'
        }
    ]
    
    for service_data in services_data:
        existing = db.query(Service).filter(Service.name == service_data["name"]).first()
        if not existing:
            service = Service(**service_data)
            db.add(service)
    
    db.commit()
    print("✅ Services seeded successfully!")

def seed_special_customer(db: Session):
    """Seed special customer with expiring subscription"""
    # Check if user exists
    email = "web@rsppn.co.id"
    existing_user = db.query(User).filter(User.email == email).first()
    
    if not existing_user:
        # Create special user
        special_user = User(
            email=email,
            full_name="RSPPN Customer",
            phone="08123456789",
            company_name="RSPPN",
            hashed_password=hash_password("soedirman178#"),
            is_active=True,
            is_verified=True
        )
        db.add(special_user)
        db.commit()
        db.refresh(special_user)
        print(f"✅ Special customer created: {email}")
    else:
        special_user = existing_user
        print(f"ℹ️  Special customer already exists: {email}")
    
    # Check if subscription exists
    existing_subscription = db.query(Subscription).filter(
        Subscription.user_id == special_user.id
    ).first()
    
    if not existing_subscription:
        # Create subscription that expires on Jan 28, 2026
        subscription = Subscription(
            user_id=special_user.id,
            package_name="Paket All In One",
            package_type="yearly",
            start_date=datetime(2025, 1, 28),
            end_date=datetime(2026, 1, 28),
            price=81000000,
            renewal_price=81000000,
            is_active=True,
            status="active",
            features='["Unlimited Users", "24/7 Support", "Custom Features", "Priority Updates"]'
        )
        db.add(subscription)
        db.commit()
        print(f"✅ Expiring subscription created!")
        print(f"   - Package: Paket All In One")
        print(f"   - Expires: 28 Januari 2026")
        print(f"   - Price: Rp 81,000,000")
    else:
        print(f"ℹ️  Subscription already exists for {email}")

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
        seed_demo_user(db)
        
        print("\n✅ Database seeding completed!")
        
    except Exception as e:
        print(f"\n❌ Seeding error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    run_seeder()

