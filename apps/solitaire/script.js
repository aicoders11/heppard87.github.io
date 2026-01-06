<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Solitaire Pro</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.min.js"></script>
</head>
<body>
    <div id="game-container"></div>

    <div id="game-ui">
        <button id="toggle-menu">COLLAPSE MENU</button>
        <div id="menu-content">
            <h1>3D SOLITAIRE</h1>
            <div class="controls">
                <button id="new-game">NEW GAME</button>
                <button id="undo-move">UNDO MOVE</button>
            </div>
            <div class="stats">
                <div class="stat-item">MOVES: <span id="moves">0</span></div>
                <div class="stat-item">SCORE: <span id="score">0</span></div>
            </div>
        </div>
    </div>

    <footer class="copyright-box">
        <p>© 2024 Chris Heppard. All rights reserved.</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>        scene.add(board);

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // --- 5. CORE GAME LOGIC ---
    function createCardMesh(suit, rank, isFaceUp = false) {
        const geometry = new THREE.BoxGeometry(1, 0.02, 1.4);
        
        // Face Texture Logic
        const faceTex = cardFaces.clone();
        faceTex.needsUpdate = true;
        faceTex.offset.x = rank / 13;
        faceTex.offset.y = (3 - suit) / 4;

        const materials = [
            new THREE.MeshStandardMaterial({ color: 0xffffff }), // Sides
            new THREE.MeshStandardMaterial({ color: 0xffffff }),
            new THREE.MeshStandardMaterial({ color: 0xffffff }),
            new THREE.MeshStandardMaterial({ color: 0xffffff }),
            new THREE.MeshStandardMaterial({ map: faceTex }),    // Face
            new THREE.MeshStandardMaterial({ color: 0x1a1a2e })   // Back
        ];

        const mesh = new THREE.Mesh(geometry, materials);
        mesh.castShadow = true;
        if (!isFaceUp) mesh.rotation.z = Math.PI; // Facedown
        
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
        // Clear scene cards
        scene.children = scene.children.filter(obj => !obj.userData.rank && obj.userData.rank !== 0);
        
        // Create and shuffle deck
        let newDeck = [];
        for(let s=0; s<4; s++) for(let r=0; r<13; r++) newDeck.push({s, r});
        shuffle(newDeck);

        let ptr = 0;
        // Deal Tableau
        for(let i=0; i<7; i++) {
            for(let j=0; j<=i; j++) {
                const data = newDeck[ptr++];
                const up = (j === i);
                const mesh = createCardMesh(data.s, data.r, up);
                mesh.position.set(-4.5 + (i * 1.5), 0.05 + (j * 0.02), -2 + (j * 0.3));
                scene.add(mesh);
            }
        }
        moves = 0; score = 0;
        document.getElementById('moves').innerText = '0';
        document.getElementById('score').innerText = '0';
    }

    // --- 6. START ---
    initScene();
    startNewGame();
    
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();

    document.getElementById('new-game').addEventListener('click', startNewGame);
});
