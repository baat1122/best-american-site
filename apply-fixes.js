const fs = require('fs');
const path = require('path');

const siteDir = __dirname;

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                processDir(fullPath);
            }
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf-8');
            let modified = false;

            // Fix lazy loading on images
            if (content.includes('<img ')) {
                const newContent = content.replace(/<img(?![^>]*loading=)/g, '<img loading="lazy"');
                if (content !== newContent) {
                    content = newContent;
                    modified = true;
                }
            }

            // Fix aria-hidden on svgs
            if (content.includes('<svg ')) {
                const newContent = content.replace(/<svg(?![^>]*aria-hidden)/g, '<svg aria-hidden="true"');
                if (content !== newContent) {
                    content = newContent;
                    modified = true;
                }
            }

            // Specific fixes for index.html
            if (file === 'index.html') {
                // Change H2 to H3 for "Get a Free Quote"
                content = content.replace('<h2 class="text-xl font-bold mb-1 text-[#0a2540]">Get a Free Quote</h2>', '<h3 class="text-xl font-bold mb-1 text-[#0a2540]">Get a Free Quote</h3>');
                // Change "Global Scale" H2 to span, and the H3 below it to H2
                content = content.replace('<h2 class="text-[#D4AF37] font-bold tracking-wide uppercase text-sm mb-4 reveal">Global Scale</h2>', '<span class="block text-[#D4AF37] font-bold tracking-wide uppercase text-sm mb-4 reveal">Global Scale</span>');
                content = content.replace('<h3 class="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter mb-8 reveal">The backbone of nationwide auto logistics.</h3>', '<h2 class="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter mb-8 reveal">The backbone of nationwide auto logistics.</h2>');
                
                // Form autocomplete
                content = content.replace('id="firstName" required', 'id="firstName" autocomplete="given-name" required');
                content = content.replace('id="lastName" required', 'id="lastName" autocomplete="family-name" required');
                content = content.replace('id="email" required', 'id="email" autocomplete="email" required');
                content = content.replace('id="phone" required', 'id="phone" autocomplete="tel" required');

                modified = true;
            }

            // Specific fixes for contact.html
            if (file === 'contact.html') {
                content = content.replace('id="name" name="Full Name" required', 'id="name" name="Full Name" autocomplete="name" required');
                content = content.replace('id="email_address" name="Email" required', 'id="email_address" name="Email" autocomplete="email" required');
                content = content.replace('id="phone_number" name="Phone Number" required', 'id="phone_number" name="Phone Number" autocomplete="tel" required');
                modified = true;
            }

            // Inject Competitor Comparison into why-best-american.html
            if (file === 'why-best-american.html' && !content.includes('id="competitor-comparison"')) {
                const comparisonSection = `
        <!-- Competitor Comparison Section -->
        <section class="py-24 bg-white relative z-10 border-b border-[#e6e6e6]" id="competitor-comparison">
            <div class="container mx-auto px-4 lg:px-8 max-w-6xl">
                <div class="text-center mb-16 reveal">
                    <h2 class="text-[#800020] font-bold tracking-wide uppercase text-sm mb-4">Compare Us</h2>
                    <h3 class="text-4xl font-black text-[#0a2540] tracking-tight mb-6">Why Best American Auto Transport Inc Leads the Industry</h3>
                    <p class="text-lg text-[#425466]">See how we stack up against Montway, Sherpa, SGT Auto Transport, and RoadRunner.</p>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse border border-[#e6e6e6] rounded-xl shadow-sm">
                        <thead>
                            <tr class="bg-[#f0f5fa] border-b-2 border-[#e6e6e6]">
                                <th class="p-6 font-bold text-[#0a2540] whitespace-nowrap">Feature</th>
                                <th class="p-6 font-black text-[#800020] text-xl whitespace-nowrap">Best American Auto Transport Inc</th>
                                <th class="p-6 font-medium text-[#425466] whitespace-nowrap">Montway</th>
                                <th class="p-6 font-medium text-[#425466] whitespace-nowrap">Sherpa</th>
                                <th class="p-6 font-medium text-[#425466] whitespace-nowrap">SGT / RoadRunner</th>
                            </tr>
                        </thead>
                        <tbody class="text-sm bg-white">
                            <tr class="border-b border-[#e6e6e6] hover:bg-slate-50 transition">
                                <td class="p-6 font-bold text-[#0a2540]">Direct Driver Contact</td>
                                <td class="p-6 text-[#16a34a] font-black text-lg">✅ Yes</td>
                                <td class="p-6 text-[#425466]">No (Dispatch Only)</td>
                                <td class="p-6 text-[#425466]">No</td>
                                <td class="p-6 text-[#425466]">No</td>
                            </tr>
                            <tr class="border-b border-[#e6e6e6] hover:bg-slate-50 transition">
                                <td class="p-6 font-bold text-[#0a2540]">Price Lock Guarantee</td>
                                <td class="p-6 text-[#16a34a] font-black text-lg">✅ Yes</td>
                                <td class="p-6 text-[#425466]">Variable</td>
                                <td class="p-6 text-[#16a34a]">Yes</td>
                                <td class="p-6 text-[#425466]">Variable</td>
                            </tr>
                            <tr class="border-b border-[#e6e6e6] hover:bg-slate-50 transition">
                                <td class="p-6 font-bold text-[#0a2540]">No Upfront Deposit</td>
                                <td class="p-6 text-[#16a34a] font-black text-lg">✅ Yes</td>
                                <td class="p-6 text-[#e31837]">Deposit Required</td>
                                <td class="p-6 text-[#e31837]">Deposit Required</td>
                                <td class="p-6 text-[#e31837]">Deposit Required</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
`;
                // Insert right before What We Offer Comparison Grid & Table
                content = content.replace('<!-- What We Offer Comparison Grid & Table -->', comparisonSection + '\n        <!-- What We Offer Comparison Grid & Table -->');
                modified = true;
            }

            // Inject Competitor Comparison into index.html
            if (file === 'index.html' && !content.includes('id="competitor-comparison"')) {
                const comparisonSection = `
        <!-- Competitor Comparison Section -->
        <section class="py-24 bg-white relative z-10 border-t border-[#e6e6e6]" id="competitor-comparison">
            <div class="container mx-auto px-4 lg:px-8 max-w-6xl">
                <div class="text-center mb-16 reveal">
                    <h2 class="text-[#800020] font-bold tracking-wide uppercase text-sm mb-4">Compare Us</h2>
                    <h3 class="text-4xl font-black text-[#0a2540] tracking-tight mb-6">Why Best American Auto Transport Inc Leads the Industry</h3>
                    <p class="text-lg text-[#425466]">See how we stack up against Montway, Sherpa, SGT Auto Transport, and RoadRunner.</p>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse border border-[#e6e6e6] rounded-xl shadow-sm">
                        <thead>
                            <tr class="bg-[#f0f5fa] border-b-2 border-[#e6e6e6]">
                                <th class="p-6 font-bold text-[#0a2540] whitespace-nowrap">Feature</th>
                                <th class="p-6 font-black text-[#800020] text-xl whitespace-nowrap">Best American Auto Transport Inc</th>
                                <th class="p-6 font-medium text-[#425466] whitespace-nowrap">Montway</th>
                                <th class="p-6 font-medium text-[#425466] whitespace-nowrap">Sherpa</th>
                                <th class="p-6 font-medium text-[#425466] whitespace-nowrap">SGT / RoadRunner</th>
                            </tr>
                        </thead>
                        <tbody class="text-sm bg-white">
                            <tr class="border-b border-[#e6e6e6] hover:bg-slate-50 transition">
                                <td class="p-6 font-bold text-[#0a2540]">Direct Driver Contact</td>
                                <td class="p-6 text-[#16a34a] font-black text-lg">✅ Yes</td>
                                <td class="p-6 text-[#425466]">No (Dispatch Only)</td>
                                <td class="p-6 text-[#425466]">No</td>
                                <td class="p-6 text-[#425466]">No</td>
                            </tr>
                            <tr class="border-b border-[#e6e6e6] hover:bg-slate-50 transition">
                                <td class="p-6 font-bold text-[#0a2540]">Price Lock Guarantee</td>
                                <td class="p-6 text-[#16a34a] font-black text-lg">✅ Yes</td>
                                <td class="p-6 text-[#425466]">Variable</td>
                                <td class="p-6 text-[#16a34a]">Yes</td>
                                <td class="p-6 text-[#425466]">Variable</td>
                            </tr>
                            <tr class="border-b border-[#e6e6e6] hover:bg-slate-50 transition">
                                <td class="p-6 font-bold text-[#0a2540]">No Upfront Deposit</td>
                                <td class="p-6 text-[#16a34a] font-black text-lg">✅ Yes</td>
                                <td class="p-6 text-[#e31837]">Deposit Required</td>
                                <td class="p-6 text-[#e31837]">Deposit Required</td>
                                <td class="p-6 text-[#e31837]">Deposit Required</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
`;
                // Insert before Trustindex Reviews
                content = content.replace('<!-- Trustindex Reviews Section -->', comparisonSection + '\n        <!-- Trustindex Reviews Section -->');
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content);
                console.log('Updated HTML: ' + fullPath);
            }
        }
    }
}

processDir(siteDir);

// Now fix particles.js
const particlesFile = path.join(siteDir, 'js', 'particles.js');
if (fs.existsSync(particlesFile)) {
    let pContent = fs.readFileSync(particlesFile, 'utf-8');
    // Add IntersectionObserver to only animate when in view
    if (!pContent.includes('IntersectionObserver')) {
        pContent = pContent.replace('requestAnimationFrame(animate);', `
        if (isVisible) {
            requestAnimationFrame(animate);
        }
        `);
        
        pContent = pContent.replace('animate();', `
    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
            if (isVisible) animate();
        });
    }, { threshold: 0 });
    
    observer.observe(canvas);
        `);
        fs.writeFileSync(particlesFile, pContent);
        console.log('Updated particles.js for performance (IntersectionObserver).');
    }
}
