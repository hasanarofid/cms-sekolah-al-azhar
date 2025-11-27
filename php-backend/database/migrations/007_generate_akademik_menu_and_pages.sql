-- Migration: Generate Akademik Menu Structure and Pages
-- Date: 2025-01-XX
-- Description: Create Akademik > SMA menu structure with child menus and default pages

-- Generate unique IDs
SET @menu_akademik_id = CONCAT('menu_', UNIX_TIMESTAMP(), '_akademik');
SET @menu_sma_id = CONCAT('menu_', UNIX_TIMESTAMP(), '_sma');
SET @menu_sma_struktur_sekolah_id = CONCAT('menu_', UNIX_TIMESTAMP(), '_sma_struktur_sekolah');
SET @menu_sma_struktur_boarding_id = CONCAT('menu_', UNIX_TIMESTAMP(), '_sma_struktur_boarding');
SET @menu_sma_prestasi_id = CONCAT('menu_', UNIX_TIMESTAMP(), '_sma_prestasi');
SET @menu_sma_profil_lulusan_id = CONCAT('menu_', UNIX_TIMESTAMP(), '_sma_profil_lulusan');
SET @menu_sma_profil_lulusan_detail_id = CONCAT('menu_', UNIX_TIMESTAMP(), '_sma_profil_lulusan_detail');
SET @menu_sma_alumni_id = CONCAT('menu_', UNIX_TIMESTAMP(), '_sma_alumni');
SET @menu_sma_kurikulum_id = CONCAT('menu_', UNIX_TIMESTAMP(), '_sma_kurikulum');
SET @menu_sma_ekstrakurikuler_id = CONCAT('menu_', UNIX_TIMESTAMP(), '_sma_ekstrakurikuler');
SET @menu_sma_kalender_id = CONCAT('menu_', UNIX_TIMESTAMP(), '_sma_kalender');
SET @menu_sma_lms_id = CONCAT('menu_', UNIX_TIMESTAMP(), '_sma_lms');
SET @menu_sma_bos_id = CONCAT('menu_', UNIX_TIMESTAMP(), '_sma_bos');

-- Get first admin user ID
SET @admin_id = (SELECT id FROM User LIMIT 1);

-- Insert Akademik (Parent) - Skip if exists
INSERT IGNORE INTO `Menu` (`id`, `title`, `titleEn`, `slug`, `parentId`, `order`, `isActive`, `menuType`, `createdAt`, `updatedAt`)
VALUES (
  @menu_akademik_id,
  'Akademik',
  'Academic',
  'akademik',
  NULL,
  2,
  1,
  'page',
  NOW(),
  NOW()
);

-- Get existing Akademik menu ID if it already exists
SET @menu_akademik_id = COALESCE(
  (SELECT id FROM Menu WHERE slug = 'akademik' AND parentId IS NULL LIMIT 1),
  @menu_akademik_id
);

-- Insert SMA (Child of Akademik) - Skip if exists
INSERT IGNORE INTO `Menu` (`id`, `title`, `titleEn`, `slug`, `parentId`, `order`, `isActive`, `menuType`, `createdAt`, `updatedAt`)
VALUES (
  @menu_sma_id,
  'SMA',
  'Senior High School',
  'sma',
  @menu_akademik_id,
  0,
  1,
  'page',
  NOW(),
  NOW()
);

-- Get existing SMA menu ID if it already exists
SET @menu_sma_id = COALESCE(
  (SELECT id FROM Menu WHERE slug = 'sma' AND parentId = @menu_akademik_id LIMIT 1),
  @menu_sma_id
);

