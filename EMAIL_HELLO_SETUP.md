# SETUP EMAIL HELLO@NEOINTEGRATECH.COM UNTUK NOTIFIKASI OTOMATIS

## ✅ YANG SUDAH SAYA INTEGRASIKAN:

Email otomatis sekarang akan dikirim dari **hello@neointegratech.com** untuk:

### 1. **Order Confirmation** (Konfirmasi Pesanan)
- Dikirim saat klien membuat order
- Berisi detail pesanan, nomor order, total harga
- Template profesional dengan desain modern

### 2. **Payment Pending** (Instruksi Pembayaran)
- Dikirim saat klien checkout
- Berisi link pembayaran, VA number (untuk VA), instruksi pembayaran
- Reminder bahwa link expire dalam 24 jam

### 3. **Payment Confirmation** (Konfirmasi Pembayaran)
- Dikirim saat pembayaran berhasil (dari iPaymu callback)
- Berisi konfirmasi pembayaran, transaction ID
- Thank you message

### 4. **Email Verification** (Sudah ada)
- Saat registrasi user baru

### 5. **Password Reset** (Sudah ada)
- Saat user lupa password

---

## 🔧 LANGKAH SETUP:

### 1. Setup Email di cPanel/Hosting

**A. Buat Email Account** (jika belum ada):
1. Login ke cPanel hosting Anda
2. Go to **Email Accounts**
3. Klik **Create**:
   - Email: `hello@neointegratech.com`
   - Password: Buat password strong
   - Storage: 250MB (cukup untuk email transaksional)

**B. Cari SMTP Settings**:
1. Di Email Accounts, klik **Configure Email Client** untuk `hello@neointegratech.com`
2. Catat informasi di bagian **"Manual Settings"**:

```
Incoming Server (IMAP):
- mail.neointegratech.com
- Port: 993 (SSL)

Outgoing Server (SMTP):  ← YANG KITA BUTUHKAN
- mail.neointegratech.com
- Port: 587 (TLS) atau 465 (SSL)
- Requires Authentication: YES
- Username: hello@neointegratech.com
- Password: <password yang Anda buat>
```

### 2. Update Backend `.env`

Edit file: `d:\WEBSITES\backend\.env`

```env
# Email Configuration
SMTP_HOST=mail.neointegratech.com
SMTP_PORT=587
SMTP_USER=hello@neointegratech.com
SMTP_PASSWORD=your-password-here
EMAIL_FROM=hello@neointegratech.com

# Atau dengan display name (opsional):
# EMAIL_FROM=NeoIntegra Tech <hello@neointegratech.com>
```

### 3. Test Email di Local

```powershell
cd d:\WEBSITES\backend
.\venv_new\Scripts\Activate.ps1
$env:PYTHONPATH = "d:\WEBSITES\backend"
python test_email.py
```

Masukkan email test Anda, script akan kirim 3 test email.

### 4. Deploy ke Coolify (Production)

Di Coolify, backend service, tambahkan environment variables:

```env
SMTP_HOST=mail.neointegratech.com
SMTP_PORT=587
SMTP_USER=hello@neointegratech.com
SMTP_PASSWORD=your-password-here
EMAIL_FROM=hello@neointegratech.com
```

**Deploy ulang backend.**

---

## 📧 EMAIL FLOW DIAGRAM:

```
USER ACTIONS                    EMAIL YANG DIKIRIM
───────────────────────────────────────────────────────────
1. Register              →      📧 Email Verification
                                   (hello@neointegra... → user@email.com)

2. Forgot Password       →      🔑 Password Reset Email
                                   (hello@neointegra... → user@email.com)

3. Create Order          →      📦 Order Confirmation
                                   (hello@neointegra... → user@email.com)
                                   Subject: "Order Confirmation #ORD-..."

4. Checkout/Payment      →      💳 Payment Pending + Instructions
                                   (hello@neointegra... → user@email.com)
                                   Subject: "Complete Your Payment - Order #ORD-..."
                                   Isi: VA number, payment link, instructions

5. Payment Success       →      ✅ Payment Confirmation
   (iPaymu callback)            (hello@neointegra... → user@email.com)
                                   Subject: "Payment Received - Order #ORD-..."
```

---

## 🎨 EMAIL TEMPLATES:

