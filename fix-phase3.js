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
const faviconTag = `<link rel="icon" href="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚗</text></svg>">`;

let updatedHtml = 0;

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // 1. Canonical
  content = content.replace(/<link rel="canonical" href="([^"]+)\.html"\s*\/>/g, '<link rel="canonical" href="$1/" />');

  // 2. Breadcrumbs
  content = content.replace(/"@id":\s*"https:\/\/neonautotransport\.com\/services\/index\.html"/g, '"@id": "https://neonautotransport.com/services/"');
  content = content.replace(/"item":\s*"https:\/\/neonautotransport\.com\/services\/index\.html"/g, '"item": "https://neonautotransport.com/services/"');

  // 3. Favicon
  if (!content.includes('rel="icon"')) {
    content = content.replace('</head>', `    ${faviconTag}\n</head>`);
  }

  // 4. Titles (mostly in routes/ and services/)
  if (file.includes('routes') || file.includes('services')) {
    // Current typical title: <title>Virginia Car Shipping | Auto Transport to & from Virginia | Neon Auto Transport</title>
    // We want: <title>Virginia Car Shipping | Neon Auto Transport</title>
    content = content.replace(/<title>([^|]+?)\s*\|.*?Neon Auto Transport<\/title>/g, '<title>$1 | Neon Auto Transport</title>');
  }

  // 5. Dual URL Structure in index.html (and any other pages with the mega menu)
  // Fix slider links: /services/xxx.html to /services/xxx/
  content = content.replace(/href="\/services\/([a-z0-9-]+)\.html"/g, 'href="/services/$1/"');
  
  // Fix Mega Menu links: /xxx-shipping/ to /services/xxx-shipping/
  // The mega menu had links like href="/snow-bird-car-shipping/"
  // We should be careful not to replace root links like /quote/, /why-neon/, /contact/
  const servicesList = [
    'snow-bird-car-shipping', 'military-car-shipping', 'college-car-shipping',
    'luxury-car-shipping', 'car-shipping-to-another-state', 'truck-shipping-services',
    'door-to-door-car-shipping', 'door-to-door-car-transport', 'enclosed-auto-transport', 
    'open-auto-transport', 'car-buyer-auto-transport', 'expedited-auto-transport',
    'car-resellers-auto-transport', 'car-dealer-shipping', 'auto-auction-shipping',
    'rental-car-shipping', 'corporate-relocation', 'fleet-management-transportation-services',
    'motorcycle-shipping', 'alaska-auto-transport', 'hawaii-auto-transport',
    'international-overseas-car-shipping-services', 'open-transport'
  ];
  for (const svc of servicesList) {
    // If it's literally href="/svc/" we change to href="/services/svc/"
    // Also catch href="/svc.html" just in case
    const regex1 = new RegExp(`href="/${svc}/"`, 'g');
    content = content.replace(regex1, `href="/services/${svc}/"`);
    
    const regex2 = new RegExp(`href="/${svc}\\.html"`, 'g');
    content = content.replace(regex2, `href="/services/${svc}/"`);
  }

  // 6. Core Web Vitals: Google Fonts
  // Ensure preconnect exists
  if (content.includes('fonts.googleapis.com')) {
    if (!content.includes('rel="preconnect" href="https://fonts.googleapis.com"')) {
      content = content.replace(/<link href="https:\/\/fonts\.googleapis\.com[^>]+>/, match => {
        return `<link rel="preconnect" href="https://fonts.googleapis.com">\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n    ${match}`;
      });
    }
    // Ensure display=swap
    content = content.replace(/family=Inter:[^"&]+"/g, match => {
      if (!match.includes('display=swap')) {
        return match.replace(/"$/, '&display=swap"');
      }
      return match;
    });
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    updatedHtml++;
  }
}

console.log(`Updated ${updatedHtml} HTML files.`);

// 7. Sitemap fix
const sitemapPath = path.join(rootDir, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  let sitemap = fs.readFileSync(sitemapPath, 'utf8');
  sitemap = sitemap.replace(/\.html<\/loc>/g, '/</loc>');
  // Also remove the open-transport alias if needed, or ensure it uses the proper one.
  sitemap = sitemap.replace(/\/services\/open-transport\//g, '/services/open-auto-transport/');
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  console.log('Sitemap fixed.');
}
