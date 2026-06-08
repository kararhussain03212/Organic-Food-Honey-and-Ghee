<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class AboutStorySection extends BaseModel
{
    protected string $table = 'about_story_section';
    protected array $fillable = [
        'section_badge', 'title',
        'description_1', 'description_2', 'description_3',
        'image_1', 'image_2', 'image_3',
    ];
}
