# PHPMailer Email Configuration Guide

## Setup Instructions

### 1. Environment Variables (.env)

Add these credentials to your `.backend/.env` file:

```env
# Mail Configuration (SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_FROM_ADDRESS=noreply@arionorganicfood.com
MAIL_FROM_NAME=Arion Organic Foods
MAIL_ENCRYPTION=tls
```

### 2. Gmail Setup (Recommended)

#### Step 1: Enable 2-Factor Authentication
1. Go to https://myaccount.google.com/security
2. Enable "2-Step Verification"

#### Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer" (or your OS)
3. Google will generate a 16-character password
4. Copy this password and paste it as `MAIL_PASSWORD` in `.env`

#### Step 3: Update .env
```env
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=xxxx xxxx xxxx xxxx  (the 16-char password from step 2)
```

### 3. Alternative SMTP Providers

#### Mailtrap (Testing/Development)
```env
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=587
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_ENCRYPTION=tls
```

#### SendGrid
```env
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=SG.xxxxx_your_sendgrid_api_key
MAIL_ENCRYPTION=tls
```

#### AWS SES
```env
MAIL_HOST=email-smtp.region.amazonaws.com
MAIL_PORT=587
MAIL_USERNAME=your_ses_username
MAIL_PASSWORD=your_ses_password
MAIL_ENCRYPTION=tls
```

#### Outlook/Microsoft 365
```env
MAIL_HOST=smtp.office365.com
MAIL_PORT=587
MAIL_USERNAME=your_email@outlook.com
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
```

### 4. Installation (Optional)

If you want to use PHPMailer library instead of PHP's native mail():

```bash
cd backend
composer require phpmailer/phpmailer
```

### 5. Usage in Code

```php
use Backend\Utils\Mailer;

// Send custom email
Mailer::send(
    'customer@example.com',
    'Subject',
    '<h1>HTML Body</h1>',
    ['Reply-To' => 'support@arionorganicfood.com']
);

// Send order confirmation
Mailer::sendOrderConfirmation(
    'customer@example.com',
    'John Doe',
    'ORD-123456',
    '<p>Order Details...</p>'
);

// Send contact form reply
Mailer::sendContactReply(
    'contact@example.com',
    'Jane Smith',
    'Your inquiry message...'
);
```

### 6. Troubleshooting

#### Error: "SMTP connect() failed"
- Check MAIL_HOST and MAIL_PORT are correct
- Enable "Less secure app access" for Gmail (if not using App Password)
- Check firewall/antivirus blocking SMTP

#### Error: "Authentication failed"
- Verify MAIL_USERNAME and MAIL_PASSWORD are correct
- For Gmail, ensure you're using App Password (not regular password)
- Check 2-FA is enabled on Gmail

#### Emails not sending
- Check error logs in `backend/storage/mail-err.log`
- Verify MAIL_FROM_ADDRESS is valid
- Test with `php -r "mail('test@gmail.com', 'test', 'test');"`

### 7. Testing

Use the following to test your email configuration:

```php
<?php
require_once __DIR__ . '/backend/utils/Mailer.php';
require_once __DIR__ . '/backend/config/mail.php';

use Backend\Utils\Mailer;

// Test email
$result = Mailer::send(
    'your_test_email@gmail.com',
    'Test Email from Arion',
    '<h1>This is a test email</h1><p>If you see this, email is working!</p>'
);

echo $result ? "Email sent successfully!" : "Failed to send email";
?>
```

Run: `php test-email.php`

### 8. Security Notes

⚠️ **Important:**
- Never commit `.env` with real credentials to version control
- Use `.gitignore` to exclude `.env` file
- Store passwords in environment variables, not in code
- For Gmail, always use App Password (not account password)
- Consider using `.env.production` for different staging environments

### 9. Email Templates

Default templates included:
- Order Confirmation (`sendOrderConfirmation()`)
- Contact Form Reply (`sendContactReply()`)

Add custom templates in `Mailer.php`:

```php
public static function sendCustom(string $to, string $subject, string $template): bool
{
    $body = self::getCustomTemplate($template);
    return self::send($to, $subject, $body);
}

private static function getCustomTemplate(string $template): string
{
    return <<<HTML
    <html><!-- Your HTML here --></html>
    HTML;
}
```

## Summary

✅ Configured: `backend/config/mail.php`
✅ Mailer Class: `backend/utils/Mailer.php`
✅ Update `.env` with your SMTP credentials
✅ Optional: Install PHPMailer via Composer
✅ Test with the test script above
