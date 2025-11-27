-- Migration: Add SEO fields to Post table
-- Date: 2024

ALTER TABLE `Post` 
ADD COLUMN `seoTitle` VARCHAR(191) NULL AFTER `postType`,
ADD COLUMN `seoDescription` TEXT NULL AFTER `seoTitle`,
ADD COLUMN `seoKeywords` VARCHAR(191) NULL AFTER `seoDescription`;

