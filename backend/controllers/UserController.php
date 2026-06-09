<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Config\Env;
use Backend\Models\Admin;
use Backend\Utils\ActivityLogger;
use Backend\Utils\Response;
use Backend\Utils\Validator;

require_once __DIR__ . '/BaseController.php';
require_once __DIR__ . '/../config/env.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Admin.php';
require_once __DIR__ . '/../utils/ActivityLogger.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

final class UserController extends BaseController
{
    private function isProtectedSuperAdmin(array $row): bool
    {
        $protectedEmail = strtolower(trim((string) Env::get('ADMIN_EMAIL', 'admin@example.com')));
        $rowEmail = strtolower(trim((string) ($row['email'] ?? '')));
        return $protectedEmail !== '' && $rowEmail === $protectedEmail;
    }

    private function ensureAdminOnly(): array
    {
        $this->requirePermission('manage_users');
        $currentUser = $this->currentAdmin();
        return $currentUser ?? [];
    }

    public function index(array $params = []): void
    {
        $this->ensureAdminOnly();

        $query = $this->query();
        $search = trim((string) ($query['search'] ?? ''));
        $role = strtolower(trim((string) ($query['role'] ?? '')));
        $status = strtolower(trim((string) ($query['status'] ?? '')));
        $page = max(1, (int) ($query['page'] ?? 1));
        $limit = max(1, min(100, (int) ($query['limit'] ?? 10)));
        $offset = ($page - 1) * $limit;

        $model = new Admin();
        $rows = $model->all([
            'search' => $search,
            'status' => in_array($status, ['active', 'inactive'], true) ? $status : '',
        ]);

        $filtered = array_values(array_filter($rows, static function (array $row) use ($role): bool {
            if ($role === '') {
                return true;
            }
            return strtolower((string) ($row['role'] ?? 'editor')) === $role;
        }));

        $total = count($filtered);
        $data = array_slice($filtered, $offset, $limit);
        $totalPages = max(1, (int) ceil($total / $limit));

        Response::success([
            'data' => array_map([$this, 'serializeUser'], $data),
            'pagination' => [
                'page' => $page,
                'totalPages' => $totalPages,
                'total' => $total,
                'hasPrevPage' => $page > 1,
                'hasNextPage' => $page < $totalPages,
                'limit' => $limit,
            ],
        ], 'Users fetched successfully');
    }

    public function show(array $params): void
    {
        $this->ensureAdminOnly();
        $id = (int) ($params['id'] ?? 0);
        if ($id <= 0) {
            Response::error('Invalid user ID.', 422);
        }

        $model = new Admin();
        $row = $model->find($id);
        if (!$row) {
            Response::error('User not found.', 404);
        }

        $user = $this->serializeUser($row);
        $user['activity'] = $this->getUserActivity($id);
        Response::success($user, 'User fetched successfully');
    }

    public function store(array $params = []): void
    {
        $currentUser = $this->ensureAdminOnly();
        $payload = Validator::sanitizeInput($this->body());

        $name = trim((string) ($payload['name'] ?? ''));
        $email = strtolower(trim((string) ($payload['email'] ?? '')));
        $password = (string) ($payload['password'] ?? '');
        $role = strtolower(trim((string) ($payload['role'] ?? 'editor')));
        $status = strtolower(trim((string) ($payload['status'] ?? 'active')));
        $designation = trim((string) ($payload['designation'] ?? ''));
        $phone = trim((string) ($payload['phone'] ?? ''));
        $location = trim((string) ($payload['location'] ?? ''));
        $permissions = $payload['permissions'] ?? [];

        if ($name === '' || $email === '' || $password === '') {
            Response::error('Name, email and password are required.', 422);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('A valid email is required.', 422);
        }
        if (strlen($password) < 6) {
            Response::error('Password must be at least 6 characters.', 422);
        }
        if (!in_array($role, ['admin', 'editor'], true)) {
            Response::error('Role must be admin or editor.', 422);
        }
        if (!in_array($status, ['active', 'inactive'], true)) {
            Response::error('Status must be active or inactive.', 422);
        }
        if (!is_array($permissions)) {
            Response::error('Permissions must be an array.', 422);
        }

        $model = new Admin();
        if ($model->findByEmail($email)) {
            Response::error('Email already exists.', 422);
        }

        $id = $model->create([
            'name' => $name,
            'email' => $email,
            'password' => password_hash($password, PASSWORD_BCRYPT),
            'role' => $role,
            'status' => $status,
            'designation' => $designation,
            'phone' => $phone,
            'location' => $location,
            'permissions_json' => json_encode(array_values($permissions), JSON_UNESCAPED_SLASHES),
        ]);

        ActivityLogger::log((int) ($currentUser['id'] ?? 0), 'create', 'users', $id);
        $created = $model->find($id);
        Response::success($this->serializeUser($created ?: []), 'User created successfully', 201);
    }

