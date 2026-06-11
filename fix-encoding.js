const fs = require('fs');
const f = 'blog/how-much-does-it-cost-to-ship-a-car-across-the-country.html';
const buf = fs.readFileSync(f);
let hex = buf.toString('hex');
let count = 0;

// Checkmark: UTF-8 E2 9C 93 corrupted patterns
// Pattern 1: c3 a2 c5 93 e2 80 9c (triple-encoded checkmark)
const p1 = 'c3a2c593e2809c';
const fix = 'e29c93'; // correct UTF-8 for ✓

while (hex.includes(p1)) {
  hex = hex.replace(p1, fix);
  count++;
}

// Also fix 30"40% -> 30-40% (corrupted en dash between numbers)
// The " between 30 and 40 should be an en dash or hyphen
hex = hex.replace(/30e2809c34/g, '30e2809334'); // 30"40 -> 30–40 (en dash)

fs.writeFileSync(f, Buffer.from(hex, 'hex'));
console.log('Fixed ' + count + ' checkmarks');

// Verify
const v = fs.readFileSync(f, 'utf8');
const lines = v.split('\n');
[287,288,289,290,298,299,300,301].forEach(l => {
  if (lines[l-1]) console.log('L' + l + ': ' + lines[l-1].trim().substring(0, 120));
});
