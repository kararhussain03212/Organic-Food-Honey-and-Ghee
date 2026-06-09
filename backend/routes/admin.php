<?php

declare(strict_types=1);

use Backend\Controllers\AboutController;
use Backend\Controllers\BlogController;
use Backend\Controllers\CommitmentItemController;
use Backend\Controllers\ContactController;
use Backend\Controllers\CustomerAddressController;
use Backend\Controllers\DashboardController;
use Backend\Controllers\HeroController;
use Backend\Controllers\ProductController;
use Backend\Controllers\ProductPageController;
use Backend\Controllers\SettingController;
use Backend\Controllers\TestimonialController;
use Backend\Controllers\UploadController;
use Backend\Controllers\UserController;
use Backend\Middleware\AuthMiddleware;
use Backend\Utils\Router;

require_once __DIR__ . '/../controllers/HeroController.php';
require_once __DIR__ . '/../controllers/ProductController.php';
require_once __DIR__ . '/../controllers/ProductPageController.php';
require_once __DIR__ . '/../controllers/TestimonialController.php';
require_once __DIR__ . '/../controllers/CommitmentItemController.php';
require_once __DIR__ . '/../controllers/BlogController.php';
require_once __DIR__ . '/../controllers/SettingController.php';
require_once __DIR__ . '/../controllers/UploadController.php';
require_once __DIR__ . '/../controllers/UserController.php';
require_once __DIR__ . '/../controllers/DashboardController.php';
require_once __DIR__ . '/../controllers/ContactController.php';
require_once __DIR__ . '/../controllers/AboutController.php';
require_once __DIR__ . '/../controllers/CustomerAddressController.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../utils/Router.php';

