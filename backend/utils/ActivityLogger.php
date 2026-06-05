<?php

declare(strict_types=1);

namespace Backend\Utils;

use Backend\Config\Database;
use Throwable;

require_once __DIR__ . '/../config/database.php';

final class ActivityLogger
{
    public static function log(?int $adminId, string $action, string $resource, ?int $resourceId = null): void
    {
        try {
            $pdo = Database::connection();
            $stmt = $pdo->prepare('INSERT INTO activity_logs (admin_id, action, resource, resource_id, ip_address, created_at) VALUES (:admin_id, :action, :resource, :resource_id, :ip_address, NOW())');
            $stmt->execute([
                ':admin_id' => $adminId,
                ':action' => $action,
                ':resource' => $resource,
                ':resource_id' => $resourceId,
                ':ip_address' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            ]);
        } catch (Throwable $e) {
            // Logging failures should not break API responses.
        }
    }
}
