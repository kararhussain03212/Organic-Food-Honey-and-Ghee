<?php

declare(strict_types=1);

namespace Backend\Middleware;

use Backend\Utils\Jwt;
use Backend\Utils\Response;
use Throwable;

require_once __DIR__ . '/../utils/Jwt.php';
require_once __DIR__ . '/../utils/Response.php';

final class AuthMiddleware
{
    private static ?array $currentAdmin = null;

    public static function requireAuth(string $method, string $uri, array $params): void
    {
        $header = self::resolveAuthorizationHeader();
        if (!preg_match('/Bearer\s+(.*)$/i', $header, $matches)) {
            Response::error('Missing authorization token', 401);
        }

        try {
            $payload = Jwt::decode($matches[1]);
        } catch (Throwable $e) {
            Response::error('Unauthorized: ' . $e->getMessage(), 401);
        }

        if (in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
            $csrfHeader = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
            $expected = (string) ($payload['csrf'] ?? '');
            if ($expected === '' || !hash_equals($expected, $csrfHeader)) {
                Response::error('Invalid CSRF token', 419);
            }
        }

        self::$currentAdmin = [
            'id'          => (int) ($payload['sub'] ?? 0),
            'email'       => (string) ($payload['email'] ?? ''),
            'name'        => (string) ($payload['name'] ?? ''),
            'role'        => (string) ($payload['role'] ?? 'editor'),
            'status'      => (string) ($payload['status'] ?? 'active'),
            'permissions' => \is_array($payload['permissions'] ?? null) ? $payload['permissions'] : [],
            'csrf'        => (string) ($payload['csrf'] ?? ''),
        ];
    }

    public static function user(): ?array
    {
        return self::$currentAdmin;
    }

    public static function can(string $permission): bool
    {
        $admin = self::$currentAdmin;
        if (!$admin) {
            return false;
        }
        if ((string) ($admin['role'] ?? '') === 'admin') {
            return true;
        }
        return \in_array($permission, (array) ($admin['permissions'] ?? []), true);
    }

    private static function resolveAuthorizationHeader(): string
    {
        $serverHeader = trim((string) ($_SERVER['HTTP_AUTHORIZATION'] ?? ''));
        if ($serverHeader !== '') {
            return $serverHeader;
        }

        $redirectHeader = trim((string) ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? ''));
        if ($redirectHeader !== '') {
            return $redirectHeader;
        }

        foreach ($_SERVER as $key => $value) {
            if (!is_string($key) || strpos($key, 'AUTHORIZATION') === false) {
                continue;
            }

            $header = trim((string) $value);
            if ($header !== '') {
                return $header;
            }
        }

        if (function_exists('getallheaders')) {
            $headers = getallheaders();
            if (is_array($headers)) {
                foreach ($headers as $name => $value) {
                    if (strcasecmp((string) $name, 'Authorization') === 0) {
                        $header = trim((string) $value);
                        if ($header !== '') {
                            return $header;
                        }
                    }
                }
            }
        }

        if (function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
            if (is_array($headers)) {
                foreach ($headers as $name => $value) {
                    if (strcasecmp((string) $name, 'Authorization') === 0) {
                        $header = trim((string) $value);
                        if ($header !== '') {
                            return $header;
                        }
                    }
                }
            }
        }

        return '';
    }
}
