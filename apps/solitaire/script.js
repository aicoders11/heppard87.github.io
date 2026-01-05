// Solitaire 3D - Clean Version
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded. Starting Solitaire script...");

    // --- GAME STATE & CORE THREE.JS VARS ---
    let scene, camera, renderer;
    let scoreManager, currentScore;
    let deck, tableau, foundations, stock, waste, moveHistory;
    let selectedObject = null;
    let drawStyle = 1;
    
    // --- TEXTURE & LOADING ---
    let cardTexture;
    const loadedTextures = {};
    const loadingManager = new THREE.LoadingManager();
    const textureLoader = new THREE.TextureLoader(loadingManager);

    loadingManager.onLoad = function () {
        console.log("Textures ready. Building scene...");
        createTable();
        dealCards();
    };

    // --- SCENE SETUP ---
    function setupScene() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 5, 10);
        camera.lookAt(scene.position);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('game-container').appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);
    }

    function loadAllTextures() {
        const texturesToLoad = {
            cardSpritesheet: 'textures/card_spritesheet.png',
            tableColor: 'textures/brushed_aluminum.jpg'
        };
        for (const key in texturesToLoad) {
            textureLoader.load(texturesToLoad[key], (texture) => {
                if (key === 'cardSpritesheet') cardTexture = texture;
                loadedTextures[key] = texture;
            });
        }
    }

    function createTable() {
        const geometry = new THREE.PlaneGeometry(20, 12);
        const material = new THREE.MeshStandardMaterial({ map: loadedTextures.tableColor });
        const table = new THREE.Mesh(geometry, material);
        table.rotation.x = -Math.PI / 2;
        table.position.y = -1;
        scene.add(table);
    }

    // --- CARD & DECK CLASSES ---
    class Card {
        constructor(suit, value, rankValue, color) {
            this.suit = suit;
            this.value = value;
            this.rankValue = rankValue;
            this.color = color;
            this.isFaceUp = false;
            this.mesh = this.createCardMesh();
        }
        createCardMesh() {
            const geometry = new THREE.BoxGeometry(1.5, 2.2, 0.05);
            const sideMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
            const materials = [sideMat, sideMat, sideMat, sideMat, this.getFaceMat(), this.getBackMat()];
            const mesh = new THREE.Mesh(geometry, materials);
            mesh.userData.card = this;
            return mesh;
        }
        getFaceMat() { /* UV logic from your spritesheet */ return new THREE.MeshStandardMaterial({color: 0xffffff}); }
        getBackMat() { /* UV logic for back */ return new THREE.MeshStandardMaterial({color: 0x0000ff}); }
    }

    // --- INTERACTION LOGIC ---
    function handleStockClick() {
        if (stock.length === 0) {
            stock = waste.reverse().map(c => { c.isFaceUp = false; return c; });
            waste = [];
        } else {
            let card = stock.pop();
            card.isFaceUp = true;
            waste.push(card);
        }
        updateScore(0);
    }

    function handleCardClick(card) {
        if (!selectedObject) {
            if (card.isFaceUp) {
                selectedObject = card;
                // Add highlight logic here
            }
        } else {
            if (isValidMove(selectedObject, card)) {
                handleMove(selectedObject, card);
            }
            selectedObject = null;
        }
    }

    function isValidMove(dragged, target) {
        if (!target) return dragged.rankValue === 13; // King on empty
        return (dragged.color !== target.color) && (target.rankValue === dragged.rankValue + 1);
    }

    function handleMove(card, dest) {
        // Logic to move between arrays
        moveHistory.push({ card, from: "previous" });
        updateScore(10);
        checkVictory();
    }

    function checkVictory() {
        let winCount = foundations.reduce((sum, p) => sum + p.length, 0);
        if (winCount === 52) showWinOverlay();
    }

    function updateScore(pts) {
        currentScore += pts;
        document.getElementById('score').innerText = currentScore;
    }

    function undoLastMove() {
        if (moveHistory.length > 0) {
            const move = moveHistory.pop();
            // Undo logic
            updateScore(-10);
        }
    }

    function onMouseClick(event) {
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
            const obj = intersects[0].object;
            if (obj.name === 'stock') handleStockClick();
            else if (obj.userData.card) handleCardClick(obj.userData.card);
        }
    }

    // --- START GAME ---
    function initGame() {
        setupScene();
        loadAllTextures();
        tableau = [[],[],[],[],[],[],[]];
        foundations = [[],[],[],[]];
        moveHistory = [];
        currentScore = 0;
        window.addEventListener('click', onMouseClick);
        animate();
    }

    function animate() {
        requestAnimationFrame(animate);
        if(renderer) renderer.render(scene, camera);
    }

    initGame();
});
