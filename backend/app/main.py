from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime
import asyncio

from .config import settings
from .database import init_db
from .api.router import api_router
from .rate_limit import cleanup_rate_limit_storage

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG
)

# Configure CORS - MUST be before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"],
    max_age=3600,
)

# Add OPTIONS handler for all routes
@app.options("/{full_path:path}")
async def options_handler(full_path: str):
    """Handle OPTIONS requests for CORS preflight"""
    return JSONResponse(
        content={"message": "OK"},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Max-Age": "3600",
        }
    )

# Include API router
app.include_router(api_router)

# Root endpoint
@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "timestamp": datetime.utcnow().isoformat(),
        "cors": "enabled",
        "allowed_origins": "*"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "database": "connected",
        "timestamp": datetime.utcnow().isoformat(),
        "cors_configured": True
    }

@app.get("/api")
async def api_root():
    """API root endpoint"""
    return {
        "message": "NeoIntegraTech API",
        "version": settings.APP_VERSION,
        "endpoints": {
            "auth": "/api/auth",
            "services": "/api/services",
            "orders": "/api/orders",
            "payments": "/api/payments",
            "subscriptions": "/api/subscriptions",
            "users": "/api/users"
        }
    }
    }

# Exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)}
    )

# Startup event
@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    print(f"🚀 Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    print(f"🌍 Environment: {'Development' if settings.DEBUG else 'Production'}")
    
    # Initialize database
    try:
        init_db()
        print("✅ Database initialized")
    except Exception as e:
        print(f"❌ Database initialization error: {e}")
    
    # Start rate limit cleanup task
    asyncio.create_task(cleanup_rate_limit_storage())
    print("✅ Rate limit cleanup task started")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown"""
    print(f"👋 Shutting down {settings.APP_NAME}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
