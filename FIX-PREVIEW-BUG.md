# Fix Preview & FFmpeg Bug

## Masalah yang Diperbaiki

### 1. ❌ Preview Gambar Tidak Tampil
**Penyebab**: CORS policy untuk video files tidak ada

**Solusi**:
- ✅ Tambah video MIME types di `php-backend/public/index.php`
- ✅ Tambah header `Cross-Origin-Resource-Policy: cross-origin`

### 2. ❌ FFmpeg.wasm Gagal Load
**Penyebab**: 
- COOP/COEP headers terlalu strict
- toBlobURL causing issues

**Solusi**:
- ✅ Hapus COOP/COEP headers dari `vite.config.ts`
- ✅ Simplify FFmpeg loading (direct URL tanpa toBlobURL)

## Perubahan File

### 1. `php-backend/public/index.php`
```php
// Tambah video MIME types:
'mp4' => 'video/mp4',
'webm' => 'video/webm',
'ogg' => 'video/ogg',
'ogv' => 'video/ogg',
'mov' => 'video/quicktime',
'avi' => 'video/x-msvideo',

// Tambah header:
header('Cross-Origin-Resource-Policy: cross-origin');
```

### 2. `react-frontend/vite.config.ts`
```typescript
// HAPUS server.headers (COOP/COEP)
// Sekarang hanya:
optimizeDeps: {
  exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util']
}
```

### 3. `react-frontend/src/lib/video-trimmer.ts`
```typescript
// Load FFmpeg tanpa toBlobURL:
await ffmpeg.load({
  coreURL: `${baseURL}/ffmpeg-core.js`,
  wasmURL: `${baseURL}/ffmpeg-core.wasm`,
})
```

## Cara Menerapkan Fix

### Step 1: Restart Backend
```bash
# Stop backend (Ctrl+C)
cd /home/hasanarofid/Documents/solkit/proyek/alazhar/php-backend
php -S localhost:8000 -t public
```

### Step 2: Restart Frontend  
```bash
# Stop frontend (Ctrl+C)
cd /home/hasanarofid/Documents/solkit/proyek/alazhar/react-frontend
npm run dev
```

### Step 3: Clear Browser Cache
1. Tekan `Ctrl+Shift+Delete`
2. Clear "Cached images and files"
3. Hard reload: `Ctrl+Shift+R`

### Step 4: Test
1. Buka: http://localhost:5173/admin/sliders
2. Edit slider atau buat baru
3. **Preview gambar seharusnya tampil** ✅
4. Upload video > 5 detik
5. Console seharusnya show: `✅ FFmpeg.wasm loaded successfully!`
6. Progress bar muncul
7. Video dipotong jadi 5 detik

## Expected Console Output

### ✅ Success:
```
✅ FFmpeg.wasm loaded successfully!
Video lebih dari 5 detik. Memotong video... (Ukuran asli: 15.2 MB)
Progress: 25%
Progress: 50%
Progress: 75%
Progress: 100%
Video berhasil dipotong menjadi 5 detik (Ukuran baru: 2.8 MB)
```

### ❌ Jika Masih Error:
1. Check internet connection
2. Coba browser lain (Chrome recommended)
3. Check apakah bisa akses: https://unpkg.com/@ffmpeg/core@0.12.6/
4. Gunakan alternative: server-side trimming (install FFmpeg di server)

## Verification Checklist

- [ ] Backend restart ✓
- [ ] Frontend restart ✓
- [ ] Browser cache cleared ✓
- [ ] Preview gambar tampil ✓
- [ ] Preview video tampil ✓
- [ ] FFmpeg load success (check console) ✓
- [ ] Upload video test berhasil ✓
- [ ] Progress bar muncul ✓
- [ ] Video dipotong jadi 5 detik ✓

## Alternative: Disable Auto-Trim

Jika FFmpeg.wasm masih bermasalah, bisa:
1. **Uncheck** checkbox "Auto-trim video menjadi 5 detik"
2. Upload video tanpa processing
3. Video akan diupload utuh (tanpa dipotong)

## Alternative: Server-Side Processing

Install FFmpeg di server dan enable server-side trimming:

```bash
# Install FFmpeg
sudo apt update
sudo apt install ffmpeg
ffmpeg -version
```

Lalu video akan diproses di server, tidak di browser.

---

**Status**: ✅ Fixed & Ready to Test

