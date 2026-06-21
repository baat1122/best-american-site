#!/usr/bin/env node
// seo-inject.js — Bulk SEO injection for all state + service pages
// Run: node seo-inject.js

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://bestamericanautotransport.com';
const OG_IMAGE = `${BASE_URL}/images/og-cover.jpg`;

// ── STATE DATA ────────────────────────────────────────────────────────────────
const stateData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'routes', 'state-data.json'), 'utf8')
);

// ── SERVICE DATA ──────────────────────────────────────────────────────────────
const services = [
  {
    file: 'open-transport.html',
    title: 'Open Car Transport Service | Affordable Nationwide Auto Shipping | Best American Auto Transport Inc',
    desc: 'Ship your vehicle affordably with Best American Auto Transport Inc open transport service. Multi-car trailers, FMCSA approved, door-to-door nationwide delivery. Get an instant quote.',
    keywords: 'open car transport, open auto transport, open trailer car shipping, affordable car shipping, multi-car transport',
    serviceType: 'Open Car Transport',
    hook: 'The most affordable way to ship your vehicle across the United States on an open multi-car trailer.'
  },
  {
    file: 'enclosed-transport.html',
    title: 'Enclosed Auto Transport | Premium Car Shipping Protection | Best American Auto Transport Inc',
    desc: 'Protect your luxury, classic, or exotic car with Best American Auto Transport Inc enclosed car shipping. Fully covered trailer, weather protection, FMCSA approved. Get a free quote today.',
    keywords: 'enclosed auto transport, enclosed car shipping, luxury car transport, classic car shipping, exotic car transport, premium auto transport',
    serviceType: 'Enclosed Car Transport',
    hook: 'Premium fully enclosed trailer shipping for luxury, classic, and exotic vehicles.'
  },
  {
    file: 'door-to-door-car-transport.html',
    title: 'Door-to-Door Car Transport | Pickup & Delivery at Your Location | Best American Auto Transport Inc',
    desc: 'Best American Auto Transport Inc offers true door-to-door car shipping. We pick up and deliver your vehicle directly to your address — no terminals. FMCSA approved, nationwide coverage.',
    keywords: 'door to door car transport, door to door auto shipping, home pickup car shipping, vehicle delivery to your door',
    serviceType: 'Door-to-Door Car Transport',
    hook: 'We come to you. Your vehicle is picked up from your address and delivered directly to your destination.'
  },
  {
    file: 'expedited-auto-transport.html',
    title: 'Expedited Auto Transport | Priority Car Shipping in 24-48 Hours | Best American Auto Transport Inc',
    desc: 'Need your car shipped fast? Best American Auto Transport Inc expedited service guarantees priority pickup and delivery. Team drivers, faster routes. Get priority auto transport today.',
    keywords: 'expedited auto transport, rush car shipping, priority vehicle transport, fast car shipping, same day auto transport',
    serviceType: 'Expedited Auto Transport',
    hook: 'Priority pickup and delivery using team drivers for the fastest possible vehicle transit.'
  },
  {
    file: 'motorcycle-shipping.html',
    title: 'Motorcycle Shipping Service | Safe Nationwide Bike Transport | Best American Auto Transport Inc',
    desc: 'Ship your motorcycle safely across the country with Best American Auto Transport Inc. Palletized or crated transport, fully insured, FMCSA approved. Get a free motorcycle shipping quote.',
    keywords: 'motorcycle shipping, motorcycle transport, bike shipping service, nationwide motorcycle transport, insured motorcycle shipping',
    serviceType: 'Motorcycle Shipping',
    hook: 'Specialized palletized and crated motorcycle transport for safe, damage-free delivery nationwide.'
  },
  {
    file: 'alaska-auto-transport.html',
    title: 'Alaska Auto Transport | Car Shipping to & from Alaska | Best American Auto Transport Inc',
    desc: 'Shipping a car to or from Alaska? Best American Auto Transport Inc handles all Alaska vehicle transport logistics including ferry coordination and mainland pickup. Get an instant Alaska quote.',
    keywords: 'Alaska auto transport, car shipping to Alaska, vehicle transport Alaska, ship car to Alaska, Alaska car shipping',
    serviceType: 'Alaska Auto Transport',
    hook: 'Specialized car shipping logistics for Alaska including ferry coordination and Last Frontier delivery.'
  },
  {
    file: 'hawaii-auto-transport.html',
    title: 'Hawaii Auto Transport | Ship Your Car to Hawaii | Best American Auto Transport Inc',
    desc: 'Ship your vehicle to or from Hawaii with Best American Auto Transport Inc. We manage all port and ocean freight logistics for seamless Hawaii car shipping. FMCSA approved, fully insured.',
    keywords: 'Hawaii auto transport, car shipping to Hawaii, ship car to Hawaii, Hawaii vehicle transport, overseas car shipping Hawaii',
    serviceType: 'Hawaii Auto Transport',
    hook: 'Complete Hawaii car shipping with port coordination and ocean freight management.'
  },
  {
    file: 'military-car-shipping.html',
    title: 'Military Car Shipping | Discounted Auto Transport for Service Members | Best American Auto Transport Inc',
    desc: 'Best American Auto Transport Inc proudly offers discounted car shipping for active military, veterans, and their families. PCS moves covered. FMCSA approved, nationwide service.',
    keywords: 'military car shipping, military auto transport, PCS car shipping, military vehicle transport, active duty car shipping discount',
    serviceType: 'Military Car Shipping',
    hook: 'Serving those who serve. Special rates and PCS move support for military families.'
  },
  {
    file: 'luxury-exotic-car-shipping-services.html',
    title: 'Luxury & Exotic Car Shipping | White-Glove Auto Transport | Best American Auto Transport Inc',
    desc: 'White-glove enclosed transport for luxury, exotic, and collector vehicles. Ferrari, Lamborghini, Rolls-Royce, and more. Best American Auto Transport Inc ensures your prized car arrives perfect.',
    keywords: 'luxury car shipping, exotic car transport, supercar shipping, Ferrari transport, Lamborghini shipping, white glove car transport',
    serviceType: 'Luxury & Exotic Car Shipping',
    hook: 'White-glove enclosed transport for the world\'s most prized vehicles.'
  },
  {
    file: 'car-dealer-shipping.html',
    title: 'Car Dealer Auto Transport | Fleet Shipping for Dealerships | Best American Auto Transport Inc',
    desc: 'Best American Auto Transport Inc partners with car dealerships for reliable fleet and individual unit shipping. Competitive rates, fast transit, FMCSA approved carrier network.',
    keywords: 'car dealer auto transport, dealership car shipping, fleet vehicle transport, auto dealer shipping service',
    serviceType: 'Car Dealer Shipping',
    hook: 'Reliable fleet and unit transport solutions built specifically for auto dealerships.'
  },
  {
    file: 'corporate-relocation.html',
    title: 'Corporate Relocation Car Shipping | Employee Vehicle Transport | Best American Auto Transport Inc',
    desc: 'Simplify corporate relocations with Best American Auto Transport Inc. We ship employee vehicles safely during company moves. Volume pricing, coordinated logistics, nationwide coverage.',
    keywords: 'corporate relocation car shipping, employee car transport, company vehicle relocation, business auto transport',
    serviceType: 'Corporate Relocation Car Shipping',
    hook: 'Streamlined vehicle logistics for corporate relocations across the United States.'
  },
  {
    file: 'college-car-shipping.html',
    title: 'College Student Car Shipping | Affordable Campus Auto Transport | Best American Auto Transport Inc',
    desc: 'Heading to college? Ship your car to campus safely with Best American Auto Transport Inc. Student-friendly pricing, door-to-door delivery, FMCSA approved. Get a free college car shipping quote.',
    keywords: 'college student car shipping, campus car transport, student auto shipping, ship car to college',
    serviceType: 'College Student Car Shipping',
    hook: 'Affordable door-to-door vehicle shipping for students heading to or from campus.'
  },
  {
    file: 'fleet-management-transportation-services.html',
    title: 'Fleet Management Transportation | Multi-Vehicle Shipping Solutions | Best American Auto Transport Inc',
    desc: 'Best American Auto Transport Inc offers scalable fleet management and multi-vehicle shipping for businesses. Coordinate transport of 5 to 500+ vehicles with our dedicated fleet team.',
    keywords: 'fleet management transportation, fleet vehicle shipping, multi-vehicle transport, bulk car shipping, fleet auto transport',
    serviceType: 'Fleet Management Transportation',
    hook: 'Scalable fleet transport solutions from 5 vehicles to full enterprise fleets.'
  },
  {
    file: 'international-overseas-car-shipping-services.html',
    title: 'International Car Shipping | Overseas Vehicle Transport | Best American Auto Transport Inc',
    desc: 'Ship your vehicle internationally with Best American Auto Transport Inc. We handle customs, ocean freight, and overseas logistics for car shipping to 150+ countries. Get a free international quote.',
    keywords: 'international car shipping, overseas vehicle transport, ship car abroad, car shipping to Europe, auto transport international',
    serviceType: 'International Car Shipping',
    hook: 'Complete overseas car transport with customs clearance and ocean freight management to 150+ countries.'
  },
  {
    file: 'auto-auction-shipping.html',
    title: 'Auto Auction Car Shipping | Fast Vehicle Transport from Auctions | Best American Auto Transport Inc',
    desc: 'Won a vehicle at auction? Best American Auto Transport Inc specializes in fast, reliable auction car pickup and delivery. Copart, IAAI, Manheim, and all major auctions served.',
    keywords: 'auto auction shipping, Copart car shipping, IAAI vehicle transport, Manheim auction transport, auction car delivery',
    serviceType: 'Auto Auction Car Shipping',
    hook: 'Fast, hassle-free vehicle pickup from Copart, IAAI, Manheim, and all major US auctions.'
  },
  {
    file: 'car-buyer-auto-transport.html',
    title: 'Car Buyer Auto Transport | Vehicle Delivery After Purchase | Best American Auto Transport Inc',
    desc: 'Just bought a car online or out of state? Best American Auto Transport Inc delivers your new purchase right to your door. FMCSA approved, fully insured, nationwide delivery.',
    keywords: 'car buyer auto transport, ship purchased car, vehicle delivery after purchase, online car purchase shipping',
    serviceType: 'Car Buyer Auto Transport',
    hook: 'Seamless vehicle delivery for cars purchased online or out of state.'
  },
  {
    file: 'car-resellers-auto-transport.html',
    title: 'Auto Transport for Car Resellers | Reliable Vehicle Shipping | Best American Auto Transport Inc',
    desc: 'Car resellers and flippers trust Best American Auto Transport Inc for fast, reliable vehicle shipping. Competitive rates, priority scheduling, and nationwide carrier network.',
    keywords: 'auto transport car resellers, vehicle shipping for flippers, reseller car transport, wholesale car shipping',
    serviceType: 'Car Reseller Auto Transport',
    hook: 'Priority transport solutions designed for car resellers, flippers, and wholesale dealers.'
  },
  {
    file: 'car-shipping-to-another-state.html',
    title: 'Car Shipping to Another State | Nationwide Interstate Auto Transport | Best American Auto Transport Inc',
    desc: 'Moving or selling across state lines? Best American Auto Transport Inc ships cars to any state in the US. Door-to-door interstate auto transport, FMCSA approved, instant online quotes.',
    keywords: 'car shipping to another state, interstate auto transport, cross country car shipping, state to state vehicle transport',
    serviceType: 'Interstate Car Shipping',
    hook: 'Reliable door-to-door car shipping to any state in the continental United States.'
  },
  {
    file: 'rental-car-shipping.html',
    title: 'Rental Car Shipping | Fleet Relocation for Rental Companies | Best American Auto Transport Inc',
    desc: 'Best American Auto Transport Inc provides specialized rental car fleet relocation services. Move your rental vehicles between locations quickly and cost-effectively. Get a fleet quote.',
    keywords: 'rental car shipping, rental fleet relocation, car rental fleet transport, vehicle fleet shipping service',
    serviceType: 'Rental Car Fleet Shipping',
    hook: 'Cost-effective rental fleet relocation between depots, airports, and service centers.'
  },
  {
    file: 'snow-bird-car-shipping.html',
    title: 'Snowbird Car Shipping | Seasonal Vehicle Transport Florida & Arizona | Best American Auto Transport Inc',
    desc: 'Heading south for the winter? Best American Auto Transport Inc is the #1 snowbird car shipping company. Ship your vehicle to Florida, Arizona, or any warm state. Schedule your seasonal transport now.',
    keywords: 'snowbird car shipping, seasonal vehicle transport, ship car to Florida, winter car shipping, snowbird auto transport Arizona',
    serviceType: 'Snowbird Car Shipping',
    hook: 'Seasonal vehicle transport for snowbirds heading to Florida, Arizona, and beyond.'
  },
  {
    file: 'truck-shipping-services.html',
    title: 'Truck Shipping Services | Pickup Truck & Commercial Transport | Best American Auto Transport Inc',
    desc: 'Ship your pickup truck, work truck, or commercial vehicle with Best American Auto Transport Inc. Open and enclosed options available. FMCSA approved, fully insured, nationwide coverage.',
    keywords: 'truck shipping services, pickup truck transport, commercial vehicle shipping, work truck transport, truck auto transport',
    serviceType: 'Truck Shipping',
    hook: 'Reliable transport for pickup trucks, work vehicles, and commercial trucks nationwide.'
  }
];

