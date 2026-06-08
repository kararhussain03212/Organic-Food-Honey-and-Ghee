<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class AboutProblemCard extends BaseModel
{
    protected string $table = 'about_problem_cards';
    protected array $fillable = [
        'card_number', 'icon', 'title', 'description', 'sort_order', 'is_active',
    ];

    protected function defaultOrderBy(): string
    {
        return 'sort_order ASC, id ASC';
    }
}
