<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class AboutCoreValue extends BaseModel
{
    protected string $table = 'about_core_values';
    protected array $fillable = [
        'value_number', 'icon', 'title', 'description',
        'button_text', 'color', 'sort_order', 'is_active',
    ];

    protected function defaultOrderBy(): string
    {
        return 'sort_order ASC, id ASC';
    }
}
