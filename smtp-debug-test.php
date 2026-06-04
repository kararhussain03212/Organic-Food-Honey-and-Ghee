<?php
$config = require __DIR__ . '/public/api/mail-config.php';
require __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;

$mail = new PHPMailer(true);
$mail->isSMTP();
$mail->Host = $config['smtp_host'];
$mail->Port = (int)$config['smtp_port'];
$mail->SMTPAuth = true;
$mail->Username = $config['smtp_user'];
$mail->Password = $config['smtp_pass'];
$mail->SMTPSecure = strtolower((string)$config['smtp_secure']) === 'tls'
    ? PHPMailer::ENCRYPTION_STARTTLS
    : PHPMailer::ENCRYPTION_SMTPS;
$mail->SMTPDebug = 2;
$mail->Debugoutput = static function ($str, $level) {
    echo "[SMTP:$level] $str\n";
};

$mail->setFrom($config['from_email'], $config['from_name']);
$mail->addAddress($config['to_email'], $config['to_name']);
$mail->Subject = 'SMTP Delivery Debug ' . date('Y-m-d H:i:s');
$mail->Body = 'This is a delivery debug test from PHPMailer.';

try {
    $ok = $mail->send();
    echo "SEND_RESULT=" . ($ok ? 'OK' : 'FAIL') . "\n";
    echo "MESSAGE_ID=" . $mail->getLastMessageID() . "\n";
} catch (Throwable $e) {
    echo "SEND_EXCEPTION=" . $e->getMessage() . "\n";
    echo "ERROR_INFO=" . $mail->ErrorInfo . "\n";
}
