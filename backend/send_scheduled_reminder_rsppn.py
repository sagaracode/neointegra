"""
Script untuk mengirim email reminder perpanjangan dengan scheduler otomatis
Akan mengirim reminder pada:
- H-7 (7 hari sebelum jatuh tempo)
- H-3 (3 hari sebelum jatuh tempo)  
- H-1 (1 hari sebelum jatuh tempo)
- H-Day (hari jatuh tempo)
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from dotenv import load_dotenv
import time

# Load environment variables
load_dotenv()


def calculate_days_until_expiry():
    """
    Hitung berapa hari tersisa sampai tanggal jatuh tempo
    """
    expiry_date = datetime(2026, 2, 7)  # 7 Februari 2026
    today = datetime.now()
    days_left = (expiry_date - today).days
    return days_left


def get_reminder_message(days_left):
    """
    Generate pesan reminder berdasarkan sisa hari
    """
    if days_left == 7:
        urgency = "REMINDER 7 HARI"
        urgency_color = "#ffc107"
        icon = "📅"
    elif days_left == 3:
        urgency = "REMINDER 3 HARI"
        urgency_color = "#ff9800"
        icon = "⚠️"
    elif days_left == 1:
        urgency = "REMINDER 1 HARI - URGENT!"
        urgency_color = "#f44336"
        icon = "🚨"
    elif days_left == 0:
        urgency = "HARI INI - JATUH TEMPO!"
        urgency_color = "#d32f2f"
        icon = "🔴"
    else:
        urgency = f"REMINDER {days_left} HARI"
        urgency_color = "#2196f3"
        icon = "🔔"
    
    return urgency, urgency_color, icon


def send_scheduled_reminder():
    """
    Kirim email reminder dengan informasi sisa hari yang dinamis
    """
    
    # Calculate days left
    days_left = calculate_days_until_expiry()
    urgency, urgency_color, icon = get_reminder_message(days_left)
    
    # Email configuration
    smtp_server = os.getenv("SMTP_HOST", "smtp.hostinger.com")
    smtp_port = int(os.getenv("SMTP_PORT", 465))
    smtp_username = os.getenv("SMTP_USERNAME")
    smtp_password = os.getenv("SMTP_PASSWORD")
    from_email = os.getenv("FROM_EMAIL", "noreply@neointegratech.com")
    from_name = os.getenv("FROM_NAME", "Neo Integratech")
    
    # Recipient
    to_email = "web@rsppn.co.id"
    to_name = "Tim RSPPN"
    
    # Email subject with urgency
    subject = f"{icon} {urgency}: Perpanjangan Paket All In - Jatuh Tempo 7 Feb 2026"
    
    # Days left text
    if days_left > 0:
        days_text = f"Paket Anda akan berakhir dalam <strong style='color: {urgency_color};'>{days_left} hari</strong> pada tanggal 7 Februari 2026."
    else:
        days_text = f"<strong style='color: {urgency_color};'>Paket Anda berakhir HARI INI (7 Februari 2026)</strong>. Segera lakukan perpanjangan untuk menghindari gangguan layanan!"
    
    # HTML email body
    html_body = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }}
        .container {{
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }}
        .header {{
            background: linear-gradient(135deg, {urgency_color} 0%, {urgency_color}dd 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }}
        .header h1 {{
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }}
        .urgency-badge {{
            display: inline-block;
            background: rgba(255,255,255,0.3);
            padding: 8px 20px;
            border-radius: 20px;
            margin-top: 10px;
            font-weight: 700;
            font-size: 18px;
        }}
        .content {{
            padding: 30px;
        }}
        .alert-box {{
            background: {urgency_color}22;
            border-left: 4px solid {urgency_color};
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }}
        .alert-box strong {{
            color: {urgency_color};
            display: block;
            margin-bottom: 5px;
            font-size: 16px;
        }}
        .countdown {{
            text-align: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            border-radius: 8px;
            margin: 20px 0;
        }}
        .countdown-number {{
            font-size: 48px;
            font-weight: 700;
            display: block;
            margin: 10px 0;
        }}
        .countdown-text {{
            font-size: 18px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }}
        .info-card {{
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }}
        .info-row {{
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #dee2e6;
        }}
        .info-row:last-child {{
            border-bottom: none;
        }}
        .info-label {{
            font-weight: 600;
            color: #495057;
        }}
        .info-value {{
            color: #212529;
            text-align: right;
        }}
        .price {{
            font-size: 28px;
            font-weight: 700;
            color: #667eea;
        }}
        .button {{
            display: inline-block;
            background: linear-gradient(135deg, {urgency_color} 0%, {urgency_color}dd 100%);
            color: white;
            padding: 15px 40px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
            margin: 20px 0;
            transition: transform 0.2s;
            font-size: 16px;
        }}
        .button:hover {{
            transform: translateY(-2px);
        }}
        .footer {{
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
        }}
        .contact-info {{
            margin: 15px 0;
        }}
        .contact-info a {{
            color: #667eea;
            text-decoration: none;
        }}
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>{icon} {urgency}</h1>
            <div class="urgency-badge">
                PERPANJANGAN PAKET ALL IN
            </div>
        </div>
        
        <!-- Content -->
        <div class="content">
            <p>Kepada Yth,<br><strong>Tim RSPPN</strong></p>
            
            <!-- Countdown -->
            <div class="countdown">
                <div class="countdown-text">Sisa Waktu</div>
                <div class="countdown-number">{days_left if days_left > 0 else 0}</div>
                <div class="countdown-text">Hari Lagi</div>
            </div>
            
            <!-- Alert Box -->
            <div class="alert-box">
                <strong>{icon} PERHATIAN</strong>
                {days_text}
            </div>
            
            <!-- Info Card -->
            <div class="info-card">
                <div class="info-row">
                    <span class="info-label">Nama Paket:</span>
                    <span class="info-value"><strong>All In</strong></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value">web@rsppn.co.id</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Tanggal Berakhir:</span>
                    <span class="info-value"><strong style="color: #dc3545;">7 Februari 2026</strong></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Periode Perpanjangan:</span>
                    <span class="info-value">1 Tahun</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Harga Perpanjangan:</span>
                    <span class="info-value price">Rp 81.000.000</span>
                </div>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align: center;">
                <a href="https://neointegratech.com/dashboard" class="button">
                    💳 PERPANJANG SEKARANG
                </a>
            </div>
            
            <p style="color: #6c757d; font-size: 14px; margin-top: 30px;">
                <strong>Catatan Penting:</strong> Untuk menghindari gangguan layanan, mohon lakukan perpanjangan sebelum tanggal 7 Februari 2026. 
                Jika pembayaran tidak diterima sebelum tanggal tersebut, layanan akan otomatis dinonaktifkan.
            </p>
            
            <p style="margin-top: 30px;">
                Salam Hangat,<br>
                <strong>Tim Neo Integratech</strong>
            </p>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="contact-info">
                <strong>Hubungi Kami:</strong><br>
                📧 Email: <a href="mailto:support@neointegratech.com">support@neointegratech.com</a><br>
                📱 WhatsApp: <a href="https://wa.me/6281234567890">+62 812-3456-7890</a><br>
                🌐 Website: <a href="https://neointegratech.com">neointegratech.com</a>
            </div>
            <p style="margin-top: 15px; font-size: 12px; color: #adb5bd;">
                © 2026 Neo Integratech. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
    """
    
    # Plain text version
    text_body = f"""
{urgency}: PERPANJANGAN PAKET ALL IN
{'=' * 70}

Kepada Yth,
Tim RSPPN

{icon} PERHATIAN
{days_text.replace('<strong>', '').replace('</strong>', '').replace(f"style='color: {urgency_color};'", '')}

DETAIL PAKET:
- Nama Paket: All In
- Email: web@rsppn.co.id
- Tanggal Berakhir: 7 Februari 2026
- Periode Perpanjangan: 1 Tahun
- Harga Perpanjangan: Rp 81.000.000

PERPANJANG SEKARANG:
https://neointegratech.com/dashboard

CATATAN PENTING:
Untuk menghindari gangguan layanan, mohon lakukan perpanjangan sebelum tanggal 7 Februari 2026.
Jika pembayaran tidak diterima sebelum tanggal tersebut, layanan akan otomatis dinonaktifkan.

Salam Hangat,
Tim Neo Integratech

---
HUBUNGI KAMI:
Email: support@neointegratech.com
WhatsApp: +62 812-3456-7890
Website: neointegratech.com

© 2026 Neo Integratech. All rights reserved.
    """
    
    try:
        # Create message
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = f"{from_name} <{from_email}>"
        message["To"] = f"{to_name} <{to_email}>"
        message["Reply-To"] = "support@neointegratech.com"
        
        # Attach both versions
        part1 = MIMEText(text_body, "plain", "utf-8")
        part2 = MIMEText(html_body, "html", "utf-8")
        message.attach(part1)
        message.attach(part2)
        
        # Send email
        print(f"🔄 Mengirim email reminder ({urgency}) ke {to_email}...")
        print(f"📅 Sisa hari: {days_left} hari")
        
        if smtp_port == 465:
            with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
                server.login(smtp_username, smtp_password)
                server.send_message(message)
        else:
            with smtplib.SMTP(smtp_server, smtp_port) as server:
                server.starttls()
                server.login(smtp_username, smtp_password)
                server.send_message(message)
        
        print(f"✅ Email reminder berhasil dikirim!")
        print(f"⏰ Waktu pengiriman: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error mengirim email: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def check_and_send_reminder():
    """
    Cek apakah hari ini adalah hari reminder (H-7, H-3, H-1, H-Day)
    dan kirim email jika ya
    """
    days_left = calculate_days_until_expiry()
    
    # Daftar hari reminder
    reminder_days = [7, 3, 1, 0]
    
    if days_left in reminder_days:
        print(f"📅 Hari ini adalah H-{days_left} - Mengirim reminder...")
        return send_scheduled_reminder()
    else:
        print(f"📅 Sisa {days_left} hari - Bukan hari reminder")
        print(f"   Reminder akan dikirim pada H-7, H-3, H-1, dan H-Day")
        return False


if __name__ == "__main__":
    print("=" * 70)
    print("SCHEDULED EMAIL REMINDER - PERPANJANGAN PAKET RSPPN")
    print("=" * 70)
    print()
    
    # Check environment variables
    if not os.getenv("SMTP_USERNAME") or not os.getenv("SMTP_PASSWORD"):
        print("⚠️  Warning: SMTP credentials tidak ditemukan di .env file")
        print("   Pastikan SMTP_USERNAME dan SMTP_PASSWORD sudah diset")
        print()
    
    # Calculate days until expiry
    days_left = calculate_days_until_expiry()
    expiry_date = datetime(2026, 2, 7)
    
    print(f"📅 Tanggal Hari Ini: {datetime.now().strftime('%d %B %Y')}")
    print(f"🎯 Tanggal Jatuh Tempo: {expiry_date.strftime('%d %B %Y')}")
    print(f"⏱️  Sisa Waktu: {days_left} hari")
    print()
    
    # Check and send
    success = check_and_send_reminder()
    
    print()
    print("=" * 70)
    if success:
        print("✅ SELESAI - Email reminder berhasil dikirim!")
    else:
        print("ℹ️  TIDAK ADA PENGIRIMAN - Bukan hari reminder")
    print("=" * 70)
