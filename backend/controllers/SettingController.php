<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\Setting;
use Backend\Utils\ActivityLogger;
use Backend\Utils\Cache;
use Backend\Utils\Response;

require_once __DIR__ . '/BaseController.php';
require_once __DIR__ . '/../models/Setting.php';
require_once __DIR__ . '/../utils/ActivityLogger.php';
require_once __DIR__ . '/../utils/Cache.php';
require_once __DIR__ . '/../utils/Response.php';

final class SettingController extends BaseController
{
    public function index(array $params = []): void
    {
        $model = new Setting();
        Response::success($model->all($this->query()), 'Fetched successfully');
    }

    public function publicIndex(array $params = []): void
    {
        $model = new Setting();
        $cacheKey = 'public:settings:' . http_build_query($this->query());
        $data = Cache::remember($cacheKey, static fn () => $model->asMap(true));
        Response::success($data, 'Fetched successfully');
    }

    public function update(array $params = []): void
    {
        $this->requirePermission('edit_content');
        $payload = $this->body();
        if (!is_array($payload) || $payload === []) {
            Response::error('Settings payload is required', 422);
        }

        $model = new Setting();
        $model->upsertMany($payload);

        ActivityLogger::log($this->currentAdminId(), 'update', 'settings', null);
        Cache::clearAll();

        // Keep response small to reduce save latency on shared hosting.
        Response::success(null, 'Settings updated');
    }
}
