-- Migration: Add contact fields for contact section type
-- Date: 2025-01-XX
-- Description: Add fields for contact sections to store contact information and map

-- Add contact fields to PageSection table
ALTER TABLE `PageSection` 
ADD COLUMN `address` TEXT NULL AFTER `documentItems`,
ADD COLUMN `addressEn` TEXT NULL AFTER `address`,
ADD COLUMN `email` VARCHAR(191) NULL AFTER `addressEn`,
ADD COLUMN `phone` VARCHAR(191) NULL AFTER `email`,
ADD COLUMN `mapEmbedUrl` TEXT NULL AFTER `phone`;

