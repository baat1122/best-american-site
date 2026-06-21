const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
// Update JSON-LD URL fields
html = html.replace(/"url":\s*"https:\/\/bestamericanautotransport\.com/g, '"url": "https://www.bestamericanautotransport.com');
// Update schema image/logo URLs
html = html.replace(/"https:\/\/bestamericanautotransport\.com\//g, '"https://www.bestamericanautotransport.com/');
fs.writeFileSync('index.html', html, 'utf8');
console.log('JSON-LD schema URLs updated');