// ── HELPER: Build SEO head block for STATE pages ──────────────────────────────
function buildStateHead(state, data, slug) {
  const { nickname, highway, hub, climate, terrain, challenge } = data;
  const title = `${state} Car Shipping | Auto Transport to & from ${state} | Best American Auto Transport Inc`;
  const desc = `Ship your car to or from ${state}, ${nickname}. Best American Auto Transport Inc provides fully insured door-to-door vehicle transport along ${highway} serving ${hub} and all of ${state}. FMCSA approved. Get a free instant quote.`;
  const url = `${BASE_URL}/${slug}`;
  const keywords = `${state} car shipping, ${state} auto transport, ship car to ${state}, vehicle transport ${state}, car shipping from ${state}, ${hub} auto transport`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Primary SEO -->
    <title>${title}</title>
    <meta name="description" content="${desc}">
    <meta name="keywords" content="${keywords}">
    <meta name="robots" content="index, follow">
    <meta name="author" content="Best American Auto Transport Inc">
    <link rel="canonical" href="${url}" />

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${state} Car Shipping | Best American Auto Transport Inc">
    <meta property="og:description" content="Reliable, FMCSA approved car shipping to and from ${state}. Serving ${hub} and all cities in ${state}. Door-to-door auto transport along ${highway}. Call (302) 355-5544.">
    <meta property="og:image" content="${OG_IMAGE}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="Best American Auto Transport Inc">
    <meta property="og:locale" content="en_US">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${state} Car Shipping | FMCSA Approved | Best American Auto Transport Inc">
    <meta name="twitter:description" content="Ship your car to or from ${state} with Best American Auto Transport Inc. Door-to-door delivery along ${highway}. Serving ${hub}. Instant quote available.">
    <meta name="twitter:image" content="${OG_IMAGE}">

    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/tailwind.css">
    <link rel="stylesheet" href="/css/styles.css">

    <!-- JSON-LD: Service + BreadcrumbList -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "${state} Car Shipping",
      "description": "Door-to-door auto transport to and from ${state}. Serving ${hub} and all surrounding areas via ${highway}.",
      "serviceType": "Auto Transport",
      "provider": {
        "@type": "MovingCompany",
        "name": "Best American Auto Transport Inc",
        "telephone": "+13023555544",
        "url": "${BASE_URL}",
        "address": [
        {
          "@type": "PostalAddress",
          "streetAddress": "5 Great Valley Pkwy",
          "addressLocality": "Malvern",
          "addressRegion": "PA",
          "postalCode": "19355",
          "addressCountry": "US"
        },
        {
          "@type": "PostalAddress",
          "streetAddress": "6464 Savoy Dr",
          "addressLocality": "Houston",
          "addressRegion": "TX",
          "postalCode": "77036",
          "addressCountry": "US"
        }
      ]
      },
      "areaServed": {
        "@type": "State",
        "name": "${state}",
        "containedInPlace": { "@type": "Country", "name": "United States" }
      },
      "url": "${url}",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "seller": { "@type": "Organization", "name": "Best American Auto Transport Inc" }
      }
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "${BASE_URL}/" },
        { "@type": "ListItem", "position": 2, "name": "Locations", "item": "${BASE_URL}/locations.html" },
        { "@type": "ListItem", "position": 3, "name": "${state} Car Shipping", "item": "${url}" }
      ]
    }
    </script>
