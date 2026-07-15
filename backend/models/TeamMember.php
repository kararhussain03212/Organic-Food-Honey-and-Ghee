<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class TeamMember extends BaseModel
{
    protected string $table = 'team_members';
    protected array $fillable = ['name', 'region', 'quote', 'photo', 'whatsapp_number', 'sort_order', 'is_active'];

    public function publicActive(): array
    {
        $stmt = $this->pdo->query(
            'SELECT id, name, region, quote, photo, whatsapp_number, sort_order
             FROM team_members WHERE is_active = 1 ORDER BY sort_order ASC, id ASC'
        );

        return $stmt->fetchAll() ?: [];
    }

    protected function defaultOrderBy(): string
    {
        return 'sort_order ASC, id ASC';
    }

    // BaseModel::reorder targets an order_position column; this table uses sort_order.
    public function reorder(array $items): bool
    {
        $this->pdo->beginTransaction();

        try {
            $stmt = $this->pdo->prepare('UPDATE team_members SET sort_order = :sort_order, updated_at = NOW() WHERE id = :id');
            foreach ($items as $index => $item) {
                $id = (int) ($item['id'] ?? 0);
                $position = (int) ($item['sort_order'] ?? $item['order_position'] ?? $index + 1);
                if ($id <= 0) {
                    continue;
                }
                $stmt->execute([':id' => $id, ':sort_order' => $position]);
            }
            $this->pdo->commit();
            return true;
        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            return false;
        }
    }
}
