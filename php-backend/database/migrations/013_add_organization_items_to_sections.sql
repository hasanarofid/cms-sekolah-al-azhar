-- Migration: Add organizationItems field for organization-structure section type
-- Date: 2025-01-XX
-- Description: Add field for organization-structure sections to store hierarchical organization data

-- Add organizationItems field to PageSection table
ALTER TABLE `PageSection` 
ADD COLUMN `organizationItems` TEXT NULL AFTER `extracurricularItems`;

