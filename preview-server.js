const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DIR = __dirname;

// Load environment variables from .env file if it exists
try {
    const envPath = path.join(DIR, '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        envContent.split(/\r?\n/).forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine && !trimmedLine.startsWith('#')) {
                const eqIdx = trimmedLine.indexOf('=');
                if (eqIdx > 0) {
                    const key = trimmedLine.substring(0, eqIdx).trim();
                    const val = trimmedLine.substring(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
                    if (key && val) {
                        process.env[key] = val;
                    }
                }
            }
        });
        console.log('Loaded environment variables from .env');
    }
} catch (e) {
    console.error('Failed to load .env file:', e);
}

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

    // Handle api/chat endpoint
    if (urlPath === '/api/chat') {
        if (req.method === 'OPTIONS') {
            res.writeHead(200, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            });
            res.end();
            return;
        }

        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                try {
                    req.body = JSON.parse(body);
                } catch (e) {
                    req.body = {};
                }

                // Mock Vercel response helper methods
                res.status = (code) => {
                    res.statusCode = code;
                    return res;
                };
                res.json = (data) => {
                    res.writeHead(res.statusCode || 200, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify(data));
                };

                try {
                    const handler = require('./api/chat.js');
                    await handler(req, res);
                } catch (err) {
                    console.error('Error running API handler:', err);
                    res.status(500).json({ error: 'Failed to execute local API handler. Make sure you set OPENAI_API_KEY environment variable.' });
                }
            });
            return;
        }
    }

    if (urlPath === '/api/leads') {
        if (req.method === 'OPTIONS') {
            res.writeHead(200, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            });
            res.end();
            return;
        }
        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', async () => {
                try { req.body = JSON.parse(body); } catch (e) { req.body = {}; }
                res.status = (code) => { res.statusCode = code; return res; };
                res.json = (data) => {
                    res.writeHead(res.statusCode || 200, {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify(data));
                };
                try {
                    delete require.cache[require.resolve('./api/leads.js')];
                    const handler = require('./api/leads.js');
                    await handler(req, res);
                } catch (err) {
                    console.error('Error running leads API handler:', err);
                    res.status(500).json({ error: 'Failed to execute local leads API handler.' });
                }
            });
            return;
        }
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
        // 2. Check root (e.g., /why-best-american)
        else if (fs.existsSync(filePath + '.html')) {
            filePath += '.html';
        }
        // 3. Check /routes/ (e.g., /california-car-shipping)
        else if (fs.existsSync(path.join(DIR, 'routes', urlPath, 'index.html'))) {
            filePath = path.join(DIR, 'routes', urlPath, 'index.html');
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
