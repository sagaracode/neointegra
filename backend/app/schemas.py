from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import datetime

# ============= USER SCHEMAS =============
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    company_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class VerifyEmailRequest(BaseModel):
    token: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    company_name: Optional[str] = None
    password: Optional[str] = None

# ============= SERVICE SCHEMAS =============
class ServiceBase(BaseModel):
    name: str
    slug: Optional[str] = None
    description: Optional[str] = None
    category: str
    price: float
    duration_days: Optional[int] = None
    features: Optional[str] = None

class ServiceCreate(ServiceBase):
    pass

class ServiceResponse(ServiceBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# ============= ORDER SCHEMAS =============
class OrderBase(BaseModel):
    service_id: Optional[int] = None
    service_name: str
    quantity: int = 1
    notes: Optional[str] = None

class OrderCreate(OrderBase):
    unit_price: float
    total_price: float

class OrderCreateSimple(BaseModel):
    """Simplified order creation - only requires service_slug"""
    service_slug: str
    quantity: int = 1
    notes: Optional[str] = None

class OrderResponse(BaseModel):
    id: int
    user_id: int
    order_number: str
    service_name: str
    quantity: int
    unit_price: float
    total_price: float
    status: str
    notes: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

# ============= PAYMENT SCHEMAS =============
class PaymentBase(BaseModel):
    payment_method: str  # va, qris, cstore, cod
    payment_channel: Optional[str] = None  # bca, bni, bri, mandiri (for VA), alfamart/indomaret (for cstore)

class PaymentCreate(PaymentBase):
    order_id: int
    amount: float

class PaymentResponse(BaseModel):
    id: int
    order_id: int
    payment_method: str
    payment_channel: Optional[str]
    amount: float
    status: str
    payment_url: Optional[str]
    qr_code_url: Optional[str]
    qr_string: Optional[str]
    va_number: Optional[str]
    payment_code: Optional[str]
    payment_name: Optional[str]
    expired_at: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True

class PaymentCallbackRequest(BaseModel):
    """iPaymu callback request"""
    trx_id: str
    status: str
    status_code: str
    sid: Optional[str] = None

# ============= SUBSCRIPTION SCHEMAS =============
class SubscriptionBase(BaseModel):
    package_name: str
    package_type: str
    price: float
    renewal_price: Optional[float] = None
    features: Optional[str] = None

class SubscriptionCreate(SubscriptionBase):
    start_date: datetime
    end_date: datetime

class SubscriptionResponse(BaseModel):
    id: int
    user_id: int
    package_name: str
    package_type: str
    start_date: datetime
    end_date: datetime
    price: float
    renewal_price: Optional[float]
    is_active: bool
    status: str
    features: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class SubscriptionRenewalCreate(BaseModel):
    """Request to renew a subscription"""
    payment_method: str
    payment_channel: Optional[str] = None
    
    @validator('payment_method')
    def validate_payment_method(cls, v):
        if v not in ['va', 'qris', 'cod']:
            raise ValueError('Payment method must be va, qris, or cod')
        return v

# ============= COMMON SCHEMAS =============
class MessageResponse(BaseModel):
    message: str

class HealthCheck(BaseModel):
    status: str
    timestamp: datetime
