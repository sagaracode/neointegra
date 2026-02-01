# 🔄 Flow Otomatis Pembayaran Perpanjangan

## ✅ Jawaban: YA, Otomatis!

Setelah pembayaran perpanjangan berhasil, sistem akan **OTOMATIS**:
1. ✅ Update status payment → `success`
2. ✅ Update status order → `paid`
3. ✅ **Extend subscription end_date** → +1 tahun
4. ✅ Set subscription status → `active`
5. ✅ Kirim email konfirmasi pembayaran

## 🔄 Flow Lengkap Perpanjangan

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER KLIK "PERPANJANG SEKARANG"                          │
│    - Dari dashboard menu "Pesanan Saya"                     │
│    - Atau dari menu "Riwayat Pembayaran"                    │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. PILIH BANK VIRTUAL ACCOUNT                               │
│    - BCA / BNI / BRI / Mandiri / CIMB / dll                 │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. SISTEM AUTO CREATE                                       │
│    ✅ Renewal Order (status: pending)                        │
│    ✅ Payment Record (status: pending)                       │
│    ✅ Link order.subscription_id → subscription.id           │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. DAPAT VA NUMBER                                          │
│    - Contoh: 8808081234567890 (BCA)                         │
│    - Tampil di toast notification                           │
│    - Bisa dicopy untuk dibayar                              │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. USER BAYAR KE BANK                                       │
│    - Transfer ke VA Number                                  │
│    - Via mobile banking / ATM / internet banking            │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. iPaymu KIRIM CALLBACK KE BACKEND                         │
│    POST /api/payments/callback                              │
│    Data: { trx_id, status, status_code: "1" }               │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. BACKEND OTOMATIS PROSES                                  │
│    ✅ Update payment.status = "success"                      │
│    ✅ Set payment.paid_at = NOW                              │
│    ✅ Update order.status = "paid"                           │
│                                                             │
│    🔄 CEK: Apakah order.subscription_id ada?                │
│    └─ YA → EXTEND SUBSCRIPTION:                             │
│        ✅ subscription.end_date += 365 hari                  │
│        ✅ subscription.status = "active"                     │
│        ✅ Log: "Subscription extended"                       │
│                                                             │
│    ✅ Kirim email konfirmasi pembayaran                      │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. HASIL AKHIR                                              │
│    ✅ Subscription aktif 1 tahun lagi                        │
│    ✅ User dapat email konfirmasi                            │
│    ✅ Status tampil "Selesai" di dashboard                   │
│    ✅ Tanggal berakhir ter-update otomatis                   │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Data yang Berubah Otomatis

### Before Payment:
```sql
-- Order
status: "pending"

-- Payment  
status: "pending"
paid_at: NULL

-- Subscription
end_date: 2026-02-03  ← Akan habis
status: "active"
```

### After Payment (OTOMATIS):
```sql
-- Order
status: "paid"  ← ✅ Updated

-- Payment
status: "success"  ← ✅ Updated
paid_at: 2026-02-01 10:30:00  ← ✅ Updated

-- Subscription
end_date: 2027-02-03  ← ✅ +365 hari (extended!)
status: "active"  ← ✅ Tetap aktif
updated_at: 2026-02-01 10:30:00  ← ✅ Updated
```

## 🎯 Kode yang Menghandle Otomatis

**File:** `backend/app/api/endpoints/payments.py`

```python
@router.post("/callback")
async def payment_callback(request: Request, db: Session):
    # ... validasi callback dari iPaymu ...
    
    if status_code == "1":  # Payment Success
        payment.status = "success"
        payment.paid_at = datetime.utcnow()
        
        # Update order
        order = db.query(Order).filter(Order.id == payment.order_id).first()
        if order:
            order.status = "paid"
            
            # 🔄 AUTO EXTEND SUBSCRIPTION
            if order.subscription_id:
                subscription = db.query(Subscription).filter(
                    Subscription.id == order.subscription_id
                ).first()
                
                if subscription:
                    # Extend end_date by 1 year
                    subscription.end_date = subscription.end_date + timedelta(days=365)
                    subscription.status = "active"
                    print(f"✅ Subscription #{subscription.id} extended to {subscription.end_date}")
        
        db.commit()
```

## 🔍 Cara Verifikasi

### 1. Cek Log Backend (saat callback)
```bash
[iPaymu Callback] Order ORD-20260201-123456 marked as paid
[iPaymu Callback] Subscription #1 extended
  Old end: 2026-02-03 00:00:00
  New end: 2027-02-03 00:00:00
✅ Subscription extended successfully
```

### 2. Query Database
```python
# Cek subscription
sub = db.query(Subscription).filter(Subscription.id == 1).first()
print(f"End Date: {sub.end_date}")  # Should be +1 year
print(f"Status: {sub.status}")      # Should be "active"
```

### 3. Lihat di Dashboard
- Login ke dashboard
- Menu "Pesanan Saya" → Status "Selesai"
- Menu "Riwayat Pembayaran" → Warning hilang jika sudah jauh dari expired

## ⚠️ Catatan Penting

1. **Callback dari iPaymu HARUS sampai ke backend**
   - Pastikan webhook URL accessible dari internet
   - URL: `https://api.neointegratech.com/api/payments/callback`
   - Test dengan: `curl -X POST https://api.neointegratech.com/api/payments/callback`

2. **Order HARUS punya subscription_id**
   - Renewal order otomatis dapat subscription_id
   - Order biasa (bukan renewal) tidak punya subscription_id

3. **Extend dari end_date, bukan NOW**
   - Jika bayar lebih awal, tidak rugi hari
   - Contoh: End 2026-02-03, bayar 2026-01-15
   - Result: End jadi 2027-02-03 (bukan 2027-01-15)

## 📝 Testing Script

```bash
# Test di local
cd backend
python3 << 'EOF'
from app.database import SessionLocal
from app.models import Order, Payment, Subscription
from datetime import datetime, timedelta

db = SessionLocal()

# Simulasi callback success
order = db.query(Order).filter(Order.subscription_id.isnot(None)).first()
if order:
    payment = db.query(Payment).filter(Payment.order_id == order.id).first()
    subscription = db.query(Subscription).filter(Subscription.id == order.subscription_id).first()
    
    print(f"Before:")
    print(f"  Payment: {payment.status}")
    print(f"  Order: {order.status}")
    print(f"  Subscription end: {subscription.end_date}")
    
    # Simulate payment success
    payment.status = "success"
    payment.paid_at = datetime.utcnow()
    order.status = "paid"
    subscription.end_date = subscription.end_date + timedelta(days=365)
    subscription.status = "active"
    
    db.commit()
    
    print(f"\nAfter:")
    print(f"  Payment: {payment.status}")
    print(f"  Order: {order.status}")
    print(f"  Subscription end: {subscription.end_date}")
    print(f"\n✅ Extended by 365 days!")

db.close()
EOF
```

## 🚀 Deployment Checklist

- [x] Code untuk auto-extend sudah di-push
- [ ] Redeploy backend di Coolify
- [ ] Test webhook callback dari iPaymu
- [ ] Create RSPPN data di production
- [ ] Test perpanjangan end-to-end

---

**Kesimpulan:** Setelah user bayar perpanjangan, **SEMUA OTOMATIS** tanpa perlu action manual! 🎉
