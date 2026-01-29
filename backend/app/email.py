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


def send_order_confirmation_email(to_email: str, order_data: dict):
    """Send order confirmation email to client"""
    subject = f"Order Confirmation #{order_data['order_number']} - NeoIntegra Tech"
    
    body = f"""
    Hi {order_data['customer_name']},
    
    Thank you for your order!
    
    Order Details:
    - Order Number: {order_data['order_number']}
    - Service: {order_data['service_name']}
    - Quantity: {order_data['quantity']}
    - Total Amount: Rp {order_data['total_amount']:,.0f}
    - Status: {order_data['status']}
    
    We will process your order shortly. You can track your order status at:
    {settings.FRONTEND_URL}/dashboard
    
    If you have any questions, feel free to contact us.
    
    Best regards,
    NeoIntegra Tech Team
    """
    
    html = f"""
    <html>
        <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
                <h2 style="color: #4F46E5;">Order Confirmation</h2>
                <p>Hi <strong>{order_data['customer_name']}</strong>,</p>
                <p>Thank you for your order! Here are your order details:</p>
                
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #666;">Order Number:</td>
                            <td style="padding: 8px 0; text-align: right;"><strong>{order_data['order_number']}</strong></td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666;">Service:</td>
                            <td style="padding: 8px 0; text-align: right;"><strong>{order_data['service_name']}</strong></td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666;">Quantity:</td>
                            <td style="padding: 8px 0; text-align: right;"><strong>{order_data['quantity']}</strong></td>
                        </tr>
                        <tr style="border-top: 2px solid #e5e7eb;">
                            <td style="padding: 12px 0; color: #666; font-size: 16px;">Total Amount:</td>
                            <td style="padding: 12px 0; text-align: right; font-size: 18px; color: #4F46E5;">
                                <strong>Rp {order_data['total_amount']:,.0f}</strong>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666;">Status:</td>
                            <td style="padding: 8px 0; text-align: right;">
                                <span style="background-color: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 4px; font-size: 12px;">
                                    {order_data['status'].upper()}
                                </span>
                            </td>
                        </tr>
                    </table>
                </div>
                
                <p>We will process your order shortly.</p>
                
                <a href="{settings.FRONTEND_URL}/dashboard" 
                   style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
                    Track Your Order
                </a>
                
                <p style="color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    If you have any questions, feel free to contact us.<br>
                    <strong>NeoIntegra Tech Team</strong>
                </p>
            </div>
        </body>
    </html>
    """
    
    return send_email(to_email, subject, body, html)


def send_payment_confirmation_email(to_email: str, payment_data: dict):
    """Send payment confirmation email to client"""
    subject = f"Payment Received - Order #{payment_data['order_number']} - NeoIntegra Tech"
    
    body = f"""
    Hi {payment_data['customer_name']},
    
    We have received your payment!
    
    Payment Details:
    - Order Number: {payment_data['order_number']}
    - Payment Method: {payment_data['payment_method'].upper()}
    - Amount Paid: Rp {payment_data['amount']:,.0f}
    - Payment Status: {payment_data['status'].upper()}
    - Transaction ID: {payment_data.get('transaction_id', 'N/A')}
    
    Your order is now being processed. You can check the progress at:
    {settings.FRONTEND_URL}/dashboard
    
    Thank you for your business!
    
    Best regards,
    NeoIntegra Tech Team
    """
    
    html = f"""
    <html>
        <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="width: 60px; height: 60px; background-color: #10b981; border-radius: 50%; 
                                margin: 0 auto 10px; display: flex; align-items: center; justify-content: center;">
                        <span style="color: white; font-size: 30px;">✓</span>
                    </div>
                    <h2 style="color: #10b981; margin: 0;">Payment Received!</h2>
                </div>
                
                <p>Hi <strong>{payment_data['customer_name']}</strong>,</p>
                <p>We have successfully received your payment. Thank you!</p>
                
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #666;">Order Number:</td>
                            <td style="padding: 8px 0; text-align: right;"><strong>{payment_data['order_number']}</strong></td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666;">Payment Method:</td>
                            <td style="padding: 8px 0; text-align: right;"><strong>{payment_data['payment_method'].upper()}</strong></td>
                        </tr>
                        <tr style="border-top: 2px solid #e5e7eb;">
                            <td style="padding: 12px 0; color: #666; font-size: 16px;">Amount Paid:</td>
                            <td style="padding: 12px 0; text-align: right; font-size: 18px; color: #10b981;">
                                <strong>Rp {payment_data['amount']:,.0f}</strong>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666;">Status:</td>
                            <td style="padding: 8px 0; text-align: right;">
                                <span style="background-color: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 4px; font-size: 12px;">
                                    {payment_data['status'].upper()}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666;">Transaction ID:</td>
                            <td style="padding: 8px 0; text-align: right; font-size: 12px; color: #666;">
                                {payment_data.get('transaction_id', 'N/A')}
                            </td>
                        </tr>
                    </table>
                </div>
                
                <p>Your order is now being processed. We will notify you once it's ready.</p>
                
                <a href="{settings.FRONTEND_URL}/dashboard" 
                   style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
                    View Order Status
                </a>
                
                <p style="color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    Thank you for your business!<br>
                    <strong>NeoIntegra Tech Team</strong>
                </p>
            </div>
        </body>
    </html>
    """
    
    return send_email(to_email, subject, body, html)


