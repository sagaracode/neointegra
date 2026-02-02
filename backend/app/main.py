from fastapi import FastAPI, Request, Response
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

# Exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)}
    )

# Function to initialize default services
def init_default_services():
    """Initialize default services in database"""
    from .database import SessionLocal
    from .models import Service
    
    db = SessionLocal()
    try:
        default_services = [
            {
                "name": "Paket All In Service",
                "slug": "all-in",
                "description": "Paket paling hemat & optimal untuk bisnis jangka panjang. Sudah termasuk Website, SEO, Mail Server, Cloudflare, dan Hosting.",
                "category": "package",
                "price": 81000000,
                "duration_days": 365,
                "features": '["Website Service - Custom UI/UX", "SEO Service (12 bulan)", "Mail Server Service", "Cloudflare Protection", "Hosting Performa Tinggi", "Support Teknis Lengkap"]',
                "is_active": True
            },
            {
                "name": "Website Service",
                "slug": "website",
                "description": "Website Service Profesional - Pembuatan website custom dengan performa tinggi.",
                "category": "web",
                "price": 36000000,
                "duration_days": 365,
                "features": '["Custom UI/UX", "Hosting Performa Tinggi", "Optimasi Kecepatan", "Maintenance & Update", "Backup & Keamanan", "Support Teknis"]',
                "is_active": True
            },
            {
                "name": "SEO Service",
                "slug": "seo",
                "description": "SEO Service Berkelanjutan (12 Bulan) - Optimasi mesin pencari profesional.",
                "category": "marketing",
                "price": 42000000,
                "duration_days": 365,
                "features": '["SEO On-Page & Technical", "Optimasi Struktur & Kecepatan", "Google Search Console & Analytics", "Monitoring Keyword Bulanan", "Laporan Performa SEO", "Optimasi Berkelanjutan 12 Bulan"]',
                "is_active": True
            },
            {
                "name": "Mail Server Service",
                "slug": "mail-server",
                "description": "Mail Server Bisnis Profesional - Email bisnis dengan domain perusahaan.",
                "category": "email",
                "price": 15000000,
                "duration_days": 365,
                "features": '["Email dengan Domain Perusahaan", "Setup SPF, DKIM, DMARC", "Perlindungan Spam & Phishing", "Sinkronisasi Webmail & Perangkat", "Maintenance & Support"]',
                "is_active": True
            },
            {
                "name": "Cloudflare Service",
                "slug": "cloudflare",
                "description": "Cloudflare Protection & Performance - Keamanan dan performa maksimal.",
                "category": "security",
                "price": 24000000,
                "duration_days": 365,
                "features": '["CDN Global & Caching", "Proteksi DDoS & Firewall", "SSL Full Encryption", "Proteksi Bot & Traffic Berbahaya", "Monitoring Keamanan 24/7"]',
                "is_active": True
            },
            {
                "name": "Test Payment Service",
                "slug": "test-payment",
                "description": "Service untuk test pembayaran dengan nominal minimal Rp 5.000",
                "category": "test",
                "price": 5000,
                "duration_days": 1,
                "features": '["Test Payment", "Minimal Amount", "Email Notification Test"]',
                "is_active": True
            }
        ]
        
        created = 0
        for service_data in default_services:
            existing = db.query(Service).filter(Service.slug == service_data["slug"]).first()
            if not existing:
                service = Service(**service_data)
                db.add(service)
                created += 1
        
        db.commit()
        return created
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()

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
    
    # Auto-initialize default services
    try:
        created = init_default_services()
        if created > 0:
            print(f"✅ Default services initialized: {created} created")
        else:
            print("✅ Default services already exist")
    except Exception as e:
        print(f"⚠️ Services initialization warning: {e}")
    
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
