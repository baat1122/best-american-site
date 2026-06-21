const fs = require('fs');

const data = JSON.parse(fs.readFileSync('services/service-data.json', 'utf8'));

function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

const getEmoji = (title) => {
    const t = title.toLowerCase();
    if (t.includes('open')) return '🚗';
    if (t.includes('enclosed')) return '🏎️';
    if (t.includes('door')) return '🏠';
    if (t.includes('expedited')) return '⚡';
    if (t.includes('motorcycle')) return '🏍️';
    if (t.includes('luxury') || t.includes('exotic')) return '💎';
    if (t.includes('military')) return '🎖️';
    if (t.includes('snow')) return '❄️';
    if (t.includes('college')) return '🎓';
    if (t.includes('truck')) return '🛻';
    if (t.includes('corporate')) return '🏢';
    if (t.includes('auction')) return '🔨';
    if (t.includes('dealer')) return '🤝';
    if (t.includes('international') || t.includes('overseas')) return '🚢';
    if (t.includes('alaska')) return '🏔️';
    if (t.includes('hawaii')) return '🏝️';
    if (t.includes('reseller') || t.includes('buyer')) return '💼';
    if (t.includes('rental')) return '🔑';
    if (t.includes('fleet')) return '🚛';
    if (t.includes('another state')) return '🗺️';
    return '🚙';
};

let html = '';
let count = 1;

for (const [title, details] of Object.entries(data)) {
    const slug = slugify(title);
    const emoji = getEmoji(title);
    // Use the details to create a nice sentence.
    const desc = details.benefit.charAt(0).toUpperCase() + details.benefit.slice(1) + '. ' + details.feature.charAt(0).toUpperCase() + details.feature.slice(1) + '.';
    
    html += `                    <!-- Service ${count} -->\n`;
    html += `                    <a href="/services/${slug}.html" class="stripe-card p-8 flex-none w-[85vw] md:w-[400px] snap-start group hover:-translate-y-2 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#800020] bg-white rounded-xl">\n`;
    html += `                        <div class="w-14 h-14 rounded-2xl bg-[#e0e7ff] text-[#800020] flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform shadow-inner">${emoji}</div>\n`;
    html += `                        <h4 class="font-black text-2xl text-[#0a2540] mb-3 group-hover:text-[#800020] transition-colors">${title}</h4>\n`;
    html += `                        <p class="text-[#425466] leading-relaxed mb-6">${desc}</p>\n`;
    html += `                        <span class="text-[#800020] font-bold text-sm uppercase tracking-wider flex items-center gap-1">Learn More <svg aria-hidden="true" class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg></span>\n`;
    html += `                    </a>\n\n`;
    count++;
}

fs.writeFileSync('slider.html', html);
console.log('slider.html generated');
