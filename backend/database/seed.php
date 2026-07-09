<?php
/**
 * Arion Organic Food — Database Seed Runner
 *
 * Browser: http://localhost/Organic%20Food/backend/database/seed.php
 * CLI:     php backend/database/seed.php
 *
 * Creates the database + all tables (IF NOT EXISTS), then inserts seed data
 * using INSERT IGNORE so it is safe to re-run multiple times.
 */

declare(strict_types=1);

// ── Security: block non-local requests ───────────────────────────────────────
$ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
if (PHP_SAPI !== 'cli' && !in_array($ip, ['127.0.0.1', '::1'], true)) {
    http_response_code(403);
    exit('403 Forbidden — seed runner is only accessible locally.');
}

// ── Load .env ─────────────────────────────────────────────────────────────────
$envPath = __DIR__ . '/../.env';
$env = [];
if (file_exists($envPath)) {
    foreach (file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
            continue;
        }
        [$k, $v] = array_map('trim', explode('=', $line, 2));
        $env[$k] = $v;
    }
}

$host   = $env['DB_HOST'] ?? 'localhost';
$port   = $env['DB_PORT'] ?? '3306';
$dbName = $env['DB_NAME'] ?? 'organic_food';
$user   = $env['DB_USER'] ?? 'root';
$pass   = $env['DB_PASS'] ?? '';

// ── Connect (no DB selected yet so we can CREATE DATABASE) ───────────────────
try {
    $pdo = new PDO(
        "mysql:host={$host};port={$port};charset=utf8mb4",
        $user,
        $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
    );
} catch (PDOException $e) {
    exit('DB connection failed: ' . $e->getMessage());
}

$log    = [];
$errors = [];

