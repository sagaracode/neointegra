from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta

from ...database import get_db
from ...models import Subscription, Order, User
from ...schemas import SubscriptionResponse, SubscriptionRenewalCreate, MessageResponse
from ...email import send_order_confirmation_email
from ...timezone import now_jakarta
from .auth import get_current_user

router = APIRouter(prefix="/subscriptions", tags=["Subscriptions"])

def get_user_from_token(authorization: Optional[str], db: Session) -> User:
    """Extract user from authorization header"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.replace("Bearer ", "")
    return get_current_user(token, db)

@router.get("/my-subscriptions", response_model=List[SubscriptionResponse])
async def get_my_subscriptions(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Get all subscriptions for current user"""
    user = get_user_from_token(authorization, db)
    subscriptions = db.query(Subscription).filter(
        Subscription.user_id == user.id
    ).order_by(Subscription.created_at.desc()).all()
    return subscriptions

@router.get("/expiring-soon", response_model=List[SubscriptionResponse])
async def get_expiring_subscriptions(
    authorization: Optional[str] = Header(None),
    days: int = 30,
    db: Session = Depends(get_db)
):
    """Get subscriptions expiring within specified days (default 30)"""
    user = get_user_from_token(authorization, db)
    
    expiry_threshold = datetime.utcnow() + timedelta(days=days)
    
    subscriptions = db.query(Subscription).filter(
        Subscription.user_id == user.id,
        Subscription.is_active == True,
        Subscription.end_date <= expiry_threshold,
        Subscription.end_date >= datetime.utcnow()
    ).all()
    
    return subscriptions

@router.get("/{subscription_id}", response_model=SubscriptionResponse)
async def get_subscription(
    subscription_id: int,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Get specific subscription"""
    user = get_user_from_token(authorization, db)
    
    subscription = db.query(Subscription).filter(
        Subscription.id == subscription_id,
        Subscription.user_id == user.id
    ).first()
    
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    return subscription

@router.post("/renew/{subscription_id}")
async def renew_subscription(
    subscription_id: int,
    renewal_data: SubscriptionRenewalCreate,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Create renewal order for a subscription"""
    user = get_user_from_token(authorization, db)
    
    # Get subscription
    subscription = db.query(Subscription).filter(
        Subscription.id == subscription_id,
        Subscription.user_id == user.id
    ).first()
    
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    # Determine renewal price
    renewal_price = subscription.renewal_price if subscription.renewal_price else subscription.price
    
    # Generate order number (Jakarta time)
    timestamp = now_jakarta().strftime("%Y%m%d-%H%M%S")
    order_number = f"ORD-{timestamp}"
    
    # Create renewal order
    renewal_order = Order(
        user_id=user.id,
        order_number=order_number,
        service_name=f"Renewal: {subscription.package_name}",
        quantity=1,
        unit_price=renewal_price,
        total_price=renewal_price,
        status="pending",
        subscription_id=subscription_id,
        notes=f"Subscription renewal for {subscription.package_name}"
    )
    
    db.add(renewal_order)
    db.commit()
    db.refresh(renewal_order)
    
    # Send order confirmation email
    try:
        send_order_confirmation_email(
            to_email=user.email,
            order_data={
                'customer_name': user.full_name,
                'order_number': renewal_order.order_number,
                'service_name': renewal_order.service_name,
                'quantity': 1,
                'total_amount': renewal_price,
                'status': 'pending'
            }
        )
        print(f"✅ [Renewal] Email sent to {user.email} for order {renewal_order.order_number}")
    except Exception as e:
        print(f"❌ [Renewal] Failed to send email: {str(e)}")
        import traceback
        traceback.print_exc()
        # Don't fail the renewal if email fails
    
    return {
        "message": "Renewal order created successfully",
        "order_id": renewal_order.id,
        "order_number": renewal_order.order_number,
        "order": {
            "id": renewal_order.id,
            "order_number": renewal_order.order_number,
            "total_price": renewal_order.total_price,
            "service_name": renewal_order.service_name,
            "status": renewal_order.status
        },
        "total": renewal_price,
        "subscription_id": subscription_id,
        "payment_method": renewal_data.payment_method,
        "payment_channel": renewal_data.payment_channel
    }
