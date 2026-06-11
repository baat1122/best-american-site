const fs = require('fs');
const path = require('path');
const https = require('https');

const routesDir = path.join(__dirname, 'routes');

// All short IDs we need to resolve
const stateImages = {
    'alabama-car-shipping.html': 'fuM-2Y3mwbw',
    'alaska-car-shipping.html': '2H3n__Djf8Y',
    'arizona-car-shipping.html': '-H-RXMm1Vs4',
    'arkansas-car-shipping.html': 'Az38Fy4jcoE',
    'california-car-shipping.html': 'PTyxFrwYcmM',
    'colorado-car-shipping.html': 'ImPKLAkrDhc',
    'connecticut-car-shipping.html': 'ITWWyro0xDo',
    'delaware-car-shipping.html': 'xsxTZ-i9Ny8',
    'florida-car-shipping.html': 'MSyrBrChIlY',
    'georgia-car-shipping.html': 'FwTOw8cAtPg',
    'hawaii-car-shipping.html': 'vVkeIst33_o',
    'idaho-car-shipping.html': 'JuJiy1hlnnY',
    'illinois-car-shipping.html': 'fNfCjzJzSHA',
    'indiana-car-shipping.html': 'CKJvvfX2rbg',
    'iowa-car-shipping.html': 'jW-fx4BvdqA',
    'kansas-car-shipping.html': 'xYZ_Nyjb-64',
    'kentucky-car-shipping.html': 'xcPNRtFTC3E',
    'louisiana-car-shipping.html': 'g3HZha3RfhQ',
    'maine-car-shipping.html': '29CqR-y1Wh8',
    'maryland-car-shipping.html': '6xGjqJD65Ww',
    'massachusetts-car-shipping.html': 'FcSHuO7mPJg',
    'michigan-car-shipping.html': 'WLoJj7H7t-8',
    'minnesota-car-shipping.html': 'QfuIyi0TYKk',
    'mississippi-car-shipping.html': 'GBTTod7mF7E',
    'missouri-car-shipping.html': 'fTB9X8-oBcQ',
    'montana-car-shipping.html': '7bAxEOoJFlM',
    'nebraska-car-shipping.html': 'pLEzva-DbME',
    'nevada-car-shipping.html': 'D6e13_64bHk',
    'new-hampshire-car-shipping.html': 'y0sNzuQWlUs',
    'new-jersey-car-shipping.html': 'C1WrUw53kW0',
    'new-mexico-car-shipping.html': 'exVm25rXDVw',
    'new-york-car-shipping.html': 'zr-BcvJf2s0',
    'north-carolina-car-shipping.html': 'wMBxAoKrt0U',
    'north-dakota-car-shipping.html': 't3HvoVzQCPU',
    'ohio-car-shipping.html': '0dLEfNZRu5w',
    'oklahoma-car-shipping.html': 'ywwMXY1LLeo',
    'oregon-car-shipping.html': 'BFcotPPePJU',
    'pennsylvania-car-shipping.html': 'f7XSezPtrTc',
    'rhode-island-car-shipping.html': 'cTrV-3hkKDs',
    'south-carolina-car-shipping.html': 'UK-Dp2v3uZc',
    'south-dakota-car-shipping.html': 'jm1cQ5Ba4To',
    'tennessee-car-shipping.html': 'IgYHz6gAk2s',
    'texas-car-shipping.html': 'Jb0n2WcLzGY',
    'utah-car-shipping.html': '7sTPLQNxVOY',
    'vermont-car-shipping.html': 'HyNwVB130Ww',
    'virginia-car-shipping.html': '2eq-5PJg-qw',
    'washington-car-shipping.html': 'WHiPPQCrl18',
    'washington-dc-car-shipping.html': 'FHX3qYrLB84',
    'west-virginia-car-shipping.html': 'AGB8u8DNn1g',
    'wisconsin-car-shipping.html': '1HeavLAhxYs',
    'wyoming-car-shipping.html': 'WdPfpBcSYss',
};

function fetchUrl(urlStr) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(urlStr);
        const options = {
            hostname: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        };
        const req = https.get(options, (res) => {
            // Follow redirects
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return fetchUrl(res.headers.location).then(resolve).catch(reject);
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        });
        req.on('error', reject);
        req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')); });
    });
}

async function resolvePhotoId(shortId) {
    try {
        const url = `https://unsplash.com/photos/${shortId}`;
        const html = await fetchUrl(url);
        // Extract the CDN URL from og:image or the first images.unsplash.com reference
        const ogMatch = html.match(/og:image["\s]+content="([^"]+)"/);
        if (ogMatch) {
            const cdnUrl = ogMatch[1];
            const photoMatch = cdnUrl.match(/photo-[a-f0-9]+-[a-f0-9]+/);
            if (photoMatch) return photoMatch[0];
        }
        // Fallback: find any images.unsplash.com URL
        const imgMatch = html.match(/images\.unsplash\.com\/(photo-[a-f0-9]+-[a-f0-9]+)/);
        if (imgMatch) return imgMatch[1];
        return null;
    } catch (e) {
        console.log(`  ERROR fetching ${shortId}: ${e.message}`);
        return null;
    }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
    const resolved = {};
    const entries = Object.entries(stateImages);
    let success = 0, failed = 0;

    for (let i = 0; i < entries.length; i++) {
        const [filename, shortId] = entries[i];
        process.stdout.write(`[${i+1}/${entries.length}] Resolving ${shortId}... `);
        const cdnId = await resolvePhotoId(shortId);
        if (cdnId) {
            resolved[filename] = cdnId;
            console.log(`OK -> ${cdnId}`);
            success++;
        } else {
            console.log(`FAILED`);
            failed++;
        }
        // Rate limiting: wait 500ms between requests
        if (i < entries.length - 1) await sleep(500);
    }

    console.log(`\nResolved ${success}/${entries.length} images (${failed} failed)`);

    // Save the resolved mapping
    fs.writeFileSync('resolved-images.json', JSON.stringify(resolved, null, 2));
    console.log('Saved resolved mapping to resolved-images.json');

    // Now update all HTML files
    let updated = 0;
    for (const [filename, cdnId] of Object.entries(resolved)) {
        const filePath = path.join(routesDir, filename);
        if (!fs.existsSync(filePath)) continue;

        let content = fs.readFileSync(filePath, 'utf8');
        const newUrl = `https://images.unsplash.com/${cdnId}?auto=format&fit=crop&w=1200&q=60`;

        // Replace the broken image URL
        const imgRegex = /<img\s+src="https:\/\/images\.unsplash\.com\/photo-[^\"]+\"/;
        const match = content.match(imgRegex);
        if (!match) {
            console.log(`  NO MATCH in ${filename}`);
            continue;
        }

        const newSrc = `<img src="${newUrl}"`;
        content = content.replace(imgRegex, newSrc);
        fs.writeFileSync(filePath, content, 'utf8');
        updated++;
    }

    console.log(`Updated ${updated} HTML files`);
}

main().catch(console.error);
