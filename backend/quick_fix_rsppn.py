"""
Simple direct fix for RSPPN password
"""
import bcrypt
from app.database import SessionLocal
from app.models import User

db = SessionLocal()

email = "web@rsppn.co.id"
password = "rsppn178#"

print(f"Fixing RSPPN user: {email}")

user = db.query(User).filter(User.email == email).first()

if user:
    print(f"User found. Updating password...")
    user.hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    user.full_name = "RSPPN Soedirman"
    user.company_name = "RSPPN Soedirman"
    user.is_active = True
    user.is_verified = True
    db.commit()
    
    # Verify
    if bcrypt.checkpw(password.encode('utf-8'), user.hashed_password.encode('utf-8')):
        print(f"✅ SUCCESS! Password is now: {password}")
        print(f"✅ You can now login with: {email}")
    else:
        print(f"❌ Verification failed")
else:
    print(f"❌ User not found. Creating...")
    new_user = User(
        email=email,
        full_name="RSPPN Soedirman",
        phone="08123456789",
        company_name="RSPPN Soedirman",
        hashed_password=bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
        is_active=True,
        is_verified=True
    )
    db.add(new_user)
    db.commit()
    print(f"✅ User created: {email} / {password}")

db.close()
