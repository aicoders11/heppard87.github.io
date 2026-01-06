(function() {
    // 1. DEFINE HELPERS FIRST
    function getHighScore(gameKey) {
        try {
            const savedScore = localStorage.getItem(gameKey);
            return savedScore ? parseInt(savedScore) : 0;
        } catch (e) {
            return 0; // Fallback if localStorage is disabled
        }
    }

    function saveHighScore(gameKey, score) {
        try {
            const currentHigh = getHighScore(gameKey);
            if (score > currentHigh) {
                localStorage.setItem(gameKey, score);
            }
        } catch (e) {
            console.error("Could not save high score", e);
        }
    }

    // 2. SCENE SETUP
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // ... [rest of your Three.js setup code] ...

    // 3. GAME STATE
    let score = 0;
    let gameIsOver = false;
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('high-score');
    const gameOverScreen = document.getElementById('game-over-screen');
    const finalScoreElement = document.getElementById('final-score');
    const restartButton = document.getElementById('restart-button');

    // LINE 69: This will now work because the function is defined above!
    if (highScoreElement) {
        highScoreElement.textContent = getHighScore('asteroid-field');
    }

    // ... [rest of your game logic, animate function, etc.] ...

    // 4. TESTING HOOK (Line 177)
    window.triggerGameOverForTesting = () => {
        gameIsOver = true;
        if (finalScoreElement) finalScoreElement.textContent = score;
        if (highScoreElement) highScoreElement.textContent = getHighScore('asteroid-field');
        if (gameOverScreen) gameOverScreen.style.display = 'flex';
    };

    animate();
})();