function registerAdminRoutes(Router $router): void
{
    $mw = [[AuthMiddleware::class, 'requireAuth']];

    $router->get('/api/admin/dashboard', [DashboardController::class, 'stats'], $mw);

    // Hero Slides
    $router->get('/api/admin/hero', [HeroController::class, 'index'], $mw);
    $router->get('/api/admin/hero/{id}', [HeroController::class, 'show'], $mw);
    $router->post('/api/admin/hero', [HeroController::class, 'store'], $mw);
    $router->put('/api/admin/hero/{id}', [HeroController::class, 'update'], $mw);
    $router->delete('/api/admin/hero/{id}', [HeroController::class, 'destroy'], $mw);
    $router->patch('/api/admin/hero/reorder', [HeroController::class, 'reorder'], $mw);

    // Products
    $router->get('/api/admin/products', [ProductController::class, 'index'], $mw);
    $router->get('/api/admin/products/{id}', [ProductController::class, 'show'], $mw);
    $router->post('/api/admin/products', [ProductController::class, 'store'], $mw);
    $router->put('/api/admin/products/{id}', [ProductController::class, 'update'], $mw);
    $router->delete('/api/admin/products/{id}', [ProductController::class, 'destroy'], $mw);
    $router->patch('/api/admin/products/reorder', [ProductController::class, 'reorder'], $mw);

    // Product Page Settings (admin)
    $router->get('/api/admin/product-page', [ProductPageController::class, 'index'], $mw);
    $router->put('/api/admin/product-page', [ProductPageController::class, 'update'], $mw);

    // Testimonials
    $router->get('/api/admin/testimonials', [TestimonialController::class, 'index'], $mw);
    $router->get('/api/admin/testimonials/{id}', [TestimonialController::class, 'show'], $mw);
    $router->post('/api/admin/testimonials', [TestimonialController::class, 'store'], $mw);
    $router->put('/api/admin/testimonials/{id}', [TestimonialController::class, 'update'], $mw);
    $router->delete('/api/admin/testimonials/{id}', [TestimonialController::class, 'destroy'], $mw);
    $router->patch('/api/admin/testimonials/reorder', [TestimonialController::class, 'reorder'], $mw);

    // Blog
    $router->get('/api/admin/blog', [BlogController::class, 'index'], $mw);
    $router->put('/api/admin/blog/settings', [BlogController::class, 'adminUpdateBlogSettings'], $mw);
    $router->get('/api/admin/blog/{id}', [BlogController::class, 'show'], $mw);
    $router->post('/api/admin/blog', [BlogController::class, 'store'], $mw);
    $router->put('/api/admin/blog/{id}', [BlogController::class, 'update'], $mw);
    $router->delete('/api/admin/blog/{id}', [BlogController::class, 'destroy'], $mw);
    $router->patch('/api/admin/blog/reorder', [BlogController::class, 'reorder'], $mw);

    // Settings
    $router->get('/api/admin/settings', [SettingController::class, 'index'], $mw);
    $router->put('/api/admin/settings', [SettingController::class, 'update'], $mw);

    // Upload
    $router->post('/api/admin/upload', [UploadController::class, 'upload'], $mw);

    // Users
    $router->get('/api/admin/users', [UserController::class, 'index'], $mw);
    $router->get('/api/admin/users/{id}', [UserController::class, 'show'], $mw);
    $router->post('/api/admin/users', [UserController::class, 'store'], $mw);
    $router->put('/api/admin/users/{id}', [UserController::class, 'update'], $mw);
    $router->delete('/api/admin/users/{id}', [UserController::class, 'destroy'], $mw);

    // Commitment Items
    $router->get('/api/admin/commitment-items', [CommitmentItemController::class, 'index'], $mw);
    $router->get('/api/admin/commitment-items/{id}', [CommitmentItemController::class, 'show'], $mw);
    $router->post('/api/admin/commitment-items', [CommitmentItemController::class, 'store'], $mw);
    $router->put('/api/admin/commitment-items/{id}', [CommitmentItemController::class, 'update'], $mw);
    $router->delete('/api/admin/commitment-items/{id}', [CommitmentItemController::class, 'destroy'], $mw);
    $router->patch('/api/admin/commitment-items/reorder', [CommitmentItemController::class, 'reorder'], $mw);

    // Contact Page Settings (admin)
    $router->get('/api/admin/contact-page', [ContactController::class, 'adminGetContactPage'], $mw);
    $router->put('/api/admin/contact-page', [ContactController::class, 'adminUpdateContactPage'], $mw);

    // Contact Messages (admin)
    $router->get('/api/admin/contact', [ContactController::class, 'index'], $mw);
    $router->patch('/api/admin/contact/{id}/read', [ContactController::class, 'markRead'], $mw);
    $router->delete('/api/admin/contact/{id}', [ContactController::class, 'destroy'], $mw);

    // About Us — single-record sections
    $router->get('/api/admin/about/hero',        [AboutController::class, 'adminGetHero'],       $mw);
    $router->put('/api/admin/about/hero',        [AboutController::class, 'adminUpdateHero'],    $mw);
    $router->get('/api/admin/about/story',       [AboutController::class, 'adminGetStory'],      $mw);
    $router->put('/api/admin/about/story',       [AboutController::class, 'adminUpdateStory'],   $mw);
    $router->get('/api/admin/about/mission',     [AboutController::class, 'adminGetMission'],    $mw);
    $router->put('/api/admin/about/mission',     [AboutController::class, 'adminUpdateMission'], $mw);
    $router->get('/api/admin/about/comparison',  [AboutController::class, 'adminGetComparison'],    $mw);
    $router->put('/api/admin/about/comparison',  [AboutController::class, 'adminUpdateComparison'], $mw);
    $router->get('/api/admin/about/cta',         [AboutController::class, 'adminGetCta'],        $mw);
    $router->put('/api/admin/about/cta',         [AboutController::class, 'adminUpdateCta'],     $mw);

    // About Us — problem cards (CRUD)
    $router->get('/api/admin/about/problems',        [AboutController::class, 'adminIndexProblems'],  $mw);
    $router->post('/api/admin/about/problems',       [AboutController::class, 'adminStoreProblems'],  $mw);
    $router->put('/api/admin/about/problems/{id}',   [AboutController::class, 'adminUpdateProblems'], $mw);
    $router->delete('/api/admin/about/problems/{id}',[AboutController::class, 'adminDeleteProblems'], $mw);

    // About Us — core values (CRUD)
    $router->get('/api/admin/about/core-values',         [AboutController::class, 'adminIndexCoreValues'],  $mw);
    $router->post('/api/admin/about/core-values',        [AboutController::class, 'adminStoreCoreValues'],  $mw);
    $router->put('/api/admin/about/core-values/{id}',    [AboutController::class, 'adminUpdateCoreValues'], $mw);
    $router->delete('/api/admin/about/core-values/{id}', [AboutController::class, 'adminDeleteCoreValues'], $mw);

    // About Us — comparison cards (CRUD)
    $router->get('/api/admin/about/comparison-cards',         [AboutController::class, 'adminIndexComparisonCards'],  $mw);
    $router->post('/api/admin/about/comparison-cards',        [AboutController::class, 'adminStoreComparisonCards'],  $mw);
    $router->put('/api/admin/about/comparison-cards/{id}',    [AboutController::class, 'adminUpdateComparisonCards'], $mw);
    $router->delete('/api/admin/about/comparison-cards/{id}', [AboutController::class, 'adminDeleteComparisonCards'], $mw);

    // Customer Addresses (admin)
    $router->get('/api/admin/customers', [CustomerAddressController::class, 'index'], $mw);
    $router->get('/api/admin/customers/{id}', [CustomerAddressController::class, 'show'], $mw);
    $router->delete('/api/admin/addresses/{id}', [CustomerAddressController::class, 'deleteAddress'], $mw);
}
