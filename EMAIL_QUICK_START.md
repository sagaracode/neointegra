# EMAIL SETUP - QUICK REFERENCE

## 🎯 Yang Perlu Anda Lakukan:

### 1. Cari Informasi SMTP Email Bisnis Anda

**Jika pakai cPanel/Hosting Email**:
- Login ke cPanel → Email Accounts → Configure Email Client
- Catat: SMTP Host, Port, Username, Password

**Jika pakai Google Workspace**:
- Buat App Password di https://myaccount.google.com/apppasswords
- SMTP: smtp.gmail.com, Port: 587

**Jika pakai Microsoft 365**:
- SMTP: smtp.office365.com, Port: 587
- Enable SMTP AUTH di admin panel

---

## 2. Update Backend `.env`

File: `d:\WEBSITES\backend\.env`

```env
SMTP_HOST=mail.neointegratech.com
SMTP_PORT=587
SMTP_USER=admin@neointegratech.com
SMTP_PASSWORD=your-password-here
EMAIL_FROM=admin@neointegratech.com
```

---

## 3. Test Email (Local)

```powershell
cd d:\WEBSITES\backend
.\venv_new\Scripts\Activate.ps1
$env:PYTHONPATH = "d:\WEBSITES\backend"
python test_email.py
```

Masukkan email test Anda, akan dikirim 3 test email.

---

## 4. Update Coolify (Production)

Di Coolify backend service, tambahkan env variables:

```
SMTP_HOST=mail.neointegratech.com
SMTP_PORT=587
SMTP_USER=admin@neointegratech.com
SMTP_PASSWORD=your-password
EMAIL_FROM=admin@neointegratech.com
```

Deploy ulang backend.

---

## 5. Test di Production

- Register user baru
- Cek email verifikasi masuk
- Test "Lupa Password"

---

## ⚠️ Troubleshooting

**Authentication Failed**: 
- Cek username = full email (admin@domain.com)
- Google Workspace? Harus pakai App Password!

**Connection Refused**: 
- Cek SMTP_HOST dan PORT benar
- Port 587 (TLS) atau 465 (SSL)

**Email Masuk Spam**: 
- Setup SPF, DKIM, DMARC di DNS
- Atau pakai SendGrid/Mailgun

---

📖 **Panduan Lengkap**: [EMAIL_SETUP_GUIDE.md](EMAIL_SETUP_GUIDE.md)
