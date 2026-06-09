<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class Address extends BaseModel
{
    protected string $table = 'addresses';
    protected array $fillable = ['user_id', 'label', 'first_name', 'last_name', 'phone', 'email', 'street_address', 'apartment', 'city', 'state', 'postal_code', 'country', 'is_default'];

    public function findByUserId(int $userId): array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM addresses WHERE user_id = :user_id ORDER BY is_default DESC, created_at DESC');
        $stmt->execute([':user_id' => $userId]);
        return $stmt->fetchAll() ?: [];
    }

    public function findDefaultByUserId(int $userId): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM addresses WHERE user_id = :user_id AND is_default = 1 LIMIT 1');
        $stmt->execute([':user_id' => $userId]);
        $row = $stmt->fetch();
        return $row !== false ? $row : null;
    }

    public function setDefaultAddress(int $userId, int $addressId): bool
    {
        $stmt = $this->pdo->prepare('UPDATE addresses SET is_default = 0 WHERE user_id = :user_id');
        $stmt->execute([':user_id' => $userId]);

        $stmt = $this->pdo->prepare('UPDATE addresses SET is_default = 1 WHERE id = :id AND user_id = :user_id');
        $stmt->execute([':id' => $addressId, ':user_id' => $userId]);
        return true;
    }
}
