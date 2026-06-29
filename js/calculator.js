// js/calculator.js

const coordinates = {
    pickup: null,
    delivery: null
};

let vehicleCount = 1;

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

    // --- Multi-Vehicle: Add Vehicle Button ---
    const btnAddVehicle = document.getElementById('btnAddVehicle');
    if (btnAddVehicle) {
        btnAddVehicle.addEventListener('click', addVehicle);
    }

    if (btnNextStep) {
        btnNextStep.addEventListener('click', () => {
            // Validate step 1 shared fields
            const pickup = document.getElementById('pickupZip');
            const delivery = document.getElementById('deliveryZip');
            const distance = document.getElementById('distance');
            const pickupDate = document.getElementById('pickupDate');

            if (!pickup.checkValidity()) { pickup.reportValidity(); return; }
            if (!delivery.checkValidity()) { delivery.reportValidity(); return; }
            if (!distance.value) { alert("Please enter valid Pickup and Delivery ZIP codes to calculate distance."); return; }
            if (!pickupDate.checkValidity()) { pickupDate.reportValidity(); return; }

            // Validate all vehicle groups
            const vehicleGroups = document.querySelectorAll('.vehicle-group');
            for (const group of vehicleGroups) {
                const year = group.querySelector('.vehicleYear');
                const make = group.querySelector('.vehicleMake');
                const model = group.querySelector('.vehicleModel');
                if (year && !year.checkValidity()) { year.reportValidity(); return; }
                if (make && !make.checkValidity()) { make.reportValidity(); return; }
                if (model && !model.checkValidity()) { model.reportValidity(); return; }
            }

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

    // --- AJAX Form Submission (no page redirect) ---
    calcForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = calcForm.querySelector('[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="inline-flex items-center gap-2"><svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Submitting...</span>';
        }

        // Gather form data
        const pickupZip = document.getElementById('pickupZip').value;
        const deliveryZip = document.getElementById('deliveryZip').value;
        const transportType = document.getElementById('transportType').value;
        const pickupDate = document.getElementById('pickupDate').value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const estimatedPrice = document.getElementById('estimatedPriceField').value;

        // Gather all vehicles
        const vehicles = [];
        document.querySelectorAll('.vehicle-group').forEach((group, idx) => {
            vehicles.push({
                number: idx + 1,
                year: group.querySelector('.vehicleYear')?.value || '',
                make: group.querySelector('.vehicleMake')?.value || '',
                model: group.querySelector('.vehicleModel')?.value || '',
                type: group.querySelector('.vehicleType')?.value || 'sedan',
                condition: group.querySelector('.vehicleCondition')?.value === 'run' ? 'Running' : 'Non-Running'
            });
        });

        // Build vehicle summary string for email
        const vehicleSummary = vehicles.map(v => `Vehicle ${v.number}: ${v.year} ${v.make} ${v.model} (${v.type}, ${v.condition})`).join('\n');

        // Build Web3Forms payload
        const web3Payload = {
            access_key: calcForm.querySelector('[name="access_key"]').value,
            subject: calcForm.querySelector('[name="subject"]').value,
            from_name: 'Best American Auto Transport Inc Website',
            'First Name': firstName,
            'Last Name': lastName,
            'Email': email,
            'Phone': phone,
            'Pickup ZIP': pickupZip,
            'Delivery ZIP': deliveryZip,
            'Distance': document.getElementById('distance').value,
            'Pickup Date': pickupDate,
            'Transport Type': transportType === 'enclosed' ? 'Enclosed' : 'Open',
            'Vehicles': vehicleSummary,
            'Vehicle Count': vehicles.length,
            'Estimated Price': estimatedPrice
        };

        // Send Web3Forms email via AJAX (no redirect)
        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(web3Payload)
            });
            const result = await response.json();
            console.log('Web3Forms response:', result);
        } catch (err) {
            console.error('Web3Forms submission failed:', err);
        }

        // Show inline success message
        showSuccessMessage(calcForm);
    });
});

