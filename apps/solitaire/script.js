document.addEventListener('DOMContentLoaded', () => {
    // --- 1. GAME STATE & 3D VARIABLES ---
    let scene, camera, renderer, raycaster = new THREE.Raycaster(), mouse = new THREE.Vector2();
    let moves = 0, currentScore = 0, selectedObject = null;
    const textureLoader = new THREE.TextureLoader();

    // --- 2. ASSET LOADING ---
    // Load board textures from your repository
    const boardBase = textureLoader.load('textures/brushed_aluminum.jpg');
    const boardNormal = textureLoader.load('textures/brushed_aluminum_norm.jpg');
    const boardSpec = textureLoader.load('textures/brushed_aluminum_spec.jpg');
    const boardAO = textureLoader.load('textures/brushed_aluminum_ao.jpg');
    
    // Load card spritesheet
    const cardFaces = textureLoader.load('textures/card_spritesheet.png');
    cardFaces.repeat.set(1/13, 1/4); // Set grid for 13 ranks and 4 suits

    // --- 3. MENU LOGIC ---
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

    // --- 4. 3D ENGINE INITIALIZATION ---
    function initScene() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('game-container').appendChild(renderer.domElement);

        // Lights for metallic reflections
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        // Create the metallic game board
        const boardGeometry = new THREE.PlaneGeometry(15, 15);
        const boardMaterial = new THREE.MeshStandardMaterial({
            map: boardBase,
            normalMap: boardNormal,
            specularMap: boardSpec,
            aoMap: boardAO,
            metalness: 0.8,
            roughness: 0.2
        });
        const gameBoard = new THREE.Mesh(boardGeometry, boardMaterial);
        gameBoard.rotation.x = -Math.PI / 2;
        scene.add(gameBoard);

        camera.position.set(0, 10, 10);
        camera.lookAt(0, 0, 0);
    }

    // --- 5. CARD UTILITIES ---
    function setCardFace(cardMesh, suitIndex, rankIndex) {
        // Offset the texture to show the correct card face from spritesheet
        cardMesh.material.map.offset.x = rankIndex / 13;
        cardMesh.material.map.offset.y = suitIndex / 4;
    }

    function handleMove(dragged, target) {
        if (!target && dragged.rank === 13) return true; 
        if (target && dragged.color !== target.color && target.rank === dragged.rank + 1) return true;
        return false;
    }

    // --- 6. INTERACTION ---
    function onPointerClick(e) {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        
        const hits = raycaster.intersectObjects(scene.children);
        if (hits.length > 0) {
            const obj = hits[0].object;
            if (obj.userData.card) {
                const card = obj.userData.card;
                if (!selectedObject && card.isFaceUp) {
                    selectedObject = card;
                    card.mesh.material.emissive.setHex(0x333333);
                } else if (selectedObject) {
                    if (handleMove(selectedObject, card)) {
                        currentScore += 10;
                        document.getElementById('score').innerText = currentScore;
                    }
                    selectedObject.mesh.material.emissive.setHex(0x000000);
                    selectedObject = null;
                }
            }
        }
    }

    // --- 7. START ---
    initScene();
    window.addEventListener('click', onPointerClick);
    
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
});
