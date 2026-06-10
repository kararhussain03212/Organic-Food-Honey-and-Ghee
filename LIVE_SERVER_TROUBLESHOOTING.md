# 🔧 Live Server Troubleshooting Guide

## Issues Found & Fixed

### ✅ 1. CSP (Content Security Policy) Blocking Google Fonts
**Error**: `Loading the stylesheet 'https://fonts.googleapis.com/css2?...' violates CSP directive`

**Fixed**: Updated `.htaccess` to allow Google Fonts:
```
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
font-src 'self' https://fonts.gstatic.com
```

**Result**: Fonts should now load ✓

---

### ❌ 2. API 404 Errors (Backend Not Responding)
**Errors**:
```
GET /backend/api/public/settings → 404
GET /backend/api/public/hero → 404
GET /backend/api/public/products → 404
GET /backend/api/public/blog → 404
GET /backend/api/public/testimonials → 404
GET /backend/api/public/commitment-items → 404
```

**Root Cause**: One of the following:
1. Backend files not uploaded to cPanel
2. Database not created/seeded
3. API routes not registered
4. PHP version incompatibility

---

## 🔍 Diagnostic Steps

### Step 1: Verify Backend Files
SSH into cPanel and check:
```bash
ls -la public_html/backend/

# Should see:
# - index.php
# - config/ (directory)
# - routes/ (directory)
# - middleware/ (directory)
# - .env (file)
# - .htaccess (file)
```

### Step 2: Check .env Configuration
```bash
cat public_html/backend/.env

# Verify:
# ✓ APP_ENV=production
# ✓ APP_URL=https://organicfood.swiftsigngeneraltrading.com/backend
# ✓ DB_HOST, DB_NAME, DB_USER, DB_PASS are correct
# ✓ FORCE_HTTPS=true
```

### Step 3: Test Database Connection
Create temporary test file `/backend/test-db.php`:
```php
<?php
require_once __DIR__ . '/config/env.php';
use Backend\Config\Env;

Env::load(__DIR__ . '/.env');

$host = Env::get('DB_HOST');
$name = Env::get('DB_NAME');
$user = Env::get('DB_USER');
$pass = Env::get('DB_PASS');

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$name",
        $user,
        $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    echo json_encode([
        'status' => 'success',
        'message' => 'Database connection successful',
        'database' => $name
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed: ' . $e->getMessage()
    ]);
}
?>
```

Then visit: `https://organicfood.swiftsigngeneraltrading.com/backend/test-db.php`

Expected response:
```json
{"status":"success","message":"Database connection successful","database":"swiftsig_organic_food"}
```

### Step 4: Test API Route
Visit: `https://organicfood.swiftsigngeneraltrading.com/backend/api/public/settings`

Expected response:
```json
{
  "data": {...},
  "meta": {...}
}
```

If you get 404, the routes aren't registered.

---

## 🛠️ Solution: Database & Routes Setup

### 1. Create Database Tables
SSH into cPanel:
```bash
cd public_html/backend

# Check if seed file exists
ls seeds/

# Run seeders to create tables
php seeds/seed_products.php
php seeds/seed_blog.php
php seeds/seed_testimonials.php

# Or run a master seeder (if available)
php seed.php
```

### 2. Verify Routes Are Registered
Check `/backend/routes/api.php` file:
```php
// Should have routes like:
$router->get('/api/public/settings', 'SettingsController@getSettings');
$router->get('/api/public/products', 'ProductController@list');
$router->get('/api/public/hero', 'HeroController@get');
// etc.
```

### 3. Clear PHP Cache
If on cPanel with OPcache:
```bash
# SSH command
php -r "opcache_reset();"

# Or via script: create clear-cache.php
<?php opcache_reset(); echo "Cache cleared"; ?>
```

---

## 📝 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| 404 on all `/backend/api/*` | Routes not registered | Run seeders; check routes/api.php |
| Database connection error | Wrong credentials | Verify DB_* in .env matches cPanel |
| HTTPS mixed content | Assets using http:// | Update asset URLs to https:// |
| Fonts not loading | CSP too strict | ✓ Already fixed in .htaccess |
| Admin login fails | DB tables missing | Run seeders in backend/seeds/ |

---

## 🚀 Quick Fix Checklist

- [ ] Backend files uploaded to `/backend/`
- [ ] `.env.production` copied to `.env` in backend
- [ ] Database `swiftsig_organic_food` created in cPanel
- [ ] Database user `swiftsig_organic_food` created with all privileges
- [ ] Seeders run: `php backend/seed.php` or individual seed files
- [ ] Test DB connection with test-db.php
- [ ] Test API endpoint: `/backend/api/public/settings`
- [ ] Frontend loads without 404 errors
- [ ] Admin panel loads at `/admin`
- [ ] Google Fonts load (no CSP errors)

---

## 📞 Support

If API still returns 404:
1. Check cPanel File Manager → `/backend/` exists and has files
2. Check cPanel MySQL → Database and user created
3. Check cPanel Error Logs → PHP errors logged
4. SSH into cPanel and run: `php backend/routes/api.php` to test routing

**Deployed**: June 10, 2026  
**Status**: Configuration updated, needs DB setup
