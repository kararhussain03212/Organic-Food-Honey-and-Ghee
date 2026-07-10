-- ============================================================
-- Arion Organic Food — Database Schema
-- Database: organic_food
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS `organic_food`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `organic_food`;

-- ------------------------------------------------------------
-- admins
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admins` (
  `id`            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name`          VARCHAR(120) NOT NULL,
  `email`         VARCHAR(180) NOT NULL UNIQUE,
  `password`      VARCHAR(255) NOT NULL,
  `role`          ENUM('admin','editor') NOT NULL DEFAULT 'editor',
  `profile_photo` VARCHAR(255) DEFAULT NULL,
  `last_login_at` DATETIME DEFAULT NULL,
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- seed admin (password: admin123, bcrypt hash)
INSERT IGNORE INTO `admins` (`name`, `email`, `password`, `role`) VALUES
('Admin', 'admin@arionorganic.com', '$2y$12$7BnDmWjB4e5GHB9FgFr3puNiKH.MyvNJJhL2xGS3sZnMWj6OJz5/i', 'admin');

-- ------------------------------------------------------------
-- users  (mirrors admins for multi-user support)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id`            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name`          VARCHAR(120) NOT NULL,
  `email`         VARCHAR(180) NOT NULL UNIQUE,
  `password`      VARCHAR(255) NOT NULL,
  `role`          ENUM('admin','editor') NOT NULL DEFAULT 'editor',
  `profile_photo` VARCHAR(255) DEFAULT NULL,
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- activity_logs
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `admin_id`    INT UNSIGNED DEFAULT NULL,
  `action`      VARCHAR(80) NOT NULL,
  `resource`    VARCHAR(80) NOT NULL,
  `resource_id` INT UNSIGNED DEFAULT NULL,
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- hero_slides
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hero_slides` (
  `id`                      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `kicker`                  VARCHAR(255) DEFAULT NULL,
  `title`                   VARCHAR(255) DEFAULT NULL,
  `subtitle`                VARCHAR(500) DEFAULT NULL,
  `button_text`             VARCHAR(120) DEFAULT NULL,
  `button_link`             VARCHAR(500) DEFAULT NULL,
  `secondary_button_text`   VARCHAR(120) DEFAULT NULL,
  `secondary_button_link`   VARCHAR(500) DEFAULT NULL,
  `image`                   VARCHAR(500) DEFAULT NULL,
  `video_url`               VARCHAR(500) DEFAULT NULL,
  `sort_order`              SMALLINT NOT NULL DEFAULT 0,
  `is_active`               TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- products
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `products` (
  `id`                     INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name`                   VARCHAR(255) NOT NULL,
  `slug`                   VARCHAR(255) NOT NULL UNIQUE,
  `subtitle`               VARCHAR(255) DEFAULT NULL,
  `category`               VARCHAR(80) DEFAULT NULL,
  `size`                   VARCHAR(80) DEFAULT NULL,
  `price`                  DECIMAL(10,2) NOT NULL DEFAULT 0,
  `original_price`         DECIMAL(10,2) DEFAULT NULL,
  `discount`               SMALLINT DEFAULT NULL,
  `rating`                 DECIMAL(3,1) DEFAULT NULL,
  `reviews`                INT UNSIGNED DEFAULT 0,
  `stock`                  TINYINT(1) NOT NULL DEFAULT 1,
  `featured`               TINYINT(1) NOT NULL DEFAULT 0,
  `variants`               JSON DEFAULT NULL,
  `variant_prices`         JSON DEFAULT NULL,
  `variant_original_prices` JSON DEFAULT NULL,
  `images`                 JSON DEFAULT NULL,
  `badges`                 JSON DEFAULT NULL,
  `short_desc`             TEXT DEFAULT NULL,
  `description`            LONGTEXT DEFAULT NULL,
  `benefits`               JSON DEFAULT NULL,
  `ingredients`            TEXT DEFAULT NULL,
  `how_to_use`             JSON DEFAULT NULL,
  `faqs`                   JSON DEFAULT NULL,
  `tags`                   JSON DEFAULT NULL,
  `sort_order`             SMALLINT NOT NULL DEFAULT 0,
  `is_active`              TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- testimonials
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name`       VARCHAR(120) NOT NULL,
  `role`       VARCHAR(120) DEFAULT NULL,
  `avatar`     VARCHAR(500) DEFAULT NULL,
  `rating`     TINYINT UNSIGNED NOT NULL DEFAULT 5,
  `quote`      TEXT NOT NULL,
  `product`    VARCHAR(255) DEFAULT NULL,
  `verified`   TINYINT(1) NOT NULL DEFAULT 0,
  `sort_order` SMALLINT NOT NULL DEFAULT 0,
  `is_active`  TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- blog_posts
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id`           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title`        VARCHAR(255) NOT NULL,
  `slug`         VARCHAR(255) NOT NULL UNIQUE,
  `excerpt`      TEXT DEFAULT NULL,
  `content`      LONGTEXT DEFAULT NULL,
  `image`        VARCHAR(500) DEFAULT NULL,
  `author`       VARCHAR(120) DEFAULT NULL,
  `category`     VARCHAR(120) DEFAULT NULL,
  `tags`         JSON DEFAULT NULL,
  `is_published` TINYINT(1) NOT NULL DEFAULT 0,
  `published_at` DATETIME DEFAULT NULL,
  `read_time`    SMALLINT DEFAULT NULL,
  `sort_order`   SMALLINT NOT NULL DEFAULT 0,
  `created_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- settings
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `settings` (
  `id`             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `setting_key`    VARCHAR(120) NOT NULL UNIQUE,
  `setting_value`  LONGTEXT DEFAULT NULL,
  `setting_type`   VARCHAR(20) NOT NULL DEFAULT 'text',
  `order_position` INT UNSIGNED NOT NULL DEFAULT 0,
  `status`         ENUM('active','inactive') NOT NULL DEFAULT 'active',
  `created_at`     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- contact_messages
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name`       VARCHAR(120) NOT NULL,
  `email`      VARCHAR(180) NOT NULL,
  `phone`      VARCHAR(30) DEFAULT NULL,
  `subject`    VARCHAR(255) NOT NULL,
  `message`    TEXT NOT NULL,
  `status`     ENUM('unread','read','replied') NOT NULL DEFAULT 'unread',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- addresses (customer addresses)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `addresses` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id`         INT UNSIGNED NOT NULL,
  `label`           VARCHAR(120) DEFAULT NULL,
  `first_name`      VARCHAR(120) NOT NULL,
  `last_name`       VARCHAR(120) DEFAULT NULL,
  `phone`           VARCHAR(30) NOT NULL,
  `email`           VARCHAR(180) DEFAULT NULL,
  `street_address`  VARCHAR(255) NOT NULL,
  `apartment`       VARCHAR(120) DEFAULT NULL,
  `city`            VARCHAR(120) NOT NULL,
  `state`           VARCHAR(120) DEFAULT NULL,
  `postal_code`     VARCHAR(20) DEFAULT NULL,
  `country`         VARCHAR(120) NOT NULL,
  `is_default`      TINYINT(1) NOT NULL DEFAULT 0,
  `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Settings seed — all keys used by frontend & admin
-- ============================================================
INSERT IGNORE INTO `settings` (`setting_key`, `setting_value`) VALUES

-- Navbar
('navbar_logo',           'Arion Organic Food'),
('navbar_brand_title',    'Arion Organic Food'),
('navbar_brand_subtitle', 'Organic Foods'),
('navbar_phone',          '+92 333 8399480'),
('navbar_email',          'info@arionorganic.com'),
('navbar_welcome_text',   'Welcome to Arion Organic Food'),
('nav_links',             '[{"label":"Home","path":"/"},{"label":"About","path":"/about"},{"label":"Products","path":"/products"},{"label":"Blog","path":"/blog"},{"label":"Contact","path":"/contact"}]'),
('whatsapp_number',       '923338399480'),

-- Footer
('footer_brand_title',    'Arion Organic Food'),
('footer_brand_subtitle', 'ORGANIC FOODS'),
('footer_about_text',    'Premium organic products including Desi Ghee, Honey, and Shilajit — sourced naturally.'),
('footer_phone',         '+92 333 8399480'),
('footer_email',         'info@arionorganic.com'),
('footer_address',       'Office 22, 4th Floor, Pakland City Center, I-8 Markaz, Islamabad, Pakistan.'),
('footer_social_facebook',  'https://www.facebook.com/SSgeneraltradinguae'),
('footer_social_instagram', 'https://www.instagram.com/ssarionorganicfood/'),
('footer_social_youtube',   'https://www.youtube.com/channel/UCv62oVoa-UmP8ePbMPuHydw/editing'),
('footer_social_tiktok',    'https://www.tiktok.com/@ssarionorganicfood'),
('footer_copyright',        '© 2026 Arion Organic Food · All rights reserved'),
('footer_timings_heading', 'Our Timings'),
('footer_timings_days',    'Mon-Sun'),
('footer_timings_time',    '10am - 7pm'),
('footer_links',         '[{"label":"Terms & Conditions","path":"/terms-and-conditions"},{"label":"Privacy Policy","path":"/privacy-policy"},{"label":"Return Policy","path":"/return-policy"},{"label":"Shipping Policy","path":"/online-order-policy"},{"label":"Certification","path":"/certification"}]'),
('footer_social_links',  '[{"label":"Facebook","url":"https://www.facebook.com/SSgeneraltradinguae","icon":"facebook"},{"label":"Instagram","url":"https://www.instagram.com/ssarionorganicfood/","icon":"instagram"},{"label":"YouTube","url":"https://www.youtube.com/channel/UCv62oVoa-UmP8ePbMPuHydw/editing","icon":"youtube"},{"label":"TikTok","url":"https://www.tiktok.com/@ssarionorganicfood","icon":"tiktok"}]'),

-- Contact
('contact_email',              'info@arionorganic.com'),
('contact_phone',              '+92 333 8399480'),
('contact_whatsapp',           '923338399480'),
('contact_address',            'Office 22, 4th Floor, Pakland City Center, I-8 Markaz, Islamabad, Pakistan.'),
('contact_facebook',           'https://www.facebook.com/SSgeneraltradinguae'),
('contact_instagram',          'https://www.instagram.com/ssarionorganicfood/'),
('contact_youtube',            'https://www.youtube.com/channel/UCv62oVoa-UmP8ePbMPuHydw/editing'),
('contact_tiktok',             'https://www.tiktok.com/@ssarionorganicfood'),
('contact_availability_text',  'Available Mon – Sat, 9am – 6pm'),

-- Home — story / OurStory section
('home_story_heading', 'Our Story'),
('home_story_text',    'From the pristine valleys of Pakistan, we bring you the purest organic products.'),
('home_story_image',   ''),
('home_story_bullets', '["100% Natural","No Preservatives","Ethically Sourced","Lab Tested"]'),

-- Home — purity promise
('home_purity_items', '[{"icon":"🌿","title":"100% Natural","desc":"Free from chemicals and preservatives"},{"icon":"🔬","title":"Lab Tested","desc":"Verified for purity and quality"},{"icon":"🌍","title":"Ethically Sourced","desc":"Sustainable farming practices"}]'),

-- Home — CTA section
('cta_title',       'Ready to Experience Pure Organic Goodness?'),
('cta_subtitle',    'Order now and get fresh products delivered to your door.'),
('cta_button_text', 'Shop Now'),
('cta_button_link', '/products'),

-- Home — company / products heading
('home_company_heading', 'Our Products'),
('home_company_subtext', 'Discover our range of premium organic products.'),

-- Home — blog section
('home_blog_heading', 'Latest from Our Blog'),
('home_blog_subtext', 'Tips, recipes, and insights on organic living.'),

-- About — hero
('about_hero_title',    'About Arion Organic Food'),
('about_hero_subtitle', 'Pure, Natural, Authentic'),
('about_hero_quote',    'Bringing nature\'s finest directly to your table since generations.'),
('about_hero_image',    ''),

-- About — story
('about_story_headline',   'Our Heritage of Purity'),
('about_story_paragraphs', '["We are a family-run business passionate about bringing you the finest organic products from Pakistan\'s natural landscape.","Every product we offer is carefully sourced, tested, and delivered with love."]'),
('about_story_keywords',   '["Pure","Organic","Authentic","Natural"]'),

-- About — timeline
('about_timeline', '[{"step":"01","icon":"🌱","title":"Humble Beginnings","desc":"Started as a small family operation dedicated to organic farming."},{"step":"02","icon":"🔬","title":"Quality Standards","desc":"Introduced lab testing to ensure purity of every batch."},{"step":"03","icon":"🌍","title":"Growing Reach","desc":"Expanded to serve customers across Pakistan."},{"step":"04","icon":"⭐","title":"Trusted Brand","desc":"Earned the trust of thousands of families nationwide."}]'),

-- About — mission
('about_mission', '[{"icon":"🎯","title":"Our Mission","desc":"To make pure organic food accessible to every Pakistani household.","color":"#2e6b4f"},{"icon":"🔭","title":"Our Vision","desc":"A healthier Pakistan through organic, chemical-free nutrition.","color":"#c8a04a"},{"icon":"💚","title":"Our Values","desc":"Honesty, purity, and respect for nature guide everything we do.","color":"#4a7c59"}]'),

-- About — duality
('about_traditional', '["Hand-selected raw materials","Traditional purification methods","Generational knowledge","Small-batch production"]'),
('about_modern',      '["Modern hygiene standards","Lab quality testing","Hygienic packaging","Fast nationwide delivery"]'),

-- Product page
('product_page_heading', 'Our Products'),
('product_page_subtext', 'Explore our full range of organic products.'),

-- Blog page
('blog_page_heading', 'Our Blog'),
('blog_page_subtext', 'Insights on organic living and wellness.'),
('blog_badge_text', 'Wellness Journal'),
('blog_hero_title', 'Nourish Your Mind &'),
('blog_hero_title_accent', 'Body'),
('blog_hero_description', 'Explore healthy living, natural nutrition, traditional wellness, and organic lifestyle knowledge curated by our expert team.'),
('blog_search_placeholder', 'Search articles, topics, ingredients...'),

-- Home — commitment section heading
('home_commitment_eyebrow',         'Our Commitment to You'),
('home_commitment_heading',         'We Take Quality'),
('home_commitment_heading_accent',  'Seriously.'),
('home_commitment_subtext',         'Every product we craft carries our unyielding promise — pure, honest, and made with the reverence nature deserves.'),
('home_commitment_btn_text',        'Explore Our Products'),
('home_commitment_btn_link',        '#products'),

-- Home — Our Story (About Us) additional keys
('home_story_eyebrow',          'About Us'),
('home_story_heading_accent',   'Straight to Your Table'),
('home_story_btn_text',         'Explore Our Products'),
('home_story_btn_link',         '#products'),

-- Home — Our Collection (products section heading)
('home_collection_eyebrow',          'Our Collection'),
('home_collection_heading',          'Premium Organic'),
('home_collection_heading_accent',   'Products'),
('home_collection_subtext',          'Each product is carefully sourced, traditionally crafted, and rigorously tested — bringing the finest of nature directly to your home.'),
('home_collection_btn_text',         'View All Products'),
('home_collection_btn_link',         '/products'),

-- Home — Customer Stories (testimonials section heading)
('home_testimonials_eyebrow',          'Customer Stories'),
('home_testimonials_heading',          'Trusted by Families Who'),
('home_testimonials_heading_accent',   'Value Purity.'),
('home_testimonials_subtext',          'Real experiences from real people — because our greatest achievement is the trust of the families we serve.'),

-- Home — Authentic (CTA section)
('home_cta_eyebrow',        'Pure. Natural. Authentic.'),
('home_cta_heading',        'Experience Real Purity'),
('home_cta_heading_accent', 'in Every Product'),
('home_cta_subtext',        'Fresh, natural, and traditionally crafted products delivered to your home. No preservatives. No shortcuts. Just the honest goodness of nature.'),
('home_cta_btn_text',       'Shop Now'),
('home_cta_btn_link',       '#products'),
('home_cta_btn2_text',      'Our Story'),
('home_cta_btn2_link',      '/about'),
('home_cta_badge_text',     'Authenticity Guaranteed');

-- ------------------------------------------------------------
-- commitment_items — Our Commitment section cards
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `commitment_items` (
  `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `icon`       VARCHAR(50)  DEFAULT NULL COMMENT 'Icon name (check-circle, shield, house, leaf, star, heart, droplet, award, check)',
  `icon_url`   VARCHAR(500) DEFAULT NULL COMMENT 'Optional uploaded image icon (overrides icon name)',
  `tag`        VARCHAR(120) DEFAULT NULL COMMENT 'Small badge label',
  `title`      VARCHAR(255) NOT NULL,
  `description` TEXT        DEFAULT NULL,
  `sort_order` SMALLINT     NOT NULL DEFAULT 0,
  `is_active`  TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `commitment_items` (`id`, `icon`, `tag`, `title`, `description`, `sort_order`, `is_active`) VALUES
(1, 'check-circle', '100% Natural',    'Naturally Sourced Quality',  'Every product begins its journey in pristine natural environments—no shortcuts, no compromises. We trace every ingredient from source to shelf.', 1, 1),
(2, 'house',        'Sources Fresh',   'Traditional Purity',         'Rooted in generations of artisan knowledge, our methods honor the land. Time-tested traditions preserve the natural goodness in every jar.',        2, 1),
(3, 'check-circle', 'Chemical Free',   'No Artificial Compromise',   'Zero preservatives, zero additives, zero artificial flavors. Pure as nature intended—what you see is exactly what goes in.',                       3, 1),
(4, 'shield',       'Premium Quality', 'Our Quality Commitment',     'Rigorous testing at every stage of production. Our quality promise isn''t just a label—it''s the foundation everything we do is built upon.',    4, 1);

-- ------------------------------------------------------------
-- About Us page — dedicated tables
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `about_page_settings` (
  `id`                    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `badge_text`            VARCHAR(100)  DEFAULT NULL,
  `hero_title`            VARCHAR(200)  DEFAULT NULL,
  `hero_highlight_text`   VARCHAR(200)  DEFAULT NULL,
  `hero_subtitle`         VARCHAR(300)  DEFAULT NULL,
  `hero_quote`            TEXT          DEFAULT NULL,
  `hero_background_image` VARCHAR(500)  DEFAULT NULL,
  `seo_title`             VARCHAR(200)  DEFAULT NULL,
  `seo_description`       VARCHAR(500)  DEFAULT NULL,
  `seo_keywords`          VARCHAR(500)  DEFAULT NULL,
  `created_at`            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `about_story_section` (
  `id`            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `section_badge` VARCHAR(100)  DEFAULT NULL,
  `title`         VARCHAR(200)  DEFAULT NULL,
  `description_1` TEXT          DEFAULT NULL,
  `description_2` TEXT          DEFAULT NULL,
  `description_3` TEXT          DEFAULT NULL,
  `image_1`       VARCHAR(500)  DEFAULT NULL,
  `image_2`       VARCHAR(500)  DEFAULT NULL,
  `image_3`       VARCHAR(500)  DEFAULT NULL,
  `created_at`    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `about_problem_cards` (
  `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `card_number` VARCHAR(10)   DEFAULT NULL,
  `icon`        VARCHAR(100)  DEFAULT NULL,
  `title`       VARCHAR(200)  NOT NULL,
  `description` TEXT          DEFAULT NULL,
  `sort_order`  SMALLINT      NOT NULL DEFAULT 0,
  `is_active`   TINYINT(1)    NOT NULL DEFAULT 1,
  `created_at`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `about_mission_section` (
  `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `badge`       VARCHAR(100)  DEFAULT NULL,
  `title`       VARCHAR(200)  DEFAULT NULL,
  `description` TEXT          DEFAULT NULL,
  `created_at`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `about_core_values` (
  `id`           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `value_number` VARCHAR(10)   DEFAULT NULL,
  `icon`         VARCHAR(100)  DEFAULT NULL,
  `title`        VARCHAR(200)  NOT NULL,
  `description`  TEXT          DEFAULT NULL,
  `button_text`  VARCHAR(100)  DEFAULT NULL,
  `color`        VARCHAR(50)   DEFAULT NULL,
  `sort_order`   SMALLINT      NOT NULL DEFAULT 0,
  `is_active`    TINYINT(1)    NOT NULL DEFAULT 1,
  `created_at`   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `about_comparison_section` (
  `id`               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `section_title`    VARCHAR(200)  DEFAULT NULL,
  `section_subtitle` VARCHAR(500)  DEFAULT NULL,
  `created_at`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `about_comparison_cards` (
  `id`               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `comparison_type`  VARCHAR(50)   DEFAULT NULL COMMENT 'traditional or modern',
  `icon`             VARCHAR(100)  DEFAULT NULL,
  `title`            VARCHAR(200)  NOT NULL,
  `point_1`          VARCHAR(300)  DEFAULT NULL,
  `point_2`          VARCHAR(300)  DEFAULT NULL,
  `point_3`          VARCHAR(300)  DEFAULT NULL,
  `point_4`          VARCHAR(300)  DEFAULT NULL,
  `sort_order`       SMALLINT      NOT NULL DEFAULT 0,
  `is_active`        TINYINT(1)    NOT NULL DEFAULT 1,
  `created_at`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `about_cta_section` (
  `id`               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `badge_text`       VARCHAR(100)  DEFAULT NULL,
  `title`            VARCHAR(200)  DEFAULT NULL,
  `subtitle`         VARCHAR(500)  DEFAULT NULL,
  `button_text`      VARCHAR(100)  DEFAULT NULL,
  `button_link`      VARCHAR(500)  DEFAULT NULL,
  `background_image` VARCHAR(500)  DEFAULT NULL,
  `created_at`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seeds
INSERT IGNORE INTO `about_page_settings` (`id`, `badge_text`, `hero_title`, `hero_highlight_text`, `hero_subtitle`, `hero_quote`) VALUES
(1, 'OUR STORY', 'About Arion', 'Arion', 'Pure, Natural, Authentic', 'Bringing nature''s finest directly to your table since generations.');

INSERT IGNORE INTO `about_story_section` (`id`, `section_badge`, `title`, `description_1`, `description_2`, `description_3`, `image_1`, `image_2`, `image_3`) VALUES
(1, 'Our Story', 'How It All Began',
 'Arion was founded by a family who watched the food they trusted slowly disappear from shelves, replaced by colourful packaging and invisible chemicals.',
 'We set out to change that. Not loudly, not with slogans, but quietly — the way good food has always worked. One pure product, one trusted source, one honest jar at a time.',
 'Today, every Arion product carries that same original conviction: that the best food is the least interfered with, and that the wisdom of our grandmothers was never something to improve upon — only to protect.',
 '/story_honey.png', '/ghee.jpeg', '/story_founder.png');

INSERT IGNORE INTO `about_problem_cards` (`id`, `card_number`, `icon`, `title`, `description`, `sort_order`, `is_active`) VALUES
(1, '01', '🌾', 'Loss of Natural Food Quality', 'Industrial sourcing and mass production eroded the nutritional depth of everyday foods across generations.', 1, 1),
(2, '02', '⚗️', 'Rise of Artificial Products',  'Preservatives, additives, and synthetic flavours became the norm — prioritising shelf life over human life.', 2, 1),
(3, '03', '💡', 'Health Awareness Growing',       'A global shift in consciousness began. People started asking harder questions about what they were actually eating.', 3, 1),
(4, '04', '🫙', 'Return to Pure Traditions',      'Arion was born here — to honour what was lost and return it, with trust and full transparency, to your table.', 4, 1);

INSERT IGNORE INTO `about_mission_section` (`id`, `badge`, `title`, `description`) VALUES
(1, '✦ What We Stand For', 'Our Core Mission', 'Every decision we make is guided by four uncompromising principles that have shaped Arion since the very beginning.');

INSERT IGNORE INTO `about_core_values` (`id`, `value_number`, `icon`, `title`, `description`, `color`, `sort_order`, `is_active`) VALUES
(1, '01', '🌿', 'Purity First',          'We prioritise natural, unprocessed ingredients. Nothing enters our products that we would not give our own children.', '#496348', 1, 1),
(2, '02', '🧡', 'Trust & Transparency',  'What you see is what you get — no hidden compromises, no ambiguous labels, no grey areas.', '#C7A66B', 2, 1),
(3, '03', '🌾', 'Traditional Wisdom',    'Inspired by generations of natural healing practices refined across centuries of lived experience.', '#5B5248', 3, 1),
(4, '04', '🏥', 'Modern Wellness',        'Blending time-tested tradition with contemporary nutritional science for measurably better living.', '#496348', 4, 1);

INSERT IGNORE INTO `about_comparison_section` (`id`, `section_title`, `section_subtitle`) VALUES
(1, 'The Arion Difference', 'Where ancient wisdom meets modern science.');

INSERT IGNORE INTO `about_comparison_cards` (`id`, `comparison_type`, `icon`, `title`, `point_1`, `point_2`, `point_3`, `point_4`, `sort_order`, `is_active`) VALUES
(1, 'traditional', '🌿', 'Traditional Purity',
 'Desi cooking methods passed down through generations',
 'Heritage practices without shortcuts',
 'Slow processes that preserve nutritional integrity',
 NULL, 1, 1),
(2, 'modern', '🔬', 'Modern Wellness',
 'Scientific nutrition profiling and lab testing',
 'Rigorous quality benchmarks at every stage',
 'Clean, hygienic production environments',
 'Traceable supply chains with full accountability', 2, 1);

INSERT IGNORE INTO `about_cta_section` (`id`, `badge_text`, `title`, `subtitle`, `button_text`, `button_link`) VALUES
(1, 'Join The Arion Family', 'Experience The Arion Difference', 'Pure ingredients. Honest sourcing. Real wellness.', 'Explore Our Products', '/products');

-- ------------------------------------------------------------
-- Contact page settings (singleton row id=1)
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `contact_page_settings` (
  `id`                   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `hero_badge`           VARCHAR(120)  DEFAULT NULL,
  `hero_heading`         VARCHAR(255)  DEFAULT NULL,
  `hero_highlight`       VARCHAR(255)  DEFAULT NULL,
  `hero_description`     TEXT          DEFAULT NULL,
  `seo_meta_description` VARCHAR(255)  DEFAULT NULL,
  `form_title`           VARCHAR(255)  DEFAULT NULL,
  `name_placeholder`     VARCHAR(120)  DEFAULT NULL,
  `email_placeholder`    VARCHAR(120)  DEFAULT NULL,
  `phone_placeholder`    VARCHAR(120)  DEFAULT NULL,
  `subject_placeholder`  VARCHAR(120)  DEFAULT NULL,
  `message_placeholder`  VARCHAR(120)  DEFAULT NULL,
  `submit_button_text`   VARCHAR(120)  DEFAULT NULL,
  `availability_text`    VARCHAR(255)  DEFAULT NULL,
  `contact_heading`      VARCHAR(255)  DEFAULT NULL,
  `contact_description`  TEXT          DEFAULT NULL,
  `whatsapp_number`      VARCHAR(50)   DEFAULT NULL,
  `phone_number`         VARCHAR(50)   DEFAULT NULL,
  `email`                VARCHAR(255)  DEFAULT NULL,
  `address`              TEXT          DEFAULT NULL,
  `google_map_url`       TEXT          DEFAULT NULL,
  `locations`            JSON          DEFAULT NULL,
  `facebook_url`         VARCHAR(500)  DEFAULT NULL,
  `instagram_url`        VARCHAR(500)  DEFAULT NULL,
  `youtube_url`          VARCHAR(500)  DEFAULT NULL,
  `tiktok_url`           VARCHAR(500)  DEFAULT NULL,
  `created_at`           DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`           DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `contact_page_settings` (
  `id`, `hero_badge`, `hero_heading`, `hero_highlight`, `hero_description`,
  `form_title`, `name_placeholder`, `email_placeholder`, `phone_placeholder`,
  `subject_placeholder`, `message_placeholder`, `submit_button_text`,
  `availability_text`, `contact_heading`, `contact_description`,
  `whatsapp_number`, `phone_number`, `email`, `address`, `google_map_url`,
  `facebook_url`, `instagram_url`, `youtube_url`, `tiktok_url`
) VALUES (
  1,
  'GET IN TOUCH',
  'Contact Arion Organic',
  'Arion Organic',
  'Questions about our products? Bulk orders? Feedback? We''re here for you — always.',
  'SEND US A MESSAGE',
  'Full Name',
  'Email Address',
  'Phone Number',
  'Subject',
  'Your Message',
  'Send Message',
  'Available Mon – Sat, 9am – 6pm',
  'We''d love to hear from you',
  'Reach out through any channel below and our dedicated team will respond promptly.',
  '+92 333 8399480',
  '+92 333 8399480',
  'info@arionorganic.com',
  'Office 22, 4th Floor, Pakland City Center, I-8 Markaz, Islamabad, Pakistan',
  'https://www.google.com/maps/search/?api=1&query=Pakland+City+Center+I-8+Markaz+Islamabad',
  'https://www.facebook.com/SSgeneraltradinguae',
  'https://www.instagram.com/ssarionorganicfood/',
  'https://www.youtube.com/channel/UCv62oVoa-UmP8ePbMPuHydw',
  'https://www.tiktok.com/@ssarionorganicfood'
);

SET FOREIGN_KEY_CHECKS = 1;
