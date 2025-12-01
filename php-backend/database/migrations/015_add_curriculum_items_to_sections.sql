-- Migration: Add curriculumItems field for curriculum-table section type
-- Date: 2025-01-XX
-- Description: Add field for curriculum-table sections to store curriculum table data

-- Add curriculumItems field to PageSection table
ALTER TABLE `PageSection` 
ADD COLUMN `curriculumItems` TEXT NULL AFTER `achievementItems`;

