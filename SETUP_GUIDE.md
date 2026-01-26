# 🚀 NeoIntegraTech - Setup Guide

## 📋 Overview
Platform integrasi lengkap untuk Domain, Hosting, Cloudflare, dan layanan digital lainnya dengan sistem pembayaran iPaymu.

## ✨ Fitur Profesional

### 🔐 Authentication & Security
- ✅ Registration dengan email verification
- ✅ Login dengan JWT token
- ✅ Forgot & Reset password
- ✅ Rate limiting (anti brute force)
- ✅ Password hashing dengan bcrypt
- ✅ Email templates HTML profesional

### 📧 Email Features
- ✅ Verification email otomatis
- ✅ Welcome email setelah verifikasi
- ✅ Password reset email
- ✅ HTML email templates responsive

### 💳 Payment Integration
- ✅ iPaymu Payment Gateway v2
- ✅ Multiple payment channels (VA, QRIS, E-wallet)
- ✅ Payment callback handling
- ✅ Order management

### 📊 Subscription Management
- ✅ Subscription tracking
- ✅ Expiry notifications
- ✅ Auto-renewal options
- ✅ Package management

## 🛠️ Technology Stack

### Backend
- FastAPI (Python)
- SQLAlchemy (ORM)
- PostgreSQL / SQLite
- JWT Authentication
- SlowAPI (Rate Limiting)
- SMTP Email Service

### Frontend
- React + Vite
- Tailwind CSS
- Framer Motion
- Zustand (State Management)
- React Router
- Axios

## 📦 Installation

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL (optional, SQLite for development)

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv_new

# Activate virtual environment
# Windows:
.\venv_new\Scripts\activate
# Linux/Mac:
source venv_new/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
copy .env.example .env
# Edit .env with your credentials

# Run database seed (create tables + sample data)
python -m app.seed

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Setup environment (if needed)
# Create .env file with:
# VITE_API_URL=http://localhost:8000/api

# Run development server
npm run dev
```

## 🔧 Environment Configuration

### Required Environment Variables

#### Email (Gmail SMTP)
```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@neointegratech.com
FROM_NAME=NeoIntegraTech
FRONTEND_URL=http://localhost:3000
```

**How to get Gmail App Password:**
1. Enable 2-Factor Authentication on your Google Account
2. Go to https://myaccount.google.com/apppasswords
3. Create new app password
4. Use that password in SMTP_PASSWORD

#### iPaymu Configuration
```env
IPAYMU_VA=your-virtual-account
IPAYMU_API_KEY=your-api-key
IPAYMU_BASE_URL=https://sandbox.ipaymu.com/api/v2
IPAYMU_CALLBACK_URL=http://localhost:8000/api/payments/callback
IPAYMU_RETURN_URL=http://localhost:3000/payment/success
IPAYMU_CANCEL_URL=http://localhost:3000/payment/cancel
```

**How to get iPaymu credentials:**
1. Register at https://ipaymu.com/
2. Login to dashboard: https://my.ipaymu.com/
3. Get VA and API Key from Settings
4. Use Sandbox for testing

## 🚀 Usage

### Testing Authentication Flow

1. **Register New Account**
   - Go to http://localhost:3000/register
   - Fill registration form
   - Check email for verification link

2. **Verify Email**
   - Click link in verification email
   - Or manually visit: http://localhost:3000/verify-email?token=YOUR_TOKEN

3. **Login**
   - Go to http://localhost:3000/login
   - Use verified credentials

4. **Forgot Password**
   - Click "Lupa password?" on login page
   - Enter email
   - Check email for reset link

5. **Reset Password**
   - Click link in reset email
   - Enter new password

### Test User (Already Seeded)
```
Email: web@rsppn.co.id
Password: rsppn178#
```
This user has subscription expiring on January 28, 2026.

## 🔒 Security Features

### Rate Limiting
- Login: 5 attempts/minute
- Forgot Password: 3 attempts/hour
- Prevents brute force attacks

### Password Security
- Minimum 8 characters
- Bcrypt hashing
- Auto-truncate to 72 bytes

### Token Security
- JWT with expiration
- Email verification (24h expiry)
- Password reset (1h expiry)
- Secure random tokens

## 📝 API Documentation

When running in development mode, access:
- Swagger UI: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

### Key Endpoints

#### Authentication
```
POST /api/auth/register - Register new user
POST /api/auth/login - Login
POST /api/auth/verify-email - Verify email
POST /api/auth/resend-verification - Resend verification
POST /api/auth/forgot-password - Request password reset
POST /api/auth/reset-password - Reset password
GET  /api/auth/me - Get current user
```

#### Services
```
GET /api/services - List all services
GET /api/services/featured - Featured services
GET /api/services/{slug} - Get service by slug
```

#### Orders & Payments
```
POST /api/orders - Create new order
GET  /api/orders - List user orders
POST /api/payments/create - Create payment
POST /api/payments/callback - iPaymu callback
```

#### Subscriptions
```
GET /api/subscriptions - List user subscriptions
GET /api/subscriptions/{id} - Get subscription detail
```

## 🎨 Customization

### Email Templates
Edit email templates in `backend/app/email.py`:
- `send_verification_email()` - Verification email
- `send_password_reset_email()` - Reset password email
- `send_welcome_email()` - Welcome email

### Frontend Styling
- Tailwind config: `frontend/tailwind.config.js`
- Global styles: `frontend/src/index.css`
- Colors and gradients defined in Tailwind config

## 🐛 Troubleshooting

### Email not sending
- Check SMTP credentials
- Ensure 2FA and App Password enabled (Gmail)
- Check firewall/antivirus settings
- Test SMTP connection manually

### Database errors
- Run seed script: `python -m app.seed`
- Check DATABASE_URL in .env
- Verify database permissions

### Login not working
- Check JWT_SECRET_KEY in .env
- Clear browser localStorage
- Check backend logs for errors

### CORS errors
- Add frontend URL to CORS_ORIGINS in .env
- Format: `http://localhost:3000,http://localhost:5173`

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [iPaymu API Docs](https://ipaymu.com/en/api-documentation/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🤝 Support

Untuk pertanyaan dan dukungan:
- Email: support@neointegratech.com
- GitHub Issues: [Repository URL]

## 📄 License

Copyright © 2026 NeoIntegraTech. All rights reserved.

---

**Built with ❤️ for professional digital services**
