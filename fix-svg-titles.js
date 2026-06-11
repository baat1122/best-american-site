const fs = require('fs');
const f = 'index.html';
let content = fs.readFileSync(f, 'utf8');

// Remove all <title>...</title> inside the SVG (state names + DC)
// These are inside the us-map-container SVG only
const svgStart = content.indexOf('<div id="us-map-container"');
const svgEnd = content.indexOf('</div>', svgStart) + 6;
let svgSection = content.substring(svgStart, svgEnd);

// Count and remove <title>StateName</title> patterns
const titleRegex = /\n?<title>[A-Za-z\s.]+<\/title>/g;
const matches = svgSection.match(titleRegex);
console.log('Found ' + (matches ? matches.length : 0) + ' title elements to remove');

svgSection = svgSection.replace(titleRegex, '');
content = content.substring(0, svgStart) + svgSection + content.substring(svgEnd);

fs.writeFileSync(f, content, 'utf8');
console.log('Done - removed all SVG title tooltips');
