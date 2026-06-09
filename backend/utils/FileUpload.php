<?php

declare(strict_types=1);

namespace Backend\Utils;

use RuntimeException;

final class FileUpload
{
    private const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'svg', 'mp4', 'webm', 'mov', 'avi', 'mkv', 'flv', 'm4v'];
    private const ALLOWED_MIME = [
        'image/jpeg',
        'image/pjpeg',
        'image/png',
        'image/webp',
        'image/avif',
        'image/svg+xml',
        'text/xml',
        'application/xml',
        'application/octet-stream',
        'video/mp4',
        'video/webm',
        'video/quicktime',
        'video/x-msvideo',
        'video/x-matroska',
        'video/x-flv',
        'video/mp4',
    ];
    private const MAX_SIZE = 104857600;
    private const ALLOWED_FOLDERS = [
        'misc',
        'hero',
        'products',
        'blogs',
        'testimonials',
        'settings',
        'icons',
        'profiles',
    ];
    private const WEBP_QUALITY = 82;

    public static function upload(array $file, string $folder, ?string $oldPath = null): array
    {
        $errorCode = (int) ($file['error'] ?? UPLOAD_ERR_NO_FILE);
        if ($errorCode !== UPLOAD_ERR_OK) {
            if ($errorCode === UPLOAD_ERR_INI_SIZE || $errorCode === UPLOAD_ERR_FORM_SIZE) {
                Response::error('File exceeds server upload limit', 422);
            }
            if ($errorCode === UPLOAD_ERR_NO_FILE) {
                Response::error('file is required', 422);
            }
            Response::error('Upload failed with code: ' . $errorCode, 422);
        }

        $size = (int) ($file['size'] ?? 0);
        if ($size > self::MAX_SIZE) {
            Response::error('File exceeds 100MB size limit', 422);
        }

        $name = (string) ($file['name'] ?? '');
        $tmpPath = (string) ($file['tmp_name'] ?? '');
        $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
        if (!in_array($ext, self::ALLOWED_EXTENSIONS, true)) {
            Response::error('Invalid file extension. Allowed: jpg, jpeg, png, webp, avif, svg, mp4, webm, mov, avi, mkv, flv, m4v', 422);
        }

        if ($tmpPath === '' || !is_file($tmpPath)) {
            Response::error('Uploaded file is missing from temporary storage', 422);
        }

        $mime = mime_content_type($tmpPath) ?: '';
        if (!in_array($mime, self::ALLOWED_MIME, true)) {
            Response::error('Invalid file type: ' . $mime, 422);
        }

        $folder = strtolower(trim($folder, '/'));
        if (!in_array($folder, self::ALLOWED_FOLDERS, true)) {
            $folder = 'misc';
        }

        $dir = dirname(__DIR__) . '/uploads';
        if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
            Response::error('Unable to create upload directory', 500);
        }

        $isVideo = self::isVideoFile($ext);
        $canConvertToWebp = !$isVideo && self::isWebpAvailable();
        $targetExt = $canConvertToWebp ? 'webp' : $ext;
        $newName = uniqid($isVideo ? 'vid_' : 'img_', true) . '.' . $targetExt;
        $target = $dir . '/' . $newName;
        $actualMime = $canConvertToWebp ? 'image/webp' : $mime;

        if ($canConvertToWebp) {
            try {
                self::convertTempImageToWebp($tmpPath, $target);
                @unlink($tmpPath);
            } catch (RuntimeException $e) {
                $targetExt = $ext;
                $newName = uniqid('img_', true) . '.' . $targetExt;
                $target = $dir . '/' . $newName;
                $actualMime = $mime;
                if (!move_uploaded_file($tmpPath, $target)) {
                    Response::error('Failed to save file', 500);
                }
            }
        } else {
            if (!move_uploaded_file($tmpPath, $target)) {
                Response::error('Failed to save file', 500);
            }
        }

        if (is_string($oldPath) && trim($oldPath) !== '') {
            self::deleteExistingUpload($oldPath);
        }

        return [
            'filename' => $newName,
            'path' => '/uploads/' . $newName,
            'size' => (int) (filesize($target) ?: 0),
            'mime' => $actualMime,
        ];
    }

    private static function isVideoFile(string $ext): bool
    {
        $videoExtensions = ['mp4', 'webm', 'mov', 'avi', 'mkv', 'flv', 'm4v'];
        return in_array(strtolower($ext), $videoExtensions, true);
    }

    private static function isWebpAvailable(): bool
    {
        $gdReady = function_exists('imagewebp') && function_exists('imagecreatefromstring');
        $imagickReady = class_exists('Imagick');
        return $gdReady || $imagickReady;
    }

    private static function convertTempImageToWebp(string $sourcePath, string $targetPath): void
    {
        $gdReady = function_exists('imagewebp') && function_exists('imagecreatefromstring');
        if ($gdReady) {
            self::convertWithGd($sourcePath, $targetPath);
            return;
        }

        if (class_exists('Imagick')) {
            self::convertWithImagick($sourcePath, $targetPath);
            return;
        }

        throw new RuntimeException('WebP conversion is unavailable on server.');
    }

    private static function convertWithGd(string $sourcePath, string $targetPath): void
    {
        $bytes = @file_get_contents($sourcePath);
        if ($bytes === false) {
            throw new RuntimeException('Failed to read uploaded file for conversion.');
        }

        $image = @imagecreatefromstring($bytes);
        if ($image === false) {
            throw new RuntimeException('Uploaded image format is not supported for WebP conversion.');
        }
        if (function_exists('imagepalettetotruecolor')) {
            @imagepalettetotruecolor($image);
        }
        imagealphablending($image, true);
        imagesavealpha($image, true);

        if (!@imagewebp($image, $targetPath, self::WEBP_QUALITY)) {
            imagedestroy($image);
            throw new RuntimeException('Failed to convert image to WebP.');
        }

        imagedestroy($image);
    }

    private static function convertWithImagick(string $sourcePath, string $targetPath): void
    {
        try {
            $img = new \Imagick($sourcePath);
            $img->setImageFormat('webp');
            $img->setImageCompressionQuality(self::WEBP_QUALITY);
            $img->stripImage();
            if (!$img->writeImage($targetPath)) {
                $img->clear();
                $img->destroy();
                throw new RuntimeException('Failed to convert image to WebP.');
            }
            $img->clear();
            $img->destroy();
        } catch (\Throwable $e) {
            throw new RuntimeException('WebP conversion failed: ' . $e->getMessage());
        }
    }

    private static function deleteExistingUpload(string $oldPath): void
    {
        $path = parse_url(trim($oldPath), PHP_URL_PATH);
        if (!is_string($path) || $path === '' || !self::startsWith($path, '/uploads/')) {
            return;
        }

        $relative = ltrim(substr($path, strlen('/uploads/')), '/');
        if ($relative === '') {
            return;
        }

        $uploadsRoot = realpath(dirname(__DIR__) . '/uploads');
        if ($uploadsRoot === false) {
            return;
        }

        $target = realpath($uploadsRoot . '/' . $relative);
        if ($target === false) {
            return;
        }

        $normalizedRoot = str_replace('\\', '/', $uploadsRoot);
        $normalizedTarget = str_replace('\\', '/', $target);
        if (!self::startsWith($normalizedTarget, $normalizedRoot . '/')) {
            return;
        }

        if (is_file($target)) {
            @unlink($target);
        }
    }

    private static function startsWith(string $haystack, string $needle): bool
    {
        if ($needle === '') {
            return true;
        }

        return strncmp($haystack, $needle, strlen($needle)) === 0;
    }
}
