// inject-chatbot.js — Adds chatbot CSS+JS to all HTML files
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SKIP_DIRS = ['node_modules', '.git', 'dashboard'];
const SKIP_FILES = ['route-template.html'];

const CSS_TAG = '    <link rel="stylesheet" href="/css/chatbot.css">';
const JS_TAG = '    <script src="/js/chatbot.js"><\/script>';
const INJECT_MARKER = '<!-- Best American AI Chat Widget -->';

function walkDir(dir, files = []) {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
        if (SKIP_DIRS.includes(entry)) continue;
        const fullPath = path.join(dir, entry);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walkDir(fullPath, files);
        } else if (entry.endsWith('.html') && !SKIP_FILES.includes(entry)) {
            files.push(fullPath);
        }
    }
    return files;
}

const htmlFiles = walkDir(ROOT);
let modified = 0;
let skipped = 0;

for (const filePath of htmlFiles) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Skip if already injected
    if (content.includes('chatbot.js') || content.includes('chatbot.css')) {
        console.log(`SKIP (already has chatbot): ${path.relative(ROOT, filePath)}`);
        skipped++;
        continue;
    }

    // Find </body> and inject before it
    const bodyCloseIdx = content.lastIndexOf('</body>');
    if (bodyCloseIdx === -1) {
        console.log(`SKIP (no </body>): ${path.relative(ROOT, filePath)}`);
        skipped++;
        continue;
    }

    const injection = `\n${INJECT_MARKER}\n${CSS_TAG}\n${JS_TAG}\n\n`;
    content = content.slice(0, bodyCloseIdx) + injection + content.slice(bodyCloseIdx);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`INJECTED: ${path.relative(ROOT, filePath)}`);
    modified++;
}

console.log(`\nDone! Modified: ${modified}, Skipped: ${skipped}, Total scanned: ${htmlFiles.length}`);
