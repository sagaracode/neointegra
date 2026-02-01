#!/usr/bin/env python3
"""
Quick check untuk web@rsppn.co.id UI issue
"""
from app.database import SessionLocal
from app.models import User, Order, Subscription
from sqlalchemy import desc

db = SessionLocal()

print("="*70)
print("🔍 DEBUGGING TOMBOL PERPANJANG UNTUK web@rsppn.co.id")
print("="*70)
print()

# Cek user
user = db.query(User).filter(User.email == 'web@rsppn.co.id').first()
if not user:
    print('❌ FATAL: User web@rsppn.co.id TIDAK DITEMUKAN!')
    print('   Jalankan: python3 setup_rsppn_complete.py')
    exit(1)

print(f'✅ User Found')
print(f'   Email: {user.email}')
print(f'   ID: {user.id}')
print(f'   Name: {user.full_name}')
print(f'   Admin: {user.is_admin}')
print()

# Cek orders
orders = db.query(Order).filter(Order.user_id == user.id).order_by(desc(Order.created_at)).all()
print(f'📦 Orders: {len(orders)} order(s)')
if len(orders) == 0:
    print('   ❌ TIDAK ADA ORDER!')
    print('   Solusi: Jalankan python3 setup_rsppn_complete.py')
else:
    for idx, o in enumerate(orders, 1):
        print(f'   {idx}. Order: {o.order_number}')
        print(f'      Status: {o.status}')
        print(f'      Amount: Rp {o.amount:,}')
        print(f'      Subscription ID: {o.subscription_id}')
        print(f'      Created: {o.created_at}')
print()

# Cek subscriptions  
subs = db.query(Subscription).filter(Subscription.user_id == user.id).all()
print(f'📅 Subscriptions: {len(subs)} subscription(s)')
if len(subs) == 0:
    print('   ❌ TIDAK ADA SUBSCRIPTION!')
    print('   Solusi: Jalankan python3 setup_rsppn_complete.py')
else:
    for idx, s in enumerate(subs, 1):
        print(f'   {idx}. Subscription ID: {s.id}')
        print(f'      Package: {s.package_name}')
        print(f'      Status: {s.status}')
        print(f'      Start: {s.start_date}')
        print(f'      End: {s.end_date}')
        
        # Cek berapa hari lagi expired
        from datetime import datetime
        days_left = (s.end_date - datetime.now()).days
        print(f'      Days left: {days_left} hari')
print()

# Analisis UI - Kondisi tombol muncul
print("="*70)
print("🎯 ANALISIS KONDISI TOMBOL 'PERPANJANG SEKARANG'")
print("="*70)
print()

print("Frontend Dashboard.jsx kondisi tombol:")
print("  {(order.status === 'completed' || order.status === 'paid') && subscription && (")
print("    <button>🔄 Perpanjang Sekarang</button>")
print("  )}")
print()

# Cek kondisi 1: Order status
has_valid_order = False
if len(orders) > 0:
    for o in orders:
        if o.status in ['completed', 'paid']:
            print(f'✅ Kondisi 1: Order status = "{o.status}" ✓')
            has_valid_order = True
            break
    if not has_valid_order:
        print(f'❌ Kondisi 1: Order status = "{orders[0].status}" ✗')
        print(f'   Expected: "completed" atau "paid"')
        print(f'   Got: "{orders[0].status}"')
else:
    print('❌ Kondisi 1: Tidak ada order ✗')

# Cek kondisi 2: Subscription exists
if len(subs) > 0:
    print(f'✅ Kondisi 2: Subscription exists = TRUE ✓')
else:
    print(f'❌ Kondisi 2: Subscription exists = FALSE ✗')
    print(f'   Frontend tidak akan load subscription dari API')

print()

# Kesimpulan
print("="*70)
print("📊 KESIMPULAN")
print("="*70)
print()

if has_valid_order and len(subs) > 0:
    print("✅ SEMUA KONDISI TERPENUHI!")
    print()
    print("Tombol SEHARUSNYA MUNCUL di:")
    print("  1. Dashboard → Pesanan Saya")
    print("  2. Card order dengan status 'completed' atau 'paid'")
    print()
    print("⚠️  JIKA TOMBOL TIDAK MUNCUL, kemungkinan masalah:")
    print()
    print("  1. 🌐 Frontend belum ter-deploy")
    print("     Solusi: cd frontend && npm run dev")
    print()
    print("  2. 🔄 Browser cache")
    print("     Solusi: Hard refresh (Cmd+Shift+R) atau Clear cache")
    print()
    print("  3. 📡 API tidak ter-call")
    print("     Check: Network tab di browser dev tools")
    print("     Cek apakah GET /api/subscriptions/my-subscriptions dipanggil")
    print()
    print("  4. ⚠️  React state tidak update")
    print("     Check: Console log di browser")
    print("     Pastikan loadSubscription() dipanggil di useEffect()")
    print()
else:
    print("❌ KONDISI BELUM TERPENUHI")
    print()
    if not has_valid_order:
        print("  • Order status harus 'completed' atau 'paid'")
    if len(subs) == 0:
        print("  • Subscription harus ada")
    print()
    print("🔧 SOLUSI:")
    print("   python3 setup_rsppn_complete.py")
    print()

db.close()
