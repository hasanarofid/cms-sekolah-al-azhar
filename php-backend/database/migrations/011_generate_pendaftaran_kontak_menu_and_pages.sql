-- Migration: Generate Pendaftaran and Kontak Menu Structure and Pages
-- Date: 2025-01-XX
-- Description: Create Pendaftaran menu with child menus and Kontak menu with default pages with template with-header

-- Generate unique IDs
SET @menu_pendaftaran_id = CONCAT('menu_', UNIX_TIMESTAMP(), '_pendaftaran');
SET @menu_alur_pendaftaran_id = CONCAT('menu_', UNIX_TIMESTAMP(), '_alur_pendaftaran');
SET @menu_program_al_fatih_academy_id = CONCAT('menu_', UNIX_TIMESTAMP(), '_program_al_fatih_academy');
SET @menu_program_murid_inden_id = CONCAT('menu_', UNIX_TIMESTAMP(), '_program_murid_inden');
SET @menu_data_awal_animo_id = CONCAT('menu_', UNIX_TIMESTAMP(), '_data_awal_animo');
SET @menu_qna_id = CONCAT('menu_', UNIX_TIMESTAMP(), '_qna');
SET @menu_brosur_id = CONCAT('menu_', UNIX_TIMESTAMP(), '_brosur');
SET @menu_kontak_id = CONCAT('menu_', UNIX_TIMESTAMP(), '_kontak');

-- Get first admin user ID
SET @admin_id = (SELECT id FROM User LIMIT 1);

-- Insert Pendaftaran (Parent) - Skip if exists
INSERT IGNORE INTO `Menu` (`id`, `title`, `titleEn`, `slug`, `parentId`, `order`, `isActive`, `menuType`, `createdAt`, `updatedAt`)
VALUES (
  @menu_pendaftaran_id,
  'Pendaftaran',
  'Registration',
  'pendaftaran',
  NULL,
  6,
  1,
  'page',
  NOW(),
  NOW()
);

-- Get existing Pendaftaran menu ID if it already exists
SET @menu_pendaftaran_id = COALESCE(
  (SELECT id FROM Menu WHERE slug = 'pendaftaran' AND parentId IS NULL LIMIT 1),
  @menu_pendaftaran_id
);

-- Update order if menu already exists
UPDATE `Menu` SET `order` = 6 WHERE `id` = @menu_pendaftaran_id;

-- Insert Pendaftaran Child Menus - Skip if exists
INSERT IGNORE INTO `Menu` (`id`, `title`, `titleEn`, `slug`, `parentId`, `order`, `isActive`, `menuType`, `createdAt`, `updatedAt`)
VALUES
  (@menu_alur_pendaftaran_id, 'Alur Pendaftaran', 'Registration Flow', 'alur-pendaftaran', @menu_pendaftaran_id, 0, 1, 'page', NOW(), NOW()),
  (@menu_program_al_fatih_academy_id, 'Program Al Fatih Academy', 'Al Fatih Academy Program', 'program-al-fatih-academy', @menu_pendaftaran_id, 1, 1, 'page', NOW(), NOW()),
  (@menu_program_murid_inden_id, 'Program Murid Inden', 'Pre-Enrollment Program', 'program-murid-inden', @menu_pendaftaran_id, 2, 1, 'page', NOW(), NOW()),
  (@menu_data_awal_animo_id, 'Data Awal Animo Calon Murid', 'Initial Interest Data for Prospective Students', 'data-awal-animo-calon-murid', @menu_pendaftaran_id, 3, 1, 'page', NOW(), NOW()),
  (@menu_qna_id, 'QnA (Question & Answer)', 'QnA (Question & Answer)', 'qna', @menu_pendaftaran_id, 4, 1, 'page', NOW(), NOW()),
  (@menu_brosur_id, 'Brosur', 'Brochure', 'brosur', @menu_pendaftaran_id, 5, 1, 'page', NOW(), NOW());

