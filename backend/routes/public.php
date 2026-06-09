<?php

declare(strict_types=1);

use Backend\Controllers\AboutController;
use Backend\Controllers\AddressController;
use Backend\Controllers\BlogController;
use Backend\Controllers\CommitmentItemController;
use Backend\Controllers\ContactController;
use Backend\Controllers\HeroController;
use Backend\Controllers\ProductController;
use Backend\Controllers\ProductPageController;
use Backend\Controllers\SettingController;
use Backend\Controllers\TestimonialController;
use Backend\Middleware\AuthMiddleware;
use Backend\Utils\Router;

require_once __DIR__ . '/../controllers/HeroController.php';
require_once __DIR__ . '/../controllers/ProductController.php';
require_once __DIR__ . '/../controllers/ProductPageController.php';
require_once __DIR__ . '/../controllers/TestimonialController.php';
require_once __DIR__ . '/../controllers/BlogController.php';
require_once __DIR__ . '/../controllers/SettingController.php';
require_once __DIR__ . '/../controllers/ContactController.php';
require_once __DIR__ . '/../controllers/CommitmentItemController.php';
require_once __DIR__ . '/../controllers/AboutController.php';
require_once __DIR__ . '/../controllers/AddressController.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../utils/Router.php';

function registerPublicRoutes(Router $router): void
{
    $router->get('/api/public/hero', [HeroController::class, 'publicIndex']);
    $router->get('/api/public/products', [ProductController::class, 'publicIndex']);
    $router->get('/api/public/products/{slug}', [ProductController::class, 'publicShowBySlug']);
    $router->get('/api/public/testimonials', [TestimonialController::class, 'publicIndex']);
    $router->get('/api/public/commitment-items', [CommitmentItemController::class, 'publicIndex']);
    $router->get('/api/public/blog', [BlogController::class, 'publicIndex']);
    $router->get('/api/public/blog/search', [BlogController::class, 'publicSearch']);
    $router->get('/api/public/blog/settings', [BlogController::class, 'publicBlogSettings']);
    $router->get('/api/public/blog/{slug}', [BlogController::class, 'publicShowBySlug']);
    $router->get('/api/public/settings', [SettingController::class, 'publicIndex']);
    $router->get('/api/public/contact-page',  [ContactController::class, 'publicContactPage']);
    $router->post('/api/public/contact', [ContactController::class, 'store']);
    $router->get('/api/public/product-page', [ProductPageController::class, 'publicPage']);

    // About Us
    $router->get('/api/public/about/page',        [AboutController::class, 'publicPage']);
    $router->get('/api/public/about/hero',         [AboutController::class, 'publicHero']);
    $router->get('/api/public/about/story',        [AboutController::class, 'publicStory']);
    $router->get('/api/public/about/problems',     [AboutController::class, 'publicProblems']);
    $router->get('/api/public/about/mission',      [AboutController::class, 'publicMission']);
    $router->get('/api/public/about/core-values',  [AboutController::class, 'publicCoreValues']);
    $router->get('/api/public/about/comparison',   [AboutController::class, 'publicComparison']);
    $router->get('/api/public/about/cta',          [AboutController::class, 'publicCta']);

    // User Addresses (authenticated)
    $router->get('/api/addresses', [AddressController::class, 'index'], [[AuthMiddleware::class, 'requireAuth']]);
    $router->post('/api/addresses', [AddressController::class, 'store'], [[AuthMiddleware::class, 'requireAuth']]);
    $router->get('/api/addresses/{id}', [AddressController::class, 'show'], [[AuthMiddleware::class, 'requireAuth']]);
    $router->put('/api/addresses/{id}', [AddressController::class, 'update'], [[AuthMiddleware::class, 'requireAuth']]);
    $router->delete('/api/addresses/{id}', [AddressController::class, 'destroy'], [[AuthMiddleware::class, 'requireAuth']]);
}
