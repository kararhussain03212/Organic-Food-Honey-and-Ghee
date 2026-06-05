<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class ContactMessage extends BaseModel
{
    protected string $table = 'contact_messages';
    protected array $fillable = [
        'name', 'email', 'phone', 'subject', 'message', 'status',
    ];

    protected function defaultOrderBy(): string
    {
        return 'created_at DESC, id DESC';
    }

    public function create(array $data): int
    {
        $payload = $this->sanitizeFillable($data);
        $payload['created_at'] = date('Y-m-d H:i:s');

        $columns      = array_keys($payload);
        $placeholders = array_map(static fn (string $k): string => ':' . $k, $columns);

        $sql = sprintf(
            'INSERT INTO %s (%s) VALUES (%s)',
            $this->table,
            implode(', ', $columns),
            implode(', ', $placeholders)
        );

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(array_combine($placeholders, array_values($payload)) ?: []);
        return (int) $this->pdo->lastInsertId();
    }

    public function markRead(int $id): bool
    {
        $stmt = $this->pdo->prepare(
            'UPDATE ' . $this->table . ' SET status = :status WHERE id = :id'
        );
        return $stmt->execute([':status' => 'read', ':id' => $id]);
    }

    public function countByStatus(string $status): int
    {
        $stmt = $this->pdo->prepare(
            'SELECT COUNT(*) AS aggregate FROM ' . $this->table . ' WHERE status = :status'
        );
        $stmt->execute([':status' => $status]);
        $row = $stmt->fetch();
        return (int) ($row['aggregate'] ?? 0);
    }
}
