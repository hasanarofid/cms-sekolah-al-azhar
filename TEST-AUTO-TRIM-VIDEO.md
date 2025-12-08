# Test Auto-Trim Video - Instruksi Manual Testing

## Prerequisites

### 1. Install Dependencies
```bash
cd /home/hasanarofid/Documents/solkit/proyek/alazhar/react-frontend
npm install
```

### 2. Start Development Servers

#### Terminal 1 - PHP Backend:
```bash
cd /home/hasanarofid/Documents/solkit/proyek/alazhar/php-backend
php -S localhost:8000 -t public
```

#### Terminal 2 - React Frontend:
```bash
cd /home/hasanarofid/Documents/solkit/proyek/alazhar/react-frontend
npm run dev
```

### 3. Login ke Admin Panel
- Buka browser: `http://localhost:5173/admin/login`
- Login dengan credentials admin

## Test Cases

### Test 1: Upload Video Pendek (< 5 detik)
**Expected**: Video tidak dipotong, langsung diupload

1. Buka: `http://localhost:5173/admin/sliders`
2. Klik "Add New Slider" atau "New"
3. Isi form:
   - Title: "Test Video Pendek"
   - Upload gambar (required)
4. Scroll ke bagian "Video File untuk Autoplay Background"
5. Pastikan checkbox "Auto-trim video menjadi 5 detik" **tercentang**
6. Upload video yang durasinya **< 5 detik**

**Expected Result**:
- ✅ Video langsung diupload tanpa processing
- ✅ Tidak muncul progress bar trimming
- ✅ Video tersimpan dengan durasi asli

---

### Test 2: Upload Video Panjang (> 5 detik) dengan Auto-Trim
**Expected**: Video dipotong menjadi 5 detik pertama

1. Buka: `http://localhost:5173/admin/sliders`
2. Klik "Add New Slider"
3. Isi form:
   - Title: "Test Video Panjang Auto-Trim"
   - Upload gambar
4. Pastikan checkbox "Auto-trim video menjadi 5 detik" **tercentang**
5. Upload video yang durasinya **> 5 detik** (misal: 10 detik, 30 detik)

**Expected Result**:
- ✅ Muncul icon gunting (scissors) beranimasi
- ✅ Muncul text "Memotong video menjadi 5 detik..."
- ✅ Progress bar muncul dan bergerak dari 0% → 100%
- ✅ Console browser menunjukkan log:
  ```
  Video lebih dari 5 detik. Memotong video... (Ukuran asli: XX MB)
  Video berhasil dipotong menjadi 5 detik (Ukuran baru: XX MB)
  ```
- ✅ Setelah selesai, video diupload
- ✅ Video preview muncul dengan durasi ~5 detik
- ✅ Durasi tampil: "0:05 (5 detik)"

---

### Test 3: Upload Video Panjang TANPA Auto-Trim
**Expected**: Video diupload utuh tanpa dipotong

1. Buka: `http://localhost:5173/admin/sliders`
2. Klik "Add New Slider"
3. Isi form:
   - Title: "Test Video Tanpa Auto-Trim"
   - Upload gambar
4. **Uncheck** checkbox "Auto-trim video menjadi 5 detik"
5. Upload video yang durasinya **> 5 detik**

**Expected Result**:
- ✅ Video langsung diupload tanpa processing
- ✅ Tidak muncul progress bar trimming
- ✅ Video tersimpan dengan durasi asli
- ✅ Durasi tampil: "0:XX (XX detik)" sesuai durasi asli

---

### Test 4: Edit Slider dengan Video
**Expected**: Bisa hapus dan ganti video

1. Buka: `http://localhost:5173/admin/sliders`
2. Klik "Edit" pada slider yang sudah ada videonya
3. Klik tombol X (close) pada video preview

**Expected Result**:
- ✅ Video terhapus
- ✅ Muncul kembali upload area
- ✅ Bisa upload video baru

---

### Test 5: Multiple Sliders dengan Video
**Expected**: Semua slider bisa punya video masing-masing

1. Buka: `http://localhost:5173/admin/sliders`
2. Tambahkan 3 slider dengan video berbeda:
   - Slider 1: Video 3 detik
   - Slider 2: Video 10 detik (auto-trim ON)
   - Slider 3: Video 15 detik (auto-trim OFF)

