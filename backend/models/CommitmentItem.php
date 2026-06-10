<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class CommitmentItem extends BaseModel
{
    protected string $table = 'commitment_items';
    protected array $fillable = ['icon', 'icon_url', 'icon_alt_text', 'tag', 'title', 'description', 'sort_order', 'is_active'];
}
