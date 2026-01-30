"""
URGENT FIX: Reset RSPPN password directly
This script will force update the RSPPN user password regardless of current state
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import bcrypt
from app.database import SessionLocal, init_db
from app.models import User

def force_fix_rsppn():
    """Force fix RSPPN user credentials"""
    print("=" * 60)
    print("RSPPN PASSWORD RESET - FORCE UPDATE")
    print("=" * 60)
    
    # Initialize database
    init_db()
    db = SessionLocal()
    
    try:
        email = "web@rsppn.co.id"
        password = "rsppn178#"
        
        # Find user
        user = db.query(User).filter(User.email == email).first()
        
        if user:
            print(f"\n✅ User found: {email}")
            print(f"   Current full_name: {user.full_name}")
            print(f"   Current company: {user.company_name}")
            print(f"   Current is_active: {user.is_active}")
            print(f"   Current is_verified: {user.is_verified}")
            
            # Force update everything
            print(f"\n🔄 Updating user credentials...")
            user.full_name = "RSPPN Soedirman"
            user.company_name = "RSPPN Soedirman"
            user.hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            user.is_active = True
            user.is_verified = True
            
            db.commit()
            db.refresh(user)
            
            print(f"✅ User updated successfully!")
            print(f"\n📋 New credentials:")
            print(f"   Email: {email}")
            print(f"   Password: {password}")
            print(f"   Full Name: {user.full_name}")
            print(f"   Company: {user.company_name}")
            print(f"   Active: {user.is_active}")
            print(f"   Verified: {user.is_verified}")
            
            # Verify password immediately
            print(f"\n🔍 Verifying password...")
            if bcrypt.checkpw(password.encode('utf-8'), user.hashed_password.encode('utf-8')):
                print(f"✅ Password verification PASSED!")
                print(f"\n✅ LOGIN SHOULD NOW WORK!")
            else:
                print(f"❌ Password verification FAILED!")
                return False
                
        else:
            print(f"\n❌ User NOT FOUND: {email}")
            print(f"🔄 Creating new user...")
            
            # Create new user
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
            db.refresh(new_user)
            
            print(f"✅ User created successfully!")
            print(f"\n📋 Credentials:")
            print(f"   Email: {email}")
            print(f"   Password: {password}")
        
        print(f"\n" + "=" * 60)
        print("✅ FIX COMPLETED - TRY LOGIN NOW!")
        print("=" * 60)
        return True
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    success = force_fix_rsppn()
    sys.exit(0 if success else 1)
