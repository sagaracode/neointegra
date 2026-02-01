# 🚀 Deployment Guide - Ready to Deploy

## ✅ Status: READY FOR PRODUCTION

Semua kode sudah siap deploy ke Coolify. Node.js dan Python sudah ter-configure di Dockerfile.

---

## 📦 Yang Sudah Dikerjakan

### Backend ✅
- ✅ Dependencies fixed (pydantic, gunicorn compatible versions)
- ✅ Auto-renewal subscription logic implemented
- ✅ iPaymu payment integration ready
- ✅ RSPPN test data script ready
- ✅ Dockerfile: Python 3.11-slim with uvicorn
- ✅ Database: SQLAlchemy with SQLite/PostgreSQL support

### Frontend ✅
- ✅ Renewal button on completed orders
- ✅ Subscription expiry warning in dashboard
- ✅ Bank selection modal for renewals
- ✅ Dockerfile: Node.js 18 Alpine → Build → Nginx Alpine
- ✅ Multi-stage build optimized

### Data ✅
- ✅ User: web@rsppn.co.id created with test data
- ✅ Order: ORD-RSPPN-20250203000000 (completed, subscription_id linked)
- ✅ Payment: Rp 81,000,000 (success, paid)
- ✅ Subscription: Active until 2026-02-03 (1 day left)

---

## 🔧 Coolify Deployment Steps

### 1. Backend Deployment

**Environment Variables (Tambahkan di Coolify):**
```env
# Database
DATABASE_URL=postgresql://user:password@db-host:5432/neointegra
# Atau gunakan SQLite untuk testing:
# DATABASE_URL=sqlite:///./neointegra.db

# Security
SECRET_KEY=your-secret-key-here-generate-random-64-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200

# iPaymu Payment Gateway
IPAYMU_VA=1179001393387726
IPAYMU_API_KEY=CED87086-8579-48DA-AC7D-0F8D461C9961
IPAYMU_PRODUCTION=true

# Email (Hello Mail)
MAIL_USERNAME=your-hello-mail-username
MAIL_PASSWORD=your-hello-mail-password
MAIL_FROM=noreply@neointegratech.com
MAIL_PORT=587
MAIL_SERVER=smtp.hellomail.com
MAIL_FROM_NAME=NeoIntegra Tech

# CORS
FRONTEND_URL=https://neointegratech.com
```

**Deployment Commands:**
```bash
# Coolify akan otomatis run:
# 1. docker build -t backend .
# 2. docker run -p 8000:8000 backend

# Manual test (optional):
curl https://api.neointegratech.com/docs
```

**Post-Deploy Script (Run in Coolify terminal):**
```bash
# Create RSPPN test data di production
python3 setup_rsppn_complete.py

# Verify data
python3 quick_check.py
```

---

### 2. Frontend Deployment

**Environment Variables (Build-time di Coolify):**
```env
VITE_API_URL=https://api.neointegratech.com
```

**Deployment Commands:**
```bash
# Coolify akan otomatis run:
# 1. docker build -t frontend .
# 2. npm install (dalam container)
# 3. npm run build (Vite build)
# 4. nginx serve dist/ folder

# Manual test (optional):
curl https://neointegratech.com
```

**Dockerfile sudah optimal:**
- Build stage: Node.js 18 Alpine
- Production stage: Nginx Alpine (lightweight)
- Memory limit: 2048MB untuk Vite build

---

## 🧪 Testing After Deploy

### 1. Test Backend API
```bash
# Health check
curl https://api.neointegratech.com/

# API docs
open https://api.neointegratech.com/docs

# Login test
curl -X POST https://api.neointegratech.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"web@rsppn.co.id","password":"rsppn178#"}'
```

### 2. Test Frontend UI
1. Open: https://neointegratech.com
2. Login: web@rsppn.co.id / rsppn178#
3. Navigate: Dashboard → Pesanan Saya
4. Verify: Tombol "🔄 Perpanjang Sekarang" muncul di order completed
5. Navigate: Dashboard → Riwayat Pembayaran
6. Verify: Warning banner subscription expiry muncul

