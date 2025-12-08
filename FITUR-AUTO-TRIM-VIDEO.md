# Fitur Auto-Trim Video Hero Slider

## Deskripsi
Fitur ini memungkinkan admin untuk secara otomatis memotong video yang diupload di hero slider menjadi **5 detik pertama saja**. Fitur ini sangat berguna untuk:
- Mengurangi ukuran file video
- Mempercepat loading website
- Optimasi bandwidth
- Video background yang lebih ringan

## Cara Kerja

### 1. Processing di Browser (Client-Side) - **Default**
Secara default, video akan diproses di browser menggunakan **FFmpeg.wasm** sebelum diupload ke server.

#### Keuntungan:
- ✅ Tidak membebani server
- ✅ Lebih cepat (tidak perlu upload video besar)
- ✅ User langsung melihat progress
- ✅ Bekerja di localhost dan production

#### Cara Penggunaan:
1. Buka halaman slider admin: `http://localhost:5173/admin/sliders`
2. Klik "Add New Slider" atau edit slider yang ada
3. Pada bagian **"Video File untuk Autoplay Background"**:
   - Centang checkbox **"Auto-trim video menjadi 5 detik"** (sudah aktif secara default)
   - Klik untuk upload video
4. Jika video lebih dari 5 detik:
   - Video akan otomatis dipotong menjadi 5 detik pertama
   - Progress bar akan muncul menunjukkan proses trimming (0-100%)
   - Setelah selesai, video yang sudah dipotong akan diupload ke server
5. Simpan slider

### 2. Processing di Server (Server-Side) - **Optional**
Jika Anda memiliki FFmpeg terinstall di server, video juga bisa diproses di server.

#### Keuntungan:
- ✅ Tidak membebani browser user
- ✅ Lebih stabil untuk video besar
- ✅ Bisa digunakan untuk batch processing

#### Requirements:
- FFmpeg harus terinstall di server
- Path FFmpeg harus ada di `PATH` environment atau di lokasi umum:
  - `/usr/bin/ffmpeg`
  - `/usr/local/bin/ffmpeg`
  - `/opt/homebrew/bin/ffmpeg`

#### Install FFmpeg di Server:

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install ffmpeg
```

**CentOS/RHEL:**
```bash
sudo yum install ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

**Windows:**
Download dari: https://ffmpeg.org/download.html

#### Verifikasi Installation:
```bash
ffmpeg -version
ffprobe -version
```

## Fitur Tambahan

### 1. Indikator Progress
Saat video sedang diproses, akan muncul:
- Icon gunting (scissors) beranimasi
- Progress bar 0-100%
- Pesan "Memotong video menjadi 5 detik..."

### 2. Info Ukuran File
Di console browser, Anda dapat melihat:
- Ukuran file asli
- Ukuran file setelah dipotong
- Log proses trimming

### 3. Disable Auto-Trim
Jika Anda ingin upload video tanpa dipotong:
1. Uncheck checkbox **"Auto-trim video menjadi 5 detik"**
2. Upload video seperti biasa

## Lokasi File

### Frontend (React):
- **Utility Functions**: `react-frontend/src/lib/video-trimmer.ts`
- **Slider Form**: `react-frontend/src/components/admin/SliderForm.tsx`
- **Page Blocks Manager**: `react-frontend/src/components/admin/PageBlocksManager.tsx`
- **API Client**: `react-frontend/src/lib/api-client.ts`

### Backend (PHP):
- **Utils Functions**: `php-backend/src/Utils.php`
  - `trimVideo()` - Trim video dengan FFmpeg
  - `shouldTrimVideo()` - Cek apakah video perlu dipotong
  - `getVideoDuration()` - Dapatkan durasi video
- **Upload Controller**: `php-backend/src/Controllers/UploadController.php`

## Library yang Digunakan

### Frontend:
- `@ffmpeg/ffmpeg` v0.12.6 - FFmpeg untuk browser (WebAssembly)
- `@ffmpeg/util` - Utility functions untuk FFmpeg.wasm

### Backend:
- FFmpeg (system binary) - Optional, untuk server-side processing

## Technical Details

