<?php

declare(strict_types=1);

use Backend\Controllers\AuthController;
use Backend\Middleware\AuthMiddleware;
use Backend\Utils\Router;

require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/public.php';
require_once __DIR__ . '/admin.php';
require_once __DIR__ . '/../utils/Router.php';

function registerApiRoutes(Router $router): void
{
    // Auth endpoints
    $router->post('/api/auth/login', [AuthController::class, 'login']);
    $router->post('/api/auth/logout', [AuthController::class, 'logout'], [[AuthMiddleware::class, 'requireAuth']]);
    $router->get('/api/auth/me', [AuthController::class, 'me'], [[AuthMiddleware::class, 'requireAuth']]);
    $router->put('/api/auth/profile', [AuthController::class, 'updateProfile'], [[AuthMiddleware::class, 'requireAuth']]);
    $router->put('/api/auth/password', [AuthController::class, 'changePassword'], [[AuthMiddleware::class, 'requireAuth']]);

    registerPublicRoutes($router);
    registerAdminRoutes($router);
}
