from fastapi import APIRouter, Depends, HTTPException, Header, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import httpx
import hashlib
import hmac
import json

from ...database import get_db
from ...models import Payment, Order, Service
from ...schemas import PaymentCreate, PaymentResponse, PaymentCallbackRequest, MessageResponse
from ...config import settings
from ...email import send_payment_pending_email, send_payment_confirmation_email
from .auth import get_current_user

router = APIRouter(prefix="/payments", tags=["Payments"])

def get_user_from_token(authorization: Optional[str], db: Session):
    """Extract user from authorization header"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.replace("Bearer ", "")
    return get_current_user(token, db)

def generate_ipaymu_signature(body: dict, method: str = "POST") -> str:
    """Generate iPaymu signature according to official documentation v2
    
    Format: HMAC-SHA256(StringToSign, ApiKey)
    StringToSign = HTTPMethod:VaNumber:Lowercase(SHA-256(RequestBody)):ApiKey
    
    - HTTPMethod: POST or GET (UPPERCASE)
    - VaNumber: VA iPaymu
    - RequestBody: JSON body, hashed with SHA-256, then lowercased
    - ApiKey: Your API Key
    """
    va = settings.IPAYMU_VA
    api_key = settings.IPAYMU_API_KEY
    
    # Step 1: Create JSON body (no spaces after colon)
    body_json = json.dumps(body, separators=(',', ':'))
    
    # Step 2: Hash body with SHA-256 and lowercase it
    body_hash = hashlib.sha256(body_json.encode()).hexdigest().lower()
    
    # Step 3: Create string to sign: METHOD:VA:BODY_HASH:APIKEY
    string_to_sign = f"{method.upper()}:{va}:{body_hash}:{api_key}"
    
    # Step 4: Generate HMAC-SHA256 signature using ApiKey as secret
    signature = hmac.new(
        api_key.encode(),
        string_to_sign.encode(),
        hashlib.sha256
    ).hexdigest()
    
    print(f"[iPaymu Signature Debug v2]")
    print(f"  VA: {va}")
    print(f"  API Key: {api_key[:20]}...")
    print(f"  Body JSON: {body_json[:100]}...")
    print(f"  Body Hash (SHA256 lowercase): {body_hash}")
    print(f"  String to sign: {string_to_sign[:150]}...")
    print(f"  Signature (HMAC-SHA256): {signature}")
    
    return signature

async def create_ipaymu_payment(payment_data: dict, payment_method: str):
    """Create payment via iPaymu API"""
    url = f"{settings.IPAYMU_BASE_URL}/payment"
    
    # Prepare product list for iPaymu
    # Get quantity from payment_data, default to 1
    quantity = payment_data.get("quantity", 1)
    unit_price = int(payment_data["amount"]) // quantity if quantity > 0 else int(payment_data["amount"])
    
    product_list = payment_data.get("product", [
        {
            "name": payment_data.get("product_name", "Layanan NeoIntegra Tech"),
            "price": unit_price,
            "qty": quantity
        }
    ])
    
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
            "paymentChannel": payment_data["payment_channel"],
            "product": product_list
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
            "paymentMethod": "qris",
            "product": product_list
        }
    else:
        raise ValueError(f"Unsupported payment method: {payment_method}")
    
    # Generate signature
    signature = generate_ipaymu_signature(body, "POST")
    
    # Generate timestamp in format YYYYMMDDhhmmss
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    
    # Debug print
    print(f"[iPaymu Request] Method: {payment_method}")
    print(f"[iPaymu Request] Body: {body}")
    print(f"[iPaymu Request] Signature: {signature}")
    print(f"[iPaymu Request] Timestamp: {timestamp}")
    
    # Prepare headers
    headers = {
        "Content-Type": "application/json",
        "va": settings.IPAYMU_VA,
        "signature": signature,
        "timestamp": timestamp
    }
    
    # Make API request
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=body, headers=headers, timeout=30.0)
        
        print(f"[iPaymu Response] Status: {response.status_code}")
        print(f"[iPaymu Response] Body: {response.text[:500]}")
        
        if response.status_code != 200:
            error_detail = response.text
            print(f"[iPaymu Error] HTTP {response.status_code}: {error_detail}")
            raise HTTPException(
                status_code=response.status_code,
                detail=f"iPaymu API error (HTTP {response.status_code}): {error_detail}"
            )
        
        result = response.json()
        
        if result.get("Status") != 200:
            error_msg = result.get('Message', 'Unknown error')
            error_data = result.get('Data')
            print(f"[iPaymu Error] Status {result.get('Status')}: {error_msg}, Data: {error_data}")
            raise HTTPException(
                status_code=400,
                detail=f"iPaymu error: {error_msg}"
            )
        
        print(f"[iPaymu Success] TransactionId: {result.get('Data', {}).get('TransactionId')}")
        print(f"[iPaymu Success] Payment URL: {result.get('Data', {}).get('Url')}")
        
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
            # Get service name from order
            service = db.query(Service).filter(Service.id == order.service_id).first()
            service_name = service.name if service else "Layanan NeoIntegra Tech"
            
            ipaymu_data = {
                "name": user.full_name,
                "phone": user.phone or "08123456789",
                "email": user.email,
                "amount": payment_data.amount,
                "notify_url": f"{settings.BACKEND_URL}/api/payments/callback",
                "return_url": f"{settings.FRONTEND_URL}/payment/success?order_id={order.id}&order_number={order.order_number}&amount={payment_data.amount}",
                "expired": 24,
                "payment_channel": payment_data.payment_channel,
                "product_name": service_name,
                "quantity": order.quantity
            }
            
            print(f"[Payment Creation] Calling iPaymu API for order {order.order_number}, amount: Rp {payment_data.amount:,.0f}")
            
            ipaymu_response = await create_ipaymu_payment(ipaymu_data, payment_data.payment_method)
            
            # Update payment with iPaymu data
            new_payment.ipaymu_transaction_id = ipaymu_response.get("TransactionId")
            new_payment.ipaymu_session_id = ipaymu_response.get("SessionID")
            new_payment.payment_url = ipaymu_response.get("Url")
            
            if payment_data.payment_method == "qris":
                new_payment.qr_code_url = ipaymu_response.get("QRImage")
            elif payment_data.payment_method == "va":
                new_payment.va_number = ipaymu_response.get("Va")
            
            if not new_payment.payment_url:
                print(f"[Payment Creation Warning] No payment_url in response!")
                print(f"[Payment Creation Warning] Response: {ipaymu_response}")
            
            db.commit()
            db.refresh(new_payment)
            
            print(f"[Payment Creation] Success! Payment ID: {new_payment.id}, URL: {new_payment.payment_url}")
            
            # Send payment pending email with payment instructions
            try:
                send_payment_pending_email(
                    to_email=user.email,
                    payment_data={
                        'customer_name': user.full_name,
                        'order_number': order.order_number,
                        'amount': payment_data.amount,
                        'payment_method': payment_data.payment_method,
                        'payment_channel': payment_data.payment_channel,
                        'payment_url': new_payment.payment_url,
                        'va_number': new_payment.va_number,
                        'qr_code_url': new_payment.qr_code_url
                    }
                )
            except Exception as e:
                print(f"Failed to send payment pending email: {str(e)}")
            
        except HTTPException as e:
            # iPaymu API error - delete payment record and re-raise
            db.delete(new_payment)
            db.commit()
            print(f"[Payment Creation Error] iPaymu API failed: {e.detail}")
            raise
        except Exception as e:
            # Unexpected error - delete payment record
            db.delete(new_payment)
            db.commit()
            print(f"[Payment Creation Error] Unexpected error: {str(e)}")
            import traceback
            traceback.print_exc()
            raise HTTPException(
                status_code=500,
                detail=f"Payment creation failed: {str(e)}"
            )
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
    """Handle iPaymu payment callback - supports both JSON and form-urlencoded"""
    try:
        # Get callback data - support both JSON and form-urlencoded
        content_type = request.headers.get("content-type", "")
        
        if "application/json" in content_type:
            # JSON format
            body = await request.json()
        else:
            # Form-urlencoded format (default)
            form_data = await request.form()
            body = dict(form_data)
        
        print(f"[iPaymu Callback] Received: {body}")
        
        trx_id = body.get("trx_id")
        status = body.get("status")
        status_code = body.get("status_code")
        
        # Find payment by transaction ID
        payment = db.query(Payment).filter(Payment.ipaymu_transaction_id == trx_id).first()
        
        if not payment:
            print(f"[iPaymu Callback] Payment not found for trx_id: {trx_id}")
            return {"message": "Payment not found"}
        
        print(f"[iPaymu Callback] Processing payment ID {payment.id}, status_code: {status_code}")
        
        # Update payment status
        if status_code == "1":  # Success
            payment.status = "success"
            payment.paid_at = datetime.utcnow()
            
            # Update order status
            order = db.query(Order).filter(Order.id == payment.order_id).first()
            if order:
                order.status = "paid"
                print(f"[iPaymu Callback] Order {order.order_number} marked as paid")
                
                # Send payment confirmation email
                try:
                    user = db.query(Order).join(Order).filter(Order.id == order.id).first().user
                    send_payment_confirmation_email(
                        to_email=user.email,
                        payment_data={
                            'customer_name': user.full_name,
                            'order_number': order.order_number,
                            'amount': payment.amount,
                            'payment_method': payment.payment_method,
                            'status': 'success',
                            'transaction_id': payment.ipaymu_transaction_id
                        }
                    )
                    print(f"[iPaymu Callback] Payment confirmation email sent to {user.email}")
                except Exception as e:
                    print(f"[iPaymu Callback] Failed to send confirmation email: {str(e)}")
        
        elif status_code == "0":  # Pending
            payment.status = "pending"
            print(f"[iPaymu Callback] Payment still pending")
        
        else:  # Failed or expired
            payment.status = "failed"
            print(f"[iPaymu Callback] Payment failed with status_code: {status_code}")
        
        db.commit()
        
        return {"message": "Callback processed"}
    
    except Exception as e:
        print(f"[iPaymu Callback Error] {str(e)}")
        import traceback
        traceback.print_exc()
        return {"message": "Callback error"}
