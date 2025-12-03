-- Migration: Add mapEmbedUrl field for maps section type
-- Date: 2025-01-XX
-- Description: Add mapEmbedUrl field to HomeSection table for maps sections

-- Add mapEmbedUrl field to HomeSection table
ALTER TABLE `HomeSection` 
ADD COLUMN `mapEmbedUrl` TEXT NULL AFTER `partnerships`;

