<?php

declare(strict_types=1);

namespace Backend\Utils;

final class Response
{
    public static function success($data = null, string $message = 'Operation successful', int $status = 200): void
    {
        self::send([
            'success' => true,
            'data' => $data,
            'message' => $message,
        ], $status);
    }

    public static function error(string $error, int $code = 400, array $extra = []): void
    {
        self::send(array_merge([
            'success' => false,
            'error' => $error,
            'code' => $code,
        ], $extra), $code);
    }

    public static function json(array $payload, int $status = 200): void
    {
        self::send($payload, $status);
    }

    private static function sanitizeForOutput($value)
    {
        if (is_array($value)) {
            $safe = [];
            foreach ($value as $k => $v) {
                $safe[$k] = self::sanitizeForOutput($v);
            }
            return $safe;
        }

        if (is_string($value)) {
            return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        }

        return $value;
    }

    private static function send(array $payload, int $status): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
}
