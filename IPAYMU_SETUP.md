# Panduan Konfigurasi iPaymu Payment Gateway

## Status Saat Ini

✅ **SUDAH BERHASIL:**
- Checkout flow bekerja (405 Method Not Allowed sudah fix)
- Order berhasil dibuat (201 Created)
- Payment record berhasil dibuat (201 Created)
- Backend membaca credentials dari file `.env`

❌ **MASIH PERLU DISELESAIKAN:**
- iPaymu API mengembalikan error: `"unauthorized signature"`
- Tidak ada `payment_url` yang dikembalikan

## Apa yang Perlu Anda Lakukan

### 1. Verifikasi Credentials iPaymu Anda

File: `backend/.env`

```env
IPAYMU_VA=1179001393387726
IPAYMU_API_KEY=CED87086-8579-48DA-AC7D-0F8D461C9961
IPAYMU_PRODUCTION=true
```

**PENTING:** Pastikan credentials ini **BENAR** dan **AKTIF** di akun iPaymu Anda:

1. Login ke https://my.ipaymu.com
2. Pergi ke menu **Integrasi** atau **API Settings**
3. Cek:
   - ✅ VA Number harus sama: `1179001393387726`
   - ✅ API Key harus sama: `CED87086-8579-48DA-AC7D-0F8D461C9961`
   - ✅ API Key harus **PRODUCTION** (bukan Sandbox)
   - ✅ API Status harus **AKTIF/ENABLED**

### 2. Verifikasi Format Signature iPaymu

Backend saat ini menggunakan format signature:
```
POST:VA:BODY_JSON:API_KEY
```

Contoh yang dihasilkan sistem:
```
POST:1179001393387726:{"name":"Demo User","phone":"08123456789","email":"demo@neointegra.tech","amount":81000000,...}:CED87086-8579-48DA-AC7D-0F8D461C9961
```

**Anda perlu mengecek dokumentasi iPaymu:**
- Buka: https://ipaymu.com/dokumentasi-api/
- Cari bagian **"Signature Generation"** atau **"Authentication"**
- Pastikan format signature yang benar sesuai dokumentasi

### 3. Kemungkinan Penyebab Error "Unauthorized Signature"

#### A. Format Body JSON Salah
iPaymu mungkin memerlukan:
- Lowercase untuk semua keys ✅ (sudah dihandle)
- Lowercase untuk semua values ❌ (belum dicoba)
- Urutan keys tertentu ❌ (belum dicoba)
- Format tanpa spasi ✅ (sudah dihandle dengan `separators=(',',':')`)

#### B. Timestamp Header
Header timestamp mungkin perlu format tertentu:
```python
# Saat ini:
"timestamp": str(int(datetime.now().timestamp()))

# Mungkin perlu format lain:
"timestamp": "20260128145427"  # YYYYMMDDHHmmss
```

#### C. Additional Headers
iPaymu mungkin memerlukan header tambahan:
- `content-length`
- `user-agent`
- `accept`

#### D. Production vs Sandbox
Jika menggunakan Production API Key, pastikan:
- IPAYMU_PRODUCTION=true ✅
- Base URL: https://my.ipaymu.com/api/v2 ✅
- VA dan API Key harus dari Production (bukan Sandbox)

### 4. Testing dengan API Key Sandbox

Jika masih error, coba gunakan **Sandbox** terlebih dahulu untuk testing:

1. Login ke https://sandbox.ipaymu.com
2. Ambil VA dan API Key dari sandbox
3. Update `backend/.env`:
   ```env
   IPAYMU_VA=<VA_dari_sandbox>
   IPAYMU_API_KEY=<API_KEY_dari_sandbox>
   IPAYMU_PRODUCTION=false
   ```
4. Restart backend
5. Test lagi

### 5. Hubungi Support iPaymu

Jika masih gagal setelah langkah di atas, hubungi support iPaymu:
- Email: support@ipaymu.com
- WhatsApp: +62 xxx (cek di website)
- Tanyakan:
  1. Format signature yang benar untuk Production API
  2. Apakah ada perubahan format API terbaru
  3. Minta contoh request yang benar (dengan curl/postman)

## Cara Test Setelah Update

1. Update kredential di `backend/.env`
2. Restart backend (otomatis reload jika sudah running)
3. Jalankan test:
   ```bash
   python test_checkout_fixed.py
   ```
4. Lihat output - seharusnya muncul `payment_url` jika berhasil

## Dokumentasi yang Perlu Dibaca

1. **iPaymu API Documentation**: https://ipaymu.com/dokumentasi-api/
2. **Section Payment/VA**: https://ipaymu.com/dokumentasi-api/#endpoint-direct-payment
3. **Section Signature**: https://ipaymu.com/dokumentasi-api/#signature

## Informasi Tambahan

- Backend running di: http://localhost:8000
- Frontend running di: http://localhost:5173
- Test script: `test_checkout_fixed.py`
- Backend logs menampilkan debug info untuk signature generation

Jika Anda menemukan format signature yang benar dari dokumentasi iPaymu, beritahu saya dan saya akan update code backend segera.
