<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class AboutPageSetting extends BaseModel
{
    protected string $table = 'about_page_settings';
    protected array $fillable = [
        'badge_text', 'hero_title', 'hero_highlight_text', 'hero_subtitle',
        'hero_quote', 'hero_background_image',
        'seo_title', 'seo_description', 'seo_keywords',
    ];
}
