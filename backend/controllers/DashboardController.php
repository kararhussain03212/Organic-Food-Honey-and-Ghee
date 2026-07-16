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
        $pdo = Database::connection();
        $contactModel = new ContactMessage();

        $ordersTotal = (int) ($this->scalar($pdo, 'SELECT COUNT(*) FROM orders') ?? 0);
        $ordersNew   = (int) ($this->scalar($pdo, "SELECT COUNT(*) FROM orders WHERE status = 'new'") ?? 0);
        $revenue     = (float) ($this->scalar(
            $pdo,
            "SELECT COALESCE(SUM(subtotal), 0) FROM orders WHERE status != 'cancelled'"
        ) ?? 0);
        $revenueToday = (float) ($this->scalar(
            $pdo,
            "SELECT COALESCE(SUM(subtotal), 0) FROM orders WHERE status != 'cancelled' AND DATE(created_at) = CURDATE()"
        ) ?? 0);

        $counts = [
            'hero'             => (new HeroSlide())->count(),
            'products'         => (new Product())->count(),
            'testimonials'     => (new Testimonial())->count(),
            'blog'             => (new BlogPost())->count(),
            'contact_unread'   => $contactModel->countByStatus('unread'),
            'orders'           => $ordersTotal,
            'orders_new'       => $ordersNew,
            'revenue'          => $revenue,
            'revenue_today'    => $revenueToday,
        ];

        try {
            $stmt   = $pdo->query('SELECT id, action, resource, resource_id, created_at FROM activity_logs ORDER BY created_at DESC LIMIT 20');
            $recent = $stmt ? ($stmt->fetchAll() ?: []) : [];
        } catch (\Throwable $e) {
            $recent = [];
        }

        try {
            $stmt = $pdo->query(
                'SELECT id, order_number, customer_name, phone, city, items, subtotal, status, created_at
                 FROM orders ORDER BY created_at DESC, id DESC LIMIT 6'
            );
            $recentOrders = $stmt ? ($stmt->fetchAll() ?: []) : [];
        } catch (\Throwable $e) {
            $recentOrders = [];
        }

        try {
            $stmt = $pdo->query(
                'SELECT id, name, email, subject, message, status, created_at
                 FROM contact_messages ORDER BY created_at DESC, id DESC LIMIT 6'
            );
            $recentMessages = $stmt ? ($stmt->fetchAll() ?: []) : [];
        } catch (\Throwable $e) {
            $recentMessages = [];
        }

        try {
            $stmt = $pdo->query(
                'SELECT id, name, slug, price, stock, sort_order
                 FROM products ORDER BY sort_order ASC, id DESC LIMIT 5'
            );
            $lowStock = array_values(array_filter($stmt ? ($stmt->fetchAll() ?: []) : [], static fn ($p) => (int) $p['stock'] === 0));
        } catch (\Throwable $e) {
            $lowStock = [];
        }

        Response::success([
            'counts'            => $counts,
            'recent_activities' => $recent,
            'recent_orders'     => $recentOrders,
            'recent_messages'   => $recentMessages,
            'out_of_stock'      => $lowStock,
        ], 'Dashboard data fetched');
    }

    private function scalar(\PDO $pdo, string $sql): mixed
    {
        try {
            $stmt = $pdo->query($sql);
            $value = $stmt ? $stmt->fetchColumn() : null;
            return $value === false ? null : $value;
        } catch (\Throwable $e) {
            return null;
        }
    }
}
