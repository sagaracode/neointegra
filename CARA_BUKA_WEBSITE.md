# 🌐 Cara Melihat Website

## ✅ Status Aplikasi Saat Ini

✅ **Backend:** Running di `http://localhost:8000`  
✅ **Frontend:** Running di `http://localhost:3000`  

---

## 📱 3 Cara Membuka Website:

### **Cara 1: Browser Otomatis** (Sudah dibuka)
Browser default Anda seharusnya sudah terbuka otomatis dengan URL: `http://localhost:3000`

### **Cara 2: Manual di Browser**
1. Buka browser favorit Anda (Chrome, Firefox, Edge, dll)
2. Ketik di address bar: `http://localhost:3000`
3. Tekan Enter

### **Cara 3: VS Code Simple Browser**
1. Lihat di panel sebelah kanan VS Code
2. Seharusnya ada tab "Simple Browser" yang terbuka
3. Jika tidak ada, tekan `Ctrl+Shift+P`
4. Ketik "Simple Browser"
5. Pilih "Simple Browser: Show"
6. Masukkan URL: `http://localhost:3000`

---

## 🔍 Troubleshooting

### Jika Website Tidak Muncul:

#### 1️⃣ **Cek Server Masih Running**
Lihat di terminal VS Code, seharusnya ada output:
```
VITE v5.4.21  ready in 638 ms
➜  Local:   http://localhost:3000/
```

#### 2️⃣ **Cek Port Tidak Dipakai**
Jalankan di PowerShell:
```powershell
netstat -ano | findstr :3000
```
Jika ada output, port sedang dipakai. Restart frontend.

#### 3️⃣ **Restart Frontend**
Di terminal frontend:
- Tekan `Ctrl+C` untuk stop
- Jalankan lagi: `npm run dev`

#### 4️⃣ **Clear Browser Cache**
- Tekan `Ctrl+Shift+R` (hard refresh)
- Atau `Ctrl+F5`

---

## 📸 Apa yang Seharusnya Anda Lihat?

Ketika website terbuka, Anda akan melihat:

### **Homepage (Halaman Utama)**
- ✨ Header dengan logo "NeoIntegraTech"
- 🧭 Navigation menu: Home, About, Services, Contact
- 🎨 Hero section dengan animasi
- 📦 Services showcase
- 📞 Call-to-action buttons
- 🌈 Background gradient modern (purple/blue)

### **Menu Navigasi:**
- **Home** - Halaman utama
- **About** - Tentang perusahaan
- **Services** - Layanan yang ditawarkan
- **Contact** - Hubungi kami
- **Login** - Masuk akun
- **Register** - Daftar akun

---

## 🎯 Quick Test

Buka PowerShell dan jalankan:
```powershell
# Test backend
Invoke-WebRequest http://localhost:8000

# Test frontend  
Invoke-WebRequest http://localhost:3000
```

Keduanya harus return **200 OK**

---

## 📊 Halaman yang Tersedia

| URL | Halaman |
|-----|---------|
| http://localhost:3000/ | Homepage |
| http://localhost:3000/about | About Us |
| http://localhost:3000/services | Services |
| http://localhost:3000/contact | Contact |
| http://localhost:3000/login | Login |
| http://localhost:3000/register | Register |
| http://localhost:3000/dashboard | Dashboard (need login) |

---

## 💡 Cara Cepat Test

1. **Buka Terminal PowerShell**
2. **Ketik:**
   ```powershell
   start http://localhost:3000
   ```
3. **Browser akan terbuka otomatis**

---

## ⚙️ Jika Masih Bermasalah

### Restart Semua:

**Stop Backend:**
- Ke terminal backend (yang menjalankan uvicorn)
- Tekan `Ctrl+C`

**Stop Frontend:**
- Ke terminal frontend (yang menjalankan npm run dev)
- Tekan `Ctrl+C`

**Start Lagi:**
```powershell
# Terminal 1 - Backend
cd D:\WEBSITES\backend
D:/WEBSITES/backend/venv_new/Scripts/python.exe -m uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd D:\WEBSITES\frontend
npm run dev
```

**Tunggu sampai muncul:**
- Backend: `Application startup complete`
- Frontend: `Local: http://localhost:3000/`

**Buka browser:** `http://localhost:3000`

---

## 📞 Masih Tidak Bisa?

Screenshot error yang muncul dan beritahu saya:
1. Apa yang tampil di browser?
2. Error apa di Console browser? (tekan F12)
3. Error apa di Terminal VS Code?

Saya akan bantu troubleshoot lebih lanjut! 🚀
