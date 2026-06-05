const fs = require('fs');
const path = require('path');

const directory = 'c:/xampp/htdocs/honey-ghee/admin/src';

const replacements = [
  { regex: /bg-\[#0d2a1b\]/g, replacement: 'bg-[var(--admin-bg)]' },
  { regex: /bg-\[#123523\]/g, replacement: 'bg-[var(--admin-card)]' },
  { regex: /fill='#123523'/g, replacement: "fill='#171717'" },
  { regex: /bg-\[#1f8b4c\]\s+px-([^\s]+)\s+py-([^\s]+)\s+text-white/g, replacement: 'bg-[var(--admin-primary)] px-$1 py-$2 text-black' },
  { regex: /hover:bg-\[#176a39\]/g, replacement: 'hover:bg-[var(--admin-primary-strong)]' },
  { regex: /bg-[#1f8b4c]/g, replacement: 'bg-[var(--admin-primary)] text-black' },
  { regex: /bg-\[#1a5e38\]/g, replacement: 'bg-[var(--admin-card)]' }
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