    public function update(array $params): void
    {
        $currentUser = $this->ensureAdminOnly();
        $id = (int) ($params['id'] ?? 0);
        if ($id <= 0) {
            Response::error('Invalid user ID.', 422);
        }

        $model = new Admin();
        $existing = $model->find($id);
        if (!$existing) {
            Response::error('User not found.', 404);
        }

        $payload = Validator::sanitizeInput($this->body());
        $update = [];
        $isProtectedSuperAdmin = $this->isProtectedSuperAdmin($existing);

        if (array_key_exists('name', $payload)) {
            $name = trim((string) $payload['name']);
            if ($name === '') Response::error('Name cannot be empty.', 422);
            if ($isProtectedSuperAdmin && $name !== (string) ($existing['name'] ?? '')) {
                Response::error('Super admin login ID cannot be changed.', 403);
            }
            $update['name'] = $name;
        }

        if (array_key_exists('email', $payload)) {
            $email = strtolower(trim((string) $payload['email']));
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                Response::error('A valid email is required.', 422);
            }
            if ($isProtectedSuperAdmin && $email !== strtolower(trim((string) ($existing['email'] ?? '')))) {
                Response::error('Super admin email cannot be changed.', 403);
            }
            $other = $model->findByEmail($email);
            if ($other && (int) ($other['id'] ?? 0) !== $id) {
                Response::error('Email already exists.', 422);
            }
            $update['email'] = $email;
        }

        if (array_key_exists('password', $payload)) {
            $password = trim((string) $payload['password']);
            if ($password !== '') {
                if ($isProtectedSuperAdmin) {
                    Response::error('Super admin password cannot be changed from User Management.', 403);
                }
                if (strlen($password) < 6) {
                    Response::error('Password must be at least 6 characters.', 422);
                }
                $update['password'] = password_hash($password, PASSWORD_BCRYPT);
            }
        }

        if (array_key_exists('role', $payload)) {
            $role = strtolower(trim((string) $payload['role']));
            if (!in_array($role, ['admin', 'editor'], true)) {
                Response::error('Role must be admin or editor.', 422);
            }
            if ($isProtectedSuperAdmin && $role !== 'admin') {
                Response::error('Super admin role cannot be changed.', 403);
            }
            $update['role'] = $role;
        }

        if (array_key_exists('status', $payload)) {
            $status = strtolower(trim((string) $payload['status']));
            if (!in_array($status, ['active', 'inactive'], true)) {
                Response::error('Status must be active or inactive.', 422);
            }
            if ($isProtectedSuperAdmin && $status !== 'active') {
                Response::error('Super admin status cannot be changed.', 403);
            }
            $update['status'] = $status;
        }

