-- Migration: Create SEO Table
-- Description: Tabel untuk menyimpan pengaturan SEO global dan per-halaman

CREATE TABLE IF NOT EXISTS `SEO` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `pageType` VARCHAR(191) NOT NULL DEFAULT 'global',
  `pageId` VARCHAR(191) NULL,
  `pageSlug` VARCHAR(191) NULL,
  
  -- Meta Tags
  `title` VARCHAR(191) NULL,
  `description` TEXT NULL,
  `keywords` VARCHAR(500) NULL,
  `author` VARCHAR(191) NULL,
  `image` VARCHAR(191) NULL,
  `robots` VARCHAR(191) NOT NULL DEFAULT 'index, follow',
  `canonical` VARCHAR(500) NULL,
  
  -- Open Graph
  `ogTitle` VARCHAR(191) NULL,
  `ogDescription` TEXT NULL,
  `ogImage` VARCHAR(191) NULL,
  `ogType` VARCHAR(191) NOT NULL DEFAULT 'website',
  `ogSiteName` VARCHAR(191) NULL,
  `ogUrl` VARCHAR(500) NULL,
  
  -- Twitter Cards
  `twitterCard` VARCHAR(191) NOT NULL DEFAULT 'summary_large_image',
  `twitterSite` VARCHAR(191) NULL,
  `twitterCreator` VARCHAR(191) NULL,
  
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  
  INDEX `SEO_pageType_idx` (`pageType`),
  INDEX `SEO_pageId_idx` (`pageId`),
  INDEX `SEO_pageSlug_idx` (`pageSlug`),
  UNIQUE KEY `SEO_pageType_pageId_unique` (`pageType`, `pageId`),
  UNIQUE KEY `SEO_pageType_pageSlug_unique` (`pageType`, `pageSlug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default global SEO settings
INSERT INTO `SEO` (
  `id`, 
  `pageType`, 
  `title`, 
  `description`, 
  `keywords`, 
  `robots`, 
  `ogType`, 
  `twitterCard`
) VALUES (
  'seo-global-default',
  'global',
  'Al Azhar International Islamic Boarding School',
  'Qur''anic Learning, Courtesy Oriented and World Class Education',
  'al azhar, boarding school, islamic school, pendidikan islam',
  'index, follow',
  'website',
  'summary_large_image'
) ON DUPLICATE KEY UPDATE `updatedAt` = CURRENT_TIMESTAMP(3);

