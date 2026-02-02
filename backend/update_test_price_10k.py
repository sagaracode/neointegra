"""
Direct update test-payment price to 10000 in production
"""
import requests

PRODUCTION_URL = "https://api.neointegratech.com"

print("="*70)
print("  UPDATE Test Payment to Rp 10.000")
print("="*70)

# Method 1: Via SQL if you have access
sql_script = """
-- Direct SQL Update
UPDATE services 
SET 
    price = 10000,
    description = 'Service untuk test pembayaran dengan nominal minimal Rp 10.000 (minimum iPaymu)'
WHERE slug = 'test-payment';

-- Verify
SELECT slug, name, price, description FROM services WHERE slug = 'test-payment';
"""

print("\n📝 SQL Script untuk update manual:")
print(sql_script)

print("\n" + "="*70)
print("  INSTRUKSI")
print("="*70)
print("""
Karena backend production belum redeploy dengan kode baru,
Anda perlu update database production secara manual:

OPTION 1: Via phpMyAdmin / MySQL Client
1. Login ke database production
2. Run SQL script di atas
3. Verify price berubah jadi 10000

OPTION 2: Tunggu Backend Redeploy (~5-10 menit)
1. Backend akan auto-redeploy dengan kode baru
2. Startup akan auto-update service ke Rp 10.000
3. Hard refresh browser dan test lagi

OPTION 3: Manual via API (temporary workaround)
Jalankan script ini untuk create temporary fix endpoint.
""")

print("\n" + "="*70)
print("Setelah database updated, test payment akan bekerja!")
print("="*70)
