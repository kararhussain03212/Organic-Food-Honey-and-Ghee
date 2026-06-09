<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Utils\ActivityLogger;
use Backend\Utils\Cache;
use Backend\Utils\Response;
use Backend\Utils\Validator;

require_once __DIR__ . '/BaseController.php';
require_once __DIR__ . '/../utils/ActivityLogger.php';
require_once __DIR__ . '/../utils/Cache.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

abstract class BaseCrudController extends BaseController
{
    protected string $modelClass;
    protected string $resourceName;
    protected array $requiredCreateFields = [];

    public function index(array $params = []): void
    {
        $model = new $this->modelClass();
        $query = $this->query();

        if (($query['paginate'] ?? '1') === '1') {
            Response::success($model->paginate($query), 'Fetched successfully');
        }

        Response::success($model->all($query), 'Fetched successfully');
    }

    public function publicIndex(array $params = []): void
    {
        $model = new $this->modelClass();
        $query = $this->query();
        $cacheKey = 'public:' . $this->resourceName . ':' . http_build_query($query);
        $data = Cache::remember($cacheKey, static fn () => $model->all($query, true));
        Response::success($data, 'Fetched successfully');
    }

    public function show(array $params): void
    {
        $id = (int) ($params['id'] ?? 0);
        if ($id <= 0) {
            Response::error('Invalid resource ID', 422);
        }

        $model = new $this->modelClass();
        $row = $model->find($id);

        if (!$row) {
            Response::error('Resource not found', 404);
        }

        Response::success($row, 'Fetched successfully');
    }

    public function store(array $params = []): void
    {
        $this->requirePermission('create_content');
        $model = new $this->modelClass();
        $payload = Validator::sanitizeInput($this->body());

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
        $this->requirePermission('edit_content');
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

        $ok = $model->update($id, $payload);

        if (!$ok) {
            Response::error('No changes were applied', 422);
        }

        ActivityLogger::log($this->currentAdminId(), 'update', $this->resourceName, $id);
        Cache::clearAll();

        Response::success($model->find($id), 'Updated successfully');
    }

    public function destroy(array $params): void
    {
        $this->requirePermission('delete_content');
        $id = (int) ($params['id'] ?? 0);
        if ($id <= 0) {
            Response::error('Invalid resource ID', 422);
        }

        $model = new $this->modelClass();
        if (!$model->find($id)) {
            Response::error('Resource not found', 404);
        }

        $model->delete($id);
        ActivityLogger::log($this->currentAdminId(), 'delete', $this->resourceName, $id);
        Cache::clearAll();

        Response::success(null, 'Deleted successfully');
    }

    public function reorder(array $params = []): void
    {
        $this->requirePermission('edit_content');
        $body = $this->body();
        $items = $body['items'] ?? $body;

        if (!is_array($items) || $items === []) {
            Response::error('items is required', 422);
        }

        $model = new $this->modelClass();
        $ok = $model->reorder($items);

        if (!$ok) {
            Response::error('Failed to reorder items', 422);
        }

        ActivityLogger::log($this->currentAdminId(), 'reorder', $this->resourceName, null);
        Cache::clearAll();

        Response::success($model->all(), 'Reordered successfully');
    }
}
