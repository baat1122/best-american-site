// js/calculator.js

const coordinates = {
    pickup: null,
    delivery: null
};

document.addEventListener('DOMContentLoaded', () => {
    const calcForm = document.getElementById('advancedCalcForm');
    if (!calcForm) return;

    // Setup ZIP Code Listeners
    setupZipAutocomplete('pickupZip', 'pickupDropdown', 'pickup');
    setupZipAutocomplete('deliveryZip', 'deliveryDropdown', 'delivery');

    const btnNextStep = document.getElementById('btnNextStep');
    const btnBackStep = document.getElementById('btnBackStep');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');

    if (btnNextStep) {
        btnNextStep.addEventListener('click', () => {
            // Validate step 1 fields using HTML5 validation
            const pickup = document.getElementById('pickupZip');
            const delivery = document.getElementById('deliveryZip');
            const year = document.getElementById('vehicleYear');
            const make = document.getElementById('vehicleMake');
            const model = document.getElementById('vehicleModel');
            const distance = document.getElementById('distance');
            const pickupDate = document.getElementById('pickupDate');

            if (!pickup.checkValidity()) { pickup.reportValidity(); return; }
            if (!delivery.checkValidity()) { delivery.reportValidity(); return; }
            if (!distance.value) { alert("Please enter valid Pickup and Delivery ZIP codes to calculate distance."); return; }
            if (!pickupDate.checkValidity()) { pickupDate.reportValidity(); return; }
            if (!year.checkValidity()) { year.reportValidity(); return; }
            if (!make.checkValidity()) { make.reportValidity(); return; }
            if (!model.checkValidity()) { model.reportValidity(); return; }

            // Calculate and show quote
            calculateQuote();

            // Transition to step 2
            step1.classList.add('hidden');
            step2.classList.remove('hidden');
        });
    }

    if (btnBackStep) {
        btnBackStep.addEventListener('click', () => {
            step2.classList.add('hidden');
            step1.classList.remove('hidden');
        });
    }
});

function setupZipAutocomplete(inputId, dropdownId, type) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);

    if (!input || !dropdown) return;

    input.addEventListener('input', async (e) => {
        const zip = e.target.value.trim();
        
        // Reset coordinates if they change input
        coordinates[type] = null;
        document.getElementById('distance').value = '';

        if (zip.length === 5 && !isNaN(zip)) {
            dropdown.innerHTML = '<li class="px-4 py-3 text-sm text-slate-500">Searching...</li>';
            dropdown.classList.remove('hidden');

            try {
                const response = await fetch(`https://api.zippopotam.us/us/${zip}`);
                if (response.ok) {
                    const data = await response.json();
                    const place = data.places[0];
                    const city = place['place name'];
                    const state = place['state abbreviation'];
                    const lat = parseFloat(place['latitude']);
                    const lng = parseFloat(place['longitude']);

                    dropdown.innerHTML = `
                        <li class="px-4 py-3 text-sm font-bold text-[#0a2540] hover:bg-[#f6f9fc] cursor-pointer transition flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-[#39FF14]"></span>
                            ${city}, ${state} (${zip})
                        </li>
                    `;

                    // Handle selection
                    const option = dropdown.querySelector('li');
                    option.addEventListener('click', () => {
                        input.value = zip; // keep the zip
                        dropdown.classList.add('hidden');
                        
                        // Store coordinates
                        coordinates[type] = { lat, lng };

                        // Try to auto-calculate distance
                        attemptDistanceCalculation();
                    });

                } else {
                    dropdown.innerHTML = '<li class="px-4 py-3 text-sm text-red-500">Invalid ZIP Code</li>';
                    setTimeout(() => dropdown.classList.add('hidden'), 2000);
                }
            } catch (error) {
                dropdown.innerHTML = '<li class="px-4 py-3 text-sm text-red-500">Error fetching location</li>';
                setTimeout(() => dropdown.classList.add('hidden'), 2000);
            }
        } else {
            dropdown.classList.add('hidden');
        }
    });

    // Close dropdown on click outside
    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });
}

function attemptDistanceCalculation() {
    if (coordinates.pickup && coordinates.delivery) {
        const dist = calculateHaversineDistance(
            coordinates.pickup.lat, coordinates.pickup.lng,
            coordinates.delivery.lat, coordinates.delivery.lng
        );

        // Fill the distance field and make it flash green briefly
        const distInput = document.getElementById('distance');
        distInput.value = dist.toFixed(0);
        distInput.classList.add('bg-green-50', 'border-green-400');
        setTimeout(() => {
            distInput.classList.remove('bg-green-50', 'border-green-400');
        }, 1000);
    }
}

// Haversine formula to calculate distance between two coordinates
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 3958.8; // Radius of the Earth in miles
    const rlat1 = lat1 * (Math.PI/180);
    const rlat2 = lat2 * (Math.PI/180);
    const difflat = rlat2-rlat1;
    const difflon = (lon2-lon1) * (Math.PI/180);

    const d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
    
    // Multiply by 1.2 to approximate driving routing distance vs straight line
    return d * 1.2;
}

function calculateQuote() {
    const distanceInput = document.getElementById('distance').value;
    const distance = parseFloat(distanceInput);
    if (isNaN(distance) || distance <= 0) {
        alert("Please enter valid Pickup and Delivery ZIP codes to calculate distance.");
        return;
    }
}