</head>`;
}

// ── HELPER: Build SEO head block for SERVICE pages ────────────────────────────
function buildServiceHead(svc) {
  const url = `${BASE_URL}/services/${svc.file}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Primary SEO -->
    <title>${svc.title}</title>
    <meta name="description" content="${svc.desc}">
    <meta name="keywords" content="${svc.keywords}">
    <meta name="robots" content="index, follow">
    <meta name="author" content="Best American Auto Transport Inc">
    <link rel="canonical" href="${url}" />

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${svc.title}">
    <meta property="og:description" content="${svc.hook} FMCSA &amp; DOT approved. Fully insured. Get a free quote from Best American Auto Transport Inc.">
    <meta property="og:image" content="${OG_IMAGE}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="Best American Auto Transport Inc">
    <meta property="og:locale" content="en_US">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${svc.title.split('|')[0].trim()}">
    <meta name="twitter:description" content="${svc.hook}">
    <meta name="twitter:image" content="${OG_IMAGE}">

    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/tailwind.css">
    <link rel="stylesheet" href="/css/styles.css">

    <!-- JSON-LD: Service -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "${svc.serviceType}",
      "description": "${svc.desc}",
      "serviceType": "${svc.serviceType}",
      "provider": {
        "@type": "MovingCompany",
        "name": "Best American Auto Transport Inc",
        "telephone": "+13023555544",
        "url": "${BASE_URL}",
        "address": [
        {
          "@type": "PostalAddress",
          "streetAddress": "5 Great Valley Pkwy",
          "addressLocality": "Malvern",
          "addressRegion": "PA",
          "postalCode": "19355",
          "addressCountry": "US"
        },
        {
          "@type": "PostalAddress",
          "streetAddress": "6464 Savoy Dr",
          "addressLocality": "Houston",
          "addressRegion": "TX",
          "postalCode": "77036",
          "addressCountry": "US"
        }
      ]
      },
      "areaServed": { "@type": "Country", "name": "United States" },
      "url": "${url}",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "seller": { "@type": "Organization", "name": "Best American Auto Transport Inc" }
      }
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "${BASE_URL}/" },
        { "@type": "ListItem", "position": 2, "name": "Services", "item": "${BASE_URL}/services/index.html" },
        { "@type": "ListItem", "position": 3, "name": "${svc.serviceType}", "item": "${url}" }
      ]
    }
    </script>
