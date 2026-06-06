const fs = require('fs');
const path = require('path');

const rootDir = 'c:/Users/DYNABOOK/.gemini/antigravity/scratch/neon-site';

function getAllHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory() && !filePath.includes('.git')) {
      getAllHtmlFiles(filePath, fileList);
    } else if (filePath.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const htmlFiles = getAllHtmlFiles(rootDir);
let hubCityFixes = 0;

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Hub City I-95/I-81 bug
  content = content.replace(/Spots close to I-95 or I-81 attract more carriers/g, 'Spots close to major interstates attract more carriers');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    hubCityFixes++;
  }
}

console.log(`Hub city bugs fixed in ${hubCityFixes} files.`);

// 2. Fix Sitemap
const sitemapPath = path.join(rootDir, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  let sitemap = fs.readFileSync(sitemapPath, 'utf8');
  sitemap = sitemap.replace(/\/services\/enclosed-transport\.html/g, '/services/enclosed-auto-transport.html');
  sitemap = sitemap.replace(/\/services\/luxury-exotic-car-shipping-services\.html/g, '/services/luxury-car-shipping.html');
  sitemap = sitemap.replace(/\/services\/door-to-door-car-transport\.html/g, '/services/door-to-door-car-shipping.html');
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  console.log('Sitemap fixed.');
}

// 3. Add HowTo Schema to index.html
const indexPath = path.join(rootDir, 'index.html');
if (fs.existsSync(indexPath)) {
  let indexHtml = fs.readFileSync(indexPath, 'utf8');
  if (!indexHtml.includes('"@type": "HowTo"')) {
    const howToSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Ship a Car with Neon Auto Transport",
      "description": "The complete 3-step process to transport your vehicle safely across the country.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Request a Free Quote",
          "text": "Fill out our online form or call us to get an instant, guaranteed price for your auto transport."
        },
        {
          "@type": "HowToStep",
          "name": "Schedule Pickup",
          "text": "Choose a date and time. Our vetted carrier will arrive at your location to inspect and load your vehicle."
        },
        {
          "@type": "HowToStep",
          "name": "Receive Your Vehicle",
          "text": "Your vehicle is safely delivered to your destination. Perform a final inspection and sign off."
        }
      ]
    };
    const schemaStr = `\n    <!-- JSON-LD: HowTo -->\n    <script type="application/ld+json">\n${JSON.stringify(howToSchema, null, 2)}\n    </script>\n`;
    indexHtml = indexHtml.replace('</head>', `${schemaStr}</head>`);
    fs.writeFileSync(indexPath, indexHtml, 'utf8');
    console.log('HowTo schema added to index.html.');
  }
}

// 4. Expand llms.txt
const llmsPath = path.join(rootDir, 'llms.txt');
if (fs.existsSync(llmsPath)) {
  let llms = fs.readFileSync(llmsPath, 'utf8');
  if (!llms.includes('Delivery Math')) {
    const additions = `

## Delivery Math (Estimated Transit Times)
- 0 - 500 miles: 1 to 2 days
- 500 - 1000 miles: 2 to 3 days
- 1000 - 1500 miles: 3 to 5 days
- 1500 - 2000 miles: 4 to 7 days
- 2000 - 2500 miles: 5 to 9 days
- 2500 - 3000+ miles: 7 to 10 days
*Note: Weather, traffic, and specific route popularity can affect these estimates.*

## Top 10 FAQs (Extended)
Q: Is my vehicle insured during transit?
A: Yes. Every carrier carries active cargo insurance.

Q: Can I track my shipment?
A: Yes. Regular updates plus driver's direct contact info.

Q: How do I prepare my car for shipping?
A: Wash, remove toll tags/personal items, inflate tires, 1/4 tank gas.

Q: Do you offer Door to Door Service?
A: Yes. Picked up and delivered to your chosen address.

Q: Can you ship non-running vehicles?
A: Yes. Specialized equipment like winches or lift gates.

Q: Can I ship multiple vehicles?
A: Yes. Multi-car transport, often more cost-effective per vehicle.

Q: Do I need to be present at pickup and delivery?
A: Yes, you or a designated representative must be present to sign the Bill of Lading.

Q: How much notice do you need to schedule transport?
A: We recommend 1-2 weeks' notice, but expedited shipping is available.

Q: Can I put personal items in the car?
A: Generally up to 100 lbs in the trunk, but it is not insured against damage or theft.

Q: Are there hidden fees?
A: No. We offer guaranteed pricing with no upfront deposit.
`;
    // Replace the old FAQs section with the new one
    llms = llms.replace(/## Frequently Asked Questions[\s\S]*?## Contact Info/, `${additions}\n## Contact Info`);
    fs.writeFileSync(llmsPath, llms, 'utf8');
    console.log('llms.txt expanded with delivery math and top 10 FAQs.');
  }
}
