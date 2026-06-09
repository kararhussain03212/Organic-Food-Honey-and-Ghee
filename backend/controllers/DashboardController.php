<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Config\Database;
use Backend\Models\BlogPost;
use Backend\Models\ContactMessage;
use Backend\Models\HeroSlide;
use Backend\Models\Product;
use Backend\Models\Testimonial;
use Backend\Utils\Response;

require_once __DIR__ . '/BaseController.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/HeroSlide.php';
require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/../models/Testimonial.php';
require_once __DIR__ . '/../models/BlogPost.php';
require_once __DIR__ . '/../models/ContactMessage.php';
require_once __DIR__ . '/../utils/Response.php';

final class DashboardController extends BaseController
{
    public function stats(array $params = []): void
    {
        $this->requirePermission('view_dashboard');
        $contactModel = new ContactMessage();

        $counts = [
            'hero'             => (new HeroSlide())->count(),
            'products'         => (new Product())->count(),
            'testimonials'     => (new Testimonial())->count(),
            'blog'             => (new BlogPost())->count(),
            'contact_unread'   => $contactModel->countByStatus('unread'),
        ];

        $pdo = Database::connection();
        try {
            $stmt   = $pdo->query('SELECT id, action, resource, resource_id, created_at FROM activity_logs ORDER BY created_at DESC LIMIT 20');
            $recent = $stmt ? ($stmt->fetchAll() ?: []) : [];
        } catch (\Throwable $e) {
            $recent = [];
        }

        Response::success([
            'counts'            => $counts,
            'recent_activities' => $recent,
        ], 'Dashboard data fetched');
    }
}
