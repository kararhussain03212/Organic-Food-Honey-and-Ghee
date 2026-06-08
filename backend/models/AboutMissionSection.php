<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class AboutMissionSection extends BaseModel
{
    protected string $table = 'about_mission_section';
    protected array $fillable = ['badge', 'title', 'description'];
}
