const fs = require('fs');
const path = require('path');
const serviceDataMap = require('./service-data.json');

const services = [
    "Snow Bird Car Shipping", "Military Car Shipping", "College Car Shipping", "Luxury / Exotic Car Shipping Services",
    "Car Shipping to Another State", "Truck Shipping Services", "Door to Door Car Transport", "Enclosed Transport",
    "Open Transport", "Car Buyer Auto Transport", "Expedited Auto Transport", "Car Resellers Auto Transport",
    "Car Dealer Shipping", "Auto Auction Shipping", "Rental Car Shipping", "Corporate Relocation",
    "Fleet Management Transportation Services", "Motorcycle Shipping", "Alaska Auto Transport",
    "Hawaii Auto Transport", "International Overseas Car Shipping Services"
];

function generateSlug(name) {
    return name.toLowerCase().replace(/ \/ /g, '-').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Read the base template (we use Virginia as the premium design base)
const baseTemplatePath = path.join(__dirname, '../routes/virginia-car-shipping.html');
const baseTemplate = fs.readFileSync(baseTemplatePath, 'utf-8');

services.forEach(service => {
    const slug = generateSlug(service);
    const outputPath = path.join(__dirname, `${slug}.html`);

    let content = baseTemplate;

    // 1. Meta & Title
    content = content.replace(/<title>.*?<\/title>/g, `<title>${service} | Fast & Reliable | Neon Auto Transport</title>`);
    content = content.replace(/content="Ship your car to or from Virginia with Neon Auto Transport.*?">/g, `content="Get instant quotes for ${service} with Neon Auto Transport. Reliable, affordable, and safe vehicle shipping nationwide.">`);

    // 2. Hero Section
    const srvData = serviceDataMap[service] || { audience: "customers", benefit: "reliable transport", feature: "premium service", tip: "Book early to guarantee your dates." };
    content = content.replace(/Virginia Car Shipping/g, service);
    const heroDesc = `Neon Auto Transport provides professional, secure, and reliable ${service}. Designed specifically for ${srvData.audience}, our logistics team ensures a smooth experience by focusing on ${srvData.benefit}. With ${srvData.feature}, you can trust us to handle your vehicle with the utmost care.`;
    
    const images = [
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=60",
        "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=60",
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=60",
        "https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?auto=format&fit=crop&w=1200&q=60",
        "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=60"
    ];
    // Deterministic image selection based on service name length
    const imgUrl = images[service.length % images.length];

    const layoutA = `
    <section class="bg-[#0a2540] text-white pt-24 pb-40 slant-bottom relative overflow-hidden">
        <div class="absolute inset-0 w-full h-full opacity-10">
            <img src="${imgUrl}" class="w-full h-full object-cover">
        </div>
        <div class="container mx-auto px-4 lg:px-8 max-w-4xl text-center relative z-10">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.1)] text-xs font-bold mb-6">
                <span class="w-2 h-2 rounded-full bg-[#39FF14]"></span>
                FMSCA & US Dot Approved
            </div>
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">${service}</h1>
            <p class="text-lg text-[#cdd5df] mb-10 max-w-3xl mx-auto leading-relaxed">${heroDesc}</p>
            <div class="flex justify-center gap-4">
                <a href="/quote/" class="bg-[#39FF14] text-[#0a2540] px-8 py-4 rounded-full font-black text-lg hover:bg-[#32e011] transition shadow-lg flex items-center gap-2">
                    Calculate Your Rate Instantly 
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </a>
            </div>
        </div>
    </section>`;

    const layoutB = `
    <section class="relative pt-32 pb-48 flex items-center justify-center border-b-[8px] border-[#39FF14]">
        <div class="absolute inset-0 w-full h-full">
            <img src="${imgUrl}" alt="${service}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-[#0a2540]/85"></div>
        </div>
        <div class="container mx-auto px-4 lg:px-8 max-w-4xl text-center relative z-10">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white text-sm font-bold mb-8">
                <span class="w-2.5 h-2.5 rounded-full bg-[#39FF14] animate-pulse"></span>
                Premium ${service}
            </div>
            <h1 class="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-lg">${service}</h1>
            <p class="text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-md">${heroDesc}</p>
            <div class="flex justify-center gap-4">
                <a href="/quote/" class="bg-[#39FF14] text-[#0a2540] px-10 py-5 rounded-full font-black text-xl hover:bg-[#32e011] transition hover:-translate-y-1 shadow-[0_10px_30px_rgba(57,255,20,0.3)] flex items-center gap-2">
                    Get an Instant Quote 
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </a>
            </div>
        </div>
    </section>`;

    const layoutC = `
    <section class="bg-[#f6f9fc] border-b border-[#e6e6e6]">
        <div class="flex flex-col lg:flex-row">
            <div class="lg:w-1/2 px-8 py-20 lg:py-32 lg:px-16 flex flex-col justify-center">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#e6e6e6] bg-white shadow-sm text-[#0a2540] text-xs font-bold mb-6 self-start">
                    <span class="w-2 h-2 rounded-full bg-[#39FF14]"></span>
                    FMSCA & US Dot Approved
                </div>
                <h1 class="text-4xl md:text-5xl lg:text-6xl font-black text-[#0a2540] mb-6 tracking-tight">${service}</h1>
                <p class="text-lg text-[#425466] mb-10 leading-relaxed">${heroDesc}</p>
                <div class="flex">
                    <a href="/quote/" class="bg-[#39FF14] text-[#0a2540] px-8 py-4 rounded-full font-black text-lg hover:bg-[#32e011] transition shadow-[0_0_15px_rgba(57,255,20,0.4)] flex items-center gap-2">
                        Calculate Your Rate Instantly 
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </a>
                </div>
            </div>
            <div class="lg:w-1/2 relative min-h-[400px]">
                <img src="${imgUrl}" alt="${service}" class="absolute inset-0 w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-r from-[#f6f9fc] to-transparent w-32"></div>
            </div>
        </div>
    </section>`;

    const layouts = [layoutA, layoutB, layoutC];
    const selectedLayout = layouts[service.length % layouts.length];

    const heroRegex = /<section class="bg-\[#0a2540\] text-white pt-24 pb-40 slant-bottom relative">[\s\S]*?<\/section>/;
    content = content.replace(heroRegex, selectedLayout);
    
    // Inject a unique tip into the "Tips & Tricks" section
    content = content.replace(
        /<h3 class="font-bold text-\[#0a2540\] text-lg mb-1">Off Season Savings<\/h3>\s*<p>Car shipping rates drop during the off-season\. Even shifting your shipment by a few weeks can lead to real savings\. Avoid peak moving seasons like summer and major holidays to get the best rates\.<\/p>/g,
        `<h3 class="font-bold text-[#0a2540] text-lg mb-1">Pro Tip for ${service}</h3>\n                                <p>${srvData.tip}</p>`
    );

    // 3. Remove Popular Routes Table (Doesn't make sense for generic services)
    const routesRegex = /<!-- Popular Routes Section -->[\s\S]*?<!-- Two Column Layout for the Rest -->/m;
    content = content.replace(routesRegex, '<!-- Two Column Layout for the Rest -->');

    // 4. Change "Factors that Affect Virginia Shipping Prices" to generic
    content = content.replace(/Factors that Affect Virginia Shipping Prices/g, `Factors that Affect ${service} Costs`);

    // 5. Change Tips & Tricks wording
    content = content.replace(/For pickups and drop-offs in Virginia/g, `For your auto transport needs`);

    // 6. Remove "Cities We Serve in Virginia" entirely
    const citiesRegex = /<!-- Cities We Serve -->[\s\S]*?<!-- FAQs -->/m;
    content = content.replace(citiesRegex, '<!-- FAQs -->');

    // 7. Change FAQs Title
    content = content.replace(/Virginia Vehicle Transport FAQs/g, `${service} FAQs`);
    content = content.replace(/to\/from VA\?/g, `with this service?`);
    content = content.replace(/transporting from Virginia\?/g, `during transport?`);
    content = content.replace(/in Virginia\?/g, `?`);
    content = content.replace(/Virginia shipments/g, `shipments`);

    // 8. Change Sidebar title
    content = content.replace(/How Car Shipping Works in VA/g, `How ${service} Works`);

    // Update relative paths since services/ is at the same level as routes/ (no change needed for ../)
    // Actually, virginia-car-shipping is in routes/ so ../ still points to root.

    // Component Shuffling
    const factorsRegex = /(<!-- Factors Impacting Costs -->[\s\S]*?)<!-- TIPS & TRICKS -->/;
    const tipsRegex = /(<!-- TIPS & TRICKS -->[\s\S]*?)<!-- FAQs -->/;
    const faqsRegex = /(<!-- FAQs -->[\s\S]*?)(?=<\/div>\s*<!-- Right Sidebar Sticky -->)/;

    const factorsMatch = content.match(factorsRegex);
    const tipsMatch = content.match(tipsRegex);
    const faqsMatch = content.match(faqsRegex);

    if (factorsMatch && tipsMatch && faqsMatch) {
        let components = [
            factorsMatch[1],
            tipsMatch[1],
            faqsMatch[1]
        ];
        
        // Shuffle deterministically based on service name length
        let currentIndex = components.length, randomIndex;
        let seed = service.length;
        while (currentIndex != 0) {
            randomIndex = (seed * 11) % currentIndex;
            currentIndex--;
            seed += 17;
            [components[currentIndex], components[randomIndex]] = [components[randomIndex], components[currentIndex]];
        }

        const replacementContent = components.join('\n');
        const fullBlockRegex = /<!-- Factors Impacting Costs -->[\s\S]*?(?=<\/div>\s*<!-- Right Sidebar Sticky -->)/;
        content = content.replace(fullBlockRegex, replacementContent);
    }

    fs.writeFileSync(outputPath, content);
    console.log(`Generated ${slug}.html`);
});

console.log('All service pages generated successfully!');
