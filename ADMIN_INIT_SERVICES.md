# Admin Endpoint - Initialize Services

## Problem
Services tidak ditemukan di production karena database belum ter-seed dengan data services.

Error yang muncul:
- `Service dengan slug 'website' tidak ditemukan`
- `Service dengan slug 'mail-server' tidak ditemukan`
- `Service dengan slug 'seo' tidak ditemukan`
- `Service dengan slug 'cloudflare' tidak ditemukan`
- `Service dengan slug 'all-in' tidak ditemukan`

## Solution
Endpoint admin untuk initialize/update services di production.

## Usage

### 1. Setelah Deploy ke Coolify

Panggil endpoint ini dari browser atau Postman:

```
POST https://api.neointegratech.com/api/admin/init-services
```

Atau gunakan curl:

```bash
curl -X POST https://api.neointegratech.com/api/admin/init-services
```

### 2. Response

Jika berhasil:
```json
{
  "message": "Services initialized successfully! Created: 5, Updated: 0"
}
```

### 3. Services yang Di-initialize

Endpoint ini akan membuat/update 5 services:

1. **Paket All In Service** (slug: `all-in`) - Rp 81.000.000/tahun
2. **Website Service** (slug: `website`) - Rp 36.000.000/tahun
3. **SEO Service** (slug: `seo`) - Rp 42.000.000/tahun
4. **Mail Server Service** (slug: `mail-server`) - Rp 15.000.000/tahun
5. **Cloudflare Service** (slug: `cloudflare`) - Rp 24.000.000/tahun

## Important Notes

- Endpoint ini bisa dipanggil berkali-kali (idempotent)
- Jika service sudah ada, akan di-update dengan data terbaru
- Tidak perlu authentication (public endpoint untuk keperluan deployment)
- Setelah services ter-initialize, checkout akan berfungsi normal

## Next Steps

1. Deploy backend ke Coolify
2. Tunggu deploy selesai
3. Panggil endpoint: `POST https://api.neointegratech.com/api/admin/init-services`
4. Verifikasi services dengan: `GET https://api.neointegratech.com/api/services/`
5. Coba checkout lagi - seharusnya sudah bisa!
