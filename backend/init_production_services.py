"""
Script untuk initialize services di production termasuk test-payment
Run: python init_production_services.py
"""
import requests
import sys

# Production URL
PRODUCTION_URL = "https://api.neointegratech.com"  # Ganti dengan URL production Anda yang sebenarnya

def init_services():
    """Initialize services including test-payment in production"""
    
    print("🚀 Initializing services in production...")
    print(f"📡 Target: {PRODUCTION_URL}/admin/init-services")
    print()
    
    try:
        # Hit endpoint init-services
        response = requests.get(f"{PRODUCTION_URL}/admin/init-services", timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ SUCCESS!")
            print(f"📝 {data.get('message', 'Services initialized')}")
            print()
            print("✨ Service 'test-payment' sekarang tersedia di production!")
            return True
        else:
            print(f"❌ ERROR: Status code {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print(f"❌ Connection Error: Tidak bisa connect ke {PRODUCTION_URL}")
        print("   Pastikan:")
        print("   1. URL production benar")
        print("   2. Backend production sudah running")
        print("   3. Network/firewall tidak blocking")
        return False
        
    except requests.exceptions.Timeout:
        print("❌ Timeout: Request terlalu lama")
        return False
        
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        return False

def verify_service():
    """Verify test-payment service exists"""
    
    print()
    print("🔍 Verifying test-payment service...")
    
    try:
        response = requests.get(f"{PRODUCTION_URL}/services", timeout=10)
        
        if response.status_code == 200:
            services = response.json()
            test_service = next((s for s in services if s.get('slug') == 'test-payment'), None)
            
            if test_service:
                print("✅ Service 'test-payment' ditemukan!")
                print(f"   Name: {test_service.get('name')}")
                print(f"   Price: Rp {test_service.get('price'):,}")
                print(f"   Description: {test_service.get('description')}")
                return True
            else:
                print("⚠️  Service 'test-payment' belum tersedia")
                return False
        else:
            print(f"⚠️  Tidak bisa verify (status {response.status_code})")
            return False
            
    except Exception as e:
        print(f"⚠️  Tidak bisa verify: {str(e)}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("   Production Services Initializer")
    print("   Test Payment Service Setup")
    print("=" * 60)
    print()
    
    # Confirm production URL
    print(f"⚠️  PERHATIAN: Script ini akan menginisialisasi services di:")
    print(f"   {PRODUCTION_URL}")
    print()
    confirm = input("Lanjutkan? (y/n): ")
    
    if confirm.lower() != 'y':
        print("❌ Dibatalkan")
        sys.exit(0)
    
    print()
    
    # Initialize services
    success = init_services()
    
    if success:
        # Verify
        verify_service()
        print()
        print("=" * 60)
        print("🎉 Setup selesai! Sekarang Anda bisa test pembayaran")
        print("   di https://neointegratech.com/test-payment")
        print("=" * 60)
    else:
        print()
        print("=" * 60)
        print("❌ Setup gagal. Silakan cek error di atas.")
        print("=" * 60)
        sys.exit(1)
