from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ...database import get_db
from ...models import Service
from ...schemas import ServiceResponse

router = APIRouter(prefix="/services", tags=["Services"])

@router.get("/", response_model=List[ServiceResponse])
async def get_services(
    category: str = None,
    db: Session = Depends(get_db)
):
    """Get all active services, optionally filtered by category"""
    query = db.query(Service).filter(Service.is_active == True)
    
    if category:
        query = query.filter(Service.category == category)
    
    services = query.all()
    return services

@router.get("/{service_id}", response_model=ServiceResponse)
async def get_service(service_id: int, db: Session = Depends(get_db)):
    """Get specific service by ID"""
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

@router.get("/category/{category}", response_model=List[ServiceResponse])
async def get_services_by_category(category: str, db: Session = Depends(get_db)):
    """Get services by category"""
    services = db.query(Service).filter(
        Service.category == category,
        Service.is_active == True
    ).all()
    return services
