# Instalasi PHP Backend

## Persyaratan

- PHP >= 7.4
- MySQL >= 5.7 atau MariaDB >= 10.2
- Composer
- Extension PHP: PDO, PDO_MySQL, JSON, mbstring

## Langkah Instalasi

### 1. Install Composer Dependencies

```bash
cd php-backend
composer install
```

### 2. Setup Database

1. Buat database MySQL:
```sql
CREATE DATABASE cmssekolah CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Import schema:
```bash
mysql -u username -p cmssekolah < database/schema.sql
```

### 3. Konfigurasi Environment

1. Copy file `.env.example` ke `.env`:
```bash
cp .env.example .env
```

2. Edit file `.env` dengan kredensial database Anda:
```env
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=cmssekolah
DB_USERNAME=your_username
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key-min-32-characters-long
```

### 4. Migrasi Data dari SQLite (Opsional)

Jika Anda memiliki data di SQLite yang ingin dimigrasikan:

```bash
php scripts/migrate-sqlite-to-mysql.php
```

**Catatan:** Pastikan file `prisma/dev.db` ada di root project sebelum menjalankan script ini.

### 5. Setup Upload Directory

```bash
mkdir -p public/uploads/sliders
chmod 755 public/uploads/sliders
```

### 6. Testing Lokal

Jalankan PHP built-in server:

```bash
cd php-backend/public
php -S localhost:8000
```

Test endpoint:
```bash
curl http://localhost:8000/api/admin/categories
```

## Deployment ke Hostinger

### Via cPanel File Manager:

1. **Upload Files:**
   - Upload seluruh folder `php-backend` ke hosting
   - Atau upload isi folder ke `public_html/api` (sesuaikan struktur)

2. **Setup Database:**
   - Buat database MySQL di cPanel
   - Import `database/schema.sql` via phpMyAdmin
   - Jalankan script migrasi jika perlu

3. **Konfigurasi:**
   - Buat file `.env` di server dengan kredensial database production
   - Pastikan `JWT_SECRET` sama dengan yang digunakan di Next.js

4. **Install Dependencies:**
   - Via SSH (jika tersedia):
     ```bash
     cd public_html/api
     composer install --no-dev --optimize-autoloader
     ```
   - Atau upload folder `vendor/` dari lokal (setelah `composer install`)

5. **Setup .htaccess:**
   - Pastikan file `.htaccess` sudah ter-upload
   - Pastikan mod_rewrite aktif di hosting

6. **Set Permissions:**
   - Folder `public/uploads/` harus writable (755 atau 777)
   - File `.env` harus readable (644)

### Via FTP:

1. Connect ke hosting via FTP client
2. Upload semua file ke folder yang sesuai
3. Ikuti langkah 2-6 di atas

## Troubleshooting

### Error: "Database connection failed"
- Pastikan kredensial di `.env` benar
- Pastikan database sudah dibuat
- Pastikan user database punya akses ke database

### Error: "Class not found"
- Pastikan `composer install` sudah dijalankan
- Pastikan autoloader sudah di-generate

### Error: "404 Not Found"
- Pastikan `.htaccess` sudah ter-upload
- Pastikan mod_rewrite aktif
- Cek path di `index.php` sesuai dengan struktur folder

### Error: "Unauthorized"
- Pastikan token JWT valid
- Pastikan `JWT_SECRET` sama di backend dan frontend
- Cek format Authorization header: `Bearer <token>`

### Upload tidak bekerja
- Pastikan folder `public/uploads/` writable
- Cek `upload_max_filesize` dan `post_max_size` di php.ini
- Pastikan extension file yang diizinkan sesuai

## Testing API

### Test Login:
```bash
curl -X POST http://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

### Test Get Categories (dengan auth):
```bash
curl http://your-domain.com/api/admin/categories \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Security Checklist

- [ ] Ganti `JWT_SECRET` dengan random string yang kuat
- [ ] Pastikan `.env` tidak ter-upload ke public
- [ ] Setup HTTPS/SSL
- [ ] Update `ALLOWED_ORIGINS` di `config/config.php`
- [ ] Pastikan database user punya privilege minimal yang diperlukan
- [ ] Setup firewall jika memungkinkan
- [ ] Regular backup database

