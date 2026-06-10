<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class BlogPost extends BaseModel
{
    protected string $table = 'blog_posts';
    protected array $fillable = [
        'title', 'slug', 'category', 'excerpt',
        'content', 'image', 'image_alt_text', 'author', 'tags',
        'is_published', 'published_at', 'read_time', 'sort_order',
    ];

    public function search(string $query): array
    {
        $like = '%' . str_replace(['%', '_'], ['\\%', '\\_'], $query) . '%';
        $sql = 'SELECT * FROM blog_posts WHERE is_published = 1 AND (
            title LIKE :q1 OR excerpt LIKE :q2 OR category LIKE :q3 OR
            author LIKE :q4 OR tags LIKE :q5
        ) ORDER BY sort_order ASC, published_at DESC LIMIT 30';

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':q1' => $like, ':q2' => $like, ':q3' => $like, ':q4' => $like, ':q5' => $like]);
        return $stmt->fetchAll() ?: [];
    }
}
