# PANDUAN SETUP EMAIL BISNIS UNTUK NOTIFIKASI

## 📧 PENGGUNAAN EMAIL DI APLIKASI

Email bisnis Anda akan digunakan untuk:

1. ✅ **Email Verifikasi** - Dikirim saat user registrasi
2. ✅ **Reset Password** - Dikirim saat user lupa password
3. 🔄 **Notifikasi Payment** (Future) - Status pembayaran, invoice, dll

---

## 🔧 SMTP SETTINGS YANG PERLU DIKONFIGURASI

### 1. Cari Informasi SMTP Email Bisnis Anda

Tergantung provider email bisnis Anda, SMTP settings berbeda:

#### A. **cPanel Email / Hosting Email**
Jika email bisnis dari hosting (contoh: admin@neointegratech.com):

```
SMTP_HOST: mail.neointegratech.com (atau mail.yourdomain.com)
SMTP_PORT: 587 (TLS) atau 465 (SSL)
SMTP_USER: admin@neointegratech.com (full email address)
SMTP_PASSWORD: password email Anda
```

**Cara cek**:
- Login ke cPanel
- Email Accounts → More → Configure Email Client
- Lihat di bagian "Manual Settings" atau "SMTP Settings"

#### B. **Google Workspace (Gmail Bisnis)**
Jika menggunakan Google Workspace:

```
SMTP_HOST: smtp.gmail.com
SMTP_PORT: 587
SMTP_USER: admin@neointegratech.com
SMTP_PASSWORD: App Password (bukan password biasa!)
```

**PENTING**: Harus pakai **App Password**, bukan password biasa!

**Cara buat App Password**:
1. Login ke https://myaccount.google.com
2. Security → 2-Step Verification (harus aktif dulu)
3. App passwords → Select app: Mail → Select device: Other
4. Beri nama: "NeoIntegra Tech Backend"
5. Copy password 16 digit yang muncul

#### C. **Microsoft 365 (Outlook Bisnis)**
Jika menggunakan Microsoft 365:

```
SMTP_HOST: smtp.office365.com
SMTP_PORT: 587
SMTP_USER: admin@neointegratech.com
SMTP_PASSWORD: password email Anda (atau App Password)
```

**Modern Authentication**: Untuk Microsoft 365, bisa perlu setup App Password juga:
- Admin center → Users → Active users → Select user
- Mail → Manage email apps → Enable "SMTP AUTH"

#### D. **Zoho Mail**
```
SMTP_HOST: smtp.zoho.com (atau smtp.zoho.eu untuk EU)
SMTP_PORT: 587
SMTP_USER: admin@neointegratech.com
SMTP_PASSWORD: password atau App Password
```

#### E. **Custom SMTP (Sendgrid, Mailgun, Amazon SES)**
Jika pakai service khusus untuk transactional email:

**SendGrid**:
```
SMTP_HOST: smtp.sendgrid.net
SMTP_PORT: 587
SMTP_USER: apikey (literal string "apikey")
SMTP_PASSWORD: <your-sendgrid-api-key>
```

**Mailgun**:
```
SMTP_HOST: smtp.mailgun.org (atau smtp.eu.mailgun.org untuk EU)
SMTP_PORT: 587
SMTP_USER: postmaster@mg.yourdomain.com
SMTP_PASSWORD: <your-mailgun-smtp-password>
```

---

## ⚙️ KONFIGURASI DI APLIKASI

### 1. Update File `.env` di Backend

**File**: `backend/.env`

```env
# Email Configuration
SMTP_HOST=mail.neointegratech.com
SMTP_PORT=587
SMTP_USER=admin@neointegratech.com
SMTP_PASSWORD=your-email-password-here
EMAIL_FROM=admin@neointegratech.com

# Optional: Display Name
# Akan muncul sebagai "NeoIntegra Tech <admin@neointegratech.com>"
```

### 2. Update di Coolify (Production)

Di Coolify, tambahkan environment variables untuk **backend service**:

```env
SMTP_HOST=mail.neointegratech.com
SMTP_PORT=587
SMTP_USER=admin@neointegratech.com
SMTP_PASSWORD=your-secure-password
EMAIL_FROM=admin@neointegratech.com
```

⚠️ **PENTING**: 
- Jangan commit password ke Git!
- Password hanya di `.env` (local) dan Coolify (production)
- File `.env` sudah di-ignore oleh `.gitignore`

---

## 🧪 TESTING EMAIL FUNCTION

### 1. Buat Test Script

**File**: `backend/test_email.py`

```python
"""Test email sending functionality"""
import sys
sys.path.append('.')

from app.email import send_email, send_verification_email, send_password_reset_email
from app.config import settings

print("="*60)
print("EMAIL CONFIGURATION TEST")
print("="*60)

print(f"\n[Settings]")
print(f"SMTP Host: {settings.SMTP_HOST}")
print(f"SMTP Port: {settings.SMTP_PORT}")
print(f"SMTP User: {settings.SMTP_USER}")
print(f"Email From: {settings.EMAIL_FROM}")
print(f"Password: {'*' * len(settings.SMTP_PASSWORD) if settings.SMTP_PASSWORD else 'NOT SET'}")

# Test simple email
print(f"\n[Test 1] Sending test email...")
test_email = input("\nEnter your test email address: ")

result = send_email(
    to_email=test_email,
    subject="Test Email - NeoIntegra Tech",
    body="This is a test email from NeoIntegra Tech backend.",
    html="<h2>Test Email</h2><p>If you receive this, email configuration is working!</p>"
)

if result:
    print("✅ Email sent successfully! Check your inbox.")
else:
    print("❌ Failed to send email. Check SMTP settings.")

# Test verification email
print(f"\n[Test 2] Testing verification email template...")
choice = input("Send verification email? (y/n): ")
if choice.lower() == 'y':
    result = send_verification_email(test_email, "test-token-123")
    if result:
        print("✅ Verification email sent!")
    else:
        print("❌ Failed to send verification email.")

# Test password reset email
print(f"\n[Test 3] Testing password reset email template...")
choice = input("Send password reset email? (y/n): ")
if choice.lower() == 'y':
    result = send_password_reset_email(test_email, "test-reset-token-456")
    if result:
        print("✅ Password reset email sent!")
    else:
        print("❌ Failed to send password reset email.")

print("\n" + "="*60)
print("Testing complete!")
print("="*60)
```

