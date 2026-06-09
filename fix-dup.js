const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
// Find the first occurrence of Reviews section and the second one
const firstIdx = html.indexOf('<!-- Reviews & Testimonials -->');
const secondIdx = html.indexOf('<!-- Reviews & Testimonials -->', firstIdx + 1);
if (secondIdx > 0) {
  // Find the end of the second reviews section (</section> after second occurrence)
  const sectionEnd = html.indexOf('</section>', secondIdx) + '</section>'.length;
  // Also remove the trailing newline
  let removeEnd = sectionEnd;
  if (html[removeEnd] === '\r') removeEnd++;
  if (html[removeEnd] === '\n') removeEnd++;
  const fixed = html.substring(0, secondIdx) + html.substring(removeEnd);
  fs.writeFileSync('index.html', fixed, 'utf8');
  console.log('Removed duplicate reviews section');
} else {
  console.log('No duplicate found');
}
