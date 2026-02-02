from app.database import SessionLocal
from app.models import Service

db = SessionLocal()
service = db.query(Service).filter(Service.slug == 'test-payment').first()

if service:
    print(f"✅ Service found: {service.name}")
    print(f"💰 Price: Rp {service.price:,}")
    print(f"📝 Description: {service.description}")
else:
    print("❌ Service NOT FOUND")
    print("\nAvailable services:")
    all_services = db.query(Service).all()
    for s in all_services:
        print(f"  - {s.slug}: {s.name} (Rp {s.price:,})")

db.close()
