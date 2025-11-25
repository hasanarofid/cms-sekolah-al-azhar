# Quick Start Guide

Panduan cepat untuk memulai menggunakan PHP Backend.

## 1. Install Dependencies

```bash
cd php-backend
composer install
```

## 2. Setup Database

1. Buat database MySQL
2. Import schema:
```bash
mysql -u username -p database_name < database/schema.sql
```

## 3. Konfigurasi

1. Copy `.env.example` ke `.env`
2. Edit `.env` dengan kredensial database Anda

## 4. Migrasi Data (Opsional)

Jika ada data di SQLite:
```bash
php scripts/migrate-sqlite-to-mysql.php
```

## 5. Test

```bash
cd php-backend/public
php -S localhost:8000
```

Buka browser: `http://localhost:8000/api/admin/categories`

## 6. Integrasi dengan Next.js

1. Update `.env.local` di Next.js:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

2. Gunakan `apiClient` dari `lib/api-client.ts` untuk semua API calls

3. Update authentication menggunakan `lib/auth-php.ts`

Lihat `INTEGRASI-PHP-BACKEND.md` untuk detail lengkap.

## Struktur Endpoint

Semua endpoint mengikuti pola:
- `GET /api/admin/{resource}` - List semua
- `POST /api/admin/{resource}/create` - Create baru
- `GET /api/admin/{resource}/{id}` - Get by ID
- `PUT /api/admin/{resource}/{id}/update` - Update
- `DELETE /api/admin/{resource}/{id}/delete` - Delete

## Authentication

1. Login: `POST /api/auth/login` dengan `{email, password}`
2. Dapatkan token dari response
3. Gunakan token di header: `Authorization: Bearer {token}`
4. Check session: `GET /api/auth/session`

## Troubleshooting

- **Database error**: Cek kredensial di `.env`
- **404 error**: Pastikan `.htaccess` sudah ter-upload
- **Unauthorized**: Pastikan token valid dan di header
- **Upload error**: Pastikan folder `public/uploads/` writable

