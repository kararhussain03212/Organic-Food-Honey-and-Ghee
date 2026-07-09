-- ============================================================================
-- SEO Optimization Database Updates
-- Database: arion_organic_foods
-- Date: 2026-07-09
-- ============================================================================

-- 1. ADD NEW COLUMN TO commitment_items TABLE FOR ALT TEXT
-- ============================================================================
ALTER TABLE commitment_items ADD COLUMN icon_alt_text VARCHAR(255) DEFAULT NULL AFTER icon_url;

-- ============================================================================
-- 2. UPDATE COMMITMENT ITEMS WITH SEO-OPTIMIZED ALT TEXT
-- ============================================================================
UPDATE commitment_items SET icon_alt_text = '100 Percent Certified Organic Food' WHERE title = 'Certified Organic';
UPDATE commitment_items SET icon_alt_text = 'Lab Tested Quality Assured Organic Products' WHERE title = 'Quality Assured';
UPDATE commitment_items SET icon_alt_text = 'Farm to Table Fresh Sourcing' WHERE title = 'Sustainably Sourced';
UPDATE commitment_items SET icon_alt_text = 'Family Trusted Organic Food' WHERE title = 'Family Trusted';

-- ============================================================================
-- 3. UPDATE HOME PAGE SEO META DESCRIPTION
-- ============================================================================
INSERT INTO settings (setting_key, setting_value, setting_type, status, created_at, updated_at)
VALUES ('seo_home_meta_description', 'Shop the best organic food online in Pakistan. We offer pure Sidr honey, grass-fed desi ghee, cold-pressed oils, and farm-fresh groceries delivered nationwide.', 'text', 'active', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  setting_value = VALUES(setting_value),
  updated_at = NOW();

-- ============================================================================
-- 4. UPDATE SOCIAL MEDIA LINKS WITH SEO-OPTIMIZED LABELS
-- ============================================================================
INSERT INTO settings (setting_key, setting_value, setting_type, status, created_at, updated_at)
VALUES ('footer_social_links', '[{"label":"Follow Swift Sign Organic on Facebook","icon":"facebook","url":"https://www.facebook.com/SSgeneraltradinguae"},{"label":"Follow Swift Sign Organic on Instagram","icon":"instagram","url":"https://www.instagram.com/ssarionorganicfood/"},{"label":"Contact Swift Sign Organic on WhatsApp","icon":"whatsapp","url":"https://wa.me/923338399480"},{"label":"Subscribe to Swift Sign Organic on YouTube","icon":"youtube","url":"https://www.youtube.com/channel/UCv62oVoa-UmP8ePbMPuHydw/"},{"label":"Follow Swift Sign Organic on TikTok","icon":"tiktok","url":"https://www.tiktok.com/@ssarionorganicfood"}]', 'json', 'active', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  setting_value = VALUES(setting_value),
  updated_at = NOW();

-- ============================================================================
-- 5. ADD PAKISTANI AUTHORITY GEO-LOCATION META TAGS (Via Settings)
-- ============================================================================
-- These are handled in the frontend SEOHelmet component, but documenting here for reference:
-- <meta name="geo.placename" content="Pakistan" />
-- <meta name="geo.country" content="PK" />
-- <meta name="geo.position" content="30.1575;69.2075" /> (Islamabad coordinates)
-- <meta name="ICBM" content="30.1575, 69.2075" />

-- ============================================================================
-- 6. VERIFY ALL SEO SETTINGS ARE IN PLACE
-- ============================================================================
-- Check SEO meta descriptions:
SELECT setting_key, setting_value FROM settings WHERE setting_key LIKE 'seo_%' ORDER BY setting_key;

-- Check commitment items with alt text:
SELECT id, title, tag, icon_alt_text FROM commitment_items ORDER BY sort_order;

-- Check social media links:
SELECT setting_key, setting_value FROM settings WHERE setting_key = 'footer_social_links';

-- ============================================================================
-- 7. CONFIRMATION QUERIES
-- ============================================================================
-- Count of commitment items with alt text:
SELECT COUNT(*) as items_with_alt_text FROM commitment_items WHERE icon_alt_text IS NOT NULL;

-- SEO settings count:
SELECT COUNT(*) as seo_settings FROM settings WHERE setting_key LIKE 'seo_%';

-- ============================================================================
-- END OF SEO OPTIMIZATION SCRIPT
-- ============================================================================
