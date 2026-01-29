# Test Backend Endpoints Production

## Cek apakah backend sudah ter-deploy dengan benar

### 1. Health Check
```bash
curl https://api.neointegratech.com/
```
**Expected response:**
```json
{
  "status": "online",
  "app": "NeoIntegra Tech API",
  "version": "1.0.0",
  "timestamp": "2026-01-29T...",
  "cors": "enabled"
}
```

### 2. Test Services Endpoint
```bash
curl https://api.neointegratech.com/api/services/
```
**Expected:** List of 5 services (all-in, website, seo, mail-server, cloudflare)

### 3. Test Orders Endpoint (dengan auth)
```bash
curl -X POST https://api.neointegratech.com/api/orders/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"service_slug":"website","quantity":1,"notes":"Test order"}'
```
**Expected jika tidak auth:** 401 Unauthorized  
**Expected jika auth:** Order created atau service tidak ditemukan

### 4. Cek Admin Init Services
```bash
curl https://api.neointegratech.com/api/admin/init-services
```
**Expected:** Services initialized successfully

---

## Diagnosis Error 404 pada /api/orders/

Error yang terjadi:
```
POST https://api.neointegratech.com/api/orders/ 404 (Not Found)
```

### Kemungkinan Penyebab:

1. **Backend belum di-deploy ulang** ✅ PALING MUNGKIN
   - Setelah push kode terbaru, backend di Coolify harus di-deploy ulang
   - Cek Coolify dashboard → Lihat status deployment
   - Pastikan deployment sukses tanpa error

2. **Prefix routing salah**
   - Cek apakah endpoint seharusnya `/api/orders/` atau `/orders/`
   - Test: `curl https://api.neointegratech.com/orders/` (tanpa /api)

3. **CORS atau middleware blocking**
   - Sudah di-handle dengan `allow_origins=["*"]`

### Solusi:

1. **Pastikan backend di-deploy ulang di Coolify**
2. **Test health check endpoint** untuk memastikan backend online
3. **Test services endpoint** untuk memastikan routing bekerja
4. **Initialize services** dengan admin endpoint
5. **Test orders endpoint** dengan token yang valid

### Langkah Debugging:

1. Buka: `https://api.neointegratech.com/`
   - Jika tidak ada response → Backend tidak running
   
2. Buka: `https://api.neointegratech.com/api/services/`
   - Jika 404 → Routing bermasalah
   - Jika empty array → Services belum di-initialize
   
3. Check Coolify deployment logs untuk error

