const fs = require('fs');
const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));

vercel.rewrites = vercel.rewrites.map(rw => {
  // Ensure source ends with slash
  if (rw.source && !rw.source.endsWith('/')) {
    rw.source = rw.source + '/';
  }
  
  // Ensure destination ends with slash and has no .html
  if (rw.destination) {
    if (rw.destination.endsWith('.html')) {
      rw.destination = rw.destination.replace('.html', '');
    }
    if (!rw.destination.endsWith('/')) {
      rw.destination = rw.destination + '/';
    }
  }
  return rw;
});

fs.writeFileSync('vercel.json', JSON.stringify(vercel, null, 2));
console.log('Fixed vercel.json for Vercel trailing slashes');
