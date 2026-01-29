# 🚨 CRITICAL FIX: 401 Unauthorized Error

## Masalah
User mendapatkan error 401 saat membuat payment, meskipun token valid di header.

## Akar Masalah
**SECRET_KEY mismatch** antara environment yang generate token (login) dan environment yang decode token (payment).

### Detail Teknis:
1. User login di production → token di-generate dengan SECRET_KEY production
2. Backend redeploy → menggunakan SECRET_KEY default: `"your-secret-key-change-in-production"`
3. Token signature tidak cocok → JWT decode gagal → 401 error

## Solusi

### 1. Set SECRET_KEY di Coolify/Production
Di Coolify → Environment Variables, tambahkan:

```env
SECRET_KEY=g-gC6Z1q39Y2bpSflLgxjthXpjfxNXiiwzEafTGW9MihjAXXi8LfR_WQtH6UpRY6l0evTTgFwlmQYXb7PS68TA
```

**PENTING:** Generate SECRET_KEY unik untuk production Anda:
```bash
python -c "import secrets; print(secrets.token_urlsafe(64))"
```

### 2. Environment Variables Lengkap untuk Production

```env
# CRITICAL SECURITY
SECRET_KEY=<generate-unique-key>

# APPLICATION
DEBUG=False

# URLS
FRONTEND_URL=https://neointegratech.com
BACKEND_URL=https://api.neointegratech.com

# EMAIL
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=hello@neointegratech.com
SMTP_PASSWORD=<your-smtp-password>
EMAIL_FROM=hello@neointegratech.com

# IPAYMU
IPAYMU_VA=1179001393387726
IPAYMU_API_KEY=CED87086-8579-48DA-AC7D-0F8D461C9961
IPAYMU_PRODUCTION=true
```

### 3. Setelah Set SECRET_KEY
1. **Redeploy backend** di Coolify
2. **Semua user harus login ulang** (token lama tidak valid)
3. Test payment flow

## Perubahan Kode

### config.py
- Ditambahkan validation: akan error jika SECRET_KEY masih default di production

### auth.py  
- Improved error logging untuk JWT decode
- Specific error messages (expired, signature invalid, dll)

## Testing

Setelah redeploy dengan SECRET_KEY yang benar:

```bash
# Test login
curl -X POST https://api.neointegratech.com/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=TestPass123"

# Copy token dari response, lalu test payment
curl -X POST https://api.neointegratech.com/api/payments/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"order_id":1,"payment_method":"va","payment_channel":"bca","amount":36000000}'
```

## Checklist Deploy
- [ ] Generate SECRET_KEY unik
- [ ] Set SECRET_KEY di Coolify environment variables
- [ ] Set semua env vars lain (SMTP, iPaymu, URLs)
- [ ] Redeploy backend
- [ ] Test login → dapat token baru
- [ ] Test payment → berhasil tanpa 401
- [ ] Instruksikan user untuk login ulang

## Catatan Keamanan
⚠️ **JANGAN PERNAH**:
- Commit SECRET_KEY ke git
- Share SECRET_KEY di public
- Gunakan SECRET_KEY yang sama di dev dan production
- Biarkan SECRET_KEY default di production
