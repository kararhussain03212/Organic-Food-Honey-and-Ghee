<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class AboutComparisonSection extends BaseModel
{
    protected string $table = 'about_comparison_section';
    protected array $fillable = ['section_title', 'section_subtitle'];
}