### Video Processing Settings:
```bash
# Client-side (FFmpeg.wasm)
-ss 0              # Start from beginning
-t 5               # Trim to 5 seconds
-c:v libx264       # H.264 video codec
-preset ultrafast  # Fast encoding
-crf 23            # Quality (23 = default, lower = better)
-c:a aac           # AAC audio codec
-b:a 128k          # Audio bitrate 128kbps
-movflags +faststart  # Optimize for web streaming
```

### File Size Reduction:
Contoh video 1080p 30fps:
- **Original (30 detik)**: ~15-20 MB
- **Trimmed (5 detik)**: ~2-4 MB
- **Saving**: ~75-80% reduction

## Troubleshooting

### 1. Error: "Gagal memproses video"
**Penyebab**: FFmpeg.wasm gagal load atau file corrupt

**Solusi**:
- Pastikan koneksi internet stabil (untuk load FFmpeg.wasm CDN)
- Coba dengan format video lain (mp4 lebih kompatibel)
- Clear browser cache dan reload

### 2. Progress stuck at 0%
**Penyebab**: Video terlalu besar atau format tidak didukung

**Solusi**:
- Compress video terlebih dahulu sebelum upload
- Gunakan format MP4 H.264
- Maksimal ukuran file 50MB

### 3. Server-side trimming tidak bekerja
**Penyebab**: FFmpeg tidak terinstall atau tidak di PATH

**Solusi**:
```bash
# Cek apakah FFmpeg terinstall
which ffmpeg
ffmpeg -version

# Jika tidak ada, install
sudo apt install ffmpeg  # Ubuntu/Debian
```

### 4. Video hasil trim tidak play
**Penyebab**: Encoding error atau codec tidak didukung browser

**Solusi**:
- Video output selalu dalam format MP4 H.264 yang kompatibel dengan semua browser modern
- Cek console browser untuk error detail
- Try dengan video source yang berbeda

## Best Practices

### 1. Ukuran Video
- **Recommended**: 1920x1080 (Full HD)
- **Max**: 50MB before trimming
- **Format**: MP4 (H.264)
- **FPS**: 30fps atau 60fps

### 2. Content Video
- Pastikan 5 detik pertama adalah bagian paling menarik
- Jangan ada intro/fade in yang lama
- Test preview sebelum final upload

### 3. Performance
- Upload di internet yang stabil
- Untuk video > 20MB, pertimbangkan compress dulu
- Enable auto-trim untuk semua slider video

## API Documentation

### Upload with Trim (Server-Side)
```typescript
// Client-side trimming (default)
const data = await apiClient.upload(
  '/admin/upload',
  file,
  'sliders',
  true,  // includeAuth
  true,  // isVideo
  false, // isDocument
  false, // trimVideo (false = process in browser)
  5      // trimDuration
)

// Server-side trimming (if FFmpeg available)
const data = await apiClient.upload(
  '/admin/upload',
  file,
  'sliders',
  true,  // includeAuth
  true,  // isVideo
  false, // isDocument
  true,  // trimVideo (true = process in server)
  5      // trimDuration
)
```

### Response Format:
```json
{
  "url": "/uploads/sliders/slider-video-1234567890-abc123.mp4",
  "filename": "slider-video-1234567890-abc123.mp4",
  "type": "sliders",
  "videoDuration": 5
}
```

## Testing

### Test Plan:
1. ✅ Upload video < 5 detik → Tidak dipotong
2. ✅ Upload video > 5 detik → Otomatis dipotong jadi 5 detik
3. ✅ Disable auto-trim → Video diupload utuh
4. ✅ Progress indicator → Muncul dan update 0-100%
5. ✅ Multiple sliders → Semua bekerja independent
6. ✅ Edit slider → Video lama tetap bisa dihapus/diganti

### Test Videos:
Gunakan video sample dari:
- https://sample-videos.com/
- https://test-videos.co.uk/

## Support

Untuk pertanyaan atau issue, hubungi developer atau buat issue ticket.

## Changelog

### Version 1.0.0 (2025-12-08)
- ✨ Initial release
- ✨ Client-side video trimming dengan FFmpeg.wasm
- ✨ Server-side video trimming dengan FFmpeg (optional)
- ✨ Progress indicator
- ✨ Toggle enable/disable auto-trim
- ✨ Support untuk slider admin dan page blocks

