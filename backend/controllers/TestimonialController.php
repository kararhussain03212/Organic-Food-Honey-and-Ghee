<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\Testimonial;
use Backend\Utils\ActivityLogger;
use Backend\Utils\Cache;
use Backend\Utils\Response;
use Backend\Utils\Slugger;
use Backend\Utils\Validator;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../models/Testimonial.php';
require_once __DIR__ . '/../utils/ActivityLogger.php';
require_once __DIR__ . '/../utils/Cache.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Slugger.php';
require_once __DIR__ . '/../utils/Validator.php';

final class TestimonialController extends BaseCrudController
{
    protected string $modelClass = Testimonial::class;
    protected string $resourceName = 'testimonials';
    protected array $requiredCreateFields = ['name', 'quote'];

    public function store(array $params = []): void
    {
        $model = new $this->modelClass();
        $payload = Validator::sanitizeInput($this->body());

        $errors = Validator::required($payload, $this->requiredCreateFields);
        if ($errors !== []) {
            Response::error('Validation failed', 422, ['fields' => $errors]);
        }

        if (isset($payload['name']) && (!isset($payload['slug']) || trim((string) $payload['slug']) === '')) {
            $payload['slug'] = Slugger::slugify((string) $payload['name']);
        }

        try {
            $id = $model->create($payload);
        } catch (\Throwable $e) {
            $message = $this->toClientError($e);
            Response::error($message, 422);
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
        if (isset($payload['name']) && (!isset($payload['slug']) || trim((string) $payload['slug']) === '')) {
            $payload['slug'] = Slugger::slugify((string) $payload['name']);
        }

        try {
            $model->update($id, $payload);
        } catch (\Throwable $e) {
            $message = $this->toClientError($e);
            Response::error($message, 422);
        }

        ActivityLogger::log($this->currentAdminId(), 'update', $this->resourceName, $id);
        Cache::clearAll();

        Response::success($model->find($id), 'Updated successfully');
    }

    private function toClientError(\Throwable $e): string
    {
        $message = strtolower($e->getMessage());

        if (strpos($message, 'duplicate entry') !== false) {
            return 'A testimonial with the same unique value already exists.';
        }
        if (strpos($message, 'data too long') !== false) {
            return 'One of the input fields is too long.';
        }
        if (strpos($message, 'incorrect') !== false || strpos($message, 'invalid') !== false) {
            return 'One of the fields has an invalid value.';
        }

        return 'Unable to save testimonial. Please verify input values and try again.';
    }
}
