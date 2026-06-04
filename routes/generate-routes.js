const fs = require('fs');
const path = require('path');

const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", 
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", 
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", 
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", 
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", 
    "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", 
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming", "Washington D.C."
];

const templatePath = path.join(__dirname, 'route-template.html');
if (!fs.existsSync(templatePath)) {
    console.error("Template file not found at", templatePath);
    process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf-8');

let count = 0;
states.forEach(state => {
    if (state === "Virginia") {
        console.log("Skipping Virginia (custom page).");
        return;
    }
    // Convert to slug, e.g., "New York" -> "new-york", "Washington D.C." -> "washington-d.c." -> "washington-dc"
    let slug = state.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '');
    const content = template.replace(/{{StateName}}/g, state);
    
    const outputPath = path.join(__dirname, `${slug}-car-shipping.html`);
    fs.writeFileSync(outputPath, content);
    console.log(`Generated ${slug}-car-shipping.html`);
    count++;
});

console.log(`\nSuccessfully generated ${count} route pages!`);
