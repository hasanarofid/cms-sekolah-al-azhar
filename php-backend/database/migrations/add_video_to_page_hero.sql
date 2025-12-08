-- Add videoFile and videoDuration columns to PageHero table
-- Migration untuk support video upload di PageHero

-- Check if columns exist first (untuk avoid error jika sudah ada)
ALTER TABLE PageHero 
ADD COLUMN IF NOT EXISTS videoFile VARCHAR(500) NULL AFTER videoUrl,
ADD COLUMN IF NOT EXISTS videoDuration INT NULL AFTER videoFile;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_pagehero_videofile ON PageHero(videoFile);