def send_payment_pending_email(to_email: str, payment_data: dict):
    """Send payment pending email with payment instructions"""
    subject = f"Complete Your Payment - Order #{payment_data['order_number']} - NeoIntegra Tech"
    
    payment_instructions = ""
    if payment_data['payment_method'] == 'va':
        payment_instructions = f"""
        Virtual Account Number: {payment_data.get('va_number', 'See payment page')}
        Bank: {payment_data.get('payment_channel', 'BCA').upper()}
        
        Please transfer the exact amount to the Virtual Account number above.
        """
    elif payment_data['payment_method'] == 'qris':
        payment_instructions = "Please scan the QR code on the payment page to complete your payment."
    
    body = f"""
    Hi {payment_data['customer_name']},
    
    Your order has been created! Please complete your payment to process your order.
    
    Order Details:
    - Order Number: {payment_data['order_number']}
    - Amount: Rp {payment_data['amount']:,.0f}
    - Payment Method: {payment_data['payment_method'].upper()}
    
    Payment Instructions:
    {payment_instructions}
    
    Payment Link: {payment_data.get('payment_url', f"{settings.FRONTEND_URL}/dashboard")}
    
    This payment link will expire in 24 hours.
    
    Best regards,
    NeoIntegra Tech Team
    """
    
    html = f"""
    <html>
        <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
                <h2 style="color: #f59e0b;">Complete Your Payment</h2>
                <p>Hi <strong>{payment_data['customer_name']}</strong>,</p>
                <p>Your order has been created! Please complete your payment to process your order.</p>
                
                <div style="background-color: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #666;">Order Number:</td>
                            <td style="padding: 8px 0; text-align: right;"><strong>{payment_data['order_number']}</strong></td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666;">Payment Method:</td>
                            <td style="padding: 8px 0; text-align: right;"><strong>{payment_data['payment_method'].upper()}</strong></td>
                        </tr>
                        <tr style="border-top: 2px solid #fef3c7;">
                            <td style="padding: 12px 0; color: #666; font-size: 16px;">Amount to Pay:</td>
                            <td style="padding: 12px 0; text-align: right; font-size: 18px; color: #f59e0b;">
                                <strong>Rp {payment_data['amount']:,.0f}</strong>
                            </td>
                        </tr>
    """
    
    # Add payment method specific instructions
    if payment_data['payment_method'] == 'va' and payment_data.get('va_number'):
        html += f"""
                        <tr>
                            <td style="padding: 8px 0; color: #666;">Bank:</td>
                            <td style="padding: 8px 0; text-align: right;"><strong>{payment_data.get('payment_channel', 'BCA').upper()}</strong></td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666;">VA Number:</td>
                            <td style="padding: 8px 0; text-align: right; font-family: monospace; font-size: 16px;">
                                <strong>{payment_data.get('va_number')}</strong>
                            </td>
                        </tr>
        """
    
    html += f"""
                    </table>
                </div>
                
                <p style="color: #dc2626; font-weight: bold;">⏰ This payment link will expire in 24 hours.</p>
                
                <a href="{payment_data.get('payment_url', f'{settings.FRONTEND_URL}/dashboard')}" 
                   style="background-color: #f59e0b; color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
                    Complete Payment Now
                </a>
                
                <p style="color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    Need help? Contact us anytime.<br>
                    <strong>NeoIntegra Tech Team</strong>
                </p>
            </div>
        </body>
    </html>
    """
    
    return send_email(to_email, subject, body, html)

