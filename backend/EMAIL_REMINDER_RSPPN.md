# Email Reminder Scripts untuk Perpanjangan Paket RSPPN

Script untuk mengirim email reminder perpanjangan paket All In (Rp 81.000.000) ke web@rsppn.co.id yang akan jatuh tempo pada **7 Februari 2026**.

## 📁 File Scripts

### 1. `send_renewal_reminder_rsppn.py`
Script manual untuk mengirim email reminder kapan saja.

**Fitur:**
- ✉️ Email HTML profesional dengan design modern
- 📊 Informasi lengkap paket dan harga
- 🎨 Gradient color & responsive design
- 📱 Mobile-friendly layout
- ✨ List benefit paket All In lengkap

**Cara Pakai:**
```bash
# Aktifkan virtual environment
cd d:\WEBSITES\backend
.\venv_fixed\Scripts\Activate.ps1

# Jalankan script
python send_renewal_reminder_rsppn.py
```

---

### 2. `send_scheduled_reminder_rsppn.py`
Script otomatis dengan scheduler untuk mengirim reminder pada hari-hari tertentu.

**Jadwal Otomatis:**
- 📅 **H-7**: Reminder 7 hari sebelum jatuh tempo (31 Januari 2026)
- ⚠️ **H-3**: Reminder 3 hari sebelum jatuh tempo (4 Februari 2026)
- 🚨 **H-1**: Reminder 1 hari sebelum jatuh tempo (6 Februari 2026)
- 🔴 **H-Day**: Reminder hari jatuh tempo (7 Februari 2026)

**Fitur:**
- ⏰ Countdown dinamis (jumlah hari tersisa)
- 🎨 Warna urgency berubah otomatis berdasarkan sisa hari
- 📧 Subject email dinamis sesuai urgency level
- 🔔 Auto-detect hari reminder

**Cara Pakai:**
```bash
# Jalankan manual untuk cek hari ini
python send_scheduled_reminder_rsppn.py

# Jadwalkan dengan Windows Task Scheduler (otomatis setiap hari)
# Lihat: SETUP_SCHEDULER_WINDOWS.md
```

---

## 🔧 Konfigurasi

### Prerequisites
Pastikan file `.env` sudah berisi:
```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USERNAME=noreply@neointegratech.com
SMTP_PASSWORD=your_password_here
FROM_EMAIL=noreply@neointegratech.com
FROM_NAME=Neo Integratech
```

### Install Dependencies
```bash
pip install python-dotenv
```

---

## 📧 Contoh Email Output

### Subject Line
```
🔔 REMINDER 3 HARI: Perpanjangan Paket All In - Jatuh Tempo 7 Feb 2026
```

### Email Content
- **Header**: Gradient purple dengan badge urgency
- **Countdown Box**: Jumlah hari tersisa dengan angka besar
- **Alert Box**: Warning dengan warna sesuai urgency
- **Info Card**: Detail paket (nama, email, tanggal, harga)
- **CTA Button**: Link ke dashboard untuk perpanjang
- **Footer**: Contact info lengkap

### Urgency Levels
| Hari      | Warna   | Icon | Subject Prefix       |
|-----------|---------|------|----------------------|
| H-7       | Yellow  | 📅   | REMINDER 7 HARI      |
| H-3       | Orange  | ⚠️   | REMINDER 3 HARI      |
| H-1       | Red     | 🚨   | REMINDER 1 HARI - URGENT! |
| H-Day     | Dark Red| 🔴   | HARI INI - JATUH TEMPO! |

---

## 🤖 Setup Automation (Windows Task Scheduler)

### Langkah 1: Buat Batch File
Buat file `run_reminder.bat`:
```batch
@echo off
cd /d D:\WEBSITES\backend
call venv_fixed\Scripts\activate.bat
python send_scheduled_reminder_rsppn.py >> logs\reminder_rsppn.log 2>&1
```

### Langkah 2: Buat Task di Task Scheduler
1. Buka **Task Scheduler**
2. Klik **Create Basic Task**
3. Name: `Email Reminder RSPPN`
4. Trigger: **Daily** at **09:00 AM**
5. Action: **Start a Program**
   - Program: `D:\WEBSITES\backend\run_reminder.bat`
6. Finish

Script akan otomatis cek setiap hari dan hanya mengirim di hari H-7, H-3, H-1, dan H-Day.

---

## 📊 Detail Paket All In

**Nama Paket:** All In  
**Harga:** Rp 81.000.000 / tahun  
**Periode:** 1 Tahun  
**Email:** web@rsppn.co.id  
**Tanggal Berakhir:** 7 Februari 2026

### Benefit yang Termasuk:
- 🌐 Website Professional (custom design, mobile responsive)
- 🎨 Branding Lengkap (logo, color palette, typography)
- 📱 Social Media Management (konten & engagement)
- 🚀 SEO Optimization (peringkat Google optimal)
- 📧 Email Marketing (campaign & automation)
- 📊 Analytics & Reporting (dashboard real-time)
- 🔒 Security & Maintenance (update & monitoring 24/7)
- 💬 Priority Support (response time maksimal 2 jam)

---

## 🧪 Testing

### Test Manual Reminder
```bash
python send_renewal_reminder_rsppn.py
```

### Test Scheduled Reminder
```bash
python send_scheduled_reminder_rsppn.py
```

### Check Logs
```bash
type logs\reminder_rsppn.log
```

---

## ⚠️ Troubleshooting

### Email Tidak Terkirim
1. **Cek SMTP credentials** di `.env`
2. **Verify SMTP server** (Hostinger: smtp.hostinger.com:465)
3. **Check firewall** - pastikan port 465 tidak diblok
4. **Test manual** dengan script pertama dulu

### Script Tidak Jalan Otomatis
1. **Cek Task Scheduler** - apakah task sudah enable
2. **Verify path** di batch file
3. **Check logs** - `logs\reminder_rsppn.log`
4. **Run as Administrator** - task scheduler perlu admin rights

### Email Masuk Spam
1. **Setup SPF/DKIM** di domain settings
2. **Warm up email** - kirim ke diri sendiri dulu beberapa kali
3. **Check reputation** - pastikan IP tidak blacklist

---

## 📝 Log Example
```
======================================================================
SCHEDULED EMAIL REMINDER - PERPANJANGAN PAKET RSPPN
======================================================================

📅 Tanggal Hari Ini: 04 Februari 2026
🎯 Tanggal Jatuh Tempo: 07 Februari 2026
⏱️  Sisa Waktu: 3 hari

📅 Hari ini adalah H-3 - Mengirim reminder...
🔄 Mengirim email reminder (REMINDER 3 HARI) ke web@rsppn.co.id...
📅 Sisa hari: 3 hari
✅ Email reminder berhasil dikirim!
⏰ Waktu pengiriman: 2026-02-04 09:00:00

======================================================================
✅ SELESAI - Email reminder berhasil dikirim!
======================================================================
```

---

## 🔗 Links
- Dashboard: https://neointegratech.com/dashboard
- Support Email: support@neointegratech.com
- WhatsApp: +62 812-3456-7890

---

## 📅 Timeline Pengiriman

| Tanggal          | Hari  | Status              |
|------------------|-------|---------------------|
| 31 Januari 2026  | H-7   | ✉️ Email dikirim    |
| 4 Februari 2026  | H-3   | ✉️ Email dikirim    |
| 6 Februari 2026  | H-1   | ✉️ Email dikirim    |
| 7 Februari 2026  | H-Day | ✉️ Email dikirim    |

---

**Created by:** Neo Integratech Development Team  
**Last Updated:** 5 Februari 2026
