<?php

declare(strict_types=1);

namespace Backend\Utils;

final class Cache
{
    private const DEFAULT_TTL = 300;

    public static function remember(string $key, callable $resolver, int $ttl = self::DEFAULT_TTL)
    {
        $path = self::path($key);
        if (is_file($path)) {
            $raw = file_get_contents($path);
            $cached = $raw ? json_decode($raw, true) : null;
            if (is_array($cached) && isset($cached['expires_at']) && time() < (int) $cached['expires_at']) {
                return $cached['value'] ?? null;
            }
        }

        $value = $resolver();
        self::set($key, $value, $ttl);

        return $value;
    }

    public static function set(string $key, $value, int $ttl = self::DEFAULT_TTL): void
    {
        $payload = json_encode([
            'expires_at' => time() + $ttl,
            'value' => $value,
        ], JSON_UNESCAPED_SLASHES);

        file_put_contents(self::path($key), (string) $payload);
    }

    public static function clearAll(): void
    {
        $dir = dirname(__DIR__) . '/storage/cache';
        if (!is_dir($dir)) {
            return;
        }

        $files = glob($dir . '/*.json') ?: [];
        foreach ($files as $file) {
            @unlink($file);
        }
    }

    private static function path(string $key): string
    {
        $dir = dirname(__DIR__) . '/storage/cache';
        if (!is_dir($dir)) {
            mkdir($dir, 0775, true);
        }

        return $dir . '/' . md5($key) . '.json';
    }
}