-- Get existing menu IDs if they already exist
SET @menu_alur_pendaftaran_id = COALESCE((SELECT id FROM Menu WHERE slug = 'alur-pendaftaran' AND parentId = @menu_pendaftaran_id LIMIT 1), @menu_alur_pendaftaran_id);
SET @menu_program_al_fatih_academy_id = COALESCE((SELECT id FROM Menu WHERE slug = 'program-al-fatih-academy' AND parentId = @menu_pendaftaran_id LIMIT 1), @menu_program_al_fatih_academy_id);
SET @menu_program_murid_inden_id = COALESCE((SELECT id FROM Menu WHERE slug = 'program-murid-inden' AND parentId = @menu_pendaftaran_id LIMIT 1), @menu_program_murid_inden_id);
SET @menu_data_awal_animo_id = COALESCE((SELECT id FROM Menu WHERE slug = 'data-awal-animo-calon-murid' AND parentId = @menu_pendaftaran_id LIMIT 1), @menu_data_awal_animo_id);
SET @menu_qna_id = COALESCE((SELECT id FROM Menu WHERE slug = 'qna' AND parentId = @menu_pendaftaran_id LIMIT 1), @menu_qna_id);
SET @menu_brosur_id = COALESCE((SELECT id FROM Menu WHERE slug = 'brosur' AND parentId = @menu_pendaftaran_id LIMIT 1), @menu_brosur_id);

-- Insert Kontak Menu (without child) - Skip if exists
INSERT IGNORE INTO `Menu` (`id`, `title`, `titleEn`, `slug`, `parentId`, `order`, `isActive`, `menuType`, `createdAt`, `updatedAt`)
VALUES (
  @menu_kontak_id,
  'Kontak',
  'Contact',
  'kontak',
  NULL,
  7,
  1,
  'page',
  NOW(),
  NOW()
);

-- Get existing Kontak menu ID if it already exists
SET @menu_kontak_id = COALESCE(
  (SELECT id FROM Menu WHERE slug = 'kontak' AND parentId IS NULL LIMIT 1),
  @menu_kontak_id
);

-- Update order if menu already exists
UPDATE `Menu` SET `order` = 7 WHERE `id` = @menu_kontak_id;

-- Create default pages for Pendaftaran child menus (with template with-header) - Skip if page already exists for menu
INSERT IGNORE INTO `Page` (`id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `menuId`, `pageType`, `template`, `isPublished`, `authorId`, `createdAt`, `updatedAt`)
SELECT 
  CONCAT('page_', UNIX_TIMESTAMP(), '_', SUBSTRING(@menu_alur_pendaftaran_id, -10)),
  'Alur Pendaftaran',
  'Registration Flow',
  'alur-pendaftaran',
  '<h2>Alur Pendaftaran</h2><p>Konten alur pendaftaran akan ditambahkan di sini.</p>',
  '<h2>Registration Flow</h2><p>Registration flow content will be added here.</p>',
  @menu_alur_pendaftaran_id,
  'standard',
  'with-header',
  1,
  @admin_id,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM Page WHERE menuId = @menu_alur_pendaftaran_id);

INSERT IGNORE INTO `Page` (`id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `menuId`, `pageType`, `template`, `isPublished`, `authorId`, `createdAt`, `updatedAt`)
SELECT 
  CONCAT('page_', UNIX_TIMESTAMP(), '_', SUBSTRING(@menu_program_al_fatih_academy_id, -10)),
  'Program Al Fatih Academy',
  'Al Fatih Academy Program',
  'program-al-fatih-academy',
  '<h2>Program Al Fatih Academy</h2><p>Konten program Al Fatih Academy akan ditambahkan di sini.</p>',
  '<h2>Al Fatih Academy Program</h2><p>Al Fatih Academy program content will be added here.</p>',
  @menu_program_al_fatih_academy_id,
  'standard',
  'with-header',
  1,
  @admin_id,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM Page WHERE menuId = @menu_program_al_fatih_academy_id);

