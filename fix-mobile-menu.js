const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SKIP = ['node_modules', '.git', '.vercel', '.vercel-tmp', 'og-images'];

const MOBILE_TOGGLE = `    <script>
        document.addEventListener('DOMContentLoaded', function() {
            var btn = document.getElementById('mobile-menu-btn');
            var menu = document.getElementById('mobile-menu');
            if (btn && menu) btn.addEventListener('click', function() { menu.classList.toggle('hidden'); });
        });
    </script>`;

let added = 0, skipped = 0;

function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (SKIP.includes(entry.name)) continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(full);
        } else if (entry.name.endsWith('.html')) {
            const html = fs.readFileSync(full, 'utf8');
            const rel = path.relative(ROOT, full);
            
            // Skip if no mobile menu button or already has main.js or already has toggle
            if (!html.includes('mobile-menu-btn')) { skipped++; continue; }
            if (html.includes('main.js')) { skipped++; continue; }
            if (html.includes("menu.classList.toggle('hidden')") || html.includes('menu.classList.toggle')) { skipped++; continue; }
            
            // Insert before </body>
            const updated = html.replace('</body>', MOBILE_TOGGLE + '\n</body>');
            fs.writeFileSync(full, updated, 'utf8');
            added++;
            console.log('  Added mobile toggle:', rel);
        }
    }
}

console.log('=== Mobile Menu Toggle Injection ===\n');
walk(ROOT);
console.log(`\nDone. ${added} files updated, ${skipped} skipped.`);
