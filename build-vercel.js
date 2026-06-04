const fs = require('fs');
const path = require('path');

const siteDir = __dirname;
const vercelConfig = {
  cleanUrls: true,
  trailingSlash: true,
  rewrites: []
};

// Map files in a specific directory to the root
function mapDirectory(dirName) {
  const dirPath = path.join(siteDir, dirName);
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      if (file.endsWith('.html') && file !== 'index.html') {
        const slug = file.replace('.html', '');
        vercelConfig.rewrites.push({
          source: `/${slug}`,
          destination: `/${dirName}/${slug}`
        });
      }
    }
  }
}

mapDirectory('routes');
mapDirectory('services');

fs.writeFileSync(path.join(siteDir, 'vercel.json'), JSON.stringify(vercelConfig, null, 2));
console.log('vercel.json generated successfully with ' + vercelConfig.rewrites.length + ' rewrites.');
