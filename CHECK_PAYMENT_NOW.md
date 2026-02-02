# FIX PAYMENT STATUS - Untuk User yang Sudah Bayar

## 🚨 MASALAH
Status payment masih **pending** padahal user sudah melakukan pembayaran.

## ✅ SOLUSI SUDAH DI-IMPLEMENT

### 1. Endpoint Check Status Manual
Sudah ditambahkan endpoint baru:
```
POST /api/payments/{payment_id}/check-status
```

Endpoint ini akan:
- Query langsung ke iPaymu API
- Update status payment di database
- Update status order jika payment success
- Kirim email konfirmasi jika belum terkirim

### 2. Cara Check Payment Status (UNTUK USER)

#### Via Script Python
```bash
cd d:\WEBSITES\backend
python check_payment_status.py
```

Ikuti instruksi:
1. Login ke https://neointegratech.com
2. Buka DevTools (F12) → Console
3. Ketik: `localStorage.getItem('access_token')`
4. Copy token
5. Paste ke script
6. Pilih menu "1. Check payment status by ID"
7. Masukkan Payment ID dari order Anda

#### Via API Call Langsung

**Option A - Jika tahu Payment ID:**
```bash
curl -X POST "https://api.neointegratech.com/api/payments/YOUR_PAYMENT_ID/check-status" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

**Option B - List pending orders dulu:**
```bash
# 1. Get pending orders
curl -X GET "https://api.neointegratech.com/api/orders/?status=pending" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 2. Cari Payment ID dari order
curl -X GET "https://api.neointegratech.com/api/payments/order/ORDER_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 3. Check status
curl -X POST "https://api.neointegratech.com/api/payments/PAYMENT_ID/check-status" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Cara Dapatkan Token

1. Login ke website: https://neointegratech.com/login
2. Buka Browser DevTools (tekan F12)
3. Ke tab **Console**
4. Ketik dan enter:
   ```javascript
   localStorage.getItem('access_token')
   ```
5. Copy token yang muncul (tanpa tanda kutip)

### 4. Cara Cek Payment ID

**Option 1 - Dari Dashboard:**
- Login ke https://neointegratech.com
- Ke halaman Dashboard → Orders
- Klik order yang pending
- Lihat Payment ID di detail order

**Option 2 - Via API:**
```bash
# Get all orders
curl -X GET "https://api.neointegratech.com/api/orders/" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Akan muncul list order dengan ID
# Lalu get payment by order ID
curl -X GET "https://api.neointegratech.com/api/payments/order/ORDER_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔄 UPDATE OTOMATIS (COMING NEXT)

Sedang di-develop:
1. **Auto-polling** di frontend setiap 10 detik untuk check status
2. **Button "Refresh Status"** di dashboard orders
3. **Email dengan link check status** langsung

## 📝 TECHNICAL DETAILS

### Bagaimana Endpoint Bekerja:

1. **Validasi**: Check payment existence dan ownership
2. **Skip jika sudah final**: Jika status sudah success/failed/cancelled, langsung return
3. **Query iPaymu**: Call iPaymu API `/transaction` endpoint
4. **Parse Response**: 
   - StatusCode "1" = Paid → Update ke "success"
   - StatusCode "0" = Pending → Tetap "pending"
   - StatusCode lain = Failed → Update ke "failed"
5. **Update Database**: Update payment status dan order status
6. **Send Email**: Jika berubah ke success, kirim email konfirmasi

### Response Format:

```json
{
  "id": 123,
  "order_id": 456,
  "amount": 10000,
  "payment_method": "va",
  "payment_channel": "bca",
  "status": "success",
  "ipaymu_transaction_id": "QR12345678",
  "va_number": "8808123456789012",
  "paid_at": "2024-01-15T10:30:00"
}
```

## 🎯 UNTUK USER YANG SUDAH BAYAR SEKARANG

**Langkah tercepat:**

1. Jalankan script Python:
   ```bash
   cd d:\WEBSITES\backend
   python check_payment_status.py
   ```

2. Ikuti instruksi untuk input token

3. Pilih menu "2. List all pending orders"

4. Script akan otomatis list semua order pending beserta Payment ID-nya

5. Pilih menu "1. Check payment status by ID"

6. Masukkan Payment ID dari order yang sudah dibayar

7. Script akan check ke iPaymu dan update status

## ⚠️ TROUBLESHOOTING

### Error 401 Unauthorized
→ Token expired, login ulang dan ambil token baru

### Error 404 Not Found  
→ Payment ID salah atau bukan milik user tersebut

### Status masih pending setelah check
→ Kemungkinan pembayaran belum masuk ke iPaymu (cek di rekening VA)

### Tidak bisa connect ke server
→ Check koneksi internet atau server production sedang down

## 📊 NEXT STEPS

1. **Push code ke production** ✅ (DONE)
2. **Test manual check status** ⏳ (WAITING)
3. **Add auto-polling di frontend** ⏳ (IN PROGRESS)
4. **Add refresh button di UI** ⏳ (PLANNED)
5. **Monitor callback dari iPaymu** ⏳ (PLANNED)

## 💡 KENAPA INI TERJADI?

Problem terjadi karena:
1. **Callback iPaymu tidak sampai** - Mungkin ada firewall/network issue
2. **Tidak ada mekanisme manual check** - Sebelumnya hanya mengandalkan callback
3. **Tidak ada auto-polling** - Frontend tidak check status berkala

Sekarang sudah di-fix dengan:
1. **Manual check status endpoint** ✅
2. **Script Python untuk mudah check** ✅
3. **Auto-polling** (sedang dikerjakan)
4. **Refresh button UI** (sedang dikerjakan)
