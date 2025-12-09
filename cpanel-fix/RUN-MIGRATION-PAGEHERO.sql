-- Migration: Add videoFile and videoDuration to PageHero table
-- Jalankan SQL ini di phpMyAdmin (database production)

-- Add columns if not exists
ALTER TABLE PageHero 
ADD COLUMN IF NOT EXISTS videoFile VARCHAR(500) NULL AFTER videoUrl,
ADD COLUMN IF NOT EXISTS videoDuration INT NULL AFTER videoFile;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_pagehero_videofile ON PageHero(videoFile);

-- Verify columns
SHOW COLUMNS FROM PageHero;


