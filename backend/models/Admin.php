<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class Admin extends BaseModel
{
    protected string $table = 'admins';
    protected array $fillable = ['name', 'email', 'password', 'role', 'status', 'designation', 'phone', 'location', 'bio', 'profile_photo', 'permissions_json', 'last_login_at'];

    public function findByLogin(string $login): ?array
    {
        $isEmail = filter_var($login, FILTER_VALIDATE_EMAIL) !== false;

        if ($isEmail) {
            $stmt = $this->pdo->prepare('SELECT * FROM admins WHERE email = :email LIMIT 1');
            $stmt->execute([':email' => $login]);
        } else {
            // If duplicate usernames exist, prefer the most recently created account.
            $stmt = $this->pdo->prepare('SELECT * FROM admins WHERE name = :name ORDER BY id DESC LIMIT 1');
            $stmt->execute([':name' => $login]);
        }

        $row = $stmt->fetch();

        return $row !== false ? $row : null;
    }

    public function findByEmail(string $email): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM admins WHERE email = :email LIMIT 1');
        $stmt->execute([':email' => strtolower(trim($email))]);
        $row = $stmt->fetch();

        return $row !== false ? $row : null;
    }
}
