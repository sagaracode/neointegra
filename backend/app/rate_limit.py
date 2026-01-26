from fastapi import HTTPException, Request
from datetime import datetime, timedelta
from collections import defaultdict
from typing import Dict
import asyncio

# In-memory storage for rate limiting (use Redis in production)
rate_limit_storage: Dict[str, list] = defaultdict(list)

async def check_rate_limit(request: Request, max_requests: int = 60, window_seconds: int = 60):
    """
    Rate limiting middleware
    Default: 60 requests per minute per IP
    """
    # Get client IP
    client_ip = request.client.host
    
    # Get current time
    now = datetime.now()
    window_start = now - timedelta(seconds=window_seconds)
    
    # Clean old requests
    rate_limit_storage[client_ip] = [
        req_time for req_time in rate_limit_storage[client_ip]
        if req_time > window_start
    ]
    
    # Check if limit exceeded
    if len(rate_limit_storage[client_ip]) >= max_requests:
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded. Maximum {max_requests} requests per {window_seconds} seconds."
        )
    
    # Add current request
    rate_limit_storage[client_ip].append(now)

# Cleanup task (runs every hour)
async def cleanup_rate_limit_storage():
    """Remove old entries from rate limit storage"""
    while True:
        await asyncio.sleep(3600)  # 1 hour
        cutoff_time = datetime.now() - timedelta(hours=1)
        
        # Clean up old entries
        for ip in list(rate_limit_storage.keys()):
            rate_limit_storage[ip] = [
                req_time for req_time in rate_limit_storage[ip]
                if req_time > cutoff_time
            ]
            # Remove empty entries
            if not rate_limit_storage[ip]:
                del rate_limit_storage[ip]
