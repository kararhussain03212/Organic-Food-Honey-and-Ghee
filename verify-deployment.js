#!/usr/bin/env node

/**
 * Deployment Verification Script
 * Run: node verify-deployment.js
 * Checks that all deployment configuration is correct
 */

const fs = require('fs');
const path = require('path');

const PRODUCTION_DOMAIN = 'organicfood.swiftsigngeneraltrading.com';
const CHECKS = [];
let passCount = 0;
let failCount = 0;

function check(name, condition, details = '') {
  const status = condition ? '✅' : '❌';
  CHECKS.push({ name, status, details, passed: condition });
  if (condition) passCount++;
  else failCount++;
  console.log(`${status} ${name}${details ? ` — ${details}` : ''}`);
}

console.log('\n🔍 Deployment Verification\n');

// 1. Check environment files
console.log('📋 Environment Files:');
check('.env.production exists', fs.existsSync('.env.production'));
check('backend/.env.production exists', fs.existsSync('backend/.env.production'));
check('admin/.env.production exists', fs.existsSync('admin/.env.production'));

// 2. Check .env.production content
console.log('\n🌐 Production Domain Configuration:');
if (fs.existsSync('.env.production')) {
  const env = fs.readFileSync('.env.production', 'utf8');
  check(
    'Frontend .env has production domain',
    env.includes('organicfood.swiftsigngeneraltrading.com'),
    env.split('\n')[0]
  );
}

if (fs.existsSync('backend/.env.production')) {
  const env = fs.readFileSync('backend/.env.production', 'utf8');
  check('Backend FORCE_HTTPS=true', env.includes('FORCE_HTTPS=true'));
  check('Backend has production domain', env.includes('organicfood.swiftsigngeneraltrading.com'));
  check('Backend CORS configured', env.includes('CORS_ALLOW_ORIGIN'));
}

if (fs.existsSync('admin/.env.production')) {
  const env = fs.readFileSync('admin/.env.production', 'utf8');
  check('Admin .env has production domain', env.includes('organicfood.swiftsigngeneraltrading.com'));
}

// 3. Check for hardcoded localhost
console.log('\n🔒 Hardcoded Path Checks:');
const files = [
  'src/seo/seoData.js',
  'src/seo/seoUtils.js',
  'src/seo/SEOProductTemplate.jsx',
  'src/seo/SEOBlogTemplate.jsx',
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const hasOldDomain = content.includes('arionorganicfood.com');
    const hasLocalhost = content.includes('localhost:');
    check(
      `${path.basename(file)} uses production domain`,
      !hasOldDomain && !hasLocalhost,
      hasOldDomain ? 'Still has arionorganicfood.com' : hasLocalhost ? 'Still has localhost' : 'Clean'
    );
  }
});

// 4. Check routing files
console.log('\n🛣️  Routing Configuration:');
check('.htaccess exists', fs.existsSync('.htaccess'));
check('index.php exists', fs.existsSync('index.php'));

if (fs.existsSync('.htaccess')) {
  const htaccess = fs.readFileSync('.htaccess', 'utf8');
  check('.htaccess has HTTPS redirect', htaccess.includes('HTTPS'));
  check('.htaccess routes admin', htaccess.includes('admin'));
  check('.htaccess routes API', htaccess.includes('backend'));
}

// 5. Check vite config
console.log('\n⚙️  Build Configuration:');
check('vite.config.js exists', fs.existsSync('vite.config.js'));
check('admin/vite.config.js exists', fs.existsSync('admin/vite.config.js'));

if (fs.existsSync('admin/vite.config.js')) {
  const config = fs.readFileSync('admin/vite.config.js', 'utf8');
  check('Admin vite.config uses /admin/ base', config.includes("'/admin/'"));
  check('Admin vite.config references Organic Food (not honey-ghee)',
    !config.includes('honey-ghee'),
    config.includes('honey-ghee') ? 'Still references old project' : 'Clean'
  );
}

// 6. Check backend config
console.log('\n🔧 Backend Configuration:');
check('backend/config/env.php exists', fs.existsSync('backend/config/env.php'));
check('backend/middleware/cors.php exists', fs.existsSync('backend/middleware/cors.php'));
check('backend/index.php exists', fs.existsSync('backend/index.php'));

// 7. Summary
console.log('\n' + '='.repeat(50));
console.log(`✅ Passed: ${passCount} | ❌ Failed: ${failCount}`);
console.log('='.repeat(50) + '\n');

if (failCount > 0) {
  console.log('⚠️  Fix the issues above before deploying to cPanel!\n');
  process.exit(1);
} else {
  console.log('🎉 All checks passed! Ready for deployment.\n');
  process.exit(0);
}
