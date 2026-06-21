const fs = require('fs');
const path = require('path');

// 1. Create terms.html based on privacy.html structure
const privacy = fs.readFileSync(path.join(__dirname, 'privacy.html'), 'utf8');

// Extract head-to-header (everything up to and including </header>)
const headerEnd = privacy.indexOf('</header>');
const headToHeader = privacy.substring(0, headerEnd + '</header>'.length);

// Extract footer
const footerStart = privacy.indexOf('<!-- Global Footer -->');
const footerEnd = privacy.indexOf('<!-- Header Scroll');
const footer = privacy.substring(footerStart, footerEnd);

// Extract scripts (from Header Scroll to end)
const scriptsStart = privacy.indexOf('<!-- Header Scroll');
const scripts = privacy.substring(scriptsStart);

// Build terms.html
let terms = headToHeader;

// Replace head meta tags
terms = terms.replace(
  '<title>Privacy Policy | Best American Auto Transport Inc | Data Protection &amp; SMS Consent</title>',
  '<title>Terms & Conditions | Best American Auto Transport Inc | Auto Shipping Agreement</title>'
);
terms = terms.replace(
  '<meta name="description" content="Read the Best American Auto Transport Inc Privacy Policy. Learn how we collect, use, and protect your personal data, SMS consent, and contact information.">',
  '<meta name="description" content="Read the Best American Auto Transport Inc Terms and Conditions. Understand our auto shipping service agreement, liability coverage, and cancellation policies.">'
);
terms = terms.replace(
  '<link rel="canonical" href="https://bestamericanautotransport.com/privacy/" />',
  '<link rel="canonical" href="https://bestamericanautotransport.com/terms/" />'
);
terms = terms.replace(/og:url.*content="[^"]*"/, 'og:url" content="https://bestamericanautotransport.com/terms/"');
terms = terms.replace(/og:title.*content="[^"]*"/, 'og:title" content="Terms & Conditions | Best American Auto Transport Inc"');
terms = terms.replace(/og:description.*content="[^"]*"/, 'og:description" content="Best American Auto Transport Inc Terms and Conditions cover our service agreement, liability, payment terms, and cancellation policies."');

// Replace hero
const heroStart = terms.indexOf('<main>');
const heroEnd = terms.indexOf('</section>', terms.indexOf('slant-bottom'));
const newHero = `<main>
        <!-- Slanted Hero Header -->
        <section class="relative pt-36 pb-48 stripe-gradient-bg slant-bottom overflow-hidden">
            <canvas id="particleCanvas" class="absolute inset-0 w-full h-full z-0 pointer-events-none"></canvas>
            <div class="container mx-auto px-4 lg:px-8 z-10 relative text-center text-white max-w-4xl">
                <span class="px-4 py-1.5 rounded-full bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.3)] text-white text-xs font-bold uppercase tracking-wider mb-6 inline-block">
                    Service Agreement
                </span>
                <h1 class="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-none mb-6 tracking-tighter">
                    Terms & Conditions
                </h1>
                <p class="text-lg md:text-xl text-[rgba(255,255,255,0.9)] max-w-2xl mx-auto leading-relaxed">
                    Please review our terms of service carefully. These terms govern your use of Best American Auto Transport Inc's vehicle shipping services.
                </p>
            </div>
        </section>`;

terms = terms.substring(0, heroStart) + newHero + terms.substring(heroEnd + '</section>'.length);

// Replace content section with terms content
const contentStart = terms.indexOf('<!-- Content Section -->');
const contentEnd = terms.indexOf('</main>');

