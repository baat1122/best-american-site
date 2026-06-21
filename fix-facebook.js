const fs = require('fs');
const path = require('path');

function walk(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.vercel-tmp', '.git', 'dashboard'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, results);
    else if (entry.name.endsWith('.html') || entry.name.endsWith('.json')) results.push(full);
  }
  return results;
}

const OLD = 'https://www.facebook.com/bestamericanautotransport';
const NEW = 'https://www.facebook.com/profile.php?id=61577115704216';
const files = walk(__dirname);
let count = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes(OLD)) {
    content = content.split(OLD).join(NEW);
    fs.writeFileSync(file, content);
    console.log(path.relative(__dirname, file));
    count++;
  }
}
console.log(`Done: ${count} files updated`);
