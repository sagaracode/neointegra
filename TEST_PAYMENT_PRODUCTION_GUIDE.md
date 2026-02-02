# 🧪 Test Payment Production - Setup Guide

## ✅ Yang Sudah Dilakukan

### 1. **Service Test-Payment Ditambahkan**
   - Slug: `test-payment`
   - Harga: **Rp 5.000**
   - Durasi: 1 hari
   - Category: test

### 2. **Email Notifications Aktif**
   ✅ **Email saat payment dibuat (pending)**
   - Dikirim segera setelah create payment
   - Berisi: order number, VA number, jumlah bayar, expired time
   
   ✅ **Email saat payment lunas (success)**
   - Dikirim otomatis via callback iPaymu
   - Berisi: konfirmasi pembayaran, transaction ID, status success

### 3. **Endpoint Admin Init Services**
   - Endpoint: `GET /api/admin/init-services`
   - Bisa diakses tanpa auth
   - Otomatis create/update service termasuk test-payment

---

## 🚀 Cara Setup di Production

### **STEP 1: Tunggu Auto-Deployment**
Perubahan sudah di-push ke GitHub. Tunggu:
- Backend redeploy (~2-5 menit)
- Frontend redeploy (~2-5 menit)

### **STEP 2: Initialize Services di Production**

Setelah backend redeploy selesai, ada 2 cara:

#### **Cara A: Via Browser (Paling Mudah)**
Buka di browser:
```
https://api.neointegratech.com/admin/init-services
```
atau
```
https://your-production-domain.com/api/admin/init-services
```

Akan muncul response JSON seperti:
```json
{
  "message": "Services initialized successfully! Created: 1, Updated: 5"
}
```

#### **Cara B: Via Python Script**
1. Edit file `backend/init_production_services.py`
2. Ganti `PRODUCTION_URL` dengan URL production Anda yang sebenarnya
3. Jalankan:
```bash
cd backend
python init_production_services.py
```

---

## 🧪 Cara Test Payment di Production

### **STEP 3: Akses Halaman Test Payment**
```
https://neointegratech.com/test-payment
```

### **STEP 4: Login & Test**
1. Login dengan akun production
2. Klik tombol "Bayar Test Rp 5.000"
3. Pilih bank (misal: BCA)
4. Klik "Lanjutkan Test Payment"

### **STEP 5: Verifikasi Email**
Cek inbox email Anda, akan ada **2 email**:

📧 **Email #1: Payment Pending** (langsung setelah create)
- Subject: "Pembayaran Order #XXXXX - Menunggu Pembayaran"
- Isi: Nomor VA, jumlah bayar, batas waktu

📧 **Email #2: Payment Success** (setelah bayar via VA)
- Subject: "Pembayaran Berhasil - Order #XXXXX"
- Isi: Konfirmasi pembayaran lunas

---

## 🔍 Troubleshooting

### ❌ "Service dengan slug 'test-payment' tidak ditemukan"
**Solusi:**
1. Hit endpoint init-services via browser (Cara A di atas)
2. Refresh halaman test-payment
3. Coba lagi

### ❌ Email tidak masuk
**Cek:**
1. Folder Spam/Junk
2. Email settings di `.env` production sudah benar
3. Log backend production untuk error email

### ❌ Backend belum redeploy
**Tunggu beberapa menit** atau manual trigger deployment di:
- Coolify Dashboard
- Hostinger Panel
- atau platform deployment Anda

---

## 📊 Monitoring

### Cek Status Service Test-Payment
Hit endpoint (ganti dengan production URL):
```
GET https://api.neointegratech.com/services
```

Cari object dengan `slug: "test-payment"`, pastikan ada dan harga `5000`.

### Cek Log Backend Production
SSH ke server:
```bash
ssh user@server
cd /path/to/backend
tail -f logs/app.log  # atau docker logs jika pakai container
```

Cari log:
- `[Payment Creation]` - saat payment dibuat
- `[Payment Creation] Payment pending email sent` - email pending terkirim
- `[iPaymu Callback]` - saat payment lunas
- `[iPaymu Callback] Payment confirmation email sent` - email lunas terkirim

---

## ✨ Fitur Test Payment

### Apa yang Akan Di-Test?
1. ✅ **Order Creation** - Buat order test
2. ✅ **Payment API Integration** - Integrasi dengan iPaymu
3. ✅ **VA Generation** - Generate nomor VA bank
4. ✅ **Email Pending** - Kirim email saat payment pending
5. ✅ **Payment Callback** - Terima callback dari iPaymu
6. ✅ **Email Success** - Kirim email saat payment lunas
7. ✅ **Order Status Update** - Update status order ke "paid"

### Kenapa Penting?
Test dengan nominal kecil (Rp 5.000) memastikan:
- Integrasi payment bekerja
- Email notification berfungsi
- Database update dengan benar
- Sebelum customer bayar dengan nominal besar

---

## 🎯 Next Steps

Setelah test payment **berhasil**:
1. ✅ Yakin sistem payment bekerja
2. ✅ Customer bisa order service production
3. ✅ Monitor payment flow di dashboard
4. ✅ Siap untuk transaksi sesungguhnya

---

## 📞 Support

Jika ada masalah:
1. Cek log backend production
2. Cek email spam folder
3. Verifikasi service test-payment sudah ada
4. Test ulang dengan akun berbeda

---

**Update Terakhir:** ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
