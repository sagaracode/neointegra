from fastapi import APIRouter, Depends, HTTPException, Header, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import httpx
import hashlib
import json

from ...database import get_db
from ...models import Payment, Order
from ...schemas import PaymentCreate, PaymentResponse, PaymentCallbackRequest, MessageResponse
from ...config import settings
from .auth import get_current_user

router = APIRouter(prefix="/payments", tags=["Payments"])

def get_user_from_token(authorization: Optional[str], db: Session):
    """Extract user from authorization header"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.replace("Bearer ", "")
    return get_current_user(token, db)

def generate_ipaymu_signature(body: dict, method: str = "POST") -> str:
    """Generate iPaymu signature for API request"""
    va = settings.IPAYMU_VA
    api_key = settings.IPAYMU_API_KEY
    
    # Create signature string
    body_json = json.dumps(body, separators=(',', ':'))
    string_to_sign = f"{method.upper()}:{va}:{body_json}:{api_key}"
    
    # Generate SHA256 hash
    signature = hashlib.sha256(string_to_sign.encode()).hexdigest()
    return signature

async def create_ipaymu_payment(payment_data: dict, payment_method: str):
    """Create payment via iPaymu API"""
    url = f"{settings.IPAYMU_BASE_URL}/payment"
    
    # Prepare request body based on payment method
    if payment_method == "va":
        body = {
            "name": payment_data["name"],
            "phone": payment_data["phone"],
            "email": payment_data["email"],
            "amount": int(payment_data["amount"]),
            "notifyUrl": payment_data["notify_url"],
            "expired": payment_data["expired"],
            "expiredType": "hours",
            "paymentMethod": "va",
            "paymentChannel": payment_data["payment_channel"]
        }
    elif payment_method == "qris":
        body = {
            "name": payment_data["name"],
            "phone": payment_data["phone"],
            "email": payment_data["email"],
            "amount": int(payment_data["amount"]),
            "notifyUrl": payment_data["notify_url"],
            "expired": payment_data["expired"],
            "expiredType": "hours",
            "paymentMethod": "qris"
        }
    else:
        raise ValueError(f"Unsupported payment method: {payment_method}")
    
    # Generate signature
    signature = generate_ipaymu_signature(body, "POST")
    
    # Prepare headers
    headers = {
        "Content-Type": "application/json",
        "va": settings.IPAYMU_VA,
        "signature": signature,
        "timestamp": str(int(datetime.now().timestamp()))
    }
    
    # Make API request
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=body, headers=headers, timeout=30.0)
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"iPaymu API error: {response.text}"
            )
        
        result = response.json()
        
        if result.get("Status") != 200:
            raise HTTPException(
                status_code=400,
                detail=f"iPaymu error: {result.get('Message', 'Unknown error')}"
            )
        
        return result.get("Data", {})

@router.post("/", response_model=PaymentResponse, status_code=201)
async def create_payment(
    payment_data: PaymentCreate,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Create new payment for an order"""
    user = get_user_from_token(authorization, db)
    
    # Verify order exists and belongs to user
    order = db.query(Order).filter(Order.id == payment_data.order_id, Order.user_id == user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Create payment record
    new_payment = Payment(
        order_id=order.id,
        payment_method=payment_data.payment_method,
        payment_channel=payment_data.payment_channel,
        amount=payment_data.amount,
        status="pending",
        expired_at=datetime.utcnow() + timedelta(hours=24)
    )
    
    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)
    
    # Create payment via iPaymu if not COD
    if payment_data.payment_method != "cod":
        try:
            ipaymu_data = {
                "name": user.full_name,
                "phone": user.phone or "08123456789",
                "email": user.email,
                "amount": payment_data.amount,
                "notify_url": f"{settings.FRONTEND_URL}/api/payments/callback",
                "expired": 24,
                "payment_channel": payment_data.payment_channel
            }
            
            ipaymu_response = await create_ipaymu_payment(ipaymu_data, payment_data.payment_method)
            
            # Update payment with iPaymu data
            new_payment.ipaymu_transaction_id = ipaymu_response.get("TransactionId")
            new_payment.ipaymu_session_id = ipaymu_response.get("SessionID")
            new_payment.payment_url = ipaymu_response.get("Url")
            
            if payment_data.payment_method == "qris":
                new_payment.qr_code_url = ipaymu_response.get("QRImage")
            elif payment_data.payment_method == "va":
                new_payment.va_number = ipaymu_response.get("Va")
            
            db.commit()
            db.refresh(new_payment)
            
        except Exception as e:
            print(f"iPaymu API Error: {str(e)}")
            # Don't fail the whole request, payment can be processed manually
            new_payment.status = "pending"
            db.commit()
    else:
        # COD payment - mark as pending
        order.status = "pending"
        db.commit()
    
    return new_payment

@router.get("/order/{order_id}", response_model=List[PaymentResponse])
async def get_order_payments(
    order_id: int,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Get all payments for an order"""
    user = get_user_from_token(authorization, db)
    
    # Verify order belongs to user
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    payments = db.query(Payment).filter(Payment.order_id == order_id).all()
    return payments

@router.get("/{payment_id}", response_model=PaymentResponse)
async def get_payment(
    payment_id: int,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Get specific payment"""
    user = get_user_from_token(authorization, db)
    
    payment = db.query(Payment).join(Order).filter(
        Payment.id == payment_id,
        Order.user_id == user.id
    ).first()
    
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    return payment

@router.post("/callback", response_model=MessageResponse)
async def payment_callback(request: Request, db: Session = Depends(get_db)):
    """Handle iPaymu payment callback"""
    try:
        # Get callback data
        body = await request.json()
        
        trx_id = body.get("trx_id")
        status = body.get("status")
        status_code = body.get("status_code")
        
        # Find payment by transaction ID
        payment = db.query(Payment).filter(Payment.ipaymu_transaction_id == trx_id).first()
        
        if not payment:
            return {"message": "Payment not found"}
        
        # Update payment status
        if status_code == "1":  # Success
            payment.status = "success"
            payment.paid_at = datetime.utcnow()
            
            # Update order status
            order = db.query(Order).filter(Order.id == payment.order_id).first()
            if order:
                order.status = "paid"
        
        elif status_code == "0":  # Pending
            payment.status = "pending"
        
        else:  # Failed or expired
            payment.status = "failed"
        
        db.commit()
        
        return {"message": "Callback processed"}
    
    except Exception as e:
        print(f"Callback error: {str(e)}")
        return {"message": "Callback error"}
