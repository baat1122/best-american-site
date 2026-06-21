const fs = require('fs');
const path = require('path');

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules') continue;
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(walkDir(filePath));
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  }
  return results;
}

const allHtml = walkDir(__dirname);
let fixedCount = 0;
for (const filePath of allHtml) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  // Fix any remaining href="#" for Terms & Conditions
  const termsRegex = /<a href="#"[^>]*>Terms\s*&\s*Conditions<\/a>/g;
  if (termsRegex.test(content)) {
    content = content.replace(termsRegex, '<a href="/terms/" class="hover:text-[#800020] transition">Terms & Conditions</a>');
    changed = true;
  }
  // Also fix Privacy Policy links that point to #
  const privacyRegex = /<a href="#"[^>]*>Privacy Policy<\/a>/g;
  if (privacyRegex.test(content)) {
    content = content.replace(privacyRegex, '<a href="/privacy/" class="hover:text-[#800020] transition">Privacy Policy</a>');
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    fixedCount++;
    console.log('Fixed: ' + path.relative(__dirname, filePath));
  }
}
console.log('Total files fixed: ' + fixedCount);
