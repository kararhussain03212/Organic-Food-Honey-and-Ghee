<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class Product extends BaseModel
{
    protected string $table = 'products';
    protected array $fillable = [
        'name', 'slug', 'subtitle', 'category', 'size',
        'price', 'original_price', 'discount', 'rating', 'reviews',
        'stock', 'featured',
        'variants', 'variant_prices', 'variant_original_prices',
        'images', 'badges',
        'short_desc', 'description', 'benefits', 'ingredients',
        'how_to_use', 'faqs', 'tags',
        'sort_order', 'is_active',
    ];

    protected function defaultOrderBy(): string
    {
        return 'sort_order ASC, id DESC';
    }

    public function findBySlug(string $slug): ?array
    {
        $stmt = $this->pdo->prepare(
            'SELECT * FROM ' . $this->table . ' WHERE slug = :slug AND is_active = 1 LIMIT 1'
        );
        $stmt->execute([':slug' => $slug]);
        $row = $stmt->fetch();
        return $row !== false ? $this->normalizeRow($row) : null;
    }

    private function normalizeRow(array $row): array
    {
        $jsonCols = ['variants', 'variant_prices', 'variant_original_prices', 'images', 'badges', 'benefits', 'how_to_use', 'faqs', 'tags'];
        foreach ($jsonCols as $col) {
            if (isset($row[$col]) && is_string($row[$col])) {
                $decoded = json_decode($row[$col], true);
                $row[$col] = is_array($decoded) ? $decoded : [];
            }
        }
        return $row;
    }
}