function run(PDO $pdo, string $sql, string $label, array &$log, array &$errors): void
{
    try {
        $pdo->exec($sql);
        $log[] = "&#10003; {$label}";
    } catch (PDOException $e) {
        $errors[] = "&#10007; {$label}: " . htmlspecialchars($e->getMessage());
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// 1. DATABASE
// ═════════════════════════════════════════════════════════════════════════════
run($pdo, "CREATE DATABASE IF NOT EXISTS `{$dbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci", "Create database '{$dbName}'", $log, $errors);
run($pdo, "USE `{$dbName}`", "Select database '{$dbName}'", $log, $errors);

// ═════════════════════════════════════════════════════════════════════════════
// 2. TABLES
// ═════════════════════════════════════════════════════════════════════════════

run($pdo, "
    CREATE TABLE IF NOT EXISTS `admins` (
        `id`               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        `name`             VARCHAR(120) NOT NULL,
        `email`            VARCHAR(180) NOT NULL UNIQUE,
        `password`         VARCHAR(255) NOT NULL,
        `role`             ENUM('admin','editor') NOT NULL DEFAULT 'editor',
        `status`           ENUM('active','inactive') NOT NULL DEFAULT 'active',
        `designation`      VARCHAR(255) DEFAULT NULL,
        `phone`            VARCHAR(30)  DEFAULT NULL,
        `location`         VARCHAR(255) DEFAULT NULL,
        `bio`              TEXT         DEFAULT NULL,
        `permissions_json` JSON         DEFAULT NULL,
        `profile_photo`    VARCHAR(255) DEFAULT NULL,
        `last_login_at`    DATETIME DEFAULT NULL,
        `created_at`       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at`       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
", 'Create table: admins', $log, $errors);

run($pdo, "
    CREATE TABLE IF NOT EXISTS `users` (
        `id`            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        `name`          VARCHAR(120) NOT NULL,
        `email`         VARCHAR(180) NOT NULL UNIQUE,
        `password`      VARCHAR(255) NOT NULL,
        `role`          ENUM('admin','editor') NOT NULL DEFAULT 'editor',
        `profile_photo` VARCHAR(255) DEFAULT NULL,
        `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
", 'Create table: users', $log, $errors);

run($pdo, "
    CREATE TABLE IF NOT EXISTS `activity_logs` (
        `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        `admin_id`    INT UNSIGNED DEFAULT NULL,
        `action`      VARCHAR(80) NOT NULL,
        `resource`    VARCHAR(80) NOT NULL,
        `resource_id` INT UNSIGNED DEFAULT NULL,
        `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
", 'Create table: activity_logs', $log, $errors);

run($pdo, "
    CREATE TABLE IF NOT EXISTS `hero_slides` (
        `id`                    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        `kicker`                VARCHAR(255) DEFAULT NULL,
        `title`                 VARCHAR(255) DEFAULT NULL,
        `subtitle`              VARCHAR(500) DEFAULT NULL,
        `button_text`           VARCHAR(120) DEFAULT NULL,
        `button_link`           VARCHAR(500) DEFAULT NULL,
        `secondary_button_text` VARCHAR(120) DEFAULT NULL,
        `secondary_button_link` VARCHAR(500) DEFAULT NULL,
        `image`                 VARCHAR(500) DEFAULT NULL,
        `video_url`             VARCHAR(500) DEFAULT NULL,
        `sort_order`            SMALLINT NOT NULL DEFAULT 0,
        `is_active`             TINYINT(1) NOT NULL DEFAULT 1,
        `created_at`            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at`            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
", 'Create table: hero_slides', $log, $errors);

run($pdo, "
    CREATE TABLE IF NOT EXISTS `products` (
        `id`                      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        `name`                    VARCHAR(255) NOT NULL,
        `slug`                    VARCHAR(255) NOT NULL UNIQUE,
        `subtitle`                VARCHAR(255) DEFAULT NULL,
        `category`                VARCHAR(80) DEFAULT NULL,
        `size`                    VARCHAR(80) DEFAULT NULL,
        `price`                   DECIMAL(10,2) NOT NULL DEFAULT 0,
        `original_price`          DECIMAL(10,2) DEFAULT NULL,
        `discount`                SMALLINT DEFAULT NULL,
        `rating`                  DECIMAL(3,1) DEFAULT NULL,
        `reviews`                 INT UNSIGNED DEFAULT 0,
        `stock`                   TINYINT(1) NOT NULL DEFAULT 1,
        `featured`                TINYINT(1) NOT NULL DEFAULT 0,
        `variants`                JSON DEFAULT NULL,
        `variant_prices`          JSON DEFAULT NULL,
        `variant_original_prices` JSON DEFAULT NULL,
        `images`                  JSON DEFAULT NULL,
        `badges`                  JSON DEFAULT NULL,
        `short_desc`              TEXT DEFAULT NULL,
        `description`             LONGTEXT DEFAULT NULL,
        `benefits`                JSON DEFAULT NULL,
        `ingredients`             TEXT DEFAULT NULL,
        `how_to_use`              JSON DEFAULT NULL,
        `faqs`                    JSON DEFAULT NULL,
        `tags`                    JSON DEFAULT NULL,
        `sort_order`              SMALLINT NOT NULL DEFAULT 0,
        `is_active`               TINYINT(1) NOT NULL DEFAULT 1,
        `created_at`              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at`              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
", 'Create table: products', $log, $errors);

run($pdo, "
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
", 'Create table: testimonials', $log, $errors);

run($pdo, "
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
", 'Create table: blog_posts', $log, $errors);

// Drop and recreate settings so column names always match what the PHP model expects.
run($pdo, "DROP TABLE IF EXISTS `settings`", 'Drop (old) settings table if exists', $log, $errors);
run($pdo, "
    CREATE TABLE `settings` (
        `id`             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        `setting_key`    VARCHAR(120) NOT NULL UNIQUE,
        `setting_value`  LONGTEXT DEFAULT NULL,
        `setting_type`   VARCHAR(20) NOT NULL DEFAULT 'text',
        `order_position` INT UNSIGNED NOT NULL DEFAULT 0,
        `status`         ENUM('active','inactive') NOT NULL DEFAULT 'active',
        `created_at`     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at`     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
", 'Create table: settings', $log, $errors);

run($pdo, "
    CREATE TABLE IF NOT EXISTS `contact_messages` (
        `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        `name`       VARCHAR(120) NOT NULL,
        `email`      VARCHAR(180) NOT NULL,
        `phone`      VARCHAR(30) DEFAULT NULL,
        `subject`    VARCHAR(255) NOT NULL,
        `message`    TEXT NOT NULL,
        `status`     ENUM('unread','read','replied') NOT NULL DEFAULT 'unread',
        `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
", 'Create table: contact_messages', $log, $errors);

run($pdo, "
    CREATE TABLE IF NOT EXISTS `product_page_settings` (
        `id`            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        `badge_text`    VARCHAR(255) DEFAULT NULL,
        `title`         VARCHAR(255) DEFAULT NULL,
        `subtitle`      TEXT DEFAULT NULL,
        `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
", 'Create table: product_page_settings', $log, $errors);

// ═════════════════════════════════════════════════════════════════════════════
// 3. SEED: admin
// ═════════════════════════════════════════════════════════════════════════════
run($pdo, "
    INSERT IGNORE INTO `admins` (`name`, `email`, `password`, `role`, `status`, `permissions_json`) VALUES
    ('Admin', 'admin@arionorganic.com', '\$2y\$12\$7BnDmWjB4e5GHB9FgFr3puNiKH.MyvNJJhL2xGS3sZnMWj6OJz5/i', 'admin', 'active',
     '[\"create_content\",\"edit_content\",\"delete_content\",\"publish_content\",\"manage_users\",\"view_dashboard\"]')
", 'Seed: admin user (password: admin123)', $log, $errors);

// ═════════════════════════════════════════════════════════════════════════════
// 4. SEED: settings
// ═════════════════════════════════════════════════════════════════════════════
$settings = [
    // Navbar
    'navbar_logo'             => 'https://images.unsplash.com/photo-1599599810694-b5ac4dd37e1b?q=80&w=200&auto=format&fit=crop',
    'nav_logo'                => 'https://images.unsplash.com/photo-1599599810694-b5ac4dd37e1b?q=80&w=200&auto=format&fit=crop',
    'navbar_brand_title'      => 'Arion Organic Food',
    'navbar_brand_subtitle'   => 'Organic Foods',
    'navbar_phone'            => '+92 333 8399480',
    'navbar_email'            => 'info@arionorganicfood.com',
    'navbar_welcome_text'     => 'Welcome to Arion Organic Food',
    'nav_links'               => '[{"label":"Home","path":"/"},{"label":"About","path":"/about"},{"label":"Products","path":"/products"},{"label":"Blog","path":"/blog"},{"label":"Contact","path":"/contact"}]',
    'whatsapp_number'         => '923338399480',

    // Footer
    'footer_logo'             => 'https://images.unsplash.com/photo-1599599810694-b5ac4dd37e1b?q=80&w=200&auto=format&fit=crop',
    'footer_brand_title'      => 'Arion Organic Food',
    'footer_brand_subtitle'   => 'Pure & Organic',
    'footer_about_text'       => 'Premium organic products including Desi Ghee, Honey, and Shilajit — sourced naturally.',
    'footer_phone'            => '+92 333 8399480',
    'footer_email'            => 'info@arionorganicfood.com',
    'footer_address'          => 'Office 22, 4th Floor, Pakland City Center, I-8 Markaz, Islamabad, Pakistan.',
    'footer_social_facebook'  => 'https://www.facebook.com/SSgeneraltradinguae',
    'footer_social_instagram' => 'https://www.instagram.com/ssarionorganicfood/',
    'footer_social_youtube'   => 'https://www.youtube.com/channel/UCv62oVoa-UmP8ePbMPuHydw/editing',
    'footer_social_tiktok'    => 'https://www.tiktok.com/@ssarionorganicfood',
    'footer_copyright'        => '© 2026 Arion Organic Food · All rights reserved',
    'footer_timings_heading'  => 'Working Hours',
    'footer_timings_days'     => 'Monday - Saturday',
    'footer_timings_time'     => '9:00 AM - 6:00 PM',
    'footer_quick_links'      => '[{"label":"Home","path":"/"},{"label":"About","path":"/about"},{"label":"Products","path":"/products"},{"label":"Blog","path":"/blog"},{"label":"Contact","path":"/contact"}]',
    'footer_links'            => '[{"label":"Terms & Conditions","path":"/terms-and-conditions"},{"label":"Privacy Policy","path":"/privacy-policy"},{"label":"Return Policy","path":"/return-policy"},{"label":"Shipping Policy","path":"/online-order-policy"},{"label":"Certification","path":"/certification"}]',
    'footer_social_links'     => '[{"label":"Facebook","url":"https://www.facebook.com/SSgeneraltradinguae","icon":"facebook"},{"label":"Instagram","url":"https://www.instagram.com/ssarionorganicfood/","icon":"instagram"},{"label":"YouTube","url":"https://www.youtube.com/channel/UCv62oVoa-UmP8ePbMPuHydw/editing","icon":"youtube"},{"label":"TikTok","url":"https://www.tiktok.com/@ssarionorganicfood","icon":"tiktok"}]',

    // Contact
    'contact_email'             => 'info@arionorganicfood.com',
    'contact_phone'             => '+92 333 8399480',
    'contact_whatsapp'          => '923338399480',
    'contact_address'           => 'Office 22, 4th Floor, Pakland City Center, I-8 Markaz, Islamabad, Pakistan.',
    'contact_facebook'          => 'https://www.facebook.com/SSgeneraltradinguae',
    'contact_instagram'         => 'https://www.instagram.com/ssarionorganicfood/',
    'contact_youtube'           => 'https://www.youtube.com/channel/UCv62oVoa-UmP8ePbMPuHydw/editing',
    'contact_tiktok'            => 'https://www.tiktok.com/@ssarionorganicfood',
    'contact_availability_text' => 'Available Mon – Sat, 9am – 6pm',

    // Home — story / OurStory
    'home_story_heading' => 'Our Story',
    'home_story_text'    => 'From the pristine valleys of Pakistan, we bring you the purest organic products.',
    'home_story_image'   => '',
    'home_story_bullets' => '["100% Natural","No Preservatives","Ethically Sourced","Lab Tested"]',

    // Home — purity promise
    'home_purity_items' => '[{"icon":"🌿","title":"100% Natural","desc":"Free from chemicals and preservatives"},{"icon":"🔬","title":"Lab Tested","desc":"Verified for purity and quality"},{"icon":"🌍","title":"Ethically Sourced","desc":"Sustainable farming practices"}]',

    // Home — CTA
    'cta_title'       => 'Ready to Experience Pure Organic Goodness?',
    'cta_subtitle'    => 'Order now and get fresh products delivered to your door.',
    'cta_button_text' => 'Shop Now',
    'cta_button_link' => '/products',

    // Home — products section
    'home_company_heading' => 'Our Products',
    'home_company_subtext' => 'Discover our range of premium organic products.',

    // Home — blog section
    'home_blog_heading' => 'Latest from Our Blog',
    'home_blog_subtext' => 'Tips, recipes, and insights on organic living.',

    // About — hero
    'about_hero_title'    => 'About Arion Organic Food',
    'about_hero_subtitle' => 'Pure, Natural, Authentic',
    'about_hero_quote'    => "Bringing nature's finest directly to your table since generations.",
    'about_hero_image'    => '',

    // About — story
    'about_story_headline'   => 'Our Heritage of Purity',
    'about_story_paragraphs' => '["We are a family-run business passionate about bringing you the finest organic products from Pakistan\'s natural landscape.","Every product we offer is carefully sourced, tested, and delivered with love."]',
    'about_story_keywords'   => '["Pure","Organic","Authentic","Natural"]',

    // About — timeline
    'about_timeline' => '[{"step":"01","icon":"🌱","title":"Humble Beginnings","desc":"Started as a small family operation dedicated to organic farming."},{"step":"02","icon":"🔬","title":"Quality Standards","desc":"Introduced lab testing to ensure purity of every batch."},{"step":"03","icon":"🌍","title":"Growing Reach","desc":"Expanded to serve customers across Pakistan."},{"step":"04","icon":"⭐","title":"Trusted Brand","desc":"Earned the trust of thousands of families nationwide."}]',

    // About — mission
    'about_mission' => '[{"icon":"🎯","title":"Our Mission","desc":"To make pure organic food accessible to every Pakistani household.","color":"#2e6b4f"},{"icon":"🔭","title":"Our Vision","desc":"A healthier Pakistan through organic, chemical-free nutrition.","color":"#c8a04a"},{"icon":"💚","title":"Our Values","desc":"Honesty, purity, and respect for nature guide everything we do.","color":"#4a7c59"}]',

    // About — duality
    'about_traditional' => '["Hand-selected raw materials","Traditional purification methods","Generational knowledge","Small-batch production"]',
    'about_modern'      => '["Modern hygiene standards","Lab quality testing","Hygienic packaging","Fast nationwide delivery"]',

    // Home — commitment section
    'home_commitment_eyebrow'        => 'Why Choose Arion',
    'home_commitment_heading'        => 'Our Commitment to You',
    'home_commitment_heading_accent' => 'Quality & Purity',
    'home_commitment_subtext'        => 'We are dedicated to bringing you the finest organic products, sourced sustainably and tested for purity.',
    'home_commitment_btn_text'       => 'Learn More',
    'home_commitment_btn_link'       => '/about',

    // Home — testimonials section
    'home_testimonials_eyebrow'        => 'What Our Customers Say',
    'home_testimonials_heading'        => 'Real Reviews from Real Customers',
    'home_testimonials_heading_accent' => 'Trusted & Loved',
    'home_testimonials_subtext'        => 'Join thousands of happy customers who have made Arion their trusted source for pure organic food.',

    // Product page
    'product_page_heading' => 'Our Products',
    'product_page_subtext' => 'Explore our full range of organic products.',

    // Blog page
    'blog_page_heading' => 'Our Blog',
    'blog_page_subtext' => 'Insights on organic living and wellness.',
];

$stmt = $pdo->prepare("INSERT IGNORE INTO `settings` (`setting_key`, `setting_value`) VALUES (:k, :v)");
$settingsOk = 0;
foreach ($settings as $k => $v) {
    try {
        $stmt->execute([':k' => $k, ':v' => $v]);
        $settingsOk++;
    } catch (PDOException $e) {
        $errors[] = "&#10007; Setting '{$k}': " . htmlspecialchars($e->getMessage());
    }
}
$log[] = "&#10003; Seed: {$settingsOk} settings rows inserted";

// ═════════════════════════════════════════════════════════════════════════════
// 5. SEED: products (10 products)
// ═════════════════════════════════════════════════════════════════════════════
$products = [
    [
        'name' => 'Pure Himalayan Shilajit 5GM', 'slug' => 'pure-himalayan-shilajit-5gm',
        'subtitle' => 'Premium Golden Grade Resin', 'category' => 'herbal', 'size' => '5g',
        'price' => 1000.00, 'original_price' => 1200.00, 'discount' => 16,
        'rating' => 4.9, 'reviews' => 92, 'stock' => 1, 'featured' => 0,
        'variants' => '["5g"]', 'variant_prices' => '{"5g":1000}', 'variant_original_prices' => '{"5g":1200}',
        'images' => '["/uploads/product-images/shilajit 5g.png"]', 'badges' => '["Trial Size","Pure Product"]',
        'short_desc' => 'Pure, high-altitude gold-grade mineral resin. Perfect trial size for beginners.',
        'description' => 'Sourced from pristine Himalayan mountain ranges, our 5gm Shilajit jar offers premium quality. An excellent choice for individuals looking to experience the profound cellular energy and recovery benefits of ancient organic minerals.',
        'benefits' => '["Supplies trace ionic minerals to counteract everyday physical exhaustion.","Improves your body\'s natural resilience against environmental stressors.","Authentic resin form ensuring zero fillers, binding powders, or synthetic shortcuts."]',
        'ingredients' => '100% Pure Purified Shilajit Resin.',
        'how_to_use' => '[{"step":"01","text":"Dissolve a small grain-sized portion in any warm, non-chlorinated fluid daily."},{"step":"02","text":"Always ensure the jar lid is free of sticky residue before closing to keep it easy to open."}]',
        'faqs' => '[{"q":"Can this be taken with coffee?","a":"Yes, dissolving shilajit in your morning coffee is a popular way to mask its earthy taste while enjoying sustained focus."}]',
        'tags' => '["shilajit","resin","5g","himalayan","herbal","trial"]',
        'sort_order' => 10,
    ],
    [
        'name' => 'Pure Himalayan Shilajit-10GM', 'slug' => 'pure-himalayan-shilajit-10gm',
        'subtitle' => 'Premium Golden Grade Resin', 'category' => 'herbal', 'size' => '10g',
        'price' => 2000.00, 'original_price' => 2100.00, 'discount' => 5,
        'rating' => 5.0, 'reviews' => 184, 'stock' => 1, 'featured' => 1,
        'variants' => '["10g"]', 'variant_prices' => '{"10g":2000}', 'variant_original_prices' => '{"10g":2100}',
        'images' => '["/uploads/product-images/shilajit 10g.png"]', 'badges' => '["Gold Grade","Organic"]',
        'short_desc' => 'Pure, gold-grade mineral resin sourced from high-altitude Himalayan peaks, rich in Fulvic acid.',
        'description' => 'Our Pure Himalayan Shilajit resin is meticulously purified to eliminate impurities while keeping its complex trace mineral profile intact.',
        'benefits' => '["Extremely rich in Fulvic Acid and over 85 essential trace ionic minerals.","Accelerates natural energy levels, cellular ATP production, and daily stamina.","Supports robust immune response, joint health, and sharp mental clarity."]',
        'ingredients' => '100% Pure Purified Shilajit Resin.',
        'how_to_use' => '[{"step":"01","text":"Use the included measuring spoon to dissolve a pea-sized portion (approx. 250mg) in warm water, milk, or green tea."},{"step":"02","text":"Consume on an empty stomach first thing in the morning for maximum metabolic absorption."},{"step":"03","text":"Store tightly sealed in a cool, dry place away from moisture to prevent hardening."}]',
        'faqs' => '[{"q":"What makes gold-grade shilajit different?","a":"Gold-grade shilajit is collected at extreme altitudes (above 16,000 feet), yielding the highest natural concentration of therapeutic nutrients and fulvic minerals."},{"q":"How long does a 10g jar last?","a":"When consumed daily at the recommended pea-sized dosage, a 10gm jar will comfortably last around 35 to 40 days."}]',
        'tags' => '["shilajit","resin","10g","himalayan","herbal","vitality"]',
        'sort_order' => 9,
    ],
    [
        'name' => 'Arion Cow Desi Ghee 500GM', 'slug' => 'arion-cow-desi-ghee-500gm',
        'subtitle' => 'Traditional Clarified Butter', 'category' => 'ghee', 'size' => '500g',
        'price' => 2000.00, 'original_price' => 2250.00, 'discount' => 0,
        'rating' => 5.0, 'reviews' => 248, 'stock' => 1, 'featured' => 1,
        'variants' => '["500g"]', 'variant_prices' => '{"500g":2000}', 'variant_original_prices' => '{"500g":2250}',
        'images' => '["/uploads/product-images/cow-ghee-500g.png"]', 'badges' => '["Best Seller","Organic"]',
        'short_desc' => "High-quality Desi Ghee made from 100% carefully selected cow's milk.",
        'description' => "We use 100% cow's milk to make our Desi Ghee, very carefully chosen to suit our requirements and fulfill hygiene standards.",
        'benefits' => '["Helps increase bile production.","Improve insulin resistance by normalizing blood sugars.","Decrease inflammation.","Increase energy.","Omega 3 Fatty Acids (Healthy Fats).","Vitamin A, D, E and K (Fat-soluble vitamins)."]',
        'ingredients' => '100% Pure Desi Cow Ghee.',
        'how_to_use' => '[{"step":"01","text":"Use daily in cooking or with warm milk."},{"step":"02","text":"Store in a cool, dry place."}]',
        'faqs' => '[{"q":"Does this need refrigeration?","a":"No. Keep it at room temperature in a dry place."}]',
        'tags' => '["ghee","cow","500g","traditional"]',
        'sort_order' => 1,
    ],
    [
        'name' => 'Arion Cow Desi Ghee 1KG', 'slug' => 'arion-cow-desi-ghee-1kg',
        'subtitle' => 'Traditional Clarified Butter', 'category' => 'ghee', 'size' => '1kg',
        'price' => 4000.00, 'original_price' => 4500.00, 'discount' => 0,
        'rating' => 5.0, 'reviews' => 182, 'stock' => 1, 'featured' => 0,
        'variants' => '["1kg"]', 'variant_prices' => '{"1kg":4000}', 'variant_original_prices' => '{"1kg":4500}',
        'images' => '["/uploads/product-images/ghee-cow-1kg.png"]', 'badges' => '["Pure"]',
        'short_desc' => "High-quality Desi Ghee made from 100% carefully selected cow's milk.",
        'description' => "We use 100% cow's milk to make our Desi Ghee, very carefully chosen to suit our requirements and fulfill hygiene standards.",
        'benefits' => '["Helps increase bile production.","Improve insulin resistance by normalizing blood sugars.","Decrease inflammation.","Omega 3 Fatty Acids (Healthy Fats).","Vitamin A, D, E and K (Fat-soluble vitamins)."]',
        'ingredients' => '100% Pure Desi Cow Ghee.',
        'how_to_use' => '[{"step":"01","text":"Use in cooking, frying, or as finishing."},{"step":"02","text":"Store at room temperature."}]',
        'faqs' => '[{"q":"Is this the same quality as 500g?","a":"Yes, same quality in larger size."}]',
        'tags' => '["ghee","cow","1kg","a2"]',
        'sort_order' => 2,
    ],
    [
        'name' => 'Arion Honey 500GM', 'slug' => 'arion-honey-500gm',
        'subtitle' => 'Unfiltered & Unheated', 'category' => 'honey', 'size' => '500g',
        'price' => 3500.00, 'original_price' => 3750.00, 'discount' => 0,
        'rating' => 5.0, 'reviews' => 312, 'stock' => 1, 'featured' => 1,
        'variants' => '["500g"]', 'variant_prices' => '{"500g":3500}', 'variant_original_prices' => '{"500g":3750}',
        'images' => '["/uploads/product-images/honey 500 g.png"]', 'badges' => '["Best Seller","Pure"]',
        'short_desc' => 'Cold-extracted, unfiltered raw honey taken directly from natural hives.',
        'description' => 'This honey is extracted by honeybees that collect nectar from flowers, making it naturally rich in vitamins, especially Vitamin C.',
        'benefits' => '["Loaded with natural antioxidants with anti-inflammatory and immune boosting properties.","Contains healthy minerals including zinc, boron, manganese, magnesium, calcium, and selenium.","Has healing properties for minor wound and burn treatment.","Contains antibacterial properties, soothes sore throat and treats cough.","Can help regulate blood sugar levels due to a low glycemic index."]',
        'ingredients' => '100% Raw, Unfiltered Honey.',
        'how_to_use' => '[{"step":"01","text":"Use in warm water, tea, or daily spoonful."},{"step":"02","text":"Store in a cool dry place."}]',
        'faqs' => '[{"q":"Why does honey crystallize?","a":"Crystallization is natural and a sign of purity."}]',
        'tags' => '["honey","500g","raw"]',
        'sort_order' => 5,
    ],
    [
        'name' => 'Arion Honey 1KG', 'slug' => 'arion-honey-1kg',
        'subtitle' => 'Unfiltered & Unheated', 'category' => 'honey', 'size' => '1kg',
        'price' => 7000.00, 'original_price' => 7500.00, 'discount' => 0,
        'rating' => 5.0, 'reviews' => 167, 'stock' => 1, 'featured' => 0,
        'variants' => '["1kg"]', 'variant_prices' => '{"1kg":7000}', 'variant_original_prices' => '{"1kg":7500}',
        'images' => '["/uploads/product-images/honey-1kg.png"]', 'badges' => '["Organic"]',
        'short_desc' => 'Cold-extracted, unfiltered raw honey taken directly from natural hives.',
        'description' => 'This honey is extracted by honeybees that collect nectar from flowers, making it naturally rich in vitamins, especially Vitamin C.',
        'benefits' => '["Loaded with natural antioxidants with anti-inflammatory, anti-allergy, and immune-boosting properties.","Contains antibacterial properties that help fight pathogens, soothe sore throat, and treat cough.","Can help regulate blood sugar levels due to a low glycemic index profile."]',
        'ingredients' => '100% Raw, Unfiltered Honey.',
        'how_to_use' => '[{"step":"01","text":"Use as a natural sweetener in meals and drinks."},{"step":"02","text":"Keep in dry place away from heat."}]',
        'faqs' => '[{"q":"Is this filtered?","a":"Lightly strained only, no heat processing."}]',
        'tags' => '["honey","1kg","raw"]',
        'sort_order' => 6,
    ],
    [
        'name' => 'Arion Goat Desi Ghee 500GM', 'slug' => 'arion-goat-desi-ghee-500gm',
        'subtitle' => 'Traditional Clarified Butter', 'category' => 'ghee', 'size' => '500g',
        'price' => 3000.00, 'original_price' => 3250.00, 'discount' => 0,
        'rating' => 5.0, 'reviews' => 131, 'stock' => 1, 'featured' => 1,
        'variants' => '["500g"]', 'variant_prices' => '{"500g":3000}', 'variant_original_prices' => '{"500g":3250}',
        'images' => '["/uploads/product-images/goat-ghee-500g.png"]', 'badges' => '["Best Seller","Organic"]',
        'short_desc' => 'Traditional clarified butter made from goat milk for rich flavor and aroma.',
        'description' => 'Our Pure Desi Goat Ghee is prepared in small batches using traditional methods for rich aroma, taste, and nutritional quality.',
        'benefits' => '["Naturally rich taste and aroma","Supports everyday cooking","Traditional small-batch quality"]',
        'ingredients' => '100% Pure Desi Goat Ghee.',
        'how_to_use' => '[{"step":"01","text":"Use daily in cooking or with warm milk."},{"step":"02","text":"Store in a cool, dry place."}]',
        'faqs' => '[{"q":"Does this need refrigeration?","a":"No. Keep it at room temperature in a dry place."}]',
        'tags' => '["ghee","goat","500g","traditional"]',
        'sort_order' => 3,
    ],
    [
        'name' => 'Arion Goat Desi Ghee 1KG', 'slug' => 'arion-goat-desi-ghee-1kg',
        'subtitle' => 'Traditional Clarified Butter', 'category' => 'ghee', 'size' => '1kg',
        'price' => 6000.00, 'original_price' => 6500.00, 'discount' => 0,
        'rating' => 5.0, 'reviews' => 96, 'stock' => 1, 'featured' => 0,
        'variants' => '["1kg"]', 'variant_prices' => '{"1kg":6000}', 'variant_original_prices' => '{"1kg":6500}',
        'images' => '["/uploads/product-images/ghee-goat-1kg.png"]', 'badges' => '["Pure"]',
        'short_desc' => 'Family-size goat ghee with rich flavor and traditional quality.',
        'description' => 'Pure Desi Goat Ghee 1kg is ideal for regular home use with the same traditional quality and aroma.',
        'benefits' => '["Everyday cooking support","Naturally rich flavor","Premium traditional quality"]',
        'ingredients' => '100% Pure Desi Goat Ghee.',
        'how_to_use' => '[{"step":"01","text":"Use in cooking, frying, or as finishing."},{"step":"02","text":"Store at room temperature."}]',
        'faqs' => '[{"q":"Is this the same quality as 500g?","a":"Yes, same quality in larger size."}]',
        'tags' => '["ghee","goat","1kg","traditional"]',
        'sort_order' => 4,
    ],
    [
        'name' => 'Arion Buffalo Desi Ghee-500GM', 'slug' => 'arion-buffalo-desi-ghee-500gm',
        'subtitle' => 'Rich & Premium Clarified Butter', 'category' => 'ghee', 'size' => '500g',
        'price' => 1800.00, 'original_price' => 2050.00, 'discount' => 0,
        'rating' => 5.0, 'reviews' => 142, 'stock' => 1, 'featured' => 1,
        'variants' => '["500g","1kg"]', 'variant_prices' => '{"500g":1800,"1kg":3400}', 'variant_original_prices' => '{"500g":2050,"1kg":3900}',
        'images' => '["/uploads/product-images/buffalo-ghee-500g.png"]', 'badges' => '["Premium Quality","Pure Desi"]',
        'short_desc' => 'Arion premium creamy white clarified butter derived from healthy, grass-fed buffalo milk.',
        'description' => 'Our Arion Buffalo Desi Ghee is made using traditional methods to ensure an authentic taste and a thick, granular texture. It is 100% pure, free from harmful trans fats, chemicals, and hydrogenated oils.',
        'benefits' => '["Rich source of healthy Medium-Chain Triglycerides (MCTs) for immediate physical energy.","High smoke point (250°C), preventing the formation of dangerous free radicals during deep cooking.","Lubricates joints and deeply nourishes internal bodily tissues."]',
        'ingredients' => '100% Pure Clarified Buffalo Milk Fat.',
        'how_to_use' => '[{"step":"01","text":"Perfect for searing traditional Pakistani meats, frying tarkas, or making rich winter halwas."},{"step":"02","text":"Drizzle over freshly baked flatbreads or parathas for an authentic rich flavor depth."},{"step":"03","text":"Store in a cool, dry pantry inside its original glass container; no refrigeration required."}]',
        'faqs' => '[{"q":"What makes Arion Buffalo Ghee different from Cow Ghee?","a":"Arion Buffalo Ghee is creamy-white and features a bolder, richer aroma profile that holds up beautifully in heavy traditional subzis and handis."}]',
        'tags' => '["ghee","buffalo","500g","arion","pure","traditional"]',
        'sort_order' => 7,
    ],
    [
        'name' => 'Arion Buffalo Desi Ghee-1KG', 'slug' => 'arion-buffalo-desi-ghee-1kg',
        'subtitle' => 'Rich & Premium Clarified Butter', 'category' => 'ghee', 'size' => '1kg',
        'price' => 3400.00, 'original_price' => 3900.00, 'discount' => 5,
        'rating' => 4.9, 'reviews' => 216, 'stock' => 1, 'featured' => 1,
        'variants' => '["500g","1kg"]', 'variant_prices' => '{"500g":1800,"1kg":3400}', 'variant_original_prices' => '{"500g":2050,"1kg":3900}',
        'images' => '["/uploads/product-images/ghee-buff-1kg.png"]', 'badges' => '["Best Value","100% Organic"]',
        'short_desc' => 'Family-sized 1kg jar of Arion premium clarified butter. Slow-cooked from pure buffalo milk.',
        'description' => 'Our 1kg pack of Arion Buffalo Ghee is perfect for everyday cooking. Made using traditional methods, it keeps all its natural vitamins and healthy fats.',
        'benefits' => '["Provides sustained daily energy without causing rapid blood-glucose spikes.","Contains zero hydrogenated vegetable blends, chemical fillers, or artificial scent additives.","Slow-cooked in small batches to guarantee authentic, historic culinary quality."]',
        'ingredients' => '100% Pure Clarified Buffalo Milk Fat.',
        'how_to_use' => '[{"step":"01","text":"Use as your primary cooking medium for all daily household recipes."},{"step":"02","text":"Always make sure to use a clean, thoroughly dry spoon to keep moisture completely out of the jar."}]',
        'faqs' => '[{"q":"How should I store this 1kg family pack?","a":"Keep it tightly sealed in a dark, cool kitchen cupboard. Keep it away from wet areas to ensure it retains its aroma for up to 12 months."}]',
        'tags' => '["ghee","buffalo","1kg","arion","family-pack","organic"]',
        'sort_order' => 8,
    ],
];

$productStmt = $pdo->prepare("
    INSERT IGNORE INTO `products`
        (`name`,`slug`,`subtitle`,`category`,`size`,`price`,`original_price`,`discount`,
         `rating`,`reviews`,`stock`,`featured`,`variants`,`variant_prices`,`variant_original_prices`,
         `images`,`badges`,`short_desc`,`description`,`benefits`,`ingredients`,
         `how_to_use`,`faqs`,`tags`,`sort_order`,`is_active`,`created_at`,`updated_at`)
    VALUES
        (:name,:slug,:subtitle,:category,:size,:price,:original_price,:discount,
         :rating,:reviews,:stock,:featured,:variants,:variant_prices,:variant_original_prices,
         :images,:badges,:short_desc,:description,:benefits,:ingredients,
         :how_to_use,:faqs,:tags,:sort_order,1,NOW(),NOW())
");

$productsOk = 0;
foreach ($products as $p) {
    try {
        $productStmt->execute([
            ':name' => $p['name'], ':slug' => $p['slug'], ':subtitle' => $p['subtitle'],
            ':category' => $p['category'], ':size' => $p['size'],
            ':price' => $p['price'], ':original_price' => $p['original_price'], ':discount' => $p['discount'],
            ':rating' => $p['rating'], ':reviews' => $p['reviews'],
            ':stock' => $p['stock'], ':featured' => $p['featured'],
            ':variants' => $p['variants'], ':variant_prices' => $p['variant_prices'],
            ':variant_original_prices' => $p['variant_original_prices'],
            ':images' => $p['images'], ':badges' => $p['badges'],
            ':short_desc' => $p['short_desc'], ':description' => $p['description'],
            ':benefits' => $p['benefits'], ':ingredients' => $p['ingredients'],
            ':how_to_use' => $p['how_to_use'], ':faqs' => $p['faqs'], ':tags' => $p['tags'],
            ':sort_order' => $p['sort_order'],
        ]);
        $productsOk++;
    } catch (PDOException $e) {
        $errors[] = "&#10007; Product '{$p['slug']}': " . htmlspecialchars($e->getMessage());
    }
}
$log[] = "&#10003; Seed: {$productsOk}/10 products inserted (INSERT IGNORE)";

// ── Fix image paths in existing records (old path → uploads path) ────────────
$imageUpdates = [
    'pure-himalayan-shilajit-5gm'    => '["/uploads/product-images/shilajit 5g.png"]',
    'pure-himalayan-shilajit-10gm'   => '["/uploads/product-images/shilajit 10g.png"]',
    'arion-cow-desi-ghee-500gm'      => '["/uploads/product-images/cow-ghee-500g.png"]',
    'arion-cow-desi-ghee-1kg'        => '["/uploads/product-images/ghee-cow-1kg.png"]',
    'arion-honey-500gm'              => '["/uploads/product-images/honey 500 g.png"]',
    'arion-honey-1kg'                => '["/uploads/product-images/honey-1kg.png"]',
    'arion-goat-desi-ghee-500gm'     => '["/uploads/product-images/goat-ghee-500g.png"]',
    'arion-goat-desi-ghee-1kg'       => '["/uploads/product-images/ghee-goat-1kg.png"]',
    'arion-buffalo-desi-ghee-500gm'  => '["/uploads/product-images/buffalo-ghee-500g.png"]',
    'arion-buffalo-desi-ghee-1kg'    => '["/uploads/product-images/ghee-buff-1kg.png"]',
];
$imgStmt = $pdo->prepare("UPDATE `products` SET `images` = :images WHERE `slug` = :slug");
$imgUpdated = 0;
foreach ($imageUpdates as $slug => $images) {
    try {
        $imgStmt->execute([':images' => $images, ':slug' => $slug]);
        $imgUpdated++;
    } catch (PDOException $e) {
        $errors[] = "&#10007; Image update '{$slug}': " . htmlspecialchars($e->getMessage());
    }
}
$log[] = "&#10003; Updated images for {$imgUpdated}/10 existing products";

// ═════════════════════════════════════════════════════════════════════════════
// 6. SEED: testimonials (4) — only insert if table is empty (never wipe admin data)
// ═════════════════════════════════════════════════════════════════════════════
$existingTestimonials = (int) $pdo->query("SELECT COUNT(*) FROM `testimonials`")->fetchColumn();

if ($existingTestimonials === 0) {
    $testimonials = [
        ['name' => 'Ayesha Malik',   'role' => 'Mother of 3, Lahore',         'avatar' => '/avatar1.png', 'rating' => 5, 'sort_order' => 1, 'verified' => 1, 'product' => 'Pure Desi Ghee',      'quote' => "Since switching to Arion's ghee and honey, I've noticed a real difference in my family's health. The quality is unmistakable — you can literally taste the purity. This is the real thing."],
        ['name' => 'Bilal Chaudhry', 'role' => 'Nutritionist, Islamabad',     'avatar' => '/avatar2.png', 'rating' => 5, 'sort_order' => 2, 'verified' => 1, 'product' => 'Raw Honey 500g',      'quote' => "As a nutritionist, I'm very particular about what I recommend. Arion's products are genuinely chemical-free and traditionally sourced. I recommend them to all my clients without hesitation."],
        ['name' => 'Sadia Hussain',  'role' => 'Wellness Coach, Karachi',     'avatar' => '/avatar3.png', 'rating' => 5, 'sort_order' => 3, 'verified' => 1, 'product' => 'Himalayan Shilajit',  'quote' => "The Shilajit quality is exceptional. I've tried several brands but nothing compares to the purity and potency of Arion's product. My energy levels have improved noticeably."],
        ['name' => 'Usman Tariq',    'role' => 'Fitness Trainer, Rawalpindi', 'avatar' => '',             'rating' => 5, 'sort_order' => 4, 'verified' => 1, 'product' => 'Arion Cow Desi Ghee', 'quote' => "I switched my clients to Arion Cow Ghee for their cooking and the feedback has been amazing. Pure, clean flavor and absolutely no compromise on quality. Highly recommended for athletes."],
    ];

    $testStmt = $pdo->prepare("
        INSERT INTO `testimonials`
            (`name`,`role`,`avatar`,`rating`,`quote`,`product`,`verified`,`sort_order`,`is_active`,`created_at`,`updated_at`)
        VALUES (:name,:role,:avatar,:rating,:quote,:product,:verified,:sort_order,1,NOW(),NOW())
    ");

    $testOk = 0;
    foreach ($testimonials as $t) {
        try {
            $testStmt->execute([
                ':name' => $t['name'], ':role' => $t['role'], ':avatar' => $t['avatar'],
                ':rating' => $t['rating'], ':quote' => $t['quote'], ':product' => $t['product'],
                ':verified' => $t['verified'], ':sort_order' => $t['sort_order'],
            ]);
            $testOk++;
        } catch (PDOException $e) {
            $errors[] = "&#10007; Testimonial '{$t['name']}': " . htmlspecialchars($e->getMessage());
        }
    }
    $log[] = "&#10003; Seed: {$testOk}/4 testimonials inserted";
} else {
    $log[] = "&#10003; Testimonials already exist ({$existingTestimonials} rows) — skipping seed";
}

// ═════════════════════════════════════════════════════════════════════════════
// 7. SEED: blog post (1)
// ═════════════════════════════════════════════════════════════════════════════
run($pdo, "
    INSERT IGNORE INTO `blog_posts`
        (`title`,`slug`,`excerpt`,`content`,`image`,`author`,`category`,`tags`,`is_published`,`published_at`,`sort_order`,`created_at`,`updated_at`)
    VALUES (
        'Shilajit for Daily Energy, Strength, and Recovery',
        'shilajit-energy-strength-recovery',
        'Discover how pure Himalayan shilajit supports stamina, focus, post-work recovery, and long-term wellness when used consistently.',
        '<p>Deep inside the high Himalayan mountains, nature creates one of its most powerful wellness secrets. Shilajit is a natural, dark mineral resin used for thousands of years to boost health.</p><h2>Key Health Benefits</h2><ul><li><strong>Natural Energy Booster</strong> — Helps your body produce clean energy so you feel less tired.</li><li><strong>Rich in Minerals</strong> — Contains over 85 natural minerals.</li><li><strong>Protects Health</strong> — Packed with natural antioxidants (Fulvic Acid).</li><li><strong>Sharpens the Mind</strong> — Supports focus and memory.</li><li><strong>Stronger Body</strong> — Helps muscles recover faster after exercise.</li></ul><h2>How to Use</h2><ol><li>Take a pea-sized piece of the resin.</li><li>Drop it into warm water, warm milk, or green tea.</li><li>Stir until dissolved and drink on an empty stomach.</li></ol>',
        'https://images.unsplash.com/photo-1667484423744-f32654ba7f4b?q=80&w=1631&auto=format&fit=crop',
        'Arion Wellness Team',
        'shilajit-wellness',
        '[\"shilajit\",\"energy\",\"recovery\",\"stamina\",\"focus\"]',
        1,
        '2026-05-22 00:00:00',
        1,
        NOW(), NOW()
    )
", 'Seed: 1 blog post', $log, $errors);

// ═════════════════════════════════════════════════════════════════════════════
// 8. SEED: hero slide (1)
// ═════════════════════════════════════════════════════════════════════════════
run($pdo, "
    INSERT IGNORE INTO `hero_slides`
        (`title`,`subtitle`,`button_text`,`button_link`,`image`,`sort_order`,`is_active`,`created_at`,`updated_at`)
    VALUES (
        'Pure by Nature — Proven by Integrity.',
        'Discover Natural Arion Honey, Ghee, and Shilajit.',
        'Shop Now',
        '/products',
        NULL,
        1, 1, NOW(), NOW()
    )
", 'Seed: 1 hero slide', $log, $errors);

// ═════════════════════════════════════════════════════════════════════════════
// 9. SEED: product page settings
// ═════════════════════════════════════════════════════════════════════════════
run($pdo, "
    INSERT IGNORE INTO `product_page_settings`
        (`badge_text`,`title`,`subtitle`,`created_at`,`updated_at`)
    VALUES (
        '✦ Arion Organics',
        'Our Products',
        'Pure, traditional, and naturally sourced wellness essentials for your everyday life.',
        NOW(), NOW()
    )
", 'Seed: product page settings', $log, $errors);

// ═════════════════════════════════════════════════════════════════════════════
// Output
// ═════════════════════════════════════════════════════════════════════════════
$totalErrors = count($errors);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Arion Organic Food — Seed Runner</title>
    <style>
        body { font-family: system-ui, sans-serif; background: #0d1117; color: #e6edf3; max-width: 780px; margin: 2rem auto; padding: 0 1rem; }
        h1   { font-size: 1.4rem; color: #c8a04a; margin-bottom: 0.25rem; }
        p.sub{ color: #888; font-size: 0.85rem; margin-bottom: 1.5rem; }
        .box { background: #161b22; border: 1px solid #30363d; border-radius: 10px; padding: 1.25rem 1.5rem; margin-bottom: 1rem; }
        .ok  { color: #3fb950; }
        .err { color: #f85149; }
        li   { line-height: 1.7; font-size: 0.9rem; }
        .badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.8rem; font-weight: 600; }
        .badge-ok  { background: rgba(63,185,80,.15); color: #3fb950; }
        .badge-err { background: rgba(248,81,73,.15); color: #f85149; }
    </style>
</head>
<body>
    <h1>Arion Organic Food — Seed Runner</h1>
    <p class="sub">Database: <strong><?= htmlspecialchars($dbName) ?></strong> &nbsp;|&nbsp; <?= date('Y-m-d H:i:s') ?></p>

    <div class="box">
        <p style="margin:0 0 .75rem"><strong>Result:</strong>
            <?php if ($totalErrors === 0): ?>
                <span class="badge badge-ok">All passed</span>
            <?php else: ?>
                <span class="badge badge-err"><?= $totalErrors ?> error(s)</span>
            <?php endif; ?>
        </p>
        <ul>
            <?php foreach ($log as $entry): ?>
                <li class="ok"><?= $entry ?></li>
            <?php endforeach; ?>
            <?php foreach ($errors as $entry): ?>
                <li class="err"><?= $entry ?></li>
            <?php endforeach; ?>
        </ul>
    </div>

    <p style="color:#555;font-size:.8rem;">
        Re-running this script is safe — all inserts use <code>INSERT IGNORE</code>
        and all tables use <code>CREATE TABLE IF NOT EXISTS</code>.
    </p>
</body>
</html>
