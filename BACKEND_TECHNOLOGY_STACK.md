# Backend Technology Stack Documentation

**Project:** NeoIntegra Tech API  
**Version:** 1.0.0  
**Last Updated:** February 2, 2026

---

## 📚 Technology Stack

### **1. Core Framework**

#### **FastAPI 0.115.6**
- **Purpose:** Modern, high-performance web framework untuk building APIs
- **Key Features:**
  - Automatic API documentation (Swagger UI, ReDoc)
  - Fast execution dengan async/await support
  - Built-in request validation menggunakan Pydantic
  - Type hints untuk better IDE support dan error detection
- **Why FastAPI:** Performance tinggi (setara dengan NodeJS dan Go), modern Python features, automatic documentation generation

#### **Uvicorn 0.34.0**
- **Purpose:** Lightning-fast ASGI server untuk menjalankan FastAPI
- **Key Features:**
  - Async I/O untuk high concurrency
  - Standard ASGI server dengan performance optimal
  - Support HTTP/1.1 dan HTTP/2
- **Production Config:** Single worker untuk menghindari race conditions pada SQLite

---

### **2. Database Layer**

#### **SQLAlchemy 2.0.45**
- **Purpose:** SQL toolkit dan Object-Relational Mapping (ORM)
- **Key Features:**
  - Abstraksi database layer
  - Support multiple database engines (SQLite, PostgreSQL, MySQL)
  - Relationship management antar tables
  - Migration support
- **Models:** User, Service, Order, Payment, Subscription

#### **SQLite (Development) / PostgreSQL (Production)**
- **Development:** SQLite untuk simplicity dan portability
- **Production:** PostgreSQL untuk reliability, scalability, concurrent access
- **Connection Pooling:** Built-in SQLAlchemy pooling untuk efficiency

#### **Aiosqlite 0.22.1**
- **Purpose:** Async SQLite driver
- **Key Features:** Non-blocking database operations untuk better performance

---

### **3. Security & Authentication**

#### **Python-Jose 3.3.0**
- **Purpose:** JSON Web Token (JWT) implementation
- **Key Features:**
  - JWT token generation dan verification
  - Cryptography support untuk secure token encoding
- **Usage:** Bearer token authentication untuk protected endpoints

#### **Passlib 1.7.4 + Bcrypt 4.1.2**
- **Purpose:** Password hashing library
- **Key Features:**
  - Bcrypt algorithm untuk secure password storage
  - Automatic salt generation
  - Slow hashing untuk protection dari brute-force attacks
- **Security:** Passwords never stored in plain text

#### **PyJWT 2.10.1**
- **Purpose:** JWT encoding/decoding
- **Token Expiry:** 7 days (configurable via ACCESS_TOKEN_EXPIRE_MINUTES)
- **Algorithm:** HS256 (HMAC with SHA-256)

---

### **4. Email System**

#### **Email-Validator 2.3.0**
- **Purpose:** Email address validation
- **Key Features:**
  - RFC-compliant email validation
  - DNS verification support
  - Syntax checking

#### **SMTP Email Service**
- **Current Provider:** Hostinger SMTP (smtp.hostinger.com:587)
- **Email Account:** hello@neointegratech.com
- **Features:**
  - Order confirmation emails
  - Payment notifications
  - Password reset emails
  - Subscription renewal reminders

---

### **5. Payment Gateway Integration**

#### **HTTPx 0.28.1**
- **Purpose:** Modern async HTTP client
- **Usage:** Integration dengan iPaymu Payment Gateway API
- **Key Features:**
  - Async requests untuk better performance
  - Connection pooling
  - Timeout configuration

#### **iPaymu Payment Gateway v2**
- **Environment:** Production
- **Supported Methods:** 
  - Virtual Account (BCA, BNI, BRI, Mandiri, CIMB Niaga, Permata, BSI, Danamon)
  - Future: QRIS support
- **API Base URL:** https://my.ipaymu.com/api/v2
- **Features:**
  - Real-time payment callback
  - VA number generation
  - Transaction status tracking

---

### **6. Environment & Configuration**

#### **Python-Dotenv 1.0.1**
- **Purpose:** Environment variable management dari .env file
- **Usage:** Load configuration tanpa hardcode di code

#### **Pydantic-Settings 2.11.0 + Pydantic 2.10.5**
- **Purpose:** Settings management dengan validation
- **Key Features:**
  - Type-safe configuration
  - Automatic validation
  - Environment variable parsing
  - Fallback values support
- **Config Class:** Settings class dengan BaseSettings inheritance

---

