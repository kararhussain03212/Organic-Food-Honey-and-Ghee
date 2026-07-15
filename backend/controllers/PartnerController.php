<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Config\Database;
use Backend\Models\AffiliateApplication;
use Backend\Models\PartnerPageSetting;
use Backend\Utils\ActivityLogger;
use Backend\Utils\Cache;
use Backend\Utils\Response;
use Backend\Utils\Validator;

require_once __DIR__ . '/BaseController.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/PartnerPageSetting.php';
require_once __DIR__ . '/../models/AffiliateApplication.php';
require_once __DIR__ . '/../utils/ActivityLogger.php';
require_once __DIR__ . '/../utils/Cache.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

final class PartnerController extends BaseController
{
    private const APPLICATION_STATUSES = ['new', 'reviewed', 'approved', 'rejected'];

    /* ── Public: partner page settings ──────────────────────── */
    public function publicPage(array $params = []): void
    {
        $data = Cache::remember('public:partner:page', static function () {
            $model = new PartnerPageSetting();
            return $model->find(1) ?? [];
        }, 600);

        Response::success($data);
    }

    /* ── Admin: partner page settings ───────────────────────── */
    public function adminGetPage(array $params = []): void
    {
        $model = new PartnerPageSetting();
        Response::success($model->find(1) ?? []);
    }

    public function adminUpdatePage(array $params = []): void
    {
        $payload = Validator::sanitizeInput($this->body());

        // JSON columns arrive as arrays from the admin UI; encode for storage.
        foreach (['how_it_works', 'what_you_get', 'applicant_types'] as $jsonField) {
            if (isset($payload[$jsonField]) && is_array($payload[$jsonField])) {
                $payload[$jsonField] = json_encode($payload[$jsonField], JSON_UNESCAPED_UNICODE);
            }
        }

        $model = new PartnerPageSetting();
        $saved = $model->saveSingle($payload);

        ActivityLogger::log($this->currentAdminId(), 'update', 'partner_page_settings', 1);
        Cache::clearAll();
        Response::success($saved, 'Partner page settings updated');
    }

    /* ── Public: store affiliate application ────────────────── */
    public function storeApplication(array $params = []): void
    {
        $this->ensureRateLimit();

        $payload = Validator::sanitizeInput($this->body());

        $errors = [];
        $fullName = trim((string) ($payload['full_name'] ?? ''));
        $phone    = trim((string) ($payload['phone'] ?? ''));
        $city     = trim((string) ($payload['city'] ?? ''));
        $type     = trim((string) ($payload['applicant_type'] ?? ''));
        $reason   = trim((string) ($payload['reason'] ?? ''));
        $handle   = trim((string) ($payload['social_handle'] ?? ''));

        if ($fullName === '') {
            $errors['full_name'] = 'Full name is required.';
        }
        if ($phone === '') {
            $errors['phone'] = 'Phone/WhatsApp is required.';
        } elseif (!preg_match('/^[0-9+\-\s()]{7,20}$/', $phone)) {
            $errors['phone'] = 'A valid phone number is required.';
        }
        if ($city === '') {
            $errors['city'] = 'City is required.';
        }
        if ($type === '') {
            $errors['applicant_type'] = 'Applicant type is required.';
        } elseif (!in_array($type, $this->allowedApplicantTypes(), true)) {
            $errors['applicant_type'] = 'Invalid applicant type.';
        }
        if ($reason === '') {
            $errors['reason'] = 'Please tell us why you want to join.';
        }

        if ($errors !== []) {
            Response::error('Validation failed', 422, ['fields' => $errors]);
        }

        $model = new AffiliateApplication();
        $model->create([
            'full_name'      => $fullName,
            'phone'          => $phone,
            'city'           => $city,
            'social_handle'  => $handle !== '' ? $handle : null,
            'applicant_type' => $type,
            'reason'         => $reason,
            'status'         => 'new',
        ]);

        $this->sendMailNotification($fullName, $phone, $city, $handle, $type, $reason);

        Response::success(null, 'Application submitted successfully');
    }

