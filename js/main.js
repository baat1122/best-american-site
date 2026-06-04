// js/main.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Reveal Animation
    const reveals = document.querySelectorAll('.reveal');

    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load

    // 2. FAQ Accordion Logic
    const faqBtns = document.querySelectorAll('.faq-btn');
    faqBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('.faq-icon');
            
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                content.style.opacity = 0;
                content.style.paddingTop = "0";
                content.style.paddingBottom = "0";
                icon.textContent = '+';
                icon.classList.remove('text-[#1E90FF]');
                icon.classList.add('text-[#00FFFF]');
            } else {
                content.style.maxHeight = content.scrollHeight + 40 + "px"; // padding offset
                content.style.opacity = 1;
                content.style.paddingTop = "1rem";
                content.style.paddingBottom = "1rem";
                icon.textContent = '−';
                icon.classList.remove('text-[#00FFFF]');
                icon.classList.add('text-[#1E90FF]');
            }
        });
    });

    // 3. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if(mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // 4. Parallax effect for Hero background
    const heroBg = document.querySelector('.hero-parallax');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            let scrollPosition = window.pageYOffset;
            heroBg.style.transform = 'translateY(' + scrollPosition * 0.4 + 'px)';
        });
    }

    // 5. Animated Dispatch Network Canvas
    initDispatchNetwork();
});

