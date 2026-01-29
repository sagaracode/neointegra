from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    company_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    verification_token = Column(String, nullable=True)
    reset_token = Column(String, nullable=True)
    reset_token_expires = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    orders = relationship("Order", back_populates="user")
    subscriptions = relationship("Subscription", back_populates="user")

class Service(Base):
    __tablename__ = "services"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=True)  # URL-friendly identifier
    description = Column(Text, nullable=True)
    category = Column(String, nullable=False)  # web, mobile, design, consulting
    price = Column(Float, nullable=False)
    duration_days = Column(Integer, nullable=True)  # Estimated duration
    is_active = Column(Boolean, default=True)
    features = Column(Text, nullable=True)  # JSON string of features
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    order_number = Column(String, unique=True, nullable=False, index=True)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=True)
    service_name = Column(String, nullable=False)
    quantity = Column(Integer, default=1)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    status = Column(String, default="pending")  # pending, paid, processing, completed, cancelled
    notes = Column(Text, nullable=True)
    subscription_id = Column(Integer, ForeignKey("subscriptions.id"), nullable=True)  # For renewals
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="orders")
    service = relationship("Service")
    payments = relationship("Payment", back_populates="order")
    subscription = relationship("Subscription", foreign_keys=[subscription_id])

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    payment_method = Column(String, nullable=False)  # va, qris, cstore, cod
    payment_channel = Column(String, nullable=True)  # bca, bni, bri, mandiri (for VA), alfamart/indomaret (for cstore)
    amount = Column(Float, nullable=False)
    status = Column(String, default="pending")  # pending, success, failed, expired
    ipaymu_transaction_id = Column(String, nullable=True)
    ipaymu_session_id = Column(String, nullable=True)
    payment_url = Column(String, nullable=True)
    qr_code_url = Column(String, nullable=True)
    qr_string = Column(Text, nullable=True)  # QRIS string for manual input
    va_number = Column(String, nullable=True)
    payment_code = Column(String, nullable=True)  # For convenience store (Alfamart/Indomaret)
    payment_name = Column(String, nullable=True)  # Store name display
    expired_at = Column(DateTime, nullable=True)
    paid_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    order = relationship("Order", back_populates="payments")

class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    package_name = Column(String, nullable=False)
    package_type = Column(String, nullable=False)  # monthly, yearly, custom
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    price = Column(Float, nullable=False)
    renewal_price = Column(Float, nullable=True)  # Price for renewal
    is_active = Column(Boolean, default=True)
    auto_renewal = Column(Boolean, default=False)
    status = Column(String, default="active")  # active, expired, cancelled
    features = Column(Text, nullable=True)  # JSON string of features
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="subscriptions")
