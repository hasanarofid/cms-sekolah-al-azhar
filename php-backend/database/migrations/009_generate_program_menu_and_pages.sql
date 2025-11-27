-- Migration: Generate Program Menu Structure and Pages
-- Date: 2025-01-XX
-- Description: Create Program menu structure with child menus and default pages with template with-header

-- Generate unique IDs
SET @menu_program_id = CONCAT('menu_', UNIX_TIMESTAMP(), '_program');
SET @menu_super_qc_id = CONCAT('menu_', UNIX_TIMESTAMP(), '_super_qc');
SET @menu_tahfizh_id = CONCAT('menu_', UNIX_TIMESTAMP(), '_tahfizh');
SET @menu_adab_id = CONCAT('menu_', UNIX_TIMESTAMP(), '_adab');
SET @menu_program_internasional_id = CONCAT('menu_', UNIX_TIMESTAMP(), '_program_internasional');
SET @menu_language_center_id = CONCAT('menu_', UNIX_TIMESTAMP(), '_language_center');

-- Get first admin user ID
SET @admin_id = (SELECT id FROM User LIMIT 1);

-- Insert Program (Parent) - Skip if exists
INSERT IGNORE INTO `Menu` (`id`, `title`, `titleEn`, `slug`, `parentId`, `order`, `isActive`, `menuType`, `createdAt`, `updatedAt`)
VALUES (
  @menu_program_id,
  'Program',
  'Program',
  'program',
  NULL,
  1,
  1,
  'page',
  NOW(),
  NOW()
);

-- Get existing Program menu ID if it already exists
SET @menu_program_id = COALESCE(
  (SELECT id FROM Menu WHERE slug = 'program' AND parentId IS NULL LIMIT 1),
  @menu_program_id
);

-- Insert Program Child Menus - Skip if exists
INSERT IGNORE INTO `Menu` (`id`, `title`, `titleEn`, `slug`, `parentId`, `order`, `isActive`, `menuType`, `createdAt`, `updatedAt`)
VALUES
  (@menu_super_qc_id, 'Super QC', 'Super QC', 'super-qc', @menu_program_id, 0, 1, 'page', NOW(), NOW()),
  (@menu_tahfizh_id, 'Tahfizh', 'Tahfizh', 'tahfizh', @menu_program_id, 1, 1, 'page', NOW(), NOW()),
  (@menu_adab_id, 'Adab', 'Adab', 'adab', @menu_program_id, 2, 1, 'page', NOW(), NOW()),
  (@menu_program_internasional_id, 'Program Internasional', 'International Program', 'program-internasional', @menu_program_id, 3, 1, 'page', NOW(), NOW()),
  (@menu_language_center_id, 'Language Center', 'Language Center', 'language-center', @menu_program_id, 4, 1, 'page', NOW(), NOW());

-- Get existing menu IDs if they already exist
SET @menu_super_qc_id = COALESCE((SELECT id FROM Menu WHERE slug = 'super-qc' AND parentId = @menu_program_id LIMIT 1), @menu_super_qc_id);
SET @menu_tahfizh_id = COALESCE((SELECT id FROM Menu WHERE slug = 'tahfizh' AND parentId = @menu_program_id LIMIT 1), @menu_tahfizh_id);
SET @menu_adab_id = COALESCE((SELECT id FROM Menu WHERE slug = 'adab' AND parentId = @menu_program_id LIMIT 1), @menu_adab_id);
SET @menu_program_internasional_id = COALESCE((SELECT id FROM Menu WHERE slug = 'program-internasional' AND parentId = @menu_program_id LIMIT 1), @menu_program_internasional_id);
SET @menu_language_center_id = COALESCE((SELECT id FROM Menu WHERE slug = 'language-center' AND parentId = @menu_program_id LIMIT 1), @menu_language_center_id);

-- Create default pages for each menu (with template with-header) - Skip if page already exists for menu
INSERT IGNORE INTO `Page` (`id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `menuId`, `pageType`, `template`, `isPublished`, `authorId`, `createdAt`, `updatedAt`)
SELECT 
  CONCAT('page_', UNIX_TIMESTAMP(), '_', SUBSTRING(@menu_super_qc_id, -10)),
  'Super QC',
  'Super QC',
  'super-qc',
  '<h2>Super QC</h2><p>Konten program Super QC akan ditambahkan di sini.</p>',
  '<h2>Super QC</h2><p>Super QC program content will be added here.</p>',
  @menu_super_qc_id,
  'standard',
  'with-header',
  1,
  @admin_id,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM Page WHERE menuId = @menu_super_qc_id);

INSERT IGNORE INTO `Page` (`id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `menuId`, `pageType`, `template`, `isPublished`, `authorId`, `createdAt`, `updatedAt`)
SELECT 
  CONCAT('page_', UNIX_TIMESTAMP(), '_', SUBSTRING(@menu_tahfizh_id, -10)),
  'Tahfizh',
  'Tahfizh',
  'tahfizh',
  '<h2>Tahfizh</h2><p>Konten program Tahfizh akan ditambahkan di sini.</p>',
  '<h2>Tahfizh</h2><p>Tahfizh program content will be added here.</p>',
  @menu_tahfizh_id,
  'standard',
  'with-header',
  1,
  @admin_id,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM Page WHERE menuId = @menu_tahfizh_id);

INSERT IGNORE INTO `Page` (`id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `menuId`, `pageType`, `template`, `isPublished`, `authorId`, `createdAt`, `updatedAt`)
SELECT 
  CONCAT('page_', UNIX_TIMESTAMP(), '_', SUBSTRING(@menu_adab_id, -10)),
  'Adab',
  'Adab',
  'adab',
  '<h2>Adab</h2><p>Konten program Adab akan ditambahkan di sini.</p>',
  '<h2>Adab</h2><p>Adab program content will be added here.</p>',
  @menu_adab_id,
  'standard',
  'with-header',
  1,
  @admin_id,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM Page WHERE menuId = @menu_adab_id);

INSERT IGNORE INTO `Page` (`id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `menuId`, `pageType`, `template`, `isPublished`, `authorId`, `createdAt`, `updatedAt`)
SELECT 
  CONCAT('page_', UNIX_TIMESTAMP(), '_', SUBSTRING(@menu_program_internasional_id, -10)),
  'Program Internasional',
  'International Program',
  'program-internasional',
  '<h2>Program Internasional</h2><p>Konten program internasional akan ditambahkan di sini.</p>',
  '<h2>International Program</h2><p>International program content will be added here.</p>',
  @menu_program_internasional_id,
  'standard',
  'with-header',
  1,
  @admin_id,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM Page WHERE menuId = @menu_program_internasional_id);

INSERT IGNORE INTO `Page` (`id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `menuId`, `pageType`, `template`, `isPublished`, `authorId`, `createdAt`, `updatedAt`)
SELECT 
  CONCAT('page_', UNIX_TIMESTAMP(), '_', SUBSTRING(@menu_language_center_id, -10)),
  'Language Center',
  'Language Center',
  'language-center',
  '<h2>Language Center</h2><p>Konten Language Center akan ditambahkan di sini.</p>',
  '<h2>Language Center</h2><p>Language Center content will be added here.</p>',
  @menu_language_center_id,
  'standard',
  'with-header',
  1,
  @admin_id,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM Page WHERE menuId = @menu_language_center_id);

