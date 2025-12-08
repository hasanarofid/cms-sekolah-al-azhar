# 🚀 Cara Start Development Servers

## ⚠️ PENTING: PHP Built-in Server Limitation

PHP built-in server (`php -S`) **TIDAK membaca** `.htaccess` atau `.user.ini` files!

Kita harus override PHP settings **langsung di command line** menggunakan flag `-d`.

---

## ✅ SOLUSI: Gunakan Start Script

### Step 1: Stop Backend (Jika Running)

Tekan **`Ctrl+C`** di terminal backend

### Step 2: Start Backend dengan Script Baru

```bash
cd /home/hasanarofid/Documents/solkit/proyek/alazhar/php-backend
./start-server.sh
```

### Output yang Diharapkan:
```
================================================
🚀 Starting PHP Development Server
   with Video Upload Support (50MB)
================================================

PHP 8.x Development Server (http://localhost:8000) started
```

---

## 🔍 Verify Settings

Buka terminal baru dan test:

```bash
cd /home/hasanarofid/Documents/solkit/proyek/alazhar
./check-php-limits.sh
```

### Expected Output:
```
================================================
🔍 Checking PHP Upload Limits
================================================

Current PHP Configuration:

upload_max_filesize: 50M
post_max_size: 60M
max_execution_time: 300 seconds
max_input_time: 300 seconds
memory_limit: 256M

================================================
✅ GOOD: PHP upload limit is 50M
   Video uploads should work fine!
================================================
```

---

## 📋 Complete Startup Guide

### Terminal 1 - Backend (dengan upload limit 50MB):
```bash
cd /home/hasanarofid/Documents/solkit/proyek/alazhar/php-backend
./start-server.sh
```

### Terminal 2 - Frontend:
```bash
cd /home/hasanarofid/Documents/solkit/proyek/alazhar/react-frontend
npm run dev
```

### Browser:
1. Clear cache: `Ctrl+Shift+Delete`
2. Hard reload: `Ctrl+Shift+R`
3. Buka: http://localhost:5173/admin/sliders
4. Upload video!

---

## 🎬 Test Upload

### Test 1: Video Kecil (< 5MB)
- Upload video 2-3MB
- Should upload directly (no compress)
- Console: `✅ Video size OK: 2.1 MB`

### Test 2: Video Sedang (5-15MB)
- Upload video 10MB
- System auto-compress → 3-5MB
- Console: 
  ```
  📦 Video 10.2 MB > 5MB, compressing...
  ✅ Compressed: 10.2 MB → 3.8 MB
  ✅ Video berhasil diupload
  ```

### Test 3: Video Besar (15-50MB)
- Upload video 20MB
- System auto-compress → 4-8MB
- Upload success!

---

## 🐛 Troubleshooting

### Problem: Masih error "File exceeds 2M"

**Check 1**: Pastikan backend started dengan script baru
```bash
# Stop backend (Ctrl+C)
cd /home/hasanarofid/Documents/solkit/proyek/alazhar/php-backend
./start-server.sh
```

**Check 2**: Verify settings
```bash
./check-php-limits.sh
```

Harus show: `upload_max_filesize: 50M` ✅

**Check 3**: Restart frontend
```bash
cd react-frontend && npm run dev
```

**Check 4**: Clear browser cache
- Ctrl+Shift+Delete
- Hard reload: Ctrl+Shift+R

### Problem: Script tidak executable

```bash
chmod +x php-backend/start-server.sh
chmod +x check-php-limits.sh
```

### Problem: "Permission denied" saat start

```bash
# Check port 8000
sudo lsof -i :8000

# Kill if needed
sudo kill -9 <PID>

# Start again
cd php-backend && ./start-server.sh
```

---

## 📊 PHP Settings Comparison

### Before (Default):
```
upload_max_filesize: 2M     ❌ Too small
post_max_size: 8M
```

### After (With Script):
```
upload_max_filesize: 50M    ✅ Good for videos
post_max_size: 60M          ✅ Buffer
max_execution_time: 300s    ✅ Enough time
memory_limit: 256M          ✅ Good
```

---

## 🎯 Why This Solution?

### ❌ Doesn't Work:
- `.htaccess` → PHP built-in server ignores it
- `.user.ini` → PHP built-in server ignores it
- Environment variables → Not persistent

### ✅ Works:
- **`-d` flags** → Direct PHP ini override
- **Start script** → Easy to use, consistent
- **Check script** → Verify settings anytime

---

## 💡 Alternative: Manual Start

Jika script tidak jalan, start manual:

```bash
cd /home/hasanarofid/Documents/solkit/proyek/alazhar/php-backend

php -S localhost:8000 \
    -t public \
    -d upload_max_filesize=50M \
    -d post_max_size=60M \
    -d max_execution_time=300 \
    -d max_input_time=300 \
    -d memory_limit=256M
```

---

## 🚀 Quick Start (Copy-Paste)

```bash
# Terminal 1 - Backend
cd /home/hasanarofid/Documents/solkit/proyek/alazhar/php-backend
./start-server.sh

# Terminal 2 - Frontend  
cd /home/hasanarofid/Documents/solkit/proyek/alazhar/react-frontend
npm run dev

# Browser
# 1. Ctrl+Shift+Delete (clear cache)
# 2. Ctrl+Shift+R (hard reload)
# 3. Upload video!
```

---

## ✅ Success Indicators

### Backend Terminal:
```
🚀 Starting PHP Development Server
   with Video Upload Support (50MB)
PHP 8.x Development Server started
```

### Check Script:
```
✅ GOOD: PHP upload limit is 50M
```

### Browser Console:
```
📦 Video 10.2 MB > 5MB, compressing...
✅ Compressed: 10.2 MB → 3.8 MB
✅ Video berhasil diupload
```

### No Errors:
- ❌ "File exceeds upload_max_filesize" → Gone!
- ✅ Upload success!

---

**Ready! Stop backend (Ctrl+C), start dengan script baru, dan test upload!** 🚀


