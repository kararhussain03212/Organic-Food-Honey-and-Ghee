<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Middleware\AuthMiddleware;

require_once __DIR__ . '/../middleware/auth.php';

abstract class BaseController
{
    protected function requirePermission(string $permission): void
    {
        if (!AuthMiddleware::can($permission)) {
            Response::error('You do not have permission to perform this action.', 403);
        }
    }

    protected function body(): array
    {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';

        if (strpos($contentType, 'application/json') !== false) {
            $raw = file_get_contents('php://input') ?: '{}';
            $decoded = json_decode($raw, true);
            return is_array($decoded) ? $decoded : [];
        }

        return $_POST ?: [];
    }

    protected function query(): array
    {
        return $_GET ?: [];
    }

    protected function currentAdminId(): ?int
    {
        $user = AuthMiddleware::user();
        return $user['id'] ?? null;
    }

    protected function currentAdmin(): ?array
    {
        return AuthMiddleware::user();
    }

    protected function slugify(string $value): string
    {
        $value = strtolower(trim($value));
        $value = preg_replace('/[^a-z0-9]+/', '-', $value) ?: '';
        return trim($value, '-');
    }
}
