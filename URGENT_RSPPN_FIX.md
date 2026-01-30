# 🚨 URGENT: RSPPN Login Fix Instructions

## Problem
Cannot login with `web@rsppn.co.id` - Getting 401 Invalid credentials error.

## Root Cause
Database di production belum ter-update dengan password RSPPN yang benar.

## ✅ QUICK FIX - Run Di Production (Coolify)

### Method 1: Via Coolify Terminal (RECOMMENDED)

1. **Buka Coolify Dashboard**
2. **Pilih Backend Service**
3. **Buka Terminal**
4. **Jalankan command berikut:**

```bash
# Method A: Using seeder (Will update all data)
python -m app.seed

# Method B: Using direct SQL fix (Only RSPPN)
python sql_fix_rsppn.py

# Method C: Using Python fix script
python quick_fix_rsppn.py
```

### Method 2: Via Python Script (Paling Simple)

Di terminal Coolify backend:

```bash
cat > fix_rsppn.py << 'EOF'
import bcrypt
from app.database import SessionLocal
from app.models import User

db = SessionLocal()
email = "web@rsppn.co.id"
password = "rsppn178#"

user = db.query(User).filter(User.email == email).first()
if user:
    user.hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    user.full_name = "RSPPN Soedirman"
    user.is_active = True
    user.is_verified = True
    db.commit()
    print("✅ Password updated!")
else:
    print("❌ User not found")
db.close()
EOF

python fix_rsppn.py
```

### Method 3: Direct SQL (Jika Python tidak work)

```bash
# Masuk ke SQLite
sqlite3 neointegratech.db

# Cek user exists
SELECT id, email, full_name FROM users WHERE email = 'web@rsppn.co.id';

# Jika user ada, catat ID-nya, lalu keluar
.exit
```

Lalu jalankan Python untuk generate bcrypt hash:

```bash
python3 -c "import bcrypt; print(bcrypt.hashpw('rsppn178#'.encode(), bcrypt.gensalt()).decode())"
```

Copy hash yang dihasilkan, lalu:

```bash
sqlite3 neointegratech.db
UPDATE users SET hashed_password = 'PASTE_HASH_HERE' WHERE email = 'web@rsppn.co.id';
.exit
```

## ✅ Verify After Fix

### Test via curl:
```bash
curl -X POST https://api.neointegratech.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"web@rsppn.co.id","password":"rsppn178#"}'
```

### Expected Response:
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user": { ... }
}
```

## 📋 Final Credentials

```
Email: web@rsppn.co.id
Password: rsppn178#
```

## Scripts Available in Repo

1. `backend/sql_fix_rsppn.py` - Direct SQL update
2. `backend/quick_fix_rsppn.py` - Python ORM update
3. `backend/check_rsppn.py` - Check & verify credentials
4. `backend/fix_rsppn_now.py` - Force fix with verbose output

## Alternative: Re-run Full Seeder

This will also fix RSPPN password:

```bash
cd /app
python -m app.seed
```

Output should show:
```
ℹ️  RSPPN Soedirman customer updated: web@rsppn.co.id
```

---

## 🔴 If Still Failing

1. Check if backend is using correct database file
2. Check if SECRET_KEY is same between seeding and runtime
3. Restart backend service after database update
4. Check backend logs for specific error

Contact me if issue persists after trying these methods.
