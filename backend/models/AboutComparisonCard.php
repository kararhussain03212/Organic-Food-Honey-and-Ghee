<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class AboutComparisonCard extends BaseModel
{
    protected string $table = 'about_comparison_cards';
    protected array $fillable = [
        'comparison_type', 'icon', 'title',
        'point_1', 'point_2', 'point_3', 'point_4',
        'sort_order', 'is_active',
    ];

    protected function defaultOrderBy(): string
    {
        return 'sort_order ASC, id ASC';
    }
}
