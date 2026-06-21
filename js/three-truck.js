document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("truck-canvas-container");
    if (!container || typeof THREE === "undefined") return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(20, 15, 30);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    const blueLight = new THREE.PointLight(0x00d4ff, 2, 50);
    blueLight.position.set(-10, 5, 10);
    scene.add(blueLight);

    const purpleLight = new THREE.PointLight(0x635bff, 2, 50);
    purpleLight.position.set(10, 5, -10);
    scene.add(purpleLight);

    // Truck Group
    const truck = new THREE.Group();
    scene.add(truck);

    // Materials
    const bodyMat = new THREE.MeshStandardMaterial({ 
        color: 0x0a2540, 
        roughness: 0.2, 
        metalness: 0.8 
    });
    const neonMat = new THREE.MeshStandardMaterial({ 
        color: 0x00d4ff, 
        emissive: 0x00d4ff, 
        emissiveIntensity: 0.5 
    });
    const tireMat = new THREE.MeshStandardMaterial({ 
        color: 0x111111, 
        roughness: 0.9 
    });
    const glassMat = new THREE.MeshStandardMaterial({ 
        color: 0x222222, 
        roughness: 0.1, 
        metalness: 0.9, 
        transparent: true, 
        opacity: 0.8 
    });

    // 1. Cab (Front of truck)
    const cab = new THREE.Group();
    truck.add(cab);
    cab.position.set(8, 0, 0);

    // Cab Body
    const cabGeom = new THREE.BoxGeometry(4, 4, 4);
    const cabMesh = new THREE.Mesh(cabGeom, bodyMat);
    cabMesh.position.set(0, 3, 0);
    cab.add(cabMesh);

    // Cab Hood
    const hoodGeom = new THREE.BoxGeometry(3, 2, 4);
    const hoodMesh = new THREE.Mesh(hoodGeom, bodyMat);
    hoodMesh.position.set(3.5, 2, 0);
    cab.add(hoodMesh);

    // Windshield
    const glassGeom = new THREE.BoxGeometry(0.1, 2, 3.8);
    const glassMesh = new THREE.Mesh(glassGeom, glassMat);
    glassMesh.position.set(2, 4, 0);
    // angle it slightly
    glassMesh.rotation.z = -0.3;
    cab.add(glassMesh);

    // Grill
    const grillGeom = new THREE.BoxGeometry(0.2, 1.5, 3);
    const grillMesh = new THREE.Mesh(grillGeom, neonMat);
    grillMesh.position.set(5.1, 2, 0);
    cab.add(grillMesh);

    // 2. Trailer
    const trailer = new THREE.Group();
    truck.add(trailer);
    trailer.position.set(-4, 0, 0);

    // Trailer Base
    const trailerGeom = new THREE.BoxGeometry(18, 0.5, 4);
    const trailerMesh = new THREE.Mesh(trailerGeom, bodyMat);
    trailerMesh.position.set(0, 1.5, 0);
    trailer.add(trailerMesh);

    // Trailer Upper Deck
    const upperDeckGeom = new THREE.BoxGeometry(18, 0.2, 4);
    const upperDeckMesh = new THREE.Mesh(upperDeckGeom, bodyMat);
    upperDeckMesh.position.set(0, 5, 0);
    trailer.add(upperDeckMesh);

    // Trailer Pillars
    const pillarGeom = new THREE.BoxGeometry(0.5, 3.5, 0.5);
    for(let i=-8; i<=8; i+=8) {
        const p1 = new THREE.Mesh(pillarGeom, bodyMat);
        p1.position.set(i, 3.25, 1.8);
        trailer.add(p1);
        const p2 = new THREE.Mesh(pillarGeom, bodyMat);
        p2.position.set(i, 3.25, -1.8);
        trailer.add(p2);
    }

    // Add some abstract "Cars" on the trailer
    const carMat1 = new THREE.MeshStandardMaterial({ color: 0x39FF14, roughness: 0.3, metalness: 0.6 }); // Best American Green
    const carMat2 = new THREE.MeshStandardMaterial({ color: 0x635bff, roughness: 0.3, metalness: 0.6 }); // Purple
    
    function createAbstractCar(mat, x, y, z) {
        const car = new THREE.Group();
        const base = new THREE.Mesh(new THREE.BoxGeometry(4, 1, 2), mat);
        base.position.set(0, 0.5, 0);
        const top = new THREE.Mesh(new THREE.BoxGeometry(2, 0.8, 1.8), glassMat);
        top.position.set(0, 1.4, 0);
        car.add(base);
        car.add(top);
        car.position.set(x, y, z);
        return car;
    }

    trailer.add(createAbstractCar(carMat1, 4, 1.75, 0)); // Bottom front
    trailer.add(createAbstractCar(carMat2, -4, 1.75, 0)); // Bottom back
    trailer.add(createAbstractCar(carMat2, 4, 5.1, 0)); // Top front
    trailer.add(createAbstractCar(carMat1, -4, 5.1, 0)); // Top back

    // 3. Wheels
    const wheels = [];
    const wheelGeom = new THREE.CylinderGeometry(1, 1, 0.5, 16);
    wheelGeom.rotateX(Math.PI / 2);

    function addWheel(parent, x, y, z) {
        const wheel = new THREE.Mesh(wheelGeom, tireMat);
        wheel.position.set(x, y, z);
        
        // Hubcap
        const hubGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.55, 16);
        hubGeom.rotateX(Math.PI / 2);
        const hub = new THREE.Mesh(hubGeom, neonMat);
        wheel.add(hub);
        
        parent.add(wheel);
        wheels.push(wheel);
    }

    // Cab Wheels
    addWheel(cab, 3, 1, 2);
    addWheel(cab, 3, 1, -2);
    addWheel(cab, -1, 1, 2);
    addWheel(cab, -1, 1, -2);

    // Trailer Wheels
    addWheel(trailer, -6, 1, 2);
    addWheel(trailer, -6, 1, -2);
    addWheel(trailer, -8, 1, 2);
    addWheel(trailer, -8, 1, -2);

    // Center the whole truck
    truck.position.set(0, -3, 0);
    // Initial rotation
    truck.rotation.y = Math.PI / 6;

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = Math.PI / 6;

    document.addEventListener("mousemove", (event) => {
        // Normalize mouse coordinates (-1 to +1)
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

        // Calculate target rotation based on mouse position
        targetRotationY = (Math.PI / 6) + (mouseX * 0.5); // rotate left/right
        targetRotationX = mouseY * 0.2; // tilt up/down
    });

    // Handle Window Resize
    window.addEventListener("resize", () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // Animation Loop
    function animate() {
        if (isVisible) {
            requestAnimationFrame(animate);
        }

        // Spin the wheels
        wheels.forEach(wheel => {
            wheel.rotation.z -= 0.05;
        });

        // Smoothly rotate the truck towards the target rotation
        truck.rotation.y += (targetRotationY - truck.rotation.y) * 0.05;
        truck.rotation.x += (targetRotationX - truck.rotation.x) * 0.05;

        // Add a gentle floating effect
        truck.position.y = -3 + Math.sin(Date.now() * 0.002) * 0.5;

        renderer.render(scene, camera);
    }

    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
            if (isVisible) animate();
        });
    }, { threshold: 0 });
    observer.observe(container);
});
