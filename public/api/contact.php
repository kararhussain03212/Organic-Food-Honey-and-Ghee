<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$configPath = __DIR__ . '/mail-config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'Mail config missing. Create public/api/mail-config.php from mail-config.sample.php',
    ]);
    exit;
}

$config = require $configPath;

$raw = file_get_contents('php://input');
$data = json_decode($raw ?: '{}', true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON payload']);
    exit;
}

$name = trim((string)($data['name'] ?? ''));
$email = trim((string)($data['email'] ?? ''));
$phone = trim((string)($data['phone'] ?? ''));
$subject = trim((string)($data['subject'] ?? ''));
$message = trim((string)($data['message'] ?? ''));

if ($name === '' || $email === '' || $subject === '' || $message === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Missing required fields']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid email address']);
    exit;
}

$autoloadCandidates = [
    __DIR__ . '/../vendor/autoload.php',    // cPanel/public_html layout
    __DIR__ . '/../../vendor/autoload.php', // local fallback
];
$autoloadPath = null;
foreach ($autoloadCandidates as $candidate) {
    if (file_exists($candidate)) {
        $autoloadPath = $candidate;
        break;
    }
}
if ($autoloadPath === null) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'PHPMailer autoload not found. Checked: ' . implode(' | ', $autoloadCandidates),
    ]);
    exit;
}

require $autoloadPath;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function appendMailLog(string $fileName, string $line): void
{
    $path = dirname(__DIR__) . DIRECTORY_SEPARATOR . $fileName;
    $ts = date('Y-m-d H:i:s');
    @file_put_contents($path, "[{$ts}] {$line}" . PHP_EOL, FILE_APPEND);
}

try {
    $mail = new PHPMailer(true);
    $adminSent = false;
    $autoReplySent = false;
    $autoReplyError = null;
    $adminMessageId = '';
    $autoReplyMessageId = '';

    $mail->isSMTP();
    $mail->Host = (string)$config['smtp_host'];
    $mail->Port = (int)$config['smtp_port'];
    $mail->SMTPAuth = true;
    $mail->Username = (string)$config['smtp_user'];
    $mail->Password = (string)$config['smtp_pass'];
    $mail->Timeout = (int)($config['smtp_timeout'] ?? 20);
    $mail->SMTPKeepAlive = true;

    $secure = strtolower((string)($config['smtp_secure'] ?? 'ssl'));
    if ($secure === 'tls') {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    } else {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    }
    // Enable SMTP transcript logging when explicitly requested.
    if (!empty($config['smtp_debug'])) {
        $mail->SMTPDebug = 2;
        $mail->Debugoutput = static function (string $str, $level): void {
            appendMailLog('smtp-out.log', '[SMTP:' . (string)$level . '] ' . $str);
        };
    }

    $mail->CharSet = 'UTF-8';
    $mail->setFrom((string)$config['from_email'], (string)$config['from_name']);
    $mail->addAddress((string)$config['to_email'], (string)$config['to_name']);
    $mail->addReplyTo($email, $name);

    $mail->isHTML(true);
    $mail->Subject = '[Contact Form] ' . $subject;

    $safeMessage = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));
    $safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $safeEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
    $safePhone = htmlspecialchars($phone !== '' ? $phone : 'N/A', ENT_QUOTES, 'UTF-8');

    $mail->Body = "
        <h2>New Contact Form Message</h2>
        <p><strong>Name:</strong> {$safeName}</p>
        <p><strong>Email:</strong> {$safeEmail}</p>
        <p><strong>Phone:</strong> {$safePhone}</p>
        <p><strong>Subject:</strong> " . htmlspecialchars($subject, ENT_QUOTES, 'UTF-8') . "</p>
        <p><strong>Message:</strong></p>
        <p>{$safeMessage}</p>
    ";

    $mail->AltBody = "Name: {$name}\nEmail: {$email}\nPhone: " . ($phone !== '' ? $phone : 'N/A') . "\nSubject: {$subject}\n\nMessage:\n{$message}";

    $mail->send();
    $adminSent = true;
    $adminMessageId = trim((string)$mail->getLastMessageID());
    appendMailLog(
        'smtp-out.log',
        'Mail accepted by SMTP server. message_id=' . $adminMessageId .
        '; to=' . (string)$config['to_email'] .
        '; from=' . (string)$config['from_email'] .
        '; reply_to=' . $email .
        '; subject=' . $subject
    );

    // Optional auto-reply to the user who submitted the form (same SMTP connection).
    $mail->clearAllRecipients();
    $mail->clearReplyTos();
    $mail->addAddress($email, $name);
    $mail->Subject = 'We received your message - Swift Sign Organic Foods';
    $mail->Body = "
        <h2>Thank you for contacting us</h2>
        <p>Hi " . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . ",</p>
        <p>We received your message and our team will get back to you soon.</p>
        <p><strong>Your subject:</strong> " . htmlspecialchars($subject, ENT_QUOTES, 'UTF-8') . "</p>
        <p>Best regards,<br>Swift Sign Organic Foods</p>
    ";
    $mail->AltBody = "Hi {$name},\n\nWe received your message and our team will get back to you soon.\nSubject: {$subject}\n\nBest regards,\nSwift Sign Organic Foods";
    try {
        $mail->send();
        $autoReplySent = true;
        $autoReplyMessageId = trim((string)$mail->getLastMessageID());
        appendMailLog(
            'smtp-out.log',
            'Auto-reply accepted by SMTP server. message_id=' . $autoReplyMessageId .
            '; to=' . $email
        );
    } catch (Exception $ackEx) {
        $autoReplyError = $mail->ErrorInfo !== '' ? $mail->ErrorInfo : $ackEx->getMessage();
        appendMailLog('smtp-err.log', 'Auto-reply failed: ' . $mail->ErrorInfo . '; exception=' . $ackEx->getMessage());
    }
    $mail->smtpClose();

    echo json_encode([
        'ok' => true,
        'admin_sent' => $adminSent,
        'admin_message_id' => $adminMessageId,
        'autoreply_sent' => $autoReplySent,
        'autoreply_message_id' => $autoReplyMessageId,
        'autoreply_error' => $autoReplyError,
    ]);
} catch (\Throwable $e) {
    appendMailLog('smtp-err.log', 'PHPMailer error: ' . $mail->ErrorInfo . '; exception=' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'Email send failed: ' . ($mail->ErrorInfo !== '' ? $mail->ErrorInfo : $e->getMessage()),
    ]);
}
