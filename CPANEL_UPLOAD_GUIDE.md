# 📤 cPanel Upload Guide - Backend Files

## 📁 Directory Structure on cPanel

```
public_html/
├── .htaccess                    ← Root routing
├── index.php                    ← Root router
├── .env                         ← Copy from .env.production
├── .env.production              (optional, keep for reference)
│
├── backend/                     ← ALL BACKEND FILES GO HERE
│   ├── .htaccess               (IMPORTANT - API routing)
│   ├── .env                    ← Copy from .env.production
│   ├── index.php               (IMPORTANT - API entry point)
│   │
│   ├── config/
│   │   ├── env.php
│   │   ├── database.php
│   │   └── jwt.php
│   │
│   ├── middleware/
│   │   ├── cors.php
│   │   └── auth.php
│   │
│   ├── routes/
│   │   └── api.php
│   │
│   ├── controllers/
│   │   ├── SettingsController.php
│   │   ├── ProductController.php
│   │   ├── BlogController.php
│   │   ├── HeroController.php
│   │   ├── TestimonialController.php
│   │   ├── CommitmentController.php
│   │   ├── ContactController.php
│   │   └── ... (all controllers)
│   │
│   ├── utils/
│   │   ├── Response.php
│   │   ├── Router.php
│   │   ├── Validation.php
│   │   └── ...
│   │
│   ├── seeds/
│   │   ├── seed_products.php
│   │   ├── seed_blog.php
│   │   ├── seed_testimonials.php
│   │   ├── seed.php
│   │   └── ...
│   │
│   └── uploads/                 ← For product images
│       ├── product-images/
│       └── blog-images/
│
├── dist/                        ← Frontend build (React)
│   ├── index.html
│   ├── assets/
│   │   ├── index-*.js
│   │   └── style-*.css
│   └── ...
│
├── admin/
│   ├── dist/                    ← Admin build
│   │   ├── index.html
│   │   ├── assets/
│   │   └── ...
│   └── ...
│
└── public/
    ├── logo/
    │   ├── General trading storke.png
    │   └── General trading white storke.png
    │
    ├── uploads/                 ← For all media
    │   ├── product-images/
    │   ├── blog-images/
    │   └── ...
    │
    └── og-image.png
```

---

## 🚀 Upload Methods

### **Method 1: cPanel File Manager (Easy for Small Projects)**

1. **Login to cPanel**
   - Go to `cPanel Control Panel`
   - Find `File Manager`

2. **Navigate to public_html**
   - Click on `public_html` folder

3. **Create backend folder**
   - Right-click → `Create New Folder` → Type `backend`

4. **Upload backend files**
   ```
   - Drag and drop all backend files into the backend folder
   OR
   - Right-click → Upload → Select files
   ```

5. **Create public folder for uploads**
   - Right-click → `Create New Folder` → Type `public`
   - Inside public → Create `uploads`, `logo` folders

6. **Upload environment file**
   - Create new file: `.env`
   - Paste content from `.env.production`
   - Edit `DB_` variables to match your cPanel credentials

---

### **Method 2: FTP/SFTP (Recommended for Large Projects)**

#### **Using FileZilla (Free FTP Client)**

1. **Get cPanel FTP Credentials**
   - cPanel → FTP Accounts
   - Note: `hostname`, `username`, `password`

2. **Connect in FileZilla**
   ```
   Host: ftp.organicfood.swiftsigngeneraltrading.com
   Username: your_cpanel_ftp_user
   Password: your_ftp_password
   Port: 21
   ```

3. **Navigate to public_html**
   - In FileZilla, go to `/public_html/`

