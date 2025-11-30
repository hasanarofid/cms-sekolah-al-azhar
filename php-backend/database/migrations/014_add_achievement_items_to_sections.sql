-- Migration: Add achievementItems field for student-achievements section type
-- Date: 2025-01-XX
-- Description: Add field for student-achievements sections to store achievement data

-- Add achievementItems field to PageSection table
ALTER TABLE `PageSection` 
ADD COLUMN `achievementItems` TEXT NULL AFTER `organizationItems`;