Semua email sudah didesain dengan:
- ✅ Professional HTML template
- ✅ Responsive design (mobile-friendly)
- ✅ Branded colors (indigo: #4F46E5)
- ✅ Clear call-to-action buttons
- ✅ Fallback plain text version

### Contoh Email Order Confirmation:

```html
┌─────────────────────────────────────┐
│  Order Confirmation                  │
│                                      │
│  Hi John Doe,                        │
│  Thank you for your order!           │
│                                      │
│  ┌───────────────────────────────┐  │
│  │ Order Number: ORD-20260128    │  │
│  │ Service: Website Development  │  │
│  │ Quantity: 1                   │  │
│  │ Total: Rp 36,000,000         │  │
│  │ Status: PENDING               │  │
│  └───────────────────────────────┘  │
│                                      │
│  [ Track Your Order ]                │
│                                      │
└─────────────────────────────────────┘
```

---

## 🔍 VERIFIKASI SETELAH SETUP:

### 1. Test di Local (Sebelum Deploy)

```powershell
# Test basic email
python backend/test_email.py

# Test order flow (akan kirim email otomatis)
cd d:\WEBSITES
python test_payment_debug.py
```

Cek email Anda, harus menerima:
- ✅ Order Confirmation
- ✅ Payment Pending Instructions

### 2. Test di Production (Setelah Deploy)

1. Register user baru → Check email verification ✅
2. Login & create order → Check order confirmation ✅
3. Checkout with payment → Check payment instructions ✅
4. (Wait for payment) → Check payment confirmation ✅

---

## 🚨 TROUBLESHOOTING:

### Email Tidak Terkirim

**1. Check SMTP Settings**:
```powershell
cd d:\WEBSITES\backend
python test_email.py
```

Jika error "Authentication failed":
- Cek password benar (copy-paste dari cPanel)
- Cek username adalah full email: `hello@neointegratech.com`

**2. Check Email Logs di cPanel**:
- cPanel → Email Deliverability
- Check "Send Restriction"
- Lihat log untuk failed emails

**3. Check Firewall/Port**:
- Port 587 (TLS) atau 465 (SSL) harus terbuka
- Test dengan telnet: `telnet mail.neointegratech.com 587`

### Email Masuk Spam

**Setup SPF Record** (DNS):
```
Type: TXT
Name: @
Value: v=spf1 include:neointegratech.com ~all
```

**Setup DKIM** (di cPanel):
1. cPanel → Email Authentication
2. Enable DKIM untuk domain neointegratech.com
3. Copy DNS records dan add ke DNS provider

**Setup DMARC** (DNS):
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:hello@neointegratech.com
```

### Email Limit Reached

Check hosting email limit:
- Shared hosting: Biasanya 250-500 emails/hour
- VPS: Unlimited (tapi ikuti best practice)

Jika kirim banyak email, pertimbangkan pakai SendGrid/Mailgun.

---

## 📊 MONITORING EMAIL:

### Di Backend Logs (Coolify)

Email activity akan ter-log:
```
✅ Email sent successfully to user@example.com
[Order Creation] Email sent to user@example.com
[Payment Creation] Payment pending email sent
[iPaymu Callback] Payment confirmation email sent to user@example.com
```

### Di cPanel

1. **Email Track** → Lihat email terkirim
2. **Track Delivery** → Lihat status delivery
3. **Read Mail Logs** → Debug issues

---

## 💡 TIPS BEST PRACTICES:

### 1. Test Email Template
Sebelum deploy, test dulu email template:
- Check di Gmail (desktop)
- Check di Gmail (mobile)
- Check di Outlook
- Check spam score: https://www.mail-tester.com

### 2. Monitor Bounce Rate
- Cek bounced emails (email gagal terkirim)
- Remove invalid emails dari database

### 3. Rate Limiting
Jangan spam klien dengan terlalu banyak email:
- 1 email saat order created ✅
- 1 email saat checkout (payment pending) ✅
- 1 email saat payment success ✅
- Total: Max 3 emails per transaction ✅

### 4. Unsubscribe Link (Future)
Untuk marketing email, tambahkan unsubscribe link.
Transactional email (order/payment) tidak perlu unsubscribe.

---

## 🎯 NEXT STEPS:

1. ✅ Setup email `hello@neointegratech.com` di cPanel
2. ✅ Update `backend/.env` dengan SMTP settings
3. ✅ Test dengan `python test_email.py`
4. ✅ Update Coolify environment variables
5. ✅ Deploy ulang backend
6. ✅ Test flow lengkap: Register → Order → Payment

---

## 📞 PERTANYAAN?

Jika ada error atau butuh bantuan setup:
1. Share screenshot error dari `test_email.py`
2. Share SMTP settings dari cPanel
3. Share backend logs dari Coolify

Semua sudah ready untuk kirim email otomatis ke klien! 🚀
