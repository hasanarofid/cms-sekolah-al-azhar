-- Migration: Add calendarItems field for academic-calendar section type
-- Date: 2025-01-XX
-- Description: Add field for academic-calendar sections to store calendar data

-- Add calendarItems field to PageSection table
ALTER TABLE `PageSection` 
ADD COLUMN `calendarItems` TEXT NULL AFTER `curriculumItems`;

