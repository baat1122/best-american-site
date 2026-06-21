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

let html = '<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">\n';
let count = 1;

for (const [title, details] of Object.entries(data)) {
    const slug = slugify(title);
    const emoji = getEmoji(title);
    const desc = details.benefit.charAt(0).toUpperCase() + details.benefit.slice(1) + '. ' + details.feature.charAt(0).toUpperCase() + details.feature.slice(1) + '.';
    
    html += `                <!-- Service ${count} -->\n`;
    html += `                <div class="stripe-card p-8 flex flex-col items-start bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-transparent hover:border-[#800020] group">\n`;
    html += `                    <div class="w-14 h-14 rounded-2xl bg-[#e0e7ff] text-[#800020] flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform shadow-inner">${emoji}</div>\n`;
    html += `                    <h2 class="text-2xl font-black mb-4 text-[#0a2540] group-hover:text-[#800020] transition-colors">${title}</h2>\n`;
    html += `                    <p class="text-[#425466] mb-8 leading-relaxed flex-grow">${desc}</p>\n`;
    html += `                    <a href="/services/${slug}.html" class="btn-outline w-full text-center mt-auto">Learn More</a>\n`;
    html += `                </div>\n`;
    count++;
}

html += '            </div>';

fs.writeFileSync('services-grid.html', html);
console.log('services-grid.html generated');
