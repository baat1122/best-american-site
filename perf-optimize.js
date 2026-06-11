const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

function getAllHtmlFiles() {
    const files = [];
    const dirs = ['', 'routes', 'services', 'blog', 'quote', 'dashboard'];
    for (const dir of dirs) {
        const dirPath = path.join(ROOT, dir);
        if (!fs.existsSync(dirPath)) continue;
        for (const f of fs.readdirSync(dirPath)) {
            if (f.endsWith('.html')) {
                files.push(path.join(dirPath, f));
            }
        }
    }
    return files;
}

let totalUpdated = 0;
let totalSkipped = 0;
const stats = { preconnect: 0, heroOpt: 0, lazyImg: 0, deferJs: 0 };

const htmlFiles = getAllHtmlFiles();
console.log(`Found ${htmlFiles.length} HTML files to optimize\n`);

for (const filePath of htmlFiles) {
    const relPath = path.relative(ROOT, filePath);
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // =====================================================
    // 1. PRECONNECT for Unsplash images CDN (route/service pages)
    // =====================================================
    if (content.includes('images.unsplash.com') && !content.includes('preconnect" href="https://images.unsplash.com"')) {
        const fontPreconnect = '<link rel="preconnect" href="https://fonts.googleapis.com">';
        const idx = content.indexOf(fontPreconnect);
        if (idx !== -1) {
            const block = `<link rel="preconnect" href="https://images.unsplash.com" crossorigin>\n    <link rel="dns-prefetch" href="https://images.unsplash.com">\n    `;
            content = content.slice(0, idx) + block + content.slice(idx);
            stats.preconnect++;
        }
    }

    // =====================================================
    // 2. PRECONNECT for external CDNs (index page logos)
    // =====================================================
    if (content.includes('cdn.simpleicons.org') && !content.includes('preconnect" href="https://cdn.simpleicons.org"')) {
        const fontPreconnect = '<link rel="preconnect" href="https://fonts.googleapis.com">';
        const idx = content.indexOf(fontPreconnect);
        if (idx !== -1) {
            const block = `<link rel="preconnect" href="https://cdn.simpleicons.org">\n    <link rel="dns-prefetch" href="https://cdn.simpleicons.org">\n    <link rel="preconnect" href="https://upload.wikimedia.org" crossorigin>\n    <link rel="dns-prefetch" href="https://upload.wikimedia.org">\n    `;
            content = content.slice(0, idx) + block + content.slice(idx);
            stats.preconnect++;
        }
    }

    // =====================================================
    // 3. OPTIMIZE HERO IMAGES (Unsplash) — fetchpriority, decoding, eager
    // =====================================================
    content = content.replace(
        /(<img\s+src="https:\/\/images\.unsplash\.com\/[^"]*")([^>]*)(>)/g,
        (match, before, attrs, after) => {
            let newAttrs = attrs;
            if (!attrs.includes('fetchpriority')) newAttrs += ' fetchpriority="high"';
            if (!attrs.includes('decoding=')) newAttrs += ' decoding="async"';
            if (!attrs.includes('loading=')) newAttrs += ' loading="eager"';
            stats.heroOpt++;
            return before + newAttrs + after;
        }
    );

    // =====================================================
    // 4. LAZY LOAD below-fold images (non-hero local/external images)
    // =====================================================
    content = content.replace(
        /(<img\s+)([^>]*?)(>)/g,
        (match, prefix, attrs, suffix) => {
            // Skip if already has loading or fetchpriority="high" or is Unsplash hero
            if (attrs.includes('loading=') || attrs.includes('fetchpriority="high"') || attrs.includes('images.unsplash.com')) {
                // Just ensure decoding="async" if missing
                if (!attrs.includes('decoding=') && attrs.includes('images.unsplash.com') === false) {
                    return prefix + attrs + ' decoding="async"' + suffix;
                }
                return match;
            }
            // Add lazy loading and async decoding
            let newAttrs = attrs + ' loading="lazy" decoding="async"';
            stats.lazyImg++;
            return prefix + newAttrs + suffix;
        }
    );

    // =====================================================
    // 5. DEFER all external JS files
    // =====================================================
    const jsFiles = ['chatbot.js', 'main.js', 'calculator.js', 'particles.js', 'us-map.js', 'three-truck.js'];
    for (const jsFile of jsFiles) {
        const oldTag = `<script src="/js/${jsFile}"></script>`;
        const newTag = `<script src="/js/${jsFile}" defer></script>`;
        if (content.includes(oldTag)) {
            content = content.replace(oldTag, newTag);
            stats.deferJs++;
        }
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        totalUpdated++;
        console.log(`OK: ${relPath}`);
    } else {
        totalSkipped++;
    }
}

console.log(`\nResults:`);
console.log(`  Files updated: ${totalUpdated}`);
console.log(`  Files skipped: ${totalSkipped}`);
console.log(`  Preconnect hints added: ${stats.preconnect}`);
console.log(`  Hero images optimized: ${stats.heroOpt}`);
console.log(`  Lazy-load images added: ${stats.lazyImg}`);
console.log(`  Script defers added: ${stats.deferJs}`);
