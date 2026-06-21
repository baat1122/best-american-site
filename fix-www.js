const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OLD = 'https://www.bestamericanautotransport.com';
const NEW = 'https://bestamericanautotransport.com';

function walk(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.vercel-tmp' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results = results.concat(walk(full));
    else if (/\.(html|xml|txt)$/i.test(entry.name)) results.push(full);
  }
  return results;
}

const files = walk(ROOT);
let totalChanged = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes(OLD)) {
    const updated = content.split(OLD).join(NEW);
    fs.writeFileSync(file, updated, 'utf8');
    const count = content.split(OLD).length - 1;
    console.log(`${path.relative(ROOT, file)}: ${count} replacements`);
    totalChanged++;
  }
}

console.log(`\nDone: ${totalChanged} files updated`);
