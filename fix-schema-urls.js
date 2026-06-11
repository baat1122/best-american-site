const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
// Update JSON-LD URL fields
html = html.replace(/"url":\s*"https:\/\/neonautotransport\.com/g, '"url": "https://www.neonautotransport.com');
// Update schema image/logo URLs
html = html.replace(/"https:\/\/neonautotransport\.com\//g, '"https://www.neonautotransport.com/');
fs.writeFileSync('index.html', html, 'utf8');
console.log('JSON-LD schema URLs updated');
