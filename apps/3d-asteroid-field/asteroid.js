(function() {
    // --- 1. HELPER FUNCTIONS ---
    // These handle the high score saving/loading
    function getHighScore(gameKey) {
        try {
            const savedScore = localStorage.getItem(gameKey);
            return savedScore ? parseInt(savedScore) : 0;
        } catch (e) {
            return 0; 
        }
    }

    function saveHighScore(gameKey, score) {
        try {
            const currentHigh = getHighScore(gameKey);
            if (score > currentHigh) {
                localStorage.setItem(gameKey, score);
            }
        } catch (e) {
            console.error("Storage error:", e);
        }
    }

    // --- 2. SCENE SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    scene.background = new THREE.Color(0x0a0a0a);
    camera.position.z = 10;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, 0, 50);
    scene.add(pointLight);

    // Player spaceship
    const spaceshipGeometry = new THREE.ConeGeometry(0.5, 1, 8);
    const spaceshipMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const spaceship = new THREE.Mesh(spaceshipGeometry, spaceshipMaterial);
    spaceship.rotation.x = Math.PI / 2;
    scene.add(spaceship);

    // Player movement
    const mouse = new THREE.Vector2();
    document.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Lasers
    const lasers = [];
    const laserMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    document.addEventListener('click', () => {
        if (!gameIsOver) {
            const laserGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
            const laser = new THREE.Mesh(laserGeometry, laserMaterial);
            laser.position.set(spaceship.position.x, spaceship.position.y, spaceship.position.z);
            laser.rotation.x = Math.PI / 2;
            lasers.push(laser);
            scene.add(laser);
        }
    });

    // Asteroids
    const asteroids = [];
    const asteroidMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });

    function createAsteroid() {
        const asteroidGeometry = new THREE.IcosahedronGeometry(Math.random() * 2 + 0.5, 0);
        const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
        asteroid.position.x = (Math.random() - 0.5) * 50;
        asteroid.position.y = (Math.random() - 0.5) * 50;
        asteroid.position.z = -100;
        asteroids.push(asteroid);
        scene.add(asteroid);
    }

    // --- 3. GAME STATE ---
    let score = 0;
    let gameIsOver = false;
    
    // Get HTML elements safely
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('high-score');
    const gameOverScreen = document.getElementById('game-over-screen');
    const finalScoreElement = document.getElementById('final-score');
    const restartButton = document.getElementById('restart-button');

    // Display initial high score
    if (highScoreElement) {
        highScoreElement.textContent = getHighScore('asteroid-field');
    }

    if (restartButton) {
        restartButton.addEventListener('click', () => {
            resetGame();
        });
    }

    function resetGame() {
        score = 0;
        if (scoreElement) scoreElement.textContent = score;
        gameIsOver = false;
        if (gameOverScreen) gameOverScreen.style.display = 'none';

        // Clear existing objects
        asteroids.forEach(a => scene.remove(a));
        asteroids.length = 0;
        lasers.forEach(l => scene.remove(l));
        lasers.length = 0;

        spaceship.position.set(0, 0, 0);
        
        // Restart the loop
        animate(); 
    }

    // --- 4. THE ANIMATION LOOP (This was likely missing) ---
    function animate() {
        if (gameIsOver) return;

        requestAnimationFrame(animate);

        // Move spaceship
        spaceship.position.x += (mouse.x * 10 - spaceship.position.x) * 0.1;
        spaceship.position.y += (mouse.y * 10 - spaceship.position.y) * 0.1;

        // Move/Cleanup Lasers
        for (let i = lasers.length - 1; i >= 0; i--) {
            const laser = lasers[i];
            laser.position.z -= 1;
            if (laser.position.z < -100) {
                scene.remove(laser);
                lasers.splice(i, 1);
            }
        }

        // Spawn Asteroids
        if (Math.random() < 0.1) {
            createAsteroid();
        }

        // Move/Collision Asteroids
        for (let i = asteroids.length - 1; i >= 0; i--) {
            const asteroid = asteroids[i];
            asteroid.position.z += 0.5;

            // Laser Collision
            for (let j = lasers.length - 1; j >= 0; j--) {
                const laser = lasers[j];
                if (laser.position.distanceTo(asteroid.position) < 2) {
                    scene.remove(asteroid);
                    asteroids.splice(i, 1);
                    scene.remove(laser);
                    lasers.splice(j, 1);
                    score += 10;
                    if (scoreElement) scoreElement.textContent = score;
                    break; 
                }
            }

            // Player Collision
            if (asteroid && asteroid.position.distanceTo(spaceship.position) < 1) {
                gameIsOver = true;
                saveHighScore('asteroid-field', score);
                if (finalScoreElement) finalScoreElement.textContent = score;
                if (highScoreElement) highScoreElement.textContent = getHighScore('asteroid-field');
                if (gameOverScreen) gameOverScreen.style.display = 'flex';
            }

            // Cleanup old asteroids
            if (asteroid && asteroid.position.z > 20) {
                scene.remove(asteroid);
                asteroids.splice(i, 1);
            }
        }

        renderer.render(scene, camera);
    }

    // --- 5. START THE GAME ---
    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Testing hook
    window.triggerGameOverForTesting = () => {
        gameIsOver = true;
        if (finalScoreElement) finalScoreElement.textContent = score;
        if (highScoreElement) highScoreElement.textContent = getHighScore('asteroid-field');
        if (gameOverScreen) gameOverScreen.style.display = 'flex';
    };

})();
