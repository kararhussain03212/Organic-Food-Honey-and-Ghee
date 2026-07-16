<?php

/**
 * Migration + seed: turn hero_slides into a product-linked circle slider.
 *
 * - Adds product_id / tags / gradient / order_position columns (idempotent).
 * - Deactivates legacy non-product slides (old video hero).
 * - Seeds 6 slides linked to the current flagship products, inheriting
 *   title/description/tags/image from the product (overrides left NULL).
 *
 * Run: php backend/seeds/migrate_hero_product_slides.php
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

use Backend\Config\Database;

$pdo = Database::connection();

$columnExists = static function (string $column) use ($pdo): bool {
    $stmt = $pdo->prepare(
        'SELECT COUNT(*) FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = "hero_slides" AND COLUMN_NAME = :col'
    );
    $stmt->execute([':col' => $column]);
    return (int) $stmt->fetchColumn() > 0;
};

// 1. Schema changes
if (!$columnExists('product_id')) {
    $pdo->exec('ALTER TABLE hero_slides ADD COLUMN product_id INT UNSIGNED NULL AFTER id,
                ADD CONSTRAINT fk_hero_slides_product FOREIGN KEY (product_id)
                REFERENCES products(id) ON DELETE CASCADE');
    echo "Added product_id column + FK\n";
}
if (!$columnExists('tags')) {
    $pdo->exec('ALTER TABLE hero_slides ADD COLUMN tags LONGTEXT NULL AFTER subtitle');
    echo "Added tags column\n";
}
if (!$columnExists('gradient')) {
    $pdo->exec('ALTER TABLE hero_slides ADD COLUMN gradient VARCHAR(255) NULL AFTER tags');
    echo "Added gradient column\n";
}
if (!$columnExists('order_position')) {
    $pdo->exec('ALTER TABLE hero_slides ADD COLUMN order_position SMALLINT NOT NULL DEFAULT 0 AFTER sort_order');
    $pdo->exec('UPDATE hero_slides SET order_position = sort_order');
    echo "Added order_position column (backfilled from sort_order)\n";
}

// 2. Legacy video-hero slides (no product link) are no longer rendered — deactivate them.
$deactivated = $pdo->exec('UPDATE hero_slides SET is_active = 0 WHERE product_id IS NULL');
if ($deactivated > 0) {
    echo "Deactivated {$deactivated} legacy non-product slide(s)\n";
}

// 3. Seed product-linked slides (matches the slides previously hardcoded in CircleSlider.jsx)
$seed = [
    ['slug' => 'arion-honey-500gm',             'gradient' => 'radial-gradient(circle, #FCF5E5 0%, #E6C280 100%)'],
    ['slug' => 'arion-cow-desi-ghee-500gm',     'gradient' => 'radial-gradient(circle, #FDF9E2 0%, #E8D786 100%)'],
    ['slug' => 'pure-himalayan-shilajit-5gm',   'gradient' => 'radial-gradient(circle, #F2F2F2 0%, #C0C0C0 100%)'],
    ['slug' => 'arion-buffalo-desi-ghee-500gm', 'gradient' => 'radial-gradient(circle, #F8F8F8 0%, #DCDCDC 100%)'],
    ['slug' => 'arion-goat-desi-ghee-500gm',    'gradient' => 'radial-gradient(circle, #EBF5EB 0%, #C2E0C2 100%)'],
    ['slug' => 'arion-honey-1kg',               'gradient' => 'radial-gradient(circle, #FEF2E4 0%, #D4A373 100%)'],
];

$findProduct = $pdo->prepare('SELECT id, name FROM products WHERE slug = :slug LIMIT 1');
$slideExists = $pdo->prepare('SELECT COUNT(*) FROM hero_slides WHERE product_id = :pid');
$insert = $pdo->prepare(
    'INSERT INTO hero_slides (product_id, kicker, gradient, order_position, sort_order, is_active, created_at, updated_at)
     VALUES (:pid, :kicker, :gradient, :pos, :pos2, 1, NOW(), NOW())'
);

$position = 1;
foreach ($seed as $slide) {
    $findProduct->execute([':slug' => $slide['slug']]);
    $product = $findProduct->fetch();
    if (!$product) {
        echo "SKIP: product not found for slug {$slide['slug']}\n";
        $position++;
        continue;
    }

    $slideExists->execute([':pid' => $product['id']]);
    if ((int) $slideExists->fetchColumn() > 0) {
        echo "SKIP: slide already exists for {$product['name']}\n";
        $position++;
        continue;
    }

    $insert->execute([
        ':pid' => $product['id'],
        ':kicker' => 'Premium Selection',
        ':gradient' => $slide['gradient'],
        ':pos' => $position,
        ':pos2' => $position,
    ]);
    echo "Seeded slide {$position}: {$product['name']}\n";
    $position++;
}

echo "Done.\n";
