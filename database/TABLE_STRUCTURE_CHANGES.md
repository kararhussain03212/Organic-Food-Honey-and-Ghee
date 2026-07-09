# Database Table Structure Changes - SEO Optimization

## commitment_items Table

### BEFORE (Original Structure)
```sql
CREATE TABLE commitment_items (
  id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  icon VARCHAR(50),
  icon_url VARCHAR(500),
  tag VARCHAR(120),
  title VARCHAR(255),
  description TEXT,
  sort_order SMALLINT(6),
  is_active TINYINT(1),
  created_at DATETIME,
  updated_at DATETIME
);
```

### AFTER (Updated Structure)
```sql
CREATE TABLE commitment_items (
  id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  icon VARCHAR(50),
  icon_url VARCHAR(500),
  icon_alt_text VARCHAR(255) DEFAULT NULL,  -- ← NEW COLUMN
  tag VARCHAR(120),
  title VARCHAR(255),
  description TEXT,
  sort_order SMALLINT(6),
  is_active TINYINT(1),
  created_at DATETIME,
  updated_at DATETIME
);
```

### Column Details - icon_alt_text

| Property | Value |
|----------|-------|
| Column Name | icon_alt_text |
| Data Type | VARCHAR(255) |
| Nullable | YES |
| Default Value | NULL |
| Position | After icon_url |
| Index | None (regular column) |
| Purpose | SEO-optimized alt text for feature icons |

---

## Data in commitment_items Table

### Current Data with SEO Alt Text

| ID | Icon | Title | Tag | icon_alt_text |
|----|----|-------|-----|--------------|
| 1 | leaf | Certified Organic | 100% Organic | 100 Percent Certified Organic Food |
| 2 | shield | Quality Assured | Lab Tested | Lab Tested Quality Assured Organic Products |
| 3 | award | Sustainably Sourced | Ethically Sourced | Farm to Table Fresh Sourcing |
| 4 | heart | Family Trusted | Family Trusted | Family Trusted Organic Food |

---

## settings Table

### Affected Rows

| setting_key | Type | Last Updated |
|------------|------|--------------|
| seo_home_meta_description | text | 2026-07-09 |
| footer_social_links | json | 2026-07-09 |

### seo_home_meta_description Value
```
Shop the best organic food online in Pakistan. We offer pure Sidr honey, grass-fed desi ghee, cold-pressed oils, and farm-fresh groceries delivered nationwide.
```

### footer_social_links Value (JSON)
```json
[
  {
    "label": "Follow Swift Sign Organic on Facebook",
    "icon": "facebook",
    "url": "https://www.facebook.com/SSgeneraltradinguae"
  },
  {
    "label": "Follow Swift Sign Organic on Instagram",
    "icon": "instagram",
    "url": "https://www.instagram.com/ssarionorganicfood/"
  },
  {
    "label": "Contact Swift Sign Organic on WhatsApp",
    "icon": "whatsapp",
    "url": "https://wa.me/923338399480"
  },
  {
    "label": "Subscribe to Swift Sign Organic on YouTube",
    "icon": "youtube",
    "url": "https://www.youtube.com/channel/UCv62oVoa-UmP8ePbMPuHydw/"
  },
  {
    "label": "Follow Swift Sign Organic on TikTok",
    "icon": "tiktok",
    "url": "https://www.tiktok.com/@ssarionorganicfood"
  }
]
```

---

## SQL Script to Replicate Changes

```sql
-- Add the new column
ALTER TABLE commitment_items
ADD COLUMN icon_alt_text VARCHAR(255) DEFAULT NULL AFTER icon_url;

-- Update commitment items with SEO alt text
UPDATE commitment_items SET icon_alt_text = '100 Percent Certified Organic Food' WHERE title = 'Certified Organic';
UPDATE commitment_items SET icon_alt_text = 'Lab Tested Quality Assured Organic Products' WHERE title = 'Quality Assured';
UPDATE commitment_items SET icon_alt_text = 'Farm to Table Fresh Sourcing' WHERE title = 'Sustainably Sourced';
UPDATE commitment_items SET icon_alt_text = 'Family Trusted Organic Food' WHERE title = 'Family Trusted';

-- Update SEO meta descriptions
INSERT INTO settings (setting_key, setting_value, setting_type, status, created_at, updated_at) 
VALUES ('seo_home_meta_description', 'Shop the best organic food online in Pakistan. We offer pure Sidr honey, grass-fed desi ghee, cold-pressed oils, and farm-fresh groceries delivered nationwide.', 'text', 'active', NOW(), NOW()) 
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = NOW();

-- Update social media links
INSERT INTO settings (setting_key, setting_value, setting_type, status, created_at, updated_at)
VALUES ('footer_social_links', '[{"label":"Follow Swift Sign Organic on Facebook","icon":"facebook","url":"https://www.facebook.com/SSgeneraltradinguae"},{"label":"Follow Swift Sign Organic on Instagram","icon":"instagram","url":"https://www.instagram.com/ssarionorganicfood/"},{"label":"Contact Swift Sign Organic on WhatsApp","icon":"whatsapp","url":"https://wa.me/923338399480"},{"label":"Subscribe to Swift Sign Organic on YouTube","icon":"youtube","url":"https://www.youtube.com/channel/UCv62oVoa-UmP8ePbMPuHydw/"},{"label":"Follow Swift Sign Organic on TikTok","icon":"tiktok","url":"https://www.tiktok.com/@ssarionorganicfood"}]', 'json', 'active', NOW(), NOW())
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = NOW();
```

---

## Backward Compatibility

✅ **Fully backward compatible**
- The new column has a DEFAULT NULL value
- No existing data is broken
- Applications can safely check `icon_alt_text` with NULL fallback
- Frontend uses: `icon_alt_text || title` (fallback pattern)

---

## Rollback (if needed)

```sql
-- Remove the new column
ALTER TABLE commitment_items DROP COLUMN icon_alt_text;

-- Revert settings to previous values
DELETE FROM settings WHERE setting_key IN ('seo_home_meta_description', 'footer_social_links');
```
