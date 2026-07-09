-- ============================================================================
-- CRITICAL DATABASE CHANGES - SEO Optimization
-- Only structural changes (new tables/columns)
-- ============================================================================

-- NEW COLUMN: icon_alt_text in commitment_items table
-- ============================================================================
-- Purpose: Store SEO-optimized alt text for feature icons displayed on home page
-- Location: commitment_items table
-- Position: After icon_url column
-- Type: VARCHAR(255), nullable

ALTER TABLE commitment_items
ADD COLUMN icon_alt_text VARCHAR(255) DEFAULT NULL AFTER icon_url;

-- ============================================================================
-- VERIFY THE CHANGE
-- ============================================================================
DESCRIBE commitment_items;

-- Expected output should show:
-- Field: icon_alt_text
-- Type: varchar(255)
-- Null: YES
-- Default: NULL
