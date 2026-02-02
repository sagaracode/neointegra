"""
FORCE ADD test-payment service ke production
Script ini PASTI menambahkan service test-payment Rp 5.000

Run: python force_add_test_service.py
"""
import requests
import json

PRODUCTION_URL = "https://api.neointegratech.com"

def force_add_test_service():
    """Force add test-payment service"""
    
    url = f"{PRODUCTION_URL}/api/admin/add-test-service"
    
    print("="*70)
    print("  🚀 FORCE ADD TEST-PAYMENT SERVICE")
    print("="*70)
    print(f"\n📡 Target: {url}")
    print(f"💰 Service: test-payment (Rp 5.000)")
    print(f"\n⏳ Processing...")
    
    try:
        # Hit endpoint
        response = requests.get(url, timeout=30)
        
        print(f"\n📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"\n✅ SUCCESS!")
            print(f"📝 {data.get('message', 'Service added')}")
            
            # Verify service exists
            print(f"\n🔍 Verifying service...")
            verify_url = f"{PRODUCTION_URL}/api/services/"
            verify_response = requests.get(verify_url, timeout=10)
            
            if verify_response.status_code == 200:
                services = verify_response.json()
                test_service = next((s for s in services if s.get('slug') == 'test-payment'), None)
                
                if test_service:
                    print(f"✅ VERIFIED! Service test-payment ditemukan:")
                    print(f"   • Name: {test_service.get('name')}")
                    print(f"   • Slug: {test_service.get('slug')}")
                    print(f"   • Price: Rp {test_service.get('price'):,}")
                    print(f"   • Description: {test_service.get('description')}")
                    
                    print("\n" + "="*70)
                    print("  🎉 BERHASIL! Sekarang bisa test payment Rp 5.000")
                    print("="*70)
                    print(f"\n👉 Buka: https://neointegratech.com/test-payment")
                    print(f"   1. Login")
                    print(f"   2. Klik 'Bayar Test Rp 5.000'")
                    print(f"   3. Pilih bank")
                    print(f"   4. Bayar dan cek email")
                    print("\n" + "="*70)
                    return True
                else:
                    print(f"⚠️  Service belum muncul di list. Refresh browser dan coba lagi.")
                    return False
            
            return True
            
        else:
            print(f"\n❌ ERROR: Status code {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print(f"\n❌ Connection Error: Tidak bisa connect ke {PRODUCTION_URL}")
        print("   Pastikan:")
        print("   1. URL production benar")
        print("   2. Backend production running")
        print("   3. Internet connection OK")
        return False
        
    except Exception as e:
        print(f"\n❌ Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def check_current_services():
    """Check what services currently exist"""
    
    url = f"{PRODUCTION_URL}/api/services/"
    
    print("\n" + "="*70)
    print("  📋 SERVICES YANG ADA SAAT INI")
    print("="*70)
    
    try:
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            services = response.json()
            print(f"\n✅ Total services: {len(services)}")
            print(f"\nList slugs:")
            for s in services:
                price = s.get('price', 0)
                print(f"   • {s.get('slug'):<20} - Rp {price:>12,}")
            
            # Check if test-payment exists
            test_exists = any(s.get('slug') == 'test-payment' for s in services)
            if test_exists:
                print(f"\n✅ test-payment SUDAH ADA")
            else:
                print(f"\n❌ test-payment BELUM ADA (akan ditambahkan)")
                
        else:
            print(f"⚠️  Cannot get services (status {response.status_code})")
            
    except Exception as e:
        print(f"⚠️  Error: {str(e)}")

if __name__ == "__main__":
    print("\n")
    print("█" * 70)
    print("█                                                                    █")
    print("█     FORCE ADD TEST-PAYMENT SERVICE (Rp 5.000)                     █")
    print("█     Production Database Fix                                       █")
    print("█                                                                    █")
    print("█" * 70)
    
    # Check current services first
    check_current_services()
    
    # Confirm
    print("\n" + "="*70)
    print("⚠️  Script ini akan menambahkan service test-payment ke production")
    print("="*70)
    confirm = input("\n❓ Lanjutkan? (y/n): ")
    
    if confirm.lower() != 'y':
        print("❌ Dibatalkan")
        exit(0)
    
    # Force add
    success = force_add_test_service()
    
    if not success:
        print("\n" + "="*70)
        print("❌ GAGAL menambahkan service")
        print("="*70)
        print("\nTroubleshooting:")
        print("1. Pastikan backend production sudah redeploy")
        print("2. Cek log backend production untuk error")
        print("3. Coba hit endpoint manual via browser:")
        print(f"   {PRODUCTION_URL}/api/admin/add-test-service")
        print("="*70)
        exit(1)
    
    print("\n✅ Script selesai!\n")