        if (array_key_exists('designation', $payload)) {
            $update['designation'] = trim((string) $payload['designation']);
        }
        if (array_key_exists('phone', $payload)) {
            $update['phone'] = trim((string) $payload['phone']);
        }
        if (array_key_exists('location', $payload)) {
            $update['location'] = trim((string) $payload['location']);
        }
        if (array_key_exists('profile_photo', $payload)) {
            $update['profile_photo'] = trim((string) $payload['profile_photo']);
        }
        if (array_key_exists('permissions', $payload)) {
            if (!is_array($payload['permissions'])) {
                Response::error('Permissions must be an array.', 422);
            }
            $update['permissions_json'] = json_encode(array_values($payload['permissions']), JSON_UNESCAPED_SLASHES);
        }

        if ($update === []) {
            Response::error('No changes provided.', 422);
        }

        $model->update($id, $update);
        ActivityLogger::log((int) ($currentUser['id'] ?? 0), 'update', 'users', $id);
        $saved = $model->find($id);
        Response::success($this->serializeUser($saved ?: []), 'User updated successfully');
    }

    public function destroy(array $params): void
    {
        $currentUser = $this->ensureAdminOnly();
        $id = (int) ($params['id'] ?? 0);
        if ($id <= 0) {
            Response::error('Invalid user ID.', 422);
        }
        if ($id === (int) ($currentUser['id'] ?? 0)) {
            Response::error('You cannot delete your own account.', 422);
        }

        $model = new Admin();
        $existing = $model->find($id);
        if (!$existing) {
            Response::error('User not found.', 404);
        }
        if ($this->isProtectedSuperAdmin($existing)) {
            Response::error('Protected super admin cannot be deleted.', 403);
        }

        $model->delete($id);
        ActivityLogger::log((int) ($currentUser['id'] ?? 0), 'delete', 'users', $id);
        Response::success(null, 'User deleted successfully');
    }

    private function serializeUser(array $row): array
    {
        return [
            '_id' => (int) ($row['id'] ?? 0),
            'id' => (int) ($row['id'] ?? 0),
            'name' => (string) ($row['name'] ?? ''),
            'email' => (string) ($row['email'] ?? ''),
            'is_super_admin' => $this->isProtectedSuperAdmin($row),
            'role' => (string) ($row['role'] ?? 'editor'),
            'status' => (string) ($row['status'] ?? 'active'),
            'designation' => (string) ($row['designation'] ?? ''),
            'phone' => (string) ($row['phone'] ?? ''),
            'location' => (string) ($row['location'] ?? ''),
            'profile_photo' => (string) ($row['profile_photo'] ?? ''),
            'permissions' => $this->parsePermissions($row['permissions_json'] ?? null),
            'last_login_at' => $row['last_login_at'] ?? null,
            'created_at' => $row['created_at'] ?? null,
            'updated_at' => $row['updated_at'] ?? null,
        ];
    }

    private function parsePermissions($value): array
    {
        if (is_array($value)) {
            return array_values(array_filter(array_map(static fn ($item) => trim((string) $item), $value)));
        }
        if (!is_string($value) || trim($value) === '') return [];
        $decoded = json_decode($value, true);
        if (!is_array($decoded)) return [];
        return array_values(array_filter(array_map(static fn ($item) => trim((string) $item), $decoded)));
    }

    private function getUserActivity(int $userId): array
    {
        try {
            $pdo = \Backend\Config\Database::connection();
            $stmt = $pdo->prepare('SELECT action, resource, created_at FROM activity_logs WHERE resource = :resource AND resource_id = :resource_id ORDER BY created_at DESC LIMIT 20');
            $stmt->execute([
                ':resource' => 'users',
                ':resource_id' => $userId,
            ]);
            $rows = $stmt->fetchAll() ?: [];

            return array_map(static function (array $row): array {
                $action = (string) ($row['action'] ?? 'update');
                $titleMap = [
                    'create' => 'User Created',
                    'update' => 'User Updated',
                    'delete' => 'User Deleted',
                ];
                return [
                    'title' => $titleMap[$action] ?? 'User Updated',
                    'description' => 'Profile was ' . $action . ' by admin.',
                    'created_at' => $row['created_at'] ?? null,
                ];
            }, $rows);
        } catch (\Throwable $e) {
            return [];
        }
    }
}
