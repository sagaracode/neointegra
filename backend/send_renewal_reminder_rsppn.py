"""
Script untuk mengirim email reminder perpanjangan paket ke web@rsppn.co.id
Paket: All In - Rp 81.000.000
Jatuh Tempo: 7 Februari 2026
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def send_renewal_reminder():
    """
    Kirim email reminder perpanjangan paket ke web@rsppn.co.id
    """
    
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
    
    # Email content
    subject = "🔔 Reminder: Perpanjangan Paket All In - Jatuh Tempo 7 Feb 2026"
    
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }}
        .header h1 {{
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }}
        .content {{
            padding: 30px;
        }}
        .alert-box {{
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }}
        .alert-box strong {{
            color: #856404;
            display: block;
            margin-bottom: 5px;
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 40px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
            margin: 20px 0;
            transition: transform 0.2s;
        }}
        .button:hover {{
            transform: translateY(-2px);
        }}
        .benefits {{
            background: #e7f3ff;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }}
        .benefits h3 {{
            color: #0066cc;
            margin-top: 0;
        }}
        .benefits ul {{
            margin: 10px 0;
            padding-left: 20px;
        }}
        .benefits li {{
            margin: 8px 0;
            color: #333;
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
            <h1>🔔 Reminder Perpanjangan Paket</h1>
        </div>
        
        <!-- Content -->
        <div class="content">
            <p>Kepada Yth,<br><strong>Tim RSPPN</strong></p>
            
            <p>Kami ingin mengingatkan bahwa paket <strong>All In</strong> Anda akan segera berakhir.</p>
            
            <!-- Alert Box -->
            <div class="alert-box">
                <strong>⚠️ Perhatian</strong>
                Paket Anda akan berakhir dalam <strong>2 hari</strong> pada tanggal 7 Februari 2026.
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
            
            <!-- Benefits -->
            <div class="benefits">
                <h3>✨ Benefit Paket All In</h3>
                <ul>
                    <li>🌐 <strong>Website Professional</strong> - Design custom & mobile responsive</li>
                    <li>🎨 <strong>Branding Lengkap</strong> - Logo, color palette, typography</li>
                    <li>📱 <strong>Social Media Management</strong> - Konten & engagement</li>
                    <li>🚀 <strong>SEO Optimization</strong> - Peringkat Google optimal</li>
                    <li>📧 <strong>Email Marketing</strong> - Campaign & automation</li>
                    <li>📊 <strong>Analytics & Reporting</strong> - Dashboard real-time</li>
                    <li>🔒 <strong>Security & Maintenance</strong> - Update & monitoring 24/7</li>
                    <li>💬 <strong>Priority Support</strong> - Response time maksimal 2 jam</li>
                </ul>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align: center;">
                <a href="https://neointegratech.com/dashboard" class="button">
                    💳 Perpanjang Sekarang
                </a>
            </div>
            
            <p style="color: #6c757d; font-size: 14px; margin-top: 30px;">
                <strong>Catatan:</strong> Untuk menghindari gangguan layanan, mohon lakukan perpanjangan sebelum tanggal 7 Februari 2026. 
                Jika pembayaran tidak diterima sebelum tanggal tersebut, layanan akan otomatis dinonaktifkan.
            </p>
            
            <p style="margin-top: 30px;">
                Jika Anda memiliki pertanyaan atau memerlukan bantuan, jangan ragu untuk menghubungi kami.
            </p>
            
            <p>
                Terima kasih atas kepercayaan Anda menggunakan layanan kami! 🙏
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
                © 2026 Neo Integratech. All rights reserved.<br>
                Email ini dikirim secara otomatis, mohon tidak membalas email ini.
            </p>
        </div>
    </div>
</body>
</html>
    """
    
    # Plain text version (fallback)
    text_body = f"""
REMINDER: PERPANJANGAN PAKET ALL IN
====================================

Kepada Yth,
Tim RSPPN

Kami ingin mengingatkan bahwa paket All In Anda akan segera berakhir.

⚠️ PERHATIAN
Paket Anda akan berakhir dalam 2 hari pada tanggal 7 Februari 2026.

DETAIL PAKET:
- Nama Paket: All In
- Email: web@rsppn.co.id
- Tanggal Berakhir: 7 Februari 2026
- Periode Perpanjangan: 1 Tahun
- Harga Perpanjangan: Rp 81.000.000

BENEFIT PAKET ALL IN:
✓ Website Professional - Design custom & mobile responsive
✓ Branding Lengkap - Logo, color palette, typography
✓ Social Media Management - Konten & engagement
✓ SEO Optimization - Peringkat Google optimal
✓ Email Marketing - Campaign & automation
✓ Analytics & Reporting - Dashboard real-time
✓ Security & Maintenance - Update & monitoring 24/7
✓ Priority Support - Response time maksimal 2 jam

PERPANJANG SEKARANG:
https://neointegratech.com/dashboard

CATATAN:
Untuk menghindari gangguan layanan, mohon lakukan perpanjangan sebelum tanggal 7 Februari 2026.
Jika pembayaran tidak diterima sebelum tanggal tersebut, layanan akan otomatis dinonaktifkan.

Jika Anda memiliki pertanyaan atau memerlukan bantuan, jangan ragu untuk menghubungi kami.

Terima kasih atas kepercayaan Anda menggunakan layanan kami!

Salam Hangat,
Tim Neo Integratech

---
HUBUNGI KAMI:
Email: support@neointegratech.com
WhatsApp: +62 812-3456-7890
Website: neointegratech.com

© 2026 Neo Integratech. All rights reserved.
Email ini dikirim secara otomatis, mohon tidak membalas email ini.
    """
    
    try:
        # Create message
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = f"{from_name} <{from_email}>"
        message["To"] = f"{to_name} <{to_email}>"
        message["Reply-To"] = "support@neointegratech.com"
        
        # Attach both plain text and HTML versions
        part1 = MIMEText(text_body, "plain", "utf-8")
        part2 = MIMEText(html_body, "html", "utf-8")
        message.attach(part1)
        message.attach(part2)
        
        # Send email via SMTP
        print(f"🔄 Mengirim email reminder ke {to_email}...")
        
        if smtp_port == 465:
            # SSL
            with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
                server.login(smtp_username, smtp_password)
                server.send_message(message)
        else:
            # TLS
            with smtplib.SMTP(smtp_server, smtp_port) as server:
                server.starttls()
                server.login(smtp_username, smtp_password)
                server.send_message(message)
        
        print(f"✅ Email reminder berhasil dikirim ke {to_email}")
        print(f"📧 Subject: {subject}")
        print(f"⏰ Waktu pengiriman: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error mengirim email: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    print("=" * 70)
    print("EMAIL REMINDER - PERPANJANGAN PAKET RSPPN")
    print("=" * 70)
    print()
    
    # Check environment variables
    if not os.getenv("SMTP_USERNAME") or not os.getenv("SMTP_PASSWORD"):
        print("⚠️  Warning: SMTP credentials tidak ditemukan di .env file")
        print("   Pastikan SMTP_USERNAME dan SMTP_PASSWORD sudah diset")
        print()
    
    # Send reminder
    success = send_renewal_reminder()
    
    print()
    print("=" * 70)
    if success:
        print("✅ SELESAI - Email reminder berhasil dikirim!")
    else:
        print("❌ GAGAL - Email reminder tidak berhasil dikirim")
    print("=" * 70)
