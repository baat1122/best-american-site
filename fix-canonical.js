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

// 1. Update all canonical URLs to use www
const allHtml = walkDir(__dirname);
let canonCount = 0;
for (const filePath of allHtml) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('href="https://neonautotransport.com/')) {
    content = content.replace(
      /href="https:\/\/neonautotransport\.com\//g,
      'href="https://www.neonautotransport.com/'
    );
    fs.writeFileSync(filePath, content, 'utf8');
    canonCount++;
  }
}
console.log('Updated canonicals in ' + canonCount + ' files');

// Also update og:url and og:image and other meta URLs
let ogCount = 0;
for (const filePath of allHtml) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('content="https://neonautotransport.com/')) {
    content = content.replace(
      /content="https:\/\/neonautotransport\.com\//g,
      'content="https://www.neonautotransport.com/'
    );
    fs.writeFileSync(filePath, content, 'utf8');
    ogCount++;
  }
}
console.log('Updated og: URLs in ' + ogCount + ' files');
