<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Config\Database;
use Backend\Models\ContactMessage;
use Backend\Models\ContactPageSetting;
use Backend\Utils\Cache;
use Backend\Utils\Response;
use Backend\Utils\Validator;

require_once __DIR__ . '/BaseController.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/ContactMessage.php';
require_once __DIR__ . '/../models/ContactPageSetting.php';
require_once __DIR__ . '/../utils/Cache.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

final class ContactController extends BaseController
{
    /* ── Public: contact page settings ─────────────────────── */
    public function publicContactPage(array $params = []): void
    {
        $data = Cache::remember('public:contact:page', function () {
            $model = new ContactPageSetting();
            return $model->find(1) ?? [];
        }, 600);

        Response::success($data);
    }

    /* ── Admin: get contact page settings ───────────────────── */
    public function adminGetContactPage(array $params = []): void
    {
        $model = new ContactPageSetting();
        Response::success($model->find(1) ?? []);
    }

    /* ── Admin: update contact page settings ────────────────── */
    public function adminUpdateContactPage(array $params = []): void
    {
        $payload = Validator::sanitizeInput($this->body());
        $model   = new ContactPageSetting();
        $saved   = $model->saveSingle($payload);

        Cache::clearAll();
        Response::success($saved, 'Contact page settings updated');
    }

    /* ── Public: store contact message ─────────────────────── */
    public function store(array $params = []): void
    {
        $payload = Validator::sanitizeInput($this->body());

        $errors = [];
        if (empty(trim((string) ($payload['name'] ?? '')))) {
            $errors['name'] = 'Name is required.';
        }
        $email = trim((string) ($payload['email'] ?? ''));
        if ($email === '') {
            $errors['email'] = 'Email is required.';
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'A valid email address is required.';
        }
        if (empty(trim((string) ($payload['subject'] ?? '')))) {
            $errors['subject'] = 'Subject is required.';
        }
        $message = trim((string) ($payload['message'] ?? ''));
        if ($message === '') {
            $errors['message'] = 'Message is required.';
        } elseif (mb_strlen($message) < 10) {
            $errors['message'] = 'Message must be at least 10 characters.';
        }

        if ($errors !== []) {
            Response::error('Validation failed', 422, ['fields' => $errors]);
        }

        $model = new ContactMessage();
        $model->create([
            'name'    => trim((string) ($payload['name'] ?? '')),
            'email'   => $email,
            'phone'   => trim((string) ($payload['phone'] ?? '')),
            'subject' => trim((string) ($payload['subject'] ?? '')),
            'message' => $message,
            'status'  => 'unread',
        ]);

        Response::success(null, 'Message sent successfully');
    }

    public function index(array $params = []): void
    {
        $query = $this->query();

        $page    = max(1, (int) ($query['page'] ?? 1));
        $perPage = max(1, min(100, (int) ($query['per_page'] ?? 20)));
        $status  = $query['status'] ?? '';

        $where = [];
        $bind  = [];

        if ($status !== '' && \in_array($status, ['unread', 'read', 'replied'], true)) {
            $where[]         = 'status = :status';
            $bind[':status'] = $status;
        }

        $pdo      = Database::connection();
        $whereSql = $where !== [] ? 'WHERE ' . implode(' AND ', $where) : '';

        $countStmt = $pdo->prepare("SELECT COUNT(*) AS aggregate FROM contact_messages {$whereSql}");
        $countStmt->execute($bind);
        $total = (int) (($countStmt->fetch())['aggregate'] ?? 0);

        $offset   = ($page - 1) * $perPage;
        $dataStmt = $pdo->prepare(
            "SELECT * FROM contact_messages {$whereSql} ORDER BY created_at DESC LIMIT :limit OFFSET :offset"
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

    public function markRead(array $params): void
    {
        $id = (int) ($params['id'] ?? 0);
        if ($id <= 0) {
            Response::error('Invalid ID', 422);
        }

        $model = new ContactMessage();
        $model->markRead($id);

        Response::success(null, 'Marked as read');
    }

    public function destroy(array $params): void
    {
        $id = (int) ($params['id'] ?? 0);
        if ($id <= 0) {
            Response::error('Invalid ID', 422);
        }

        $model = new ContactMessage();
        $model->delete($id);

        Response::success(null, 'Deleted successfully');
    }
}
