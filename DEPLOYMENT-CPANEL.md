# 🚀 Deploy ke cPanel - Al Azhar CMS

## 📋 Prerequisites

- ✅ Akun cPanel/Hosting
- ✅ Domain: aicjatibening.com (atau subdomain api.aicjatibening.com)
- ✅ PHP 7.4+ atau 8.x
- ✅ MySQL Database
- ✅ SSL Certificate (untuk HTTPS)

---

## 🎯 Structure di cPanel

```
public_html/
├── api/                          ← Upload php-backend kesini
│   ├── public/
│   │   ├── index.php
│   │   ├── .htaccess            ← File utama (sudah diperbaiki)
│   │   └── uploads/
│   ├── src/
│   ├── vendor/
│   ├── config/
│   ├── .htaccess                ← Root htaccess
│   └── composer.json
│
└── (react build files)           ← Upload react-frontend/dist/ ke root
    ├── index.html
    ├── assets/
    └── ...
```

---

## 📦 Step 1: Build Frontend

```bash
cd /home/hasanarofid/Documents/solkit/proyek/alazhar/react-frontend

# Build production
npm run build:prod

# Hasil ada di folder dist/
```

---

## 🗄️ Step 2: Setup Database

### Via cPanel MySQL:

1. **Buat Database**:
   - Name: `u548738830_alazhar` (atau sesuai cPanel)
   
2. **Buat User**:
   - Username: `u548738830_alazhar`
   - Password: (generate strong password)
   
3. **Assign User ke Database**:
   - All Privileges

4. **Import Database**:
   - Upload file: `php-backend/database/schema.sql`
   - Via phpMyAdmin: Import SQL

---

## 🔧 Step 3: Upload Backend

### Via cPanel File Manager atau FTP:

1. **Compress php-backend**:
```bash
cd /home/hasanarofid/Documents/solkit/proyek/alazhar
zip -r php-backend.zip php-backend/ \
    -x "php-backend/vendor/*" \
    -x "php-backend/.env" \
    -x "php-backend/node_modules/*"
```

2. **Upload ke cPanel**:
   - Upload `php-backend.zip` ke `/public_html/api/`
   - Extract di cPanel File Manager

3. **Install Composer Dependencies**:
   - Via cPanel Terminal:
   ```bash
   cd public_html/api
   composer install --no-dev --optimize-autoloader
   ```

4. **Setup Permissions**:
   ```bash
   chmod 755 public/uploads
   chmod 644 .htaccess
   chmod 644 public/.htaccess
   ```

---

## ⚙️ Step 4: Configure Environment

### Create `.env` file di `/public_html/api/`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=u548738830_alazhar
DB_USERNAME=u548738830_alazhar
DB_PASSWORD=your_strong_password_here

# Application
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.aicjatibening.com

# CORS
ALLOWED_ORIGINS=https://aicjatibening.com,https://www.aicjatibening.com

# Session
SESSION_LIFETIME=120
```

**Important**: Ganti password dengan password database yang benar!

---

## 🌐 Step 5: Upload Frontend

1. **Upload dist/ contents ke root**:
   ```
   public_html/
   ├── index.html
   ├── assets/
   └── ...
   ```

2. **Atau upload ke subdomain** (optional):
   ```
   public_html/
   └── cms/           ← Upload dist/ kesini
       ├── index.html
       └── assets/
   ```

---

## 🔐 Step 6: Force HTTPS (Jika Punya SSL)

### Edit `.htaccess` di root:

Uncomment baris ini di `php-backend/public/.htaccess`:

```apache
# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## ✅ Step 7: Test API

### Test 1: Check API Status
```
https://api.aicjatibening.com/
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Database connection successful",
  "database": {
    "status": "connected"
  }
}
```

### Test 2: Check CORS
Open browser console di https://aicjatibening.com dan test:
```javascript
fetch('https://api.aicjatibening.com/api/admin/menus')
  .then(r => r.json())
  .then(console.log)
```

**Should work without CORS errors!** ✅

---

## 🐛 Troubleshooting

### Problem 1: 500 Internal Server Error

**Check**:
1. `.htaccess` syntax error
2. PHP version compatibility
3. File permissions

