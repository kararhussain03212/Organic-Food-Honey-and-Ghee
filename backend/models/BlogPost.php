<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class BlogPost extends BaseModel
{
    protected string $table = 'blog_posts';
    protected array $fillable = [
        'title', 'slug', 'category', 'excerpt',
        'content', 'image', 'author', 'tags',
        'is_published', 'published_at', 'read_time', 'sort_order',
    ];
}