**Expected Result**:
- ✅ Semua slider tersimpan
- ✅ Slider 1: Video 3 detik (tidak dipotong)
- ✅ Slider 2: Video 5 detik (dipotong dari 10 detik)
- ✅ Slider 3: Video 15 detik (tidak dipotong karena auto-trim OFF)

---

### Test 6: Video di Page Blocks (Hero Slider)
**Expected**: Fitur sama bekerja di page blocks

1. Buka: `http://localhost:5173/admin/pages`
2. Pilih atau buat page
3. Add block type "Hero Slider"
4. Tambahkan slider dalam block
5. Upload video dengan auto-trim enabled

**Expected Result**:
- ✅ Fitur auto-trim bekerja sama seperti di slider admin
- ✅ Progress bar dan indicator muncul
- ✅ Video dipotong jika > 5 detik

---

### Test 7: Error Handling - Video Corrupt
**Expected**: Error message jelas

1. Upload file video yang corrupt atau rusak

**Expected Result**:
- ✅ Muncul error message: "Gagal memproses video. Pastikan video valid."
- ✅ Upload dibatalkan
- ✅ User bisa coba upload video lain

---

### Test 8: Error Handling - File Terlalu Besar
**Expected**: Error message jelas

1. Upload file video > 50MB

**Expected Result**:
- ✅ Muncul error message: "Ukuran file maksimal 50MB"
- ✅ Upload dibatalkan

---

### Test 9: Performance Test
**Expected**: Tidak freeze browser

1. Upload video 20MB, 30 detik
2. Perhatikan browser responsiveness

**Expected Result**:
- ✅ Browser tetap responsive
- ✅ Progress bar update smooth
- ✅ Bisa scroll halaman saat processing
- ✅ Processing selesai dalam waktu wajar (< 30 detik untuk video 20MB)

---

### Test 10: View di Frontend
**Expected**: Video tampil di homepage

1. Setelah slider tersimpan dengan video
2. Buka homepage: `http://localhost:5173/`
3. Lihat hero slider

**Expected Result**:
- ✅ Video autoplay sebagai background
- ✅ Video muted
- ✅ Video loop
- ✅ Loading smooth tanpa lag

## Sample Test Videos

### Download Sample Videos:
```bash
# Small video (3 seconds, ~1MB)
wget https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4 -O test-3s.mp4

# Medium video (10 seconds, ~5MB)
wget https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_5MB.mp4 -O test-10s.mp4

# Large video (30 seconds, ~15MB)
wget https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_10MB.mp4 -O test-30s.mp4
```

Atau gunakan video sendiri:
- Format: MP4 (H.264)
- Resolusi: 1920x1080 recommended
- FPS: 30fps atau 60fps
- Max size: 50MB

## Console Monitoring

### Browser Console (F12):
Saat upload video, perhatikan log:
```javascript
// Success case:
Video lebih dari 5 detik. Memotong video... (Ukuran asli: 15.2 MB)
Video berhasil dipotong menjadi 5 detik (Ukuran baru: 2.8 MB)

// Skip trim case:
Video 3 detik, tidak perlu dipotong
```

### Network Tab:
- Upload request ke `/api/admin/upload`
- Method: POST
- Content-Type: multipart/form-data
- Payload: file + metadata

## Debugging

### Jika Progress Stuck:
1. Open browser console (F12)
2. Check for errors
3. Reload page
4. Try with different video format (MP4)

### Jika FFmpeg.wasm Tidak Load:
1. Check internet connection (FFmpeg.wasm load from CDN)
2. Check browser console for CORS errors
3. Try different browser (Chrome/Firefox recommended)

### Jika Video Tidak Muncul di Frontend:
1. Check file path di database/storage
2. Check permissions folder `php-backend/public/uploads/sliders/`
3. Check video URL di inspector

## Checklist Final

- [ ] FFmpeg.wasm library terinstall
- [ ] Frontend dev server running (port 5173)
- [ ] Backend dev server running (port 8000)
- [ ] Login admin berhasil
- [ ] Test 1-10 semua passed
- [ ] No console errors
- [ ] Video tampil di frontend
- [ ] Auto-trim bekerja (video > 5s dipotong)
- [ ] Toggle auto-trim bekerja
- [ ] Progress indicator muncul
- [ ] File size reduction terlihat di console

## Report Bugs

Jika menemukan bug, catat:
1. Test case mana yang gagal
2. Screenshot error
3. Console log (F12)
4. Browser dan version
5. Video yang diupload (ukuran, durasi, format)

Simpan di file `BUG-REPORT-AUTO-TRIM.md`

