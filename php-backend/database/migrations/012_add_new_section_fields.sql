-- Migration: Add new fields for new section types
-- Date: 2025-01-XX
-- Description: Add fields for accreditation, navigation-grid, program-cards, facility-gallery, extracurricular-detail sections

-- Add new fields to PageSection table
ALTER TABLE `PageSection` 
ADD COLUMN `badgeImage` VARCHAR(191) NULL AFTER `image`,
ADD COLUMN `accreditationNumber` VARCHAR(191) NULL AFTER `contentEn`,
ADD COLUMN `accreditationBody` VARCHAR(191) NULL AFTER `accreditationNumber`,
ADD COLUMN `navigationItems` TEXT NULL AFTER `buttonUrl`,
ADD COLUMN `programItems` TEXT NULL AFTER `navigationItems`,
ADD COLUMN `facilityItems` TEXT NULL AFTER `programItems`,
ADD COLUMN `extracurricularItems` TEXT NULL AFTER `facilityItems`;

