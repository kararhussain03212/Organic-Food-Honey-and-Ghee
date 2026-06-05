<?php

declare(strict_types=1);

namespace Backend\Utils;

final class Validator
{
    public static function required(array $data, array $fields): array
    {
        $errors = [];

        foreach ($fields as $field) {
            $value = $data[$field] ?? null;
            if ($value === null || (is_string($value) && trim($value) === '')) {
                $errors[$field] = sprintf('%s is required', $field);
            }
        }

        return $errors;
    }

    public static function email(?string $value): bool
    {
        return (bool) filter_var((string) $value, FILTER_VALIDATE_EMAIL);
    }

    public static function maxLength(?string $value, int $max): bool
    {
        return mb_strlen((string) $value) <= $max;
    }

    public static function sanitizeInput(array $input): array
    {
        $clean = [];

        foreach ($input as $key => $value) {
            if (is_string($value)) {
                $clean[$key] = trim(strip_tags($value));
                continue;
            }

            if (is_array($value)) {
                $clean[$key] = self::sanitizeInput($value);
                continue;
            }

            $clean[$key] = $value;
        }

        return $clean;
    }
}
