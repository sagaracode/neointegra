# Setup Instruksi - Fitur Subscription Expiry

## Deskripsi
Fitur ini menambahkan halaman khusus untuk pelanggan dengan langganan yang akan habis, dengan akses spesial untuk user `web@rsppn.co.id`.

## Perubahan yang Dilakukan

### Backend

1. **Model Baru: Subscription** ([backend/app/models.py](backend/app/models.py))
   - Menambahkan model `Subscription` untuk tracking langganan pelanggan
   - Field: user_id, package_name, package_type, start_date, end_date, price, dll

2. **Endpoint Baru: Subscriptions** ([backend/app/api/endpoints/subscriptions.py](backend/app/api/endpoints/subscriptions.py))
   - `GET /api/subscriptions/my-subscriptions` - Ambil semua subscription user
   - `GET /api/subscriptions/expiring-soon` - Ambil subscription yang akan habis
   - `POST /api/subscriptions/renew/{subscription_id}` - Buat order perpanjangan

3. **Schema Baru** ([backend/app/schemas.py](backend/app/schemas.py))
   - `SubscriptionBase`, `SubscriptionCreate`, `SubscriptionResponse`
   - `SubscriptionRenewalCreate`

4. **Router Update** ([backend/app/api/router.py](backend/app/api/router.py))
   - Menambahkan subscriptions router

5. **Seeder Update** ([backend/app/seed.py](backend/app/seed.py))
   - Menambahkan fungsi `seed_special_customer()`
   - Membuat user khusus: `web@rsppn.co.id` dengan password `soedirman178#`
   - Membuat subscription yang expire tanggal 28 Januari 2026
   - Harga perpanjangan: Rp 81.000.000

### Frontend

1. **Halaman Baru: SubscriptionExpiry** ([frontend/src/pages/SubscriptionExpiry.jsx](frontend/src/pages/SubscriptionExpiry.jsx))
   - Menampilkan warning banner untuk subscription yang akan habis
   - Detail subscription (package name, tanggal mulai/berakhir)
   - Form perpanjangan dengan pilihan metode pembayaran (VA/QRIS)
   - Tombol perpanjang yang langsung membuat order dan payment

2. **Route Update** ([frontend/src/App.jsx](frontend/src/App.jsx))
   - Menambahkan route `/subscription-expiry`

3. **Login Update** ([frontend/src/pages/Login.jsx](frontend/src/pages/Login.jsx))
   - Redirect otomatis ke `/subscription-expiry` untuk user `web@rsppn.co.id`
   - User lain tetap redirect ke `/dashboard`

## Langkah Setup

### 1. Update Database Schema

Jalankan perintah berikut untuk membuat tabel `subscriptions`:

```bash
cd backend
python -m app.database
```

Atau jika menggunakan alembic/migration tool, buat migration baru:

```bash
alembic revision --autogenerate -m "Add subscriptions table"
alembic upgrade head
```

### 2. Seed Data Special Customer

Jalankan seeder untuk membuat user dan subscription khusus:

```bash
cd backend
python -m app.seed
```

Output yang diharapkan:
```
🌱 Database seeder starting...

✅ Special customer created successfully!
✅ Expiring subscription created successfully!
   - Package: Paket All In One
   - Expires: 28 Januari 2026
   - Price: Rp 81,000,000

✅ Database seeding completed!
```

### 3. Install Dependencies (jika belum)

Backend:
```bash
cd backend
pip install -r requirements.txt
```

Frontend:
```bash
cd frontend
npm install
```

### 4. Jalankan Aplikasi

Terminal 1 - Backend:
```bash
cd backend
uvicorn app.main:app --reload
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

## Testing

### 1. Login sebagai Special Customer
- Buka browser: `http://localhost:5173/login`
- Email: `web@rsppn.co.id`
- Password: `soedirman178#`
- Seharusnya otomatis redirect ke halaman subscription expiry

### 2. Test Halaman Subscription Expiry
- Cek tampilan warning banner
- Cek detail subscription (package name, tanggal)
- Cek countdown days remaining
- Test pilihan metode pembayaran (VA/QRIS)
- Test pilihan channel (BCA, BNI, BRI, Mandiri)

### 3. Test Flow Perpanjangan
- Klik tombol "Perpanjang Sekarang"
- Sistem akan:
  1. Membuat order baru untuk perpanjangan
  2. Membuat payment dengan jumlah Rp 81.000.000
  3. Redirect ke halaman payment atau dashboard

### 4. Test untuk User Normal
- Login dengan user biasa
- Seharusnya redirect ke dashboard
- Akses `/subscription-expiry` secara manual
- Seharusnya muncul pesan "Tidak Ada Langganan yang Akan Habis"

## API Endpoints yang Tersedia

### Subscriptions

```
GET /api/subscriptions/my-subscriptions
Response: List of all user's subscriptions

GET /api/subscriptions/expiring-soon
Response: List of subscriptions expiring within 30 days

GET /api/subscriptions/{subscription_id}
Response: Detail of specific subscription

POST /api/subscriptions/renew/{subscription_id}
Response: Created renewal order
{
  "message": "Renewal order created successfully",
  "order_id": 123,
  "order_number": "ORD-20260121-0001",
  "total": 81000000,
  "subscription_id": 1
}
```

## Fitur yang Sudah Diimplementasikan

✅ Model Subscription di database
✅ Endpoint untuk management subscription
✅ Seeder untuk user khusus dan subscription
✅ Halaman frontend dengan UI yang menarik
✅ Auto-redirect untuk user khusus saat login
✅ Countdown days remaining
✅ Pilihan metode pembayaran (VA/QRIS)
✅ Pilihan channel bank (BCA, BNI, BRI, Mandiri)
✅ Integrasi dengan payment system yang ada
✅ Responsive design
✅ Loading states dan error handling

## Catatan Penting

1. **Payment Integration**: Sistem ini menggunakan iPaymu yang sudah ada di aplikasi. Pastikan iPaymu sudah dikonfigurasi dengan benar di `.env`:
   ```
   IPAYMU_VA=your_va_number
   IPAYMU_API_KEY=your_api_key
   IPAYMU_BASE_URL=https://my.ipaymu.com/api/v2
   ```

2. **Subscription Expiry Logic**: 
   - Halaman menampilkan subscription yang akan expire dalam 30 hari
   - Warning berwarna merah jika tersisa ≤7 hari
   - Warning berwarna kuning jika tersisa >7 hari

3. **Security**: 
   - Semua endpoint subscription memerlukan authentication
   - User hanya bisa melihat subscription milik mereka sendiri
   - Password di-hash menggunakan bcrypt

4. **Customization**:
   - Untuk mengubah harga perpanjangan, edit di seeder atau database
   - Untuk menambah metode pembayaran, edit array `paymentMethods` di component
   - Untuk mengubah threshold warning, edit di function `isUrgent`

## Troubleshooting

### Database Error
Jika ada error "table subscriptions does not exist":
```bash
# Buat tabel manual atau jalankan migration
python -m app.database
```

### User Already Exists
Jika seeder error "Email already registered", itu normal. User sudah dibuat sebelumnya.

### Payment Error
Jika error saat membuat payment:
- Cek konfigurasi iPaymu di `.env`
- Cek koneksi internet
- Cek log backend untuk detail error

### Redirect Issue
Jika tidak redirect otomatis setelah login:
- Clear browser cache
- Cek console browser untuk error
- Pastikan email exact match: `web@rsppn.co.id`

## Support

Untuk pertanyaan atau issue, silakan hubungi tim development.
