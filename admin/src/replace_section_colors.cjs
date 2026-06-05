const fs = require('fs');
const path = require('path');

const directory = 'c:/xampp/htdocs/honey-ghee/admin/src/pages/settings/sections';

const replacements = [
  { regex: /bg-\[#fffdf8\]/g, replacement: 'bg-[var(--admin-card-elevated)]' },
  { regex: /bg-white/g, replacement: 'bg-[var(--admin-bg)]' },
  { regex: /text-white hover:bg-\[var\(--admin-accent-strong\)\]/g, replacement: 'text-black hover:bg-[var(--admin-accent-strong)]' },
  { regex: /border-\[#d9b06e\] bg-\[#f8e4be\] px-3 py-2 font-medium text-\[#7a4a10\] hover:bg-\[#f3d8a4\]/g, replacement: 'border-red-500 bg-red-500/10 px-3 py-2 font-medium text-red-400 hover:bg-red-500/20' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      for (const { regex, replacement } of replacements) {
        content = content.replace(regex, replacement);
      }
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(directory);
