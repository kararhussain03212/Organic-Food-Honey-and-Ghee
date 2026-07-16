<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

use Backend\Utils\UploadPath;

final class HeroSlide extends BaseModel
{
    protected string $table = 'hero_slides';
    protected array $fillable = [
        'product_id',
        'kicker', 'title', 'subtitle',
        'tags', 'gradient',
        'button_text', 'button_link',
        'secondary_button_text', 'secondary_button_link',
        'image', 'video_url',
        'sort_order', 'order_position', 'is_active',
    ];

    /**
     * Active slides joined to their (active) product, with every display
     * field resolved: slide-level override wins, otherwise the value is
     * inherited from the linked product.
     */
    public function activeWithProducts(): array
    {
        $sql = 'SELECT hs.id, hs.product_id, hs.kicker, hs.title, hs.subtitle, hs.tags,
                       hs.gradient, hs.image, hs.order_position,
                       p.name AS product_name, p.slug, p.category, p.price,
                       p.short_desc, p.badges, p.images AS product_images,
                       p.variants, p.size, p.subtitle AS product_subtitle
                FROM hero_slides hs
                INNER JOIN products p ON p.id = hs.product_id AND p.is_active = 1
                WHERE hs.is_active = 1
                ORDER BY hs.order_position ASC, hs.id ASC';

        $rows = $this->pdo->query($sql)->fetchAll() ?: [];

        return array_map(function (array $row): array {
            $decode = static function ($value): array {
                if (is_array($value)) {
                    return $value;
                }
                $decoded = json_decode((string) $value, true);
                return is_array($decoded) ? $decoded : [];
            };

            $productImages = $decode($row['product_images']);
            $variants = $decode($row['variants']);
            $slideTags = $decode($row['tags']);
            $badges = $decode($row['badges']);

            $image = $row['image'] !== null && $row['image'] !== ''
                ? $row['image']
                : ($productImages[0] ?? '');
            if (is_array($image)) {
                $image = $image['url'] ?? '';
            }

            return [
                'id' => (int) $row['id'],
                'product_id' => (int) $row['product_id'],
                'eyebrow' => $row['kicker'] !== null && $row['kicker'] !== '' ? $row['kicker'] : 'Premium Selection',
                'title' => $row['title'] !== null && $row['title'] !== '' ? $row['title'] : $row['product_name'],
                'description' => $row['subtitle'] !== null && $row['subtitle'] !== '' ? $row['subtitle'] : (string) $row['short_desc'],
                'tags' => $slideTags !== [] ? $slideTags : $badges,
                'image' => UploadPath::resolvePublicPath((string) $image) ?? (string) $image,
                'gradient' => (string) ($row['gradient'] ?? ''),
                'category' => strtoupper((string) $row['category']),
                'slug' => (string) $row['slug'],
                'price' => (float) $row['price'],
                'variant' => (string) ($variants[0] ?? ($row['size'] ?: (string) $row['product_subtitle'])),
                'order_position' => (int) $row['order_position'],
            ];
        }, $rows);
    }
}
