const fs = require('fs');
const path = require('path');

const siteDir = __dirname;

function convertDirectory(dirName, excludeFiles = []) {
    const dirPath = path.join(siteDir, dirName);
    if (!fs.existsSync(dirPath)) {
        console.log(`Directory ${dirName} does not exist.`);
        return;
    }

    const files = fs.readdirSync(dirPath);
    let count = 0;

    for (const file of files) {
        const filePath = path.join(dirPath, file);
        if (fs.statSync(filePath).isFile() && file.endsWith('.html') && !excludeFiles.includes(file)) {
            const slug = file.replace('.html', '');
            const folderPath = path.join(dirPath, slug);
            
            // Create folder
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }

            const newFilePath = path.join(folderPath, 'index.html');
            
            // Copy file to index.html in the new folder
            fs.copyFileSync(filePath, newFilePath);
            
            // Remove the old flat file
            fs.unlinkSync(filePath);
            
            console.log(`Moved ${dirName}/${file} -> ${dirName}/${slug}/index.html`);
            count++;
        }
    }
    console.log(`Successfully converted ${count} pages in /${dirName}/ to folder structure.`);
}

// Convert routes folder (exclude route-template.html and index.html if exists)
convertDirectory('routes', ['route-template.html', 'index.html']);

// Convert services folder (exclude index.html)
convertDirectory('services', ['index.html']);

console.log('Conversion completed.');
