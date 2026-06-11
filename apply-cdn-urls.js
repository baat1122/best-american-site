const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'routes');

// Complete mapping: filename -> CDN photo ID
const cdnMap = {
    'alabama-car-shipping.html': 'photo-1753098919905-a23329c1f9cc',
    'alaska-car-shipping.html': 'photo-1777768785364-fe05d349bd9f',
    'arizona-car-shipping.html': 'photo-1697070714395-3db6afc405e2',
    'arkansas-car-shipping.html': 'photo-1494388851929-82bec479a524',
    'california-car-shipping.html': 'photo-1436459826008-8fd497f03742',
    'colorado-car-shipping.html': 'photo-1571756112102-254f61415c37',
    'connecticut-car-shipping.html': 'photo-1755466409601-cd8787f0598e',
    'delaware-car-shipping.html': 'photo-1653264227490-d2f3a11f9737',
    'florida-car-shipping.html': 'photo-1745261394475-1ec45d960f7b',
    'georgia-car-shipping.html': 'photo-1663601460253-aba72eea6edf',
    'hawaii-car-shipping.html': 'photo-1672185401457-2aab1fad7af1',
    'idaho-car-shipping.html': 'photo-1754875641466-4fe112925792',
    'illinois-car-shipping.html': 'photo-1776715139499-136701c5c351',
    'indiana-car-shipping.html': 'photo-1647892924715-5fe825567425',
    'iowa-car-shipping.html': 'photo-1594251526423-09ebda3747a8',
    'kansas-car-shipping.html': 'photo-1543777644-a6456fe31d9d',
    'kentucky-car-shipping.html': 'photo-1653189290886-052fb96138a5',
    'louisiana-car-shipping.html': 'photo-1653835654515-e6a14c1beb00',
    'maine-car-shipping.html': 'photo-1757661314592-b02a99450bef',
    'maryland-car-shipping.html': 'photo-1726773966622-3ad60f7f0591',
    'massachusetts-car-shipping.html': 'photo-1757661543986-6f418adc8cb6',
    'michigan-car-shipping.html': 'photo-1502815587936-3e00cde66153',
    'minnesota-car-shipping.html': 'photo-1767974472306-d74241d77538',
    'mississippi-car-shipping.html': 'photo-1625027648377-f7f60ff4e08c',
    'missouri-car-shipping.html': 'photo-1766284808386-f3ec7876bcbd',
    'montana-car-shipping.html': 'photo-1727466770839-1772dcd4a9f0',
    'nebraska-car-shipping.html': 'photo-1594403589024-f6973e942f93',
    'nevada-car-shipping.html': 'photo-1681167780121-a556f39ac58b',
    'new-hampshire-car-shipping.html': 'photo-1757661314220-a7f13b9d7ec1',
    'new-jersey-car-shipping.html': 'photo-1652113953861-fe35276939a0',
    'new-mexico-car-shipping.html': 'photo-1612565389976-3784d1624e24',
    'new-york-car-shipping.html': 'photo-1750073473331-fe4165aa3030',
    'north-carolina-car-shipping.html': 'photo-1651237215945-73fa0e02f356',
    'north-dakota-car-shipping.html': 'photo-1729824703265-5c8a91c52023',
    'ohio-car-shipping.html': 'photo-1760809294105-479fe767a8ae',
    'oklahoma-car-shipping.html': 'photo-1645205410031-b968f7a68d94',
    'oregon-car-shipping.html': 'photo-1679627720732-ccfbd39a8e0e',
    'pennsylvania-car-shipping.html': 'photo-1685732830253-7c9752bd0ab7',
    'rhode-island-car-shipping.html': 'photo-1574286350488-ba888f415592',
    'south-carolina-car-shipping.html': 'photo-1673741915107-74d1dbf5c1b2',
    'south-dakota-car-shipping.html': 'photo-1660575891938-bc40812cf0ae',
    'tennessee-car-shipping.html': 'photo-1701666658058-6c5f60849c90',
    'texas-car-shipping.html': 'photo-1766623376142-ccd9881f76f3',
    'utah-car-shipping.html': 'photo-1758944966983-cd73e07a24f4',
    'vermont-car-shipping.html': 'photo-1649000563345-af9a12dc4211',
    'virginia-car-shipping.html': 'photo-1577943203833-841ae6223c24',
    'washington-car-shipping.html': 'photo-1668045433613-422d5943d14e',
    'washington-dc-car-shipping.html': 'photo-1756076334382-d7e878e9c526',
    'west-virginia-car-shipping.html': 'photo-1588167961380-280dbd18a70e',
    'wisconsin-car-shipping.html': 'photo-1558371274-c34e2d371073',
    'wyoming-car-shipping.html': 'photo-1752780235023-00b6762aa2a6',
};

let updated = 0;
let skipped = 0;

for (const [filename, cdnId] of Object.entries(cdnMap)) {
    const filePath = path.join(routesDir, filename);
    if (!fs.existsSync(filePath)) {
        console.log(`SKIP: ${filename} (not found)`);
        skipped++;
        continue;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const newUrl = `https://images.unsplash.com/${cdnId}?auto=format&fit=crop&w=1200&q=60`;

    // Match any img src with images.unsplash.com (broken or old URLs)
    const imgRegex = /<img\s+src="https:\/\/images\.unsplash\.com\/[^"]+"/;
    const match = content.match(imgRegex);
    if (!match) {
        // Also check for plus.unsplash.com
        const plusRegex = /<img\s+src="https:\/\/plus\.unsplash\.com\/[^"]+"/;
        const plusMatch = content.match(plusRegex);
        if (!plusMatch) {
            console.log(`NO MATCH: ${filename}`);
            skipped++;
            continue;
        }
        content = content.replace(plusRegex, `<img src="${newUrl}"`);
    } else {
        content = content.replace(imgRegex, `<img src="${newUrl}"`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    updated++;
    console.log(`OK: ${filename} -> ${cdnId}`);
}

console.log(`\nDone: ${updated} updated, ${skipped} skipped`);
