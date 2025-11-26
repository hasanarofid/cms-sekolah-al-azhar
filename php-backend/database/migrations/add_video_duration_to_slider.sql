-- Migration: Add videoDuration column to Slider table
-- Untuk menyimpan durasi video dalam detik

ALTER TABLE `Slider` 
ADD COLUMN `videoDuration` INT NULL AFTER `videoFile`;

