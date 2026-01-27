# Backend API - NeoIntegra Tech

FastAPI backend dengan iPaymu Payment Gateway integration.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` dengan konfigurasi Anda:

```env
# Database
DATABASE_URL=sqlite:///./neointegratech.db

# Security
SECRET_KEY=your-long-random-secret-key-here

# Frontend
FRONTEND_URL=http://localhost:5173

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@neointegra.tech

# iPaymu Payment Gateway
IPAYMU_VA=1179001393387726
IPAYMU_API_KEY=SANDBOXABCD1234-EFGH5678-IJKL9012
IPAYMU_PRODUCTION=false
```

### 3. Initialize Database

```bash
python -m app.database
```

### 4. Seed Initial Data

```bash
python -m app.seed
```

Ini akan membuat:
- Demo user: `demo@neointegra.tech` / `demo123`
- Special customer: `web@rsppn.co.id` / `soedirman178#`
- Sample services
- Expiring subscription (untuk testing)

### 5. Run Development Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API akan berjalan di: `http://localhost:8000`

## 📚 API Documentation

Setelah server berjalan, buka:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🔑 iPaymu Configuration

### Development/Sandbox Mode

1. Daftar di [https://sandbox.ipaymu.com](https://sandbox.ipaymu.com)
2. Login ke dashboard
3. Buka menu **Integrasi**
4. Copy **VA** dan **API Key**
5. Set di `.env`:
   ```env
   IPAYMU_VA=your_sandbox_va
   IPAYMU_API_KEY=your_sandbox_api_key
   IPAYMU_PRODUCTION=false
   ```

### Production/Live Mode

1. Daftar di [https://my.ipaymu.com](https://my.ipaymu.com)
2. Verifikasi akun (KYC)
3. Login ke dashboard
4. Buka menu **Integrasi**
5. Copy **VA** dan **API Key** (berbeda dengan sandbox!)
6. Set di `.env`:
   ```env
   IPAYMU_VA=your_production_va
   IPAYMU_API_KEY=your_production_api_key
   IPAYMU_PRODUCTION=true
   ```

**⚠️ PENTING:** VA dan API Key sandbox **berbeda** dengan production!

### Supported Payment Methods

1. **Virtual Account (VA)**
   - BCA
   - BNI
   - BRI
   - Mandiri
   - CIMB Niaga

2. **QRIS**
   - Scan QR code
   - Compatible dengan semua e-wallet

3. **COD (Cash on Delivery)**
   - Payment dilakukan di tempat

## 📁 Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── endpoints/
│   │   │   ├── auth.py          # Authentication (register, login, verify)
│   │   │   ├── services.py      # Service listings
│   │   │   ├── orders.py        # Order management
│   │   │   ├── payments.py      # iPaymu payment integration
│   │   │   ├── subscriptions.py # Subscription management
│   │   │   └── users.py         # User profile
│   │   └── router.py            # API router
│   ├── config.py                # Settings & environment variables
│   ├── database.py              # Database connection
│   ├── email.py                 # Email utilities
│   ├── main.py                  # FastAPI app
│   ├── models.py                # Database models
│   ├── rate_limit.py            # Rate limiting
│   ├── schemas.py               # Pydantic schemas
│   └── seed.py                  # Database seeder
├── Dockerfile                   # Docker configuration
├── requirements.txt             # Python dependencies
└── .env.example                 # Environment variables template
```

## 🔐 Authentication

API menggunakan JWT (JSON Web Token) untuk authentication.

### Register

```bash
POST /api/auth/register
{
  "email": "user@example.com",
  "full_name": "John Doe",
  "password": "password123",
  "phone": "08123456789",
  "company_name": "Company Name"
}
```

### Login

```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    ...
  }
}
```

### Protected Routes

Gunakan token di header:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## 💳 Payment Flow

### 1. Create Order

```bash
POST /api/orders/
Authorization: Bearer {token}
{
  "service_name": "Website Development",
  "quantity": 1,
  "unit_price": 5000000,
  "total_price": 5000000,
  "notes": "Custom requirements..."
}
```

### 2. Create Payment

```bash
POST /api/payments/
Authorization: Bearer {token}
{
  "order_id": 1,
  "amount": 5000000,
  "payment_method": "va",
  "payment_channel": "bca"
}
```

Response untuk VA:
```json
{
  "id": 1,
  "payment_method": "va",
  "payment_channel": "bca",
  "amount": 5000000,
  "status": "pending",
  "va_number": "8578000000001234",
  "payment_url": "https://my.ipaymu.com/payment/...",
  "expired_at": "2026-01-27T00:00:00"
}
```

Response untuk QRIS:
```json
{
  "id": 1,
  "payment_method": "qris",
  "amount": 5000000,
  "status": "pending",
  "qr_code_url": "https://my.ipaymu.com/qr/...",
  "expired_at": "2026-01-27T00:00:00"
}
```

### 3. Payment Callback

iPaymu akan mengirim callback ke endpoint:
```
POST /api/payments/callback
```

Backend akan otomatis update status payment dan order.

## 🗄️ Database

### SQLite (Development)

Default menggunakan SQLite:
```env
DATABASE_URL=sqlite:///./neointegratech.db
```

### PostgreSQL (Production)

Untuk production, gunakan PostgreSQL:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/dbname
```

