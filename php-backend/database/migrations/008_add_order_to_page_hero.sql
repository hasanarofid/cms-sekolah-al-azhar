-- Migration: Add order column to PageHero table
-- Date: 2025-01-XX
-- Description: Add order column to support multiple heroes per page

ALTER TABLE `PageHero` ADD COLUMN `order` INT NOT NULL DEFAULT 0 AFTER `buttonUrl`;