### 2. Jalankan Test

```powershell
cd d:\WEBSITES\backend
.\venv_new\Scripts\Activate.ps1
$env:PYTHONPATH = "d:\WEBSITES\backend"
python test_email.py
```

---

## 🔍 TROUBLESHOOTING

### Error: "Authentication Failed"
**Penyebab**: Username atau password salah

**Solusi**:
1. Cek username adalah full email address (bukan hanya "admin")
2. Untuk Gmail/Google Workspace, HARUS pakai App Password
3. Untuk Microsoft 365, pastikan SMTP AUTH enabled
4. Test login manual ke webmail dulu

### Error: "Connection Refused" atau "Timeout"
**Penyebab**: SMTP host atau port salah

**Solusi**:
1. Cek SMTP_HOST benar (mail.yourdomain.com)
2. Cek SMTP_PORT:
   - Port 587: TLS (paling umum) ✅
   - Port 465: SSL
   - Port 25: Biasanya di-block ISP ❌
3. Pastikan firewall tidak block port 587/465

### Error: "SSL/TLS Error"
**Penyebab**: SSL/TLS configuration issue

**Solusi**: Ubah port:
- Jika pakai port 465, coba ganti ke 587
- Jika pakai port 587, coba ganti ke 465

### Error: "Sender Address Rejected"
**Penyebab**: EMAIL_FROM tidak match dengan SMTP_USER

**Solusi**:
- Pastikan `EMAIL_FROM` sama dengan `SMTP_USER`
- Atau domain harus sama (example: sender@neointegratech.com dari SMTP admin@neointegratech.com)

### Email Masuk ke Spam
**Solusi**:
1. **Setup SPF Record** (DNS):
   ```
   Type: TXT
   Name: @
   Value: v=spf1 include:_spf.yourmailserver.com ~all
   ```

2. **Setup DKIM** (di email server settings):
   - Biasanya ada di cPanel → Email Authentication
   - Copy DNS record yang diminta

3. **Setup DMARC** (DNS):
   ```
   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=none; rua=mailto:admin@neointegratech.com
   ```

4. **Tambahkan Reverse DNS** (PTR record):
   - Hubungi hosting provider
   - Set PTR record server IP ke mail.neointegratech.com

---

## 📝 BEST PRACTICES

### 1. Gunakan Email Dedicated untuk Notifikasi
Buat email khusus untuk aplikasi:
- ✅ `noreply@neointegratech.com` - Untuk notifikasi otomatis
- ✅ `support@neointegratech.com` - Untuk customer support
- ❌ Jangan pakai email personal (admin@gmail.com)

### 2. Pakai Display Name
```env
EMAIL_FROM=NeoIntegra Tech <noreply@neointegratech.com>
```
User akan lihat "NeoIntegra Tech" bukan hanya email address.

### 3. Monitor Email Logs
- Cek bounced emails (email yang gagal terkirim)
- Monitor spam complaints
- Track open rates (jika pakai SendGrid/Mailgun)

### 4. Rate Limiting
Jika kirim banyak email, pastikan tidak exceed limit:
- Gmail: 500 emails/day (free), 2000/day (workspace)
- cPanel: Biasanya 250-500/hour
- SendGrid: Varies by plan

### 5. Backup SMTP Provider
Siapkan fallback jika primary SMTP gagal:
```python
# Future enhancement - multiple SMTP
SMTP_PROVIDERS = [
    {"host": "smtp1.com", "port": 587, ...},
    {"host": "smtp2.com", "port": 587, ...},
]
```

---

## 🚀 REKOMENDASI

### Untuk Production
Pertimbangkan pakai **transactional email service**:

1. **SendGrid** (Recommended for startup)
   - Free: 100 emails/day
   - Paid: $19.95/month untuk 50k emails
   - Analytics, templates, deliverability tinggi

2. **Mailgun**
   - Pay as you go: $0.80 per 1000 emails
   - Good for developers

3. **Amazon SES**
   - Cheapest: $0.10 per 1000 emails
   - Perlu setup AWS account

### Kenapa Pakai Transactional Email Service?
- ✅ Deliverability lebih tinggi (tidak masuk spam)
- ✅ Analytics (open rate, click rate)
- ✅ Template management
- ✅ Email validation
- ✅ Automatic retry on failure
- ✅ Webhook untuk tracking
- ✅ Scaling otomatis

---

## 📞 NEXT STEPS

1. **Gather SMTP Info**:
   - Login ke email hosting/cPanel
   - Cari SMTP settings
   - Catat host, port, username, password

2. **Update `.env`**:
   - Update `backend/.env` dengan info SMTP
   - Test di local dulu

3. **Run Test Script**:
   ```bash
   python backend/test_email.py
   ```

4. **Update Coolify**:
   - Setelah test berhasil di local
   - Update environment variables di Coolify
   - Deploy ulang backend

5. **Test di Production**:
   - Register user baru
   - Check email verifikasi masuk
   - Test forgot password

---

**Pertanyaan?** 
Kirim info tentang email provider Anda (cPanel? Google Workspace? Lainnya?) dan saya akan bantu setup lebih spesifik!
