# Deployment Checklist - NeoIntegraTech

## ✅ Pre-Deployment Checklist

### Backend (api.neointegratech.com)

#### 1. Environment Variables (CRITICAL!)
Di Coolify Backend → Environment Variables, set:

```bash
# Database
DATABASE_URL=sqlite:///./neointegratech.db
# Atau untuk PostgreSQL:
# DATABASE_URL=postgresql://user:password@host:5432/dbname

# Security
SECRET_KEY=<generate-random-64-char-string>
# Generate dengan: python -c "import secrets; print(secrets.token_urlsafe(64))"

# CORS
FRONTEND_URL=https://neointegratech.com

# iPaymu Production
IPAYMU_VA=1179001393387726
IPAYMU_API_KEY=CED87086-8579-48DA-AC7D-0F8D461C9961
IPAYMU_PRODUCTION=true

# Email (Optional - untuk verification emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@neointegratech.com
```

#### 2. Post-Deploy Commands
Setelah backend berhasil deploy, jalankan via Coolify Terminal/Exec:

```bash
# Initialize database tables
python -m app.database

# Seed initial data (services)
python -m app.seed
```

#### 3. Verify Backend Running
Buka di browser:
- Health check: `https://api.neointegratech.com/`
- API docs: `https://api.neointegratech.com/docs`
- Test endpoint: `https://api.neointegratech.com/api/services`

Jika error 404 atau tidak bisa diakses, cek:
- Logs di Coolify
- Port mapping (default: 8000)
- Build success/failed

---

### Frontend (neointegratech.com)

#### 1. Environment Variables (CRITICAL!)
Di Coolify Frontend → Environment Variables, set:

```bash
# API URL - MUST include /api suffix!
VITE_API_URL=https://api.neointegratech.com/api

# App Info
VITE_APP_NAME=NeoIntegraTech
VITE_APP_TAGLINE=Solusi Integrasi Teknologi Terpadu

# Contact (optional)
VITE_CONTACT_EMAIL=hello@neointegratech.com
VITE_CONTACT_PHONE=+62 21 1234 5678
VITE_CONTACT_ADDRESS=Jakarta, Indonesia
```

#### 2. Build Settings
Pastikan build command di Coolify:
```bash
npm install
npm run build
```

Output directory: `dist`

#### 3. Verify Frontend Running
Buka di browser:
- Homepage: `https://neointegratech.com`
- Register: `https://neointegratech.com/register`

Buka Browser Console (F12 → Console) dan cek:
- `API URL: https://api.neointegratech.com/api` (harus muncul saat page load)
- Tidak ada error CORS
- Tidak ada 404 errors

---

## 🔍 Troubleshooting Common Issues

### Error: "Cannot connect to server"

**Penyebab:**
1. Backend tidak running
2. Environment variable `VITE_API_URL` tidak di-set di frontend
3. URL salah (missing `/api` atau typo)

**Solusi:**

1. **Cek API URL di browser console:**
   - Buka `https://neointegratech.com`
   - Tekan F12 → Console tab
   - Cari log: `API URL: ...`
   - Harus: `https://api.neointegratech.com/api` ✅
   - Jika: `http://localhost:8000/api` ❌ → Environment variable belum di-set!

2. **Test backend langsung:**
   ```bash
   curl https://api.neointegratech.com/api/services
   ```
   - Jika error/timeout → Backend tidak running atau port salah
   - Jika dapat response JSON → Backend OK

3. **Fix di Coolify:**
   - Frontend → Environment Variables
   - Add/Edit: `VITE_API_URL=https://api.neointegratech.com/api`
   - Save → Redeploy frontend
   - Clear browser cache (Ctrl+Shift+R)

---

### Error: CORS Policy Blocked

**Symptoms:**
```
Access to XMLHttpRequest at 'https://api...' from origin 'https://neointegratech.com' 
has been blocked by CORS policy
```

**Penyebab:**
- Backend CORS tidak configured properly

**Solusi:**
1. Cek backend code `app/main.py` ada:
   ```python
   allow_origins=["*"]
   ```
2. Redeploy backend dengan latest commit
3. Clear browser cache

---

### Error: "Email already registered"

**Penyebab:**
- Email sudah pernah digunakan untuk registrasi

**Solusi:**
- Gunakan email lain
- Atau hapus user dari database:
  ```bash
  # Via Coolify terminal
  python
  >>> from app.database import SessionLocal
  >>> from app.models import User
  >>> db = SessionLocal()
  >>> user = db.query(User).filter(User.email == "email@example.com").first()
  >>> db.delete(user)
  >>> db.commit()
  >>> exit()
  ```

---

### Frontend Build Failed

**Penyebab:**
- Dependencies error
- Out of memory
- Syntax error in code

**Solusi:**
1. Cek logs di Coolify build output
2. Jika out of memory, increase memory limit di Coolify
3. Jika syntax error, fix code dan push commit baru
4. Clear node_modules: Add build command prefix:
   ```bash
   rm -rf node_modules && npm install && npm run build
   ```

---

### Backend Deployment Failed

**Penyebab:**
- Python dependencies error
- Database connection error
- Port already in use

**Solusi:**
1. Cek logs di Coolify
2. Pastikan requirements.txt complete
3. Cek DATABASE_URL format correct
4. Cek port 8000 tidak digunakan service lain

---

## 📝 Testing Checklist

Setelah deploy, test secara berurutan:

### 1. Backend Health
- [ ] `https://api.neointegratech.com/` returns welcome message
- [ ] `https://api.neointegratech.com/docs` shows API documentation
- [ ] `https://api.neointegratech.com/api/services` returns services list

### 2. Frontend Loading
- [ ] `https://neointegratech.com` loads homepage
- [ ] No console errors (F12)
- [ ] API URL log shows correct URL
- [ ] Images load correctly

### 3. Registration Flow
- [ ] Open `https://neointegratech.com/register`
- [ ] Fill form with valid data
- [ ] Click "Daftar"
- [ ] Should redirect to `/login` with success message
- [ ] Check console for errors

### 4. Login Flow
- [ ] Open `https://neointegratech.com/login`
- [ ] Enter registered email & password
- [ ] Click "Masuk"
- [ ] Should redirect to `/dashboard`
- [ ] User info should appear in dashboard

### 5. Checkout Flow
- [ ] Login first
- [ ] Go to `/services`
- [ ] Click "Checkout & Bayar" on any service
- [ ] Should create order → payment → redirect
- [ ] Check `/orders` to see order created

---

## 🚨 Emergency Rollback

Jika deployment error dan butuh rollback cepat:

1. **Di Coolify:**
   - Klik application (Frontend/Backend)
   - Tab "Deployments"
   - Cari deployment sebelumnya yang sukses
   - Click "Redeploy"

2. **Via Git:**
   ```bash
   # Cek commit history
   git log --oneline

   # Rollback ke commit sebelumnya
   git reset --hard <commit-hash>
   git push -f origin main

   # Trigger redeploy di Coolify
   ```

---

## 📞 Support

Jika masih error setelah ikuti troubleshooting:

1. **Screenshot:**
   - Browser console (F12 → Console)
   - Network tab (F12 → Network) saat error terjadi
   - Coolify logs (Build & Runtime)

2. **Info yang dibutuhkan:**
   - URL yang diakses
   - Error message lengkap
   - Environment variables (censor sensitive data)
   - Latest commit hash deployed

---

**Last Updated:** January 27, 2026
**Latest Commit:** dfeda76
