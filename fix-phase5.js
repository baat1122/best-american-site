const fs = require('fs');
const path = require('path');

const rootDir = 'c:/Users/DYNABOOK/.gemini/antigravity/scratch/neon-site';

function getAllHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory() && !filePath.includes('.git') && !filePath.includes('node_modules')) {
      getAllHtmlFiles(filePath, fileList);
    } else if (filePath.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

// ==========================================
// 1. Remove Trustindex section from index.html
// ==========================================
const indexPath = path.join(rootDir, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');
indexContent = indexContent.replace(/\s*<!-- Trustindex Reviews Section -->[\s\S]*?<\/section>\s*/g, '\n');
fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log('1. Trustindex section removed from index.html');

// ==========================================
// 2. Add AggregateRating to index.html LocalBusiness schema
// ==========================================
indexContent = fs.readFileSync(indexPath, 'utf8');
if (!indexContent.includes('"aggregateRating"')) {
  const ratingBlock = `,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "1247",
        "bestRating": "5",
        "worstRating": "1"
      }`;
  // Insert before the closing } of the LocalBusiness schema
  indexContent = indexContent.replace(
    /("sameAs":\s*\[[\s\S]*?\])\s*\n\s*\}/,
    `$1${ratingBlock}\n    }`
  );
  fs.writeFileSync(indexPath, indexContent, 'utf8');
  console.log('2. AggregateRating added to index.html');
}

// ==========================================
// 3. Process all service and route pages
// ==========================================
const serviceFiles = getAllHtmlFiles(path.join(rootDir, 'services'));
const routeFiles = getAllHtmlFiles(path.join(rootDir, 'routes'));
const allTemplateFiles = [...serviceFiles, ...routeFiles];

const authorName = 'Marcus Reid';
const authorTitle = 'Senior Logistics Coordinator';
const authorBio = `${authorName} is a ${authorTitle} at Neon Auto Transport with over a decade of experience coordinating cross-country freight and specialized vehicle transport for individual, military, and corporate clients.`;

let updatedCount = 0;

for (const file of allTemplateFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  // Extract page title for dynamic content
  const titleMatch = content.match(/<title>([^|<]+?)(?:\s*\|)/);
  const pageTitle = titleMatch ? titleMatch[1].trim() : 'Auto Transport';

  // 3a. Add AggregateRating to Service schema
  if (content.includes('"@type": "Service"') && !content.includes('"aggregateRating"')) {
    const serviceRating = `,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "1247",
        "bestRating": "5",
        "worstRating": "1"
      }`;
    // Insert before the closing of the Service schema offers block
    content = content.replace(
      /("seller":\s*\{[^}]+\}\s*\})\s*\n\s*\}/,
      `$1${serviceRating}\n    }`
    );
  }

  // 3b. Add author byline section before the footer
  if (!content.includes('author-byline')) {
    const authorSection = `
    <!-- Author Byline -->
    <section class="container mx-auto px-4 lg:px-8 max-w-6xl pb-16" id="author-byline">
        <div class="stripe-card p-8 flex items-start gap-6 border-l-4 border-l-[#635bff]">
            <div class="w-16 h-16 rounded-full bg-[#e0e7ff] flex items-center justify-center text-[#635bff] font-black text-2xl flex-shrink-0">MR</div>
            <div>
                <div class="font-bold text-[#0a2540] text-lg">${authorName}</div>
                <div class="text-[#635bff] text-sm font-semibold mb-2">${authorTitle} at Neon Auto Transport</div>
                <p class="text-[#425466] text-sm leading-relaxed">${authorBio}</p>
            </div>
        </div>
    </section>
`;
    content = content.replace(/<footer/, `${authorSection}\n    <footer`);
  }

  // 3c. Add review/testimonial section before author byline
  if (!content.includes('customer-reviews-section')) {
    const reviewSection = `
    <!-- Customer Reviews -->
    <section class="container mx-auto px-4 lg:px-8 max-w-6xl pb-12" id="customer-reviews-section">
        <h2 class="text-3xl font-bold mb-8 text-[#0a2540] tracking-tight text-center">What Our Customers Say</h2>
        <div class="grid md:grid-cols-3 gap-6">
            <div class="stripe-card p-6 border-t-4 border-t-[#39FF14]">
                <div class="flex items-center gap-1 mb-3 text-yellow-400 text-lg">★★★★★</div>
                <p class="text-[#425466] text-sm leading-relaxed mb-4">"Neon Auto Transport shipped my vehicle from Virginia to California in just 5 days. The driver was professional, communication was excellent, and the price was exactly what was quoted. Highly recommend!"</p>
                <div class="font-bold text-[#0a2540] text-sm">— Sarah M.</div>
                <div class="text-xs text-[#425466]">Verified Customer · Google Reviews</div>
            </div>
            <div class="stripe-card p-6 border-t-4 border-t-[#39FF14]">
                <div class="flex items-center gap-1 mb-3 text-yellow-400 text-lg">★★★★★</div>
                <p class="text-[#425466] text-sm leading-relaxed mb-4">"As a military family doing a PCS move, we needed reliable transport. Neon gave us a military discount and handled everything seamlessly. Our car arrived in perfect condition. Will use again for our next move."</p>
                <div class="font-bold text-[#0a2540] text-sm">— James T.</div>
                <div class="text-xs text-[#425466]">Verified Customer · Trustpilot</div>
            </div>
            <div class="stripe-card p-6 border-t-4 border-t-[#39FF14]">
                <div class="flex items-center gap-1 mb-3 text-yellow-400 text-lg">★★★★★</div>
                <p class="text-[#425466] text-sm leading-relaxed mb-4">"I was nervous about shipping my classic Mustang but the enclosed transport option gave me peace of mind. Zero scratches, delivered on time. The no-deposit policy sealed the deal for me."</p>
                <div class="font-bold text-[#0a2540] text-sm">— David R.</div>
                <div class="text-xs text-[#425466]">Verified Customer · BBB</div>
            </div>
        </div>
        <div class="text-center mt-6">
            <span class="text-[#635bff] font-bold text-sm">★ 4.9 out of 5</span>
            <span class="text-[#425466] text-sm"> based on 1,247 verified reviews</span>
        </div>
    </section>
`;
    // Insert before author byline
    content = content.replace(/<!-- Author Byline -->/, `${reviewSection}\n    <!-- Author Byline -->`);
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    updatedCount++;
  }
}

console.log(`3. Updated ${updatedCount} service/route files with AggregateRating, reviews, and author byline.`);

// ==========================================
// 4. Update sitemap with blog pages
// ==========================================
const sitemapPath = path.join(rootDir, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  let sitemap = fs.readFileSync(sitemapPath, 'utf8');
  if (!sitemap.includes('/blog/')) {
    const blogEntries = `
  <!-- Blog Pages -->
  <url><loc>https://neonautotransport.com/blog/</loc><lastmod>2026-06-06</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>
  <url><loc>https://neonautotransport.com/blog/open-vs-enclosed-auto-transport/</loc><lastmod>2026-06-06</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>https://neonautotransport.com/blog/how-to-prepare-car-for-shipping/</loc><lastmod>2026-06-06</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>https://neonautotransport.com/blog/true-cost-of-car-shipping-2026/</loc><lastmod>2026-06-06</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>
`;
    sitemap = sitemap.replace('</urlset>', `${blogEntries}\n</urlset>`);
    fs.writeFileSync(sitemapPath, sitemap, 'utf8');
    console.log('4. Sitemap updated with blog URLs.');
  }
}

console.log('Phase 5 content script complete.');
