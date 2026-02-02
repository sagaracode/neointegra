# 🚨 URGENT: DATABASE ANDA AKAN HILANG!

## ⚠️ MASALAH KRITIS TERDETEKSI

**PEMBAYARAN ANDA BERISIKO HILANG!**

Database production menggunakan SQLite **TANPA persistent volume**. Setiap kali deployment, database akan **DI-RESET** dan **SEMUA DATA HILANG** termasuk:
- ❌ Payment history Anda
- ❌ Order yang sudah dibuat
- ❌ Status pembayaran
- ❌ Data user

## ✅ SOLUSI SUDAH DISIAPKAN

Saya sudah update Dockerfile dan siapkan script backup/restore. Tapi **HARUS SETUP VOLUME DI COOLIFY SEKARANG!**

---

## 📋 LANGKAH DARURAT - LAKUKAN SEKARANG!

### STEP 1: CHECK DATA PRODUCTION SEKARANG

Jalankan script ini untuk lihat data apa saja yang ada:
```powershell
cd d:\WEBSITES
.\check_production_data.ps1
```

Script ini akan tampilkan:
- Jumlah orders Anda
- Status payments
- Data yang akan hilang jika redeploy

### STEP 2: BACKUP DATABASE PRODUCTION (JIKA ADA AKSES SSH)

**Jika Anda punya akses SSH ke server Coolify:**

```bash
# Login SSH
ssh user@your-coolify-server

# Jalankan backup script
cd /path/to/deployment
./backend/backup_production_db.sh
```

**ATAU manual backup:**
```bash
# Find container
docker ps | grep neointegra-backend

# Copy database
docker cp <container_id>:/app/neointegratech.db ./backup_$(date +%Y%m%d).db

# Download ke local
scp user@server:~/backup_*.db ./
```

### STEP 3: SETUP PERSISTENT VOLUME DI COOLIFY

**INI PALING PENTING! Ikuti langkah di [COOLIFY_SETUP.md](COOLIFY_SETUP.md)**

Ringkasnya:
1. Login ke Coolify Dashboard
2. Buka service `neointegra-backend`
3. Ke tab **"Storages"** atau **"Volumes"**
4. **Add Storage:**
   - Name: `neointegra-database`
   - Mount Path: `/app/data`
   - Type: `Volume (persistent)`

### STEP 4: SET ENVIRONMENT VARIABLE

Di Coolify, tambahkan env variable:
```bash
DATABASE_URL=sqlite:////app/data/neointegratech.db
```

### STEP 5: REDEPLOY

Setelah volume setup:
1. Coolify akan auto-deploy dari GitHub (code sudah di-push)
2. Database akan persist di volume
3. **TIDAK AKAN HILANG LAGI!**

---

## 🔄 JIKA DATABASE SUDAH TER-RESET

### Restore dari Backup:

**Jika punya backup:**
```bash
# SSH ke server
ssh user@server

# Restore database
./backend/restore_production_db.sh ./backups/backup_XXXXXX.db
```

**Jika TIDAK ada backup dan data hilang:**
- User harus re-register (jika baru)
- Order dan payment history HILANG 😭
- **HARUS setup volume SEKARANG untuk prevent ini terjadi lagi!**

---

## 🎯 UNTUK PEMBAYARAN YANG SUDAH DILAKUKAN

### Jika Database Di-Reset:

1. **Data payment Anda HILANG dari database**
2. **TAPI** payment mungkin masih tercatat di iPaymu
3. **SOLUSI:**
   - Contact admin untuk manual verify payment di iPaymu dashboard
   - Provide VA number atau transaction ID
   - Admin bisa manual check dan create order baru untuk Anda
   - Atau refund jika belum diproses

### Jika Volume Sudah Di-Setup:

1. **Database akan persistent**
2. Setelah backend redeploy, jalankan:
   ```powershell
   cd d:\WEBSITES\backend
   python check_payment_status.py
   ```
3. Script akan update status payment dari iPaymu API
4. Payment status akan update otomatis

---

## 📊 STATUS SAAT INI

### ✅ Yang Sudah Dikerjakan:
- ✅ Dockerfile updated dengan database path persistent (`/app/data/`)
- ✅ Environment variable untuk database path
- ✅ Backup script (bash dan PowerShell)
- ✅ Restore script
- ✅ Check production data script
- ✅ Endpoint check payment status manual
- ✅ Dokumentasi lengkap
- ✅ Code pushed ke GitHub

