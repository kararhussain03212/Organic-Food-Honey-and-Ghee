<?php

declare(strict_types=1);

namespace Backend\Middleware;

use Backend\Config\Env;

require_once __DIR__ . '/../config/env.php';

final class CorsMiddleware
{
    private static function isLocalOrigin(string $origin): bool
    {
        if ($origin === '') {
            return false;
        }

        $parts = parse_url($origin);
        if (!is_array($parts)) {
            return false;
        }

        $host = strtolower((string) ($parts['host'] ?? ''));
        return in_array($host, ['localhost', '127.0.0.1', '::1'], true);
    }

    public static function handle(): void
    {
        Env::load(dirname(__DIR__) . '/.env');
        $allowedOrigins = array_values(array_filter(array_map(
            static fn (string $origin): string => trim($origin),
            explode(',', Env::get('CORS_ALLOW_ORIGIN', '*') ?? '*')
        )));

        $requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
        $allowedOrigin = null;

        if ($allowedOrigins !== []) {
            if (in_array('*', $allowedOrigins, true)) {
                $allowedOrigin = '*';
            } elseif ($requestOrigin !== '' && in_array($requestOrigin, $allowedOrigins, true)) {
                $allowedOrigin = $requestOrigin;
            } elseif (self::isLocalOrigin($requestOrigin)) {
                // Allow local tooling origins (Vite/Live Server/etc.) without editing production CORS list.
                $allowedOrigin = $requestOrigin;
            }
        }

        if ($allowedOrigin !== null) {
            header('Access-Control-Allow-Origin: ' . $allowedOrigin);
        }
        header('X-Frame-Options: SAMEORIGIN');
        header('X-Content-Type-Options: nosniff');
        header('Referrer-Policy: strict-origin-when-cross-origin');
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
        header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
        header("Content-Security-Policy: default-src 'self'; base-uri 'self'; frame-ancestors 'self'; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com https://maps.google.com; object-src 'none'; script-src 'self' https://unpkg.com; style-src 'self' 'unsafe-inline' https://unpkg.com https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https:; worker-src 'self' blob:; manifest-src 'self'; form-action 'self'; upgrade-insecure-requests; block-all-mixed-content");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token');
        header('Vary: Origin');

        if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
            http_response_code(204);
            exit;
        }
    }
}
