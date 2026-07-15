-- Migration: Partner page section titles + form placeholders, and customer orders table
-- Date: 2026-07-15

ALTER TABLE `partner_page_settings`
  ADD COLUMN `who_its_for_title` varchar(120) DEFAULT NULL AFTER `program_subheading`,
  ADD COLUMN `how_it_works_title` varchar(120) DEFAULT NULL AFTER `who_its_for`,
  ADD COLUMN `what_you_get_title` varchar(120) DEFAULT NULL AFTER `how_it_works`,
  ADD COLUMN `placeholder_full_name` varchar(150) DEFAULT NULL AFTER `form_title`,
  ADD COLUMN `placeholder_phone` varchar(150) DEFAULT NULL AFTER `placeholder_full_name`,
  ADD COLUMN `placeholder_city` varchar(150) DEFAULT NULL AFTER `placeholder_phone`,
  ADD COLUMN `placeholder_handle` varchar(150) DEFAULT NULL AFTER `placeholder_city`,
  ADD COLUMN `placeholder_reason` varchar(150) DEFAULT NULL AFTER `placeholder_handle`;

UPDATE `partner_page_settings` SET
  `who_its_for_title`     = "Who it's for",
  `how_it_works_title`    = 'How it works',
  `what_you_get_title`    = 'What you get',
  `placeholder_full_name` = 'Full Name',
  `placeholder_phone`     = 'Phone / WhatsApp Number',
  `placeholder_city`      = 'City',
  `placeholder_handle`    = 'Instagram / Facebook / TikTok handle (optional)',
  `placeholder_reason`    = 'Why do you want to join Arion? (short answer)'
WHERE `id` = 1;

CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `order_number` varchar(30) NOT NULL,
  `customer_name` varchar(150) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `address` varchar(255) NOT NULL,
  `apartment` varchar(150) DEFAULT NULL,
  `city` varchar(100) NOT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `items` longtext NOT NULL CHECK (json_valid(`items`)),
  `subtotal` decimal(12,2) NOT NULL DEFAULT 0,
  `status` enum('new','confirmed','delivered','cancelled') NOT NULL DEFAULT 'new',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_order_number` (`order_number`),
  KEY `idx_orders_status` (`status`),
  KEY `idx_orders_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
