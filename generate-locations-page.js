const fs = require('fs');

const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", 
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", 
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", 
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", 
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", 
    "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", 
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const stateCodes = {
    "Alabama": "al", "Alaska": "ak", "Arizona": "az", "Arkansas": "ar", "California": "ca",
    "Colorado": "co", "Connecticut": "ct", "Delaware": "de", "Florida": "fl", "Georgia": "ga",
    "Hawaii": "hi", "Idaho": "id", "Illinois": "il", "Indiana": "in", "Iowa": "ia",
    "Kansas": "ks", "Kentucky": "ky", "Louisiana": "la", "Maine": "me", "Maryland": "md",
    "Massachusetts": "ma", "Michigan": "mi", "Minnesota": "mn", "Mississippi": "ms", "Missouri": "mo",
    "Montana": "mt", "Nebraska": "ne", "Nevada": "nv", "New Hampshire": "nh", "New Jersey": "nj",
    "New Mexico": "nm", "New York": "ny", "North Carolina": "nc", "North Dakota": "nd", "Ohio": "oh",
    "Oklahoma": "ok", "Oregon": "or", "Pennsylvania": "pa", "Rhode Island": "ri", "South Carolina": "sc",
    "South Dakota": "sd", "Tennessee": "tn", "Texas": "tx", "Utah": "ut", "Vermont": "vt",
    "Virginia": "va", "Washington": "wa", "West Virginia": "wv", "Wisconsin": "wi", "Wyoming": "wy"
};

let cardsHtml = '';
states.forEach(state => {
    let slug = state.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '');
    let stateCode = stateCodes[state];
    let flagUrl = `https://flagcdn.com/w80/us-${stateCode}.png`;

    cardsHtml += `
            <a href="routes/${slug}-car-shipping.html" class="flex items-start gap-4 p-5 rounded-2xl border border-[#e6e6e6] bg-white hover:border-[#635bff] hover:shadow-md transition-all group">
                <img src="${flagUrl}" alt="${state} Flag" class="w-10 h-10 rounded-full object-cover shrink-0 shadow-sm border border-[#e6e6e6] bg-slate-50" />
                <div>
                    <h4 class="font-bold text-[#0a2540] group-hover:text-[#635bff] transition-colors">${state}</h4>
                    <p class="text-xs text-[#425466] mt-1 leading-relaxed">Compare verified auto transport companies in ${state}.</p>
                </div>
            </a>`;
});

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Locations | Neon Auto Transport</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="/css/styles.css">
</head>
<body class="antialiased bg-[#f6f9fc]">

    <!-- Global Header (simplified for locations page) -->
    <header class="bg-[#0a2540] w-full z-50 transition-all duration-300">
        <div class="container mx-auto px-4 lg:px-8 py-5 flex justify-between items-center">
            <a href="/" class="text-2xl font-black tracking-tight flex items-center gap-1 text-white">
                NEON <span class="text-[#00D4FF]">AUTO TRANSPORT</span>
            </a>
            <div class="hidden lg:flex items-center gap-4">
                <a href="tel:5715767711" class="text-white font-bold hover:opacity-80">(571) 576-7711</a>
                <a href="/quote/" class="bg-[#635bff] text-white px-5 py-2 rounded-full font-bold hover:bg-[#524be3] transition">Cost Calculator</a>
            </div>
        </div>
    </header>

    <main class="py-24">
        <div class="container mx-auto px-4 lg:px-8 max-w-7xl">
            <div class="mb-12 text-center max-w-2xl mx-auto">
                <h1 class="text-4xl md:text-5xl font-black text-[#0a2540] tracking-tight mb-4">All US Locations</h1>
                <p class="text-lg text-[#425466]">Neon Auto Transport provides reliable, coast-to-coast car shipping services across all 50 states. Select your state below to find local transport guides and instant rates.</p>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                ${cardsHtml}
            </div>

            <div class="mt-16 text-center">
                <a href="/" class="text-[#635bff] font-bold hover:underline">&larr; Back to Home</a>
            </div>
        </div>
    </main>

    <!-- Global Footer -->
    <footer class="bg-white pt-20 pb-10 border-t border-[#e6e6e6]">
        <div class="container mx-auto px-4 lg:px-8 max-w-6xl text-center">
            <p class="text-[#425466] text-sm font-medium">&copy; 2026 Neon Auto Transport. All rights reserved.</p>
        </div>
    </footer>

</body>
</html>`;

fs.writeFileSync('locations.html', htmlContent);
console.log('locations.html generated successfully.');
