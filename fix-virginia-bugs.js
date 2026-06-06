const fs = require('fs');
const path = require('path');

const rootDir = 'c:/Users/DYNABOOK/.gemini/antigravity/scratch/neon-site';

function getAllHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory() && !filePath.includes('.git')) {
      getAllHtmlFiles(filePath, fileList);
    } else if (filePath.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const htmlFiles = getAllHtmlFiles(rootDir);
let updatedFiles = 0;

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // 1. FAQ #4
  content = content.replace(/How do I pay for my Virginia auto transport\?/g, 'How do I pay for my auto transport?');

  // 2. Population Density
  content = content.replace(/Shipping to or from a busy city in Virginia can cost more\./g, 'Shipping to or from a busy city can cost more.');

  // 3. Hub City - generic
  content = content.replace(/Major highway corridors like I-95 and I-81 in Virginia serve as primary routes/g, 'Major national highway corridors serve as primary routes');

  // 4. Hub City - California I-95 bug
  // "Major highway corridors like I-95 serve as primary routes for carriers in California"
  // Let's do a regex to catch "like I-95 serve as primary routes for carriers in [State]" or similar
  content = content.replace(/Major highway corridors like I-95 serve as primary routes for carriers in ([a-zA-Z\s]+)/g, 'Major national highway corridors serve as primary routes for carriers in $1');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    updatedFiles++;
  }
}

console.log(`Virginia template bugs fixed in ${updatedFiles} files.`);