    /* ── Admin: applications inbox ──────────────────────────── */
    public function adminIndexApplications(array $params = []): void
    {
        $query = $this->query();

        $page    = max(1, (int) ($query['page'] ?? 1));
        $perPage = max(1, min(100, (int) ($query['per_page'] ?? 20)));
        $status  = (string) ($query['status'] ?? '');
        $type    = (string) ($query['applicant_type'] ?? '');

        $where = [];
        $bind  = [];

        if ($status !== '' && in_array($status, self::APPLICATION_STATUSES, true)) {
            $where[]         = 'status = :status';
            $bind[':status'] = $status;
        }
        if ($type !== '') {
            $where[]       = 'applicant_type = :type';
            $bind[':type'] = $type;
        }

        $pdo      = Database::connection();
        $whereSql = $where !== [] ? 'WHERE ' . implode(' AND ', $where) : '';

        $countStmt = $pdo->prepare("SELECT COUNT(*) AS aggregate FROM affiliate_applications {$whereSql}");
        $countStmt->execute($bind);
        $total = (int) (($countStmt->fetch())['aggregate'] ?? 0);

        $offset   = ($page - 1) * $perPage;
        $dataStmt = $pdo->prepare(
            "SELECT * FROM affiliate_applications {$whereSql} ORDER BY created_at DESC, id DESC LIMIT :limit OFFSET :offset"
        );
        foreach ($bind as $key => $value) {
            $dataStmt->bindValue($key, $value);
        }
        $dataStmt->bindValue(':limit', $perPage, \PDO::PARAM_INT);
        $dataStmt->bindValue(':offset', $offset, \PDO::PARAM_INT);
        $dataStmt->execute();
        $data = $dataStmt->fetchAll() ?: [];

        Response::success([
            'data' => $data,
            'meta' => [
                'page'        => $page,
                'per_page'    => $perPage,
                'total'       => $total,
                'total_pages' => (int) ceil($total / $perPage),
            ],
        ], 'Fetched successfully');
    }

    public function adminUpdateApplication(array $params): void
    {
        $id = (int) ($params['id'] ?? 0);
        if ($id <= 0) {
            Response::error('Invalid ID', 422);
        }

        $status = trim((string) ($this->body()['status'] ?? ''));
        if (!in_array($status, self::APPLICATION_STATUSES, true)) {
            Response::error('Invalid status. Allowed: ' . implode(', ', self::APPLICATION_STATUSES), 422);
        }

        $model = new AffiliateApplication();
        if (!$model->find($id)) {
            Response::error('Application not found', 404);
        }

        $model->updateStatus($id, $status);
        ActivityLogger::log($this->currentAdminId(), 'update', 'affiliate_applications', $id);

        Response::success($model->find($id), 'Status updated');
    }

    public function adminDeleteApplication(array $params): void
    {
        $id = (int) ($params['id'] ?? 0);
        if ($id <= 0) {
            Response::error('Invalid ID', 422);
        }

        $model = new AffiliateApplication();
        if (!$model->find($id)) {
            Response::error('Application not found', 404);
        }

        $model->delete($id);
        ActivityLogger::log($this->currentAdminId(), 'delete', 'affiliate_applications', $id);

        Response::success(null, 'Deleted successfully');
    }

    /* ── Helpers ─────────────────────────────────────────────── */

    private function allowedApplicantTypes(): array
    {
        $settings = (new PartnerPageSetting())->find(1);
        $configured = $settings['applicant_types'] ?? null;

        if (is_string($configured)) {
            $configured = json_decode($configured, true);
        }
        if (is_array($configured) && $configured !== []) {
            return array_map('strval', $configured);
        }

        return ['Individual', 'Reseller', 'Influencer', 'Fitness/Wellness Coach'];
    }

