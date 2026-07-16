<?php

declare(strict_types=1);

namespace Backend\Config;

require_once __DIR__ . '/env.php';

final class Mail
{
    public static function getConfig(): array
    {
        return [
            'host' => Env::get('MAIL_HOST', 'smtp.gmail.com'),
            'port' => (int) Env::get('MAIL_PORT', '587'),
            'username' => Env::get('MAIL_USERNAME', ''),
            'password' => Env::get('MAIL_PASSWORD', ''),
            'from_address' => Env::get('MAIL_FROM_ADDRESS', 'noreply@arionorganicfood.com'),
            'from_name' => Env::get('MAIL_FROM_NAME', 'Arion Organic Foods'),
            'encryption' => Env::get('MAIL_ENCRYPTION', 'tls'),
        ];
    }
}
