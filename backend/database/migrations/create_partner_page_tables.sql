-- Migration: Partner With Us page — dynamic content, team members, affiliate applications
-- Date: 2026-07-15

CREATE TABLE IF NOT EXISTS `partner_page_settings` (
  `id` int(10) unsigned NOT NULL,
  `hero_badge` varchar(120) DEFAULT NULL,
  `hero_heading` varchar(200) DEFAULT NULL,
  `hero_heading_accent` varchar(120) DEFAULT NULL,
  `hero_description` text DEFAULT NULL,
  `program_badge` varchar(120) DEFAULT NULL,
  `program_heading` varchar(200) DEFAULT NULL,
  `program_subheading` varchar(300) DEFAULT NULL,
  `who_its_for` text DEFAULT NULL,
  `how_it_works` longtext DEFAULT NULL CHECK (json_valid(`how_it_works`)),
  `what_you_get` longtext DEFAULT NULL CHECK (json_valid(`what_you_get`)),
  `form_title` varchar(120) DEFAULT NULL,
  `applicant_types` longtext DEFAULT NULL CHECK (json_valid(`applicant_types`)),
  `team_badge` varchar(120) DEFAULT NULL,
  `team_heading` varchar(200) DEFAULT NULL,
  `team_subheading` varchar(300) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `team_members` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `region` varchar(150) DEFAULT NULL,
  `quote` text DEFAULT NULL,
  `photo` varchar(500) DEFAULT NULL,
  `whatsapp_number` varchar(30) DEFAULT NULL,
  `sort_order` smallint(6) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `affiliate_applications` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `full_name` varchar(150) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `city` varchar(100) NOT NULL,
  `social_handle` varchar(150) DEFAULT NULL,
  `applicant_type` varchar(50) NOT NULL,
  `reason` text NOT NULL,
  `status` enum('new','reviewed','approved','rejected') NOT NULL DEFAULT 'new',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_affiliate_status` (`status`),
  KEY `idx_affiliate_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
