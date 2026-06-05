<?php

declare(strict_types=1);

namespace Backend\Utils;

final class UploadPath
{
    public static function resolvePublicPath(?string $path): ?string
    {
        if (!is_string($path)) {
            return $path;
        }

        $trimmed = trim($path);
        if ($trimmed === '' || !self::startsWith($trimmed, '/uploads/')) {
            return $path;
        }

        $uploadsRoot = realpath(dirname(__DIR__) . '/uploads');
        if ($uploadsRoot === false) {
            return $path;
        }

        $relative = ltrim(substr($trimmed, strlen('/uploads/')), '/');
        if ($relative === '') {
            return $path;
        }

        $candidate = $uploadsRoot . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relative);
        if (is_file($candidate)) {
            return $trimmed;
        }

        $basename = basename($relative);
        if ($basename === '') {
            return $path;
        }

        $found = self::findByBasename($uploadsRoot, $basename);
        if ($found === null) {
            return $path;
        }

        $normalizedRoot = str_replace('\\', '/', $uploadsRoot);
        $normalizedFound = str_replace('\\', '/', $found);
        $publicRelative = ltrim(substr($normalizedFound, strlen($normalizedRoot)), '/');

        if ($publicRelative === '') {
            return $path;
        }

        return '/uploads/' . $publicRelative;
    }

    public static function normalizeJsonUploadPaths(string $json): string
    {
        $decoded = json_decode($json, true);
        if (!is_array($decoded)) {
            return $json;
        }

        $normalized = self::normalizeMixed($decoded);
        $reencoded = json_encode($normalized, JSON_UNESCAPED_SLASHES);

        return is_string($reencoded) ? $reencoded : $json;
    }

    public static function normalizeMixed($value)
    {
        if (is_string($value)) {
            return self::resolvePublicPath($value) ?? $value;
        }

        if (!is_array($value)) {
            return $value;
        }

        foreach ($value as $key => $item) {
            $value[$key] = self::normalizeMixed($item);
        }

        return $value;
    }

    private static function findByBasename(string $uploadsRoot, string $basename): ?string
    {
        try {
            $iterator = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($uploadsRoot, \FilesystemIterator::SKIP_DOTS)
            );
            foreach ($iterator as $file) {
                if (!$file->isFile()) {
                    continue;
                }
                if (strcasecmp($file->getFilename(), $basename) === 0) {
                    return $file->getPathname();
                }
            }
        } catch (\Throwable $e) {
            return null;
        }

        return null;
    }

    private static function startsWith(string $haystack, string $needle): bool
    {
        if ($needle === '') {
            return true;
        }

        return strncmp($haystack, $needle, strlen($needle)) === 0;
    }
}
