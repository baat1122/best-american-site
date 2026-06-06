const fs = require('fs');
const content = fs.readFileSync('services/index.html', 'utf8');
const gridHtml = fs.readFileSync('services-grid.html', 'utf8');

const startStr = '<div class="grid md:grid-cols-2 gap-12">';
const endStr = '</div>\n            \n            <div class="mt-20 stripe-card';

const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf(endStr);

if (startIdx > -1 && endIdx > -1) {
    const newContent = content.slice(0, startIdx) + gridHtml + '\n            ' + content.slice(endIdx + 6); // skip the '</div>' since it's in our gridHtml
    fs.writeFileSync('services/index.html', newContent);
    console.log('Injected services grid into services/index.html');
} else {
    console.error('Could not find injection boundaries.');
}
