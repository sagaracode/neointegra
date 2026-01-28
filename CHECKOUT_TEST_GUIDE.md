# 🧪 Panduan Testing Checkout

## Status Server
- ✅ Backend: http://localhost:8000
- ✅ Frontend: http://localhost:5173
- ✅ Database: neointegratech.db (sudah di-recreate dengan slug)

## Services yang Tersedia
1. **all-in** - Paket All In Service (Rp 81.000.000)
2. **website** - Website Service (Rp 36.000.000)
3. **seo** - SEO Service (Rp 42.000.000)
4. **mail-server** - Mail Server Service (Rp 15.000.000)
5. **cloudflare** - Cloudflare Service (Rp 24.000.000)

## Cara Test Checkout

### 1. Buka Browser
Buka: http://localhost:5173

### 2. Login (Wajib!)
- Email: `demo@neointegra.tech`
- Password: `demo123`

### 3. Test Checkout di Berbagai Halaman

#### A. Homepage (ServiceCards)
- Scroll ke bagian "Layanan Kami"
- Klik tombol **"Checkout & Bayar"** pada card service manapun
- Harus langsung proses tanpa form

#### B. Halaman /services (Grid View)
- Klik menu "Services" atau buka: http://localhost:5173/services
- Lihat grid services
- Klik tombol **"Checkout & Bayar"** di bawah service card manapun
- Harus langsung proses tanpa form

#### C. Halaman All In (/services/all-in)
- Buka: http://localhost:5173/services/all-in
- Scroll ke bagian "Siap Mengembangkan Bisnis Anda?"
- Klik tombol **"Checkout & Bayar Sekarang"**
- Harus langsung proses tanpa form

#### D. Halaman Detail Service (/services/website, /services/seo, dll)
- Buka salah satu: 
  - http://localhost:5173/services/website
  - http://localhost:5173/services/seo
  - http://localhost:5173/services/mail-server
  - http://localhost:5173/services/cloudflare
- Scroll ke bagian "Catatan Harga"
- Klik tombol hijau **"Checkout & Bayar Sekarang"** (paling atas)
- Harus langsung proses tanpa form

## Yang Harus Terjadi

### ✅ Skenario Success:
1. User klik tombol "Checkout & Bayar"
2. Tombol berubah jadi "Memproses..." dengan spinner
3. Backend create order (POST /api/orders)
4. Backend create payment (POST /api/payments/create)
5. Redirect ke halaman payment iPaymu (atau halaman pending jika payment_url tidak ada)

### ❌ Jika Error:
- Buka Console (F12) di browser
- Lihat error message
- Screenshot dan kirim ke developer

## Troubleshooting

### Error: "Silakan login terlebih dahulu"
**Solusi:** Login dulu dengan akun demo@neointegra.tech / demo123

### Error: "Service dengan slug 'xxx' tidak ditemukan"
**Solusi:** Database belum di-seed atau slug salah
```bash
cd d:\WEBSITES\backend
python -m app.seed
```

### Error: 405 Method Not Allowed
**Solusi:** Backend tidak running atau endpoint salah. Pastikan backend di port 8000:
```bash
cd d:\WEBSITES\backend
uvicorn app.main:app --reload --port 8000
```

### Error: Network Error / Cannot connect
**Solusi:** 
1. Pastikan backend running di localhost:8000
2. Cek API URL di frontend .env: `VITE_API_URL=http://localhost:8000/api`

## Data Flow Checkout

```
User Click Button
      ↓
handleCheckout(serviceSlug)
      ↓
Check isAuthenticated (dari zustand store)
      ↓
ordersAPI.create({ service_slug: 'all-in', quantity: 1, notes: '...' })
      ↓
POST http://localhost:8000/api/orders
      ↓
Backend: Find service by slug
      ↓
Backend: Create order with calculated price
      ↓
Return order with id and total_price
      ↓
paymentsAPI.create({ order_id, payment_method: 'va', payment_channel: 'bca', amount })
      ↓
POST http://localhost:8000/api/payments/create
      ↓
Backend: Call iPaymu API (Production)
      ↓
Return payment_url
      ↓
window.location.href = payment_url
```

## Production Deployment

Setelah test lokal berhasil:

1. **Deploy Frontend** - Coolify auto-deploy dari GitHub
2. **Deploy Backend** - Coolify auto-deploy dari GitHub  
3. **Update Database Production**:
   ```bash
   # Via Coolify Terminal (Backend Container)
   python -m app.database
   python -m app.seed
   ```

---
**Last Updated:** 28 Januari 2026
**Commit:** ca077dc
