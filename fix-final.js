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
let updatedHtml = 0;

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Extract page title to use for the alt tag
  const titleMatch = content.match(/<title>([^|]+?)\s*\|.*Neon Auto Transport<\/title>/);
  if (titleMatch) {
    const pageTitle = titleMatch[1].trim();
    
    // Replace Unsplash image without alt
    content = content.replace(/(<img\s+loading="lazy"\s+src="https:\/\/images\.unsplash\.com\/[^"]+"\s+class="w-full\s+h-full\s+object-cover")>/g, `$1 alt="${pageTitle} — Neon Auto Transport">`);
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    updatedHtml++;
  }
}

console.log(`Updated ${updatedHtml} HTML files for Unsplash alt tags.`);

// Update vercel.json
const vercelPath = path.join(rootDir, 'vercel.json');
if (fs.existsSync(vercelPath)) {
  let vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
  
  // Safely update or overwrite headers block to ensure staging noindex works
  // We will apply the exact block the user requested but keep the host condition just to be absolutely safe for production, 
  // or actually, since they said "on the staging project", if this repo is strictly the staging project, we can just apply it directly.
  // We'll use exactly what they provided.
  vercelConfig.headers = [
    {
      "source": "/(.*)",
      "headers": [{ "key": "X-Robots-Tag", "value": "noindex" }]
    }
  ];

  fs.writeFileSync(vercelPath, JSON.stringify(vercelConfig, null, 2), 'utf8');
  console.log('vercel.json headers updated with unconditional noindex for the staging project.');
}
