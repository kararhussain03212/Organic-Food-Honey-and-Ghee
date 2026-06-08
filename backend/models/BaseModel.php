<?php

declare(strict_types=1);

namespace Backend\Models;

use Backend\Config\Database;
use Backend\Utils\UploadPath;
use PDO;

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/UploadPath.php';

abstract class BaseModel
{
    protected PDO $pdo;
    protected string $table;
    protected array $fillable = [];
    protected ?array $existingColumns = null;

    public function __construct()
    {
        $this->pdo = Database::connection();
    }

    public function all(array $query = [], bool $onlyActive = false): array
    {
        [$where, $params] = $this->buildFilters($query, $onlyActive);

        $sql = 'SELECT * FROM ' . $this->table;
        if ($where !== []) {
            $sql .= ' WHERE ' . implode(' AND ', $where);
        }

        $sql .= ' ORDER BY ' . $this->defaultOrderBy();

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);

        $rows = $stmt->fetchAll() ?: [];
        return array_map(fn (array $row): array => $this->normalizeUploadColumns($row), $rows);
    }

    public function paginate(array $query = [], bool $onlyActive = false): array
    {
        $page = max(1, (int) ($query['page'] ?? 1));
        $perPage = max(1, min(100, (int) ($query['per_page'] ?? 10)));
        $offset = ($page - 1) * $perPage;
        [$where, $params] = $this->buildFilters($query, $onlyActive);

        $countSql = 'SELECT COUNT(*) AS aggregate FROM ' . $this->table;
        if ($where !== []) {
            $countSql .= ' WHERE ' . implode(' AND ', $where);
        }

        $countStmt = $this->pdo->prepare($countSql);
        $countStmt->execute($params);
        $countRow = $countStmt->fetch();
        $total = (int) ($countRow['aggregate'] ?? 0);

        $dataSql = 'SELECT * FROM ' . $this->table;
        if ($where !== []) {
            $dataSql .= ' WHERE ' . implode(' AND ', $where);
        }
        $dataSql .= ' ORDER BY ' . $this->defaultOrderBy() . ' LIMIT :limit OFFSET :offset';

        $dataStmt = $this->pdo->prepare($dataSql);
        foreach ($params as $key => $value) {
            $dataStmt->bindValue($key, $value);
        }
        $dataStmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
        $dataStmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $dataStmt->execute();
        $data = $dataStmt->fetchAll() ?: [];
        $data = array_map(fn (array $row): array => $this->normalizeUploadColumns($row), $data);

        return [
            'data' => $data,
            'meta' => [
                'page' => $page,
                'per_page' => $perPage,
                'total' => $total,
                'total_pages' => (int) ceil($total / $perPage),
            ],
        ];
    }

    public function find(int $id): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM ' . $this->table . ' WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();

        return $row !== false ? $this->normalizeUploadColumns($row) : null;
    }

    public function findBySlug(string $slug): ?array
    {
        if (!$this->hasColumn('slug')) {
            return null;
        }

        $stmt = $this->pdo->prepare('SELECT * FROM ' . $this->table . ' WHERE slug = :slug LIMIT 1');
        $stmt->execute([':slug' => $slug]);
        $row = $stmt->fetch();

        return $row !== false ? $this->normalizeUploadColumns($row) : null;
    }

    public function create(array $data): int
    {
        $payload = $this->sanitizeFillable($data);
        $payload['created_at'] = date('Y-m-d H:i:s');
        $payload['updated_at'] = date('Y-m-d H:i:s');

        $columns = array_keys($payload);
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

    public function update(int $id, array $data): bool
    {
        $payload = $this->sanitizeFillable($data);
        if ($payload === []) {
            return false;
        }

        $payload['updated_at'] = date('Y-m-d H:i:s');

        $set = [];
        foreach ($payload as $column => $value) {
            $set[] = sprintf('%s = :%s', $column, $column);
        }

        $payload['id'] = $id;
        $sql = sprintf('UPDATE %s SET %s WHERE id = :id', $this->table, implode(', ', $set));
        $stmt = $this->pdo->prepare($sql);

        return $stmt->execute($payload);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->pdo->prepare('DELETE FROM ' . $this->table . ' WHERE id = :id');
        return $stmt->execute([':id' => $id]);
    }

    /**
     * Insert or update the single canonical row (id = 1) for singleton tables.
     */
    public function saveSingle(array $data): ?array
    {
        $payload = $this->sanitizeFillable($data);
        $payload['updated_at'] = date('Y-m-d H:i:s');

        if ($this->find(1) !== null) {
            $this->update(1, $data);
        } else {
            $payload['created_at'] = date('Y-m-d H:i:s');
            $cols   = implode(', ', array_keys($payload));
            $pmarks = implode(', ', array_map(static fn (string $k): string => ':' . $k, array_keys($payload)));
            $binds  = [];
            foreach ($payload as $k => $v) {
                $binds[':' . $k] = $v;
            }
            $this->pdo->prepare(
                "INSERT INTO {$this->table} (id, {$cols}) VALUES (1, {$pmarks})"
            )->execute($binds);
        }

        return $this->find(1);
    }

    public function reorder(array $items): bool
    {
        if (!$this->hasColumn('order_position')) {
            return false;
        }

        $this->pdo->beginTransaction();

        try {
            $stmt = $this->pdo->prepare('UPDATE ' . $this->table . ' SET order_position = :order_position, updated_at = NOW() WHERE id = :id');
            foreach ($items as $index => $item) {
                $id = (int) ($item['id'] ?? 0);
                $position = (int) ($item['order_position'] ?? $index + 1);
                if ($id <= 0) {
                    continue;
                }
                $stmt->execute([
                    ':id' => $id,
                    ':order_position' => $position,
                ]);
            }
            $this->pdo->commit();
            return true;
        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            return false;
        }
    }

    public function count(): int
    {
        $stmt = $this->pdo->query('SELECT COUNT(*) AS aggregate FROM ' . $this->table);
        $row = $stmt->fetch();

        return (int) ($row['aggregate'] ?? 0);
    }

    protected function hasColumn(string $column): bool
    {
        if ($column === 'created_at' || $column === 'updated_at') {
            return true;
        }

        return in_array($column, $this->getExistingColumns(), true) || $column === 'id';
    }

    protected function searchableColumns(): array
    {
        $priority = ['title', 'name', 'email', 'slug', 'subtitle', 'description'];
        $available = array_values(array_intersect($priority, $this->fillable));

        return $available;
    }

    protected function defaultOrderBy(): string
    {
        if ($this->hasColumn('order_position')) {
            return 'order_position ASC, id DESC';
        }

        if ($this->hasColumn('created_at')) {
            return 'created_at DESC, id DESC';
        }

        return 'id DESC';
    }

    protected function sanitizeFillable(array $data): array
    {
        $payload = [];
        $existingColumns = $this->getExistingColumns();

        foreach ($this->fillable as $column) {
            if (!array_key_exists($column, $data)) {
                continue;
            }
            if (!in_array($column, $existingColumns, true)) {
                continue;
            }
            $payload[$column] = is_string($data[$column]) ? trim($data[$column]) : $data[$column];
        }

        return $payload;
    }

    protected function getExistingColumns(): array
    {
        if (is_array($this->existingColumns)) {
            return $this->existingColumns;
        }

        try {
            $stmt = $this->pdo->query('SHOW COLUMNS FROM ' . $this->table);
            $rows = $stmt ? ($stmt->fetchAll() ?: []) : [];
            $this->existingColumns = array_values(array_filter(array_map(
                static fn ($row): string => (string) ($row['Field'] ?? ''),
                $rows
            )));
        } catch (\Throwable $e) {
            $this->existingColumns = $this->fillable;
        }

        return $this->existingColumns;
    }

    private function buildFilters(array $query, bool $onlyActive): array
    {
        $where = [];
        $params = [];

        if ($onlyActive && $this->hasColumn('status')) {
            $where[] = 'status = :status';
            $params[':status'] = 'active';
        }

        if ($this->hasColumn('status') && isset($query['status']) && in_array($query['status'], ['active', 'inactive'], true)) {
            $where[] = 'status = :f_status';
            $params[':f_status'] = $query['status'];
        }

        if (isset($query['search']) && trim((string) $query['search']) !== '') {
            $searchable = $this->searchableColumns();
            if ($searchable !== []) {
                $chunks = [];
                foreach ($searchable as $index => $column) {
                    $key = ':search_' . $index;
                    $chunks[] = sprintf('%s LIKE %s', $column, $key);
                    $params[$key] = '%' . trim((string) $query['search']) . '%';
                }
                $where[] = '(' . implode(' OR ', $chunks) . ')';
            }
        }

        return [$where, $params];
    }

    private function normalizeUploadColumns(array $row): array
    {
        foreach ($row as $key => $value) {
            if (!is_string($value)) {
                continue;
            }

            if ($this->endsWith($key, '_path')) {
                $row[$key] = UploadPath::resolvePublicPath($value) ?? $value;
                continue;
            }

            if ($value !== '' && ($value[0] === '[' || $value[0] === '{')) {
                $decoded = json_decode($value, true);
                if (is_array($decoded)) {
                    $row[$key] = UploadPath::normalizeMixed($decoded);
                }
            }
        }

        return $row;
    }

    private function endsWith(string $haystack, string $needle): bool
    {
        if ($needle === '') {
            return true;
        }

        $needleLength = strlen($needle);
        if ($needleLength > strlen($haystack)) {
            return false;
        }

        return substr($haystack, -$needleLength) === $needle;
    }
}