### 3. Test Renewal Flow (End-to-End)
```bash
# 1. Login via API
TOKEN=$(curl -X POST https://api.neointegratech.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"web@rsppn.co.id","password":"rsppn178#"}' \
  | jq -r '.access_token')

# 2. Get subscriptions
curl https://api.neointegratech.com/api/subscriptions/my-subscriptions \
  -H "Authorization: Bearer $TOKEN"

# 3. Create renewal order
curl -X POST https://api.neointegratech.com/api/orders/renew \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"subscription_id":1}'

# 4. Create payment (get VA number)
curl -X POST https://api.neointegratech.com/api/payments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": 2,
    "payment_method": "va",
    "payment_channel": "bca",
    "amount": 81000000
  }'
```

### 4. Test Auto-Renewal (After Payment)
- Bayar ke VA number yang didapat
- iPaymu akan send callback ke: `https://api.neointegratech.com/api/payments/callback`
- Backend akan otomatis:
  - Update payment.status = "success"
  - Update order.status = "paid"
  - Extend subscription.end_date + 365 days
  - Send email confirmation

---

## 🔍 Troubleshooting

### Backend tidak start
```bash
# Cek logs di Coolify
docker logs backend-container-id

# Common issues:
# - DATABASE_URL not set
# - SECRET_KEY not set
# - Port 8000 already used
```

### Frontend build failed
```bash
# Cek logs di Coolify
docker logs frontend-container-id

# Common issues:
# - npm install gagal (network timeout)
# - Vite build out of memory (increase NODE_OPTIONS)
# - VITE_API_URL not set
```

### Tombol perpanjang tidak muncul
```bash
# SSH ke backend container di Coolify, run:
python3 quick_check.py

# Harus output:
# ✅ SEMUA KONDISI TERPENUHI!
# ✅ Tombol 'Perpanjang Sekarang' SEHARUSNYA MUNCUL

# Jika tidak:
# - Order.subscription_id = NULL → Run fix_rsppn_subscription_id.py
# - Frontend cache → Clear browser cache, hard reload
# - Token expired → Logout & login again
```

### Payment callback tidak sampai
```bash
# Test webhook dari server
curl -X POST https://api.neointegratech.com/api/payments/callback \
  -H "Content-Type: application/json" \
  -d '{
    "trx_id": "TEST123",
    "status": "berhasil",
    "status_code": "1"
  }'

# Pastikan:
# - Firewall tidak block iPaymu IP
# - HTTPS certificate valid
# - nginx/apache tidak timeout
```

---

## 📊 Monitoring

### Health Checks
```bash
# Backend
curl https://api.neointegratech.com/

# Frontend
curl https://neointegratech.com
```

### Database Size (SQLite)
```bash
# SSH ke backend container
ls -lh neointegra.db
# Backup regular:
cp neointegra.db neointegra.db.backup-$(date +%Y%m%d)
```

### Logs
```bash
# Backend logs
docker logs -f backend-container-id

# Frontend logs (nginx)
docker logs -f frontend-container-id

# Filter errors only
docker logs backend-container-id 2>&1 | grep ERROR
```

---

## 🎯 Next Steps After Deploy

1. ✅ Redeploy backend (pull dari GitHub, auto-rebuild)
2. ✅ Redeploy frontend (pull dari GitHub, auto-rebuild)
3. ✅ Run setup_rsppn_complete.py di backend container
4. ✅ Test login web@rsppn.co.id
5. ✅ Verify tombol perpanjang muncul
6. ✅ Test end-to-end renewal flow
7. ✅ Setup database backup cron job
8. ✅ Setup monitoring (uptime, error rate)

---

## 📝 Credentials Reference

### Test Account
- Email: web@rsppn.co.id
- Password: rsppn178#
- Subscription: Active until 2026-02-03

### iPaymu
- VA Number: 1179001393387726
- API Key: CED87086-8579-48DA-AC7D-0F8D461C9961
- Mode: Production

### URLs
- Frontend: https://neointegratech.com
- Backend API: https://api.neointegratech.com
- API Docs: https://api.neointegratech.com/docs

---

**Status:** 🟢 Ready to Deploy
**Last Updated:** 2026-02-01
**Commit:** b827489 - "fix: set subscription_id on RSPPN order for renewal button"
