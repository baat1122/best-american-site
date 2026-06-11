const fs = require('fs');
const path = require('path');

const ROOT = 'c:/Users/DYNABOOK/.gemini/antigravity/scratch/neon-site';
const SKIP = ['node_modules', '.git', '.vercel', '.vercel-tmp'];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir)) {
    if (SKIP.includes(entry)) continue;
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      walk(full, files);
    } else if (entry.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

const files = walk(ROOT);
let updated = 0;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  const original = content;
  content = content.replace(/chatbot\.js\?v=2/g, 'chatbot.js?v=3');
  // Also handle files without any version query string
  content = content.replace(/src="\/js\/chatbot\.js" defer/g, 'src="/js/chatbot.js?v=3" defer');
  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
    updated++;
    console.log('Updated:', path.relative(ROOT, f));
  }
});

console.log('Total files updated:', updated);
