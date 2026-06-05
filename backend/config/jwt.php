<?php

declare(strict_types=1);

namespace Backend\Config;

require_once __DIR__ . '/env.php';

final class JwtConfig
{
    public static function secret(): string
    {
        Env::load(dirname(__DIR__) . '/.env');
        return Env::get('JWT_SECRET', 'change-me-in-production') ?? 'change-me-in-production';
    }

    public static function issuer(): string
    {
        Env::load(dirname(__DIR__) . '/.env');
        return Env::get('JWT_ISSUER', 'honey-ghee-cms') ?? 'honey-ghee-cms';
    }

    public static function expiresInSeconds(): int
    {
        Env::load(dirname(__DIR__) . '/.env');
        return (int) (Env::get('JWT_EXP_SECONDS', '86400') ?? '86400');
    }
}
