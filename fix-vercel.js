const fs = require('fs');
const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));

vercel.rewrites = vercel.rewrites.map(rw => {
  if (rw.source && !rw.source.endsWith('/')) {
    rw.source = rw.source + '/';
  }
  // To be safe with Vercel routing, map to the exact HTML file
  if (rw.destination && !rw.destination.endsWith('.html') && rw.destination.includes('/')) {
    rw.destination = rw.destination + '.html';
  }
  return rw;
});

fs.writeFileSync('vercel.json', JSON.stringify(vercel, null, 2));
console.log('Fixed vercel.json');
