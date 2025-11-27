-- Migration: Add faqItems column to HomeSection and PageSection tables
-- Date: 2025-01-XX

-- Add faqItems column to HomeSection table
ALTER TABLE `HomeSection` 
ADD COLUMN `faqItems` TEXT NULL AFTER `buttonUrl`;

-- Add faqItems column to PageSection table
ALTER TABLE `PageSection` 
ADD COLUMN `faqItems` TEXT NULL AFTER `buttonUrl`;