-- Insert SMA Child Menus - Skip if exists
INSERT IGNORE INTO `Menu` (`id`, `title`, `titleEn`, `slug`, `parentId`, `order`, `isActive`, `menuType`, `createdAt`, `updatedAt`)
VALUES
  (@menu_sma_struktur_sekolah_id, 'Struktur Organisasi Sekolah', 'School Organization Structure', 'struktur-organisasi-sekolah', @menu_sma_id, 0, 1, 'page', NOW(), NOW()),
  (@menu_sma_struktur_boarding_id, 'Struktur Organisasi Boarding', 'Boarding Organization Structure', 'struktur-organisasi-boarding', @menu_sma_id, 1, 1, 'page', NOW(), NOW()),
  (@menu_sma_prestasi_id, 'Prestasi Siswa', 'Student Achievements', 'prestasi-siswa', @menu_sma_id, 2, 1, 'page', NOW(), NOW()),
  (@menu_sma_profil_lulusan_id, 'Profil Lulusan', 'Graduate Profile', 'profil-lulusan', @menu_sma_id, 3, 1, 'page', NOW(), NOW()),
  (@menu_sma_kurikulum_id, 'Kurikulum', 'Curriculum', 'kurikulum-sma', @menu_sma_id, 4, 1, 'page', NOW(), NOW()),
  (@menu_sma_ekstrakurikuler_id, 'Ekstrakurikuler', 'Extracurricular', 'ekstrakurikuler-sma', @menu_sma_id, 5, 1, 'page', NOW(), NOW()),
  (@menu_sma_kalender_id, 'Kalender Pendidikan', 'Academic Calendar', 'kalender-pendidikan-sma', @menu_sma_id, 6, 1, 'page', NOW(), NOW()),
  (@menu_sma_lms_id, 'LMS AAIIBS', 'LMS AAIIBS', 'lms-aaiibs-sma', @menu_sma_id, 7, 1, 'page', NOW(), NOW()),
  (@menu_sma_bos_id, 'Laporan Realisasi BOS', 'BOS Realization Report', 'laporan-realisasi-bos-sma', @menu_sma_id, 8, 1, 'page', NOW(), NOW());

-- Get existing menu IDs if they already exist
SET @menu_sma_struktur_sekolah_id = COALESCE((SELECT id FROM Menu WHERE slug = 'struktur-organisasi-sekolah' AND parentId = @menu_sma_id LIMIT 1), @menu_sma_struktur_sekolah_id);
SET @menu_sma_struktur_boarding_id = COALESCE((SELECT id FROM Menu WHERE slug = 'struktur-organisasi-boarding' AND parentId = @menu_sma_id LIMIT 1), @menu_sma_struktur_boarding_id);
SET @menu_sma_prestasi_id = COALESCE((SELECT id FROM Menu WHERE slug = 'prestasi-siswa' AND parentId = @menu_sma_id LIMIT 1), @menu_sma_prestasi_id);
SET @menu_sma_profil_lulusan_id = COALESCE((SELECT id FROM Menu WHERE slug = 'profil-lulusan' AND parentId = @menu_sma_id LIMIT 1), @menu_sma_profil_lulusan_id);
SET @menu_sma_kurikulum_id = COALESCE((SELECT id FROM Menu WHERE slug = 'kurikulum-sma' AND parentId = @menu_sma_id LIMIT 1), @menu_sma_kurikulum_id);
SET @menu_sma_ekstrakurikuler_id = COALESCE((SELECT id FROM Menu WHERE slug = 'ekstrakurikuler-sma' AND parentId = @menu_sma_id LIMIT 1), @menu_sma_ekstrakurikuler_id);
SET @menu_sma_kalender_id = COALESCE((SELECT id FROM Menu WHERE slug = 'kalender-pendidikan-sma' AND parentId = @menu_sma_id LIMIT 1), @menu_sma_kalender_id);
SET @menu_sma_lms_id = COALESCE((SELECT id FROM Menu WHERE slug = 'lms-aaiibs-sma' AND parentId = @menu_sma_id LIMIT 1), @menu_sma_lms_id);
SET @menu_sma_bos_id = COALESCE((SELECT id FROM Menu WHERE slug = 'laporan-realisasi-bos-sma' AND parentId = @menu_sma_id LIMIT 1), @menu_sma_bos_id);

-- Insert Profil Lulusan Submenu - Skip if exists
INSERT IGNORE INTO `Menu` (`id`, `title`, `titleEn`, `slug`, `parentId`, `order`, `isActive`, `menuType`, `createdAt`, `updatedAt`)
VALUES
  (@menu_sma_profil_lulusan_detail_id, 'Profil Lulusan', 'Graduate Profile', 'profil-lulusan-detail', @menu_sma_profil_lulusan_id, 0, 1, 'page', NOW(), NOW()),
  (@menu_sma_alumni_id, 'Alumni', 'Alumni', 'alumni-sma', @menu_sma_profil_lulusan_id, 1, 1, 'page', NOW(), NOW());

-- Get existing submenu IDs if they already exist
SET @menu_sma_profil_lulusan_detail_id = COALESCE((SELECT id FROM Menu WHERE slug = 'profil-lulusan-detail' AND parentId = @menu_sma_profil_lulusan_id LIMIT 1), @menu_sma_profil_lulusan_detail_id);
SET @menu_sma_alumni_id = COALESCE((SELECT id FROM Menu WHERE slug = 'alumni-sma' AND parentId = @menu_sma_profil_lulusan_id LIMIT 1), @menu_sma_alumni_id);

