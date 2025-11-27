-- Migration: Generate Fasilitas and Berita Menu Structure and Pages
-- Date: 2025-01-XX
-- Description: Create Fasilitas menu with child menus and Berita menu with default pages with template with-header

-- Generate unique IDs
SET @menu_fasilitas_id = CONCAT('menu_', UNIX_TIMESTAMP(), '_fasilitas');
SET @menu_sarana_prasarana_id = CONCAT('menu_', UNIX_TIMESTAMP(), '_sarana_prasarana');
SET @menu_parent_corner_id = CONCAT('menu_', UNIX_TIMESTAMP(), '_parent_corner');
SET @menu_parent_handbook_id = CONCAT('menu_', UNIX_TIMESTAMP(), '_parent_handbook');
SET @menu_aaiibs_paydia_id = CONCAT('menu_', UNIX_TIMESTAMP(), '_aaiibs_paydia');
SET @menu_berita_id = CONCAT('menu_', UNIX_TIMESTAMP(), '_berita');

-- Get first admin user ID
SET @admin_id = (SELECT id FROM User LIMIT 1);

-- Insert Fasilitas (Parent) - Skip if exists
INSERT IGNORE INTO `Menu` (`id`, `title`, `titleEn`, `slug`, `parentId`, `order`, `isActive`, `menuType`, `createdAt`, `updatedAt`)
VALUES (
  @menu_fasilitas_id,
  'Fasilitas',
  'Facilities',
  'fasilitas',
  NULL,
  4,
  1,
  'page',
  NOW(),
  NOW()
);

-- Get existing Fasilitas menu ID if it already exists
SET @menu_fasilitas_id = COALESCE(
  (SELECT id FROM Menu WHERE slug = 'fasilitas' AND parentId IS NULL LIMIT 1),
  @menu_fasilitas_id
);

-- Update order if menu already exists
UPDATE `Menu` SET `order` = 4 WHERE `id` = @menu_fasilitas_id;

-- Insert Fasilitas Child Menus - Skip if exists
INSERT IGNORE INTO `Menu` (`id`, `title`, `titleEn`, `slug`, `parentId`, `order`, `isActive`, `menuType`, `createdAt`, `updatedAt`)
VALUES
  (@menu_sarana_prasarana_id, 'Sarana Prasarana', 'Infrastructure', 'sarana-prasarana', @menu_fasilitas_id, 0, 1, 'page', NOW(), NOW()),
  (@menu_parent_corner_id, 'Parent Corner', 'Parent Corner', 'parent-corner', @menu_fasilitas_id, 1, 1, 'page', NOW(), NOW()),
  (@menu_parent_handbook_id, 'Parent Handbook', 'Parent Handbook', 'parent-handbook', @menu_fasilitas_id, 2, 1, 'page', NOW(), NOW()),
  (@menu_aaiibs_paydia_id, 'AAIIBS Paydia', 'AAIIBS Paydia', 'aaiibs-paydia', @menu_fasilitas_id, 3, 1, 'page', NOW(), NOW());

-- Get existing menu IDs if they already exist
SET @menu_sarana_prasarana_id = COALESCE((SELECT id FROM Menu WHERE slug = 'sarana-prasarana' AND parentId = @menu_fasilitas_id LIMIT 1), @menu_sarana_prasarana_id);
SET @menu_parent_corner_id = COALESCE((SELECT id FROM Menu WHERE slug = 'parent-corner' AND parentId = @menu_fasilitas_id LIMIT 1), @menu_parent_corner_id);
SET @menu_parent_handbook_id = COALESCE((SELECT id FROM Menu WHERE slug = 'parent-handbook' AND parentId = @menu_fasilitas_id LIMIT 1), @menu_parent_handbook_id);
SET @menu_aaiibs_paydia_id = COALESCE((SELECT id FROM Menu WHERE slug = 'aaiibs-paydia' AND parentId = @menu_fasilitas_id LIMIT 1), @menu_aaiibs_paydia_id);

-- Insert Berita Menu (without child) - Skip if exists
INSERT IGNORE INTO `Menu` (`id`, `title`, `titleEn`, `slug`, `parentId`, `order`, `isActive`, `menuType`, `createdAt`, `updatedAt`)
VALUES (
  @menu_berita_id,
  'Berita',
  'News',
  'berita',
  NULL,
  5,
  1,
  'page',
  NOW(),
  NOW()
);

