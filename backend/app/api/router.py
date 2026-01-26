from fastapi import APIRouter
from .endpoints import auth, services, orders, payments, subscriptions, users

# Create main API router
api_router = APIRouter(prefix="/api")

# Include all endpoint routers
api_router.include_router(auth.router)
api_router.include_router(services.router)
api_router.include_router(orders.router)
api_router.include_router(payments.router)
api_router.include_router(subscriptions.router)
api_router.include_router(users.router)
