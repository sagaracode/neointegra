from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from ...database import get_db
from ...models import Order, Service, User
from ...schemas import OrderCreate, OrderCreateSimple, OrderResponse
from ...email import send_order_confirmation_email
from .auth import get_current_user

router = APIRouter(prefix="/orders", tags=["Orders"])

def get_user_from_token(authorization: Optional[str], db: Session) -> User:
    """Extract user from authorization header"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.replace("Bearer ", "")
    return get_current_user(token, db)

def generate_order_number() -> str:
    """Generate unique order number"""
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    return f"ORD-{timestamp}"

@router.post("/", response_model=OrderResponse, status_code=201)
async def create_order(
    order_data: OrderCreateSimple,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Create new order with service slug (simplified)"""
    user = get_user_from_token(authorization, db)
    
    # Find service by slug
    service = db.query(Service).filter(Service.slug == order_data.service_slug).first()
    if not service:
        raise HTTPException(status_code=404, detail=f"Service dengan slug '{order_data.service_slug}' tidak ditemukan")
    
    # Calculate prices
    unit_price = service.price
    total_price = unit_price * order_data.quantity
    
    # Create order
    new_order = Order(
        user_id=user.id,
        order_number=generate_order_number(),
        service_id=service.id,
        service_name=service.name,
        quantity=order_data.quantity,
        unit_price=unit_price,
        total_price=total_price,
        notes=order_data.notes,
        status="pending"
    )
    
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    
    # Send order confirmation email
    try:
        send_order_confirmation_email(
            to_email=user.email,
            order_data={
                'customer_name': user.full_name,
                'order_number': new_order.order_number,
                'service_name': service.name,
                'quantity': order_data.quantity,
                'total_amount': total_price,
                'status': 'pending'
            }
        )
    except Exception as e:
        print(f"Failed to send order confirmation email: {str(e)}")
        # Don't fail the order creation if email fails
    
    return new_order

@router.post("/full", response_model=OrderResponse, status_code=201)
async def create_order_full(
    order_data: OrderCreate,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Create new order with full details (backward compatibility)"""
    user = get_user_from_token(authorization, db)
    
    # Verify service exists if service_id provided
    if order_data.service_id:
        service = db.query(Service).filter(Service.id == order_data.service_id).first()
        if not service:
            raise HTTPException(status_code=404, detail="Service not found")
    
    # Create order
    new_order = Order(
        user_id=user.id,
        order_number=generate_order_number(),
        service_id=order_data.service_id,
        service_name=order_data.service_name,
        quantity=order_data.quantity,
        unit_price=order_data.unit_price,
        total_price=order_data.total_price,
        notes=order_data.notes,
        status="pending"
    )
    
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    
    return new_order

@router.get("/", response_model=List[OrderResponse])
async def get_my_orders(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Get all orders for current user"""
    user = get_user_from_token(authorization, db)
    orders = db.query(Order).filter(Order.user_id == user.id).order_by(Order.created_at.desc()).all()
    return orders

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Get specific order"""
    user = get_user_from_token(authorization, db)
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == user.id).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return order

@router.get("/number/{order_number}", response_model=OrderResponse)
async def get_order_by_number(
    order_number: str,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Get order by order number"""
    user = get_user_from_token(authorization, db)
    order = db.query(Order).filter(
        Order.order_number == order_number,
        Order.user_id == user.id
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return order
