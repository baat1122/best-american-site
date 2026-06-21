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

  // 1. og:url remove .html
  content = content.replace(/<meta property="og:url" content="([^"]+)\.html">/g, '<meta property="og:url" content="$1/">');

  // 2. Service schema url remove .html
  content = content.replace(/"url":\s*"https:\/\/bestamericanautotransport\.com\/([^"]+)\.html"/g, '"url": "https://bestamericanautotransport.com/$1/"');

  // 3. BreadcrumbList item 3 remove .html
  content = content.replace(/"item":\s*"https:\/\/bestamericanautotransport\.com\/([^"]+)\.html"/g, '"item": "https://bestamericanautotransport.com/$1/"');

  // 4. Header Locations Link
  content = content.replace(/href="\.\.\/locations\.html"/g, 'href="/locations/"');

  // 5. Hero Image Alt Text
  content = content.replace(/<img\s+src="https:\/\/trucknroll\.com[^"]+"/g, match => {
    if (!match.includes('alt=')) {
      return match + ' alt="Best American Auto Transport Inc Carrier"';
    }
    return match;
  });

  // 6. Keywords Meta
  content = content.replace(/<meta name="keywords"[^>]*>\r?\n?/gi, '');

  // 7. Google Fonts Async Load
  content = content.replace(/<link href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]+" rel="stylesheet">/g, match => {
    if (!match.includes('media="print"')) {
      const url = match.match(/href="([^"]+)"/)[1];
      return `<link href="${url}" rel="stylesheet" media="print" onload="this.media='all'">\n    <noscript><link href="${url}" rel="stylesheet"></noscript>`;
    }
    return match;
  });

  // 8. Replace SVG favicon with proper icon links
  content = content.replace(/<link rel="icon" href="data:image\/svg\+xml[^>]+>\r?\n?/g, '');
  if (!content.includes('href="/favicon.ico"')) {
    const faviconTags = `
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
`;
    content = content.replace('</head>', `${faviconTags}</head>`);
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    updatedFiles++;
  }
}

console.log(`Phase 4 bugs fixed in ${updatedFiles} files.`);

// 9. Vercel.json X-Robots-Tag
const vercelPath = path.join(rootDir, 'vercel.json');
if (fs.existsSync(vercelPath)) {
  let vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
  if (!vercelConfig.headers) {
    vercelConfig.headers = [];
  }
  // Check if header already exists
  const hasRobotsHeader = vercelConfig.headers.some(h => h.source === '/(.*)' && h.has && h.has.some(c => c.value === '.*vercel\\.app$'));
  if (!hasRobotsHeader) {
    vercelConfig.headers.push({
      "source": "/(.*)",
      "has": [
        {
          "type": "host",
          "value": ".*vercel\\.app$"
        }
      ],
      "headers": [
        {
          "key": "X-Robots-Tag",
          "value": "noindex, nofollow"
        }
      ]
    });
    fs.writeFileSync(vercelPath, JSON.stringify(vercelConfig, null, 2), 'utf8');
    console.log('vercel.json updated with X-Robots-Tag for staging.');
  }
}

// 10. Update Sitemap lastmod to today
const sitemapPath = path.join(rootDir, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  let sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const today = new Date().toISOString().split('T')[0];
  sitemap = sitemap.replace(/<lastmod>[^<]+<\/lastmod>/g, `<lastmod>${today}</lastmod>`);
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  console.log('sitemap.xml lastmod updated.');
}

// 11. Generate dummy Favicons
// 1x1 transparent PNG
const png1x1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
fs.writeFileSync(path.join(rootDir, 'favicon.ico'), png1x1);
fs.writeFileSync(path.join(rootDir, 'favicon-16x16.png'), png1x1);
fs.writeFileSync(path.join(rootDir, 'favicon-32x32.png'), png1x1);
console.log('Dummy favicons generated.');
