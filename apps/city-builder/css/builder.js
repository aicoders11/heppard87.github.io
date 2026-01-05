
// 1. SCENE SETUP
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e); // Dark Blue Night
scene.fog = new THREE.FogExp2(0x1a1a2e, 0.02); // Distance fog

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. LIGHTING
const ambientLight = new THREE.AmbientLight(0x404040); 
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

// 3. THE GRID
const gridSize = 100;
const gridDivisions = 50;
const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0xff00ff, 0x444444);
scene.add(gridHelper);

const planeGeometry = new THREE.PlaneGeometry(gridSize, gridSize);
const planeMaterial = new THREE.MeshBasicMaterial({ visible: false });
const groundPlane = new THREE.Mesh(planeGeometry, planeMaterial);
groundPlane.rotation.x = -Math.PI / 2;
scene.add(groundPlane);

// 4. GAME VARIABLES
const buildings = [];
let buildingCount = 0;
const buildingColors = [0x00f5d4, 0xff0055, 0xfcee0a, 0x9d4edd]; 

camera.position.set(0, 10, 15);
camera.lookAt(0, 0, 0);

// 5. INPUT HANDLING
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

document.addEventListener('mousedown', onDocumentMouseDown, false);

function onDocumentMouseDown(event) {
    if (event.button !== 0) return; // Only Left Click

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(groundPlane);

    if (intersects.length > 0) {
        const intersect = intersects[0];
        const voxelSize = 2;
        const x = Math.round(intersect.point.x / voxelSize) * voxelSize;
        const z = Math.round(intersect.point.z / voxelSize) * voxelSize;
        placeBuilding(x, z);
    }
}

function placeBuilding(x, z) {
    const height = Math.random() * 4 + 1; 
    const geometry = new THREE.BoxGeometry(1.8, height, 1.8);
    const color = buildingColors[Math.floor(Math.random() * buildingColors.length)];
    const material = new THREE.MeshPhongMaterial({ color: color });
    
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, height / 2, z);
    
    scene.add(cube);
    buildings.push(cube);
    
    buildingCount++;
    document.getElementById('count').innerText = buildingCount;
}

window.clearCity = function() {
    buildings.forEach(b => scene.remove(b));
    buildings.length = 0;
    buildingCount = 0;
    document.getElementById('count').innerText = 0;
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
