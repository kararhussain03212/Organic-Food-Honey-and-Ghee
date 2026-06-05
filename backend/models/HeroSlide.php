<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class HeroSlide extends BaseModel
{
    protected string $table = 'hero_slides';
    protected array $fillable = [
        'kicker', 'title', 'subtitle',
        'button_text', 'button_link',
        'secondary_button_text', 'secondary_button_link',
        'image', 'video_url',
        'sort_order', 'is_active',
    ];
}
