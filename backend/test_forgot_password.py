import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import get_db, engine
from app.models import Base, User
from sqlalchemy.orm import Session
from app.email import send_password_reset_email
from dotenv import load_dotenv

load_dotenv()

# Create tables
Base.metadata.create_all(bind=engine)

# Get database session
db = next(get_db())

# Test email
test_email = "rsppnprogrammer@gmail.com"

print(f"🔄 Testing forgot password flow for: {test_email}")
print()

# Check if user exists, if not create one
user = db.query(User).filter(User.email == test_email).first()
if not user:
    print(f"📝 Creating test user: {test_email}")
    from passlib.context import CryptContext
    
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    user = User(
        email=test_email,
        full_name="Test User",
        hashed_password=pwd_context.hash("TestPassword123!"),
        is_verified=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    print(f"✅ User created with ID: {user.id}")
else:
    print(f"✅ User found with ID: {user.id}")

print()

# Generate reset token
import secrets
reset_token = secrets.token_urlsafe(32)

# Update user with reset token
print(f"🔄 Generating reset token...")
user.reset_token = reset_token
db.commit()
print(f"✅ Reset token: {reset_token[:20]}...")

print()

# Send reset email
print(f"📧 Sending password reset email...")
try:
    result = send_password_reset_email(user.email, reset_token)
    if result:
        print(f"✅ Password reset email sent successfully!")
        print(f"\nReset link:")
        print(f"https://neointegratech.com/reset-password?token={reset_token}")
        print()
        print(f"Check your email: {test_email}")
    else:
        print(f"❌ Failed to send email")
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()

db.close()
