# Quick Start: Fitur Auto-Trim Video Hero Slider

## 🚀 Langkah Cepat

### 1. Start Development Servers

```bash
# Terminal 1 - Backend
cd /home/hasanarofid/Documents/solkit/proyek/alazhar/php-backend
php -S localhost:8000 -t public

# Terminal 2 - Frontend
cd /home/hasanarofid/Documents/solkit/proyek/alazhar/react-frontend
npm run dev
```

### 2. Akses Admin Panel

1. Buka: http://localhost:5173/admin/login
2. Login dengan credentials admin
3. Buka: http://localhost:5173/admin/sliders

### 3. Upload Video dengan Auto-Trim

1. Klik **"Add New Slider"** atau **"New"**
2. Isi form:
   - **Title**: Masukkan judul slider
   - **Image**: Upload gambar (wajib)
3. Scroll ke bagian **"Video File untuk Autoplay Background"**
4. Pastikan checkbox ✅ **"Auto-trim video menjadi 5 detik"** tercentang
5. Klik area upload atau drag & drop video
6. **Jika video > 5 detik:**
   - Akan muncul progress bar
   - Video otomatis dipotong jadi 5 detik
   - Lihat console untuk detail proses
7. Klik **"Simpan"**

### 4. Lihat Hasil

- Buka homepage: http://localhost:5173/
- Video akan autoplay sebagai background slider
- Durasi video maksimal 5 detik

---

## ⚙️ Opsi Konfigurasi

### Disable Auto-Trim
Jika ingin upload video utuh tanpa dipotong:
1. **Uncheck** ☐ "Auto-trim video menjadi 5 detik"
2. Upload video seperti biasa
3. Video akan tersimpan dengan durasi asli

### Custom Durasi (Advanced)
Edit file `SliderForm.tsx` atau `PageBlocksManager.tsx`:
```typescript
// Ganti nilai default 5 detik ke durasi lain
const needsTrim = await shouldTrimVideo(file, 10) // 10 detik
const trimmedBlob = await trimVideo(file, 10, ...) // 10 detik
```

---

## 📊 Progress Indicator

Saat video sedang diproses:
- ✂️ Icon gunting beranimasi
- 📊 Progress bar 0-100%
- 📝 Text: "Memotong video menjadi 5 detik..."

---

## 🎯 Tips

1. **Format Video Terbaik**: MP4 (H.264)
2. **Resolusi Recommended**: 1920x1080 (Full HD)
3. **Ukuran Maksimal**: 50MB (sebelum trim)
4. **Durasi Ideal**: 5-10 detik untuk input (akan dipotong jadi 5 detik)

---

## 🐛 Troubleshooting

### Video Tidak Diproses
- Pastikan internet stabil (FFmpeg.wasm load dari CDN)
- Coba refresh browser
- Clear cache browser

### Error "Gagal memproses video"
- Coba format video lain (gunakan MP4)
- Compress video jika terlalu besar
- Cek console browser (F12) untuk detail error

### Progress Stuck di 0%
- Video mungkin terlalu besar (>50MB)
- Format video tidak didukung
- Coba dengan video lain

---

## 📚 Dokumentasi Lengkap

Untuk dokumentasi detail dan testing, lihat:
- **Fitur Lengkap**: `FITUR-AUTO-TRIM-VIDEO.md`
- **Test Manual**: `TEST-AUTO-TRIM-VIDEO.md`

---

## ✅ Verifikasi

Pastikan fitur bekerja dengan cek:
- [ ] Upload video < 5 detik → Tidak dipotong
- [ ] Upload video > 5 detik → Otomatis dipotong jadi 5 detik
- [ ] Progress bar muncul dan berjalan
- [ ] Video tampil di homepage dengan autoplay
- [ ] Toggle auto-trim berfungsi

---

## 🔥 Demo Video

1. Siapkan video berdurasi 10-30 detik
2. Upload di admin slider
3. Lihat progress trimming
4. Video otomatis jadi 5 detik
5. Cek di homepage - video autoplay!

**Selesai!** 🎉