### **7. Rate Limiting & Security**

#### **SlowAPI 0.1.9**
- **Purpose:** Rate limiting middleware
- **Configuration:** 60 requests per minute per endpoint
- **Key Features:**
  - IP-based rate limiting
  - Automatic cleanup task
  - Redis-like in-memory storage
- **Protection:** Prevent API abuse dan DDoS attacks

---

### **8. Production Server**

#### **Gunicorn 23.0.0**
- **Purpose:** Production-grade WSGI HTTP server
- **Usage:** Optional worker process manager
- **Configuration:** 
  - Multi-worker support untuk high traffic
  - Graceful restart
  - Process management
- **Note:** Currently using single Uvicorn worker (configured in Dockerfile)

---

## 🚀 Deployment Architecture

### **Platform: Coolify on Hostinger VPS**

#### **What is Coolify?**
- **Description:** Open-source, self-hosted PaaS (Platform as a Service)
- **Features:**
  - Docker-based application deployment
  - Automatic SSL certificate (Let's Encrypt)
  - Git integration untuk auto-deploy
  - Built-in reverse proxy (Traefik)
  - Environment variable management
  - Zero-downtime deployments

#### **Why Coolify?**
- Heroku-like experience di VPS sendiri
- No vendor lock-in
- Full control atas infrastructure
- Cost-effective (single VPS untuk multiple apps)
- Automatic HTTPS dengan wildcard SSL

---

### **Deployment Method: Docker**

#### **Container Configuration**
```dockerfile
Base Image: python:3.11-slim
Working Directory: /app
Exposed Port: 8000
Command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 1
```

#### **Build Process**
1. **Git Push → GitHub**
   - Developer push code ke repository
   - Webhook triggered (optional)

2. **Coolify Auto-Deploy**
   - Coolify detect git changes
   - Pull latest code dari GitHub
   - Build Docker image
   - Run container dengan environment variables

3. **Zero-Downtime Deployment**
   - New container started
   - Health check passed
   - Traffic switched to new container
   - Old container stopped

#### **Environment Variables (Set in Coolify)**
```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/neointegra

# Security
SECRET_KEY=[generated-secret-key]

# Email (Hostinger SMTP)
MAIL_SERVER=smtp.hostinger.com
MAIL_PORT=587
MAIL_USERNAME=hello@neointegratech.com
MAIL_PASSWORD=[hostinger-email-password]
MAIL_FROM=hello@neointegratech.com

# Payment Gateway (iPaymu)
IPAYMU_VA=1179001393387726
IPAYMU_API_KEY=CED87086-8579-48DA-AC7D-0F8D461C9961
IPAYMU_PRODUCTION=true

# URLs
FRONTEND_URL=https://neointegratech.com
BACKEND_URL=https://api.neointegratech.com
```

---

### **Network & Routing**

#### **Reverse Proxy: Traefik (Built-in Coolify)**
- **Purpose:** Automatic HTTPS, routing, load balancing
- **SSL:** Let's Encrypt automatic certificate renewal
- **Domain Routing:**
  - `api.neointegratech.com` → Backend container port 8000
  - `neointegratech.com` → Frontend container port 80

#### **Port Mapping**
```
Container Port: 8000 (internal)
Public Port: 443 (HTTPS) - via Traefik reverse proxy
Protocol: HTTP/1.1, HTTP/2
```

---

### **Container Management**

#### **Process Manager: Docker (via Coolify)**
- **Auto-restart:** Yes (on failure)
- **Health Checks:** Built-in container health monitoring
- **Logs:** Accessible via Coolify dashboard
- **Resource Limits:** Configurable per container

#### **No PM2 or Systemd Needed**
- Docker handles process management
- Coolify manages container lifecycle
- Automatic restart on crashes
- Resource monitoring built-in

---

## 🏥 Health Endpoints

### **1. Root Health Check**
```http
GET https://api.neointegratech.com/
```

**Response:**
```json
{
  "status": "online",
  "app": "NeoIntegra Tech API",
  "version": "1.0.0",
  "timestamp": "2026-02-02T10:30:00.000000",
  "cors": "enabled",
  "allowed_origins": "*"
}
```

**Purpose:** Quick status check untuk monitoring services

---

### **2. Detailed Health Check**
```http
GET https://api.neointegratech.com/health
```

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2026-02-02T10:30:00.000000",
  "cors_configured": true
}
```

**Purpose:** Detailed health status termasuk database connection

---

### **3. API Root Endpoint**
```http
GET https://api.neointegratech.com/api
```

**Response:**
```json
{
  "message": "NeoIntegraTech API",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "services": "/api/services",
    "orders": "/api/orders",
    "payments": "/api/payments",
    "subscriptions": "/api/subscriptions",
    "users": "/api/users"
  }
}
```

**Purpose:** API discovery dan available endpoints

---

### **4. Interactive API Documentation**
```http
GET https://api.neointegratech.com/docs
```

**Purpose:** Swagger UI - Interactive API testing interface

```http
GET https://api.neointegratech.com/redoc
```

**Purpose:** ReDoc - Alternative API documentation

---

## 📊 Monitoring & Logging

### **Application Logs**
- **Location:** Docker container logs (via Coolify)
- **Access:** Coolify dashboard → Logs tab
- **Retention:** Configurable in Coolify

### **Startup Logs Example**
```
🚀 Starting NeoIntegra Tech API v1.0.0
🌍 Environment: Production
✅ Database initialized
✅ Default services already exist
✅ Rate limit cleanup task started
```

### **Error Logging**
- **Global Exception Handler:** Catches all unhandled exceptions
- **Email Send Failures:** Logged but don't block operations
- **Payment Gateway Errors:** Detailed logging for debugging

---

## 🔧 Maintenance Operations

### **Database Migrations**
Currently using SQLAlchemy auto-create tables (development phase).  
For production migrations, recommend using **Alembic**.

### **Service Initialization**
- Automatic on startup
- Creates default services if not exist:
  - Paket All In Service (Rp 81.000.000)
  - Website Service (Rp 36.000.000)
  - SEO Service (Rp 42.000.000)
  - Mail Server Service (Rp 15.000.000)
  - Cloudflare Service (Rp 24.000.000)

### **Rate Limit Cleanup**
- Automatic background task
- Runs every 5 minutes
- Cleans expired rate limit entries

---

## 🔐 Security Best Practices

### **Applied in Current Setup**
- ✅ Password hashing dengan Bcrypt
- ✅ JWT token authentication
- ✅ HTTPS only (via Traefik SSL)
- ✅ CORS configured
- ✅ Rate limiting enabled
- ✅ Environment variables untuk secrets
- ✅ No credentials in code repository

### **Recommendations**
- [ ] Enable database connection encryption
- [ ] Add request payload size limits
- [ ] Implement API key authentication untuk webhooks
- [ ] Add request signing untuk iPaymu callbacks
- [ ] Setup WAF (Web Application Firewall) via Cloudflare

---

## 📈 Performance Optimization

### **Current Optimizations**
- Async/await throughout application
- Connection pooling (SQLAlchemy)
- Single worker to avoid SQLite lock issues
- CDN via Cloudflare untuk static assets
- Gzip compression enabled

### **Scaling Strategy**
- **Vertical:** Upgrade VPS resources
- **Horizontal:** Multiple containers dengan load balancer
- **Database:** Migrate to PostgreSQL for better concurrent access
- **Caching:** Add Redis untuk session storage dan rate limiting

---

## 🆘 Troubleshooting

### **Common Issues**

#### **1. Backend Not Accessible**
- Check Coolify container status
- Verify environment variables set
- Check Traefik logs for routing issues
- Test health endpoint: `curl https://api.neointegratech.com/health`

