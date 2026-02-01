import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

# Load .env
load_dotenv()

# Get email config
MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.hostinger.com")
MAIL_PORT = int(os.getenv("MAIL_PORT", "587"))
MAIL_USERNAME = os.getenv("MAIL_USERNAME", "")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD", "")
MAIL_FROM = os.getenv("MAIL_FROM", "")

print("=== Testing Hostinger Email Configuration ===")
print(f"MAIL_SERVER: {MAIL_SERVER}")
print(f"MAIL_PORT: {MAIL_PORT}")
print(f"MAIL_USERNAME: {MAIL_USERNAME}")
print(f"MAIL_FROM: {MAIL_FROM}")
print(f"MAIL_PASSWORD: {'*' * len(MAIL_PASSWORD) if MAIL_PASSWORD else '(empty)'}")
print()

# Validate config
if not MAIL_USERNAME or not MAIL_PASSWORD:
    print("❌ ERROR: MAIL_USERNAME or MAIL_PASSWORD is empty!")
    print("Please check your .env file")
    exit(1)

# Test email
test_email = input("Enter test email address: ")

try:
    print(f"\n🔄 Connecting to {MAIL_SERVER}:{MAIL_PORT}...")
    
    # Create message
    msg = MIMEMultipart('alternative')
    msg['From'] = MAIL_FROM
    msg['To'] = test_email
    msg['Subject'] = "Test Email - Hostinger SMTP"
    
    body = """
    This is a test email from NeoIntegra Tech.
    
    If you receive this, the Hostinger SMTP configuration is working correctly.
    
    Test Details:
    - Server: {}
    - Port: {}
    - From: {}
    """.format(MAIL_SERVER, MAIL_PORT, MAIL_FROM)
    
    part = MIMEText(body, 'plain')
    msg.attach(part)
    
    # Connect and send
    with smtplib.SMTP(MAIL_SERVER, MAIL_PORT, timeout=10) as server:
        server.set_debuglevel(1)  # Show detailed SMTP communication
        print("\n🔄 Starting TLS...")
        server.starttls()
        
        print(f"\n🔄 Logging in as {MAIL_USERNAME}...")
        server.login(MAIL_USERNAME, MAIL_PASSWORD)
        
        print(f"\n🔄 Sending email to {test_email}...")
        server.send_message(msg)
    
    print(f"\n✅ Email sent successfully to {test_email}!")
    print("Please check your inbox (and spam folder)")
    
except smtplib.SMTPAuthenticationError as e:
    print(f"\n❌ SMTP Authentication Failed!")
    print(f"Error: {e}")
    print("\nPossible causes:")
    print("1. Wrong username or password")
    print("2. Check hPanel Hostinger for correct credentials")
    print("3. Make sure email account is active")
    
except smtplib.SMTPException as e:
    print(f"\n❌ SMTP Error: {e}")
    
except Exception as e:
    print(f"\n❌ Error: {type(e).__name__}: {str(e)}")
    import traceback
    traceback.print_exc()
