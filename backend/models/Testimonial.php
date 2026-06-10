<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class Testimonial extends BaseModel
{
    protected string $table = 'testimonials';
    protected array $fillable = ['name', 'role', 'avatar', 'avatar_alt_text', 'rating', 'quote', 'product', 'verified', 'sort_order', 'is_active'];
}
