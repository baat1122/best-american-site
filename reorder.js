const fs = require('fs');

const filePath = 'index.html';
const content = fs.readFileSync(filePath, 'utf-8');

const markers = {
    hero: '        <!-- Stripe Animated Gradient Hero (Slanted) -->',
    backbone: '        <!-- The Backbone Section & Data Fountain -->',
    marquee: '        <!-- Trusted Brands Marquee (Logos) -->',
    poster: '        <!-- ═══════════════════════════════════════════════════════════════ -->\r\n        <!-- Cinematic Sticky Scroll "Poster" Section                      -->',
    how: '        <!-- How It Works (Staggered Grid Layout) -->',
    transit: '        <!-- Transit Time Delivery Timeline Section -->',
    map: '        <!-- Interactive US Map Section -->',
    services: '        <!-- Services -->',
    compare: '        <!-- Competitor Comparison Section -->'
};

// Fallback for different line endings
if (!content.includes(markers.poster)) {
    markers.poster = '        <!-- ═══════════════════════════════════════════════════════════════ -->\n        <!-- Cinematic Sticky Scroll "Poster" Section                      -->';
}

const indices = {};
for (const [name, marker] of Object.entries(markers)) {
    const idx = content.indexOf(marker);
    if (idx === -1) {
        console.error(`Missing marker: ${name}`);
        process.exit(1);
    }
    indices[name] = idx;
}

// Order of appearance in current file
const sortedNames = Object.keys(indices).sort((a, b) => indices[a] - indices[b]);

// Extract sections
const sections = {};
for (let i = 0; i < sortedNames.length; i++) {
    const start = indices[sortedNames[i]];
    const end = i < sortedNames.length - 1 ? indices[sortedNames[i+1]] : content.indexOf('        <!-- Trustindex Reviews Section -->');
    
    sections[sortedNames[i]] = content.slice(start, end);
}

const beforeSections = content.slice(0, indices[sortedNames[0]]);
const afterSections = content.slice(content.indexOf('        <!-- Trustindex Reviews Section -->'));

// Build new content in the requested order
// Hero -> How -> Services -> Poster -> Transit -> Map -> Backbone + Marquee -> Compare
const newOrder = [
    'hero',
    'how',
    'services',
    'poster',
    'transit',
    'map',
    'backbone',
    'marquee',
    'compare'
];

let newContent = beforeSections;
for (const name of newOrder) {
    newContent += sections[name];
}
newContent += afterSections;

fs.writeFileSync('index.html.new', newContent);
console.log('Successfully reordered sections to index.html.new');
