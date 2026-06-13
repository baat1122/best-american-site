const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SKIP = ['node_modules', '.git', '.vercel', '.vercel-tmp', 'og-images'];

// The canonical global header HTML (extracted from index.html with fixes applied)
// We use /#how-it-works instead of #how-it-works so it works on sub-pages
// SUBPAGE_HEADER has an initial dark background so the header is visible immediately
const GLOBAL_HEADER = `    <!-- Global Header -->
    <header class="fixed top-0 w-full z-50 transition-all duration-300" id="global-header">`;
const SUBPAGE_HEADER = `    <!-- Global Header -->
    <header class="fixed top-0 w-full z-50 transition-all duration-300" id="global-header" style="background-color:#0a2540">`;
const HEADER_BODY = `
        <div class="container mx-auto px-4 lg:px-8 py-4 flex justify-between items-center" style="gap:24px">
            <!-- Left: Logo + Desktop Nav -->
            <div class="flex items-center" style="gap:24px">
                <a href="/" class="text-2xl font-black tracking-tight flex items-center gap-1 text-white" style="white-space:nowrap" id="logo-text">
                    NEON <span style="color: #00D1FF">AUTO TRANSPORT</span>
                </a>
                <nav class="hidden lg:flex items-center font-semibold text-[15px] text-white" id="desktop-nav" style="white-space:nowrap;gap:24px">
                <a href="/#how-it-works" class="hover:opacity-80 transition">How it works</a>
                
                <!-- Mega Menu Wrapper -->
                <div class="relative group flex items-center">
                    <a href="/services/" class="hover:opacity-80 transition flex items-center gap-1 cursor-pointer">
                        Transport Services 
                        <svg aria-hidden="true" class="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"></path></svg>
                    </a>
                    
                    <!-- Mega Menu Dropdown Slide -->
                    <div class="absolute left-1/2 transform -translate-x-1/2 mt-2 w-[900px] bg-white rounded-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-[#e6e6e6] p-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-4 group-hover:translate-y-0 z-50 text-left" style="top:100%">
                        <div class="grid grid-cols-3 gap-10 text-sm">
                            
                            <!-- Individual Column -->
                            <div>
                                <h3 class="font-bold text-lg text-[#0a2540] mb-2 border-b border-[#e6e6e6] pb-2">Individual</h3>
                                <ul class="space-y-4 mt-4 text-[#425466] font-medium">
                                    <li><a href="/services/snow-bird-car-shipping/" class="hover:text-[#635bff] flex items-center justify-between group/link">Snow Bird Car Shipping <span class="text-[#00d4ff] text-[10px] opacity-0 group-hover/link:opacity-100 transition-opacity">\u25B6</span></a></li>
                                    <li><a href="/services/military-car-shipping/" class="hover:text-[#635bff] flex items-center justify-between group/link">Military Car Shipping <span class="text-[#00d4ff] text-[10px] opacity-0 group-hover/link:opacity-100 transition-opacity">\u25B6</span></a></li>
                                    <li><a href="/services/college-car-shipping/" class="hover:text-[#635bff] flex items-center justify-between group/link">College Car Shipping <span class="text-[#00d4ff] text-[10px] opacity-0 group-hover/link:opacity-100 transition-opacity">\u25B6</span></a></li>
                                    <li><a href="/services/luxury-car-shipping/" class="hover:text-[#635bff] flex items-start justify-between group/link pr-2 leading-tight"><span>Luxury / Exotic Car Shipping<br>Services</span> <span class="text-[#00d4ff] text-[10px] opacity-0 group-hover/link:opacity-100 transition-opacity mt-1">\u25B6</span></a></li>
                                    <li><a href="/services/car-shipping-to-another-state/" class="hover:text-[#635bff] flex items-start justify-between group/link pr-2 leading-tight"><span>Car Shipping to Another<br>State</span> <span class="text-[#00d4ff] text-[10px] opacity-0 group-hover/link:opacity-100 transition-opacity mt-1">\u25B6</span></a></li>
                                    <li><a href="/services/truck-shipping-services/" class="hover:text-[#635bff] flex items-center justify-between group/link">Truck Shipping Services <span class="text-[#00d4ff] text-[10px] opacity-0 group-hover/link:opacity-100 transition-opacity">\u25B6</span></a></li>
                                    <li><a href="/services/door-to-door-car-shipping/" class="hover:text-[#635bff] flex items-center justify-between group/link">Door to Door Car Transport <span class="text-[#00d4ff] text-[10px] opacity-0 group-hover/link:opacity-100 transition-opacity">\u25B6</span></a></li>
                                    <li><a href="/services/enclosed-auto-transport/" class="hover:text-[#635bff] flex items-center justify-between group/link">Enclosed Transport <span class="text-[#00d4ff] text-[10px] opacity-0 group-hover/link:opacity-100 transition-opacity">\u25B6</span></a></li>
                                    <li><a href="/services/open-auto-transport/" class="hover:text-[#635bff] flex items-center justify-between group/link">Open Transport <span class="text-[#00d4ff] text-[10px] opacity-0 group-hover/link:opacity-100 transition-opacity">\u25B6</span></a></li>
                                    <li><a href="/services/car-buyer-auto-transport/" class="hover:text-[#635bff] flex items-center justify-between group/link">Car Buyer Auto Transport <span class="text-[#00d4ff] text-[10px] opacity-0 group-hover/link:opacity-100 transition-opacity">\u25B6</span></a></li>
                                    <li><a href="/services/expedited-auto-transport/" class="hover:text-[#635bff] flex items-center justify-between group/link">Expedited Auto Transport <span class="text-[#00d4ff] text-[10px] opacity-0 group-hover/link:opacity-100 transition-opacity">\u25B6</span></a></li>
                                    <li><a href="/services/car-resellers-auto-transport/" class="hover:text-[#635bff] flex items-start justify-between group/link pr-2 leading-tight"><span>Car Resellers Auto<br>Transport</span> <span class="text-[#00d4ff] text-[10px] opacity-0 group-hover/link:opacity-100 transition-opacity mt-1">\u25B6</span></a></li>
                                </ul>
                            </div>

                            <!-- Business Column -->
                            <div>
                                <h3 class="font-bold text-lg text-[#0a2540] mb-2 border-b border-[#e6e6e6] pb-2">Business</h3>
                                <ul class="space-y-4 mt-4 text-[#425466] font-medium">
                                    <li><a href="/services/car-dealer-shipping/" class="hover:text-[#635bff] flex items-center justify-between group/link">Car Dealer Shipping <span class="text-[#00d4ff] text-[10px] opacity-0 group-hover/link:opacity-100 transition-opacity">\u25B6</span></a></li>
                                    <li><a href="/services/auto-auction-shipping/" class="hover:text-[#635bff] flex items-center justify-between group/link">Auto Auction Shipping <span class="text-[#00d4ff] text-[10px] opacity-0 group-hover/link:opacity-100 transition-opacity">\u25B6</span></a></li>
                                    <li><a href="/services/rental-car-shipping/" class="hover:text-[#635bff] flex items-center justify-between group/link">Rental Car Shipping <span class="text-[#00d4ff] text-[10px] opacity-0 group-hover/link:opacity-100 transition-opacity">\u25B6</span></a></li>
                                    <li><a href="/services/corporate-relocation/" class="hover:text-[#635bff] flex items-center justify-between group/link">Corporate Relocation <span class="text-[#00d4ff] text-[10px] opacity-0 group-hover/link:opacity-100 transition-opacity">\u25B6</span></a></li>
                                    <li><a href="/services/fleet-management-transportation-services/" class="hover:text-[#635bff] flex items-start justify-between group/link pr-2 leading-tight"><span>Fleet Management<br>Transportation Services</span> <span class="text-[#00d4ff] text-[10px] opacity-0 group-hover/link:opacity-100 transition-opacity mt-1">\u25B6</span></a></li>
                                </ul>
                            </div>

                            <!-- Specialized Column -->
                            <div>
                                <h3 class="font-bold text-lg text-[#0a2540] mb-2 border-b border-[#e6e6e6] pb-2">Specialized</h3>
                                <ul class="space-y-4 mt-4 text-[#425466] font-medium">
                                    <li><a href="/services/motorcycle-shipping/" class="hover:text-[#635bff] flex items-center justify-between group/link">Motorcycle Shipping <span class="text-[#00d4ff] text-[10px] opacity-0 group-hover/link:opacity-100 transition-opacity">\u25B6</span></a></li>
                                    <li><a href="/services/alaska-auto-transport/" class="hover:text-[#635bff] flex items-center justify-between group/link">Alaska Auto Transport <span class="text-[#00d4ff] text-[10px] opacity-0 group-hover/link:opacity-100 transition-opacity">\u25B6</span></a></li>
                                    <li><a href="/services/hawaii-auto-transport/" class="hover:text-[#635bff] flex items-center justify-between group/link">Hawaii Auto Transport <span class="text-[#00d4ff] text-[10px] opacity-0 group-hover/link:opacity-100 transition-opacity">\u25B6</span></a></li>
                                    <li><a href="/services/international-overseas-car-shipping-services/" class="hover:text-[#635bff] flex items-start justify-between group/link pr-2 leading-tight"><span>International Overseas Car<br>Shipping Services</span> <span class="text-[#00d4ff] text-[10px] opacity-0 group-hover/link:opacity-100 transition-opacity mt-1">\u25B6</span></a></li>
                                    <li><a href="/services/terminal-to-terminal-car-shipping/" class="hover:text-[#635bff] flex items-start justify-between group/link pr-2 leading-tight"><span>Terminal-to-Terminal Car<br>Shipping</span> <span class="text-[#00d4ff] text-[10px] opacity-0 group-hover/link:opacity-100 transition-opacity mt-1">\u25B6</span></a></li>
                                </ul>
                            </div>
                            
                        </div>
                    </div>
                </div>

                <a href="/why-neon/" class="hover:opacity-80 transition">Why Neon</a>
                <a href="/contact/" class="hover:opacity-80 transition">Contact Us</a>
                </nav>
            </div>

            <div class="hidden lg:flex items-center gap-6">
                <a href="tel:5715767711" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#39FF14] text-[#0a2540] font-black hover:bg-[#32e612] transition-colors shadow-[0_0_15px_rgba(57,255,20,0.4)]" id="header-phone-btn" style="white-space:nowrap">
                    <svg aria-hidden="true" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
                    (571) 576-7711
                </a>
                <a href="/quote/" class="btn-outline" style="white-space:nowrap">Cost Calculator</a>
            </div>

            <!-- Mobile Menu Btn -->
            <button id="mobile-menu-btn" aria-label="Toggle mobile menu" class="lg:hidden text-white focus:outline-none">
                <svg aria-hidden="true" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
        </div>
        
        <!-- Mobile Nav -->
        <div id="mobile-menu" class="hidden lg:hidden bg-white border-t border-slate-200 flex flex-col p-4 space-y-4 text-center font-semibold text-[#425466] shadow-xl">
            <a href="/#how-it-works" class="hover:text-[#635bff]">How it works</a>
            <a href="/services/" class="hover:text-[#635bff]">Transport Options</a>
            <a href="/why-neon/" class="hover:text-[#635bff]">Why Neon</a>
            <a href="/contact/" class="hover:text-[#635bff]">Contact Us</a>
            <hr>
            <a href="tel:5715767711" class="bg-[#39FF14] text-[#0a2540] py-3 rounded-xl font-black text-lg shadow-lg">(571) 576-7711</a>
            <a href="/quote/" class="btn-primary inline-block mx-auto mt-4">Cost Calculator</a>
        </div>
    </header>`;
