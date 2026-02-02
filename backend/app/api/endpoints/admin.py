from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ...database import get_db
from ...models import Service
from ...schemas import MessageResponse

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/init-services", response_model=MessageResponse)
@router.post("/init-services", response_model=MessageResponse)
async def initialize_services(db: Session = Depends(get_db)):
    """Initialize or update services in database - supports both GET and POST"""
    
    services_data = [
        {
            "name": "Paket All In Service",
            "slug": "all-in",
            "description": "Paket paling hemat & optimal untuk bisnis jangka panjang. Sudah termasuk Website, SEO, Mail Server, Cloudflare, dan Hosting.",
            "category": "package",
            "price": 81000000,
            "duration_days": 365,
            "features": '["Website Service - Custom UI/UX", "SEO Service (12 bulan)", "Mail Server Service", "Cloudflare Protection", "Hosting Performa Tinggi", "Support Teknis Lengkap"]'
        },
        {
            "name": "Website Service",
            "slug": "website",
            "description": "Website Service Profesional - Pembuatan website custom dengan performa tinggi.",
            "category": "web",
            "price": 36000000,
            "duration_days": 365,
            "features": '["Custom UI/UX", "Hosting Performa Tinggi", "Optimasi Kecepatan", "Maintenance & Update", "Backup & Keamanan", "Support Teknis"]'
        },
        {
            "name": "SEO Service",
            "slug": "seo",
            "description": "SEO Service Berkelanjutan (12 Bulan) - Optimasi mesin pencari profesional.",
            "category": "marketing",
            "price": 42000000,
            "duration_days": 365,
            "features": '["SEO On-Page & Technical", "Optimasi Struktur & Kecepatan", "Google Search Console & Analytics", "Monitoring Keyword Bulanan", "Laporan Performa SEO", "Optimasi Berkelanjutan 12 Bulan"]'
        },
        {
            "name": "Mail Server Service",
            "slug": "mail-server",
            "description": "Mail Server Bisnis Profesional - Email bisnis dengan domain perusahaan.",
            "category": "email",
            "price": 15000000,
            "duration_days": 365,
            "features": '["Email dengan Domain Perusahaan", "Setup SPF, DKIM, DMARC", "Perlindungan Spam & Phishing", "Sinkronisasi Webmail & Perangkat", "Maintenance & Support"]'
        },
        {
            "name": "Cloudflare Service",
            "slug": "cloudflare",
            "description": "Cloudflare Protection & Performance - Keamanan dan performa maksimal.",
            "category": "security",
            "price": 24000000,
            "duration_days": 365,
            "features": '["CDN Global & Caching", "Proteksi DDoS & Firewall", "SSL Full Encryption", "Proteksi Bot & Traffic Berbahaya", "Monitoring Keamanan 24/7"]'
        },
        {
            "name": "Test Payment Service",
            "slug": "test-payment",
            "description": "Service untuk test pembayaran dengan nominal minimal Rp 10.000 (minimum iPaymu)",
            "category": "test",
            "price": 10000,
            "duration_days": 1,
            "features": '["Test Payment", "Minimal Amount", "Email Notification Test"]'
        }
    ]
    
    created_count = 0
    updated_count = 0
    
    for service_data in services_data:
        existing = db.query(Service).filter(Service.slug == service_data["slug"]).first()
        if not existing:
            service = Service(**service_data)
            db.add(service)
            created_count += 1
        else:
            # Update existing service
            for key, value in service_data.items():
                setattr(existing, key, value)
            updated_count += 1
    
    db.commit()
    
    return {
        "message": f"Services initialized successfully! Created: {created_count}, Updated: {updated_count}"
    }

@router.post("/add-test-service", response_model=MessageResponse)
@router.get("/add-test-service", response_model=MessageResponse)
async def add_test_payment_service(db: Session = Depends(get_db)):
    """Force add/update test-payment service - GUARANTEED to work"""
    
    test_service_data = {
        "name": "Test Payment Service",
        "slug": "test-payment",
        "description": "Service untuk test pembayaran dengan nominal minimal Rp 10.000 (minimum iPaymu)",
        "category": "test",
        "price": 10000,
        "duration_days": 1,
        "features": '["Test Payment", "Minimal Amount", "Email Notification Test"]'
    }
    
    # Check if exists
    existing = db.query(Service).filter(Service.slug == "test-payment").first()
    
    if existing:
        # Update existing
        for key, value in test_service_data.items():
            setattr(existing, key, value)
        db.commit()
        db.refresh(existing)
        return {
            "message": f"✅ Test payment service UPDATED! Price: Rp {existing.price:,}"
        }
    else:
        # Create new
        new_service = Service(**test_service_data)
        db.add(new_service)
        db.commit()
        db.refresh(new_service)
        return {
            "message": f"✅ Test payment service CREATED! Price: Rp {new_service.price:,}"
        }
