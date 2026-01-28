# SETUP IPAYMU - PANDUAN LENGKAP

## 🔴 MASALAH SAAT INI
Payment dibuat (201) tapi tidak ada `payment_url` karena error dari iPaymu API: "qty wajib diisi"

## ✅ SOLUSI YANG SUDAH DITERAPKAN

1. **Logging Lengkap**: Sudah ditambahkan print statement untuk:
   - Request body yang dikirim ke iPaymu
   - Response dari iPaymu (status + body)
   - Error details dari iPaymu
   - Debug info untuk signature generation

2. **Error Handling**: Error tidak lagi di-catch secara silent:
   - HTTPException dari iPaymu akan propagate ke frontend
   - Payment record akan di-delete jika iPaymu gagal
   - Traceback untuk unexpected errors

3. **Kode Product**: Sudah include qty field:
```python
product_list = [
    {
        "name": "Layanan NeoIntegra Tech",
        "price": int(payment_data["amount"]),
        "qty": 1  # ✅ Sudah ada
    }
]
```

## 🔍 CARA DEBUG

### 1. Restart Backend (PENTING!)
Backend perlu di-restart agar perubahan kode ter-load:

```powershell
# Stop backend yang lama (Ctrl+C di terminal backend)

# Start ulang
cd d:\WEBSITES\backend
.\venv_new\Scripts\Activate.ps1
$env:PYTHONPATH = "d:\WEBSITES\backend"
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Jalankan Test Script
Di terminal baru:
```powershell
cd d:\WEBSITES
python test_payment_debug.py
```

### 3. Periksa Backend Terminal
Cari log seperti ini:
```
[iPaymu Request] Method: va
[iPaymu Request] Body: {...}
[iPaymu Request] Signature: ...
[iPaymu Request] Timestamp: ...
[iPaymu Response] Status: ...
[iPaymu Response] Body: ...
```

## 🔧 KEMUNGKINAN PENYEBAB & SOLUSI

### A. Field qty Tidak Ter-kirim (Format JSON Salah)
**Cek**: Body yang dikirim di log backend

**Solusi**: Pastikan product array terformat dengan benar:
```python
"product": [
    {
        "name": "Nama Produk",  
        "price": 36000000,      # Integer, bukan float
        "qty": 1                # Integer, bukan "1"
    }
]
```

### B. Signature Salah
**Cek**: Response iPaymu HTTP 401 "unauthorized signature"

**Solusi**: Sudah diperbaiki di kode menggunakan HMAC-SHA256:
```python
string_to_sign = f"POST:{va}:{body_hash}:{api_key}"
signature = hmac.new(api_key.encode(), string_to_sign.encode(), hashlib.sha256).hexdigest()
```

### C. iPaymu Credentials Tidak Valid
**Cek**: File `.env` di `backend/` folder

**Pastikan ada**:
```env
IPAYMU_VA=1179001393387726
IPAYMU_API_KEY=CED87086-8579-48DA-AC7D-0F8D461C9961
IPAYMU_PRODUCTION=true
IPAYMU_BASE_URL=https://my.ipaymu.com/api/v2
```

### D. iPaymu Account Belum Aktif/Disetup
**Cek di iPaymu Dashboard** (https://my.ipaymu.com):
1. Login ke dashboard iPaymu
2. Periksa API Settings:
   - API Key aktif?
   - VA number valid?
   - Payment channels enabled (BCA, BNI, BRI, Mandiri)?
3. Periksa Callback URL:
   - **CRITICAL**: Callback URL harus PUBLIC URL, bukan localhost!
   - Format: `https://yourdomain.com/api/payments/callback`
   - Localhost tidak akan bisa receive callback dari iPaymu

## 🌐 SETUP DI COOLIFY (DEPLOYMENT)

### 1. Environment Variables di Coolify
Tambahkan di Coolify dashboard untuk backend service:

```env
# iPaymu Production
IPAYMU_VA=1179001393387726
IPAYMU_API_KEY=CED87086-8579-48DA-AC7D-0F8D461C9961
IPAYMU_PRODUCTION=true
IPAYMU_BASE_URL=https://my.ipaymu.com/api/v2

# Backend URL (untuk callback)
BACKEND_URL=https://api.neointegratech.com
FRONTEND_URL=https://neointegratech.com

# Database
DATABASE_URL=sqlite:///./neointegratech.db

# JWT
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Email (opsional)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### 2. Setup Callback URL di iPaymu Dashboard
1. Login ke https://my.ipaymu.com
2. Go to: **Settings > API Settings > Callback URL**
3. Set:
   - **Notify URL (Callback)**: `https://api.neointegratech.com/api/payments/callback`
   - **Return URL**: `https://neointegratech.com/payment/success`

⚠️ **PENTING**: 
- Callback URL HARUS public URL (https), bukan localhost
- iPaymu akan POST payment status ke callback URL
- Backend harus accessible dari internet untuk receive callback

### 3. Test di Production
Setelah deploy di Coolify:
1. Akses frontend: `https://yourdomain.com`
2. Login dan coba checkout
3. Periksa log di Coolify untuk debug info
4. Periksa callback working dengan ngrok (untuk testing)

## 📝 TESTING DENGAN NGROK (untuk Local Testing)

Jika ingin test callback di local:

1. Install ngrok:
```powershell
# Download from https://ngrok.com/download
# Extract dan run
.\ngrok.exe http 8000
```

2. Copy public URL (contoh: `https://abc123.ngrok.io`)

3. Update `.env`:
```env
BACKEND_URL=https://abc123.ngrok.io
```

4. Set di iPaymu dashboard:
```
Callback URL: https://abc123.ngrok.io/api/payments/callback
```

5. Restart backend dan test

## 🐛 DEBUG CHECKLIST

- [ ] Backend di-restart setelah perubahan kode
- [ ] `.env` file ada dan ter-load (cek dengan `print(settings.IPAYMU_VA)`)
- [ ] iPaymu credentials valid (cek di dashboard)
- [ ] Payment channels enabled di iPaymu dashboard
- [ ] Test script running dan dapat hit backend
- [ ] Backend terminal menampilkan debug logs
- [ ] Body request include `qty` field
- [ ] Signature generated correctly (HMAC-SHA256)
- [ ] Callback URL di iPaymu dashboard adalah public URL (bukan localhost)

## 📞 NEXT STEPS

1. **RESTART BACKEND** - Perubahan kode belum ter-load!
2. **RUN TEST SCRIPT** - `python test_payment_debug.py`
3. **CHECK BACKEND LOGS** - Lihat apa yang dikirim ke iPaymu
4. **SCREENSHOT & SHARE** - Kirim log backend untuk analisa lebih lanjut

Jika masih error, share:
- Backend terminal output (with debug logs)
- iPaymu dashboard screenshot (payment channels & API settings)
- Test script output
