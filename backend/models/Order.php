<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class Order extends BaseModel
{
    protected string $table = 'orders';
    protected array $fillable = [
        'order_number', 'customer_name', 'phone', 'address', 'apartment',
        'city', 'postal_code', 'items', 'subtotal', 'status',
    ];

    public function updateStatus(int $id, string $status): bool
    {
        $stmt = $this->pdo->prepare('UPDATE orders SET status = :status, updated_at = NOW() WHERE id = :id');
        return $stmt->execute([':id' => $id, ':status' => $status]);
    }

    /**
     * Generate a unique, sequential order number, e.g. ARN-20260715-0000.
     */
    public function generateOrderNumber(): string
    {
        $dateKey = date('Ymd');
        $stmt = $this->pdo->prepare(
            'SELECT MAX(CAST(SUBSTRING(order_number, -4) AS UNSIGNED)) AS last_seq FROM orders WHERE order_number LIKE :prefix'
        );
        $stmt->execute([':prefix' => "ARN-{$dateKey}-%"]);
        $result = $stmt->fetch();
        $lastSeq = (int) ($result['last_seq'] ?? -1);
        $nextSeq = $lastSeq + 1;

        return sprintf('ARN-%s-%04d', $dateKey, $nextSeq);
    }
}
