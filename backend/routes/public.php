<?php

declare(strict_types=1);

use Backend\Controllers\BlogController;
use Backend\Controllers\ContactController;
use Backend\Controllers\HeroController;
use Backend\Controllers\ProductController;
use Backend\Controllers\SettingController;
use Backend\Controllers\TestimonialController;
use Backend\Utils\Router;

require_once __DIR__ . '/../controllers/HeroController.php';
require_once __DIR__ . '/../controllers/ProductController.php';
require_once __DIR__ . '/../controllers/TestimonialController.php';
require_once __DIR__ . '/../controllers/BlogController.php';
require_once __DIR__ . '/../controllers/SettingController.php';
require_once __DIR__ . '/../controllers/ContactController.php';
require_once __DIR__ . '/../utils/Router.php';

function registerPublicRoutes(Router $router): void
{
    $router->get('/api/public/hero', [HeroController::class, 'publicIndex']);
    $router->get('/api/public/products', [ProductController::class, 'publicIndex']);
    $router->get('/api/public/products/{slug}', [ProductController::class, 'publicShowBySlug']);
    $router->get('/api/public/testimonials', [TestimonialController::class, 'publicIndex']);
    $router->get('/api/public/blog', [BlogController::class, 'publicIndex']);
    $router->get('/api/public/blog/{slug}', [BlogController::class, 'publicShowBySlug']);
    $router->get('/api/public/settings', [SettingController::class, 'publicIndex']);
    $router->post('/api/public/contact', [ContactController::class, 'store']);
}
