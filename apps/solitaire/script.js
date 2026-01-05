document.addEventListener('DOMContentLoaded', () => {
    // --- 1. GAME STATE & 3D VARIABLES ---
    let scene, camera, renderer, raycaster = new THREE.Raycaster(), mouse = new THREE.Vector2();
    let deck = [], tableau = [[],[],[],[],[],[],[]], foundations = [[],[],[],[]], stock = [], waste = [];
    let selectedObject = null, currentScore = 0, moves = 0;

    // --- 2. DECK & SHUFFLE LOGIC ---
    function createDeck() {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        let newDeck = [];
        suits.forEach(suit => {
            const color = (suit === 'hearts' || suit === 'diamonds') ? 'red' : 'black';
            values.forEach((val, i) => {
                newDeck.push({ suit, value: val, rank: i + 1, color, isFaceUp: false });
            });
        });
        return newDeck.sort(() => Math.random() - 0.5); // Quick shuffle
    }

    // --- 3. 3D SCENE SETUP ---
    function initScene() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 5, 10);
        camera.lookAt(0, 0, 0);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('game-container').appendChild(renderer.domElement);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 10, 7.5);
        scene.add(new THREE.AmbientLight(0xffffff, 0.7), light);
    }

    // --- 4. DEALING THE CARDS ---
    function dealGame() {
        deck = createDeck();
        for (let i = 0; i < 7; i++) {
            for (let j = i; j < 7; j++) {
                let card = deck.pop();
                card.isFaceUp = (i === j);
                tableau[j].push(card);
                renderCard(card, j, i);
            }
        }
        stock = deck;
        // Create a visual stock pile
        const stockGeo = new THREE.BoxGeometry(1.5, 2.2, 0.2);
        const stockMesh = new THREE.Mesh(stockGeo, new THREE.MeshStandardMaterial({color: 0x0088ff}));
        stockMesh.position.set(-8, 5, 0);
        stockMesh.name = 'stock';
        scene.add(stockMesh);
    }

    function renderCard(card, col, row) {
        const geo = new THREE.BoxGeometry(1.5, 2.2, 0.05);
        const mat = new THREE.MeshStandardMaterial({ color: card.isFaceUp ? 0xffffff : 0x0000ff });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(-6 + (col * 2), 2 - (row * 0.3), row * 0.01);
        mesh.userData.card = card;
        card.mesh = mesh;
        scene.add(mesh);
    }

    // --- 5. INTERACTION & RULES ---
    function handleMove(dragged, target) {
        // Logic: Opposite color and one rank lower (e.g., Red 6 on Black 7)
        if (!target && dragged.rank === 13) return true; // King on empty
        if (target && dragged.color !== target.color && target.rank === dragged.rank + 1) return true;
        return false;
    }

    function onPointerClick(e) {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(scene.children);

        if (hits.length > 0) {
            const obj = hits[0].object;
            if (obj.name === 'stock') {
                // Draw card logic
                moves++;
                document.getElementById('moves').innerText = moves;
            } else if (obj.userData.card) {
                const card = obj.userData.card;
                if (!selectedObject && card.isFaceUp) {
                    selectedObject = card;
                    card.mesh.material.emissive.setHex(0x333333); // Highlight
                } else if (selectedObject) {
                    if (handleMove(selectedObject, card)) {
                        // Move card animation and logic here
                        currentScore += 10;
                        document.getElementById('score').innerText = currentScore;
                    }
                    selectedObject.mesh.material.emissive.setHex(0x000000);
                    selectedObject = null;
                }
            }
        }
    }

    // --- 6. START ---
    initScene();
    dealGame();
    window.addEventListener('click', onPointerClick);
    
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
});
