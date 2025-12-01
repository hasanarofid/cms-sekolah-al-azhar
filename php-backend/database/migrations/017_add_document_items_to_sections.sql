-- Migration: Add documentItems field for bos-report section type
-- Date: 2025-01-XX
-- Description: Add field for bos-report sections to store document/file data

-- Add documentItems field to PageSection table
ALTER TABLE `PageSection` 
ADD COLUMN `documentItems` TEXT NULL AFTER `calendarItems`;

