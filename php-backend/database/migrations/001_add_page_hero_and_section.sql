-- Migration: Add PageHero and PageSection tables
-- Date: 2025-01-XX

-- Table: PageHero
-- Hero section untuk setiap halaman (bisa berbeda dari home slider)
DROP TABLE IF EXISTS `PageHero`;
CREATE TABLE `PageHero` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `pageId` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NULL,
  `titleEn` VARCHAR(191) NULL,
  `subtitle` VARCHAR(191) NULL,
  `subtitleEn` VARCHAR(191) NULL,
  `image` VARCHAR(191) NULL,
  `videoUrl` VARCHAR(191) NULL,
  `buttonText` VARCHAR(191) NULL,
  `buttonTextEn` VARCHAR(191) NULL,
  `buttonUrl` VARCHAR(191) NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX `PageHero_pageId_idx` (`pageId`),
  FOREIGN KEY (`pageId`) REFERENCES `Page`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: PageSection
-- Section untuk setiap halaman (mirip HomeSection tapi per halaman)
DROP TABLE IF EXISTS `PageSection`;
CREATE TABLE `PageSection` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `pageId` VARCHAR(191) NOT NULL,
  `type` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NULL,
  `titleEn` VARCHAR(191) NULL,
  `subtitle` VARCHAR(191) NULL,
  `subtitleEn` VARCHAR(191) NULL,
  `content` LONGTEXT NULL,
  `contentEn` LONGTEXT NULL,
  `image` VARCHAR(191) NULL,
  `images` TEXT NULL,
  `videoUrl` VARCHAR(191) NULL,
  `buttonText` VARCHAR(191) NULL,
  `buttonTextEn` VARCHAR(191) NULL,
  `buttonUrl` VARCHAR(191) NULL,
  `order` INT NOT NULL DEFAULT 0,
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX `PageSection_pageId_idx` (`pageId`),
  FOREIGN KEY (`pageId`) REFERENCES `Page`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

