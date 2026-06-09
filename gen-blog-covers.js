const sharp = require('sharp');

async function generateCovers() {
    console.log('Starting cover generation...');
    const path = require('path');
    const dir = __dirname;
    // Cover 1: Checklist - Car preparation
    const checklistSvg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#0a2540"/>
                <stop offset="100%" style="stop-color:#1a3a5c"/>
            </linearGradient>
            <linearGradient id="accent1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#39FF14"/>
                <stop offset="100%" style="stop-color:#00d4ff"/>
            </linearGradient>
        </defs>
        <rect width="1200" height="630" fill="url(#bg1)"/>
        
        <!-- Subtle grid pattern -->
        <g opacity="0.05">
            <line x1="0" y1="105" x2="1200" y2="105" stroke="#fff" stroke-width="1"/>
            <line x1="0" y1="210" x2="1200" y2="210" stroke="#fff" stroke-width="1"/>
            <line x1="0" y1="315" x2="1200" y2="315" stroke="#fff" stroke-width="1"/>
            <line x1="0" y1="420" x2="1200" y2="420" stroke="#fff" stroke-width="1"/>
            <line x1="0" y1="525" x2="1200" y2="525" stroke="#fff" stroke-width="1"/>
            <line x1="200" y1="0" x2="200" y2="630" stroke="#fff" stroke-width="1"/>
            <line x1="400" y1="0" x2="400" y2="630" stroke="#fff" stroke-width="1"/>
            <line x1="600" y1="0" x2="600" y2="630" stroke="#fff" stroke-width="1"/>
            <line x1="800" y1="0" x2="800" y2="630" stroke="#fff" stroke-width="1"/>
            <line x1="1000" y1="0" x2="1000" y2="630" stroke="#fff" stroke-width="1"/>
        </g>
        
        <!-- Car silhouette (right side) -->
        <g transform="translate(680, 200)" opacity="0.12">
            <path d="M0,120 L30,120 L40,80 L80,50 L160,40 L220,40 L280,50 L320,80 L350,80 L380,90 L400,100 L420,120 L420,140 L400,150 L380,150 L370,140 L350,130 L50,130 L30,140 L10,150 L0,150 Z" fill="#fff"/>
            <circle cx="80" cy="145" r="25" fill="#fff"/>
            <circle cx="340" cy="145" r="25" fill="#fff"/>
        </g>
        
        <!-- Checklist icon -->
        <g transform="translate(80, 120)">
            <rect x="0" y="0" width="80" height="100" rx="8" fill="none" stroke="#39FF14" stroke-width="3" opacity="0.8"/>
            <line x1="15" y1="25" x2="65" y2="25" stroke="#fff" stroke-width="2" opacity="0.5"/>
            <line x1="15" y1="45" x2="65" y2="45" stroke="#fff" stroke-width="2" opacity="0.5"/>
            <line x1="15" y1="65" x2="50" y2="65" stroke="#fff" stroke-width="2" opacity="0.5"/>
            <circle cx="75" cy="25" r="8" fill="#39FF14" opacity="0.8"/>
            <path d="M71,25 L74,28 L79,22" fill="none" stroke="#0a2540" stroke-width="2"/>
            <circle cx="75" cy="45" r="8" fill="#39FF14" opacity="0.8"/>
            <path d="M71,45 L74,48 L79,42" fill="none" stroke="#0a2540" stroke-width="2"/>
        </g>
        
        <!-- Badge -->
        <rect x="80" y="260" width="120" height="32" rx="16" fill="rgba(57,255,20,0.15)" stroke="#39FF14" stroke-width="1"/>
        <text x="140" y="281" text-anchor="middle" fill="#39FF14" font-family="Arial, sans-serif" font-size="14" font-weight="bold">CHECKLIST</text>
        
        <!-- Title -->
        <text x="80" y="340" fill="#ffffff" font-family="Arial, sans-serif" font-size="42" font-weight="900">How to Prepare Your</text>
        <text x="80" y="395" fill="#ffffff" font-family="Arial, sans-serif" font-size="42" font-weight="900">Car for Shipping</text>
        
        <!-- Subtitle -->
        <text x="80" y="445" fill="#cdd5df" font-family="Arial, sans-serif" font-size="20">Complete step-by-step preparation guide</text>
        
        <!-- Bottom bar -->
        <rect x="0" y="580" width="1200" height="4" fill="url(#accent1)"/>
        
        <!-- Logo text -->
        <text x="80" y="540" fill="#fff" font-family="Arial, sans-serif" font-size="16" font-weight="800" opacity="0.6">NEON AUTO TRANSPORT</text>
    </svg>`;

    // Cover 2: Cost Guide
    const costSvg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#0a2540"/>
                <stop offset="50%" style="stop-color:#0d2e50"/>
                <stop offset="100%" style="stop-color:#122840"/>
            </linearGradient>
            <linearGradient id="accent2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#00d4ff"/>
                <stop offset="100%" style="stop-color:#635bff"/>
            </linearGradient>
            <linearGradient id="chartGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" style="stop-color:#00d4ff" stop-opacity="0.8"/>
                <stop offset="100%" style="stop-color:#635bff" stop-opacity="0.3"/>
            </linearGradient>
        </defs>
        <rect width="1200" height="630" fill="url(#bg2)"/>
        
        <!-- Chart bars (right side) -->
        <g transform="translate(700, 100)">
            <rect x="0" y="280" width="60" height="180" rx="4" fill="url(#chartGrad)" opacity="0.6"/>
            <rect x="80" y="220" width="60" height="240" rx="4" fill="url(#chartGrad)" opacity="0.7"/>
            <rect x="160" y="160" width="60" height="300" rx="4" fill="url(#chartGrad)" opacity="0.8"/>
            <rect x="240" y="100" width="60" height="360" rx="4" fill="url(#chartGrad)" opacity="0.9"/>
            <rect x="320" y="40" width="60" height="420" rx="4" fill="url(#chartGrad)"/>
            
            <!-- Dollar signs -->
            <text x="30" y="270" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif" font-size="16" font-weight="bold" opacity="0.7">$</text>
            <text x="110" y="210" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif" font-size="16" font-weight="bold" opacity="0.7">$$</text>
            <text x="190" y="150" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif" font-size="16" font-weight="bold" opacity="0.7">$$$</text>
            <text x="270" y="90" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif" font-size="16" font-weight="bold" opacity="0.7">$$$$</text>
        </g>
        
        <!-- Price tag icon -->
        <g transform="translate(80, 120)">
            <path d="M0,40 L40,0 L80,0 L80,40 L40,80 L0,40 Z" fill="none" stroke="#00d4ff" stroke-width="3" opacity="0.8"/>
            <circle cx="60" cy="20" r="8" fill="none" stroke="#00d4ff" stroke-width="2" opacity="0.8"/>
            <text x="30" y="48" text-anchor="middle" fill="#00d4ff" font-family="Arial, sans-serif" font-size="24" font-weight="bold">$</text>
        </g>
        
        <!-- Badge -->
        <rect x="80" y="260" width="140" height="32" rx="16" fill="rgba(0,212,255,0.15)" stroke="#00d4ff" stroke-width="1"/>
        <text x="150" y="281" text-anchor="middle" fill="#00d4ff" font-family="Arial, sans-serif" font-size="14" font-weight="bold">COST GUIDE</text>
        
        <!-- Title -->
        <text x="80" y="340" fill="#ffffff" font-family="Arial, sans-serif" font-size="42" font-weight="900">The True Cost of</text>
        <text x="80" y="395" fill="#ffffff" font-family="Arial, sans-serif" font-size="42" font-weight="900">Car Shipping in 2026</text>
        
        <!-- Subtitle -->
        <text x="80" y="445" fill="#cdd5df" font-family="Arial, sans-serif" font-size="20">Pricing breakdown, hidden fees &amp; broker comparison</text>
        
        <!-- Bottom bar -->
        <rect x="0" y="580" width="1200" height="4" fill="url(#accent2)"/>
        
        <!-- Logo text -->
        <text x="80" y="540" fill="#fff" font-family="Arial, sans-serif" font-size="16" font-weight="800" opacity="0.6">NEON AUTO TRANSPORT</text>
    </svg>`;

    // Generate Checklist cover
    await sharp(Buffer.from(checklistSvg))
        .jpeg({ quality: 90 })
        .toFile(path.join(dir, 'images', 'prepare-car-for-shipping.jpg'));
    console.log('Generated: images/prepare-car-for-shipping.jpg');

    // Generate Cost Guide cover
    await sharp(Buffer.from(costSvg))
        .jpeg({ quality: 90 })
        .toFile(path.join(dir, 'images', 'true-cost-car-shipping-2026.jpg'));
    console.log('Generated: images/true-cost-car-shipping-2026.jpg');
    console.log('All covers generated successfully!');
}

generateCovers().catch(console.error);
