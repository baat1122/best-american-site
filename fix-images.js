const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'routes');

// Each state gets a unique, thematically relevant Unsplash photo
// Format: filename -> unique unsplash photo ID
const stateImages = {
    'alabama-car-shipping.html': 'fuM-2Y3mwbw',        // Rural valley landscape
    'alaska-car-shipping.html': '2H3n__Djf8Y',          // Snow mountain road
    'arizona-car-shipping.html': '-H-RXMm1Vs4',          // Desert saguaro cacti
    'arkansas-car-shipping.html': 'Az38Fy4jcoE',         // Ozark forest sunset
    'california-car-shipping.html': 'PTyxFrwYcmM',       // Golden Gate Bridge
    'colorado-car-shipping.html': 'ImPKLAkrDhc',         // Mountain road hills
    'connecticut-car-shipping.html': 'ITWWyro0xDo',      // Autumn forest river
    'delaware-car-shipping.html': 'xsxTZ-i9Ny8',         // Coastal lighthouse
    'florida-car-shipping.html': 'MSyrBrChIlY',          // Palm tree coastal road
    'georgia-car-shipping.html': 'FwTOw8cAtPg',          // Atlanta aerial highway
    'hawaii-car-shipping.html': 'vVkeIst33_o',            // Ocean coastal highway
    'idaho-car-shipping.html': 'JuJiy1hlnnY',             // Sawtooth mountain twilight
    'illinois-car-shipping.html': 'fNfCjzJzSHA',          // Chicago skyline highway
    'indiana-car-shipping.html': 'CKJvvfX2rbg',           // Rural farmland road
    'iowa-car-shipping.html': 'jW-fx4BvdqA',              // Cornfield road
    'kansas-car-shipping.html': 'xYZ_Nyjb-64',            // Prairie wheat field road
    'kentucky-car-shipping.html': 'xcPNRtFTC3E',          // Horse farm river
    'louisiana-car-shipping.html': 'g3HZha3RfhQ',         // Swamp wetland sunset
    'maine-car-shipping.html': '29CqR-y1Wh8',             // Autumn foliage hillside
    'maryland-car-shipping.html': '6xGjqJD65Ww',          // Coastal lighthouse
    'massachusetts-car-shipping.html': 'FcSHuO7mPJg',     // Autumn foliage vibrant
    'michigan-car-shipping.html': 'WLoJj7H7t-8',          // Forest aerial road
    'minnesota-car-shipping.html': 'QfuIyi0TYKk',         // Snowy evergreen lake
    'mississippi-car-shipping.html': 'GBTTod7mF7E',       // River forest wetlands
    'missouri-car-shipping.html': 'fTB9X8-oBcQ',          // Road through landscape
    'montana-car-shipping.html': '7bAxEOoJFlM',           // Mountain road scenic
    'nebraska-car-shipping.html': 'pLEzva-DbME',          // Plains dramatic sky
    'nevada-car-shipping.html': 'D6e13_64bHk',            // Desert loneliest road
    'new-hampshire-car-shipping.html': 'y0sNzuQWlUs',     // Autumn forest house
    'new-jersey-car-shipping.html': 'C1WrUw53kW0',        // Coastal shore
    'new-mexico-car-shipping.html': 'exVm25rXDVw',        // Desert road mesa
    'new-york-car-shipping.html': 'zr-BcvJf2s0',          // NYC skyline water
    'north-carolina-car-shipping.html': 'wMBxAoKrt0U',    // Blue Ridge Parkway
    'north-dakota-car-shipping.html': 't3HvoVzQCPU',      // Prairie highway
    'ohio-car-shipping.html': '0dLEfNZRu5w',              // Farmland dirt road
    'oklahoma-car-shipping.html': 'ywwMXY1LLeo',          // Rural sunset road
    'oregon-car-shipping.html': 'BFcotPPePJU',            // Forest road misty
    'pennsylvania-car-shipping.html': 'f7XSezPtrTc',      // Autumn mountain road bridge
    'rhode-island-car-shipping.html': 'cTrV-3hkKDs',      // Rocky coastal field
    'south-carolina-car-shipping.html': 'UK-Dp2v3uZc',    // Coastal beach aerial
    'south-dakota-car-shipping.html': 'jm1cQ5Ba4To',      // Badlands landscape
    'tennessee-car-shipping.html': 'IgYHz6gAk2s',         // Smoky mountain road
    'texas-car-shipping.html': 'Jb0n2WcLzGY',             // Desert road Big Bend
    'utah-car-shipping.html': '7sTPLQNxVOY',              // Red rock canyon road
    'vermont-car-shipping.html': 'HyNwVB130Ww',           // Fall mountain range
    'virginia-car-shipping.html': '2eq-5PJg-qw',          // Shenandoah Skyline Drive
    'washington-car-shipping.html': 'WHiPPQCrl18',        // Seattle mountain fog
    'washington-dc-car-shipping.html': 'FHX3qYrLB84',     // Washington Monument street
    'west-virginia-car-shipping.html': 'AGB8u8DNn1g',     // Appalachian green hills
    'wisconsin-car-shipping.html': '1HeavLAhxYs',         // Lake forest autumn
    'wyoming-car-shipping.html': 'WdPfpBcSYss',           // Mountain prairie fence
};

const imgUrlBase = 'https://images.unsplash.com/photo-';
const imgUrlParams = '?auto=format&fit=crop&w=1200&q=60';

let updated = 0;
let skipped = 0;

for (const [filename, photoId] of Object.entries(stateImages)) {
    const filePath = path.join(routesDir, filename);
    if (!fs.existsSync(filePath)) {
        console.log(`NOT FOUND: ${filename}`);
        skipped++;
        continue;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const newUrl = `${imgUrlBase}${photoId}${imgUrlParams}`;

    // Find and replace the hero image URL
    // Match: <img src="https://images.unsplash.com/photo-XXXXX?auto=format&fit=crop&w=1200&q=60"
    const imgRegex = /<img\s+src="https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9_-]+\?auto=format&fit=crop&w=1200&q=60"/;
    const match = content.match(imgRegex);

    if (!match) {
        console.log(`NO MATCH: ${filename}`);
        skipped++;
        continue;
    }

    const oldSrc = match[0];
    const newSrc = `<img src="${newUrl}"`;

    if (oldSrc === newSrc) {
        console.log(`SAME IMAGE: ${filename}`);
        skipped++;
        continue;
    }

    content = content.replace(oldSrc, newSrc);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`UPDATED: ${filename} -> photo-${photoId}`);
    updated++;
}

console.log(`\nDone! Updated: ${updated}, Skipped: ${skipped}`);
