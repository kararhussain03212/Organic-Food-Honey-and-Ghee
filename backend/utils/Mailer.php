<?php

declare(strict_types=1);

namespace Backend\Utils;

use Backend\Config\Mail;

require_once __DIR__ . '/../config/mail.php';

final class Mailer
{
    private static array $config = [];

    /**
     * Send a simple email using PHP's mail() function or via SMTP if configured
     */
    public static function send(string $to, string $subject, string $body, array $headers = []): bool
    {
        self::$config = Mail::getConfig();

        $username = self::$config['username'] ?? '';
        $password = self::$config['password'] ?? '';
        $host = self::$config['host'] ?? '';
        $port = self::$config['port'] ?? 587;

        // If SMTP credentials are not configured, use PHP's native mail()
        if (!$username || !$password) {
            return self::sendPhpMail($to, $subject, $body, $headers);
        }

        // Try to use SMTP via PHPMailer if available
        return self::sendSmtpMail($to, $subject, $body, $headers);
    }

    /**
     * Send email using PHP's native mail() function
     */
    private static function sendPhpMail(string $to, string $subject, string $body, array $headers): bool
    {
        $config = self::$config;
        $from = $config['from_address'] ?? 'noreply@arionorganicfood.com';
        $fromName = $config['from_name'] ?? 'Arion Organic Foods';

        $emailHeaders = array_merge([
            'From' => "{$fromName} <{$from}>",
            'Reply-To' => $from,
            'Content-Type' => 'text/html; charset=UTF-8',
            'X-Mailer' => 'Arion Organic Food CMS',
        ], $headers);

        $headerString = '';
        foreach ($emailHeaders as $key => $value) {
            $headerString .= "{$key}: {$value}\r\n";
        }

        return mail($to, $subject, $body, rtrim($headerString));
    }

    /**
     * Send email via SMTP (requires PHPMailer library)
     * Install via: composer require phpmailer/phpmailer
     */
    private static function sendSmtpMail(string $to, string $subject, string $body, array $headers): bool
    {
        // Check if PHPMailer is installed
        if (!class_exists('PHPMailer\PHPMailer\PHPMailer')) {
            // Fallback to PHP mail if PHPMailer not installed
            return self::sendPhpMail($to, $subject, $body, $headers);
        }

        try {
            $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
            $config = self::$config;

            // SMTP settings
            $mail->isSMTP();
            $mail->Host = $config['host'];
            $mail->Port = $config['port'];
            $mail->SMTPAuth = true;
            $mail->Username = $config['username'];
            $mail->Password = $config['password'];
            $mail->SMTPSecure = $config['encryption'] === 'ssl' ? \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS : \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;

            // Email settings
            $mail->setFrom($config['from_address'], $config['from_name']);
            $mail->addAddress($to);
            $mail->Subject = $subject;
            $mail->isHTML(true);
            $mail->Body = $body;

            // Add reply-to if in headers
            if (isset($headers['Reply-To'])) {
                $mail->addReplyTo($headers['Reply-To']);
            }

            return $mail->send();
        } catch (\Exception $e) {
            error_log("PHPMailer Error: " . $e->getMessage());
            // Fallback to PHP mail
            return self::sendPhpMail($to, $subject, $body, $headers);
        }
    }

    /**
     * Send order confirmation email
     */
    public static function sendOrderConfirmation(string $to, string $customerName, string $orderNumber, string $orderDetails): bool
    {
        $subject = "Order Confirmation - {$orderNumber}";
        $body = self::getOrderEmailTemplate($customerName, $orderNumber, $orderDetails);
        return self::send($to, $subject, $body);
    }

    /**
     * Send contact form reply
     */
    public static function sendContactReply(string $to, string $senderName, string $message): bool
    {
        $subject = "We've received your message";
        $body = self::getContactReplyTemplate($senderName, $message);
        return self::send($to, $subject, $body);
    }

    /**
     * Order confirmation email template
     */
    private static function getOrderEmailTemplate(string $name, string $orderNumber, string $details): string
    {
        return <<<HTML
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
                <h2 style="color: #2d5016;">Order Confirmation</h2>
                <p>Dear {$name},</p>
                <p>Thank you for your order! Your order has been received and is being processed.</p>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Order Number:</strong> {$orderNumber}</p>
                    {$details}
                </div>
                <p>You will receive a shipping confirmation email once your order has been dispatched.</p>
                <p>If you have any questions, please don't hesitate to contact us.</p>
                <p>Best regards,<br><strong>Arion Organic Foods</strong></p>
            </div>
        </body>
        </html>
        HTML;
    }

    /**
     * Contact form reply template
     */
    private static function getContactReplyTemplate(string $name, string $message): string
    {
        return <<<HTML
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
                <h2 style="color: #2d5016;">We've Received Your Message</h2>
                <p>Dear {$name},</p>
                <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Your Message:</strong></p>
                    <p style="white-space: pre-wrap;">{$message}</p>
                </div>
                <p>We typically respond within 24-48 business hours.</p>
                <p>Best regards,<br><strong>Arion Organic Foods Team</strong></p>
            </div>
        </body>
        </html>
        HTML;
    }
}
