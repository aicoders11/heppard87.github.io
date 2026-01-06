document.addEventListener('DOMContentLoaded', () => {
    // --- 1. GLOBAL VARIABLES ---
    let scene, camera, renderer, raycaster = new THREE.Raycaster(), mouse = new THREE.Vector2();
    let moves = 0, currentScore = 0;
    const textureLoader = new THREE.TextureLoader();

    // --- 2. ASSET LOADING ---
    const boardBase = textureLoader.load('textures/brushed_aluminum.jpg');
    const boardNormal = textureLoader.load('textures/brushed_aluminum_norm.jpg');
    
    // Load card spritesheet correctly
    const cardFaces = textureLoader.load('textures/card_spritesheet.png');
    cardFaces.wrapS = cardFaces.wrapT = THREE.RepeatWrapping;
    cardFaces.repeat.set(1/13, 1/4); // 13 columns (ranks), 4 rows (suits)

    // --- 3. UI CONTROLS ---
    const toggleBtn = document.getElementById('toggle-menu');
    const menuContent = document.getElementById('menu-content');
    const gameUI = document.getElementById('game-ui');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const isHidden = menuContent.classList.toggle('hidden');
            gameUI.classList.toggle('collapsed');
            toggleBtn.textContent = isHidden ? 'Show Menu' : 'Collapse Menu';
        });
    }

    // --- 4. ENGINE INITIALIZATION ---
    function initScene() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('game-container').appendChild(renderer.domElement);

        scene.add(new THREE.AmbientLight(0xffffff, 0.6));
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        const boardMaterial = new THREE.MeshStandardMaterial({
            map: boardBase,
            normalMap: boardNormal,
            metalness: 0.7,
            roughness: 0.3
        });
        const board = new THREE.Mesh(new THREE.PlaneGeometry(15, 10), boardMaterial);
        board.rotation.x = -Math.PI / 2;
        scene.add(board);

        camera.position.set(0, 8, 8);
        camera.lookAt(0, 0, 0);
    }

    // --- 5. CARD GENERATION LOGIC ---
    function setCardFace(mesh, suitIndex, rankIndex) {
        // Suit 0-3, Rank 0-12
        const faceMaterial = mesh.material[4]; // The top face
        faceMaterial.map = cardFaces.clone();
        faceMaterial.map.needsUpdate = true;
        faceMaterial.map.offset.x = rankIndex / 13;
        faceMaterial.map.offset.y = (3 - suitIndex) / 4; // Invert Y if needed based on sheet
    }

    function createCardMesh(suit, rank) {
        const cardGeo = new THREE.BoxGeometry(1, 0.02, 1.4);
        const materials = [
            new THREE.MeshStandardMaterial({ color: 0xcccccc }), // sides
            new THREE.MeshStandardMaterial({ color: 0xcccccc }),
            new THREE.MeshStandardMaterial({ color: 0xcccccc }),
            new THREE.MeshStandardMaterial({ color: 0xcccccc }),
            new THREE.MeshStandardMaterial({ transparent: true }), // Face (Material index 4)
            new THREE.MeshStandardMaterial({ color: 0x1a1a2e })  // Back
        ];
        
        const mesh = new THREE.Mesh(cardGeo, materials);
        setCardFace(mesh, suit, rank);
        return mesh;
    }

    function dealGame() {
        // Example deal: Place one card in the center
        const card = createCardMesh(0, 0); // Ace of Hearts/Spades
        card.position.set(0, 0.1, 0);
        scene.add(card);
    }

    // --- 6. START ---
    initScene();
    dealGame();

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();

    // Listen for New Game clicks
    document.getElementById('new-game').addEventListener('click', () => {
        location.reload(); 
    });
});            map: boardBase,
            normalMap: boardNormal,
            metalness: 0.8,
            roughness: 0.2
        });
        const board = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), boardMaterial);
        board.rotation.x = -Math.PI / 2;
        scene.add(board);

        camera.position.set(0, 10, 10);
        camera.lookAt(0, 0, 0);
    }

    initScene();
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
});
// --- 1. CARD DEALING LOGIC ---
const DECK_POS = { x: -5, y: 0.5, z: -4 }; // Starting point for animation

function createCardMesh(suit, rank) {
    const cardGeo = new THREE.BoxGeometry(1, 0.02, 1.4);
    // Material 0-3: sides, 4: top (face), 5: bottom (back)
    const materials = [
        new THREE.MeshStandardMaterial({ color: 0xffffff }), // sides
        new THREE.MeshStandardMaterial({ color: 0xffffff }),
        new THREE.MeshStandardMaterial({ color: 0xffffff }),
        new THREE.MeshStandardMaterial({ color: 0xffffff }),
        new THREE.MeshStandardMaterial({ map: cardFaces.clone() }), // face
        new THREE.MeshStandardMaterial({ color: 0x222222 }) // back
    ];
    
    const mesh = new THREE.Mesh(cardGeo, materials);
    setCardFace(mesh, suit, rank); // Use your existing spritesheet function
    return mesh;
}

function animateMove(mesh, targetPos, duration = 500) {
    const startPos = { ...mesh.position };
    const startTime = performance.now();

    function update() {
        const now = performance.now();
        const progress = Math.min((now - startTime) / duration, 1);
        
        // Linear interpolation for movement
        mesh.position.x = startPos.x + (targetPos.x - startPos.x) * progress;
        mesh.position.y = startPos.y + (targetPos.y - startPos.y) * progress;
        mesh.position.z = startPos.z + (targetPos.z - startPos.z) * progress;

        if (progress < 1) requestAnimationFrame(update);
    }
    update();
}

// --- 2. THE DEAL FUNCTION ---
function dealCards() {
    let delay = 0;
    // Example: Deal a simple row of 7 cards
    for (let i = 0; i < 7; i++) {
        setTimeout(() => {
            const card = createCardMesh(0, i + 1); // Suit 0, Ranks 1-7
            card.position.set(DECK_POS.x, DECK_POS.y, DECK_POS.z);
            scene.add(card);
            
            const target = { x: -4.5 + (i * 1.5), y: 0.1, z: 0 };
            animateMove(card, target);
        }, delay);
        delay += 150; // Delay between each card being dealt
    }
}

// Call this inside your initScene or via the "New Game" button
document.getElementById('new-game').addEventListener('click', () => {
    // Clear existing cards and redeal
    dealCards();
});
