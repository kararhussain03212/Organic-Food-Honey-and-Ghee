<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Config\Database;
use Backend\Middleware\AuthMiddleware;
use Backend\Models\Admin;
use Backend\Utils\Jwt;
use Backend\Utils\Response;
use Backend\Utils\Validator;

require_once __DIR__ . '/BaseController.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../models/Admin.php';
require_once __DIR__ . '/../utils/Jwt.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

final class AuthController extends BaseController
{
    private string $rateLimitPath;

    public function __construct()
    {
        $this->rateLimitPath = dirname(__DIR__) . '/storage/login_rate_limit.json';
    }

    public function login(array $params = []): void
    {
        $this->ensureRateLimit();

        $payload = Validator::sanitizeInput($this->body());
        $login = strtolower((string) ($payload['email'] ?? $payload['login'] ?? ''));
        $password = (string) ($payload['password'] ?? '');

        if ($login === '' || $password === '') {
            Response::error('Invalid login credentials', 422);
        }

        $adminModel = new Admin();
        $admin = $adminModel->findByLogin($login);

        if (!$admin || !password_verify($password, (string) ($admin['password'] ?? ''))) {
            Response::error('Invalid login credentials', 401);
        }

        if (($admin['status'] ?? 'active') !== 'active') {
            Response::error('Your account has been deactivated. Please contact the administrator.', 403);
        }

        $csrfToken = bin2hex(random_bytes(24));
        $token = Jwt::encode([
            'sub'         => (int) $admin['id'],
            'email'       => (string) $admin['email'],
            'name'        => (string) $admin['name'],
            'role'        => (string) ($admin['role'] ?? 'editor'),
            'status'      => (string) ($admin['status'] ?? 'active'),
            'permissions' => $this->parsePermissions($admin['permissions_json'] ?? null),
            'csrf'        => $csrfToken,
        ]);

        $pdo = Database::connection();
        $stmt = $pdo->prepare('UPDATE admins SET last_login_at = NOW(), updated_at = NOW() WHERE id = :id');
        $stmt->execute([':id' => (int) $admin['id']]);

        Response::success([
            'token' => $token,
            'csrf_token' => $csrfToken,
            'admin' => [
                'id' => (int) $admin['id'],
                'name' => (string) $admin['name'],
                'email' => (string) $admin['email'],
                'role' => (string) ($admin['role'] ?? 'editor'),
                'status' => (string) ($admin['status'] ?? 'active'),
                'permissions' => $this->parsePermissions($admin['permissions_json'] ?? null),
            ],
        ], 'Login successful');
    }

    public function logout(array $params = []): void
    {
        Response::success(null, 'Logout successful');
    }

    public function me(array $params = []): void
    {
        $user = AuthMiddleware::user();

        if (!$user) {
            Response::error('Unauthorized', 401);
        }

        $adminModel = new Admin();
        $admin = $adminModel->find((int) ($user['id'] ?? 0));
        if (!$admin) {
            Response::error('Admin not found', 404);
        }

        Response::success([
            'id' => (int) $admin['id'],
            'name' => (string) $admin['name'],
            'email' => (string) $admin['email'],
            'role' => (string) ($admin['role'] ?? 'editor'),
            'status' => (string) ($admin['status'] ?? 'active'),
            'designation' => (string) ($admin['designation'] ?? ''),
            'bio' => (string) ($admin['bio'] ?? ''),
            'profile_photo' => (string) ($admin['profile_photo'] ?? ''),
            'permissions' => $this->parsePermissions($admin['permissions_json'] ?? null),
        ], 'Admin fetched');
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

    public function updateProfile(array $params = []): void
    {
        $user = AuthMiddleware::user();
        if (!$user) {
            Response::error('Unauthorized', 401);
        }

        $payload = Validator::sanitizeInput($this->body());
        $name = trim((string) ($payload['name'] ?? ''));
        $email = strtolower(trim((string) ($payload['email'] ?? '')));
        $designation = trim((string) ($payload['designation'] ?? ''));
        $bio = trim((string) ($payload['bio'] ?? ''));
        $profilePhoto = trim((string) ($payload['profile_photo'] ?? ''));

        if ($name === '' || $email === '') {
            Response::error('Name and email are required.', 422);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('Valid email is required.', 422);
        }

        $model = new Admin();
        $existingByEmail = $model->findByEmail($email);
        $currentId = (int) ($user['id'] ?? 0);
        if ($existingByEmail && (int) ($existingByEmail['id'] ?? 0) !== $currentId) {
            Response::error('Email is already in use.', 422);
        }

        $model->update($currentId, [
            'name' => $name,
            'email' => $email,
            'designation' => $designation,
            'bio' => $bio,
            'profile_photo' => $profilePhoto,
        ]);

        $saved = $model->find($currentId);
        Response::success([
            'id' => (int) ($saved['id'] ?? 0),
            'name' => (string) ($saved['name'] ?? ''),
            'email' => (string) ($saved['email'] ?? ''),
            'role' => (string) ($saved['role'] ?? 'editor'),
            'status' => (string) ($saved['status'] ?? 'active'),
            'designation' => (string) ($saved['designation'] ?? ''),
            'bio' => (string) ($saved['bio'] ?? ''),
            'profile_photo' => (string) ($saved['profile_photo'] ?? ''),
        ], 'Profile updated successfully');
    }

    public function changePassword(array $params = []): void
    {
        $user = AuthMiddleware::user();
        if (!$user) {
            Response::error('Unauthorized', 401);
        }

        $payload = Validator::sanitizeInput($this->body());
        $currentPassword = (string) ($payload['current_password'] ?? '');
        $newPassword = (string) ($payload['new_password'] ?? '');

        if ($currentPassword === '' || $newPassword === '') {
            Response::error('Current and new password are required.', 422);
        }
        if (strlen($newPassword) < 6) {
            Response::error('New password must be at least 6 characters.', 422);
        }

        $model = new Admin();
        $currentId = (int) ($user['id'] ?? 0);
        $admin = $model->find($currentId);
        if (!$admin) {
            Response::error('Admin not found.', 404);
        }
        if (!password_verify($currentPassword, (string) ($admin['password'] ?? ''))) {
            Response::error('Current password is incorrect.', 422);
        }

        $model->update($currentId, [
            'password' => password_hash($newPassword, PASSWORD_BCRYPT),
        ]);

        Response::success(null, 'Password changed successfully');
    }

    private function ensureRateLimit(): void
    {
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $now = time();
        $window = 60;
        $maxAttempts = 5;

        if (!is_file($this->rateLimitPath)) {
            file_put_contents($this->rateLimitPath, json_encode([], JSON_UNESCAPED_SLASHES));
        }

        $raw = file_get_contents($this->rateLimitPath) ?: '[]';
        $state = json_decode($raw, true);
        if (!is_array($state)) {
            $state = [];
        }

        $entries = array_filter($state[$ip] ?? [], static fn ($timestamp): bool => ($now - (int) $timestamp) <= $window);

        if (count($entries) >= $maxAttempts) {
            Response::error('Too many login attempts. Try again in 1 minute.', 429);
        }

        $entries[] = $now;
        $state[$ip] = array_values($entries);

        file_put_contents($this->rateLimitPath, json_encode($state, JSON_UNESCAPED_SLASHES));
    }
}
