# 🔧 Quick Fix: Test Payment 404 Error

## ✅ Status Backend Production
**Backend sudah OK!** Semua endpoint bekerja:
- ✅ `/api/services/` - Working
- ✅ `/api/orders/` - Working  
- ✅ `/api/admin/init-services` - Working (service test-payment sudah ditambahkan!)

## ❌ Masalah: Frontend Production
Error `404` pada `/api/orders/` terjadi karena:
1. **Frontend production belum redeploy** dengan kode terbaru
2. **Cache browser** masih menyimpan JavaScript lama

---

## 🚀 Solusi Cepat

### **Option 1: Hard Refresh Browser (Paling Cepat)**

Di browser production (neointegratech.com):

**Windows:**
```
Ctrl + Shift + R
atau
Ctrl + F5
```

**Mac:**
```
Cmd + Shift + R
```

**Manual:**
1. Buka Developer Tools (F12)
2. Klik kanan tombol Refresh
3. Pilih "Empty Cache and Hard Reload"

### **Option 2: Clear Browser Cache**

1. Buka Settings browser
2. Privacy & Security
3. Clear browsing data
4. Check "Cached images and files"
5. Clear data
6. Reload website

### **Option 3: Tunggu Auto-Deployment Frontend**

Frontend akan auto-redeploy dalam ~5 menit setelah push GitHub.

Cek status deployment di:
- Coolify Dashboard
- Hostinger/cPanel
- atau platform hosting Anda

---

## 🧪 Verify Fix Berhasil

Setelah hard refresh, test lagi:

1. Buka https://neointegratech.com/test-payment
2. Login
3. Klik "Bayar Test Rp 5.000"
4. Pilih bank
5. Klik "Lanjutkan Test Payment"

Jika masih error, cek console browser (F12) untuk error message baru.

---

## 🔍 Troubleshooting Lanjutan

### Jika masih 404 setelah hard refresh:

**A. Cek Service Test-Payment Ada:**
```bash
# Browser: https://api.neointegratech.com/api/services/
# Atau run script:
python backend/test_production_api.py
```

Cari service dengan `slug: "test-payment"` dan `price: 5000`.

**B. Cek Console Error Detail:**
1. Buka DevTools (F12)
2. Tab Console
3. Screenshot error lengkap
4. Cek URL yang di-hit (harus: `https://api.neointegratech.com/api/orders/`)

**C. Manual Trigger Frontend Redeploy:**
- Login ke Coolify/Hostinger
- Trigger manual redeploy frontend
- Tunggu ~5 menit

---

## 📊 Expected Behavior Setelah Fix

✅ **Saat create test payment:**
1. Order dibuat di backend
2. Payment dibuat via iPaymu
3. Dapat nomor VA
4. Email pending dikirim ke email Anda
5. Redirect ke dashboard/orders

✅ **Email yang diterima:**
1. **Pending Email** - Langsung setelah create payment
2. **Success Email** - Setelah bayar via VA (simulasi atau real)

---

## 🎯 Next Step

Setelah berhasil test payment:
1. Verifikasi email masuk (cek spam folder)
2. Test bayar via VA (bisa simulasi di sandbox iPaymu)
3. Verifikasi email success masuk
4. Cek order status di dashboard berubah jadi "paid"

---

**Last Updated:** ${new Date().toLocaleString('id-ID')}
