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
