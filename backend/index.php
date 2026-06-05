<?php

declare(strict_types=1);

use Backend\Middleware\CorsMiddleware;
use Backend\Config\Env;
use Backend\Utils\Response;
use Backend\Utils\Router;

require_once __DIR__ . '/config/env.php';
require_once __DIR__ . '/middleware/cors.php';
require_once __DIR__ . '/utils/Response.php';
require_once __DIR__ . '/utils/Router.php';
require_once __DIR__ . '/routes/api.php';

CorsMiddleware::handle();
Env::load(__DIR__ . '/.env');

$appEnv = Env::get('APP_ENV', 'local');
$host = strtolower((string) ($_SERVER['HTTP_HOST'] ?? ''));
$host = trim(explode(':', $host)[0] ?? '');
$isLocalHost = in_array($host, ['localhost', '127.0.0.1', '::1'], true);
$httpsEnabled = ($_SERVER['HTTPS'] ?? '') === 'on' || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
if ($appEnv === 'production' && !$httpsEnabled && !$isLocalHost) {
    Response::error('HTTPS is required in production', 403);
}

$router = new Router();
registerApiRoutes($router);

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$apiPos = strpos($path, '/api/');
if ($apiPos !== false) {
    $path = substr($path, $apiPos);
}

try {
    $router->dispatch($method, $path);
} catch (Throwable $e) {
    Response::error('Server error: ' . $e->getMessage(), 500);
}
