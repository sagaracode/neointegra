# Quick Start - SEO Performance Feature

## 🚀 Cara Cepat Testing Fitur

### 1. Start Development Server

```bash
cd d:/WEBSITES/frontend
npm run dev
```

### 2. Login dengan Akun Khusus

**URL**: `http://localhost:5173/login`

**Credentials**:
```
Email: web@rsppn.co.id
Password: [sesuai database]
```

### 3. Akses Dashboard

Setelah login, Anda akan melihat:
- Dashboard Home dengan tombol **SEO Performance** yang mencolok
- Tombol berwarna gradasi purple-pink-red dengan icon roket 🚀
- Mini stats: Traffic Growth, Keywords, Health Score

### 4. Klik Tombol "Lihat SEO Report Bulanan"

Akan redirect ke: `/dashboard/seo/rsppn-analytics`

---

## 📊 Fitur yang Bisa Dicoba

### ✅ Grafik Interaktif
1. **Hover** pada grafik untuk melihat tooltip
2. **Traffic Timeline**: Area chart dengan gradasi purple
3. **Health Score**: Line chart hijau (0-100)
4. **Keyword Position**: Line chart orange (reversed Y-axis)

### ✅ Kelola Kata Kunci
1. **Tambah**: Klik tombol `+` → Ketik keyword → Enter/Simpan
2. **Cari**: Gunakan search bar untuk filter real-time
3. **Hapus**: Klik icon `X` merah di setiap keyword

### ✅ Lihat Data Bulanan
- Scroll ke bawah untuk melihat **Focus Keywords Per Bulan**
- Setiap bulan punya 5 kata kunci prioritas
- Badge menunjukkan perubahan traffic (+/- %)

---

## 🔍 Testing Checklist

- [ ] Tombol SEO **tidak** muncul untuk user lain (coba login dengan email berbeda)
- [ ] Tombol **muncul** untuk `web@rsppn.co.id`
- [ ] Klik tombol redirect ke `/dashboard/seo/rsppn-analytics`
- [ ] 3 grafik ter-render tanpa error
- [ ] Tambah keyword berhasil dengan toast notification
- [ ] Search keyword bekerja real-time
- [ ] Hapus keyword dengan konfirmasi
- [ ] Responsive di mobile (resize browser)
- [ ] Animasi smooth tanpa lag

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'recharts'"
```bash
cd d:/WEBSITES/frontend
npm install recharts
```

### Tombol tidak muncul
- Pastikan login sebagai `web@rsppn.co.id`
- Check console untuk error authentication
- Refresh browser (Ctrl + R)

### Grafik tidak muncul
- Check data di `src/data/seoData.json`
- Lihat console untuk error React
- Pastikan recharts ter-install

---

## 📱 Preview URLs

- **Dashboard Home**: `http://localhost:5173/dashboard`
- **SEO Analytics**: `http://localhost:5173/dashboard/seo/rsppn-analytics`

---

## 🎨 Visual Preview

### Tombol di Dashboard:
```
┌─────────────────────────────────────────────┐
│  🚀  SEO Performance                        │
│      Analitik & Laporan SEO Bulanan         │
│                                              │
│  ┌──────┐  ┌──────┐  ┌──────┐              │
│  │+896% │  │ 75+  │  │95/100│              │
│  │GROWTH│  │KEYWORDS│ │HEALTH│              │
│  └──────┘  └──────┘  └──────┘              │
│                                              │
│  [Lihat SEO Report Bulanan →]              │
└─────────────────────────────────────────────┘
```

### Halaman SEO Analytics:
```
┌─────────────────────────────────────────────┐
│  🚀  SEO Report Bulanan                     │
│      Analitik SEO untuk rsppn.co.id         │
├─────────────────────────────────────────────┤
│  [Summary Cards: 3 items]                   │
├─────────────────────────────────────────────┤
│  📈 Traffic Organik Timeline                │
│  [Area Chart]                               │
├─────────────────────────────────────────────┤
│  📊 Health Score  │  📊 Keyword Position    │
│  [Line Chart]      │  [Line Chart]          │
├─────────────────────────────────────────────┤
│  🔍 Daftar Kata Kunci SEO         [+ Tambah]│
│  [Search Bar]                               │
│  [Scrollable Table: 75+ keywords]           │
├─────────────────────────────────────────────┤
│  📅 Fokus Kata Kunci Per Bulan              │
│  [Grid of 13 month cards]                   │
└─────────────────────────────────────────────┘
```

---

## ✨ Tips Penggunaan

1. **Scroll untuk Explore**: Halaman panjang dengan banyak data
2. **Hover untuk Detail**: Grafik punya tooltip interaktif
3. **Gunakan Search**: Cari keyword spesifik dari 75+ data
4. **Tambah Keyword Sendiri**: Eksperimen dengan kata kunci baru
5. **Perhatikan Trend**: Lihat bagaimana traffic naik 896% dalam 1 tahun!

---

## 📞 Need Help?

Lihat dokumentasi lengkap di: `SEO_PERFORMANCE_FEATURE.md`

**Happy Testing! 🚀**
