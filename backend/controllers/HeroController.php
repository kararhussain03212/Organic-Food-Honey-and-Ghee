<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Utils\ActivityLogger;
use Backend\Utils\Cache;
use Backend\Models\HeroSlide;
use Backend\Utils\Response;
use Backend\Utils\Validator;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../utils/ActivityLogger.php';
require_once __DIR__ . '/../utils/Cache.php';
require_once __DIR__ . '/../models/HeroSlide.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

final class HeroController extends BaseCrudController
{
    protected string $modelClass = HeroSlide::class;
    protected string $resourceName = 'hero';
    protected array $requiredCreateFields = ['title'];

    public function store(array $params = []): void
    {
        $model = new $this->modelClass();
        $payload = Validator::sanitizeInput($this->body());

        $errors = Validator::required($payload, $this->requiredCreateFields);
        if ($errors !== []) {
            Response::error('Validation failed', 422, ['fields' => $errors]);
        }

        if (isset($payload['title']) && (!isset($payload['slug']) || trim((string) $payload['slug']) === '')) {
            $payload['slug'] = $this->slugify((string) $payload['title']);
        }

        try {
            $id = $model->create($payload);
        } catch (\Throwable $e) {
            Response::error($this->toClientError($e), 422);
        }

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
        if (isset($payload['title']) && (!isset($payload['slug']) || trim((string) $payload['slug']) === '')) {
            $payload['slug'] = $this->slugify((string) $payload['title']);
        }

        try {
            $ok = $model->update($id, $payload);
        } catch (\Throwable $e) {
            Response::error($this->toClientError($e), 422);
        }

        if (!$ok) {
            Response::error('No changes were applied', 422);
        }

        ActivityLogger::log($this->currentAdminId(), 'update', $this->resourceName, $id);
        Cache::clearAll();
        Response::success($model->find($id), 'Updated successfully');
    }

    private function toClientError(\Throwable $e): string
    {
        $message = strtolower($e->getMessage());

        if (strpos($message, 'unknown column') !== false) {
            return 'Database schema is missing slug/image_alt columns for hero_slides. Please run migration.';
        }
        if (strpos($message, 'duplicate entry') !== false) {
            return 'A slider with the same unique value already exists.';
        }
        if (strpos($message, 'data too long') !== false) {
            return 'One of the slider fields is too long.';
        }

        return 'Unable to save slider. Please verify the input and try again.';
    }
}
