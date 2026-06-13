(function(){
function initUsMap() {
    const container = document.getElementById("us-map-container");
    const tooltip = document.getElementById("map-tooltip");
    
    if (!container || !tooltip) return;

    const isMobile = window.innerWidth < 768;

    const stateNames = {
        "al": "Alabama", "ak": "Alaska", "az": "Arizona", "ar": "Arkansas", "ca": "California",
        "co": "Colorado", "ct": "Connecticut", "de": "Delaware", "fl": "Florida", "ga": "Georgia",
        "hi": "Hawaii", "id": "Idaho", "il": "Illinois", "in": "Indiana", "ia": "Iowa",
        "ks": "Kansas", "ky": "Kentucky", "la": "Louisiana", "me": "Maine", "md": "Maryland",
        "ma": "Massachusetts", "mi": "Michigan", "mn": "Minnesota", "ms": "Mississippi", "mo": "Missouri",
        "mt": "Montana", "ne": "Nebraska", "nv": "Nevada", "nh": "New Hampshire", "nj": "New Jersey",
        "nm": "New Mexico", "ny": "New York", "nc": "North Carolina", "nd": "North Dakota", "oh": "Ohio",
        "ok": "Oklahoma", "or": "Oregon", "pa": "Pennsylvania", "ri": "Rhode Island", "sc": "South Carolina",
        "sd": "South Dakota", "tn": "Tennessee", "tx": "Texas", "ut": "Utah", "vt": "Vermont",
        "va": "Virginia", "wa": "Washington", "wv": "West Virginia", "wi": "Wisconsin", "wy": "Wyoming",
        "dc": "Washington D.C."
    };

    // SVG is now embedded directly in the HTML
    setupMapInteractions();

    function setupMapInteractions() {
        const svg = container.querySelector("svg");
        if (!svg) return;
        
        // Add styles dynamically for hover effects and labels
        const style = document.createElement("style");
        style.innerHTML = `
            #us-map-container svg { width: 100%; height: auto; max-height: 500px; overflow: visible; font-family: 'Inter', sans-serif; }
            #us-map-container path, #us-map-container circle { 
                fill: #0284c7;
                stroke: #ffffff; 
                stroke-width: 1.5; 
                cursor: pointer;
            }
            #us-map-container path:hover, #us-map-container circle:hover { 
                fill: #00d4ff; 
                stroke-width: 2.5; 
            }
            #us-map-container .separator1 { fill: none !important; stroke: #e6e6e6 !important; stroke-width: 2 !important; cursor: default; pointer-events: none; }
            #us-map-container .borders, #us-map-container .borders path { fill: none !important; pointer-events: none !important; cursor: default !important; }
            .state-label {
                fill: #ffffff;
                font-size: 13px;
                font-weight: 600;
                pointer-events: none;
                text-anchor: middle;
                dominant-baseline: central;
            }
        `;
        document.head.appendChild(style);

        const paths = svg.querySelectorAll("path, circle");
        
        // State abbreviations
        const stateAbbreviations = {
            "al": "AL", "ak": "AK", "az": "AZ", "ar": "AR", "ca": "CA",
            "co": "CO", "ct": "CT", "de": "DE", "fl": "FL", "ga": "GA",
            "hi": "HI", "id": "ID", "il": "IL", "in": "IN", "ia": "IA",
            "ks": "KS", "ky": "KY", "la": "LA", "me": "ME", "md": "MD",
            "ma": "MA", "mi": "MI", "mn": "MN", "ms": "MS", "mo": "MO",
            "mt": "MT", "ne": "NE", "nv": "NV", "nh": "NH", "nj": "NJ",
            "nm": "NM", "ny": "NY", "nc": "NC", "nd": "ND", "oh": "OH",
            "ok": "OK", "or": "OR", "pa": "PA", "ri": "RI", "sc": "SC",
            "sd": "SD", "tn": "TN", "tx": "TX", "ut": "UT", "vt": "VT",
            "va": "VA", "wa": "WA", "wv": "WV", "wi": "WI", "wy": "WY"
        };
        
        // Manual adjustments for tricky states
        const labelOffsets = {
            "fl": { x: 15, y: 0 },
            "mi": { x: 15, y: 25 },
            "id": { x: -5, y: 15 },
            "ca": { x: -10, y: 0 },
            "la": { x: -12, y: 0 },
            "vt": { x: 0, y: 0 },
            "nh": { x: 0, y: 0 },
            "ma": { x: 0, y: 0 },
            "ri": { hide: true }, // too small
            "ct": { hide: true }, // too small
            "nj": { hide: true }, // too small
            "de": { hide: true }, // too small
            "md": { hide: true }, // too small
            "dc": { hide: true }
        };

        // Skip label generation on mobile — too small to read, expensive getBBox calls
        if (!isMobile) {
            const mapWrapper = document.getElementById("nationwide-coverage");
            
            // Batch reads: collect all bbox data first to avoid forced reflows
            const stateData = [];
            paths.forEach(path => {
                if (path.classList.contains("separator1")) return;
                
                const classList = Array.from(path.classList);
                const stateCode = classList.find(c => stateNames[c]);
                
                if (stateCode && stateAbbreviations[stateCode]) {
                    const offset = labelOffsets[stateCode] || { x: 0, y: 0 };
                    if (!offset.hide) {
                        try {
                            const bbox = path.getBBox();
                            stateData.push({
                                path,
                                stateCode,
                                stateName: stateNames[stateCode],
                                centerX: bbox.x + bbox.width / 2 + offset.x,
                                centerY: bbox.y + bbox.height / 2 + offset.y
                            });
                        } catch (e) {}
                    }
                }
            });

            // Batch writes: create and append all text labels after all reads
            stateData.forEach(({ path, stateCode, stateName, centerX, centerY }) => {
                const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                text.setAttribute("x", centerX);
                text.setAttribute("y", centerY);
                text.setAttribute("class", "state-label");
                text.textContent = stateAbbreviations[stateCode];
                svg.appendChild(text);
            });
        }

        // Use offsetX/offsetY instead of getBoundingClientRect to avoid forced reflow
        paths.forEach(path => {
            if (path.classList.contains("separator1")) return;
            
            const classList = Array.from(path.classList);
            const stateCode = classList.find(c => stateNames[c]);
            
            if (stateCode) {
                const stateName = stateNames[stateCode];

                path.addEventListener("mouseenter", (e) => {
                    tooltip.textContent = stateName;
                    tooltip.classList.remove("hidden");
                });

                path.addEventListener("mousemove", (e) => {
                    tooltip.style.left = `${e.offsetX}px`;
                    tooltip.style.top = `${e.offsetY - 15}px`;
                });

                path.addEventListener("mouseleave", () => {
                    tooltip.classList.add("hidden");
                });

                path.addEventListener("click", () => {
                    const slug = stateName.toLowerCase().replace(/\s+/g, '-');
                    window.location.href = `/${slug}-car-shipping/`;
                });
            }
        });
    }
}
// Defer map initialization until user scrolls near it
if(document.readyState !== 'loading') {
    const mapEl = document.getElementById("us-map-container");
    if (mapEl) {
        const mapObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                mapObserver.disconnect();
                initUsMap();
            }
        }, { rootMargin: '200px' });
        mapObserver.observe(mapEl);
    }
} else {
    document.addEventListener("DOMContentLoaded", function(){
        const mapEl = document.getElementById("us-map-container");
        if (mapEl) {
            const mapObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    mapObserver.disconnect();
                    initUsMap();
                }
            }, { rootMargin: '200px' });
            mapObserver.observe(mapEl);
        }
    });
}
})();
