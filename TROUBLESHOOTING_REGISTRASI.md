# Troubleshooting Registrasi - NeoIntegraTech

## Masalah yang Ditemukan

### 1. Field Name Mismatch (SOLVED ✅)
**Masalah**: Frontend mengirim field `company`, tapi backend mengharapkan `company_name`
**Solusi**: Updated Register.jsx untuk menggunakan `company_name`
- Commit: `2c233b5`
- Files: `frontend/src/pages/Register.jsx`

### 2. Virtual Environment Issue (SOLVED ✅)
**Masalah**: `venv_new` rusak, pydantic-settings tidak terinstall
**Solusi**: 
- Created new venv: `venv_fixed`
- Installed all dependencies: `pip install -r requirements.txt`

### 3. Database Not Initialized (SOLVED ✅)
**Masalah**: Database tables belum dibuat
**Solusi**: 
```bash
cd D:\WEBSITES\backend
python -m app.database
```

## Langkah Setup Backend (Lokal)

### 1. Activate Virtual Environment
```powershell
cd D:\WEBSITES\backend
.\venv_fixed\Scripts\Activate.ps1
```

### 2. Install Dependencies (jika belum)
```powershell
pip install -r requirements.txt
```

### 3. Initialize Database
```powershell
python -m app.database
```

### 4. Run Backend Server
```powershell
$env:PYTHONPATH = "D:\WEBSITES\backend"
uvicorn app.main:app --reload --port 8000 --host 0.0.0.0
```

Backend akan berjalan di: `http://localhost:8000`
API Docs: `http://localhost:8000/docs`

## Langkah Setup Frontend (Lokal)

### 1. Install Dependencies
```powershell
cd D:\WEBSITES\frontend
npm install
```

### 2. Buat file .env
```env
VITE_API_URL=http://localhost:8000/api
```

### 3. Run Frontend
```powershell
npm run dev
```

Frontend akan berjalan di: `http://localhost:5173`

## Testing Registrasi

1. Buka browser: `http://localhost:5173/register`
2. Isi form:
   - Nama Lengkap: Test User
   - Email: test@example.com
   - Phone: 08123456789 (optional)
   - Perusahaan: Test Company (optional)
   - Password: testpassword123
   - Confirm Password: testpassword123
3. Klik "Daftar"
4. Jika berhasil, akan redirect ke `/login`

## Testing Checkout

1. Login dengan akun yang sudah dibuat
2. Buka halaman services: `http://localhost:5173/services`
3. Klik "Checkout & Bayar" pada salah satu service
4. Akan otomatis:
   - Create order
   - Create payment dengan iPaymu
   - Redirect ke payment page

## Status Current

✅ Backend running di `http://localhost:8000`
✅ Database initialized dengan tables: users, services, orders, subscriptions, payments
✅ Registration field mismatch fixed
✅ Virtual environment setup correctly

## Next Steps untuk Production

1. Deploy frontend & backend ke Coolify dengan commit terbaru
2. Setup environment variables di Coolify backend:
   - `IPAYMU_VA=1179001393387726`
   - `IPAYMU_API_KEY=CED87086-8579-48DA-AC7D-0F8D461C9961`
   - `IPAYMU_PRODUCTION=true`
   - `DATABASE_URL` (PostgreSQL recommended)
   - `SECRET_KEY` (64+ characters random string)
   - `FRONTEND_URL=https://neointegratech.com`
3. Run database initialization di production: `python -m app.database`
4. Run seeder untuk populate services: `python -m app.seed`
5. Test full checkout flow di production

## Common Errors

### `ModuleNotFoundError: No module named 'app'`
**Solusi**: Pastikan menjalankan uvicorn dari dalam folder `backend` atau set PYTHONPATH

### `No module named 'pydantic_settings'`
**Solusi**: Install pydantic-settings: `pip install pydantic-settings`

### `Registration failed`
**Solusi**: 
1. Cek backend logs untuk error detail
2. Pastikan database sudah diinisialisasi
3. Pastikan field names match antara frontend & backend

### Backend tidak bisa diakses dari frontend
**Solusi**: Pastikan CORS sudah dikonfigurasi di backend untuk allow frontend URL
