# QUICK START - Email Otomatis hello@neointegratech.com

## ✅ FITUR YANG SUDAH TERINTEGRASI:

Email akan **OTOMATIS** terkirim dari `hello@neointegratech.com` untuk:

1. **Order Confirmation** - Saat klien create order
2. **Payment Instructions** - Saat klien checkout (dengan VA number, payment link)
3. **Payment Success** - Saat pembayaran berhasil (dari iPaymu)
4. **Email Verification** - Saat registrasi
5. **Password Reset** - Saat lupa password

---

## 🔧 CARA SETUP (3 LANGKAH):

### 1. Setup Email di cPanel

1. Login cPanel → **Email Accounts**
2. Buat email: `hello@neointegratech.com`
3. Klik **Configure Email Client** → Catat:
   - SMTP Host: `mail.neointegratech.com`
   - SMTP Port: `587` (TLS)
   - Username: `hello@neointegratech.com`
   - Password: (password yang Anda buat)

### 2. Update Backend `.env` (Local)

```env
SMTP_HOST=mail.neointegratech.com
SMTP_PORT=587
SMTP_USER=hello@neointegratech.com
SMTP_PASSWORD=your-password-here
EMAIL_FROM=hello@neointegratech.com
```

### 3. Update Coolify (Production)

Tambahkan di backend service env variables:
```
SMTP_HOST=mail.neointegratech.com
SMTP_PORT=587
SMTP_USER=hello@neointegratech.com
SMTP_PASSWORD=your-password
EMAIL_FROM=hello@neointegratech.com
```

**Deploy ulang backend** → SELESAI! ✅

---

## 🧪 TEST:

```powershell
cd d:\WEBSITES\backend
.\venv_new\Scripts\Activate.ps1
python test_email.py
```

---

📖 **Panduan Lengkap**: [EMAIL_HELLO_SETUP.md](EMAIL_HELLO_SETUP.md)
