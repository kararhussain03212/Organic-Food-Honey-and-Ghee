<?php

declare(strict_types=1);

namespace Backend\Config;

use PDO;
use PDOException;
use RuntimeException;

require_once __DIR__ . '/env.php';

final class Database
{
    private static ?PDO $pdo = null;

    private static function isLocalRuntime(): bool
    {
        if (PHP_SAPI === 'cli') {
            return true;
        }

        $host = strtolower((string) ($_SERVER['HTTP_HOST'] ?? ''));
        $host = trim(explode(':', $host)[0] ?? '');
        return in_array($host, ['localhost', '127.0.0.1', '::1'], true);
    }

    private static function connect(string $host, string $port, string $name, string $user, string $pass): PDO
    {
        $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', $host, $port, $name);
        return new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    }

    public static function connection(): PDO
    {
        if (self::$pdo instanceof PDO) {
            return self::$pdo;
        }

        Env::load(dirname(__DIR__) . '/.env');

        $host = Env::get('DB_HOST', '127.0.0.1');
        $port = Env::get('DB_PORT', '3306');
        $name = Env::get('DB_NAME', 'organic_food');
        $user = Env::get('DB_USER', 'root');
        $pass = Env::get('DB_PASS', '');

        try {
            self::$pdo = self::connect($host, $port, $name, $user, $pass);
        } catch (PDOException $e) {
            if (self::isLocalRuntime()) {
                // Keep production creds in .env, but allow local dev with XAMPP defaults.
                $localHost = Env::get('DB_LOCAL_HOST', '127.0.0.1');
                $localPort = Env::get('DB_LOCAL_PORT', '3306');
                $localName = Env::get('DB_LOCAL_NAME', 'organic_food');
                $localUser = Env::get('DB_LOCAL_USER', 'root');
                $localPass = Env::get('DB_LOCAL_PASS', '');

                try {
                    self::$pdo = self::connect($localHost, $localPort, $localName, $localUser, $localPass);
                    return self::$pdo;
                } catch (PDOException $localError) {
                    throw new RuntimeException('Database connection failed: ' . $localError->getMessage(), 500);
                }
            }

            throw new RuntimeException('Database connection failed: ' . $e->getMessage(), 500);
        }

        return self::$pdo;
    }
}
