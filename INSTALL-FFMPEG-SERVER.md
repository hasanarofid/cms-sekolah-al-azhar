# Install FFmpeg di Server (Backup Solution)

## Kenapa Perlu FFmpeg di Server?

Jika FFmpeg.wasm di browser gagal load (karena internet, browser compatibility, dll), sistem akan **otomatis fallback** ke server-side processing menggunakan FFmpeg CLI.

## Instalasi FFmpeg

### Ubuntu / Debian
```bash
sudo apt update
sudo apt install ffmpeg -y
```

### CentOS / RHEL
```bash
sudo yum install epel-release -y
sudo yum install ffmpeg -y
```

### macOS (Homebrew)
```bash
brew install ffmpeg
```

### Windows
Download dari: https://ffmpeg.org/download.html

## Verifikasi Instalasi

```bash
ffmpeg -version
ffprobe -version
which ffmpeg
```

Expected output:
```
ffmpeg version 4.x.x
ffprobe version 4.x.x
/usr/bin/ffmpeg
```

## Test Trimming

Test manual trim video:
```bash
ffmpeg -i input.mp4 -ss 0 -t 5 -c:v libx264 -preset ultrafast -crf 23 -c:a aac -b:a 128k -movflags +faststart output.mp4
```

Jika berhasil, file `output.mp4` akan ter-generate dengan durasi 5 detik.

## Cara Kerja Auto-Fallback

### Flow Processing:

1. **User upload video** di admin panel
2. **Cek: Auto-trim enabled?**
   - ❌ Tidak → Upload langsung tanpa trim
   - ✅ Ya → Lanjut ke step 3

3. **Cek: Video > 5 detik?**
   - ❌ Tidak → Upload langsung (no need trim)
   - ✅ Ya → Lanjut ke step 4

4. **Try: Client-side trim (FFmpeg.wasm di browser)**
   - ✅ Berhasil → Upload video yang sudah di-trim
   - ❌ Gagal → Lanjut ke step 5

5. **Fallback: Server-side trim (FFmpeg CLI di server)**
   - Backend akan trim video menggunakan FFmpeg
   - ✅ Berhasil → Return video yang sudah di-trim
   - ❌ Gagal → Upload video original (tanpa trim)

### Console Output

#### Success (Client-side):
```
🎬 Video lebih dari 5 detik. Memotong video di browser... (Ukuran asli: 15 MB)
✅ FFmpeg.wasm loaded successfully!
Progress: 25%
Progress: 50%
Progress: 75%
Progress: 100%
✅ Video berhasil dipotong menjadi 5 detik (Ukuran baru: 3 MB)
✅ Video berhasil diupload (sudah dipotong di browser)
```

#### Fallback (Server-side):
```
🎬 Video lebih dari 5 detik. Memotong video di browser... (Ukuran asli: 15 MB)
⚠️ Client-side trimming gagal: Gagal memuat FFmpeg
🔄 Fallback: Upload ke server untuk di-trim...
✅ Video berhasil diupload dan dipotong di server
```

#### No Trim Needed:
```
✅ Video berhasil diupload
```

## Permissions

Pastikan folder uploads writable:
```bash
cd /home/hasanarofid/Documents/solkit/proyek/alazhar/php-backend/public
chmod -R 755 uploads/
```

## Troubleshooting

### FFmpeg not found
```bash
# Check if installed
which ffmpeg

# If not found, install
sudo apt install ffmpeg -y
```

### Permission denied
```bash
# Check PHP user
ps aux | grep php

# Give permission
sudo chown -R www-data:www-data /path/to/uploads/
# Or untuk dev:
sudo chown -R $USER:$USER /path/to/uploads/
```

### Video corrupt setelah trim
```bash
# Test FFmpeg directly
ffmpeg -i test.mp4 -ss 0 -t 5 test-trimmed.mp4

# Check output
ffprobe test-trimmed.mp4
```

## Production Deployment

Untuk production, **sangat disarankan** install FFmpeg di server karena:

1. ✅ **More reliable** - Tidak tergantung browser user
2. ✅ **Faster** - Server biasanya lebih powerful
3. ✅ **Consistent** - Hasil sama untuk semua user
4. ✅ **No bandwidth waste** - Video besar tidak perlu diupload ke server

### Hostinger / cPanel
```bash
# SSH ke server
ssh username@yourserver.com

# Install FFmpeg (jika belum)
sudo apt install ffmpeg -y

# Verify
ffmpeg -version
```

### Shared Hosting
Jika shared hosting tidak support install FFmpeg, sistem akan tetap bekerja dengan:
- Client-side processing (FFmpeg.wasm)
- Atau upload tanpa trimming

## Status Check

Test apakah FFmpeg available:
```bash
php -r "echo shell_exec('which ffmpeg');"
```

Jika output: `/usr/bin/ffmpeg` → ✅ FFmpeg ready

Jika output kosong → ❌ FFmpeg not installed

## Summary

- ✅ **Client-side (browser)**: Default, no server resources needed
- ✅ **Server-side (FFmpeg)**: Automatic fallback if browser fails
- ✅ **No trim**: Fallback if both fail

**Rekomendasi**: Install FFmpeg di server untuk reliability maksimal!