// Scroll-to-dark JS snippet (sub-pages start dark, so reset properly on scroll up)
const SCROLL_JS = `    <script>
        window.addEventListener('scroll', () => {
            const header = document.getElementById('global-header');
            if (window.scrollY > 50) {
                header.style.backgroundColor = '#0a2540';
                header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
            } else {
                header.style.backgroundColor = '';
                header.style.boxShadow = 'none';
            }
        });
    </script>`;

let updatedCount = 0;
let skippedCount = 0;

function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (SKIP.includes(entry.name)) continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(full);
        } else if (entry.name.endsWith('.html')) {
            processFile(full);
        }
    }
}

function processFile(filePath) {
    const rel = path.relative(ROOT, filePath);
    
    // Skip index.html (already has the correct header), dashboard, quote, slider
    if (rel === 'index.html' || rel === 'dashboard\\index.html' || rel === 'slider.html') {
        skippedCount++;
        return;
    }

    let html = fs.readFileSync(filePath, 'utf8');
    const original = html;
    
    // --- PATTERN 1: Simple dark header (routes, services, blog) ---
    const simpleHeaderRegex = /<header class="bg-\[#0a2540\] py-5 relative z-50">[\s\S]*?<\/header>/;
    
    // --- PATTERN 2: Services index white header ---
    const servicesHeaderRegex = /<header class="w-full bg-white border-b border-\[#e6e6e6\][\s\S]*?<\/header>/;
    
    // --- PATTERN 3: Existing global header (with or without style attribute) ---
    const globalHeaderRegex = /<!-- Global Header -->\s*<header class="fixed top-0 w-full z-50[\s\S]*?<\/header>/;
    
    // --- PATTERN 4: Old-style simple dark header without relative z-50 ---
    const oldSimpleHeaderRegex = /<header class="bg-\[#0a2540\] py-5">[\s\S]*?<\/header>/;

    let headerType = null;
    
    if (globalHeaderRegex.test(html)) {
        headerType = 'global';
        html = html.replace(globalHeaderRegex, SUBPAGE_HEADER + HEADER_BODY);
    } else if (simpleHeaderRegex.test(html)) {
        headerType = 'simple-dark';
        html = html.replace(simpleHeaderRegex, SUBPAGE_HEADER + HEADER_BODY);
    } else if (servicesHeaderRegex.test(html)) {
        headerType = 'services-white';
        html = html.replace(servicesHeaderRegex, SUBPAGE_HEADER + HEADER_BODY);
    } else if (oldSimpleHeaderRegex.test(html)) {
        headerType = 'old-simple';
        html = html.replace(oldSimpleHeaderRegex, SUBPAGE_HEADER + HEADER_BODY);
    } else if (html.includes('id="global-header"')) {
        // Header exists but without the comment - try to add style to the header tag
        headerType = 'global-no-comment';
        // Ensure the header tag has the dark background style
        html = html.replace(
            /(<header[^>]*id="global-header")([^>]*)(?<!style="background-color:#0a2540")>/,
            (match, before, rest) => {
                if (before.includes('style="background-color:#0a2540"')) return match;
                return `${before} style="background-color:#0a2540"${rest}>`;
            }
        );
    } else {
        console.log(`  SKIP (no header pattern found): ${rel}`);
        skippedCount++;
        return;
    }
    
    // For sub-pages that previously had static headers, add top padding to <main> or first section
    if (headerType === 'simple-dark' || headerType === 'services-white' || headerType === 'old-simple') {
        if (html.includes('<main>') && !html.includes('<main class="pt-')) {
            html = html.replace('<main>', '<main class="pt-28">');
        } else if (html.includes('<main class="') && !html.includes('pt-')) {
            html = html.replace('<main class="', '<main class="pt-28 ');
        }
        html = html.replace(
            /(<main[^>]*>)\s*\n\s*(<!-- Hero Section -->)/,
            '$1\n        $2'
        );
    }
    
    // Ensure the sub-page scroll JS is present (with '' reset instead of 'transparent')
    if (!html.includes("header.style.backgroundColor = ''")) {
        // Remove old scroll JS if present
        const oldScrollRegex = /\s*<script>\s*window\.addEventListener\('scroll'[\s\S]*?header\.style\.backgroundColor = 'transparent'[\s\S]*?<\/script>/;
        if (oldScrollRegex.test(html)) {
            html = html.replace(oldScrollRegex, '');
        }
        // Insert new scroll JS before </body>
        html = html.replace('</body>', SCROLL_JS + '\n</body>');
    }
    
    if (html !== original) {
        fs.writeFileSync(filePath, html, 'utf8');
        updatedCount++;
        console.log(`  Updated (${headerType}): ${rel}`);
    } else {
        skippedCount++;
    }
}

console.log('=== Global Header Propagation Script ===\n');
walk(ROOT);
console.log(`\nDone. ${updatedCount} files updated, ${skippedCount} skipped.`);