// --- Add Vehicle ---
function addVehicle() {
    vehicleCount++;
    const container = document.getElementById('vehicleGroupsContainer');
    if (!container) return;

    const group = document.createElement('div');
    group.className = 'vehicle-group border border-[#e6e6e6] rounded-lg p-3 relative animate-fadeIn';
    group.dataset.vehicleNum = vehicleCount;

    group.innerHTML = `
        <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] font-bold text-[#800020] uppercase tracking-wide">Vehicle ${vehicleCount}</span>
            <button type="button" class="btn-remove-vehicle text-xs text-[#e31837] hover:text-[#c41530] font-bold flex items-center gap-1" title="Remove this vehicle">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                Remove
            </button>
        </div>
        <div class="grid grid-cols-3 gap-2 mb-2">
            <input type="text" class="vehicleYear w-full px-3 py-2 text-sm border border-[#e6e6e6] rounded-md" placeholder="Year" required>
            <input type="text" class="vehicleMake w-full px-3 py-2 text-sm border border-[#e6e6e6] rounded-md" placeholder="Make" required>
            <input type="text" class="vehicleModel w-full px-3 py-2 text-sm border border-[#e6e6e6] rounded-md" placeholder="Model" required>
        </div>
        <div class="grid grid-cols-2 gap-2">
            <select class="vehicleType w-full px-3 py-2 text-sm border border-[#e6e6e6] rounded-md bg-white">
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="truck">Truck</option>
            </select>
            <select class="vehicleCondition w-full px-3 py-2 text-sm border border-[#e6e6e6] rounded-md bg-white">
                <option value="run">Runs & Drives</option>
                <option value="inop">Inoperable</option>
            </select>
        </div>
    `;

    container.appendChild(group);

    // Bind remove button
    group.querySelector('.btn-remove-vehicle').addEventListener('click', () => {
        group.remove();
        updateVehicleLabels();
        // Recalculate if we're on step 1
        if (!document.getElementById('step1').classList.contains('hidden')) {
            // Quote will recalculate on next "Continue" click
        }
    });

    // Scroll the new group into view
    group.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Update vehicle labels after removal
function updateVehicleLabels() {
    const groups = document.querySelectorAll('.vehicle-group');
    vehicleCount = groups.length;
    groups.forEach((group, idx) => {
        const label = group.querySelector('.text-\\[11px\\].font-bold.text-\\[\\#800020\\]');
        if (label) label.textContent = `Vehicle ${idx + 1}`;
    });
    // Update the "Vehicle 1" label on the original group
    const originalLabel = document.getElementById('vehicle1Label');
    if (originalLabel && groups.length > 0) originalLabel.textContent = 'Vehicle 1';
}

// --- Show inline success message (no redirect) ---
function showSuccessMessage(form) {
    const step2 = document.getElementById('step2');
    if (step2) step2.classList.add('hidden');

    // Replace form content with success message
    form.innerHTML = `
        <div class="text-center py-8">
            <div class="w-16 h-16 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h3 class="text-xl font-bold text-[#0a2540] mb-2">Quote Request Submitted!</h3>
            <p class="text-[#425466] text-sm mb-6">Thank you! A Best American Auto Transport Inc specialist will contact you within 1 hour with your custom quote.</p>
            <div class="space-y-3">
                <a href="/contact/" class="inline-block w-full py-2.5 rounded-lg font-bold text-white bg-[#800020] hover:bg-[#5c0017] transition-colors shadow-md text-sm text-center">Contact Us Now</a>
                <a href="/" class="inline-block w-full py-2.5 rounded-lg font-bold text-[#0a2540] bg-[#f0f5fa] hover:bg-[#e6e6e6] transition-colors text-sm text-center">Back to Homepage</a>
            </div>
        </div>
    `;
}

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
                            <span class="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
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

    const transportType = document.getElementById('transportType').value;

    // Base rates calculation
    let ratePerMile = 0.85;
    if (distance < 500) ratePerMile = 1.30;
    else if (distance < 1000) ratePerMile = 1.05;
    else if (distance < 1500) ratePerMile = 0.95;

    let total = 0;

    // Calculate cost for each vehicle
    const vehicleGroups = document.querySelectorAll('.vehicle-group');
    vehicleGroups.forEach((group) => {
        const vType = group.querySelector('.vehicleType')?.value || 'sedan';
        const vCondition = group.querySelector('.vehicleCondition')?.value || 'run';

        let base = distance * ratePerMile;

        // Vehicle size adjustments
        if (vType === 'truck') base += 100;
        else if (vType === 'suv') base += 50;

        // Condition adjustments
        if (vCondition === 'inop') base += 150;

        // Transport type
        if (transportType === 'enclosed') base += 250;

        total += Math.round(base);
    });

    // Multi-vehicle discount: 10% off for 2nd+ vehicles
    if (vehicleGroups.length > 1) {
        const firstVehicleCost = Math.round(distance * ratePerMile);
        const additionalVehiclesCost = total - (Math.round(distance * ratePerMile) + (document.querySelector('.vehicle-group .vehicleType')?.value === 'truck' ? 100 : document.querySelector('.vehicle-group .vehicleType')?.value === 'suv' ? 50 : 0) + (document.querySelector('.vehicle-group .vehicleCondition')?.value === 'inop' ? 150 : 0) + (transportType === 'enclosed' ? 250 : 0));
        // Apply 10% discount on additional vehicles only
        total = Math.round(total - additionalVehiclesCost * 0.1);
    }

    const estField = document.getElementById('estimatedPriceField');
    if (estField) estField.value = total;
}
