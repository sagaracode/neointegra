# PERUBAHAN DOMAIN KE PRODUCTION

## ✅ YANG SUDAH DIUBAH:

### 1. Backend Configuration
**File: `backend/.env`**
```env
FRONTEND_URL=https://neointegratech.com
BACKEND_URL=https://api.neointegratech.com
```

**File: `backend/app/config.py`**
- Ditambahkan: `BACKEND_URL` setting
- CORS sudah include semua domain production

### 2. Frontend Configuration
**File: `frontend/.env.production`** (BARU)
```env
VITE_API_URL=https://api.neointegratech.com/api
```

### 3. Payment Callback URL
**File: `backend/app/api/endpoints/payments.py`**
- Callback URL diubah dari `FRONTEND_URL` ke `BACKEND_URL`
- Sekarang: `https://api.neointegratech.com/api/payments/callback` ✅
- Return URL tetap: `https://neointegratech.com/payment/success` ✅

### 4. Documentation
- `IPAYMU_SETUP.md` - Updated dengan domain production
- `SETUP_IPAYMU_DEBUG.md` - Updated dengan contoh URL yang benar

---

## 🚀 LANGKAH DEPLOY DI COOLIFY:

### 1. Environment Variables - Backend Service

Pastikan di Coolify, service **backend** punya env variables:

```env
# Database
DATABASE_URL=sqlite:///./neointegratech.db

# Security
SECRET_KEY=your-long-random-secret-key-here-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# URLs
FRONTEND_URL=https://neointegratech.com
BACKEND_URL=https://api.neointegratech.com

# iPaymu Production
IPAYMU_VA=1179001393387726
IPAYMU_API_KEY=CED87086-8579-48DA-AC7D-0F8D461C9961
IPAYMU_PRODUCTION=true
IPAYMU_BASE_URL=https://my.ipaymu.com/api/v2

# Email (Optional - untuk reset password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@neointegra.tech

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60

# Application
APP_NAME=NeoIntegra Tech API
APP_VERSION=1.0.0
DEBUG=False
```

### 2. Environment Variables - Frontend Service

Pastikan di Coolify, service **frontend** punya env variables:

```env
VITE_API_URL=https://api.neointegratech.com/api
```

---

## 🔍 VERIFIKASI SETELAH DEPLOY:

### 1. Check Backend
```bash
# Login ke Coolify backend console atau SSH
curl https://api.neointegratech.com/
# Expected: {"message":"NeoIntegra Tech API v1.0.0"}

curl https://api.neointegratech.com/api/services/
# Expected: Array of services
```

### 2. Check Frontend
- Buka: https://neointegratech.com
- Inspect console (F12)
- Should see: `API URL: https://api.neointegratech.com/api`

### 3. Test Registration & Login
- Register user baru di https://neointegratech.com/register
- Login
- Check network tab - API calls harus ke `https://api.neointegratech.com/api/*`

### 4. Test Payment (CRITICAL)
- Login
- Create order
- Checkout dengan VA/QRIS
- **PENTING**: Check di backend logs untuk:
  ```
  [iPaymu Request] Body: {...}
  [iPaymu Response] Status: 200
  [iPaymu Success] Payment URL: https://...
  ```

---

## ⚠️ CALLBACK URL DI IPAYMU DASHBOARD

**STATUS SAAT INI**: "Menunggu Konfirmasi" (dari screenshot Anda)

### Yang Perlu Dilakukan:

1. **Tunggu approval dari iPaymu** untuk callback URL
2. Atau **hubungi support iPaymu**:
   - Email: support@ipaymu.com
   - Tanyakan: "Cara verifikasi callback URL untuk https://api.neointegratech.com/api/payments/callback"

3. **Jika diminta verification file**:
   - iPaymu mungkin minta Anda upload file `ipaymu-verification.txt` ke root domain
   - File ini akan accessible di: `https://api.neointegratech.com/ipaymu-verification.txt`
   - Beri tahu saya jika ini required, akan disetup di Coolify

### URL yang Sudah Benar:
✅ **Notify URL**: `https://api.neointegratech.com/api/payments/callback`
✅ **Return URL**: `https://neointegratech.com/payment/success`

---

## 📝 CHECKLIST SEBELUM TEST:

- [ ] Deploy ulang backend di Coolify
- [ ] Deploy ulang frontend di Coolify
- [ ] Environment variables sudah set di Coolify
- [ ] Backend accessible: `https://api.neointegratech.com`
- [ ] Frontend accessible: `https://neointegratech.com`
- [ ] iPaymu callback URL status "Aktif" (tidak "Menunggu Konfirmasi")
- [ ] Test registration & login
- [ ] Test create order
- [ ] Test checkout & payment

---

## 🐛 TROUBLESHOOTING:

### CORS Error
**Error**: "Access to XMLHttpRequest... has been blocked by CORS"

**Solusi**: 
1. Check `ALLOWED_ORIGINS` di `backend/app/config.py` sudah include domain Anda
2. Restart backend service di Coolify

### API URL Salah di Frontend
**Error**: Frontend masih hit `http://localhost:8000`

**Solusi**:
1. Check `VITE_API_URL` environment variable di Coolify frontend service
2. Rebuild frontend di Coolify (environment variables di-inject saat build)

### Callback URL Tidak Diterima
**Error**: Payment created tapi status tidak update

**Solusi**:
1. Check iPaymu callback URL status (harus "Aktif")
2. Check backend logs untuk incoming POST ke `/api/payments/callback`
3. Test callback manually dengan curl:
   ```bash
   curl -X POST https://api.neointegratech.com/api/payments/callback \
     -H "Content-Type: application/json" \
     -d '{"status":"paid","trx_id":"test123"}'
   ```

---

## 📞 SUPPORT:

Jika ada error setelah deploy, kirim:
1. Screenshot error di frontend (browser console)
2. Backend logs dari Coolify
3. Screenshot iPaymu callback URL status

Semua sudah ready untuk deploy! 🚀
