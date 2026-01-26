import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from .config import settings

def send_email(to_email: str, subject: str, body: str, html: str = None):
    """Send email using SMTP"""
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['From'] = settings.EMAIL_FROM
        msg['To'] = to_email
        msg['Subject'] = subject
        
        # Add plain text body
        part1 = MIMEText(body, 'plain')
        msg.attach(part1)
        
        # Add HTML body if provided
        if html:
            part2 = MIMEText(html, 'html')
            msg.attach(part2)
        
        # Send email
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
        
        print(f"✅ Email sent successfully to {to_email}")
        return True
    except Exception as e:
        print(f"❌ Failed to send email: {str(e)}")
        return False

def send_verification_email(to_email: str, verification_token: str):
    """Send email verification link"""
    verification_url = f"{settings.FRONTEND_URL}/verify-email?token={verification_token}"
    
    subject = "Verify Your Email - NeoIntegra Tech"
    body = f"""
    Welcome to NeoIntegra Tech!
    
    Please verify your email by clicking the link below:
    {verification_url}
    
    This link will expire in 24 hours.
    
    If you didn't create this account, please ignore this email.
    """
    
    html = f"""
    <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Welcome to NeoIntegra Tech!</h2>
            <p>Please verify your email by clicking the button below:</p>
            <a href="{verification_url}" 
               style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; display: inline-block;">
                Verify Email
            </a>
            <p>Or copy this link: <a href="{verification_url}">{verification_url}</a></p>
            <p style="color: #666; margin-top: 20px;">
                This link will expire in 24 hours.<br>
                If you didn't create this account, please ignore this email.
            </p>
        </body>
    </html>
    """
    
    return send_email(to_email, subject, body, html)

def send_password_reset_email(to_email: str, reset_token: str):
    """Send password reset link"""
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
    
    subject = "Reset Your Password - NeoIntegra Tech"
    body = f"""
    You requested to reset your password.
    
    Click the link below to reset your password:
    {reset_url}
    
    This link will expire in 1 hour.
    
    If you didn't request this, please ignore this email.
    """
    
    html = f"""
    <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Reset Your Password</h2>
            <p>You requested to reset your password. Click the button below:</p>
            <a href="{reset_url}" 
               style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; display: inline-block;">
                Reset Password
            </a>
            <p>Or copy this link: <a href="{reset_url}">{reset_url}</a></p>
            <p style="color: #666; margin-top: 20px;">
                This link will expire in 1 hour.<br>
                If you didn't request this, please ignore this email.
            </p>
        </body>
    </html>
    """
    
    return send_email(to_email, subject, body, html)
