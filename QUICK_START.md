# 🚀 Quick Start Deployment Guide

## Ringkasan Cepat Deploy ke Hostinger VPS dengan Coolify

### 📦 Yang Anda Butuhkan:
- ✅ VPS Hostinger KVM 2 (Rp 106.900/bulan)
- ✅ Domain (opsional, bisa pakai subdomain Coolify dulu)
- ✅ GitHub account
- ✅ 30-45 menit waktu setup

---

## 🎯 Langkah Cepat (30 Menit)

### 1️⃣ Setup VPS (5 menit)
```bash
# Login ke VPS
ssh root@YOUR_VPS_IP

# Update sistem
apt update && apt upgrade -y

# Install Coolify
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

### 2️⃣ Akses Coolify (2 menit)
1. Buka: `http://YOUR_VPS_IP:8000`
2. Buat akun admin pertama
3. Login

### 3️⃣ Push ke GitHub (5 menit)
```bash
# Backend
cd backend
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/backend.git
git push -u origin main

# Frontend
cd ../frontend
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/frontend.git
git push -u origin main
```

### 4️⃣ Deploy Database (3 menit)
Di Coolify Dashboard:
1. **Databases** → **+ New Database**
2. Pilih **PostgreSQL 15**
3. Name: `production-db`
4. **Create**
5. Copy connection string yang muncul

### 5️⃣ Deploy Backend (8 menit)
1. **Projects** → **+ New Project** → "FastAPI Backend"
2. **+ New Resource** → **Application**
3. Connect GitHub → Pilih backend repo
4. **Build Pack**: Dockerfile
5. **Environment Variables**:
   ```env
   DATABASE_URL=postgresql://user:pass@production-db:5432/app_db
   SECRET_KEY=generate-random-32-chars
   FRONTEND_URL=http://localhost
   ```
6. **Port**: 8000
7. **Deploy**

### 6️⃣ Deploy Frontend (7 menit)
1. Same project → **+ New Resource** → **Application**
2. Connect GitHub → Pilih frontend repo
3. **Build Pack**: Dockerfile
4. **Environment Variables**:
   ```env
   VITE_API_URL=https://backend-xxx.coolify.app/api
   ```
5. **Port**: 80
6. **Deploy**

### 7️⃣ Setup Domain (5 menit) - OPSIONAL
**Jika punya domain:**
1. DNS A Record: `api.yourdomain.com` → `YOUR_VPS_IP`
2. DNS A Record: `yourdomain.com` → `YOUR_VPS_IP`
3. Di Coolify: Add domains & enable SSL
4. Update environment variables dengan domain baru
5. Redeploy

---

## ✅ Checklist

- [ ] VPS Hostinger KVM 2 sudah dibeli
- [ ] Coolify sudah terinstall
- [ ] Database PostgreSQL sudah dibuat
- [ ] Backend sudah di-push ke GitHub
- [ ] Frontend sudah di-push ke GitHub
- [ ] Dockerfile backend & frontend sudah ada
- [ ] Backend sudah deployed
- [ ] Frontend sudah deployed
- [ ] Environment variables sudah diset
- [ ] Domain sudah dikonfigurasi (opsional)
- [ ] SSL sudah aktif
- [ ] Website bisa diakses!

---

## 🔗 File Penting

1. **Panduan Lengkap**: `DEPLOYMENT_GUIDE_HOSTINGER_COOLIFY.md`
2. **Backend Dockerfile**: `backend/Dockerfile`
3. **Frontend Dockerfile**: `frontend/Dockerfile`
4. **Nginx Config**: `frontend/nginx.conf`
5. **Env Example**: `.env.example`

---

## 🆘 Troubleshooting Cepat

**Build Failed?**
- Cek logs di Coolify
- Pastikan Dockerfile syntax benar
- Cek requirements.txt/package.json

**Database Connection Error?**
- Cek DATABASE_URL di env vars
- Pastikan format benar: `postgresql://user:pass@host:5432/db`

**CORS Error?**
- Update FRONTEND_URL di backend env
- Restart backend

**502 Bad Gateway?**
- Cek port configuration (8000 backend, 80 frontend)
- Restart application

---

## 📊 Biaya

| Item | Biaya/Bulan |
|------|-------------|
| VPS KVM 2 | Rp 106.900 |
| Domain | Rp 12.500 |
| **Total** | **~Rp 120.000** |

**Coolify: GRATIS!** 🎉

---

## 🎉 Selesai!

Website Anda sekarang live dengan:
- ✅ Auto-deploy dari GitHub push
- ✅ HTTPS/SSL gratis otomatis
- ✅ PostgreSQL database managed
- ✅ Backup otomatis
- ✅ Monitoring & logs
- ✅ Lebih murah 50% dari Railway/Render!

**Need help?** Lihat `DEPLOYMENT_GUIDE_HOSTINGER_COOLIFY.md` untuk panduan lengkap!
