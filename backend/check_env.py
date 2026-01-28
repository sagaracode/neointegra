"""Check if environment variables are loaded correctly"""
from app.config import settings

print("\n" + "="*60)
print("ENVIRONMENT VARIABLES CHECK")
print("="*60)

print(f"\n[iPaymu Settings]")
print(f"VA: {settings.IPAYMU_VA}")
print(f"API Key: {settings.IPAYMU_API_KEY[:10]}...{settings.IPAYMU_API_KEY[-10:]}")
print(f"Production: {settings.IPAYMU_PRODUCTION}")
print(f"Base URL: {settings.IPAYMU_BASE_URL}")

print(f"\n[App URLs]")
print(f"Backend URL: {settings.BACKEND_URL}")
print(f"Frontend URL: {settings.FRONTEND_URL}")

print(f"\n[Database]")
print(f"Database URL: {settings.DATABASE_URL}")

print(f"\n[JWT]")
print(f"Algorithm: {settings.ALGORITHM}")
print(f"Token Expire: {settings.ACCESS_TOKEN_EXPIRE_MINUTES} minutes")

print("\n✅ All environment variables loaded successfully!")
print("="*60 + "\n")
