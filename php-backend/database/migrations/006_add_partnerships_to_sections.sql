-- Migration: Add partnerships column to HomeSection and PageSection
-- Date: 2025-01-XX
-- Description: Add partnerships JSON column to store partnership data for sections

ALTER TABLE `HomeSection` ADD COLUMN `partnerships` TEXT NULL AFTER `figures`;
ALTER TABLE `PageSection` ADD COLUMN `partnerships` TEXT NULL AFTER `figures`;