INSERT IGNORE INTO `Page` (`id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `menuId`, `pageType`, `template`, `isPublished`, `authorId`, `createdAt`, `updatedAt`)
SELECT 
  CONCAT('page_', UNIX_TIMESTAMP(), '_', SUBSTRING(@menu_program_murid_inden_id, -10)),
  'Program Murid Inden',
  'Pre-Enrollment Program',
  'program-murid-inden',
  '<h2>Program Murid Inden</h2><p>Konten program murid inden akan ditambahkan di sini.</p>',
  '<h2>Pre-Enrollment Program</h2><p>Pre-enrollment program content will be added here.</p>',
  @menu_program_murid_inden_id,
  'standard',
  'with-header',
  1,
  @admin_id,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM Page WHERE menuId = @menu_program_murid_inden_id);

INSERT IGNORE INTO `Page` (`id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `menuId`, `pageType`, `template`, `isPublished`, `authorId`, `createdAt`, `updatedAt`)
SELECT 
  CONCAT('page_', UNIX_TIMESTAMP(), '_', SUBSTRING(@menu_data_awal_animo_id, -10)),
  'Data Awal Animo Calon Murid',
  'Initial Interest Data for Prospective Students',
  'data-awal-animo-calon-murid',
  '<h2>Data Awal Animo Calon Murid</h2><p>Konten data awal animo calon murid akan ditambahkan di sini.</p>',
  '<h2>Initial Interest Data for Prospective Students</h2><p>Initial interest data for prospective students content will be added here.</p>',
  @menu_data_awal_animo_id,
  'standard',
  'with-header',
  1,
  @admin_id,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM Page WHERE menuId = @menu_data_awal_animo_id);

INSERT IGNORE INTO `Page` (`id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `menuId`, `pageType`, `template`, `isPublished`, `authorId`, `createdAt`, `updatedAt`)
SELECT 
  CONCAT('page_', UNIX_TIMESTAMP(), '_', SUBSTRING(@menu_qna_id, -10)),
  'QnA (Question & Answer)',
  'QnA (Question & Answer)',
  'qna',
  '<h2>QnA (Question & Answer)</h2><p>Konten pertanyaan dan jawaban akan ditambahkan di sini.</p>',
  '<h2>QnA (Question & Answer)</h2><p>Question and answer content will be added here.</p>',
  @menu_qna_id,
  'standard',
  'with-header',
  1,
  @admin_id,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM Page WHERE menuId = @menu_qna_id);

INSERT IGNORE INTO `Page` (`id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `menuId`, `pageType`, `template`, `isPublished`, `authorId`, `createdAt`, `updatedAt`)
SELECT 
  CONCAT('page_', UNIX_TIMESTAMP(), '_', SUBSTRING(@menu_brosur_id, -10)),
  'Brosur',
  'Brochure',
  'brosur',
  '<h2>Brosur</h2><p>Konten brosur akan ditambahkan di sini.</p>',
  '<h2>Brochure</h2><p>Brochure content will be added here.</p>',
  @menu_brosur_id,
  'standard',
  'with-header',
  1,
  @admin_id,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM Page WHERE menuId = @menu_brosur_id);

-- Create default page for Kontak menu (with template with-header and slug /kontak) - Skip if page already exists for menu
INSERT IGNORE INTO `Page` (`id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `menuId`, `pageType`, `template`, `isPublished`, `authorId`, `createdAt`, `updatedAt`)
SELECT 
  CONCAT('page_', UNIX_TIMESTAMP(), '_', SUBSTRING(@menu_kontak_id, -10)),
  'Kontak',
  'Contact',
  'kontak',
  '<h2>Kontak</h2><p>Halaman kontak dan informasi kontak akan ditampilkan di sini.</p>',
  '<h2>Contact</h2><p>Contact page and contact information will be displayed here.</p>',
  @menu_kontak_id,
  'standard',
  'with-header',
  1,
  @admin_id,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM Page WHERE menuId = @menu_kontak_id);

