-- Migration: Add imageLeft and imageRight columns to HomeSection and PageSection tables for masjid-al-fatih type
-- Date: 2025-01-XX

-- Add imageLeft and imageRight columns to HomeSection table
ALTER TABLE `HomeSection` 
ADD COLUMN `imageLeft` VARCHAR(191) NULL AFTER `image`,
ADD COLUMN `imageRight` VARCHAR(191) NULL AFTER `imageLeft`;

-- Add imageLeft and imageRight columns to PageSection table
ALTER TABLE `PageSection` 
ADD COLUMN `imageLeft` VARCHAR(191) NULL AFTER `image`,
ADD COLUMN `imageRight` VARCHAR(191) NULL AFTER `imageLeft`;

