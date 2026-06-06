const fs = require('fs');

const files = ['index.html', 'services/index.html'];

const replacements = {
    '/services/luxury-exotic-car-shipping-services.html': '/services/luxury-car-shipping.html',
    '/services/door-to-door-car-transport.html': '/services/door-to-door-car-shipping.html',
    '/services/enclosed-transport.html': '/services/enclosed-auto-transport.html',
    '/services/open-transport.html': '/services/open-auto-transport.html'
};

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    for (const [oldUrl, newUrl] of Object.entries(replacements)) {
        content = content.replaceAll(oldUrl, newUrl);
    }
    fs.writeFileSync(file, content);
    console.log(`Updated URLs in ${file}`);
});
