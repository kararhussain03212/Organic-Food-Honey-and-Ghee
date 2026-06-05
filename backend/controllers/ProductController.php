<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\Product;
use Backend\Utils\ActivityLogger;
use Backend\Utils\Cache;
use Backend\Utils\Response;
use Backend\Utils\Validator;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/../utils/ActivityLogger.php';
require_once __DIR__ . '/../utils/Cache.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

final class ProductController extends BaseCrudController
{
    protected string $modelClass = Product::class;
    protected string $resourceName = 'products';
    protected array $requiredCreateFields = ['name', 'price'];

    public function store(array $params = []): void
    {
        $model   = new $this->modelClass();
        $payload = Validator::sanitizeInput($this->body());

        $errors = Validator::required($payload, $this->requiredCreateFields);
        if ($errors !== []) {
            Response::error('Validation failed', 422, ['fields' => $errors]);
        }

        if (isset($payload['name']) && (!isset($payload['slug']) || trim((string) $payload['slug']) === '')) {
            $payload['slug'] = $this->slugify((string) $payload['name']);
        }

        $payload = $this->encodeJsonFields($payload);

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

        $model = new $this->modelClass();
        if (!$model->find($id)) {
            Response::error('Resource not found', 404);
        }

        $payload = Validator::sanitizeInput($this->body());
        if (isset($payload['name']) && (!isset($payload['slug']) || trim((string) $payload['slug']) === '')) {
            $payload['slug'] = $this->slugify((string) $payload['name']);
        }

        $payload = $this->encodeJsonFields($payload);

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
        $slug = trim((string) ($params['slug'] ?? ''));
        if ($slug === '') {
            Response::error('Slug is required', 422);
        }

        $model = new $this->modelClass();
        $row   = $model->findBySlug($slug);

        if (!$row) {
            Response::error('Product not found', 404);
        }

        Response::success($row, 'Fetched successfully');
    }

    private function encodeJsonFields(array $payload): array
    {
        $jsonFields = ['variants', 'variant_prices', 'variant_original_prices', 'images', 'badges', 'benefits', 'how_to_use', 'faqs', 'tags'];
        foreach ($jsonFields as $field) {
            if (!array_key_exists($field, $payload)) {
                continue;
            }
            $val = $payload[$field];
            if (is_array($val)) {
                $payload[$field] = json_encode($val, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            } elseif (is_string($val) && $val !== '') {
                $decoded = json_decode($val, true);
                if (is_array($decoded)) {
                    $payload[$field] = json_encode($decoded, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
                }
            }
        }
        return $payload;
    }
}
