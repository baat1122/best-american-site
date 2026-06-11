const fs = require('fs');
const path = require('path');

const root = 'c:\\Users\\DYNABOOK\\.gemini\\antigravity\\scratch\\neon-site';
const linksBlock = `
                <div class="mt-4 flex items-center justify-center gap-4 text-xs text-[#425466]">
                    <a href="/privacy/" class="hover:text-[#635bff] transition">Privacy Policy</a>
                    <a href="/terms/" class="hover:text-[#635bff] transition">Terms of Service</a>
                </div>`;

function walk(dir) {
    let results = [];
    for (const f of fs.readdirSync(dir)) {
        const full = path.join(dir, f);
        if (fs.statSync(full).isDirectory()) {
            if (f === 'node_modules' || f === '.vercel-tmp') continue;
            results = results.concat(walk(full));
        } else if (f.endsWith('.html')) {
            results.push(full);
        }
    }
    return results;
}

const files = walk(root);
let updated = 0;
let skipped = 0;

for (const file of files) {
    let html = fs.readFileSync(file, 'utf8');

    // Skip if already has Privacy Policy link in footer area
    if (html.includes('Privacy Policy</a>') && html.includes('Terms of Service</a>')) {
        skipped++;
        continue;
    }
    // Also skip if it has "Terms & Conditions" (services/index.html full footer pattern)
    if (html.includes('Privacy Policy</a>') && html.includes('Terms & Conditions</a>')) {
        skipped++;
        continue;
    }

    // Pattern: simple footer copyright line followed by closing divs
    const simplePattern = /(<p class="text-\[#425466\] text-sm font-medium">&copy; 2026 Neon Auto Transport\. All rights reserved\.<\/p>)\s*(<\/div>\s*<\/footer>)/;
    
    if (simplePattern.test(html)) {
        html = html.replace(simplePattern, `$1${linksBlock}\n        $2`);
        fs.writeFileSync(file, html, 'utf8');
        updated++;
        console.log(`  Updated: ${path.relative(root, file)}`);
        continue;
    }

    // Also try: copyright without classes (some pages may have simpler markup)
    const plainPattern = /(<p>&copy; 2026 Neon Auto Transport\. All rights reserved\.<\/p>)\s*(<\/div>\s*<\/footer>|<div class="space-x-6)/;
    
    // For pages that already have the privacy/terms structure but use "Terms & Conditions"
    // Update to "Terms of Service" for consistency
    if (html.includes('Terms & Conditions</a>')) {
        html = html.replace(
            /(<a href="\/terms\/" class="hover:text-\[#635bff\] transition">)Terms & Conditions(<\/a>)/g,
            '$1Terms of Service$2'
        );
        fs.writeFileSync(file, html, 'utf8');
        updated++;
        console.log(`  Renamed Terms: ${path.relative(root, file)}`);
        continue;
    }

    skipped++;
}

console.log(`\nDone! Updated: ${updated}, Skipped: ${skipped}`);
