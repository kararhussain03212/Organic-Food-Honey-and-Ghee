-- Migration: Add locations column to contact_page_settings table
-- Purpose: Support multiple address/location entries
-- Date: 2026-06-09

ALTER TABLE `contact_page_settings` ADD COLUMN `locations` JSON DEFAULT NULL AFTER `google_map_url`;

-- Optional: Convert existing single address to locations JSON format
-- Uncomment and modify the update statement below if you want to migrate existing data
-- UPDATE `contact_page_settings`
-- SET `locations` = JSON_ARRAY(
--   JSON_OBJECT('address', `address`, 'google_map_url', `google_map_url`)
-- )
-- WHERE (`address` IS NOT NULL OR `google_map_url` IS NOT NULL) AND `locations` IS NULL;
