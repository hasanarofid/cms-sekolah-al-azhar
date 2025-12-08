# 🔧 Fix CORS Error di cPanel Production

## ❌ Error yang Terlihat:

```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading 
the remote resource at https://api.aicjatibening.com/api/admin/menus
(Reason: CORS header 'Access-Control-Allow-Origin' missing). Status code: 404.
```

---

## ✅ Solusi Lengkap:

### 1. Update `.htaccess` Files

Saya sudah update 2 files:
- ✅ `php-backend/.htaccess` (root)
- ✅ `php-backend/public/.htaccess` (main)

**Upload kedua file ini ke server!**

---

### 2. Yang Ditambahkan di `.htaccess`:

#### A. CORS Headers yang Lengkap:
```apache
<IfModule mod_headers.c>
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
    Header always set Access-Control-Allow-Credentials "true"
    
    # Handle preflight
    RewriteCond %{REQUEST_METHOD} OPTIONS
    RewriteRule ^(.*)$ $1 [R=200,L]
</IfModule>
```

#### B. PHP Upload Settings:
```apache
php_value upload_max_filesize 50M
php_value post_max_size 60M
php_value max_execution_time 300
php_value max_input_time 300
php_value memory_limit 256M
php_flag file_uploads On
```

#### C. URL Rewriting:
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Route ke index.php
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php [QSA,L]
</IfModule>
```

#### D. Video Files CORS:
```apache
<FilesMatch "\.(mp4|webm|ogg|mov)$">
    Header set Access-Control-Allow-Origin "*"
    Header set Cross-Origin-Resource-Policy "cross-origin"
</FilesMatch>
```

---

### 3. Upload ke cPanel:

#### Via File Manager:
1. Login cPanel
2. File Manager → `/public_html/api/`
3. Upload `php-backend/.htaccess` ke `/public_html/api/.htaccess`
4. Upload `php-backend/public/.htaccess` ke `/public_html/api/public/.htaccess`
5. Klik kanan → Change Permissions → 644

#### Via FTP:
```bash
# Upload files
ftp yoursite.com
> cd public_html/api
> put php-backend/.htaccess .htaccess
> cd public
> put php-backend/public/.htaccess .htaccess
> quit
```

---

### 4. Verify Upload:

Test dengan curl:
```bash
curl -I https://api.aicjatibening.com/api/admin/menus
```

**Should see:**
```
HTTP/2 200
access-control-allow-origin: *
access-control-allow-methods: GET, POST, PUT, DELETE, OPTIONS
```

---

### 5. Jika Masih Error:

#### Option A: Check mod_headers
```bash
# Via cPanel Terminal
php -m | grep headers
```

Jika tidak ada, **contact hosting support** untuk enable:
- `mod_headers`
- `mod_rewrite`

#### Option B: Alternative CORS di PHP

Edit `php-backend/public/index.php`, tambahkan di awal:

```php
<?php
// CORS Headers (jika .htaccess tidak work)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ... rest of code
```

---

### 6. Check PHP Version

Via cPanel → Select PHP Version:
- **Minimum**: PHP 7.4
- **Recommended**: PHP 8.0 atau 8.1

Extensions required:
- ✅ mysqli
- ✅ pdo
- ✅ json
- ✅ mbstring
- ✅ fileinfo

---

### 7. Test API Endpoints:

```bash
# Test 1: Info endpoint
curl https://api.aicjatibening.com/

# Test 2: Menus endpoint
curl https://api.aicjatibening.com/api/admin/menus

# Test 3: With auth
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://api.aicjatibening.com/api/admin/settings
```

---

### 8. Test dari Browser:

Open console (F12) di https://aicjatibening.com:

```javascript
// Test CORS
fetch('https://api.aicjatibening.com/api/admin/menus')
  .then(r => r.json())
  .then(data => console.log('✅ CORS Working!', data))
  .catch(err => console.error('❌ CORS Error:', err))
```

**Should work without errors!** ✅

---

## 🎯 Quick Checklist:

- [ ] Upload `.htaccess` files ke cPanel
- [ ] Set permissions 644
- [ ] Verify `mod_headers` enabled
- [ ] Verify `mod_rewrite` enabled
- [ ] Test dengan curl
- [ ] Test dari browser console
- [ ] Test login admin
- [ ] Test upload gambar
- [ ] Test upload video

---

## 📞 Contact Hosting Support:

Jika `.htaccess` tidak work, minta hosting enable:

**Email template**:
```
Subject: Request Enable mod_headers and mod_rewrite

Hi,

Saya perlu enable Apache modules untuk aplikasi:
1. mod_headers - untuk CORS headers
2. mod_rewrite - untuk URL routing

Domain: api.aicjatibening.com

Terima kasih!
```

---

## ✅ Success Indicators:

### API Response:
```json
{
  "success": true,
  "message": "Database connection successful"
}
```

### CORS Headers Present:
```
access-control-allow-origin: *
access-control-allow-methods: GET, POST, PUT, DELETE, OPTIONS
```

### No Console Errors:
- ✅ No CORS errors
- ✅ API calls successful
- ✅ Images load
- ✅ Videos load

---

**Done! Upload files baru dan test lagi!** 🚀

