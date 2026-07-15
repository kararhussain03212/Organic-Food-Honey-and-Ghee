<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class PartnerPageSetting extends BaseModel
{
    protected string $table = 'partner_page_settings';
    protected array $fillable = [
        'hero_badge', 'hero_heading', 'hero_heading_accent', 'hero_description',
        'program_badge', 'program_heading', 'program_subheading', 'who_its_for',
        'who_its_for_title', 'how_it_works_title', 'what_you_get_title',
        'how_it_works', 'what_you_get', 'form_title', 'applicant_types',
        'placeholder_full_name', 'placeholder_phone', 'placeholder_city',
        'placeholder_handle', 'placeholder_reason',
        'team_badge', 'team_heading', 'team_subheading',
    ];
}
