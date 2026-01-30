"""
Check and fix RSPPN user credentials
"""
import bcrypt
from app.database import SessionLocal
from app.models import User

def check_rsppn_user():
    db = SessionLocal()
    try:
        # Find RSPPN user
        user = db.query(User).filter(User.email == "web@rsppn.co.id").first()
        
        if user:
            print(f"✅ User found:")
            print(f"   - Email: {user.email}")
            print(f"   - Full Name: {user.full_name}")
            print(f"   - Is Active: {user.is_active}")
            print(f"   - Is Verified: {user.is_verified}")
            print(f"   - Company: {user.company_name}")
            
            # Test password
            password = "rsppn178#"
            if bcrypt.checkpw(password.encode('utf-8'), user.hashed_password.encode('utf-8')):
                print(f"✅ Password 'rsppn178#' is correct!")
            else:
                print(f"❌ Password 'rsppn178#' is WRONG!")
                print(f"   - Updating password...")
                
                # Update password
                new_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                user.hashed_password = new_hash
                db.commit()
                print(f"✅ Password updated successfully!")
        else:
            print(f"❌ User web@rsppn.co.id NOT FOUND!")
            print(f"   - Creating user...")
            
            # Create user
            new_user = User(
                email="web@rsppn.co.id",
                full_name="RSPPN Soedirman",
                phone="08123456789",
                company_name="RSPPN Soedirman",
                hashed_password=bcrypt.hashpw("rsppn178#".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
                is_active=True,
                is_verified=True
            )
            db.add(new_user)
            db.commit()
            print(f"✅ User created successfully!")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    check_rsppn_user()
