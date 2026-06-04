const fs = require('fs');
const path = require('path');

const siteDir = __dirname;

// 1. Rename files for better SEO slugs
const renameMap = {
    'services/open-transport.html': 'services/open-auto-transport.html',
    'services/enclosed-transport.html': 'services/enclosed-auto-transport.html',
    'services/luxury-exotic-car-shipping-services.html': 'services/luxury-car-shipping.html',
    'services/door-to-door-car-transport.html': 'services/door-to-door-car-shipping.html'
};

for (const [oldPath, newPath] of Object.entries(renameMap)) {
    const fullOld = path.join(siteDir, oldPath);
    const fullNew = path.join(siteDir, newPath);
    if (fs.existsSync(fullOld)) {
        fs.renameSync(fullOld, fullNew);
        console.log(`Renamed ${oldPath} to ${newPath}`);
    }
}

// 2. Build map of all HTML files for link replacement
const htmlFiles = [];
function walkHTML(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') walkHTML(fullPath);
        } else if (fullPath.endsWith('.html') || fullPath.endsWith('.js')) {
            htmlFiles.push(fullPath);
        }
    }
}
walkHTML(siteDir);

// 3. Process each file
for (const file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf-8');
    let originalContent = content;

    // A. Fix asset paths to absolute
    content = content.replace(/(href|src)="(?:\.\.\/)*css\//g, '$1="/css/');
    content = content.replace(/(href|src)="(?:\.\.\/)*js\//g, '$1="/js/');
    content = content.replace(/(href|src)="(?:\.\.\/)*images\//g, '$1="/images/');

    // B. Fix HTML internal links
    // Root pages
    content = content.replace(/href="(?:\.\.\/)*index\.html(#.*?)?"/g, 'href="/$1"');
    content = content.replace(/href="(?:\.\.\/)*why-neon\.html(#.*?)?"/g, 'href="/why-neon/$1"');
    content = content.replace(/href="(?:\.\.\/)*contact\.html(#.*?)?"/g, 'href="/contact/$1"');
    content = content.replace(/href="(?:\.\.\/)*privacy\.html(#.*?)?"/g, 'href="/privacy/$1"');
    content = content.replace(/href="(?:\.\.\/)*quote\/index\.html(#.*?)?"/g, 'href="/quote/$1"');

    // Mapped renamed services
    content = content.replace(/href="(?:\.\.\/)*services\/open-transport\.html(#.*?)?"/g, 'href="/open-auto-transport/$1"');
    content = content.replace(/href="(?:\.\.\/)*services\/enclosed-transport\.html(#.*?)?"/g, 'href="/enclosed-auto-transport/$1"');
    content = content.replace(/href="(?:\.\.\/)*services\/luxury-exotic-car-shipping-services\.html(#.*?)?"/g, 'href="/luxury-car-shipping/$1"');
    content = content.replace(/href="(?:\.\.\/)*services\/door-to-door-car-transport\.html(#.*?)?"/g, 'href="/door-to-door-car-shipping/$1"');

    // Dynamic Routes (All other services)
    content = content.replace(/href="(?:\.\.\/)*services\/([a-z0-9-]+)\.html(#.*?)?"/g, 'href="/$1/$2"');

    // Dynamic Routes (All state routes)
    content = content.replace(/href="(?:\.\.\/)*routes\/([a-z0-9-]+)\.html(#.*?)?"/g, 'href="/$1/$2"');

    // Fix empty hrefs from the regex matches ending with '#'
    content = content.replace(/href="\/#"/g, 'href="/"');
    
    // Some hrefs ended up as `href="/why-neon/"` if no hash
    content = content.replace(/\/"/g, '/"');

    // Special fix: index.html linking to itself as '' or 'index.html'
    content = content.replace(/href="/"/g, 'href="/"');

    // us-map.js explicit dynamic link replacement
    if (file.endsWith('us-map.js')) {
        content = content.replace(/window\.location\.href\s*=\s*`routes\/\$\{slug\}-car-shipping\.html`;/, 'window.location.href = `/${slug}-car-shipping/`;');
    }

    if (content !== originalContent) {
        fs.writeFileSync(file, content);
        console.log(`Updated links in: ${file}`);
    }
}

// 4. Scaffold /blog/ directory
const blogDir = path.join(siteDir, 'blog');
if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir);
    
    // Create an index.html for blog
    const blogIndex = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Auto Transport Blog | Neon Auto Transport</title>
    <meta name="description" content="Read the latest news, tips, and guides on car shipping and auto transport.">
    <link rel="stylesheet" href="/css/tailwind.css">
    <link rel="stylesheet" href="/css/styles.css">
</head>
<body class="bg-[#f6f9fc]">
    <header class="bg-[#0a2540] py-6 text-center text-white">
        <h1 class="text-3xl font-black">Neon Auto Transport Blog</h1>
        <a href="/" class="text-[#00d4ff] mt-2 inline-block">&larr; Back to Home</a>
    </header>
    <main class="container mx-auto p-8 max-w-4xl text-center mt-12">
        <h2 class="text-2xl font-bold mb-4">Coming Soon</h2>
        <p class="text-[#425466]">Our car shipping experts are writing comprehensive guides. Check back later!</p>
    </main>
</body>
</html>`;

    fs.writeFileSync(path.join(blogDir, 'index.html'), blogIndex);
    console.log('Created /blog/ structure.');
}

console.log('URL Refactoring Complete.');
