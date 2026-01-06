document.addEventListener('DOMContentLoaded', () => {
    // --- 1. GAME STATE & 3D VARIABLES ---
    let scene, camera, renderer, raycaster = new THREE.Raycaster(), mouse = new THREE.Vector2();
    let moves = 0, currentScore = 0, selectedObject = null;
    const textureLoader = new THREE.TextureLoader();

    // --- 2. ASSET LOADING ---
    // Load board textures
    const boardBase = textureLoader.load('textures/brushed_aluminum.jpg');
    const boardNormal = textureLoader.load('textures/brushed_aluminum_norm.jpg');
    const boardSpec = textureLoader.load('textures/brushed_aluminum_spec.jpg');
    const boardAO = textureLoader.load('textures/brushed_aluminum_ao.jpg');

    // Load card spritesheet
    const cardFaces = textureLoader.load('textures/card_spritesheet.png');
    cardFaces.repeat.set(1/13, 1/4); // 13 ranks, 4 suits

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

        // Lights
        scene.add(new THREE.AmbientLight(0xffffff, 0.5));
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        // Metallic game board
        const boardMaterial = new THREE.MeshStandardMaterial({
            map: boardBase,
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