function initDispatchNetwork() {
    const canvas = document.getElementById('dispatchNetwork');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Handle high-DPI displays for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    window.addEventListener('resize', () => {
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        cacheMapGeometry(); // Re-cache on resize
    });

    // Map Projection Math Engine
    const minLon = -125;
    const maxLon = -66;
    const minLat = 24;
    const maxLat = 50;

    function project(lon, lat) {
        const padding = 100; // Increased padding for 3D spin room
        const availableWidth = width - (padding * 2);
        const availableHeight = height - (padding * 2);
        
        const x = padding + ((lon - minLon) / (maxLon - minLon)) * availableWidth;
        const y = padding + (availableHeight - (((lat - minLat) / (maxLat - minLat)) * availableHeight));
        return { x, y };
    }

    // Fetch GeoJSON Map Data
    let usMapData = null;
    let cachedFlatPolygons = []; // Array of Arrays of flat coordinates

    function cacheMapGeometry() {
        if (!usMapData) return;
        cachedFlatPolygons = [];
        
        usMapData.features.forEach(feature => {
            if (feature.properties.name === "Alaska" || feature.properties.name === "Hawaii" || feature.properties.name === "Puerto Rico") return;
            
            if (feature.geometry.type === 'Polygon') {
                const flatCoords = feature.geometry.coordinates[0].map(coord => project(coord[0], coord[1]));
                cachedFlatPolygons.push(flatCoords);
            } else if (feature.geometry.type === 'MultiPolygon') {
                feature.geometry.coordinates.forEach(polygon => {
                    const flatCoords = polygon[0].map(coord => project(coord[0], coord[1]));
                    cachedFlatPolygons.push(flatCoords);
                });
            }
        });
    }

    fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json')
        .then(response => response.json())
        .then(data => {
            usMapData = data;
            cacheMapGeometry();
        })
        .catch(err => console.error("Could not load map data", err));

    // US Logistics Hubs (Real-world Longitude and Latitude)
    const hubs = [
        { name: 'Seattle', lon: -122.33, lat: 47.60, pulse: 0 },
        { name: 'San Francisco', lon: -122.41, lat: 37.77, pulse: 0 },
        { name: 'Los Angeles', lon: -118.24, lat: 34.05, pulse: 0 },
        { name: 'Denver', lon: -104.99, lat: 39.73, pulse: 0 },
        { name: 'Dallas', lon: -96.79, lat: 32.77, pulse: 0 },
        { name: 'Chicago', lon: -87.62, lat: 41.87, pulse: 0 },
        { name: 'New York', lon: -74.00, lat: 40.71, pulse: 0 },
        { name: 'Atlanta', lon: -84.38, lat: 33.74, pulse: 0 },
        { name: 'Miami', lon: -80.19, lat: 25.76, pulse: 0 }
    ];

    // Connect the hubs (Major Interstate Routes)
    const routes = [
        [0, 3], // Seattle -> Denver
        [1, 3], // SF -> Denver
        [2, 4], // LA -> Dallas
        [2, 3], // LA -> Denver
        [3, 5], // Denver -> Chicago
        [3, 4], // Denver -> Dallas
        [4, 7], // Dallas -> Atlanta
        [5, 6], // Chicago -> NY
        [5, 7], // Chicago -> Atlanta
        [7, 6], // Atlanta -> NY
        [7, 8], // Atlanta -> Miami
        [4, 5], // Dallas -> Chicago
        [0, 1], // Seattle -> SF
        [1, 2]  // SF -> LA
    ];

    // Transports traveling the routes
    const transports = [];
    const numTransports = window.innerWidth > 768 ? 20 : 10;
    
    for (let i = 0; i < numTransports; i++) {
        transports.push({
            routeIndex: Math.floor(Math.random() * routes.length),
            progress: Math.random(),
            speed: 0.002 + Math.random() * 0.003
        });
    }
    
    // Smooth fluid interaction variables
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    window.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
        targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });



    // --- NEW: True 3D Projection Engine ---
    function project3D(x, y, altitude = 0) {
        // Shift to center for rotation
        let cx = x - (width / 2);
        let cy = y - (height / 2);

        // Apply mouse-based 3D rotation (Pan & Tilt)
        const tiltX = 1.0 + (currentMouseY * 0.2); // Base tilt ~57 deg, affected by mouse
        const panZ = currentMouseX * 0.3; // Rotate map side-to-side based on mouse X
        
        // Rotate around Z axis (Pan)
        const cosZ = Math.cos(panZ);
        const sinZ = Math.sin(panZ);
        let rx = cx * cosZ - cy * sinZ;
        let ry = cx * sinZ + cy * cosZ;

        // Rotate around X axis (Tilt) and apply Altitude (negative Y in 2D space)
        const cosX = Math.cos(tiltX);
        const sinX = Math.sin(tiltX);
        
        const yRot = ry * cosX - altitude * sinX;
        const zRot = -ry * sinX - altitude * cosX; // Negative because Y goes down in Canvas

        // Perspective Division
        const depth = zRot + 700; // Camera Distance
        // Prevent rendering behind camera
        if (depth <= 0) return { x: 0, y: 0, scale: 0 }; 

        const scale = 800 / depth; // Focal Length / Depth

        return {
            x: (rx * scale) + (width / 2),
            y: (yRot * scale) + (height / 2) + 20, // Centered with minor offset for visual balance
            scale: scale
        };
    }

    function renderMap() {
        if (cachedFlatPolygons.length === 0) return;
        ctx.strokeStyle = 'rgba(99, 91, 255, 0.1)'; // Ultra faint futuristic grid
        
        cachedFlatPolygons.forEach(polygon => {
            drawPolygon3DFromFlat(polygon);
        });
    }

    function drawPolygon3DFromFlat(flatCoords) {
        ctx.beginPath();
        let started = false;
        flatCoords.forEach(flat => {
            const p3d = project3D(flat.x, flat.y, 0); // Map is at 0 altitude
            
            if (p3d.scale > 0) { // Only draw if in front of camera
                // Adjust line width based on depth (things closer are thicker)
                ctx.lineWidth = 1.0 * p3d.scale; 
                
                if (!started) {
                    ctx.moveTo(p3d.x, p3d.y);
                    started = true;
                } else {
                    ctx.lineTo(p3d.x, p3d.y);
                }
            }
        });
        ctx.stroke();
    }

    function render() {
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, width, height);
        
        // Ultra-smooth interpolation for fluid mouse movement
        currentMouseX += (targetMouseX - currentMouseX) * 0.05;
        currentMouseY += (targetMouseY - currentMouseY) * 0.05;

        // Draw the GeoJSON US Map in 3D
        renderMap();

        ctx.globalCompositeOperation = 'screen';

        // Draw 3D Highway Routes (Elevated Arcs)
        routes.forEach(route => {
            const h1 = hubs[route[0]];
            const h2 = hubs[route[1]];
            
            const flat1 = project(h1.lon, h1.lat);
            const flat2 = project(h2.lon, h2.lat);
            
            const dist = Math.sqrt(Math.pow(flat2.x - flat1.x, 2) + Math.pow(flat2.y - flat1.y, 2));
            const arcHeight = dist * 0.4; // Taller arcs for longer distances

            ctx.beginPath();
            let started = false;
            
            // Draw path by sampling 20 segments
            for (let t = 0; t <= 1.0; t += 0.05) {
                const flatX = flat1.x + (flat2.x - flat1.x) * t;
                const flatY = flat1.y + (flat2.y - flat1.y) * t;
                
                // Parabolic altitude arc
                const altitude = Math.sin(t * Math.PI) * arcHeight;
                
                const p3d = project3D(flatX, flatY, altitude);
                if (p3d.scale > 0) {
                    if (!started) {
                        ctx.moveTo(p3d.x, p3d.y);
                        started = true;
                    } else {
                        ctx.lineTo(p3d.x, p3d.y);
                    }
                }
            }
            
            ctx.strokeStyle = 'rgba(99, 91, 255, 0.2)'; 
            ctx.lineWidth = 1.5;
            ctx.stroke();
        });

        // Draw 3D Hubs and Vertical Pillars
        hubs.forEach(hub => {
            const flat = project(hub.lon, hub.lat);
            const base3d = project3D(flat.x, flat.y, 0); // Ground zero
            const top3d = project3D(flat.x, flat.y, 40); // Pillar top altitude
            
            if (base3d.scale > 0) {
                // 1. Draw Holographic Anchor Pillar
                ctx.beginPath();
                ctx.moveTo(base3d.x, base3d.y);
                ctx.lineTo(top3d.x, top3d.y);
                const grad = ctx.createLinearGradient(base3d.x, base3d.y, top3d.x, top3d.y);
                grad.addColorStop(0, 'rgba(0, 212, 255, 0.0)');
                grad.addColorStop(1, 'rgba(0, 212, 255, 0.4)'); // Neon cyan top
                ctx.strokeStyle = grad;
                ctx.lineWidth = 2 * base3d.scale;
                ctx.stroke();

                // 2. Draw Elevated Node Cap
                ctx.beginPath();
                ctx.arc(top3d.x, top3d.y, 3 * top3d.scale, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(99, 91, 255, 0.9)';
                
                // Hub Pulse Animation at the Cap
                if (hub.pulse > 0) {
                    ctx.shadowBlur = 20 * top3d.scale * hub.pulse;
                    ctx.shadowColor = '#00d4ff';
                    hub.pulse -= 0.05; 
                } else {
                    ctx.shadowBlur = 5 * top3d.scale;
                    ctx.shadowColor = 'rgba(99, 91, 255, 0.5)';
                }
                
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        });

        // Draw Transports (Trucks moving along 3D elevated routes)
        transports.forEach(t => {
            const h1 = hubs[routes[t.routeIndex][0]];
            const h2 = hubs[routes[t.routeIndex][1]];
            
            const flat1 = project(h1.lon, h1.lat);
            const flat2 = project(h2.lon, h2.lat);
            
            const dist = Math.sqrt(Math.pow(flat2.x - flat1.x, 2) + Math.pow(flat2.y - flat1.y, 2));
            const arcHeight = dist * 0.4;
            
            const prog = t.progress;
            const flatX = flat1.x + (flat2.x - flat1.x) * prog;
            const flatY = flat1.y + (flat2.y - flat1.y) * prog;
            
            const altitude = Math.sin(prog * Math.PI) * arcHeight;
            const pos3d = project3D(flatX, flatY, altitude);

            if (pos3d.scale > 0) {
                // Draw glowing transport pulse in 3D space
                ctx.beginPath();
                ctx.arc(pos3d.x, pos3d.y, 2.5 * pos3d.scale, 0, Math.PI * 2);
                ctx.fillStyle = '#00d4ff'; 
                ctx.shadowBlur = 12 * pos3d.scale;
                ctx.shadowColor = '#00d4ff';
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            t.progress += t.speed;
            
            if (t.progress >= 1) {
                h2.pulse = 1; 
                t.progress = 0;
                t.routeIndex = Math.floor(Math.random() * routes.length);
                t.speed = 0.002 + Math.random() * 0.003;
            }
        });

        if (isVisible) {
            requestAnimationFrame(render);
        }
    }

    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
            if (isVisible) {
                canvas.style.opacity = '1';
                render();
            } else {
                canvas.style.opacity = '0';
            }
        });
    }, { threshold: 0.1 });
    observer.observe(canvas);
}
