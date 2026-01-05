// 1. SETUP THE SCENE
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
scene.background = // =========================================
// 1.5 ADD THE STARFIELD
// =========================================
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });

const starVertices = [];
// Create 10,000 random stars
for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000; // Spread them wide
    const y = (Math.random() - 0.5) * 2000;
    const z = - (Math.random() * 2000); // Only behind the globe? No, let's spread everywhere
    // Actually, let's use full 3D space:
    starVertices.push(
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000
    );
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);new THREE.Color(0x050505); // Almost black

// 2. CREATE THE GLOBE
const geometry = new THREE.SphereGeometry(2, 32, 32);
const material = new THREE.MeshBasicMaterial({ 
    color: 0x00ff00, // Matrix Green
    wireframe: true,
    transparent: true,
    opacity: 0.3
});
const globe = new THREE.Mesh(geometry, material);
scene.add(globe);

// Add a solid inner core so we can't see lines on the back
const coreGeometry = new THREE.SphereGeometry(1.98, 32, 32);
const coreMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
const core = new THREE.Mesh(coreGeometry, coreMaterial);
globe.add(core);

camera.position.z = 5;

// 3. ADD CITIES (Red Dots)
// Format: { name, lat, lon, timezone }
const cities = [
    { name: "New York", lat: 40.71, lon: -74.00, tz: "America/New_York" },
    { name: "London", lat: 51.50, lon: -0.12, tz: "Europe/London" },
    { name: "Tokyo", lat: 35.67, lon: 139.65, tz: "Asia/Tokyo" },
    { name: "Sydney", lat: -33.86, lon: 151.20, tz: "Australia/Sydney" },
    { name: "Moscow", lat: 55.75, lon: 37.61, tz: "Europe/Moscow" },
    { name: "Rio de Janeiro", lat: -22.90, lon: -43.17, tz: "America/Sao_Paulo" }
];

const cityMarkers = [];

// Function to convert Lat/Lon to 3D Position
function latLongToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = (radius * Math.sin(phi) * Math.sin(theta));
    const y = (radius * Math.cos(phi));

    return new THREE.Vector3(x, y, z);
}

// Loop through cities and create markers
cities.forEach(city => {
    const markerGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const markerMat = new THREE.MeshBasicMaterial({ color: 0xff0055 }); // Neon Red
    const marker = new THREE.Mesh(markerGeo, markerMat);

    // Convert coords and position marker
    const pos = latLongToVector3(city.lat, city.lon, 2);
    marker.position.copy(pos);
    
    // Attach data to the marker for later
    marker.userData = { name: city.name, tz: city.tz };

    // Add marker to the globe (so it rotates with it)
    globe.add(marker);
    cityMarkers.push(marker);
});

// 4. MOUSE INTERACTION (Rotate Globe)
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

document.addEventListener('mousedown', () => isDragging = true);
document.addEventListener('mouseup', () => isDragging = false);
document.addEventListener('mousemove', (e) => {
    // 1. Handle Rotation
    if (isDragging) {
        const deltaMove = {
            x: e.offsetX - previousMousePosition.x,
            y: e.offsetY - previousMousePosition.y
        };

        const deltaRotationQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(
                deltaMove.y * 0.005, // Tilt speed
                deltaMove.x * 0.005, // Spin speed
                0,
                'XYZ'
            ));
        
        globe.quaternion.multiplyQuaternions(deltaRotationQuaternion, globe.quaternion);
    }
    previousMousePosition = { x: e.offsetX, y: e.offsetY };

    // 2. Handle Hover (Raycasting)
    checkIntersection(e.clientX, e.clientY);
});

// 5. RAYCASTER (Detects when mouse is over a city)
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const timeDisplay = document.getElementById('time-display');

function checkIntersection(mouseX, mouseY) {
    // Convert mouse to 3D coordinates (-1 to +1)
    mouse.x = (mouseX / window.innerWidth) * 2 - 1;
    mouse.y = -(mouseY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Check if ray hits any city marker (note: markers are children of globe, need world coords)
    // We check intersections with the globe's children (markers)
    const intersects = raycaster.intersectObjects(globe.children);

    if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData.name) {
            // It's a city! Show time.
            const now = new Date().toLocaleTimeString("en-US", { timeZone: hit.userData.tz });
            timeDisplay.innerHTML = `${hit.userData.name.toUpperCase()}<br><span style="color:white; font-size:1.5em">${now}</span>`;
            timeDisplay.style.borderColor = "#ff0055"; // Red Border
            hit.material.color.setHex(0xffffff); // Turn white when hovered
        }
    } else {
        // Reset colors
        cityMarkers.forEach(m => m.material.color.setHex(0xff0055));
        timeDisplay.innerHTML = "HOVER OVER A CITY";
        timeDisplay.style.borderColor = "#00f5d4"; // Cyan Border
    }
}

// 6. ANIMATION LOOP
function animate() {
    requestAnimationFrame(animate);
    
    // Slow auto-rotation if not dragging
    if (!isDragging) {
        globe.rotation.y += 0.001; 
    }

    renderer.render(scene, camera);
}

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
