-- Migration: Add videoFile column to Slider table
-- This allows sliders to have autoplay background videos (not just YouTube URLs)

ALTER TABLE `Slider` 
ADD COLUMN `videoFile` VARCHAR(191) NULL AFTER `videoUrl`;