-- Create default pages for each menu (with template with-header) - Skip if page already exists for menu
INSERT IGNORE INTO `Page` (`id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `menuId`, `pageType`, `template`, `isPublished`, `authorId`, `createdAt`, `updatedAt`)
SELECT 
  CONCAT('page_', UNIX_TIMESTAMP(), '_', SUBSTRING(@menu_sma_struktur_sekolah_id, -10)),
  'Struktur Organisasi Sekolah',
  'School Organization Structure',
  'struktur-organisasi-sekolah',
  '<h2>Struktur Organisasi Sekolah</h2><p>Konten struktur organisasi sekolah akan ditambahkan di sini.</p>',
  '<h2>School Organization Structure</h2><p>School organization structure content will be added here.</p>',
  @menu_sma_struktur_sekolah_id,
  'standard',
  'with-header',
  1,
  @admin_id,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM Page WHERE menuId = @menu_sma_struktur_sekolah_id);

INSERT IGNORE INTO `Page` (`id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `menuId`, `pageType`, `template`, `isPublished`, `authorId`, `createdAt`, `updatedAt`)
SELECT 
  CONCAT('page_', UNIX_TIMESTAMP(), '_', SUBSTRING(@menu_sma_struktur_boarding_id, -10)),
  'Struktur Organisasi Boarding',
  'Boarding Organization Structure',
  'struktur-organisasi-boarding',
  '<h2>Struktur Organisasi Boarding</h2><p>Konten struktur organisasi boarding akan ditambahkan di sini.</p>',
  '<h2>Boarding Organization Structure</h2><p>Boarding organization structure content will be added here.</p>',
  @menu_sma_struktur_boarding_id,
  'standard',
  'with-header',
  1,
  @admin_id,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM Page WHERE menuId = @menu_sma_struktur_boarding_id);

INSERT IGNORE INTO `Page` (`id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `menuId`, `pageType`, `template`, `isPublished`, `authorId`, `createdAt`, `updatedAt`)
SELECT 
  CONCAT('page_', UNIX_TIMESTAMP(), '_', SUBSTRING(@menu_sma_prestasi_id, -10)),
  'Prestasi Siswa',
  'Student Achievements',
  'prestasi-siswa',
  '<h2>Prestasi Siswa</h2><p>Konten prestasi siswa akan ditambahkan di sini.</p>',
  '<h2>Student Achievements</h2><p>Student achievements content will be added here.</p>',
  @menu_sma_prestasi_id,
  'standard',
  'with-header',
  1,
  @admin_id,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM Page WHERE menuId = @menu_sma_prestasi_id);

INSERT IGNORE INTO `Page` (`id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `menuId`, `pageType`, `template`, `isPublished`, `authorId`, `createdAt`, `updatedAt`)
SELECT 
  CONCAT('page_', UNIX_TIMESTAMP(), '_', SUBSTRING(@menu_sma_profil_lulusan_id, -10)),
  'Profil Lulusan',
  'Graduate Profile',
  'profil-lulusan',
  '<h2>Profil Lulusan</h2><p>Konten profil lulusan akan ditambahkan di sini.</p>',
  '<h2>Graduate Profile</h2><p>Graduate profile content will be added here.</p>',
  @menu_sma_profil_lulusan_id,
  'standard',
  'with-header',
  1,
  @admin_id,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM Page WHERE menuId = @menu_sma_profil_lulusan_id);

INSERT IGNORE INTO `Page` (`id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `menuId`, `pageType`, `template`, `isPublished`, `authorId`, `createdAt`, `updatedAt`)
SELECT 
  CONCAT('page_', UNIX_TIMESTAMP(), '_', SUBSTRING(@menu_sma_profil_lulusan_detail_id, -10)),
  'Profil Lulusan',
  'Graduate Profile',
  'profil-lulusan-detail',
  '<h2>Profil Lulusan</h2><p>Konten detail profil lulusan akan ditambahkan di sini.</p>',
  '<h2>Graduate Profile</h2><p>Graduate profile detail content will be added here.</p>',
  @menu_sma_profil_lulusan_detail_id,
  'standard',
  'with-header',
  1,
  @admin_id,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM Page WHERE menuId = @menu_sma_profil_lulusan_detail_id);

INSERT IGNORE INTO `Page` (`id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `menuId`, `pageType`, `template`, `isPublished`, `authorId`, `createdAt`, `updatedAt`)
SELECT 
  CONCAT('page_', UNIX_TIMESTAMP(), '_', SUBSTRING(@menu_sma_alumni_id, -10)),
  'Alumni',
  'Alumni',
  'alumni-sma',
  '<h2>Alumni</h2><p>Konten alumni akan ditambahkan di sini.</p>',
  '<h2>Alumni</h2><p>Alumni content will be added here.</p>',
  @menu_sma_alumni_id,
  'standard',
  'with-header',
  1,
  @admin_id,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM Page WHERE menuId = @menu_sma_alumni_id);

