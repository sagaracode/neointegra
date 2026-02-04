from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import Optional

from ...database import get_db
from ...models import User
from ...schemas import UserResponse, UserUpdate
from .auth import get_current_user, hash_password

router = APIRouter(prefix="/users", tags=["Users"])

def get_user_from_token(authorization: Optional[str], db: Session) -> User:
    """Extract user from authorization header"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.replace("Bearer ", "")
    return get_current_user(token, db)

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Get current user profile"""
    user = get_user_from_token(authorization, db)
    return user

@router.get("/{user_id}", response_model=UserResponse)
async def get_user_profile(
    user_id: int,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Get user profile by ID (only own profile)"""
    current_user = get_user_from_token(authorization, db)
    
    # Users can only view their own profile
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return current_user

@router.put("/profile", response_model=UserResponse)
async def update_user_profile(
    user_data: UserUpdate,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Update current user profile"""
    user = get_user_from_token(authorization, db)
    
    # Update fields if provided
    if user_data.full_name is not None:
        user.full_name = user_data.full_name
    
    if user_data.phone is not None:
        user.phone = user_data.phone
    
    if user_data.company_name is not None:
        user.company_name = user_data.company_name
    
    if user_data.password is not None:
        # Validate password length
        if len(user_data.password) < 8:
            raise HTTPException(status_code=400, detail="Password minimal 8 karakter")
        user.hashed_password = hash_password(user_data.password)
    
    db.commit()
    db.refresh(user)
    
    return user
