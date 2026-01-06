(function() {
    // --- HELPER FUNCTIONS ---
    // Defined inside the scope so the game logic can access them
    function getHighScore(gameKey) {
        const savedScore = localStorage.getItem(gameKey);
        return savedScore ? parseInt(savedScore) : 0;
    }

    function saveHighScore(gameKey, score) {
        const currentHigh = getHighScore(gameKey);
        if (score > currentHigh) {
            localStorage.setItem(gameKey, score);
        }
    }

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    scene.background = new THREE.Color(0x0a0a0a);
    camera.position.z = 10;

    // ... [Rest of your lighting, spaceship, and asteroid logic] ...

    // --- GAME STATE ---
    let score = 0;
    let gameIsOver = false;
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('high-score');
    const gameOverScreen = document.getElementById('game-over-screen');
    const finalScoreElement = document.getElementById('final-score');
    const restartButton = document.getElementById('restart-button');

    // This will now work because getHighScore is defined above
    if (highScoreElement) {
        highScoreElement.textContent = getHighScore('asteroid-field');
    }

    // ... [Rest of your animate and collision logic] ...

    // --- TESTING HOOK ---
    window.triggerGameOverForTesting = () => {
        gameIsOver = true;
        if (finalScoreElement) finalScoreElement.textContent = score;
        if (highScoreElement) highScoreElement.textContent = getHighScore('asteroid-field');
        if (gameOverScreen) gameOverScreen.style.display = 'flex';
    };

    animate();
})();