</head>`;
}

// ── INJECT: Replace <head>...</head> block ─────────────────────────────────────
function injectHead(filePath, newHead) {
  let html = fs.readFileSync(filePath, 'utf8');
  // Replace everything from <!DOCTYPE html> to </head>
  html = html.replace(/^[\s\S]*?<\/head>/i, newHead);
  fs.writeFileSync(filePath, html, 'utf8');
}

// ── PROCESS STATE PAGES ───────────────────────────────────────────────────────
const routesDir = path.join(__dirname, 'routes');
let stateCount = 0;
let stateErrors = [];

for (const [state, data] of Object.entries(stateData)) {
  const slug = state.toLowerCase().replace(/[\s.]+/g, '-').replace(/[^a-z0-9-]/g, '') + '-car-shipping.html';
  const filePath = path.join(routesDir, slug);
  if (!fs.existsSync(filePath)) {
    stateErrors.push(`SKIP (not found): ${slug}`);
    continue;
  }
  try {
    const newHead = buildStateHead(state, data, slug);
    injectHead(filePath, newHead);
    console.log(`✅ STATE: ${state}`);
    stateCount++;
  } catch (e) {
    stateErrors.push(`ERROR ${slug}: ${e.message}`);
    console.error(`❌ ${slug}: ${e.message}`);
  }
}

// ── PROCESS SERVICE PAGES ─────────────────────────────────────────────────────
const servicesDir = path.join(__dirname, 'services');
let svcCount = 0;
let svcErrors = [];

for (const svc of services) {
  const filePath = path.join(servicesDir, svc.file);
  if (!fs.existsSync(filePath)) {
    svcErrors.push(`SKIP (not found): ${svc.file}`);
    continue;
  }
  try {
    const newHead = buildServiceHead(svc);
    injectHead(filePath, newHead);
    console.log(`✅ SERVICE: ${svc.file}`);
    svcCount++;
  } catch (e) {
    svcErrors.push(`ERROR ${svc.file}: ${e.message}`);
    console.error(`❌ ${svc.file}: ${e.message}`);
  }
}

// ── SUMMARY ───────────────────────────────────────────────────────────────────
console.log(`\n══════════════════════════════════════`);
console.log(`SEO Injection Complete`);
console.log(`  State pages updated : ${stateCount}`);
console.log(`  Service pages updated: ${svcCount}`);
console.log(`  Total pages updated  : ${stateCount + svcCount}`);
if (stateErrors.length || svcErrors.length) {
  console.log(`\nWarnings/Errors:`);
  [...stateErrors, ...svcErrors].forEach(e => console.log(`  ⚠️  ${e}`));
}
console.log(`══════════════════════════════════════\n`);
