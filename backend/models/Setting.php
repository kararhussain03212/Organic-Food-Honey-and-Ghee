<?php

declare(strict_types=1);

namespace Backend\Models;

use Backend\Utils\UploadPath;

require_once __DIR__ . '/BaseModel.php';
require_once __DIR__ . '/../utils/UploadPath.php';

final class Setting extends BaseModel
{
    protected string $table = 'settings';
    protected array $fillable = ['setting_key', 'setting_value', 'setting_type', 'order_position', 'status'];

    public function asMap(bool $onlyActive = true): array
    {
        $rows = $this->all([], $onlyActive);
        $map = [];

        foreach ($rows as $row) {
            $value = $row['setting_value'];
            if (is_string($value)) {
                $value = UploadPath::resolvePublicPath($value) ?? $value;
            }
            $map[$row['setting_key']] = $value;
        }

        return $map;
    }

    public function upsertMany(array $items): void
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO settings (setting_key, setting_value, setting_type, order_position, status, created_at, updated_at) VALUES (:setting_key, :setting_value, :setting_type, :order_position, :status, NOW(), NOW()) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), setting_type = VALUES(setting_type), status = VALUES(status), updated_at = NOW()'
        );

        $position = 1;
        $this->pdo->beginTransaction();
        try {
            foreach ($items as $key => $value) {
                $stmt->execute([
                    ':setting_key' => (string) $key,
                    ':setting_value' => is_scalar($value) ? (string) $value : json_encode($value, JSON_UNESCAPED_SLASHES),
                    ':setting_type' => is_scalar($value) ? 'text' : 'json',
                    ':order_position' => $position++,
                    ':status' => 'active',
                ]);
            }
            $this->pdo->commit();
        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }
}
