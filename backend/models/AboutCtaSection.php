<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class AboutCtaSection extends BaseModel
{
    protected string $table = 'about_cta_section';
    protected array $fillable = [
        'badge_text', 'title', 'subtitle',
        'button_text', 'button_link', 'background_image',
    ];
}
