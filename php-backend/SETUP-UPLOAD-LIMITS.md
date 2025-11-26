# Setup Upload Limits untuk Video Files

## 1. Ubuntu (Development - PHP Built-in Server)

### Opsi A: Set via .htaccess (sudah dibuat)
File `.htaccess` sudah dibuat di `public/.htaccess` dengan konfigurasi:
- `upload_max_filesize = 50M`
- `post_max_size = 55M`

**Catatan:** PHP built-in server (`php -S`) **TIDAK** membaca `.htaccess`. Anda perlu set via `php.ini` atau command line.

### Opsi B: Set via php.ini (Recommended untuk Development)

1. Cari lokasi `php.ini`:
```bash
php --ini
```

2. Edit `php.ini`:
```bash
sudo nano /etc/php/8.3/cli/php.ini  # Untuk CLI (php -S)
# atau
sudo nano /etc/php/8.3/apache2/php.ini  # Untuk Apache
# atau
sudo nano /etc/php/8.3/fpm/php.ini  # Untuk PHP-FPM
```

3. Cari dan ubah:
```ini
upload_max_filesize = 50M
post_max_size = 55M
max_execution_time = 300
max_input_time = 300
memory_limit = 128M
```

4. Restart PHP server (jika menggunakan Apache/FPM):
```bash
sudo systemctl restart apache2
# atau
sudo systemctl restart php8.3-fpm
```

### Opsi C: Set via Command Line (Untuk PHP Built-in Server)

Jalankan PHP server dengan konfigurasi custom:
```bash
cd php-backend/public
php -d upload_max_filesize=50M -d post_max_size=55M -d max_execution_time=300 -S localhost:8000
```

Atau buat script helper:
```bash
# Buat file: php-backend/start-server.sh
#!/bin/bash
cd "$(dirname "$0")/public"
php -d upload_max_filesize=50M \
    -d post_max_size=55M \
    -d max_execution_time=300 \
    -d max_input_time=300 \
    -d memory_limit=128M \
    -S localhost:8000
```

Lalu jalankan:
```bash
chmod +x php-backend/start-server.sh
./php-backend/start-server.sh
```

## 2. Hostinger (Production)

### Opsi A: Via .htaccess (Paling Mudah)

File `.htaccess` sudah dibuat di `public/.htaccess`. Pastikan file ini ter-upload ke Hostinger.

**Path di Hostinger:** `public_html/api/.htaccess` atau `public_html/.htaccess` (tergantung struktur folder)

### Opsi B: Via cPanel (Jika .htaccess tidak bekerja)

1. Login ke cPanel Hostinger
2. Buka **"Select PHP Version"** atau **"MultiPHP INI Editor"**
3. Pilih domain/website Anda
4. Edit `php.ini` atau set via interface:
   - `upload_max_filesize = 50M`
   - `post_max_size = 55M`
   - `max_execution_time = 300`
   - `max_input_time = 300`
   - `memory_limit = 128M`
5. Save dan restart PHP jika perlu

### Opsi C: Via File Manager (Manual php.ini)

1. Login ke cPanel → **File Manager**
2. Navigate ke root website Anda
3. Buat atau edit file `php.ini` (jika belum ada)
4. Tambahkan:
```ini
upload_max_filesize = 50M
post_max_size = 55M
max_execution_time = 300
max_input_time = 300
memory_limit = 128M
```
5. Save file

### Opsi D: Via .user.ini (Alternatif)

Jika `php.ini` tidak bekerja, coba buat file `.user.ini` di root website:
```ini
upload_max_filesize = 50M
post_max_size = 55M
max_execution_time = 300
max_input_time = 300
memory_limit = 128M
```

**Catatan:** Perubahan `.user.ini` bisa memakan waktu beberapa menit untuk diterapkan.

## 3. Verifikasi Konfigurasi

### Di Ubuntu (Development):
```bash
php -r "echo 'upload_max_filesize: ' . ini_get('upload_max_filesize') . PHP_EOL; echo 'post_max_size: ' . ini_get('post_max_size') . PHP_EOL;"
```

### Di Hostinger:
Buat file `test-php-info.php`:
```php
<?php
phpinfo();
?>
```

Upload ke Hostinger dan akses via browser. Cari:
- `upload_max_filesize`
- `post_max_size`

Atau buat endpoint test di API:
```php
// Di InfoController atau buat endpoint baru
echo json_encode([
    'upload_max_filesize' => ini_get('upload_max_filesize'),
    'post_max_size' => ini_get('post_max_size'),
    'max_execution_time' => ini_get('max_execution_time'),
    'memory_limit' => ini_get('memory_limit'),
]);
```

## 4. Troubleshooting

### Jika upload masih gagal:

1. **Cek error code di UploadController** - Error message sekarang lebih detail
2. **Cek log error PHP** - Biasanya di `/var/log/apache2/error.log` atau cPanel error log
3. **Pastikan folder uploads writable:**
   ```bash
   chmod -R 755 public/uploads/
   ```
4. **Cek disk space:**
   ```bash
   df -h
   ```

### Untuk Hostinger khususnya:

- Pastikan `.htaccess` ter-upload dengan benar
- Cek apakah mod_php atau PHP-FPM digunakan (beberapa setting berbeda)
- Jika menggunakan PHP-FPM, mungkin perlu set di `php-fpm.conf` juga
- Kontak support Hostinger jika masih bermasalah

