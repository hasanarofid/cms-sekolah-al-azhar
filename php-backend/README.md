# PHP Backend API untuk CMS Sekolah

Backend PHP native yang menggantikan Next.js API Routes untuk kompatibilitas dengan hosting tanpa Node.js.

## Instalasi

### 1. Install Dependencies

```bash
cd php-backend
composer install
```

### 2. Setup Database

1. Buat database MySQL baru
2. Import schema:
```bash
mysql -u username -p database_name < database/schema.sql
```

### 3. Konfigurasi

1. Copy `.env.example` ke `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` dengan kredensial database Anda:
```
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=cmssekolah
DB_USERNAME=your_username
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key
```

### 4. Migrasi Data dari SQLite

Jika Anda memiliki data di SQLite yang ingin dimigrasikan:

```bash
php scripts/migrate-sqlite-to-mysql.php
```

### 5. Setup Upload Directory

Pastikan direktori uploads dapat ditulis:
```bash
mkdir -p public/uploads/sliders
chmod 755 public/uploads/sliders
```

## Struktur Folder

```
php-backend/
├── config/          # Konfigurasi aplikasi
├── database/        # Schema SQL
├── public/          # Entry point dan file publik
├── scripts/         # Script utilitas
└── src/             # Source code aplikasi
    ├── Controllers/ # Controller untuk setiap endpoint
    ├── Auth.php     # Authentication handler
    ├── Database.php # Database connection
    ├── Response.php # Response helper
    └── Utils.php    # Utility functions
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `GET /api/auth/session` - Get current session

### Admin Endpoints (Require Authentication)
- Categories: `/api/admin/categories`
- Posts: `/api/admin/posts`
- Pages: `/api/admin/pages`
- Menus: `/api/admin/menus`
- Sliders: `/api/admin/sliders`
- FAQs: `/api/admin/faqs`
- Figures: `/api/admin/figures`
- Home Sections: `/api/admin/home-sections`
- Partnerships: `/api/admin/partnerships`
- Settings: `/api/admin/settings`
- Upload: `/api/admin/upload`
- Contacts: `/api/admin/contacts`

### Public Endpoints
- `POST /api/contact` - Submit contact form

## Deployment ke Hostinger

1. Upload semua file ke hosting (via FTP/cPanel File Manager)
2. Pastikan struktur folder tetap sama
3. Set document root ke folder `public/`
4. Pastikan `.htaccess` sudah ter-upload
5. Update `.env` dengan kredensial database production
6. Jalankan `composer install --no-dev --optimize-autoloader` di server
7. Import database schema
8. Jalankan script migrasi jika perlu

## Testing

Untuk testing lokal, Anda bisa menggunakan PHP built-in server:

**Cara 1 (Recommended - dengan router untuk static files):**
```bash
cd php-backend/public
php -S localhost:8000 router.php
```

**Cara 2 (Dari root php-backend):**
```bash
cd php-backend
php -S localhost:8000 -t public public/router.php
```

**Cara 3 (Tanpa router - kurang optimal untuk static files):**
```bash
cd php-backend/public
php -S localhost:8000
```

Kemudian akses API di: `http://localhost:8000/api/...`

**Catatan:** Router script (`router.php`) diperlukan untuk serve static files (images, dll) dengan CORS headers yang benar.

## Integrasi dengan Next.js

Update file `.env.local` di Next.js:

```
NEXT_PUBLIC_API_URL=http://your-domain.com/api
```

Atau untuk development:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Kemudian update semua fetch calls di Next.js untuk menggunakan `process.env.NEXT_PUBLIC_API_URL` sebagai base URL.

