const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'services');
const SITE = 'https://neonautotransport.com';

// Service-specific descriptions for better schema
const SERVICE_DESCRIPTIONS = {
  'open-auto-transport.html': 'Affordable open carrier auto transport service using multi-car trailers. FMCSA approved, fully insured door-to-door vehicle shipping nationwide.',
  'enclosed-auto-transport.html': 'Premium enclosed auto transport for luxury, classic, and high-value vehicles. Fully covered trailers with white-glove handling and maximum protection.',
  'door-to-door-car-shipping.html': 'Convenient door-to-door car shipping service. We pick up and deliver your vehicle as close to your address as possible, nationwide.',
  'expedited-auto-transport.html': 'Fast expedited auto transport with priority pickup and delivery. Ideal for time-sensitive vehicle shipments across the United States.',
  'motorcycle-shipping.html': 'Safe and secure motorcycle shipping service. Enclosed and open transport options for all types of motorcycles, fully insured.',
  'alaska-auto-transport.html': 'Specialized Alaska auto transport service including barge shipping to and from Anchorage. Reliable vehicle transport to the Last Frontier.',
  'hawaii-auto-transport.html': 'Professional Hawaii auto transport via ocean freight. Roll-on/roll-off and container shipping options to and from Honolulu and all Hawaiian islands.',
  'military-car-shipping.html': 'Military car shipping with PCS discounts for active duty, veterans, and their families. Reliable auto transport for military relocations nationwide.',
  'luxury-car-shipping.html': 'White-glove luxury car shipping for exotic, sports, and high-end vehicles. Enclosed transport with specialized handling and premium insurance.',
  'car-dealer-shipping.html': 'Auto transport solutions for car dealerships. Volume discounts, fleet management, and reliable delivery for dealer vehicle inventory.',
  'corporate-relocation.html': 'Corporate relocation auto transport services for employee vehicle shipping. Streamlined logistics for business moves and fleet transfers.',
  'college-car-shipping.html': 'Affordable car shipping for college students. Semester move-in and move-out auto transport with student discounts available.',
  'fleet-management-transportation-services.html': 'Comprehensive fleet management transportation services for businesses. Multi-vehicle logistics, volume pricing, and dedicated account management.',
  'international-overseas-car-shipping-services.html': 'International and overseas car shipping services. Roll-on/roll-off and container vehicle transport to ports worldwide.',
  'auto-auction-shipping.html': 'Auto auction shipping service for vehicles purchased at Copart, IAAI, Manheim, and other auctions. Fast pickup and delivery nationwide.',
  'car-buyer-auto-transport.html': 'Auto transport for car buyers purchasing vehicles online or out of state. Secure shipping from sellers to your door.',
  'car-resellers-auto-transport.html': 'Auto transport solutions for car resellers and flippers. Reliable shipping for vehicles purchased for resale with volume discounts.',
  'car-shipping-to-another-state.html': 'Reliable car shipping to another state. Door-to-door interstate auto transport with FMCSA approved carriers for all 50 states.',
  'rental-car-shipping.html': 'Rental car shipping and relocation service. Transport rental fleet vehicles between locations or return them to the original branch.',
  'snow-bird-car-shipping.html': 'Snow bird car shipping for seasonal movers. Affordable auto transport between northern and southern states for winter and summer relocations.',
  'truck-shipping-services.html': 'Heavy-duty truck shipping services for commercial vehicles, pickups, and large trucks. Specialized carriers for oversized vehicle transport.',
  'index.html': null  // Skip index
};

function extractTitle(content) {
  const match = content.match(/<title>([^<]+)<\/title>/);
  return match ? match[1] : null;
}

function extractDescription(content) {
  const match = content.match(/<meta name="description" content="([^"]+)"/);
  return match ? match[1] : null;
}

function extractCanonical(content) {
  const match = content.match(/<link rel="canonical" href="([^"]+)"/);
  return match ? match[1] : null;
}

let count = 0;

for (const [filename, customDesc] of Object.entries(SERVICE_DESCRIPTIONS)) {
  if (customDesc === null) continue; // Skip index
  
  const filepath = path.join(ROOT, filename);
  if (!fs.existsSync(filepath)) {
    console.log(`SKIP: ${filename} not found`);
    continue;
  }

  let content = fs.readFileSync(filepath, 'utf8');
  
  // Skip if already has Service schema
  if (content.includes('"@type": "Service"')) {
    console.log(`SKIP: ${filename} already has Service schema`);
    continue;
  }

  const title = extractTitle(content);
  const metaDesc = extractDescription(content);
  const canonical = extractCanonical(content);
  const desc = customDesc || metaDesc || title;
  
  // Extract service name from title (remove " | Neon Auto Transport" suffix)
  const serviceName = title ? title.replace(/ \| Neon Auto Transport/i, '').trim() : filename.replace('.html', '');

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceName,
    "description": desc,
    "url": canonical || `${SITE}/services/${filename.replace('.html', '/')}`,
    "provider": {
      "@type": "Organization",
      "name": "Neon Auto Transport",
      "url": SITE,
      "telephone": "+15715767711",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "2709 Neabsco Common Pl Suite 101",
        "addressLocality": "Woodbridge",
        "addressRegion": "VA",
        "postalCode": "22191",
        "addressCountry": "US"
      }
    },
    "areaServed": { "@type": "Country", "name": "United States" },
    "serviceType": "Auto Transport"
  };

  const schemaBlock = `\n    <!-- JSON-LD: Service -->\n    <script type="application/ld+json">\n    ${JSON.stringify(schema, null, 2)}\n    </script>\n`;

  // Insert before the closing </head> tag
  if (content.includes('</head>')) {
    content = content.replace('</head>', schemaBlock + '\n</head>');
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`OK: ${filename} — "${serviceName}"`);
    count++;
  } else {
    console.log(`ERR: ${filename} — no </head> found`);
  }
}

console.log(`\nDone: Service schema added to ${count} pages`);
