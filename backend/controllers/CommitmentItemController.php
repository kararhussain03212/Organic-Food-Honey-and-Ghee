<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\CommitmentItem;
use Backend\Utils\ActivityLogger;
use Backend\Utils\Cache;
use Backend\Utils\Response;
use Backend\Utils\Validator;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../models/CommitmentItem.php';
require_once __DIR__ . '/../utils/ActivityLogger.php';
require_once __DIR__ . '/../utils/Cache.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

final class CommitmentItemController extends BaseCrudController
{
    protected string $modelClass = CommitmentItem::class;
    protected string $resourceName = 'commitment-items';
    protected array $requiredCreateFields = ['title'];

    public function store(array $params = []): void
    {
        $model = new $this->modelClass();
        $payload = Validator::sanitizeInput($this->body());

        $errors = Validator::required($payload, $this->requiredCreateFields);
        if ($errors !== []) {
            Response::error('Validation failed', 422, ['fields' => $errors]);
        }

        try {
            $id = $model->create($payload);
        } catch (\Throwable $e) {
            Response::error('Unable to save commitment item. Please check input values.', 422);
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

        try {
            $model->update($id, $payload);
        } catch (\Throwable $e) {
            Response::error('Unable to save commitment item. Please check input values.', 422);
        }

        ActivityLogger::log($this->currentAdminId(), 'update', $this->resourceName, $id);
        Cache::clearAll();

        Response::success($model->find($id), 'Updated successfully');
    }
}