const termsContent = `
        <!-- Terms Content Section -->
        <section class="py-20 bg-[#f6f9fc]">
            <div class="container mx-auto px-4 lg:px-8 max-w-4xl">

                <div class="stripe-card p-8 md:p-12 rounded-2xl mb-8">
                    <h2 class="text-2xl font-bold text-[#0a2540] mb-4">1. Service Agreement</h2>
                    <p class="text-[#425466] text-sm leading-relaxed mb-4">By booking a vehicle transport service with Best American Auto Transport Inc ("Company", "we", "us", "our"), you ("Customer") agree to the following terms and conditions. This agreement constitutes a legally binding contract between you and Best American Auto Transport Inc.</p>
                    <p class="text-[#425466] text-sm leading-relaxed">Best American Auto Transport Inc acts as a licensed auto transport broker (MC# 1662088, DOT# 4277211) and arranges for the transportation of your vehicle through our network of vetted, FMCSA-approved carriers.</p>
                </div>

                <div class="stripe-card p-8 md:p-12 rounded-2xl mb-8">
                    <h2 class="text-2xl font-bold text-[#0a2540] mb-4">2. Booking & Payment Terms</h2>
                    <ul class="text-[#425466] text-sm leading-relaxed space-y-3 list-disc list-inside">
                        <li>A deposit is required at the time of booking to secure your transport reservation.</li>
                        <li>The remaining balance is due upon delivery of your vehicle, payable to the carrier directly unless otherwise arranged.</li>
                        <li>Accepted payment methods include credit/debit cards, bank transfers, and certified checks. Personal checks may require additional clearance time.</li>
                        <li>All quoted prices are estimates and may vary based on route conditions, vehicle size, transport type, and seasonal demand.</li>
                    </ul>
                </div>

                <div class="stripe-card p-8 md:p-12 rounded-2xl mb-8">
                    <h2 class="text-2xl font-bold text-[#0a2540] mb-4">3. Cancellation Policy</h2>
                    <ul class="text-[#425466] text-sm leading-relaxed space-y-3 list-disc list-inside">
                        <li>Orders may be cancelled with a full deposit refund if cancelled before a carrier has been dispatched to your pickup location.</li>
                        <li>Once a carrier has been dispatched, a cancellation fee of up to $200 may apply to cover the carrier's deadhead mileage.</li>
                        <li>After the vehicle has been picked up, no refunds will be issued for the transport portion of the service.</li>
                        <li>Cancellation requests must be made in writing via email to <a href="mailto:info@bestamericanautotransport.com" class="text-[#800020] font-bold hover:underline">info@bestamericanautotransport.com</a>.</li>
                    </ul>
                </div>

                <div class="stripe-card p-8 md:p-12 rounded-2xl mb-8">
                    <h2 class="text-2xl font-bold text-[#0a2540] mb-4">4. Vehicle Condition & Inspection</h2>
                    <ul class="text-[#425466] text-sm leading-relaxed space-y-3 list-disc list-inside">
                        <li>A thorough vehicle inspection will be conducted at both pickup and delivery. Both parties must sign the Bill of Lading documenting the vehicle's condition.</li>
                        <li>The customer is responsible for preparing the vehicle: removing personal belongings, ensuring the fuel tank is no more than 1/4 full, and documenting any pre-existing damage with photos.</li>
                        <li>Personal items left inside the vehicle are transported at the owner's risk and are NOT covered by cargo insurance.</li>
                        <li>Vehicles must be in drivable condition unless inoperable transport has been specifically arranged and quoted.</li>
                    </ul>
                </div>

                <div class="stripe-card p-8 md:p-12 rounded-2xl mb-8">
                    <h2 class="text-2xl font-bold text-[#0a2540] mb-4">5. Insurance & Liability</h2>
                    <ul class="text-[#425466] text-sm leading-relaxed space-y-3 list-disc list-inside">
                        <li>All carriers in our network carry active cargo insurance that covers your vehicle during loading, transit, and unloading.</li>
                        <li>In the event of damage during transport, claims must be filed within 48 hours of delivery and documented on the Bill of Lading at the time of delivery.</li>
                        <li>Best American Auto Transport Inc's liability as a broker is limited to arranging transport with insured carriers. The carrier's cargo insurance is the primary coverage for your vehicle.</li>
                        <li>We recommend maintaining your own comprehensive auto insurance policy for additional coverage.</li>
                    </ul>
                </div>

                <div class="stripe-card p-8 md:p-12 rounded-2xl mb-8">
                    <h2 class="text-2xl font-bold text-[#0a2540] mb-4">6. Delivery Timeframes</h2>
                    <p class="text-[#425466] text-sm leading-relaxed mb-4">Estimated pickup and delivery dates are approximate and not guaranteed. Transit times may vary due to weather conditions, traffic, route changes, mechanical issues, DOT inspections, or other unforeseen circumstances.</p>
                    <p class="text-[#425466] text-sm leading-relaxed">Expedited shipping options are available at additional cost for time-sensitive shipments, but even expedited delivery dates remain estimates.</p>
                </div>

                <div class="stripe-card p-8 md:p-12 rounded-2xl mb-8">
                    <h2 class="text-2xl font-bold text-[#0a2540] mb-4">7. Limitation of Liability</h2>
                    <p class="text-[#425466] text-sm leading-relaxed">Best American Auto Transport Inc shall not be liable for any indirect, incidental, special, or consequential damages arising from the transportation of your vehicle. Our total liability shall not exceed the cost of the transport service. Delays caused by acts of God, weather events, government actions, or other force majeure events are beyond our control.</p>
                </div>

                <div class="stripe-card p-8 md:p-12 rounded-2xl mb-8">
                    <h2 class="text-2xl font-bold text-[#0a2540] mb-4">8. Dispute Resolution</h2>
                    <p class="text-[#425466] text-sm leading-relaxed mb-4">Any disputes arising from this agreement shall first be attempted to be resolved through good-faith negotiation. If unresolved, disputes may be submitted to mediation in the Commonwealth of Virginia.</p>
                    <p class="text-[#425466] text-sm leading-relaxed">This agreement is governed by the laws of the Commonwealth of Virginia and applicable federal law.</p>
                </div>

                <div class="stripe-card p-8 md:p-12 rounded-2xl">
                    <h2 class="text-2xl font-bold text-[#0a2540] mb-4">9. Contact & Updates</h2>
                    <p class="text-[#425466] text-sm leading-relaxed mb-4">We reserve the right to update these terms at any time. Material changes will be communicated via our website. Continued use of our services after changes constitutes acceptance of the updated terms.</p>
                    <p class="text-[#425466] text-sm leading-relaxed mb-4">For questions about these terms, contact us:</p>
                    <div class="bg-[#f6f9fc] rounded-xl p-6">
                        <p class="text-[#0a2540] font-bold mb-2">Best American Auto Transport Inc</p>
                        <p class="text-[#425466] text-sm">2709 Neabsco Common Pl Suite 101, Malvern, PA & Houston, TX 22191</p>
                        <p class="text-[#425466] text-sm">Phone: <a href="tel:3023555544" class="text-[#800020] font-bold hover:underline">(302) 355-5544</a></p>
                        <p class="text-[#425466] text-sm">Email: <a href="mailto:info@bestamericanautotransport.com" class="text-[#800020] font-bold hover:underline">info@bestamericanautotransport.com</a></p>
                        <p class="text-[#425466] text-xs mt-3 text-[#a3b8cc]">Last updated: June 2026</p>
                    </div>
                </div>

            </div>
        </section>
    `;

