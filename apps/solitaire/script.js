import * as THREE from 'three';

// --- 1. GLOBAL VARIABLES ---
// Declaring these at the top level ensures all functions can see them
let scene, camera, renderer, raycaster, mouse;
let moves = 0, score = 0;

// --- 2. ASSET LOADING ---
const manager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(manager);

const boardBase = textureLoader.load('textures/brushed_aluminum.jpg');
const boardNormal = textureLoader.load('textures/brushed_aluminum_norm.jpg');
const cardFaces = textureLoader.load('textures/card_spritesheet.png');

// Configure spritesheet settings
cardFaces.wrapS = cardFaces.wrapT = THREE.RepeatWrapping;
cardFaces.repeat.set(1 / 13, 1 / 4);

// This is the main entry point: Game starts ONLY after textures load
manager.onLoad = () => {
    initScene();
    startNewGame();
    animate();
    console.log("3D Solitaire: All assets loaded and scene initialized.");
};

// --- 3. ENGINE INITIALIZATION ---
function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 12, 10);
    camera.lookAt(0, 0, -1);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('game-container').appendChild(renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const spot = new THREE.SpotLight(0xffffff, 1);
    spot.position.set(0, 20, 10);
    spot.castShadow = true;
    scene.add(spot);

    // Metallic Board
    const boardMat = new THREE.MeshStandardMaterial({
        map: boardBase,
        normalMap: boardNormal,
        metalness: 0.8,
        roughness: 0.2
    });
    const board = new THREE.Mesh(new THREE.PlaneGeometry(18, 12), boardMat);
    board.rotation.x = -Math.PI / 2;
    board.receiveShadow = true;
    scene.add(board);

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Setup UI Listeners
    setupUI();
}

// --- 4. CARD LOGIC ---
function createCardMesh(suit, rank, isFaceUp = false) {
    const geometry = new THREE.BoxGeometry(1, 0.02, 1.4);
    
    // Clone texture for individual card mapping
    const faceTex = cardFaces.clone();
    faceTex.offset.x = rank / 13;
    faceTex.offset.y = (3 - suit) / 4;
    faceTex.needsUpdate = true; 

    const materials = [
        new THREE.MeshStandardMaterial({ color: 0xffffff }), // Sides
        new THREE.MeshStandardMaterial({ color: 0xffffff }),
        new THREE.MeshStandardMaterial({ color: 0xffffff }),
        new THREE.MeshStandardMaterial({ color: 0xffffff }),
        new THREE.MeshStandardMaterial({ map: faceTex }),    // Face
        new THREE.MeshStandardMaterial({ color: 0x1a1a2e })   // Back
    ];

    const mesh = new THREE.Mesh(geometry, materials);
    if (!isFaceUp) mesh.rotation.z = Math.PI;
    mesh.userData = { suit, rank, isFaceUp };
    return mesh;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startNewGame() {
    // Clear existing cards from scene
    scene.children = scene.children.filter(obj => !obj.userData || obj.userData.rank === undefined);
    
    let newDeck = [];
    for(let s=0; s<4; s++) {
        for(let r=0; r<13; r++) {
            newDeck.push({s, r});
        }
    }
    shuffle(newDeck);

    let ptr = 0;
    // Deal Tableau
    for(let i=0; i<7; i++) {
        for(let j=0; j<=i; j++) {
            const data = newDeck[ptr++];
            const up = (j === i);
            const mesh = createCardMesh(data.s, data.r, up);
            // Stagger position for 3D stacking
            mesh.position.set(-4.5 + (i * 1.5), 0.05 + (j * 0.03), -2 + (j * 0.3));
            scene.add(mesh);
        }
    }
    
    // Reset Stats
    moves = 0;
    score = 0;
    document.getElementById('moves').innerText = '0';
    document.getElementById('score').innerText = '0';
}

// --- 5. ANIMATION & UI ---
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function setupUI() {
    const toggleBtn = document.getElementById('toggle-menu');
    const newGameBtn = document.getElementById('new-game');

    if (toggleBtn) {
        toggleBtn.onclick = () => {
            document.getElementById('menu-content').classList.toggle('hidden');
            document.getElementById('game-ui').classList.toggle('collapsed');
            toggleBtn.textContent = document.getElementById('game-ui').classList.contains('collapsed') 
                ? "EXPAND MENU" : "COLLAPSE MENU";
        };
    }

    if (newGameBtn) {
        newGameBtn.onclick = startNewGame;
    }
}