INSERT IGNORE INTO `Page` (`id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `menuId`, `pageType`, `template`, `isPublished`, `authorId`, `createdAt`, `updatedAt`)
SELECT 
  CONCAT('page_', UNIX_TIMESTAMP(), '_', SUBSTRING(@menu_sma_kurikulum_id, -10)),
  'Kurikulum',
  'Curriculum',
  'kurikulum-sma',
  '<h2>Kurikulum</h2><p>Konten kurikulum akan ditambahkan di sini.</p>',
  '<h2>Curriculum</h2><p>Curriculum content will be added here.</p>',
  @menu_sma_kurikulum_id,
  'standard',
  'with-header',
  1,
  @admin_id,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM Page WHERE menuId = @menu_sma_kurikulum_id);

INSERT IGNORE INTO `Page` (`id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `menuId`, `pageType`, `template`, `isPublished`, `authorId`, `createdAt`, `updatedAt`)
SELECT 
  CONCAT('page_', UNIX_TIMESTAMP(), '_', SUBSTRING(@menu_sma_ekstrakurikuler_id, -10)),
  'Ekstrakurikuler',
  'Extracurricular',
  'ekstrakurikuler-sma',
  '<h2>Ekstrakurikuler</h2><p>Konten ekstrakurikuler akan ditambahkan di sini.</p>',
  '<h2>Extracurricular</h2><p>Extracurricular content will be added here.</p>',
  @menu_sma_ekstrakurikuler_id,
  'standard',
  'with-header',
  1,
  @admin_id,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM Page WHERE menuId = @menu_sma_ekstrakurikuler_id);

INSERT IGNORE INTO `Page` (`id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `menuId`, `pageType`, `template`, `isPublished`, `authorId`, `createdAt`, `updatedAt`)
SELECT 
  CONCAT('page_', UNIX_TIMESTAMP(), '_', SUBSTRING(@menu_sma_kalender_id, -10)),
  'Kalender Pendidikan',
  'Academic Calendar',
  'kalender-pendidikan-sma',
  '<h2>Kalender Pendidikan</h2><p>Konten kalender pendidikan akan ditambahkan di sini.</p>',
  '<h2>Academic Calendar</h2><p>Academic calendar content will be added here.</p>',
  @menu_sma_kalender_id,
  'standard',
  'with-header',
  1,
  @admin_id,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM Page WHERE menuId = @menu_sma_kalender_id);

INSERT IGNORE INTO `Page` (`id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `menuId`, `pageType`, `template`, `isPublished`, `authorId`, `createdAt`, `updatedAt`)
SELECT 
  CONCAT('page_', UNIX_TIMESTAMP(), '_', SUBSTRING(@menu_sma_lms_id, -10)),
  'LMS AAIIBS',
  'LMS AAIIBS',
  'lms-aaiibs-sma',
  '<h2>LMS AAIIBS</h2><p>Konten LMS AAIIBS akan ditambahkan di sini.</p>',
  '<h2>LMS AAIIBS</h2><p>LMS AAIIBS content will be added here.</p>',
  @menu_sma_lms_id,
  'standard',
  'with-header',
  1,
  @admin_id,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM Page WHERE menuId = @menu_sma_lms_id);

INSERT IGNORE INTO `Page` (`id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `menuId`, `pageType`, `template`, `isPublished`, `authorId`, `createdAt`, `updatedAt`)
SELECT 
  CONCAT('page_', UNIX_TIMESTAMP(), '_', SUBSTRING(@menu_sma_bos_id, -10)),
  'Laporan Realisasi BOS',
  'BOS Realization Report',
  'laporan-realisasi-bos-sma',
  '<h2>Laporan Realisasi BOS</h2><p>Konten laporan realisasi BOS akan ditambahkan di sini.</p>',
  '<h2>BOS Realization Report</h2><p>BOS realization report content will be added here.</p>',
  @menu_sma_bos_id,
  'standard',
  'with-header',
  1,
  @admin_id,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM Page WHERE menuId = @menu_sma_bos_id);

