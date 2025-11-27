-- Migration: Add figures column to HomeSection and PageSection tables
-- Date: 2025-01-XX

-- Add figures column to HomeSection table
ALTER TABLE `HomeSection` 
ADD COLUMN `figures` TEXT NULL AFTER `faqItems`;

-- Add figures column to PageSection table
ALTER TABLE `PageSection` 
ADD COLUMN `figures` TEXT NULL AFTER `faqItems`;

