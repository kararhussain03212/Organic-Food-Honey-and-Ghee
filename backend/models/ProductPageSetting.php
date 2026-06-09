<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class ProductPageSetting extends BaseModel
{
    protected string $table = 'product_page_settings';
    protected array $fillable = [
        'badge_text', 'title', 'subtitle',
    ];
}
