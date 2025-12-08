# Fix FFmpeg.wasm Worker Error

## Error yang Terjadi
```
GET http://localhost:5173/node_modules/.vite/deps/worker.js?worker_file=&type=module
404 Not Found
```

## Penyebab
Vite membutuhkan konfigurasi khusus untuk handle FFmpeg.wasm worker files dan SharedArrayBuffer.

## Solusi yang Sudah Diterapkan

### 1. Update `vite.config.ts`
Menambahkan:
- `optimizeDeps.exclude` untuk FFmpeg packages
- CORS headers untuk SharedArrayBuffer support

### 2. Update `video-trimmer.ts`
Menambahkan:
- Better error handling
- Console log untuk tracking

## Cara Memperbaiki

### Step 1: Restart Dev Server

**Stop server yang sedang berjalan** (Ctrl+C di terminal), lalu **start ulang**:

```bash
cd /home/hasanarofid/Documents/solkit/proyek/alazhar/react-frontend
npm run dev
```

### Step 2: Clear Browser Cache

1. Buka Developer Tools (F12)
2. Klik kanan pada tombol Refresh
3. Pilih **"Empty Cache and Hard Reload"**

Atau:
- Tekan **Ctrl+Shift+Delete**
- Clear cache
- Reload page

### Step 3: Test Upload Video Lagi

1. Buka: http://localhost:5173/admin/sliders
2. Upload video > 5 detik
3. Lihat console - seharusnya muncul: `FFmpeg.wasm loaded successfully!`

## Troubleshooting

### Jika Masih Error:

#### Option 1: Install ulang dependencies
```bash
cd /home/hasanarofid/Documents/solkit/proyek/alazhar/react-frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### Option 2: Gunakan browser lain
FFmpeg.wasm bekerja paling baik di:
- ✅ Chrome/Chromium (Recommended)
- ✅ Firefox
- ✅ Edge
- ⚠️ Safari (limited support)

#### Option 3: Check Internet Connection
FFmpeg.wasm load dari CDN (unpkg.com), pastikan:
- Internet connection stabil
- Tidak ada firewall blocking CDN
- Bisa akses: https://unpkg.com/@ffmpeg/core@0.12.6/

### Test CDN Access:
Buka di browser:
- https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js
- https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm

Jika bisa diakses, FFmpeg.wasm akan bekerja.

## Verifikasi Sukses

Console browser seharusnya menunjukkan:
```
FFmpeg.wasm loaded successfully!
Video lebih dari 5 detik. Memotong video... (Ukuran asli: XX MB)
Video berhasil dipotong menjadi 5 detik (Ukuran baru: XX MB)
```

Progress bar akan bergerak dari 0% → 100%

## Alternative: Server-Side Processing

Jika client-side masih bermasalah, bisa gunakan server-side processing:

### Install FFmpeg di Server:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install ffmpeg

# Verify
ffmpeg -version
```

### Update Upload Code:
```typescript
// Di SliderForm.tsx atau PageBlocksManager.tsx
// Ubah parameter terakhir dari false ke true untuk enable server-side
const data = await apiClient.upload(
  '/admin/upload',
  file,
  'sliders',
  true,  // includeAuth
  true,  // isVideo
  false, // isDocument
  true,  // trimVideo (true = server-side)
  5      // trimDuration
)
```

Dengan cara ini, video akan diproses di server (PHP) menggunakan FFmpeg CLI.

## Status Setelah Fix

- ✅ vite.config.ts updated dengan CORS headers
- ✅ FFmpeg.wasm exclude dari optimizeDeps
- ✅ Better error handling di video-trimmer.ts
- ✅ Console logging untuk debugging

**Next**: Restart dev server dan test ulang!

