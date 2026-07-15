<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class AffiliateApplication extends BaseModel
{
    protected string $table = 'affiliate_applications';
    protected array $fillable = ['full_name', 'phone', 'city', 'social_handle', 'applicant_type', 'reason', 'status'];

    public function updateStatus(int $id, string $status): bool
    {
        $stmt = $this->pdo->prepare('UPDATE affiliate_applications SET status = :status, updated_at = NOW() WHERE id = :id');
        return $stmt->execute([':id' => $id, ':status' => $status]);
    }
}