## 🐳 Docker Deployment

Build image:
```bash
docker build -t neointegra-backend .
```

Run container:
```bash
docker run -p 8000:8000 \
  -e DATABASE_URL="postgresql://..." \
  -e SECRET_KEY="your-secret" \
  -e IPAYMU_VA="your-va" \
  -e IPAYMU_API_KEY="your-key" \
  neointegra-backend
```

## 🔧 Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | sqlite | Database connection URL |
| `SECRET_KEY` | Yes | - | JWT secret key (use long random string) |
| `FRONTEND_URL` | Yes | localhost:5173 | Frontend URL for CORS |
| `SMTP_HOST` | No | smtp.gmail.com | Email SMTP host |
| `SMTP_PORT` | No | 587 | Email SMTP port |
| `SMTP_USER` | No | - | Email username |
| `SMTP_PASSWORD` | No | - | Email password |
| `EMAIL_FROM` | No | noreply@... | From email address |
| `IPAYMU_VA` | Yes* | - | iPaymu Virtual Account |
| `IPAYMU_API_KEY` | Yes* | - | iPaymu API Key |
| `IPAYMU_PRODUCTION` | No | false | true = production, false = sandbox |

*Required untuk payment features

## 📝 Testing

### Test with curl

Health check:
```bash
curl http://localhost:8000/
```

Register:
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","full_name":"Test User","password":"password123"}'
```

### Test with httpie

```bash
http POST localhost:8000/api/auth/register \
  email=test@example.com \
  full_name="Test User" \
  password=password123
```

## 🆘 Troubleshooting

### Database Error

```
sqlalchemy.exc.OperationalError: no such table: users
```

**Solution:** Run database initialization
```bash
python -m app.database
```

### iPaymu API Error

```
HTTPException: iPaymu API error: Signature not valid
```

**Solution:** 
1. Periksa `IPAYMU_VA` dan `IPAYMU_API_KEY` benar
2. Pastikan menggunakan VA/Key yang sesuai (sandbox vs production)
3. Check `IPAYMU_PRODUCTION` setting

### Import Error

```
ModuleNotFoundError: No module named 'fastapi'
```

**Solution:** Install dependencies
```bash
pip install -r requirements.txt
```

### Port Already in Use

```
ERROR: [Errno 48] Address already in use
```

**Solution:** Change port or kill existing process
```bash
# Change port
uvicorn app.main:app --port 8001

# Or kill existing
lsof -ti:8000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :8000   # Windows
```

## 📖 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [iPaymu API Docs](https://ipaymu.com/api-documentation/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Pydantic Documentation](https://docs.pydantic.dev/)

## 🤝 Support

Untuk pertanyaan atau issue, hubungi tim development.
