const fs = require('fs');
const path = require('path');

const services = [
    // Individual
    "Snow Bird Car Shipping",
    "Military Car Shipping",
    "College Car Shipping",
    "Luxury / Exotic Car Shipping Services",
    "Car Shipping to Another State",
    "Truck Shipping Services",
    "Door to Door Car Transport",
    "Enclosed Transport",
    "Open Transport",
    "Car Buyer Auto Transport",
    "Expedited Auto Transport",
    "Car Resellers Auto Transport",
    
    // Business
    "Car Dealer Shipping",
    "Auto Auction Shipping",
    "Rental Car Shipping",
    "Corporate Relocation",
    "Fleet Management Transportation Services",
    
    // Specialized
    "Motorcycle Shipping",
    "Alaska Auto Transport",
    "Hawaii Auto Transport",
    "International Overseas Car Shipping Services"
];

function generateSlug(name) {
    return name.toLowerCase()
               .replace(/ \/ /g, '-')
               .replace(/[^a-z0-9]+/g, '-')
               .replace(/^-|-$/g, '');
}

services.forEach(service => {
    const slug = generateSlug(service);
    const fileName = `${slug}.html`;
    
    // Note: This template assumes it sits inside the 'services/' directory.
    // So links back to home are '../index.html' or '/index.html' (we use relative here for local dev).
    const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${service} | Best American Auto Transport Inc</title>
    <meta name="description" content="Get instant quotes for ${service} with Best American Auto Transport Inc. Reliable, affordable, and safe vehicle shipping nationwide.">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="/css/styles.css">
</head>
<body class="antialiased bg-[#f6f9fc]">

    <!-- Header (Simplified for Service Page) -->
    <header class="bg-[#0a2540] w-full z-50">
        <div class="container mx-auto px-4 lg:px-8 py-5 flex justify-between items-center">
            <a href="/" class="text-2xl font-black tracking-tight flex items-center gap-1 text-white">
                BEST AMERICAN <span class="text-[#00D4FF]">AUTO TRANSPORT</span>
            </a>
            <div class="hidden lg:flex items-center gap-4">
                <a href="tel:3023555544" class="text-white font-bold hover:opacity-80">(302) 355-5544</a>
                <a href="/" class="bg-[#800020] text-white px-5 py-2 rounded-full font-bold hover:bg-[#5c0017] transition">Get Quote</a>
            </div>
        </div>
    </header>

    <main class="py-24">
        <div class="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
            <h1 class="text-4xl md:text-5xl font-black text-[#0a2540] tracking-tight mb-6">${service}</h1>
            <p class="text-lg text-[#425466] leading-relaxed mb-10">
                Best American Auto Transport Inc provides professional, secure, and reliable <strong>${service}</strong>. 
                Whether you're moving a single vehicle or an entire fleet, our dedicated logistics team ensures a smooth experience from pickup to delivery.
            </p>
            
            <div class="bg-white p-8 rounded-2xl shadow-lg border border-[#e6e6e6]">
                <h3 class="text-2xl font-bold text-[#0a2540] mb-4">Ready to ship?</h3>
                <p class="text-[#425466] mb-8">Use our calculator to get an instant quote tailored exactly to your route and vehicle type.</p>
                <a href="/" class="btn-primary py-4 px-10 text-lg shadow-xl shadow-[#800020]/30 inline-block">Calculate Shipping Cost</a>
            </div>
            
            <div class="mt-12 text-left">
                <a href="/" class="text-[#800020] font-bold hover:underline">&larr; Back to Home</a>
            </div>
        </div>
    </main>

    <footer class="bg-white pt-20 pb-10 border-t border-[#e6e6e6]">
        <div class="container mx-auto px-4 lg:px-8 max-w-6xl text-center">
            <p class="text-[#425466] text-sm font-medium">&copy; 2026 Best American Auto Transport Inc. All rights reserved.</p>
        </div>
    </footer>

</body>
</html>`;

    fs.writeFileSync(path.join(__dirname, fileName), htmlTemplate);
    console.log(`Generated ${fileName}`);
});

console.log('All service pages generated successfully.');
