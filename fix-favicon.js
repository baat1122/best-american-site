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

const emojiLine = '<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><text y=\'.9em\' font-size=\'90\'>\uD83D\uDE97</text></svg>">';
const allHtml = walkDir(__dirname);
let count = 0;
for (const filePath of allHtml) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('viewBox=\'0 0 100 100\'') && content.includes('font-size=\'90\'')) {
    // Remove the emoji SVG favicon line
    content = content.replace(/\s*<link rel="icon" type="image\/svg\+xml" href="data:image\/svg\+xml,<svg[^"]*<\/svg>">\r?\n?/g, '\n');
    fs.writeFileSync(filePath, content, 'utf8');
    count++;
    console.log('Fixed: ' + path.relative(__dirname, filePath));
  }
}
console.log('Total files fixed: ' + count);
