<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\ProductPageSetting;
use Backend\Utils\Cache;
use Backend\Utils\Response;
use Backend\Utils\ActivityLogger;

require_once __DIR__ . '/BaseController.php';
require_once __DIR__ . '/../models/ProductPageSetting.php';
require_once __DIR__ . '/../utils/ActivityLogger.php';
require_once __DIR__ . '/../utils/Cache.php';
require_once __DIR__ . '/../utils/Response.php';

final class ProductPageController extends BaseController
{
    public function publicPage(array $params = []): void
    {
        $model = new ProductPageSetting();
        $cacheKey = 'public:product-page';
        $data = Cache::remember($cacheKey, static fn () => $model->find(1) ?? [], 600);
        Response::success($data ?? (object)[], 'Fetched successfully');
    }

    public function index(array $params = []): void
    {
        $model = new ProductPageSetting();
        $data = $model->find(1) ?? [];
        Response::success($data, 'Fetched successfully');
    }

    public function update(array $params = []): void
    {
        $payload = $this->body();
        if (!is_array($payload) || empty($payload)) {
            Response::error('Payload is required', 422);
        }

        $model = new ProductPageSetting();
        $existing = $model->find(1);

        if ($existing) {
            $model->update(1, $payload);
        } else {
            $model->create($payload);
        }

        ActivityLogger::log($this->currentAdminId(), 'update', 'product_page_settings', null);
        Cache::clearAll();

        Response::success(null, 'Product page settings updated');
    }
}