**Fix**:
```bash
# Via cPanel Terminal
cd public_html/api
chmod 644 .htaccess
chmod 644 public/.htaccess
chmod 755 public/uploads
```

**Check Error Log**:
- cPanel → Error Logs
- Look for specific error

---

### Problem 2: CORS Errors Masih Ada

**Fix 1**: Pastikan `mod_headers` enabled di cPanel
- Contact hosting support jika perlu

**Fix 2**: Alternative CORS di PHP (edit `public/index.php`):

Add di awal file setelah `<?php`:
```php
<?php
// Handle CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ... rest of code
```

---

### Problem 3: Upload Video Gagal (File Too Large)

**Fix via cPanel → Select PHP Version → Options**:

Set:
- `upload_max_filesize`: 50M
- `post_max_size`: 60M
- `max_execution_time`: 300
- `memory_limit`: 256M

**Atau via `.htaccess`** (sudah included di file baru)

---

### Problem 4: Routing Tidak Bekerja

**Check**:
1. `mod_rewrite` enabled? (contact hosting)
2. `.htaccess` di folder yang benar?

**Fix**: Add di `public/.htaccess`:
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    
    # Route ke index.php
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php [QSA,L]
</IfModule>
```

---

### Problem 5: Static Files (Images/Videos) Tidak Load

**Check URL**:
- Should be: `https://api.aicjatibening.com/uploads/sliders/xxx.mp4`
- Not: `https://aicjatibening.com/uploads/...`

**Fix**: Check `VITE_API_URL` di frontend `.env`:
```env
VITE_API_URL=https://api.aicjatibening.com
```

Rebuild frontend:
```bash
npm run build:prod
```

---

## 📊 Verify Deployment

### Checklist:

- [ ] ✅ Database connected
- [ ] ✅ API endpoint accessible (`/api/info`)
- [ ] ✅ No CORS errors
- [ ] ✅ Frontend loads
- [ ] ✅ Login works
- [ ] ✅ Images load
- [ ] ✅ Videos load
- [ ] ✅ Upload works (test dengan gambar kecil)
- [ ] ✅ Upload video works (test dengan video kecil)
- [ ] ✅ HTTPS works (jika ada SSL)

---

## 🔒 Security Checklist

### Production Security:

1. **Ganti semua default passwords**
2. **Set `APP_DEBUG=false`** di `.env`
3. **Restrict database access** (localhost only)
4. **Enable HTTPS** (force redirect)
5. **Hide `.env`** file:
   ```apache
   <FilesMatch "^\.env">
       Require all denied
   </FilesMatch>
   ```
6. **Disable directory listing** (sudah ada di .htaccess)
7. **Update composer packages**:
   ```bash
   composer update --no-dev
   ```

---

## 📱 Frontend Environment

### `.env.production` di react-frontend:

```env
VITE_API_URL=https://api.aicjatibening.com
VITE_APP_NAME=Al Azhar CMS
VITE_APP_ENV=production
```

Build dengan:
```bash
npm run build:prod
```

---

## 🎉 Success Indicators

### Backend (API):
```bash
curl https://api.aicjatibening.com/
# Should return JSON with success: true
```

### Frontend:
```
https://aicjatibening.com/
# Should load homepage without errors
```

### Admin Login:
```
https://aicjatibening.com/admin/login
# Should work, no CORS errors in console
```

### Upload Test:
```
1. Login ke admin
2. Upload gambar → Success ✅
3. Upload video → Success ✅
```

---

## 📞 Support

### Jika Ada Masalah:

1. **Check Error Logs**:
   - cPanel → Error Logs
   - Browser Console (F12)

2. **Contact Hosting Support**:
   - Request enable `mod_rewrite`
   - Request enable `mod_headers`
   - Request PHP 8.x dengan extensions: mysqli, pdo, json

3. **Backup Database**:
   ```bash
   # Via cPanel phpMyAdmin
   Export → SQL → Download
   ```

---

## 🚀 Summary

**Files yang Sudah Diperbaiki**:
- ✅ `php-backend/.htaccess` - Root redirect
- ✅ `php-backend/public/.htaccess` - Complete production config dengan CORS, routing, security

**Yang Perlu Dilakukan**:
1. Upload files ke cPanel
2. Setup database
3. Configure .env
4. Test!

**Good luck with deployment!** 🎉

