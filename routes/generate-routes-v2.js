const fs = require('fs');
const path = require('path');
const stateDataMap = require('./state-data.json');

const statesData = [
    { name: "Alabama", abbr: "AL", cities: ["Birmingham", "Montgomery", "Huntsville", "Mobile"] },
    { name: "Alaska", abbr: "AK", cities: ["Anchorage", "Fairbanks", "Juneau", "Sitka"] },
    { name: "Arizona", abbr: "AZ", cities: ["Phoenix", "Tucson", "Mesa", "Chandler"] },
    { name: "Arkansas", abbr: "AR", cities: ["Little Rock", "Fort Smith", "Fayetteville", "Springdale"] },
    { name: "California", abbr: "CA", cities: ["Los Angeles", "San Diego", "San Jose", "San Francisco", "Fresno", "Sacramento", "Long Beach", "Oakland", "Bakersfield", "Anaheim"] },
    { name: "Colorado", abbr: "CO", cities: ["Denver", "Colorado Springs", "Aurora", "Fort Collins"] },
    { name: "Connecticut", abbr: "CT", cities: ["Bridgeport", "New Haven", "Stamford", "Hartford"] },
    { name: "Delaware", abbr: "DE", cities: ["Wilmington", "Dover", "Newark", "Middletown"] },
    { name: "Florida", abbr: "FL", cities: ["Jacksonville", "Miami", "Tampa", "Orlando", "St. Petersburg", "Hialeah", "Port St. Lucie", "Tallahassee"] },
    { name: "Georgia", abbr: "GA", cities: ["Atlanta", "Augusta", "Columbus", "Macon"] },
    { name: "Hawaii", abbr: "HI", cities: ["Honolulu", "Pearl City", "Hilo", "Kailua"] },
    { name: "Idaho", abbr: "ID", cities: ["Boise", "Meridian", "Nampa", "Idaho Falls"] },
    { name: "Illinois", abbr: "IL", cities: ["Chicago", "Aurora", "Naperville", "Joliet"] },
    { name: "Indiana", abbr: "IN", cities: ["Indianapolis", "Fort Wayne", "Evansville", "South Bend"] },
    { name: "Iowa", abbr: "IA", cities: ["Des Moines", "Cedar Rapids", "Davenport", "Sioux City"] },
    { name: "Kansas", abbr: "KS", cities: ["Wichita", "Overland Park", "Kansas City", "Olathe"] },
    { name: "Kentucky", abbr: "KY", cities: ["Louisville", "Lexington", "Bowling Green", "Owensboro"] },
    { name: "Louisiana", abbr: "LA", cities: ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette"] },
    { name: "Maine", abbr: "ME", cities: ["Portland", "Lewiston", "Bangor", "South Portland"] },
    { name: "Maryland", abbr: "MD", cities: ["Baltimore", "Columbia", "Germantown", "Silver Spring"] },
    { name: "Massachusetts", abbr: "MA", cities: ["Boston", "Worcester", "Springfield", "Cambridge"] },
    { name: "Michigan", abbr: "MI", cities: ["Detroit", "Grand Rapids", "Warren", "Sterling Heights"] },
    { name: "Minnesota", abbr: "MN", cities: ["Minneapolis", "St. Paul", "Rochester", "Duluth"] },
    { name: "Mississippi", abbr: "MS", cities: ["Jackson", "Gulfport", "Southaven", "Biloxi"] },
    { name: "Missouri", abbr: "MO", cities: ["Kansas City", "St. Louis", "Springfield", "Columbia"] },
    { name: "Montana", abbr: "MT", cities: ["Billings", "Missoula", "Great Falls", "Bozeman"] },
    { name: "Nebraska", abbr: "NE", cities: ["Omaha", "Lincoln", "Bellevue", "Grand Island"] },
    { name: "Nevada", abbr: "NV", cities: ["Las Vegas", "Henderson", "Reno", "North Las Vegas"] },
    { name: "New Hampshire", abbr: "NH", cities: ["Manchester", "Nashua", "Concord", "Derry"] },
    { name: "New Jersey", abbr: "NJ", cities: ["Newark", "Jersey City", "Paterson", "Elizabeth"] },
    { name: "New Mexico", abbr: "NM", cities: ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe"] },
    { name: "New York", abbr: "NY", cities: ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse", "Albany"] },
    { name: "North Carolina", abbr: "NC", cities: ["Charlotte", "Raleigh", "Greensboro", "Durham"] },
    { name: "North Dakota", abbr: "ND", cities: ["Fargo", "Bismarck", "Grand Forks", "Minot"] },
    { name: "Ohio", abbr: "OH", cities: ["Columbus", "Cleveland", "Cincinnati", "Toledo"] },
    { name: "Oklahoma", abbr: "OK", cities: ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow"] },
    { name: "Oregon", abbr: "OR", cities: ["Portland", "Salem", "Eugene", "Gresham"] },
    { name: "Pennsylvania", abbr: "PA", cities: ["Philadelphia", "Pittsburgh", "Allentown", "Erie"] },
    { name: "Rhode Island", abbr: "RI", cities: ["Providence", "Cranston", "Warwick", "Pawtucket"] },
    { name: "South Carolina", abbr: "SC", cities: ["Charleston", "Columbia", "North Charleston", "Mount Pleasant"] },
    { name: "South Dakota", abbr: "SD", cities: ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings"] },
    { name: "Tennessee", abbr: "TN", cities: ["Nashville", "Memphis", "Knoxville", "Chattanooga"] },
    { name: "Texas", abbr: "TX", cities: ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth", "El Paso", "Arlington", "Corpus Christi"] },
    { name: "Utah", abbr: "UT", cities: ["Salt Lake City", "West Valley City", "Provo", "West Jordan"] },
    { name: "Vermont", abbr: "VT", cities: ["Burlington", "South Burlington", "Rutland", "Barre"] },
    { name: "Virginia", abbr: "VA", cities: ["Virginia Beach", "Norfolk", "Chesapeake", "Richmond", "Newport News", "Alexandria", "Hampton", "Roanoke"] },
    { name: "Washington", abbr: "WA", cities: ["Seattle", "Spokane", "Tacoma", "Vancouver"] },
    { name: "Washington D.C.", abbr: "DC", cities: ["Washington"] },
    { name: "West Virginia", abbr: "WV", cities: ["Charleston", "Huntington", "Morgantown", "Parkersburg"] },
    { name: "Wisconsin", abbr: "WI", cities: ["Milwaukee", "Madison", "Green Bay", "Kenosha"] },
    { name: "Wyoming", abbr: "WY", cities: ["Cheyenne", "Casper", "Laramie", "Gillette"] }
];

const templatePath = path.join(__dirname, 'virginia-car-shipping.html');
const template = fs.readFileSync(templatePath, 'utf-8');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const stateCoords = {
  "Alabama": { lat: 33.5186, lng: -86.8104 },
  "Alaska": { lat: 61.2181, lng: -149.9003 },
  "Arizona": { lat: 33.4484, lng: -112.0740 },
  "Arkansas": { lat: 34.7465, lng: -92.2896 },
  "California": { lat: 34.0522, lng: -118.2437 },
  "Colorado": { lat: 39.7392, lng: -104.9903 },
  "Connecticut": { lat: 41.7637, lng: -72.6851 },
  "Delaware": { lat: 39.7447, lng: -75.5484 },
  "Florida": { lat: 25.7617, lng: -80.1918 },
  "Georgia": { lat: 33.7490, lng: -84.3880 },
  "Hawaii": { lat: 21.3069, lng: -157.8583 },
  "Idaho": { lat: 43.6150, lng: -116.2023 },
  "Illinois": { lat: 41.8781, lng: -87.6298 },
  "Indiana": { lat: 39.7684, lng: -86.1581 },
  "Iowa": { lat: 41.5868, lng: -93.6250 },
  "Kansas": { lat: 37.6872, lng: -97.3301 },
  "Kentucky": { lat: 38.2527, lng: -85.7585 },
  "Louisiana": { lat: 29.9511, lng: -90.0715 },
  "Maine": { lat: 43.6591, lng: -70.2568 },
  "Maryland": { lat: 39.2904, lng: -76.6122 },
  "Massachusetts": { lat: 42.3601, lng: -71.0589 },
  "Michigan": { lat: 42.3314, lng: -83.0458 },
  "Minnesota": { lat: 44.9778, lng: -93.2650 },
  "Mississippi": { lat: 32.2988, lng: -90.1848 },
  "Missouri": { lat: 38.6270, lng: -90.1994 },
  "Montana": { lat: 45.7833, lng: -108.5007 },
  "Nebraska": { lat: 41.2565, lng: -95.9345 },
  "Nevada": { lat: 36.1716, lng: -115.1398 },
  "New Hampshire": { lat: 42.9956, lng: -71.4548 },
  "New Jersey": { lat: 40.7357, lng: -74.1724 },
  "New Mexico": { lat: 35.0844, lng: -106.6504 },
  "New York": { lat: 40.7128, lng: -74.0060 },
  "North Carolina": { lat: 35.2271, lng: -80.8431 },
  "North Dakota": { lat: 46.8772, lng: -96.7898 },
  "Ohio": { lat: 39.9612, lng: -82.9988 },
  "Oklahoma": { lat: 35.4676, lng: -97.5164 },
  "Oregon": { lat: 45.5152, lng: -122.6784 },
  "Pennsylvania": { lat: 39.9526, lng: -75.1652 },
  "Rhode Island": { lat: 41.8240, lng: -71.4128 },
  "South Carolina": { lat: 32.7765, lng: -79.9311 },
  "South Dakota": { lat: 43.5460, lng: -96.7313 },
  "Tennessee": { lat: 36.1627, lng: -86.7816 },
  "Texas": { lat: 29.7604, lng: -95.3698 },
  "Utah": { lat: 40.7608, lng: -111.8910 },
  "Vermont": { lat: 44.4759, lng: -73.2121 },
  "Virginia": { lat: 37.5407, lng: -77.4360 },
  "Washington": { lat: 47.6062, lng: -122.3321 },
  "Washington D.C.": { lat: 38.9072, lng: -77.0369 },
  "West Virginia": { lat: 38.3498, lng: -81.6326 },
  "Wisconsin": { lat: 43.0389, lng: -87.9065 },
  "Wyoming": { lat: 41.1400, lng: -104.8203 }
};

function getHaversineDistance(coords1, coords2) {
    if (!coords1 || !coords2) return 1000;
    const R = 3958.8; // Radius of Earth in miles
    const lat1 = coords1.lat * Math.PI / 180;
    const lat2 = coords2.lat * Math.PI / 180;
    const deltaLat = (coords2.lat - coords1.lat) * Math.PI / 180;
    const deltaLng = (coords2.lng - coords1.lng) * Math.PI / 180;

    const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLng/2) * Math.sin(deltaLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    return Math.round(d * 1.18); // Convert to road miles roughly
}

function estimateCost(distance) {
    let perMile;
    if (distance < 500) {
        perMile = 1.40;
    } else if (distance < 1000) {
        perMile = 1.10;
    } else if (distance < 1800) {
        perMile = 0.78;
    } else {
        perMile = 0.52;
    }
    let mid = Math.round(distance * perMile);
    if (mid < 450) mid = 450;
    
    let lower = Math.round(mid * 0.85 / 25) * 25;
    let upper = Math.round(mid * 1.15 / 25) * 25;
    return `$${lower} - $${upper}`;
}

function estimateTransit(distance) {
    if (distance < 400) return "1 to 3 days";
    if (distance < 800) return "2 to 4 days";
    if (distance < 1500) return "3 to 6 days";
    if (distance < 2000) return "4 to 7 days";
    if (distance < 2500) return "5 to 8 days";
    return "6 to 10 days";
}

function generatePopularRoutesHTML(sourceState) {
    const popularTargets = ["California", "Texas", "Florida", "Washington", "Arizona", "New York", "Illinois", "Georgia", "North Carolina", "Ohio"];
    const targets = popularTargets.filter(t => t !== sourceState).slice(0, 5);

    const sourceCoords = stateCoords[sourceState];
    
    let routesCardsHTML = '';
    let tableRowsHTML = '';

    targets.forEach((target, index) => {
        const targetCoords = stateCoords[target];
        const dist = getHaversineDistance(sourceCoords, targetCoords);
        const cost = estimateCost(dist);
        const transit = estimateTransit(dist);

        const cardNum = index + 1;

        if (cardNum <= 3) {
            routesCardsHTML += `
                    <!-- Route ${cardNum} -->
                    <div class="bg-white rounded-2xl shadow-sm border border-[#e6e6e6] p-4 flex flex-col md:flex-row items-center gap-6 transition hover:shadow-md">
                        <div class="bg-black text-white text-3xl font-black rounded-xl w-[70px] h-[70px] flex items-center justify-center shrink-0">${cardNum}</div>
                        <div class="flex-1 text-center md:text-left min-w-[150px]">
                            <h4 class="font-bold text-[#0a2540] text-xl">${sourceState}</h4>
                            <p class="text-[#468de6] italic text-[15px] font-semibold">to <span class="text-[#0a2540] not-italic">${target}</span></p>
                        </div>
                        <div class="flex-1 text-center px-4 hidden md:block">
                            <div class="text-[11px] text-[#468de6] font-bold mb-1 uppercase tracking-wider flex items-center justify-center gap-1.5"><svg class="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> DISTANCE</div>
                            <div class="font-bold text-[#0a2540] text-sm">${dist.toLocaleString()} mi</div>
                        </div>
                        <div class="flex-1 text-center px-4 hidden md:block">
                            <div class="text-[11px] text-[#468de6] font-bold mb-1 uppercase tracking-wider flex items-center justify-center gap-1.5"><svg class="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> EST. COST</div>
                            <div class="font-bold text-[#0a2540] text-sm">${cost}</div>
                        </div>
                        <div class="flex-1 text-center px-4 hidden md:block">
                            <div class="text-[11px] text-[#468de6] font-bold mb-1 uppercase tracking-wider flex items-center justify-center gap-1.5"><svg class="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> TRANSIT</div>
                            <div class="font-bold text-[#0a2540] text-sm">${transit}</div>
                        </div>
                        <div class="shrink-0 w-full md:w-auto mt-4 md:mt-0 px-4">
                            <a href="/quote/" class="bg-[#468de6] hover:bg-[#3273c5] text-white font-bold py-2.5 px-8 rounded-lg w-full md:w-auto block text-center transition shadow-sm text-sm">Get Quote</a>
                        </div>
                    </div>`;
        }

        const borderClass = index === targets.length - 1 ? '' : 'border-b border-[#e6e6e6]';
        tableRowsHTML += `
                            <tr class="${borderClass} hover:bg-[#f8fafc] transition">
                                <td class="py-6 px-6">
                                    <div class="font-bold text-[#0a2540] text-lg">${sourceState}</div>
                                    <div class="text-[#468de6] italic font-medium">to ${target}</div>
                                </td>
                                <td class="py-6 px-6 font-bold text-[#0a2540] text-center">${dist.toLocaleString()} mi</td>
                                <td class="py-6 px-6 font-bold text-[#0a2540] text-center">${cost}</td>
                                <td class="py-6 px-6 font-bold text-[#0a2540] text-center">${transit}</td>
                                <td class="py-6 px-6 text-center"><a href="/quote/" class="bg-[#468de6] hover:bg-[#3273c5] text-white text-xs font-bold py-3 px-6 rounded-lg transition shadow-sm">Get Quote</a></td>
                            </tr>`;
    });

    return `<!-- Popular Routes Section -->
            <div class="mb-16">
                <h2 class="text-4xl font-bold mb-6 text-[#0a2540] tracking-tight">Popular Routes from ${sourceState}</h2>
                
                <!-- Top 3 Routes -->
                <h3 class="font-bold text-[#0a2540] flex items-center gap-2 mb-6 uppercase tracking-wider text-sm">
                    <svg class="w-4 h-4 text-[#468de6]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    TOP 3 ROUTES
                </h3>
                
                <div class="space-y-4 mb-8">
                    ${routesCardsHTML}
                </div>

                <!-- Full Table -->
                <div class="overflow-x-auto bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#e6e6e6]">
                    <table class="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr class="bg-[#468de6] text-white text-[12px] font-bold uppercase tracking-wider">
                                <th class="py-5 px-6">ROUTE</th>
                                <th class="py-5 px-6 text-center">DISTANCE</th>
                                <th class="py-5 px-6 text-center">AVG COST</th>
                                <th class="py-5 px-6 text-center">TRANSIT TIME</th>
                                <th class="py-5 px-6 text-center">QUOTE</th>
                            </tr>
                        </thead>
                        <tbody class="text-[15px]">
                            ${tableRowsHTML}
                        </tbody>
                    </table>
                </div>
            </div>`;
}

// Extract cities section and replace it with a dynamically generated one
function generateCitiesHTML(stateName, cities) {
    let citiesLinks = cities.map(city => `<a href="#" class="hover:text-[#0a2540] transition">${city}</a>`).join('\n                            ');
    
    return `<div class="stripe-card p-8 lg:p-10 bg-white">
                        <h2 class="text-3xl font-bold mb-4 text-[#0a2540] tracking-tight">Cities We Serve in ${stateName}</h2>
                        <p class="text-[#425466] mb-8 leading-relaxed">Neon Auto Transport provides car shipping services to cities throughout ${stateName}. Click on any city below to learn more about auto transport options in that area.</p>
                        
                        <div class="font-bold text-[#635bff] mb-4 text-sm uppercase tracking-wider">${cities.length} cities served in ${stateName}</div>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-2 text-sm text-[#468de6] font-semibold">
                            ${citiesLinks}
                        </div>
                    </div>`;
}

statesData.forEach(state => {
    // Generate safe slug
    let slug = state.name.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '');
    const outputPath = path.join(__dirname, `${slug}-car-shipping.html`);

    // Skip virginia since it's the template
    if (state.name === "Virginia") return;

    let content = template;

    // 1. Replace State Name globally
    content = content.replace(/Virginia/g, state.name);
    
    // 2. Replace "VA" abbreviations
    content = content.replace(/\bVA\b/g, state.abbr);
    
    // 3. Replace Richmond, Norfolk
    content = content.replace(/Richmond, Norfolk/g, state.cities.slice(0, 2).join(', '));

    // 3.1 Fix URL slugs in canonical, OG URL, and breadcrumb schema
    content = content.replace(/virginia-car-shipping/g, `${slug}-car-shipping`);

    // 3.2 Rebuild meta description with state-specific data
    const metaDescRegex = /<meta name="description" content="[^"]*">/;
    content = content.replace(metaDescRegex, `<meta name="description" content="Ship your car to or from ${state.name} with Neon Auto Transport. Fully insured door-to-door vehicle transport serving ${state.cities[0]} and all of ${state.name}. FMCSA approved. Get a free instant quote.">`);

    // 3.3 Rebuild OG description
    const ogDescRegex = /<meta property="og:description" content="[^"]*">/;
    content = content.replace(ogDescRegex, `<meta property="og:description" content="Reliable, FMCSA approved car shipping to and from ${state.name}. Serving ${state.cities[0]} and all cities in ${state.name}. Door-to-door auto transport. Call (571) 576-7711.">`);

    // 3.4 Rebuild Twitter description
    const twitterDescRegex = /<meta name="twitter:description" content="[^"]*">/;
    content = content.replace(twitterDescRegex, `<meta name="twitter:description" content="Ship your car to or from ${state.name} with Neon Auto Transport. Door-to-door delivery serving ${state.cities[0]}. Instant quote available.">`);

    // 3.5 Inject unique state data into Hero paragraph and Multi-Layout Engine
    const sData = stateDataMap[state.name];
    if (sData) {
        const heroDesc = `Planning to ship a car to or from ${state.name}? Whether you're relocating to ${sData.nickname} or sending a vehicle across the country, navigating ${sData.highway} and dealing with ${sData.climate} can be challenging. Neon Auto Transport ensures a stress-free experience tailored for ${sData.terrain}, with upfront pricing and a highly vetted carrier network ready to handle ${sData.challenge}.`;
        
        const images = [
            "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=60",
            "https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&w=1200&q=60",
            "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=60",
            "https://images.unsplash.com/photo-1502877338535-34cb0bf4ead3?auto=format&fit=crop&w=1200&q=60",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=60"
        ];
        // Deterministic image selection based on state name length
        const imgUrl = images[state.name.length % images.length];
        
        // Layouts
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
                <h1 class="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">${state.name} Car Shipping</h1>
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
                <img src="${imgUrl}" alt="${state.name} Car Shipping" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-[#0a2540]/85"></div>
            </div>
            <div class="container mx-auto px-4 lg:px-8 max-w-4xl text-center relative z-10">
                <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white text-sm font-bold mb-8">
                    <span class="w-2.5 h-2.5 rounded-full bg-[#39FF14] animate-pulse"></span>
                    Premium ${state.name} Auto Transport
                </div>
                <h1 class="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-lg">${state.name} Car Shipping</h1>
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
                    <h1 class="text-4xl md:text-5xl lg:text-6xl font-black text-[#0a2540] mb-6 tracking-tight">${state.name} Car Shipping</h1>
                    <p class="text-lg text-[#425466] mb-10 leading-relaxed">${heroDesc}</p>
                    <div class="flex">
                        <a href="/quote/" class="bg-[#39FF14] text-[#0a2540] px-8 py-4 rounded-full font-black text-lg hover:bg-[#32e011] transition shadow-[0_0_15px_rgba(57,255,20,0.4)] flex items-center gap-2">
                            Calculate Your Rate Instantly 
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </a>
                    </div>
                </div>
                <div class="lg:w-1/2 relative min-h-[400px]">
                    <img src="${imgUrl}" alt="${state.name} Auto Transport" class="absolute inset-0 w-full h-full object-cover">
                    <div class="absolute inset-0 bg-gradient-to-r from-[#f6f9fc] to-transparent w-32"></div>
                </div>
            </div>
        </section>`;

        const layouts = [layoutA, layoutB, layoutC];
        // Deterministic layout selection
        const selectedLayout = layouts[state.name.length % layouts.length];

        // Replace remaining standalone Richmond references with state hub
        content = content.replace(/Richmond/g, sData.hub);

        // Replace I-95 references with state highway (safe: I-95 only appears in meta/schema)
        content = content.replace(/I-95/g, sData.highway);

        // Replace state nickname
        content = content.replace(/Old Dominion State/g, sData.nickname);

        const heroRegex = /<section class="bg-\[#0a2540\] text-white pt-24 pb-40 slant-bottom relative[^"]*">[\s\S]*?<\/section>/;
        content = content.replace(heroRegex, selectedLayout);

        content = content.replace(
            new RegExp(`For pickups and drop-offs in ${state.name}, choose a location near major highways\\. Spots close to [^<]+attract more carriers`, 'g'),
            `For pickups and drop-offs in ${state.name}, choose a location near major highways. Spots close to ${sData.highway} or near ${sData.hub} attract more carriers`
        );

        // 5. Replace cities section BEFORE component shuffling (shuffle breaks the regex order)
        const originalCitiesRegex = /<div class="stripe-card p-8 lg:p-10 bg-white">[\s\S]*?<!-- FAQs -->/m;
        const newCitiesHTML = generateCitiesHTML(state.name, state.cities) + "\n\n                    <!-- FAQs -->";
        content = content.replace(originalCitiesRegex, newCitiesHTML);

        // Component Shuffling
        const factorsRegex = /(<!-- Factors Impacting Costs -->[\s\S]*?)<!-- TIPS & TRICKS -->/;
        const tipsRegex = /(<!-- TIPS & TRICKS -->[\s\S]*?)<!-- Cities We Serve -->/;
        const citiesRegex = /(<!-- Cities We Serve -->[\s\S]*?)<!-- FAQs -->/;
        const faqsRegex = /(<!-- FAQs -->[\s\S]*?)(?=<\/div>\s*<!-- Right Sidebar Sticky -->)/;

        const factorsMatch = content.match(factorsRegex);
        const tipsMatch = content.match(tipsRegex);
        const citiesMatch = content.match(citiesRegex);
        const faqsMatch = content.match(faqsRegex);

        if (factorsMatch && tipsMatch && citiesMatch && faqsMatch) {
            let components = [
                factorsMatch[1],
                tipsMatch[1],
                citiesMatch[1],
                faqsMatch[1]
            ];
            
            // Shuffle deterministically based on state name length so it stays consistent but unique
            let currentIndex = components.length, randomIndex;
            let seed = state.name.length;
            while (currentIndex != 0) {
                randomIndex = (seed * 7) % currentIndex;
                currentIndex--;
                seed += 13;
                [components[currentIndex], components[randomIndex]] = [components[randomIndex], components[currentIndex]];
            }

            const replacementContent = components.join('\n');
            const fullBlockRegex = /<!-- Factors Impacting Costs -->[\s\S]*?(?=<\/div>\s*<!-- Right Sidebar Sticky -->)/;
            content = content.replace(fullBlockRegex, replacementContent);
        }
    }

    // 4. Update the Popular Routes dynamically with accurate coordinates, distances, costs, and transits
    const routesRegex = /<!-- Popular Routes Section -->[\s\S]*?<!-- Two Column Layout for the Rest -->/m;
    const popularRoutesHTML = generatePopularRoutesHTML(state.name) + "\n\n                    <!-- Two Column Layout for the Rest -->";
    content = content.replace(routesRegex, popularRoutesHTML);

    // (Cities replacement moved before component shuffle above)

    fs.writeFileSync(outputPath, content);
    console.log(`Generated ${slug}-car-shipping.html`);
});

console.log('All state pages generated successfully!');