#### **2. Database Connection Issues**
- Verify DATABASE_URL environment variable
- Check PostgreSQL service status
- Test connection dari container: `psql $DATABASE_URL`

#### **3. Email Not Sending**
- Verify MAIL_* environment variables
- Test SMTP connection: `telnet smtp.hostinger.com 587`
- Check email logs in application output
- Verify email password di hPanel Hostinger

#### **4. Payment Gateway Errors**
- Verify IPAYMU_* environment variables
- Check production mode flag: `IPAYMU_PRODUCTION=true`
- Test API credentials dengan iPaymu sandbox first
- Monitor iPaymu callback logs

---

## 📞 Support & Resources

### **Documentation**
- FastAPI: https://fastapi.tiangolo.com/
- SQLAlchemy: https://docs.sqlalchemy.org/
- Coolify: https://coolify.io/docs
- iPaymu API: https://ipaymu.com/dokumentasi-api/

### **Deployment Guides**
- [DEPLOYMENT_GUIDE_HOSTINGER_COOLIFY.md](./DEPLOYMENT_GUIDE_HOSTINGER_COOLIFY.md)
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- [DEPLOYMENT_TROUBLESHOOTING.md](./DEPLOYMENT_TROUBLESHOOTING.md)

### **Repository**
- GitHub: https://github.com/sagaracode/neointegra

---

**End of Documentation**
