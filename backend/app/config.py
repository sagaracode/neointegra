import os
from pydantic_settings import BaseSettings
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "NeoIntegra Tech API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./neointegratech.db")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # CRITICAL: Validate SECRET_KEY in production
        if not self.DEBUG and self.SECRET_KEY == "your-secret-key-change-in-production":
            raise ValueError(
                "CRITICAL SECURITY ERROR: SECRET_KEY must be set in production! "
                "Add SECRET_KEY environment variable to your deployment."
            )
    
    # CORS
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    BACKEND_URL: str = os.getenv("BACKEND_URL", "http://localhost:8000")
    ALLOWED_ORIGINS: list = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "https://neointegratech.com",
        "https://www.neointegratech.com",
        "https://api.neointegratech.com",
    ]
    
    # Email (SMTP)
    SMTP_HOST: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    EMAIL_FROM: str = os.getenv("EMAIL_FROM", "noreply@neointegra.tech")
    
    # iPaymu Payment Gateway
    IPAYMU_VA: str = os.getenv("IPAYMU_VA", "")
    IPAYMU_API_KEY: str = os.getenv("IPAYMU_API_KEY", "")
    IPAYMU_PRODUCTION: bool = os.getenv("IPAYMU_PRODUCTION", "false").lower() == "true"
    
    @property
    def IPAYMU_BASE_URL(self) -> str:
        """Return iPaymu URL based on production mode"""
        if self.IPAYMU_PRODUCTION:
            return "https://my.ipaymu.com/api/v2"
        return "https://sandbox.ipaymu.com/api/v2"
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
