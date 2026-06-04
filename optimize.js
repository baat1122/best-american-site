const fs = require('fs');
const path = require('path');

function processDir(dir, depth = 0) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'css' && file !== 'images' && file !== 'js') {
                processDir(fullPath, depth + 1);
            }
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf-8');
            let cssPath = depth === 0 ? 'css/tailwind.css' : '../css/tailwind.css';
            
            // Fix for nested dirs just in case
            if(fullPath.includes('quote\\index.html') || fullPath.includes('quote/index.html')) cssPath = '../css/tailwind.css';

            if (content.includes('<script src="https://cdn.tailwindcss.com"></script>')) {
                content = content.replace(/<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>/g, `<link rel="stylesheet" href="${cssPath}">`);
                fs.writeFileSync(fullPath, content);
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}
processDir(__dirname);
