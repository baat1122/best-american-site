const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const replacements = [
  // Normalize particles.js versions (some pages still on v=7)
  { from: 'src="/js/particles.js?v=7" defer', to: 'src="/js/particles.js?v=8" defer' },
  { from: 'src="/js/particles.js" defer', to: 'src="/js/particles.js?v=8" defer' },
  // Normalize us-map.js
  { from: 'src="/js/us-map.js" defer', to: 'src="/js/us-map.js?v=4" defer' },
  // Normalize main.js
  { from: 'src="/js/main.js" defer', to: 'src="/js/main.js?v=4" defer' },
  // Normalize calculator.js
  { from: 'src="/js/calculator.js" defer', to: 'src="/js/calculator.js?v=2" defer' },
  // Normalize chatbot.js
  { from: 'src="/js/chatbot.js?v=3" defer', to: 'src="/js/chatbot.js?v=4" defer' },
  { from: 'src="/js/chatbot.js" defer', to: 'src="/js/chatbot.js?v=4" defer' },
  // Normalize chatbot.css
  { from: 'href="/css/chatbot.css">', to: 'href="/css/chatbot.css?v=2" media="print" onload="this.media=\'all\'"><noscript><link rel="stylesheet" href="/css/chatbot.css?v=2"></noscript>' },
  // Normalize three-truck.js
  { from: 'src="/js/three-truck.js" defer', to: 'src="/js/three-truck.js?v=2" defer' },
];

let totalFiles = 0;
let totalReplacements = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.vercel' || entry.name === '.vercel-tmp' || entry.name === 'og-images') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.name.endsWith('.html')) {
      let html = fs.readFileSync(full, 'utf8');
      let changed = false;
      for (const r of replacements) {
        if (html.includes(r.from)) {
          html = html.replace(r.from, r.to);
          changed = true;
          totalReplacements++;
        }
      }
      if (changed) {
        fs.writeFileSync(full, html, 'utf8');
        totalFiles++;
        console.log('Updated:', path.relative(ROOT, full));
      }
    }
  }
}

walk(ROOT);
console.log(`\nDone. ${totalReplacements} replacements across ${totalFiles} files.`);
