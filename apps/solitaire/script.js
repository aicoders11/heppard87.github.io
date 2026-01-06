/**
 * 3D Solitaire - Core Game Logic
 * Includes: Three.js Engine, Texture Mapping, Deck Shuffling, and Tableau Dealing
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. VARIABLES & CONSTANTS ---
    let scene, camera, renderer, raycaster, mouse;
    let moves = 0, score = 0;
    let deck = [];
    const textureLoader = new THREE.TextureLoader();

    // Game Layout Constants
    const CARD_WIDTH = 1;
    const CARD_HEIGHT = 1.4;
    const CARD_THICKNESS = 0.02;
    const TABLEAU_START_X = -4.5;
    const TABLEAU_Z_OFFSET = 0.25; // Vertical spacing in columns
    const STACK_Y_OFFSET = 0.015;  // To prevent Z-fighting

    // --- 2. ASSET LOADING ---
    const boardBase = textureLoader.load('textures/brushed_aluminum.jpg');
    const boardNormal = textureLoader.load('textures/brushed_aluminum_norm.jpg');
    const cardSpritesheet = textureLoader.load('textures/card_spritesheet.png');
    
    // Configure spritesheet (13 ranks x 4 suits)
    cardSpritesheet.wrapS = cardSpritesheet.wrapT = THREE.RepeatWrapping;
    cardSpritesheet.repeat.set(1 / 13, 1 / 4);

    // --- 3. UI INITIALIZATION ---
    const toggleBtn = document.getElementById('toggle-menu');
    const menuContent = document.getElementById('menu-content');
    const gameUI = document.getElementById('game-ui');
    const newGameBtn = document.getElementById('new-game');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const isHidden = menuContent.classList.toggle('hidden');
            gameUI.classList.toggle('collapsed');
            toggleBtn.textContent = isHidden ? 'Show Menu' : 'Collapse Menu';
        });
    }

    // --- 4. 3D SCENE SETUP ---
    function initScene() {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x050505);

        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 10, 8);
        camera.lookAt(0, 0, -1);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        document.getElementById('game-container').appendChild(renderer.domElement);

        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const spotLight = new THREE.SpotLight(0xffffff, 1);
        spotLight.position.set(5, 15, 10);
        spotLight.castShadow = true;
        scene.add(spotLight);

        // Metallic Board
        const boardGeo = new THREE.PlaneGeometry(16, 12);
        const boardMat = new THREE.MeshStandardMaterial({
            map: boardBase,
            normalMap: boardNormal,
            metalness: 0.8,
            roughness: 0.2
        });
        const board = new THREE.Mesh(boardGeo, boardMat);
        board.rotation.x = -Math.PI / 2;
        board.receiveShadow = true;
        scene.add(board);

        window.addEventListener('resize', onWindowResize);
        window.addEventListener('click', onCardClick);
    }

    // --- 5. CARD LOGIC ---
    function createCardMesh(suitIndex, rankIndex, isFaceUp = false) {
        const geometry = new THREE.BoxGeometry(CARD_WIDTH, CARD_THICKNESS, CARD_HEIGHT);
        
        // Clone the spritesheet for this specific card
        const cardFaceTex = cardSpritesheet.clone();
        cardFaceTex.needsUpdate = true;
        cardFaceTex.offset.x = rankIndex / 13;
        cardFaceTex.offset.y = (3 - suitIndex) / 4; // Adjust based on sheet orientation

        const materials = [
            new THREE.MeshStandardMaterial({ color: 0xffffff }), // Right
            new THREE.MeshStandardMaterial({ color: 0xffffff }), // Left
            new THREE.MeshStandardMaterial({ color: 0xffffff }), // Top (edge)
            new THREE.MeshStandardMaterial({ color: 0xffffff }), // Bottom (edge)
            new THREE.MeshStandardMaterial({ map: cardFaceTex }), // Face
            new THREE.MeshStandardMaterial({ color: 0x1a1a2e })   // Back (Blue/Dark)
        ];

        const mesh = new THREE.Mesh(geometry, materials);
        mesh.castShadow = true;
        
        // Face down rotation by default
        if (!isFaceUp) mesh.rotation.z = Math.PI;

        mesh.userData = { suit: suitIndex, rank: rankIndex, isFaceUp: isFaceUp };
        return mesh;
    }

    function createDeck() {
        const newDeck = [];
        for (let s = 0; s < 4; s++) {
            for (let r = 0; r < 13; r++) {
                newDeck.push({ suit: s, rank: r });
            }
        }
        return shuffle(newDeck);
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function dealGame() {
        // Clear existing cards
        scene.children = scene.children.filter(obj => !obj.userData.rank && obj.userData.rank !== 0);
        
        const playingDeck = createDeck();
        let cardPtr = 0;

        // Deal 7 Tableau Columns
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j <= i; j++) {
                const cardData = playingDeck[cardPtr++];
                const isFaceUp = (j === i);
                const cardMesh = createCardMesh(cardData.suit, cardData.rank, isFaceUp);
                
                cardMesh.position.set(
                    TABLEAU_START_X + (i * 1.5),
                    0.05 + (j * STACK_Y_OFFSET),
                    -2 + (j * TABLEAU_Z_OFFSET)
                );
                
                scene.add(cardMesh);
            }
        }
    }

    // --- 6. INTERACTION & UTILS ---
    function onCardClick(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children);

        if (intersects.length > 0) {
            const clickedObj = intersects[0].object;
            if (clickedObj.userData.rank !== undefined) {
                console.log(`Clicked: Rank ${clickedObj.userData.rank} of Suit ${clickedObj.userData.suit}`);
                // Add move logic here
            }
        }
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    // --- 7. START ---
    initScene();
    dealGame();
    animate();

    if (newGameBtn) {
        newGameBtn.addEventListener('click', dealGame);
    }
});
