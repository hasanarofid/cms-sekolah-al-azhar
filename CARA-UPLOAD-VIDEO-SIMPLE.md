# 🎬 Cara Upload Video Hero Slider (Simple & Reliable)

## ✅ Cara Paling Mudah & Stabil

### Step 1: Siapkan Video Pendek
- **Durasi**: Maksimal 5 detik (ideal: 3-5 detik)
- **Format**: MP4 (H.264)
- **Resolusi**: 1920x1080 atau 1280x720
- **Ukuran**: < 5MB (lebih kecil lebih baik)

### Step 2: Upload di Admin
1. Buka: http://localhost:5173/admin/sliders
2. Klik "Add New Slider" atau edit slider yang ada
3. Upload gambar (wajib)
4. **Jangan centang** ☐ "Auto-trim video menjadi 5 detik"
5. Upload video yang sudah pendek (≤5 detik)
6. Klik "Simpan"

### Step 3: Selesai! ✅
- Video langsung diupload tanpa processing
- No errors, no loading FFmpeg
- Fast & reliable

---

## 🎥 Cara Edit Video Menjadi 5 Detik

### Option 1: Online (Gratis, No Install)

**ClipChamp (Recommended)**
1. Buka: https://clipchamp.com/
2. Upload video
3. Trim ke 5 detik pertama
4. Export → MP4 → 1080p
5. Download & upload ke CMS

**Kapwing**
1. Buka: https://www.kapwing.com/tools/trim-video
2. Upload video
3. Set duration: 0:00 - 0:05
4. Export → Download
5. Upload ke CMS

### Option 2: FFmpeg (Command Line)

```bash
# Install FFmpeg
sudo apt install ffmpeg -y

# Trim video ke 5 detik pertama
ffmpeg -i input.mp4 -ss 0 -t 5 -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k output.mp4

# Hasil: output.mp4 (durasi 5 detik)
```

### Option 3: Software Desktop

**Windows:**
- **Shotcut** (Free): https://shotcut.org/
- **DaVinci Resolve** (Free): https://www.blackmagicdesign.com/

**macOS:**
- **iMovie** (Built-in)
- **QuickTime Player** (Built-in - Cmd+T untuk trim)

**Linux:**
- **Kdenlive** (Free)
- **OpenShot** (Free)

---

## 🎯 Rekomendasi Video untuk Hero Slider

### Konten Ideal:
- 🏫 Gedung sekolah (aerial shot)
- 👥 Siswa di lapangan/kelas
- 🎓 Kegiatan sekolah
- 🌳 Suasana lingkungan sekolah
- ⚽ Aktivitas ekstrakurikuler

### Spesifikasi:
- **Durasi**: 3-5 detik (loop akan seamless)
- **Style**: Slow motion atau smooth movement
- **No Text**: Jangan ada text di video (text ada di overlay)
- **Bright**: Warna cerah, terang, tidak gelap
- **Stable**: Tidak shaky, gunakan stabilizer

### Free Stock Videos:
- **Pexels**: https://www.pexels.com/videos/
- **Pixabay**: https://pixabay.com/videos/
- **Videvo**: https://www.videvo.net/
- **Coverr**: https://coverr.co/

Search keywords: 
- "school building"
- "students learning"
- "campus aerial"
- "education"

---

## ⚡ Tips Upload Cepat

### 1. Compress Video
Gunakan online tool:
- **HandBrake** (Desktop): https://handbrake.fr/
- **Compress Video Online**: https://www.freeconvert.com/video-compressor

Target size: < 5MB untuk video 5 detik

### 2. Format Optimization
```bash
ffmpeg -i input.mp4 \
  -c:v libx264 \
  -preset medium \
  -crf 23 \
  -vf "scale=1920:1080" \
  -c:a aac \
  -b:a 128k \
  -movflags +faststart \
  output.mp4
```

Flags explanation:
- `-crf 23`: Quality (lower = better, 23 = good balance)
- `-preset medium`: Encoding speed
- `-movflags +faststart`: Optimize for web streaming

### 3. Batch Processing
Jika punya banyak video:
```bash
for file in *.mp4; do
  ffmpeg -i "$file" -ss 0 -t 5 -c:v libx264 -crf 23 "${file%.mp4}-trimmed.mp4"
done
```

---

## 🔧 Troubleshooting Upload

### Problem: Video terlalu besar (>50MB)
**Solution**: Compress video atau trim dulu

### Problem: Format tidak didukung
**Solution**: Convert ke MP4:
```bash
ffmpeg -i input.mov -c:v libx264 -c:a aac output.mp4
```

### Problem: Upload gagal
**Check**:
1. Internet connection stable
2. File format (gunakan MP4)
3. File size (< 50MB)
4. Browser (gunakan Chrome/Firefox)

### Problem: Video lag di website
**Solution**: 
- Reduce resolution (720p instead of 1080p)
- Lower bitrate
- Shorter duration (3 detik instead of 5)

---

## 🎨 Best Practices

### DO ✅:
- Upload video pendek (3-5 detik)
- Use MP4 format
- Compress video before upload
- Test di localhost dulu
- Use stable connection

### DON'T ❌:
- Upload video panjang (>5 detik) tanpa trim dulu
- Use unsupported format (AVI, MOV)
- Upload video besar (>10MB untuk 5 detik video)
- Use shaky/low quality video
- Add text overlay di video (text di CMS aja)

---

## 📊 Checklist Before Upload

- [ ] Video sudah di-trim ke ≤5 detik
- [ ] Format: MP4 (H.264)
- [ ] Ukuran: < 5MB
- [ ] Resolution: 1920x1080 atau 1280x720
- [ ] Preview video di player (pastikan quality ok)
- [ ] Internet connection stable
- [ ] Browser: Chrome/Firefox

---

## 🎉 Summary

**Cara Tercepat & Paling Stabil:**
1. ✂️ **Trim video ke 5 detik** (gunakan online tool atau FFmpeg)
2. 📤 **Upload video yang sudah pendek** ke CMS
3. ☐ **Jangan aktifkan auto-trim** (biarkan unchecked)
4. 💾 **Simpan** → Selesai!

**No FFmpeg.wasm errors, no processing delay, no complications!**

---

## 💡 Bonus: Auto-Trim Feature

Jika Anda **benar-benar butuh** auto-trim di browser:

### Requirements:
- ✅ Internet connection sangat stabil
- ✅ Browser modern (Chrome/Firefox latest)
- ✅ Video format MP4
- ✅ Sabar menunggu processing (20-30 detik)

### Cara Enable:
1. ✅ **Centang** "Auto-trim video menjadi 5 detik (Eksperimental)"
2. Upload video panjang (>5 detik)
3. Tunggu progress bar selesai
4. Jika gagal → System auto-fallback → upload tanpa trim

**Note**: Fitur ini eksperimental dan bisa gagal tergantung kondisi network/browser.

---

**Rekomendasi: Trim video secara manual sebelum upload untuk hasil terbaik!** 🚀

