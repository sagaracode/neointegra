# Troubleshooting Pembayaran - web@rsppn.co.id

## Masalah Dilaporkan
Akun `web@rsppn.co.id` tidak dapat melakukan pembayaran ke bank yang dipilih.

## Status Investigasi

### 1. Perubahan yang Sudah Dilakukan ✅
- ✅ Fix dependency versions di `requirements.txt`:
  - `pydantic-settings`: 2.12.0 → 2.11.0
  - `pydantic`: 2.12.5 → 2.10.5
  - `gunicorn`: 24.0.0 → 23.0.0
- ✅ Backend berhasil dijalankan (port 8000)
- ✅ Perubahan sudah di-push ke GitHub
- ✅ Script test pembayaran dibuat (`test_payment_rsppn.py`)

### 2. Yang Perlu Ditest di Browser

Silakan test pembayaran dengan langkah berikut:

1. **Buka website**: http://localhost:5173
2. **Login** dengan akun: `web@rsppn.co.id`
3. **Pilih layanan** dan klik "Order Now"
4. **Pilih bank** (contoh: BCA, BNI, Mandiri, dll)
5. **Perhatikan error yang muncul**:
   - Apakah muncul error saat pilih bank?
   - Apakah muncul VA Number atau error?
   - Lihat Console browser (F12 → Console tab)
   - Lihat Network tab untuk melihat response API

### 3. Cara Melihat Log Backend

Terminal backend sudah berjalan dan akan menampilkan log detail ketika pembayaran dibuat, termasuk:
- Request ke iPaymu API
- Response dari iPaymu
- Error jika ada

Log akan muncul di terminal yang menjalankan uvicorn.

### 4. Kemungkinan Penyebab Masalah

Berdasarkan analisa kode, kemungkinan masalah:

#### A. Konfigurasi iPaymu
- File `.env` mungkin belum dikonfigurasi dengan benar
- Check di `backend/.env`:
  ```env
  IPAYMU_VA=your_va_number
  IPAYMU_API_KEY=your_api_key
  IPAYMU_PRODUCTION=true  # atau false untuk sandbox
  ```

#### B. Bank Channel Tidak Didukung
- Payment method hanya mendukung VA (Virtual Account)
- Bank yang didukung: BCA, BNI, BRI, Mandiri, CIMB, Permata, BSI, Danamon
- Code ada di: `backend/app/api/endpoints/payments.py` line 81-94

#### C. iPaymu API Error
- Signature tidak valid
- VA/API Key salah
- Sandbox vs Production mode tidak sesuai

### 5. Cara Test Dengan Script

Jalankan script test pembayaran:
```bash
cd backend
python3 test_payment_rsppn.py
```

Script akan:
1. Login dengan akun web@rsppn.co.id
2. Buat order baru
3. Test pembayaran dengan bank yang dipilih
4. Tampilkan detail response dan error

### 6. Next Steps

Setelah test di browser atau dengan script:
1. Catat error message yang muncul
2. Catat response dari API (di Console atau terminal)
3. Share hasil test untuk analisa lebih lanjut

## Git Sync untuk Komputer Lain

Untuk komputer lain yang bekerja dengan repository yang sama:

```bash
cd /path/to/neointegra
git pull origin main
```

Ini akan mengambil perubahan terbaru termasuk:
- Fix dependencies
- Script test pembayaran

Setelah pull, jalankan ulang:
```bash
cd backend
pip install -r requirements.txt
python3 -m uvicorn app.main:app --reload
```

## File Yang Diubah

- `backend/requirements.txt` - Fix dependency versions
- `backend/test_payment_rsppn.py` - Script test pembayaran (NEW)

## Commit Message

```
fix: Update dependencies versions (pydantic-settings, gunicorn) and add payment test script
```

Pushed to: https://github.com/sagaracode/neointegra.git

---

**Catatan**: Masalah pembayaran belum sepenuhnya teridentifikasi. Perlu test manual di browser atau dengan script untuk mendapatkan error detail.
