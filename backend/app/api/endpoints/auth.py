from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional
import secrets
import bcrypt
import jwt

from ...database import get_db
from ...models import User
from ...schemas import (
    UserCreate, UserLogin, UserResponse, Token,
    ForgotPasswordRequest, ResetPasswordRequest, VerifyEmailRequest, MessageResponse
)
from ...config import settings
from ...email import send_verification_email, send_password_reset_email

router = APIRouter(prefix="/auth", tags=["Authentication"])

# ============= HELPER FUNCTIONS =============
def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def get_current_user(token: str, db: Session):
    """Get current user from JWT token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            print("[Auth Error] Token payload missing 'sub' field")
            raise HTTPException(status_code=401, detail="Invalid token: missing email")
    except jwt.ExpiredSignatureError:
        print("[Auth Error] Token expired")
        raise HTTPException(status_code=401, detail="Token expired. Please login again.")
    except jwt.InvalidSignatureError:
        print("[Auth Error] Token signature invalid - SECRET_KEY mismatch?")
        raise HTTPException(status_code=401, detail="Invalid token signature")
    except jwt.PyJWTError as e:
        print(f"[Auth Error] JWT decode failed: {type(e).__name__}: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        print(f"[Auth Error] User not found in database: {email}")
        raise HTTPException(status_code=401, detail="User not found")
    return user

# Dependency for protected routes
async def get_current_active_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> User:
    """Dependency to get current active user from token"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401, 
            detail="Not authenticated. Please provide Authorization header."
        )
    
    token = authorization.replace("Bearer ", "")
    user = get_current_user(token, db)
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    return user

# ============= ENDPOINTS =============
@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register new user"""
    try:
        # Check if email exists
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=400, 
                detail="Email sudah terdaftar. Silakan gunakan email lain atau login."
            )
        
        # Create verification token
        verification_token = secrets.token_urlsafe(32)
        
        # Create new user
        new_user = User(
            email=user_data.email,
            full_name=user_data.full_name,
            phone=user_data.phone,
            company_name=user_data.company_name,
            hashed_password=hash_password(user_data.password),
            is_active=True,  # Auto-activate or require email verification
            is_verified=False,
            verification_token=verification_token
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Send verification email
        try:
            send_verification_email(new_user.email, verification_token)
        except Exception as e:
            print(f"Failed to send verification email: {e}")
        
        # Create access token
        access_token = create_access_token(data={"sub": new_user.email})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": new_user
        }
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        print(f"Registration error: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Registrasi gagal: {str(e)}")

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login user"""
    # Find user
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Account is inactive")
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/verify-email", response_model=MessageResponse)
async def verify_email(request: VerifyEmailRequest, db: Session = Depends(get_db)):
    """Verify user email"""
    user = db.query(User).filter(User.verification_token == request.token).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid verification token")
    
    user.is_verified = True
    user.verification_token = None
    db.commit()
    
    return {"message": "Email verified successfully"}

@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Request password reset"""
    print(f"[Forgot Password] Request received for email: {request.email}")
    
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        print(f"[Forgot Password] User not found for email: {request.email}")
        # Don't reveal if email exists for security
        return {"message": "If email exists, reset link has been sent"}
    
    print(f"[Forgot Password] User found: {user.email} (ID: {user.id})")
    
    # Create reset token
    reset_token = secrets.token_urlsafe(32)
    user.reset_token = reset_token
    user.reset_token_expires = datetime.utcnow() + timedelta(hours=1)
    db.commit()
    
    print(f"[Forgot Password] Reset token created, expires: {user.reset_token_expires}")
    
    # Send reset email
    try:
        send_password_reset_email(user.email, reset_token)
        print(f"[Forgot Password] Reset email sent successfully to {user.email}")
    except Exception as e:
        print(f"[Forgot Password] ❌ Failed to send reset email: {e}")
        import traceback
        traceback.print_exc()
        # Still return success to not reveal if email exists
    
    return {"message": "If email exists, reset link has been sent"}

@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Reset password with token"""
    user = db.query(User).filter(User.reset_token == request.token).first()
    if not user or not user.reset_token_expires or user.reset_token_expires < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    # Update password
    user.hashed_password = hash_password(request.new_password)
    user.reset_token = None
    user.reset_token_expires = None
    db.commit()
    
    return {"message": "Password reset successfully"}

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    """Get current user information from token"""
    return current_user
