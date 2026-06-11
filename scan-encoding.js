const fs = require('fs');
const f = 'blog/how-much-does-it-cost-to-ship-a-car-across-the-country.html';
const buf = fs.readFileSync(f);
const hex = buf.toString('hex');

// Check for any remaining double-encoded patterns (common PowerShell BOM corruption)
// Pattern: c3 XX (where XX is a2-a6, a8-ae, b0-b6, b8-be) = double-encoded 2-byte chars
// Pattern: c5 93 = œ (often part of corrupted checkmark)
const suspicious = hex.match(/c3[a2-ae]|c593/g);
if (suspicious) {
  console.log('Found ' + suspicious.length + ' suspicious byte sequences');
  // Show context around each
  suspicious.slice(0, 5).forEach(s => {
    const idx = hex.indexOf(s);
    const start = Math.max(0, idx - 20);
    const end = Math.min(hex.length, idx + 30);
    const context = Buffer.from(hex.substring(start, end), 'hex').toString('utf8');
    console.log('  At ' + idx + ': ' + JSON.stringify(context));
  });
} else {
  console.log('No remaining encoding issues found!');
}

// Count correct characters
const text = fs.readFileSync(f, 'utf8');
console.log('Checkmarks: ' + (text.match(/\u2713/g) || []).length);
console.log('Em dashes: ' + (text.match(/\u2014/g) || []).length);
console.log('En dashes: ' + (text.match(/\u2013/g) || []).length);
