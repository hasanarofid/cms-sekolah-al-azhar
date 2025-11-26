# Instruksi Migrasi Halaman dari Client Request

## ⚠️ PENTING: Schema Database Harus Sudah Ada!

Migrasi ini **HANYA** untuk menambahkan data (Menu dan Pages). 
**Tabel-tabel database harus sudah dibuat terlebih dahulu** dengan mengimport `schema.sql`.

## Langkah-langkah:

### 1. Import Schema Database (WAJIB!)

Jika belum pernah import schema, jalankan:

```bash
cd php-backend
mysql -u root -p db_alazhar < database/schema.sql
```

Ini akan membuat semua tabel yang diperlukan (User, Menu, Page, dll).

### 2. Buat User Admin (Jika Belum Ada)

Setelah schema diimport, buat user admin melalui:
- Admin panel (jika sudah bisa login)
- Atau langsung insert via SQL:

```sql
INSERT INTO `User` (`id`, `email`, `password`, `name`, `role`, `createdAt`, `updatedAt`)
VALUES (
    'user_admin_001',
    'admin@alazhar.ac.id',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: admin123
    'Administrator',
    'admin',
    NOW(3),
    NOW(3)
);
```

**Catatan:** Password default adalah `admin123` - **HARUS DIUBAH** setelah login pertama!

### 3. Jalankan Migrasi Halaman

Setelah schema dan user sudah ada, jalankan migrasi:

```bash
mysql -u root -p db_alazhar < database/migrations/create_pages_from_client_request.sql
```

## Jika Error "Table doesn't exist"

Jika mendapat error seperti:
```
ERROR 1146 (42S02): Table 'db_alazhar.User' doesn't exist
```

Berarti schema belum diimport. **Lakukan langkah 1 terlebih dahulu!**

## Isi Migrasi

Migrasi ini akan membuat:

### Menu Items (7 menu):
1. Beranda
2. Selayang Pandang
3. Visi & Misi
4. Kurikulum
5. Program
6. Beasiswa
7. Kontak

### Pages (6 halaman):
1. Selayang Pandang - Konten tentang sekolah
2. Visi & Misi - Visi, misi, tujuan, dan tagline
3. Kurikulum - ITGS Curriculum dan jam belajar
4. Program - Kelas talent dan ekstrakurikuler
5. Beasiswa - Program beasiswa
6. Kontak - Alamat dan kontak sekolah

## Setelah Migrasi

1. **Cek Menu:** Login ke admin panel dan pastikan semua menu muncul
2. **Cek Pages:** Pastikan semua halaman terbuat dan bisa diakses
3. **Update Content:** Review dan sesuaikan konten jika perlu
4. **Upload Images:** Upload gambar-gambar yang diperlukan (logo, foto gedung, dll)
5. **Ubah Password:** Pastikan password admin sudah diubah dari default

## Troubleshooting

### Error: "Table 'User' doesn't exist"
→ Import schema.sql terlebih dahulu (langkah 1)

### Error: "Duplicate entry"
→ Migrasi sudah pernah dijalankan. Ini aman, data tidak akan duplikat karena menggunakan `ON DUPLICATE KEY UPDATE`

### Error: "Foreign key constraint fails"
→ Pastikan semua tabel sudah dibuat dari schema.sql

