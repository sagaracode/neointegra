# 🚀 Panduan Deployment FastAPI + React ke Hostinger VPS dengan Coolify

## 📋 Table of Contents
1. [Persiapan VPS](#1-persiapan-vps)
2. [Install Coolify](#2-install-coolify)
3. [Persiapan Repository GitHub](#3-persiapan-repository-github)
4. [Deploy PostgreSQL Database](#4-deploy-postgresql-database)
5. [Deploy Backend FastAPI](#5-deploy-backend-fastapi)
6. [Deploy Frontend React](#6-deploy-frontend-react)
7. [Setup Domain & SSL](#7-setup-domain--ssl)
8. [Environment Variables](#8-environment-variables)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Persiapan VPS

### Step 1.1: Beli VPS Hostinger
1. Buka https://www.hostinger.com/id/hosting-vps
2. Pilih paket **KVM 2** (Rekomendasi)
   - 2 vCPU cores
   - 8 GB RAM
   - 100 GB NVMe
   - Rp 106.900/bulan
3. Pilih **Operating System**: Ubuntu 22.04 LTS
4. Selesaikan pembayaran

### Step 1.2: Akses VPS
Setelah VPS aktif, Anda akan menerima:
- **IP Address**: `xxx.xxx.xxx.xxx`
- **Root Password**: (via email)

Login ke VPS via SSH:
```bash
ssh root@xxx.xxx.xxx.xxx
```

### Step 1.3: Update System
```bash
apt update && apt upgrade -y
```

---

## 2. Install Coolify

### Step 2.1: Install Coolify (Single Command)
```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

Proses instalasi akan:
- Install Docker & Docker Compose
- Setup Coolify
- Configure firewall
- Setup SSL automation
- ⏱️ Waktu: ~5-10 menit

### Step 2.2: Akses Coolify Dashboard
1. Buka browser: `http://YOUR_VPS_IP:8000`
2. Buat akun admin pertama kali:
   - **Email**: admin@yourdomain.com
   - **Password**: (pilih password yang kuat)
3. Login ke dashboard

### Step 2.3: Konfigurasi Awal
1. **Settings** → **General**
   - Instance Domain: `YOUR_VPS_IP` (sementara)
2. **Settings** → **Email** (opsional)
   - Setup SMTP untuk notifikasi

---

## 3. Persiapan Repository GitHub

### Step 3.1: Push Code ke GitHub

**Backend Repository:**
```bash
cd d:\WEBSITES\backend
git init
git add .
git commit -m "Initial backend commit"
git remote add origin https://github.com/USERNAME/backend-repo.git
git push -u origin main
```

**Frontend Repository:**
```bash
cd d:\WEBSITES\frontend
git init
git add .
git commit -m "Initial frontend commit"
git remote add origin https://github.com/USERNAME/frontend-repo.git
git push -u origin main
```

### Step 3.2: Buat Dockerfile untuk Backend

**File: `backend/Dockerfile`**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Commit dan push:**
```bash
git add Dockerfile
git commit -m "Add Dockerfile"
git push
```

### Step 3.3: Buat Dockerfile untuk Frontend

**File: `frontend/Dockerfile`**
```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**File: `frontend/nginx.conf`**
```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Commit dan push:**
```bash
git add Dockerfile nginx.conf
git commit -m "Add Dockerfile and nginx config"
git push
```

---

## 4. Deploy PostgreSQL Database

### Step 4.1: Buat Database di Coolify
1. Dashboard Coolify → **Databases** → **+ New Database**
2. Pilih **PostgreSQL**
3. Konfigurasi:
   - **Name**: `production-db`
   - **Database Name**: `app_db`
   - **Username**: `app_user`
   - **Password**: (auto-generated atau custom)
   - **Version**: `15` (latest stable)
4. Klik **Create**

### Step 4.2: Catat Connection String
Setelah database ready, copy connection string:
```
postgresql://app_user:PASSWORD@production-db:5432/app_db
```

⚠️ **Simpan ini untuk environment variables backend!**

---

## 5. Deploy Backend FastAPI

### Step 5.1: Buat Project di Coolify
1. Dashboard → **Projects** → **+ New Project**
2. **Project Name**: `FastAPI Backend`
3. **+ New Resource** → **Application**

### Step 5.2: Konfigurasi Git Repository
1. **Source**: GitHub
2. **Connect GitHub** (authorize Coolify)
3. **Select Repository**: `USERNAME/backend-repo`
4. **Branch**: `main`
5. **Build Pack**: Dockerfile

### Step 5.3: Set Environment Variables
Klik **Environment Variables**, tambahkan:

```env
# Database
DATABASE_URL=postgresql://app_user:PASSWORD@production-db:5432/app_db

# JWT & Security
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Email Configuration
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=your-email@gmail.com
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com
MAIL_FROM_NAME=Your App Name

# Payment Gateway (jika ada)
MIDTRANS_SERVER_KEY=your-midtrans-server-key
MIDTRANS_CLIENT_KEY=your-midtrans-client-key
MIDTRANS_IS_PRODUCTION=false

# Frontend URL (untuk CORS)
FRONTEND_URL=https://yourdomain.com

# App Settings
APP_NAME=Your App Name
DEBUG=false
```

### Step 5.4: Konfigurasi Deployment
1. **Port**: `8000`
2. **Health Check Path**: `/`
3. **Auto Deploy**: Enable (deploy otomatis saat push GitHub)

### Step 5.5: Deploy
1. Klik **Deploy**
2. Monitor logs untuk memastikan deployment berhasil
3. Setelah selesai, backend akan running di: `http://backend-XXXX.coolify.app`

### Step 5.6: Update CORS di Backend

**File: `backend/app/main.py`**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# CORS Configuration
origins = [
    os.getenv("FRONTEND_URL", "http://localhost:5173"),
    "https://yourdomain.com",  # Production domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Your routes...
```

---

## 6. Deploy Frontend React

### Step 6.1: Buat Application untuk Frontend
1. Dashboard → **Projects** → Pilih project yang sama
2. **+ New Resource** → **Application**

### Step 6.2: Konfigurasi Git Repository
1. **Source**: GitHub
2. **Select Repository**: `USERNAME/frontend-repo`
3. **Branch**: `main`
4. **Build Pack**: Dockerfile

### Step 6.3: Set Environment Variables
```env
VITE_API_URL=https://backend-XXXX.coolify.app/api
VITE_APP_NAME=Your App Name
```

### Step 6.4: Update Frontend API Configuration

**File: `frontend/src/services/api.js`**
```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Step 6.5: Deploy
1. **Port**: `80`
2. Klik **Deploy**
3. Frontend akan available di: `http://frontend-XXXX.coolify.app`

---

## 7. Setup Domain & SSL

### Step 7.1: Setup Domain untuk Backend
1. Beli domain atau gunakan existing domain
2. Tambahkan DNS A Record:
   ```
   api.yourdomain.com → YOUR_VPS_IP
   ```

3. Di Coolify Backend App:
   - **Settings** → **Domains**
   - Add domain: `api.yourdomain.com`
   - **Enable Automatic HTTPS**: On
   - Save

### Step 7.2: Setup Domain untuk Frontend
1. Tambahkan DNS A Record:
   ```
   yourdomain.com → YOUR_VPS_IP
   www.yourdomain.com → YOUR_VPS_IP
   ```

2. Di Coolify Frontend App:
   - **Settings** → **Domains**
   - Add domain: `yourdomain.com, www.yourdomain.com`
   - **Enable Automatic HTTPS**: On
   - Save

### Step 7.3: Update Environment Variables

**Backend:**
```env
FRONTEND_URL=https://yourdomain.com
```

**Frontend:**
```env
VITE_API_URL=https://api.yourdomain.com/api
```

Redeploy kedua aplikasi setelah update env vars.

---

## 8. Environment Variables

### Backend Environment Variables Lengkap
```env
# Database
DATABASE_URL=postgresql://app_user:PASSWORD@production-db:5432/app_db

# JWT & Security
SECRET_KEY=generate-with-openssl-rand-hex-32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Email (Gmail)
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-gmail-app-password
MAIL_FROM=your-email@gmail.com
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com
MAIL_FROM_NAME=Your App Name
MAIL_TLS=true
MAIL_SSL=false

# Payment - Midtrans
MIDTRANS_SERVER_KEY=your-server-key
MIDTRANS_CLIENT_KEY=your-client-key
MIDTRANS_IS_PRODUCTION=false

# CORS
FRONTEND_URL=https://yourdomain.com

# App
APP_NAME=Your App Name
DEBUG=false
ENVIRONMENT=production

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
```

### Frontend Environment Variables
```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_APP_NAME=Your App Name
VITE_MIDTRANS_CLIENT_KEY=your-client-key
```

---

## 9. Database Migration

### Step 9.1: Buat Alembic Migration (jika menggunakan)

**File: `backend/alembic.ini`**
```ini
[alembic]
script_location = alembic
sqlalchemy.url = driver://user:pass@localhost/dbname
```

**File: `backend/app/database.py` - Update untuk production**
```python
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

# SQLite to PostgreSQL
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
```

### Step 9.2: Run Migration via Coolify

1. Backend App → **Terminal**
2. Run:
```bash
# Create tables
python -c "from app.database import Base, engine; Base.metadata.create_all(bind=engine)"

# Or jika pakai Alembic
alembic upgrade head

# Seed data (opsional)
python -m app.seed
```

---

## 10. Monitoring & Logs

### View Application Logs
1. Dashboard → **Your Application**
2. **Logs** tab
3. Monitor real-time logs

### Health Checks
Coolify automatically monitors:
- Application uptime
- Memory usage
- CPU usage
- Response time

### Backup Database
1. **Database** → **production-db**
2. **Backups** → **+ Schedule Backup**
3. Schedule: Daily at 02:00 AM
4. Retention: 7 days

---

## 11. Troubleshooting

### Problem: Backend tidak connect ke Database
**Solution:**
```bash
# Cek database logs
Dashboard → Database → Logs

# Pastikan DATABASE_URL benar
# Format: postgresql://user:pass@hostname:5432/dbname
```

### Problem: CORS Error di Frontend
**Solution:**
```python
# backend/app/main.py
origins = [
    "https://yourdomain.com",
    "https://www.yourdomain.com",
    os.getenv("FRONTEND_URL"),
]
```

### Problem: Build Failed
**Solution:**
```bash
# Cek Dockerfile syntax
# Pastikan semua dependencies di requirements.txt/package.json

# Test locally:
docker build -t myapp .
docker run -p 8000:8000 myapp
```

### Problem: SSL Certificate Error
**Solution:**
```bash
# Tunggu 1-2 menit setelah add domain
# Let's Encrypt perlu verify domain
# Pastikan DNS sudah propagate
```

### Problem: 502 Bad Gateway
**Solution:**
```bash
# Cek application logs
# Pastikan port benar (8000 untuk backend, 80 untuk frontend)
# Restart application
```

---

## 12. Maintenance Tasks

### Update Application
```bash
# Push code ke GitHub
git add .
git commit -m "Update feature"
git push

# Coolify auto-deploy jika enabled
# Atau manual: Dashboard → Deploy button
```

### Backup Data
```bash
# Manual backup via Coolify:
Database → Backup → Create Backup Now

# Download backup:
Database → Backups → Download
```

### Scale Application
```bash
# Jika perlu upgrade VPS:
# Hostinger Control Panel → Upgrade VPS
# Restart Coolify services
```

---

## 13. Cost Estimation

| Item | Cost/Month (IDR) |
|------|------------------|
| Hostinger VPS KVM 2 | Rp 106.900 |
| Domain (.com) | Rp 12.500 |
| **Total** | **Rp 119.400** |

**Dibanding:**
- Railway: ~Rp 225.000/month
- Render: ~Rp 150.000/month
- Heroku: ~Rp 210.000/month

**Hemat: 47-53%** 💰

---

## 14. Security Checklist

- [ ] Change default SSH port
- [ ] Setup UFW firewall
- [ ] Enable automatic security updates
- [ ] Use strong passwords
- [ ] Enable 2FA for Coolify
- [ ] Regular backups
- [ ] Monitor logs regularly
- [ ] Update dependencies regularly
- [ ] Use HTTPS everywhere
- [ ] Secure environment variables

---

## 15. Next Steps

1. ✅ Setup monitoring (Uptime Robot, etc.)
2. ✅ Setup email alerts
3. ✅ Configure CDN (Cloudflare) untuk performance
4. ✅ Setup staging environment
5. ✅ Configure CI/CD tests
6. ✅ Setup error tracking (Sentry)
7. ✅ Performance monitoring (New Relic/DataDog)

---

## 🎉 Selamat!

Website Anda sekarang live di production dengan:
- ✅ Auto-deployment dari GitHub
- ✅ HTTPS/SSL gratis
- ✅ PostgreSQL database
- ✅ Automatic backups
- ✅ Real-time logs
- ✅ Monitoring built-in

**Live URLs:**
- Frontend: `https://yourdomain.com`
- Backend API: `https://api.yourdomain.com`
- Admin: `https://yourdomain.com/dashboard`

---

## 📚 Resources

- [Coolify Docs](https://coolify.io/docs)
- [Hostinger VPS Guide](https://www.hostinger.com/tutorials/vps)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

## 💬 Support

Jika ada pertanyaan atau masalah:
1. Cek logs di Coolify
2. Review troubleshooting section
3. Hostinger support: https://www.hostinger.com/cpanel-login
4. Coolify Discord: https://coollabs.io/discord

**Good luck with your deployment! 🚀**
