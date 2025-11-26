-- Migration: Expand Slider subtitle columns to TEXT
-- Subtitle fields are too short (VARCHAR(191)) for longer content

ALTER TABLE `Slider` 
MODIFY COLUMN `subtitle` TEXT NULL,
MODIFY COLUMN `subtitleEn` TEXT NULL;