4. **Upload backend folder**
   - Right side (Remote): `/public_html/`
   - Left side (Local): `C:\xampp\htdocs\Organic Food\backend\`
   - Drag backend folder → Upload

5. **Set File Permissions**
   - Right-click backend folder → File permissions
   - Set to `755` (directories) and `644` (files)

6. **Upload other folders**
   - dist/ → public_html/dist/
   - admin/dist/ → public_html/admin/dist/
   - public/ → public_html/public/

---

### **Method 3: SSH/Command Line (Fastest for Developers)**

1. **SSH into cPanel**
   ```bash
   ssh your_cpanel_user@organicfood.swiftsigngeneraltrading.com
   cd public_html
   ```

2. **Upload using rsync**
   ```bash
   rsync -avz --exclude 'node_modules' --exclude '.git' \
     ./backend user@organicfood.swiftsigngeneraltrading.com:/home/user/public_html/
   
   rsync -avz ./dist user@organicfood.swiftsigngeneraltrading.com:/home/user/public_html/
   
   rsync -avz ./admin/dist user@organicfood.swiftsigngeneraltrading.com:/home/user/public_html/admin/
   ```

3. **Or use SCP**
   ```bash
   scp -r ./backend user@organicfood.swiftsigngeneraltrading.com:/home/user/public_html/
   ```

---

## ✅ Checklist: What Files to Upload

### **MUST UPLOAD:**
- [ ] `backend/` folder (ALL FILES)
  - [ ] `config/` (env.php, database.php, jwt.php)
  - [ ] `middleware/` (cors.php, auth.php)
  - [ ] `routes/` (api.php)
  - [ ] `controllers/` (all controllers)
  - [ ] `utils/` (Response.php, Router.php)
  - [ ] `seeds/` (all seed files)
  - [ ] `.htaccess`
  - [ ] `index.php`
  - [ ] `.env` (COPY from .env.production, then edit)
  
- [ ] `dist/` folder (Frontend build - run `npm run build` first!)
  - [ ] `index.html`
  - [ ] `assets/` (CSS, JS files)
  
- [ ] `admin/dist/` folder (Admin build - run `npm run build` in admin/ first!)
  - [ ] `index.html`
  - [ ] `assets/` (CSS, JS files)

- [ ] Root files:
  - [ ] `.htaccess`
  - [ ] `index.php`
  - [ ] `.env` (copy from .env.production)

### **DON'T UPLOAD:**
- ❌ `node_modules/` (too large, will cause timeout)
- ❌ `.git/` (not needed on production)
- ❌ `package-lock.json` (optional)
- ❌ `.env.production` (already copied to .env)
- ❌ source `src/` folder (already built into dist/)
- ❌ `admin/src/` folder (already built into admin/dist/)

---

## 🔐 File Permissions on cPanel

After uploading, set correct permissions via cPanel File Manager:

```
Directories (folders):    755
Files:                    644
.htaccess:               644
.env:                    600 (MOST SECURE)
index.php:               644

Special:
backend/uploads/:        777 (writable by PHP)
backend/seeds/:          755 (readable by PHP)
```

---

## 🔧 Post-Upload Setup

### 1. **Create & Configure .env**

In cPanel File Manager:
- Create file: `backend/.env`
- Copy content from `backend/.env.production`
- Edit these lines with YOUR cPanel values:

```ini
DB_HOST=localhost
DB_PORT=3306
DB_NAME=swiftsig_organic_food        ← From cPanel MySQL
DB_USER=swiftsig_organic_food        ← From cPanel MySQL
DB_PASS=your_actual_db_password      ← Your cPanel database password

CORS_ALLOW_ORIGIN=https://organicfood.swiftsigngeneraltrading.com,https://www.organicfood.swiftsigngeneraltrading.com
```

### 2. **Create uploads Directory**

```bash
# Via SSH:
cd /home/user/public_html/backend
mkdir -p uploads/product-images
mkdir -p uploads/blog-images
chmod 777 uploads
chmod 777 uploads/product-images
chmod 777 uploads/blog-images
```

Or via File Manager:
- Create folder `backend/uploads/`
- Create folder `backend/uploads/product-images/`
- Create folder `backend/uploads/blog-images/`
- Right-click each → Permissions → Set to `777`

### 3. **Run Database Seeders**

Via SSH:
```bash
cd /home/user/public_html/backend
php seed.php

# Or individual seeders:
php seeds/seed_products.php
php seeds/seed_blog.php
php seeds/seed_testimonials.php
```

---

## 🧪 Verify Upload

### Test 1: Frontend Loads
```
Visit: https://organicfood.swiftsigngeneraltrading.com
Expected: Homepage loads without errors
```

### Test 2: Admin Loads
```
Visit: https://organicfood.swiftsigngeneraltrading.com/admin
Expected: Admin login page loads
```

### Test 3: API Works
```
Visit: https://organicfood.swiftsigngeneraltrading.com/backend/api/public/settings
Expected: JSON response with data (not 404)
```

### Test 4: Check Errors
In cPanel → Metrics → Error Log
- Should show NO PHP errors
- May show warnings (ignore non-critical ones)

---

## 🆘 Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| 404 on `/backend/api/*` | .htaccess not uploaded | Upload `backend/.htaccess` |
| 404 on admin panel | `admin/dist/` not uploaded | Build & upload `admin/dist/` |
| White blank page | `dist/` not uploaded | Build with `npm run build` & upload |
| Database 404 | Seeders not run | SSH & run `php seed.php` |
| Permission denied | Wrong permissions | Set to `755` (dirs) `644` (files) |
| HTTPS mixed content | Using http:// URLs | Use https:// in .env APP_URL |

---

## 📋 Quick Upload Checklist

- [ ] Build frontend: `npm run build`
- [ ] Build admin: `cd admin && npm run build && cd ..`
- [ ] Upload `backend/` folder to cPanel
- [ ] Upload `dist/` folder to cPanel
- [ ] Upload `admin/dist/` folder to cPanel
- [ ] Upload root `.htaccess` and `index.php`
- [ ] Create & configure `backend/.env` (copy from .env.production)
- [ ] Create `backend/uploads/` directory with 777 permissions
- [ ] SSH in and run `php seed.php`
- [ ] Visit homepage → should load
- [ ] Visit `/backend/api/public/settings` → should return JSON
- [ ] Clear browser cache → refresh

---

**Status**: Upload guide complete  
**Last Updated**: June 10, 2026
