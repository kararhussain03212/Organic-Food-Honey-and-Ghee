<?php

declare(strict_types=1);

namespace Backend\Utils;

use Backend\Config\JwtConfig;
use Exception;

require_once __DIR__ . '/../config/jwt.php';

final class Jwt
{
    public static function encode(array $payload): string
    {
        $header = ['alg' => 'HS256', 'typ' => 'JWT'];

        $payload = array_merge([
            'iss' => JwtConfig::issuer(),
            'iat' => time(),
            'exp' => time() + JwtConfig::expiresInSeconds(),
        ], $payload);

        $segments = [
            self::base64UrlEncode(json_encode($header, JSON_UNESCAPED_SLASHES)),
            self::base64UrlEncode(json_encode($payload, JSON_UNESCAPED_SLASHES)),
        ];

        $signature = hash_hmac('sha256', implode('.', $segments), JwtConfig::secret(), true);
        $segments[] = self::base64UrlEncode($signature);

        return implode('.', $segments);
    }

    public static function decode(string $token): array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            throw new Exception('Invalid token format');
        }

        [$header64, $payload64, $signature64] = $parts;

        $rawSignature = self::base64UrlDecode($signature64);
        $expected = hash_hmac('sha256', $header64 . '.' . $payload64, JwtConfig::secret(), true);

        if (!hash_equals($expected, $rawSignature)) {
            throw new Exception('Invalid token signature');
        }

        $payload = json_decode(self::base64UrlDecode($payload64), true);

        if (!is_array($payload)) {
            throw new Exception('Invalid token payload');
        }

        if (($payload['iss'] ?? '') !== JwtConfig::issuer()) {
            throw new Exception('Invalid token issuer');
        }

        if ((int) ($payload['exp'] ?? 0) <= time()) {
            throw new Exception('Token expired');
        }

        return $payload;
    }

    private static function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): string
    {
        $remainder = strlen($data) % 4;
        if ($remainder > 0) {
            $data .= str_repeat('=', 4 - $remainder);
        }

        return base64_decode(strtr($data, '-_', '+/')) ?: '';
    }
}
