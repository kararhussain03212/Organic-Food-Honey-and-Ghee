<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Config\Database;
use Backend\Models\Order;
use Backend\Utils\ActivityLogger;
use Backend\Utils\Response;
use Backend\Utils\Validator;

require_once __DIR__ . '/BaseController.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Order.php';
require_once __DIR__ . '/../utils/ActivityLogger.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

final class OrderController extends BaseController
{
    private const STATUSES = ['new', 'confirmed', 'delivered', 'cancelled'];

    /* ── Public: create order, return generated order number ── */
    public function store(array $params = []): void
    {
        $this->ensureRateLimit();

        $payload = Validator::sanitizeInput($this->body());

        $errors = [];
        $name    = trim((string) ($payload['customer_name'] ?? ''));
        $phone   = trim((string) ($payload['phone'] ?? ''));
        $address = trim((string) ($payload['address'] ?? ''));
        $city    = trim((string) ($payload['city'] ?? ''));
        $items   = $payload['items'] ?? null;

        if ($name === '') {
            $errors['customer_name'] = 'Customer name is required.';
        }
        if ($phone === '') {
            $errors['phone'] = 'Phone is required.';
        } elseif (!preg_match('/^[0-9+\-\s()]{7,20}$/', $phone)) {
            $errors['phone'] = 'A valid phone number is required.';
        }
        if ($address === '') {
            $errors['address'] = 'Address is required.';
        }
        if ($city === '') {
            $errors['city'] = 'City is required.';
        }
        if (!is_array($items) || $items === []) {
            $errors['items'] = 'At least one item is required.';
        } else {
            foreach ($items as $item) {
                if (!is_array($item) || trim((string) ($item['name'] ?? '')) === '') {
                    $errors['items'] = 'Each item needs a name.';
                    break;
                }
            }
        }

        if ($errors !== []) {
            Response::error('Validation failed', 422, ['fields' => $errors]);
        }

        $normalizedItems = array_map(static fn (array $item): array => [
            'code'    => trim((string) ($item['code'] ?? '')),
            'name'    => trim((string) ($item['name'] ?? '')),
            'variant' => trim((string) ($item['variant'] ?? '')),
            'qty'     => max(1, (int) ($item['qty'] ?? 1)),
            'price'   => round((float) ($item['price'] ?? 0), 2),
        ], $items);

        $subtotal = 0.0;
        foreach ($normalizedItems as $item) {
            $subtotal += $item['price'] * $item['qty'];
        }

        $model = new Order();
        $orderNumber = $model->generateOrderNumber();

        $model->create([
            'order_number'  => $orderNumber,
            'customer_name' => $name,
            'phone'         => $phone,
            'address'       => $address,
            'apartment'     => trim((string) ($payload['apartment'] ?? '')) ?: null,
            'city'          => $city,
            'postal_code'   => trim((string) ($payload['postal_code'] ?? '')) ?: null,
            'items'         => json_encode($normalizedItems, JSON_UNESCAPED_UNICODE),
            'subtotal'      => $subtotal,
            'status'        => 'new',
        ]);

        Response::success(['order_number' => $orderNumber], 'Order created', 201);
    }

    /* ── Admin: paginated orders list ─────────────────────── */
    public function adminIndex(array $params = []): void
    {
        $query = $this->query();

        $page    = max(1, (int) ($query['page'] ?? 1));
        $perPage = max(1, min(100, (int) ($query['per_page'] ?? 20)));
        $status  = (string) ($query['status'] ?? '');
        $search  = trim((string) ($query['search'] ?? ''));

        $where = [];
        $bind  = [];

        if ($status !== '' && in_array($status, self::STATUSES, true)) {
            $where[]         = 'status = :status';
            $bind[':status'] = $status;
        }
        if ($search !== '') {
            $where[] = '(order_number LIKE :search OR customer_name LIKE :search OR phone LIKE :search)';
            $bind[':search'] = '%' . $search . '%';
        }

        $pdo      = Database::connection();
        $whereSql = $where !== [] ? 'WHERE ' . implode(' AND ', $where) : '';

        $countStmt = $pdo->prepare("SELECT COUNT(*) AS aggregate FROM orders {$whereSql}");
        $countStmt->execute($bind);
        $total = (int) (($countStmt->fetch())['aggregate'] ?? 0);

        $offset   = ($page - 1) * $perPage;
        $dataStmt = $pdo->prepare(
            "SELECT * FROM orders {$whereSql} ORDER BY created_at DESC, id DESC LIMIT :limit OFFSET :offset"
        );
        foreach ($bind as $key => $value) {
            $dataStmt->bindValue($key, $value);
        }
        $dataStmt->bindValue(':limit', $perPage, \PDO::PARAM_INT);
        $dataStmt->bindValue(':offset', $offset, \PDO::PARAM_INT);
        $dataStmt->execute();
        $data = $dataStmt->fetchAll() ?: [];

        Response::success([
            'data' => $data,
            'meta' => [
                'page'        => $page,
                'per_page'    => $perPage,
                'total'       => $total,
                'total_pages' => (int) ceil($total / $perPage),
            ],
        ], 'Fetched successfully');
    }

    public function adminUpdate(array $params): void
    {
        $id = (int) ($params['id'] ?? 0);
        if ($id <= 0) {
            Response::error('Invalid ID', 422);
        }

        $status = trim((string) ($this->body()['status'] ?? ''));
        if (!in_array($status, self::STATUSES, true)) {
            Response::error('Invalid status. Allowed: ' . implode(', ', self::STATUSES), 422);
        }

        $model = new Order();
        if (!$model->find($id)) {
            Response::error('Order not found', 404);
        }

        $model->updateStatus($id, $status);
        ActivityLogger::log($this->currentAdminId(), 'update', 'orders', $id);

        Response::success($model->find($id), 'Status updated');
    }

    public function adminDestroy(array $params): void
    {
        $id = (int) ($params['id'] ?? 0);
        if ($id <= 0) {
            Response::error('Invalid ID', 422);
        }

        $model = new Order();
        if (!$model->find($id)) {
            Response::error('Order not found', 404);
        }

        $model->delete($id);
        ActivityLogger::log($this->currentAdminId(), 'delete', 'orders', $id);

        Response::success(null, 'Deleted successfully');
    }

    private function ensureRateLimit(): void
    {
        $path = dirname(__DIR__) . '/storage/order_rate_limit.json';
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $now = time();
        $window = 300;
        $maxAttempts = 5;

        if (!is_file($path)) {
            file_put_contents($path, json_encode([], JSON_UNESCAPED_SLASHES));
        }

        $raw = file_get_contents($path) ?: '[]';
        $state = json_decode($raw, true);
        if (!is_array($state)) {
            $state = [];
        }

        $entries = array_filter($state[$ip] ?? [], static fn ($timestamp): bool => ($now - (int) $timestamp) <= $window);

        if (count($entries) >= $maxAttempts) {
            Response::error('Too many orders submitted. Please try again in a few minutes.', 429);
        }

        $entries[] = $now;
        $state[$ip] = array_values($entries);

        file_put_contents($path, json_encode($state, JSON_UNESCAPED_SLASHES));
    }
}