### ⏳ Yang HARUS Dilakukan User:
- ⚠️ **URGENT**: Setup persistent volume di Coolify
- ⚠️ **URGENT**: Backup database production (jika ada data penting)
- ⚠️ Set environment variable `DATABASE_URL`
- ⚠️ Redeploy dengan volume configuration

---

## 🚀 ALTERNATIVE: MIGRATE KE POSTGRESQL

**SANGAT DISARANKAN untuk production!**

### Keuntungan PostgreSQL:
- ✅ Data persistent by default
- ✅ Better performance untuk production
- ✅ Scalable
- ✅ Transaction safety lebih baik
- ✅ Concurrent access handling
- ✅ Tidak perlu worry tentang container lifecycle

### Cara Setup (After Volume Setup):

1. **Add PostgreSQL di Coolify:**
   - Coolify Dashboard → Add Service → PostgreSQL
   - Name: `neointegra-postgres`
   - Auto-generate password

2. **Update Backend Environment:**
   ```bash
   DATABASE_URL=postgresql://user:password@postgres:5432/neointegra
   ```

3. **Update requirements.txt:**
   ```txt
   psycopg2-binary==2.9.9
   ```

4. **Push dan Deploy:**
   - Code akan auto-migrate schema
   - Data akan persistent di PostgreSQL service

5. **Migrate Data (Optional):**
   - Export dari SQLite backup
   - Import ke PostgreSQL
   - Script ada di `COOLIFY_SETUP.md`

---

## 💰 TENTANG PEMBAYARAN ANDA

### Jika Sudah Bayar Sebelum Fix:

**Scenario 1: Database Masih Ada**
- ✅ Setup volume SEKARANG
- ✅ Redeploy dengan volume
- ✅ Jalankan `check_payment_status.py`
- ✅ Status akan update dari iPaymu

**Scenario 2: Database Sudah Di-Reset**
- ❌ Data order/payment hilang dari sistem
- ✅ Payment masih ada di iPaymu
- ✅ Contact admin dengan info:
  - Nama lengkap
  - Email registered
  - VA number / Transaction ID
  - Nominal pembayaran
  - Tanggal/waktu bayar
- ✅ Admin bisa verify dan manual process

### Contact Admin:
- Email: admin@neointegratech.com
- WhatsApp: +62 851 2136 9617

---

## 🆘 BUTUH BANTUAN?

Jika Anda:
- Tidak punya akses ke Coolify dashboard
- Tidak tahu cara setup volume
- Butuh bantuan restore database
- Sudah bayar tapi data hilang

**SEGERA HUBUNGI:**
1. Share screenshot Coolify dashboard
2. Share detail pembayaran (VA number, nominal, tanggal)
3. Saya bisa bantu remote setup jika ada akses

---

## 📌 PRIORITY LIST

### SEKARANG (URGENT):
1. ⚠️ Setup persistent volume di Coolify
2. ⚠️ Backup database current (jika ada data)
3. ⚠️ Set environment variable

### HARI INI:
4. Redeploy dengan volume
5. Test database persistence
6. Check payment status user yang sudah bayar

### MINGGU INI:
7. Plan migration ke PostgreSQL
8. Setup automated backup
9. Add monitoring untuk database

---

## 📖 REFERENSI

- [COOLIFY_SETUP.md](COOLIFY_SETUP.md) - Setup lengkap Coolify volume & PostgreSQL
- [CHECK_PAYMENT_NOW.md](CHECK_PAYMENT_NOW.md) - Cara check payment status manual
- `check_production_data.ps1` - Check data production sekarang
- `backend/backup_production_db.sh` - Backup script
- `backend/restore_production_db.sh` - Restore script
- `backend/check_payment_status.py` - Check & update payment status

---

## ⏰ TIMELINE

**T+0 (NOW)**: Setup volume di Coolify  
**T+5 min**: Set environment variable  
**T+10 min**: Redeploy auto-trigger  
**T+15 min**: Backend up dengan persistent volume  
**T+20 min**: Test payment status check  
**T+Done**: Database persistent, tidak akan hilang lagi!

---

## ✨ AFTER FIX

Setelah volume setup:
- ✅ Database akan persist across deployments
- ✅ Payment data aman
- ✅ Order history tetap ada
- ✅ Redeploy kapanpun tanpa khawatir data hilang
- ✅ Auto-update payment status via endpoint check-status
- ✅ Production-ready!

**SEKARANG YANG TERPENTING: SETUP VOLUME DI COOLIFY!** 🚀