    private function ensureRateLimit(): void
    {
        $path = dirname(__DIR__) . '/storage/affiliate_rate_limit.json';
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $now = time();
        $window = 300;
        $maxAttempts = 3;

        if (!is_file($path)) {
            file_put_contents($path, json_encode([], JSON_UNESCAPED_SLASHES));
        }

        $raw = file_get_contents($path) ?: '[]';
        $state = json_decode($raw, true);
        if (!is_array($state)) {
            $state = [];
        }

        $entries = array_filter($state[$ip] ?? [], static fn ($timestamp): bool => ($now - (int) $timestamp) <= $window);

        if (count($entries) >= $maxAttempts) {
            Response::error('Too many submissions. Please try again in a few minutes.', 429);
        }

        $entries[] = $now;
        $state[$ip] = array_values($entries);

        file_put_contents($path, json_encode($state, JSON_UNESCAPED_SLASHES));
    }

    private function sendMailNotification(string $fullName, string $phone, string $city, string $handle, string $type, string $reason): void
    {
        $autoloadCandidates = [
            __DIR__ . '/../../vendor/autoload.php',
            __DIR__ . '/../../../vendor/autoload.php',
            __DIR__ . '/../vendor/autoload.php',
        ];
        $autoloadPath = null;
        foreach ($autoloadCandidates as $candidate) {
            if (file_exists($candidate)) {
                $autoloadPath = $candidate;
                break;
            }
        }

        $configCandidates = [
            __DIR__ . '/../../public/api/mail-config.php',
            __DIR__ . '/../../api/mail-config.php',
            __DIR__ . '/../../../public/api/mail-config.php',
            __DIR__ . '/../../../api/mail-config.php',
        ];
        $configPath = null;
        foreach ($configCandidates as $candidate) {
            if (file_exists($candidate)) {
                $configPath = $candidate;
                break;
            }
        }

        if ($autoloadPath === null || $configPath === null) {
            return; // Email is best-effort; the application is already stored.
        }

        require_once $autoloadPath;
        $config = require $configPath;

        try {
            $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
            $mail->isSMTP();
            $mail->Host     = (string) $config['smtp_host'];
            $mail->Port     = (int) $config['smtp_port'];
            $mail->SMTPAuth = true;
            $mail->Username = (string) $config['smtp_user'];
            $mail->Password = (string) $config['smtp_pass'];
            $mail->Timeout  = (int) ($config['smtp_timeout'] ?? 20);

            $secure = strtolower((string) ($config['smtp_secure'] ?? 'ssl'));
            $mail->SMTPSecure = $secure === 'tls'
                ? \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS
                : \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;

            $mail->CharSet = 'UTF-8';
            $mail->setFrom((string) $config['from_email'], (string) $config['from_name']);
            $mail->addAddress((string) $config['to_email'], (string) $config['to_name']);
            $mail->isHTML(true);
            $mail->Subject = '[Affiliate Application] ' . $fullName . ' — ' . $type;

            $safe = static fn (string $v): string => htmlspecialchars($v, ENT_QUOTES, 'UTF-8');
            $mail->Body = '
                <h2>New Affiliate Application</h2>
                <p><strong>Name:</strong> ' . $safe($fullName) . '</p>
                <p><strong>Phone:</strong> ' . $safe($phone) . '</p>
                <p><strong>City:</strong> ' . $safe($city) . '</p>
                <p><strong>Social handle:</strong> ' . $safe($handle !== '' ? $handle : 'Not provided') . '</p>
                <p><strong>Applying as:</strong> ' . $safe($type) . '</p>
                <p><strong>Why join:</strong></p>
                <p>' . nl2br($safe($reason)) . '</p>
            ';
            $mail->AltBody = "Name: {$fullName}\nPhone: {$phone}\nCity: {$city}\nHandle: " . ($handle !== '' ? $handle : 'Not provided') . "\nApplying as: {$type}\n\nWhy join:\n{$reason}";
            $mail->send();
        } catch (\Throwable $e) {
            @file_put_contents(
                __DIR__ . '/../storage/mail-err.log',
                '[' . date('Y-m-d H:i:s') . '] Affiliate mail error: ' . $e->getMessage() . PHP_EOL,
                FILE_APPEND
            );
        }
    }
}