-- Get existing Berita menu ID if it already exists
SET @menu_berita_id = COALESCE(
  (SELECT id FROM Menu WHERE slug = 'berita' AND parentId IS NULL LIMIT 1),
  @menu_berita_id
);

-- Update order if menu already exists
UPDATE `Menu` SET `order` = 5 WHERE `id` = @menu_berita_id;

-- Create default pages for Fasilitas child menus (with template with-header) - Skip if page already exists for menu
INSERT IGNORE INTO `Page` (`id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `menuId`, `pageType`, `template`, `isPublished`, `authorId`, `createdAt`, `updatedAt`)
SELECT 
  CONCAT('page_', UNIX_TIMESTAMP(), '_', SUBSTRING(@menu_sarana_prasarana_id, -10)),
  'Sarana Prasarana',
  'Infrastructure',
  'sarana-prasarana',
  '<h2>Sarana Prasarana</h2><p>Konten sarana prasarana akan ditambahkan di sini.</p>',
  '<h2>Infrastructure</h2><p>Infrastructure content will be added here.</p>',
  @menu_sarana_prasarana_id,
  'standard',
  'with-header',
  1,
  @admin_id,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM Page WHERE menuId = @menu_sarana_prasarana_id);

INSERT IGNORE INTO `Page` (`id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `menuId`, `pageType`, `template`, `isPublished`, `authorId`, `createdAt`, `updatedAt`)
SELECT 
  CONCAT('page_', UNIX_TIMESTAMP(), '_', SUBSTRING(@menu_parent_corner_id, -10)),
  'Parent Corner',
  'Parent Corner',
  'parent-corner',
  '<h2>Parent Corner</h2><p>Konten Parent Corner akan ditambahkan di sini.</p>',
  '<h2>Parent Corner</h2><p>Parent Corner content will be added here.</p>',
  @menu_parent_corner_id,
  'standard',
  'with-header',
  1,
  @admin_id,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM Page WHERE menuId = @menu_parent_corner_id);

INSERT IGNORE INTO `Page` (`id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `menuId`, `pageType`, `template`, `isPublished`, `authorId`, `createdAt`, `updatedAt`)
SELECT 
  CONCAT('page_', UNIX_TIMESTAMP(), '_', SUBSTRING(@menu_parent_handbook_id, -10)),
  'Parent Handbook',
  'Parent Handbook',
  'parent-handbook',
  '<h2>Parent Handbook</h2><p>Konten Parent Handbook akan ditambahkan di sini.</p>',
  '<h2>Parent Handbook</h2><p>Parent Handbook content will be added here.</p>',
  @menu_parent_handbook_id,
  'standard',
  'with-header',
  1,
  @admin_id,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM Page WHERE menuId = @menu_parent_handbook_id);

INSERT IGNORE INTO `Page` (`id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `menuId`, `pageType`, `template`, `isPublished`, `authorId`, `createdAt`, `updatedAt`)
SELECT 
  CONCAT('page_', UNIX_TIMESTAMP(), '_', SUBSTRING(@menu_aaiibs_paydia_id, -10)),
  'AAIIBS Paydia',
  'AAIIBS Paydia',
  'aaiibs-paydia',
  '<h2>AAIIBS Paydia</h2><p>Konten AAIIBS Paydia akan ditambahkan di sini.</p>',
  '<h2>AAIIBS Paydia</h2><p>AAIIBS Paydia content will be added here.</p>',
  @menu_aaiibs_paydia_id,
  'standard',
  'with-header',
  1,
  @admin_id,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM Page WHERE menuId = @menu_aaiibs_paydia_id);

-- Create default page for Berita menu (with template with-header and slug /berita) - Skip if page already exists for menu
INSERT IGNORE INTO `Page` (`id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `menuId`, `pageType`, `template`, `isPublished`, `authorId`, `createdAt`, `updatedAt`)
SELECT 
  CONCAT('page_', UNIX_TIMESTAMP(), '_', SUBSTRING(@menu_berita_id, -10)),
  'Berita',
  'News',
  'berita',
  '<h2>Berita</h2><p>Halaman berita dan artikel akan ditampilkan di sini.</p>',
  '<h2>News</h2><p>News and articles will be displayed here.</p>',
  @menu_berita_id,
  'standard',
  'with-header',
  1,
  @admin_id,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM Page WHERE menuId = @menu_berita_id);

