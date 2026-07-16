#!/usr/bin/env node

/**
 * Organize image files into dist/images/ folder after build
 * Run: node organize-images.js
 */

const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const imagesDir = path.join(distDir, 'images');

// Create images folder if it doesn't exist
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log('✓ Created dist/images folder');
}

// Image file extensions
const imageExts = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.mp4', '.webm'];

// Get all files in dist root
const files = fs.readdirSync(distDir);

let movedCount = 0;

files.forEach(file => {
  const filePath = path.join(distDir, file);
  const stat = fs.statSync(filePath);

  // Skip directories
  if (stat.isDirectory()) return;

  const ext = path.extname(file).toLowerCase();

  // Move image files to images folder
  if (imageExts.includes(ext)) {
    const destPath = path.join(imagesDir, file);
    fs.renameSync(filePath, destPath);
    console.log(`  ✓ Moved ${file}`);
    movedCount++;
  }
});

console.log(`\n✓ Organized ${movedCount} image(s) into dist/images/`);
