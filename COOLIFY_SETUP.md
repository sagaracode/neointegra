# COOLIFY DEPLOYMENT SETUP - PERSISTENT DATABASE

## 🚨 MASALAH KRITIS
Database SQLite di-reset setiap deployment karena tidak menggunakan persistent volume!

## ✅ SOLUSI - SETUP PERSISTENT VOLUME DI COOLIFY

### LANGKAH 1: Setup Volume di Coolify Dashboard

1. **Login ke Coolify Dashboard**
   - URL: (sesuai dengan server Coolify Anda)

2. **Buka Project neointegra-backend**
   - Klik pada service backend

3. **Tambahkan Persistent Volume**
   - Pergi ke tab **"Storages"** atau **"Volumes"**
   - Klik **"Add Storage"**
   
4. **Konfigurasi Volume:**
   ```
   Name: neointegra-database
   Mount Path: /app/data
   Type: Volume (persistent)
   ```
   
   **PENTING**: Path `/app/data` harus sama dengan path di Dockerfile!

### LANGKAH 2: Environment Variables di Coolify

Pastikan environment variable sudah di-set:
```bash
DATABASE_URL=sqlite:////app/data/neointegratech.db
```

**CATATAN**: 
- 4 slash (`////`) untuk absolute path di SQLite
- Path harus `/app/data/neointegratech.db`

### LANGKAH 3: Backup Database Production SEKARANG!

**SEBELUM REDEPLOY**, backup database production:

#### Option A: Via SSH ke Server Coolify
```bash
# SSH ke server
ssh user@your-coolify-server

# Find container
docker ps | grep neointegra-backend

# Copy database keluar dari container
docker cp <container_id>:/app/neointegratech.db ./backup_neointegra_$(date +%Y%m%d_%H%M%S).db

# Download ke local
scp user@your-coolify-server:~/backup_*.db ./
```

#### Option B: Via Coolify Terminal
1. Buka Coolify Dashboard
2. Klik service backend
3. Buka **Terminal**
4. Jalankan:
   ```bash
   ls -la /app/*.db
   cat /app/neointegratech.db > /tmp/backup.db
   ```
5. Download file backup

### LANGKAH 4: Restore Database (Jika Perlu)

Jika database sudah ter-reset:

```bash
# SSH ke server
ssh user@your-coolify-server

# Copy backup ke container
docker cp ./backup_neointegra_XXXXXX.db <container_id>:/app/data/neointegratech.db

# Atau mount langsung ke volume
docker volume ls  # List volumes
docker run --rm -v <volume_name>:/data -v $(pwd):/backup alpine cp /backup/backup_neointegra_XXXXXX.db /data/neointegratech.db
```

### LANGKAH 5: Verify Setup

Setelah deployment dengan volume:

1. **Check database persist:**
   ```bash
   # SSH ke server
   ssh user@your-coolify-server
   
   # Check volume
   docker volume inspect <volume_name>
   
   # Check database in container
   docker exec <container_id> ls -la /app/data/
   ```

2. **Test dengan membuat order baru:**
   - Buat test order
   - Trigger redeploy
   - Check apakah order masih ada

## 🎯 ALTERNATIVE: MIGRATE KE POSTGRESQL

Untuk production yang lebih robust, **SANGAT DISARANKAN** migrate ke PostgreSQL:

### Setup PostgreSQL di Coolify:

1. **Add PostgreSQL Service**
   - Di Coolify Dashboard, klik "Add Service"
   - Pilih "PostgreSQL"
   - Set name: `neointegra-postgres`

2. **Copy Database Credentials**
   ```bash
   POSTGRES_USER=neointegra
   POSTGRES_PASSWORD=<generated_password>
   POSTGRES_DB=neointegra
   DATABASE_URL=postgresql://neointegra:<password>@postgres:5432/neointegra
   ```

3. **Update Backend Environment Variables**
   - Set `DATABASE_URL` ke PostgreSQL connection string
   - Coolify akan auto-restart backend

4. **Install PostgreSQL Driver**
   Update `requirements.txt`:
   ```txt
   psycopg2-binary==2.9.9
   ```

5. **Redeploy**
   - Push ke GitHub
   - Coolify auto-deploy
   - Database akan persistent di PostgreSQL service

## 📊 MIGRATION SCRIPT

Jika perlu migrate dari SQLite ke PostgreSQL:

```python
# migrate_sqlite_to_postgres.py
import sqlite3
import psycopg2
from datetime import datetime

# SQLite backup
sqlite_conn = sqlite3.connect('./backup_neointegra.db')
sqlite_cur = sqlite_conn.cursor()

# PostgreSQL
pg_conn = psycopg2.connect("postgresql://user:pass@host:5432/db")
pg_cur = pg_conn.cursor()

# Migrate tables one by one
tables = ['users', 'services', 'orders', 'payments', 'subscriptions']

for table in tables:
    # Get data from SQLite
    sqlite_cur.execute(f"SELECT * FROM {table}")
    rows = sqlite_cur.fetchall()
    
    # Insert to PostgreSQL
    for row in rows:
        placeholders = ','.join(['%s'] * len(row))
        pg_cur.execute(f"INSERT INTO {table} VALUES ({placeholders})", row)

pg_conn.commit()
print("Migration completed!")
```

## ⚠️ CURRENT STATUS

- ✅ Dockerfile updated dengan database path ke `/app/data/`
- ⏳ **PERLU SETUP VOLUME DI COOLIFY** (URGENT!)
- ⏳ Backup database production (jika ada data penting)
- ⏳ Redeploy dengan persistent volume
- 🔄 Consider migrate ke PostgreSQL untuk long-term

## 🚀 NEXT ACTIONS (PRIORITAS TINGGI)

1. **SEKARANG**: Setup persistent volume di Coolify
2. **SEBELUM REDEPLOY**: Backup database production current
3. **REDEPLOY**: Push code, auto-deploy dengan volume
4. **VERIFY**: Test database persist setelah redeploy
5. **PLAN**: Schedule migration ke PostgreSQL

## 📞 SUPPORT

Jika butuh bantuan setup Coolify volume:
- Coolify Docs: https://coolify.io/docs
- Discord: https://discord.gg/coolify
- Atau share akses Coolify dashboard untuk bantuan langsung
