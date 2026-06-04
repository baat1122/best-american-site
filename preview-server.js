const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DIR = __dirname;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    let urlPath = req.url.split('?')[0];
    
    // Normalize trailing slash for clean URLs
    if (urlPath !== '/' && urlPath.endsWith('/')) {
        urlPath = urlPath.slice(0, -1);
    }
    
    let filePath = path.join(DIR, urlPath);
    let extname = String(path.extname(filePath)).toLowerCase();

    // Emulate .htaccess routing
    if (extname === '') {
        // It's a clean URL like /california-car-shipping
        
        // 1. Default to root index.html
        if (urlPath === '/' || urlPath === '') {
            filePath = path.join(DIR, 'index.html');
        }
        // 2. Check root (e.g., /why-neon)
        else if (fs.existsSync(filePath + '.html')) {
            filePath += '.html';
        }
        // 3. Check /routes/ (e.g., /california-car-shipping)
        else if (fs.existsSync(path.join(DIR, 'routes', urlPath + '.html'))) {
            filePath = path.join(DIR, 'routes', urlPath + '.html');
        }
        // 4. Check /services/ (e.g., /open-auto-transport)
        else if (fs.existsSync(path.join(DIR, 'services', urlPath + '.html'))) {
            filePath = path.join(DIR, 'services', urlPath + '.html');
        }
        // 5. Check index.html in a subfolder (like /quote or /blog)
        else if (fs.existsSync(path.join(filePath, 'index.html'))) {
            filePath = path.join(filePath, 'index.html');
        }
        
        extname = '.html';
    }

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code == 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Local Preview Server running at http://localhost:${PORT}/`);
});
