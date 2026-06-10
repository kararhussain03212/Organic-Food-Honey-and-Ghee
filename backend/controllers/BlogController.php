<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\BlogPost;
use Backend\Models\Setting;
use Backend\Utils\ActivityLogger;
use Backend\Utils\Cache;
use Backend\Utils\Response;
use Backend\Utils\Validator;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../models/BlogPost.php';
require_once __DIR__ . '/../models/Setting.php';
require_once __DIR__ . '/../utils/ActivityLogger.php';
require_once __DIR__ . '/../utils/Cache.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

final class BlogController extends BaseCrudController
{
    protected string $modelClass = BlogPost::class;
    protected string $resourceName = 'blog';
    protected array $requiredCreateFields = ['title'];

    public function store(array $params = []): void
    {
        $model = new BlogPost();
        $raw = $this->body();
        $payload = Validator::sanitizeInput($raw);
        // Preserve raw HTML content without sanitization
        if (isset($raw['content'])) {
            $payload['content'] = trim((string) $raw['content']);
        }

        $errors = Validator::required($payload, $this->requiredCreateFields);
        if ($errors !== []) {
            Response::error('Validation failed', 422, ['fields' => $errors]);
        }

        if (isset($payload['title']) && (!isset($payload['slug']) || trim((string) $payload['slug']) === '')) {
            $payload['slug'] = $this->slugify((string) $payload['title']);
        }

        $id = $model->create($payload);
        ActivityLogger::log($this->currentAdminId(), 'create', $this->resourceName, $id);
        Cache::clearAll();

        Response::success($model->find($id), 'Created successfully', 201);
    }

    public function update(array $params): void
    {
        $id = (int) ($params['id'] ?? 0);
        if ($id <= 0) {
            Response::error('Invalid resource ID', 422);
        }

        $model = new BlogPost();
        if (!$model->find($id)) {
            Response::error('Resource not found', 404);
        }

        $raw = $this->body();
        $payload = Validator::sanitizeInput($raw);
        // Preserve raw HTML content without sanitization
        if (array_key_exists('content', $raw)) {
            $payload['content'] = trim((string) $raw['content']);
        }

        if (isset($payload['title']) && (!isset($payload['slug']) || trim((string) $payload['slug']) === '')) {
            $payload['slug'] = $this->slugify((string) $payload['title']);
        }

        $ok = $model->update($id, $payload);
        if (!$ok) {
            Response::error('No changes were applied', 422);
        }

        ActivityLogger::log($this->currentAdminId(), 'update', $this->resourceName, $id);
        Cache::clearAll();

        Response::success($model->find($id), 'Updated successfully');
    }

    public function publicShowBySlug(array $params): void
    {
        $slug = (string) ($params['slug'] ?? '');
        if ($slug === '') {
            Response::error('Invalid slug', 422);
        }

        $post = Cache::remember('public:blog:slug:' . $slug, static function () use ($slug) {
            $model = new BlogPost();
            return $model->findBySlug($slug);
        });

        if (!$post || !($post['is_published'] ?? 0)) {
            Response::error('Blog post not found', 404);
        }

        Response::success($post, 'Fetched successfully');
    }

    public function publicSearch(array $params = []): void
    {
        $q = trim((string) ($this->query()['q'] ?? ''));
        if ($q === '') {
            Response::success([], 'No query provided');
            return;
        }

        $results = Cache::remember('public:blog:search:' . md5($q), static function () use ($q) {
            $model = new BlogPost();
            return $model->search($q);
        });

        Response::success($results, 'Search results');
    }

    public function publicBlogSettings(array $params = []): void
    {
        try {
            $data = Cache::remember('public:blog-settings', static function () {
                try {
                    $model = new Setting();
                    $all = $model->asMap(false);
                    $blog = [];
                    foreach ($all as $key => $value) {
                        if (str_starts_with((string) $key, 'blog_')) {
                            $blog[$key] = $value;
                        }
                    }
                    return $blog;
                } catch (\Throwable $e) {
                    error_log('Blog settings fetch error: ' . $e->getMessage());
                    return [];
                }
            });
            Response::success($data, 'Blog settings fetched');
        } catch (\Throwable $e) {
            error_log('Cache error in blog settings: ' . $e->getMessage());
            Response::success([], 'Blog settings fetched');
        }
    }

    public function adminUpdateBlogSettings(array $params = []): void
    {
        $payload = $this->body();
        if (!is_array($payload) || $payload === []) {
            Response::error('Payload required', 422);
        }

        $model = new Setting();
        $model->upsertMany($payload);

        ActivityLogger::log($this->currentAdminId(), 'update', 'blog-settings', null);
        Cache::clearAll();

        Response::success(null, 'Blog settings updated');
    }
}
