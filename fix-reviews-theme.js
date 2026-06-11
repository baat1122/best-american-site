const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const oldReviews = html.substring(
  html.indexOf('<!-- Reviews & Testimonials -->'),
  html.indexOf('</section>', html.indexOf('<!-- Reviews & Testimonials -->')) + '</section>'.length
);

const newReviews = `<!-- Reviews & Testimonials -->
<section id="reviews" class="py-24 bg-[#f6f9fc] relative overflow-hidden border-t border-[#e6e6e6]">
    <div class="container mx-auto px-4 max-w-6xl relative z-10">
        <div class="text-center mb-16 reveal">
            <span class="inline-block text-[#635bff] text-xs font-bold uppercase tracking-widest mb-3 bg-[#635bff]/10 px-4 py-1.5 rounded-full">Customer Reviews</span>
            <h2 class="text-3xl md:text-4xl font-black text-[#0a2540] mb-4">What Our Customers Say</h2>
            <p class="text-[#425466] text-lg max-w-2xl mx-auto">Trusted by thousands of vehicle owners across the nation.</p>
            <div class="flex items-center justify-center gap-2 mt-6"><div class="flex text-yellow-400 text-xl">&#9733;&#9733;&#9733;&#9733;&#9733;</div><span class="text-[#0a2540] font-bold text-lg">4.9/5</span><span class="text-[#425466] text-sm">1,247+ reviews</span></div>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
            <div class="bg-white rounded-2xl p-8 border border-[#e6e6e6] hover:border-[#635bff] hover:shadow-lg transition-all duration-300 reveal" style="transition-delay:100ms"><div class="flex text-yellow-400 text-lg mb-4">&#9733;&#9733;&#9733;&#9733;&#9733;</div><p class="text-[#425466] text-sm leading-relaxed mb-6 italic">"Shipped my BMW from Virginia to California - zero stress, constant communication, and the car arrived in perfect condition 5 days later."</p><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#635bff] to-[#00d4ff] flex items-center justify-center text-white font-bold text-sm">MR</div><div><p class="text-[#0a2540] font-bold text-sm">Michael R.</p><p class="text-[#425466] text-xs">VA to CA - BMW 540i</p></div></div></div>
            <div class="bg-white rounded-2xl p-8 border border-[#e6e6e6] hover:border-[#00d4ff] hover:shadow-lg transition-all duration-300 reveal" style="transition-delay:200ms"><div class="flex text-yellow-400 text-lg mb-4">&#9733;&#9733;&#9733;&#9733;&#9733;</div><p class="text-[#425466] text-sm leading-relaxed mb-6 italic">"I was nervous about shipping my classic Mustang cross-country, but Neon made it seamless. Enclosed transport was worth every penny."</p><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#39FF14] to-[#00d4ff] flex items-center justify-center text-white font-bold text-sm">ST</div><div><p class="text-[#0a2540] font-bold text-sm">Sarah T.</p><p class="text-[#425466] text-xs">TX to FL - 1967 Ford Mustang</p></div></div></div>
            <div class="bg-white rounded-2xl p-8 border border-[#e6e6e6] hover:border-[#39FF14] hover:shadow-lg transition-all duration-300 reveal" style="transition-delay:300ms"><div class="flex text-yellow-400 text-lg mb-4">&#9733;&#9733;&#9733;&#9733;&#9733;</div><p class="text-[#425466] text-sm leading-relaxed mb-6 italic">"Military PCS move - needed my truck shipped from San Diego to Virginia on short notice. Neon handled everything. Highly recommend!"</p><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#635bff] to-[#39FF14] flex items-center justify-center text-white font-bold text-sm">JW</div><div><p class="text-[#0a2540] font-bold text-sm">James W.</p><p class="text-[#425466] text-xs">CA to VA - Ford F-150</p></div></div></div>
        </div>
        <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 reveal" style="transition-delay:400ms"><div class="text-center"><p class="text-3xl font-black text-[#0a2540]">150K+</p><p class="text-[#425466] text-xs font-medium mt-1">Vehicles Shipped</p></div><div class="text-center"><p class="text-3xl font-black text-[#0a2540]">9+</p><p class="text-[#425466] text-xs font-medium mt-1">Years Experience</p></div><div class="text-center"><p class="text-3xl font-black text-[#0a2540]">4.9</p><p class="text-[#425466] text-xs font-medium mt-1">Average Rating</p></div><div class="text-center"><p class="text-3xl font-black text-[#0a2540]">50</p><p class="text-[#425466] text-xs font-medium mt-1">States Covered</p></div></div>
        <div class="mt-12 flex flex-wrap justify-center gap-6 reveal" style="transition-delay:500ms"><a href="https://www.google.com/maps/place/Neon+Auto+Transport" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-[#425466] hover:text-[#635bff] text-sm font-medium transition">Google Reviews</a><a href="https://www.trustpilot.com/review/neonautotransport.com" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-[#425466] hover:text-[#635bff] text-sm font-medium transition">Trustpilot</a><a href="https://www.bbb.org/us/va/woodbridge/profile/auto-transporters/neon-auto-transport-0241-236024907" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-[#425466] hover:text-[#635bff] text-sm font-medium transition">BBB Accredited</a></div>
    </div>
</section>`;

const fixed = html.replace(oldReviews, newReviews);
fs.writeFileSync('index.html', fixed, 'utf8');
console.log('Reviews section updated to light theme');
