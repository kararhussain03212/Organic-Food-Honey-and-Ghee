<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Config\Database;
use Backend\Models\ContactMessage;
use Backend\Models\ContactPageSetting;
use Backend\Utils\Cache;
use Backend\Utils\Response;
use Backend\Utils\Validator;

require_once __DIR__ . '/BaseController.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/ContactMessage.php';
require_once __DIR__ . '/../models/ContactPageSetting.php';
require_once __DIR__ . '/../utils/Cache.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

final class ContactController extends BaseController
{
    /* ── Public: contact page settings ─────────────────────── */
    public function publicContactPage(array $params = []): void
    {
        $data = Cache::remember('public:contact:page', function () {
            $model = new ContactPageSetting();
            return $model->find(1) ?? [];
        }, 600);

        Response::success($data);
    }

    /* ── Admin: get contact page settings ───────────────────── */
    public function adminGetContactPage(array $params = []): void
    {
        $model = new ContactPageSetting();
        Response::success($model->find(1) ?? []);
    }

    /* ── Admin: update contact page settings ────────────────── */
    public function adminUpdateContactPage(array $params = []): void
    {
        $payload = Validator::sanitizeInput($this->body());
        $model   = new ContactPageSetting();
        $saved   = $model->saveSingle($payload);

        Cache::clearAll();
        Response::success($saved, 'Contact page settings updated');
    }

    /* ── Public: store contact message ─────────────────────── */
    public function store(array $params = []): void
    {
        $payload = Validator::sanitizeInput($this->body());

        $errors = [];
        if (empty(trim((string) ($payload['name'] ?? '')))) {
            $errors['name'] = 'Name is required.';
        }
        $email = trim((string) ($payload['email'] ?? ''));
        if ($email === '') {
            $errors['email'] = 'Email is required.';
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'A valid email address is required.';
        }
        if (empty(trim((string) ($payload['subject'] ?? '')))) {
            $errors['subject'] = 'Subject is required.';
        }
        $message = trim((string) ($payload['message'] ?? ''));
        if ($message === '') {
            $errors['message'] = 'Message is required.';
        } elseif (mb_strlen($message) < 10) {
            $errors['message'] = 'Message must be at least 10 characters.';
        }

        if ($errors !== []) {
            Response::error('Validation failed', 422, ['fields' => $errors]);
        }

        $name    = trim((string) ($payload['name'] ?? ''));
        $phone   = trim((string) ($payload['phone'] ?? ''));
        $subject = trim((string) ($payload['subject'] ?? ''));

        $model = new ContactMessage();
        $model->create([
            'name'    => $name,
            'email'   => $email,
            'phone'   => $phone,
            'subject' => $subject,
            'message' => $message,
            'status'  => 'unread',
        ]);

        $this->sendMailNotification($name, $email, $phone, $subject, $message);

        Response::success(null, 'Message sent successfully');
    }

