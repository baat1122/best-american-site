const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                processDir(fullPath);
            }
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf-8');
            let modified = false;

            // 1. Fix mobile menu btn aria-label
            if (content.includes('id="mobile-menu-btn"') && !content.includes('aria-label=')) {
                content = content.replace(/<button id="mobile-menu-btn" class="/g, '<button id="mobile-menu-btn" aria-label="Toggle mobile menu" class="');
                modified = true;
            }

            // 2. Fix footer heading tags h4 -> h3
            if (content.includes('<h4 class="text-[#0a2540] font-bold mb-4 text-sm">Quick Links</h4>')) {
                content = content.replace(/<h4 class="text-\[#0a2540\] font-bold mb-4 text-sm">Quick Links<\/h4>/g, '<h3 class="text-[#0a2540] font-bold mb-4 text-sm">Quick Links</h3>');
                content = content.replace(/<h4 class="text-\[#0a2540\] font-bold mb-4 text-sm">Contact Us<\/h4>/g, '<h3 class="text-[#0a2540] font-bold mb-4 text-sm">Contact Us</h3>');
                modified = true;
            }
            
            // 3. Fix footer span and footer contrast
            const footerStart = content.indexOf('<footer');
            if (footerStart !== -1) {
                const beforeFooter = content.substring(0, footerStart);
                let footerSection = content.substring(footerStart);
                
                if (footerSection.includes('<span class="text-[#00d4ff]">AUTO TRANSPORT</span>')) {
                    footerSection = footerSection.replace(/<span class="text-\[#00d4ff\]">AUTO TRANSPORT<\/span>/g, '<span class="text-[#0066cc]">AUTO TRANSPORT</span>');
                    modified = true;
                }
                
                if (footerSection.includes('<footer class="bg-white pt-20 pb-10">')) {
                    footerSection = footerSection.replace(/<footer class="bg-white pt-20 pb-10">/g, '<footer class="bg-white text-[#425466] pt-20 pb-10">');
                    modified = true;
                }
                
                if (modified) {
                    content = beforeFooter + footerSection;
                }
            }

            if (modified) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}
processDir(__dirname);
