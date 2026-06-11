const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'routes');
const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.html') && f !== 'route-template.html' && !f.startsWith('generate'));

const maineHeroStart = '<section class="bg-[#f6f9fc] border-b border-[#e6e6e6]">';
let converted = 0;
let skipped = 0;

for (const file of files) {
    const filePath = path.join(routesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Skip if already has bright Maine-style hero
    if (content.includes(maineHeroStart)) {
        skipped++;
        continue;
    }

    // Find hero section boundaries
    const heroCommentIdx = content.indexOf('<!-- Hero Section -->');
    if (heroCommentIdx === -1) {
        console.log(`SKIP (no hero comment): ${file}`);
        continue;
    }

    // Find the <section that starts the hero (after the comment)
    const heroSectionStart = content.indexOf('<section', heroCommentIdx);
    if (heroSectionStart === -1) {
        console.log(`SKIP (no section start): ${file}`);
        continue;
    }

    // Find the closing </section> for the hero
    // Need to handle nested sections - count opening/closing
    let depth = 0;
    let heroSectionEnd = -1;
    let searchIdx = heroSectionStart;
    while (searchIdx < content.length) {
        const nextOpen = content.indexOf('<section', searchIdx);
        const nextClose = content.indexOf('</section>', searchIdx);
        
        if (nextClose === -1) break;
        
        if (nextOpen !== -1 && nextOpen < nextClose) {
            depth++;
            searchIdx = nextOpen + 8;
        } else {
            depth--;
            if (depth === 0) {
                heroSectionEnd = nextClose + 10; // include </section>
                break;
            }
            searchIdx = nextClose + 10;
        }
    }

    if (heroSectionEnd === -1) {
        console.log(`SKIP (no section end): ${file}`);
        continue;
    }

    const heroHtml = content.substring(heroSectionStart, heroSectionEnd);

    // Extract H1 text
    const h1Match = heroHtml.match(/<h1[^>]*>(.*?)<\/h1>/s);
    if (!h1Match) {
        console.log(`SKIP (no h1): ${file}`);
        continue;
    }
    const h1Text = h1Match[1].trim();

    // Extract description paragraph
    // Look for the main description <p> tag
    const pMatch = heroHtml.match(/<p[^>]*class="[^"]*(?:text-\[#425466\]|text-white\/90|text-\[#cdd5df\])[^"]*"[^>]*>(.*?)<\/p>/s);
    if (!pMatch) {
        console.log(`SKIP (no description p): ${file}`);
        continue;
    }
    const descText = pMatch[1].trim();

    // Extract image URL
    const imgMatch = heroHtml.match(/<img\s+src="([^"]+)"/);
    const imgUrl = imgMatch ? imgMatch[1] : 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=60';

    // Extract CTA button text
    const ctaMatch = heroHtml.match(/<a[^>]*href="\/quote\/"[^>]*>\s*(.*?)(?:\s*<svg|$)/s);
    let ctaText = 'Calculate Your Rate Instantly';
    if (ctaMatch) {
        ctaText = ctaMatch[1].replace(/\s+/g, ' ').trim();
        // Clean up common artifacts
        ctaText = ctaText.replace(/\s*→\s*$/, '').trim();
    }

    // Build bright hero HTML (Maine style)
    const brightHero = `<section class="bg-[#f6f9fc] border-b border-[#e6e6e6]">
            <div class="flex flex-col lg:flex-row">
                <div class="lg:w-1/2 px-8 py-20 lg:py-32 lg:px-16 flex flex-col justify-center">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#e6e6e6] bg-white shadow-sm text-[#0a2540] text-xs font-bold mb-6 self-start">
                        <span class="w-2 h-2 rounded-full bg-[#39FF14]"></span>
                        FMCSA & US Dot Approved
                    </div>
                    <h1 class="text-4xl md:text-5xl lg:text-6xl font-black text-[#0a2540] mb-6 tracking-tight">${h1Text}</h1>
                    <p class="text-lg text-[#425466] mb-10 leading-relaxed">${descText}</p>
                    <div class="flex">
                        <a href="/quote/" class="bg-[#39FF14] text-[#0a2540] px-8 py-4 rounded-full font-black text-lg hover:bg-[#32e011] transition shadow-[0_0_15px_rgba(57,255,20,0.4)] flex items-center gap-2">
                            ${ctaText} 
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </a>
                    </div>
                </div>
                <div class="lg:w-1/2 relative min-h-[400px]">
                    <img src="${imgUrl}" alt="${h1Text}" class="absolute inset-0 w-full h-full object-cover" width="1200" height="800">
                    <div class="absolute inset-0 bg-gradient-to-r from-[#f6f9fc] to-transparent w-32"></div>
                </div>
            </div>
        </section>`;

    // Replace the hero section
    content = content.substring(0, heroSectionStart) + brightHero + content.substring(heroSectionEnd);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`CONVERTED: ${file}`);
    converted++;
}

console.log(`\nDone! Converted: ${converted}, Skipped (already bright): ${skipped}`);
