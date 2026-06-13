const https = require('https');
const opts = { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36' }};
https.get('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap', opts, (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const blocks = d.match(/@font-face\s*\{[^}]+\}/g);
    if (blocks) {
      blocks.forEach(b => {
        const weight = b.match(/font-weight:\s*(\d+)/);
        const url = b.match(/url\(([^)]+\.woff2)\)/);
        const subset = b.match(/\/\*\s*(\S+)\s*\*\//);
        if (weight && url) {
          console.log(`w${weight[1]} ${subset ? subset[1] : ''}: ${url[1]}`);
        }
      });
    }
  });
});
