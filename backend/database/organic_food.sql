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
  `id`           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title`        VARCHAR(255) DEFAULT NULL,
  `subtitle`     VARCHAR(500) DEFAULT NULL,
  `button_text`  VARCHAR(120) DEFAULT NULL,
  `button_link`  VARCHAR(500) DEFAULT NULL,
  `image`        VARCHAR(500) DEFAULT NULL,
  `sort_order`   SMALLINT NOT NULL DEFAULT 0,
  `is_active`    TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
  `sort_order`   SMALLINT NOT NULL DEFAULT 0,
  `created_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- settings
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `settings` (
  `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `key`        VARCHAR(120) NOT NULL UNIQUE,
  `value`      LONGTEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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

-- ============================================================
-- Settings seed — all keys used by frontend & admin
-- ============================================================
INSERT IGNORE INTO `settings` (`key`, `value`) VALUES

-- Navbar
('navbar_logo',          'Arion Organic Food'),
('navbar_links',         '[{"label":"Home","path":"/"},{"label":"About","path":"/about"},{"label":"Products","path":"/products"},{"label":"Blog","path":"/blog"},{"label":"Contact","path":"/contact"}]'),
('whatsapp_number',      '923338399480'),

-- Footer
('footer_about_text',    'Premium organic products including Desi Ghee, Honey, and Shilajit — sourced naturally.'),
('footer_phone',         '+92 333 8399480'),
('footer_email',         'info@arionorganic.com'),
('footer_address',       'Office 22, 4th Floor, Pakland City Center, I-8 Markaz, Islamabad, Pakistan.'),
('footer_social_facebook',  'https://www.facebook.com/SSgeneraltradinguae'),
('footer_social_instagram', 'https://www.instagram.com/ssarionorganicfood/'),
('footer_social_youtube',   'https://www.youtube.com/channel/UCv62oVoa-UmP8ePbMPuHydw/editing'),
('footer_social_tiktok',    'https://www.tiktok.com/@ssarionorganicfood'),
('footer_copyright',     '© 2026 Arion Organic Food · All rights reserved'),

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
('blog_page_subtext', 'Insights on organic living and wellness.');

SET FOREIGN_KEY_CHECKS = 1;
