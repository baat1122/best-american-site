const fs = require('fs');
const path = require('path');

const rootDir = 'c:/Users/DYNABOOK/.gemini/antigravity/scratch/neon-site';

function getAllHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllHtmlFiles(filePath, fileList);
    } else if (filePath.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const htmlFiles = getAllHtmlFiles(rootDir);
let count = 0;

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  if (!content.includes('"@type": "FAQPage"')) {
    const faqs = [];
    const detailsRegex = /<summary[^>]*>([\s\S]*?)<span[^>]*>[\s\S]*?<\/span>[\s\S]*?<\/summary>\s*<div[^>]*>([\s\S]*?)<\/div>/g;
    let match;
    while ((match = detailsRegex.exec(content)) !== null) {
      let q = match[1].replace(/<[^>]+>/g, '').trim();
      let a = match[2].replace(/<[^>]+>/g, '').trim();
      if (q && a) {
        faqs.push({
          "@type": "Question",
          "name": q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": a
          }
        });
      }
    }
    
    if (faqs.length === 0) {
      const qRegex = /<h[34][^>]*>([\s\S]*?\?)<\/h[34]>\s*<p[^>]*>([\s\S]*?)<\/p>/g;
      while ((match = qRegex.exec(content)) !== null) {
        faqs.push({
          "@type": "Question",
          "name": match[1].replace(/<[^>]+>/g, '').trim(),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": match[2].replace(/<[^>]+>/g, '').trim()
          }
        });
      }
    }

    if (faqs.length > 0) {
      const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs
      };
      const scriptTag = `\n    <!-- JSON-LD: FAQPage -->\n    <script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n    </script>\n`;
      content = content.replace('</head>', `${scriptTag}</head>`);
      count++;
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Added FAQ to: ${file}`);
  }
}

console.log(`Total pages updated with FAQ schema: ${count}`);