terms = terms.substring(0, contentStart) + termsContent + terms.substring(contentEnd);

// Fix the footer Terms link in terms.html
let footerFixed = footer.replace(
  '<a href="#" class="hover:text-[#800020] transition">Terms & Conditions</a>',
  '<a href="/terms/" class="hover:text-[#800020] transition text-[#800020]">Terms & Conditions</a>'
);

terms = terms.replace('</main>', '    </main>\n\n' + footerFixed);
terms += '\n\n' + scripts;

// Fix footer Terms link in the Terms page too
terms = terms.replace(
  '<a href="#" class="hover:text-[#800020] transition">Terms & Conditions</a>',
  '<a href="/terms/" class="hover:text-[#800020] transition text-[#800020]">Terms & Conditions</a>'
);

fs.writeFileSync(path.join(__dirname, 'terms.html'), terms, 'utf8');
console.log('Created terms.html');

// 2. Fix Terms link in ALL other HTML files
const glob = require('path');
function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules') continue;
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(walkDir(filePath));
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  }
  return results;
}

const allHtml = walkDir(__dirname);
let fixedCount = 0;
for (const filePath of allHtml) {
  if (path.basename(filePath) === 'terms.html') continue;
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('<a href="#" class="hover:text-[#800020] transition">Terms & Conditions</a>')) {
    content = content.replace(
      '<a href="#" class="hover:text-[#800020] transition">Terms & Conditions</a>',
      '<a href="/terms/" class="hover:text-[#800020] transition">Terms & Conditions</a>'
    );
    fs.writeFileSync(filePath, content, 'utf8');
    fixedCount++;
    console.log('Fixed Terms link in: ' + path.relative(__dirname, filePath));
  }
}
console.log('Fixed Terms links in ' + fixedCount + ' files');

// 3. Update sitemap.xml
const sitemapPath = path.join(__dirname, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath, 'utf8');
const termsEntry = `
  <url>
    <loc>https://bestamericanautotransport.com/terms/</loc>
    <lastmod>2026-06-09</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>`;

// Insert before </urlset>
sitemap = sitemap.replace('</urlset>', termsEntry + '\n\n</urlset>');
fs.writeFileSync(sitemapPath, sitemap, 'utf8');
console.log('Updated sitemap.xml with terms page');