    private function sendMailNotification(string $name, string $email, string $phone, string $subject, string $message): void
    {
        $autoloadCandidates = [
            __DIR__ . '/../../vendor/autoload.php',    // local: project-root/vendor
            __DIR__ . '/../../../vendor/autoload.php', // cPanel: public_html/vendor (backend one level deeper)
            __DIR__ . '/../vendor/autoload.php',       // vendor inside backend/
        ];
        $autoloadPath = null;
        foreach ($autoloadCandidates as $candidate) {
            if (file_exists($candidate)) {
                $autoloadPath = $candidate;
                break;
            }
        }
        if ($autoloadPath === null) {
            $this->logMailFailure('PHPMailer autoload not found. Checked: ' . implode(' | ', $autoloadCandidates));
            return;
        }

        $configCandidates = [
            __DIR__ . '/../../public/api/mail-config.php',    // local: project-root/public/api
            __DIR__ . '/../../api/mail-config.php',           // cPanel: public_html/api (sibling of backend/)
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
        if ($configPath === null) {
            $this->logMailFailure('mail-config.php not found. Checked: ' . implode(' | ', $configCandidates));
            return;
        }

        require_once $autoloadPath;
        $config = require $configPath;

        try {
            $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
            $mail->isSMTP();
            $mail->Host       = (string) $config['smtp_host'];
            $mail->Port       = (int) $config['smtp_port'];
            $mail->SMTPAuth   = true;
            $mail->Username   = (string) $config['smtp_user'];
            $mail->Password   = (string) $config['smtp_pass'];
            $mail->Timeout    = (int) ($config['smtp_timeout'] ?? 20);
            $mail->SMTPKeepAlive = true;

            $secure = strtolower((string) ($config['smtp_secure'] ?? 'ssl'));
            $mail->SMTPSecure = $secure === 'tls'
                ? \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS
                : \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;

            $mail->CharSet = 'UTF-8';
            $mail->setFrom((string) $config['from_email'], (string) $config['from_name']);
            $mail->addAddress((string) $config['to_email'], (string) $config['to_name']);
            $mail->addReplyTo($email, $name);
            $mail->isHTML(true);
            $mail->Subject = '[Contact Form] ' . $subject;

            $safeMessage = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));
            $safeName    = htmlspecialchars($name,    ENT_QUOTES, 'UTF-8');
            $safeEmail   = htmlspecialchars($email,   ENT_QUOTES, 'UTF-8');
            $safePhone   = htmlspecialchars($phone !== '' ? $phone : 'N/A', ENT_QUOTES, 'UTF-8');
            $safeSubject = htmlspecialchars($subject, ENT_QUOTES, 'UTF-8');

            $mail->Body = "
                <h2>New Contact Form Message</h2>
                <p><strong>Name:</strong> {$safeName}</p>
                <p><strong>Email:</strong> {$safeEmail}</p>
                <p><strong>Phone:</strong> {$safePhone}</p>
                <p><strong>Subject:</strong> {$safeSubject}</p>
                <p><strong>Message:</strong></p>
                <p>{$safeMessage}</p>
            ";
            $mail->AltBody = "Name: {$name}\nEmail: {$email}\nPhone: " . ($phone !== '' ? $phone : 'N/A') . "\nSubject: {$subject}\n\nMessage:\n{$message}";
            $mail->send();

            // Auto-reply to sender
            $mail->clearAllRecipients();
            $mail->clearReplyTos();
            $mail->addAddress($email, $name);
            $mail->Subject  = 'We received your message - Swift Sign Organic Foods';
            $mail->Body     = "
                <h2>Thank you for contacting us</h2>
                <p>Hi {$safeName},</p>
                <p>We received your message and our team will get back to you soon.</p>
                <p><strong>Your subject:</strong> {$safeSubject}</p>
                <p>Best regards,<br>Swift Sign Organic Foods</p>
            ";
            $mail->AltBody = "Hi {$name},\n\nWe received your message and our team will get back to you soon.\nSubject: {$subject}\n\nBest regards,\nSwift Sign Organic Foods";
            try { $mail->send(); } catch (\Throwable $e) { /* auto-reply failure is non-fatal */ }
            $mail->smtpClose();
        } catch (\Throwable $e) {
            // Email failure is non-fatal — message is already saved to DB
            $this->logMailFailure('PHPMailer error: ' . $e->getMessage());
        }
    }

    private function logMailFailure(string $line): void
    {
        $path = __DIR__ . '/../storage/mail-err.log';
        @file_put_contents($path, '[' . date('Y-m-d H:i:s') . '] ' . $line . PHP_EOL, FILE_APPEND);
    }

    public function index(array $params = []): void
    {
        $query = $this->query();

        $page    = max(1, (int) ($query['page'] ?? 1));
        $perPage = max(1, min(100, (int) ($query['per_page'] ?? 20)));
        $status  = $query['status'] ?? '';

        $where = [];
        $bind  = [];

        if ($status !== '' && \in_array($status, ['unread', 'read', 'replied'], true)) {
            $where[]         = 'status = :status';
            $bind[':status'] = $status;
        }

        $pdo      = Database::connection();
        $whereSql = $where !== [] ? 'WHERE ' . implode(' AND ', $where) : '';

        $countStmt = $pdo->prepare("SELECT COUNT(*) AS aggregate FROM contact_messages {$whereSql}");
        $countStmt->execute($bind);
        $total = (int) (($countStmt->fetch())['aggregate'] ?? 0);

        $offset   = ($page - 1) * $perPage;
        $dataStmt = $pdo->prepare(
            "SELECT * FROM contact_messages {$whereSql} ORDER BY created_at DESC LIMIT :limit OFFSET :offset"
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

    public function markRead(array $params): void
    {
        $id = (int) ($params['id'] ?? 0);
        if ($id <= 0) {
            Response::error('Invalid ID', 422);
        }

        $model = new ContactMessage();
        $model->markRead($id);

        Response::success(null, 'Marked as read');
    }

    public function destroy(array $params): void
    {
        $id = (int) ($params['id'] ?? 0);
        if ($id <= 0) {
            Response::error('Invalid ID', 422);
        }

        $model = new ContactMessage();
        $model->delete($id);

        Response::success(null, 'Deleted successfully');
    }
}
