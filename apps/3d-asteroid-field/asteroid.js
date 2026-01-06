(function() {
    // --- 1. SETTINGS & HELPERS ---
    let gameSpeed = 0.5;
    let spawnRate = 0.05;
    let score = 0;
    let gameIsOver = false;

    function getHighScore(k) { return parseInt(localStorage.getItem(k) || '0'); }
    function saveHighScore(k, s) { if(s > getHighScore(k)) localStorage.setItem(k, s); }

    // --- 2. SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050508); // Deep space blue
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Starfield Background
    const starGeo = new THREE.BufferGeometry();
    const starCoords = [];
    for(let i=0; i<5000; i++) {
        starCoords.push((Math.random()-0.5)*400, (Math.random()-0.5)*400, (Math.random()-0.5)*400);
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starCoords, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({color: 0x888888, size: 0.1}));
    scene.add(stars);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const pLight = new THREE.PointLight(0x00ff00, 1, 100);
    pLight.position.set(0, 5, 10);
    scene.add(pLight);

    // Player
    const spaceship = new THREE.Mesh(
        new THREE.ConeGeometry(0.4, 1.2, 3), 
        new THREE.MeshPhongMaterial({color: 0x00ff00, emissive: 0x003300})
    );
    spaceship.rotation.x = Math.PI / 2;
    scene.add(spaceship);

    // Arrays
    const lasers = [];
    const asteroids = [];
    const particles = [];

    // UI Elements
    const elScore = document.getElementById('score');
    const elHigh = document.getElementById('high-score');
    const elOver = document.getElementById('game-over-screen');
    const elFinal = document.getElementById('final-score');
    const btnRestart = document.getElementById('restart-button');

    if(elHigh) elHigh.textContent = getHighScore('asteroid-field');
    if(btnRestart) btnRestart.addEventListener('click', resetGame);

    // Input
    const mouse = new THREE.Vector2();
    document.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    document.addEventListener('click', () => {
        if(gameIsOver) return;
        const l = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
        l.position.copy(spaceship.position);
        l.rotation.x = Math.PI / 2;
        lasers.push(l);
        scene.add(l);
    });

    // --- 3. CORE LOGIC ---
    function createAsteroid() {
        const size = Math.random() * 1.5 + 0.5;
        const a = new THREE.Mesh(
            new THREE.IcosahedronGeometry(size, 0), 
            new THREE.MeshStandardMaterial({color: 0xcccccc, wireframe: true})
        );
        a.position.set((Math.random()-0.5)*40, (Math.random()-0.5)*40, -150);
        // Random rotation speed
        a.userData = { rot: new THREE.Vector3(Math.random()*0.02, Math.random()*0.02, Math.random()*0.02) };
        asteroids.push(a);
        scene.add(a);
    }

    function createExplosion(pos) {
    for(let i=0; i<10; i++) {
        const p = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.2, 0.2), 
            new THREE.MeshBasicMaterial({color: 0xffaa00})
        );
        p.position.copy(pos);
        p.userData = { 
            vel: new THREE.Vector3((Math.random()-0.5)*0.3, (Math.random()-0.5)*0.3, (Math.random()-0.5)*0.3) 
        };
        particles.push(p);
        scene.add(p);

        // CLEANUP: Using an arrow function safely
        setTimeout(() => {
            const index = particles.indexOf(p);
            if (index > -1) {
                scene.remove(p);
                particles.splice(index, 1);
            }
        }, 1000);
    }
}
    function resetGame() {
        score = 0; gameSpeed = 0.5; spawnRate = 0.05; gameIsOver = false;
        if(elScore) elScore.textContent = '0';
        if(elOver) elOver.style.display = 'none';
        asteroids.forEach(a => scene.remove(a)); asteroids.length = 0;
        lasers.forEach(l => scene.remove(l)); lasers.length = 0;
        spaceship.position.set(0,0,0);
        animate();
    }

    function animate() {
        if(gameIsOver) return;
        requestAnimationFrame(animate);

        // Move Ship
        spaceship.position.x += (mouse.x * 12 - spaceship.position.x) * 0.1;
        spaceship.position.y += (mouse.y * 12 - spaceship.position.y) * 0.1;
        spaceship.rotation.z = -mouse.x * 0.5; // Visual tilt

        // Difficulty Curve
        gameSpeed += 0.0001; 
        spawnRate = Math.min(0.2, 0.05 + (score / 2000));

        // Background movement
        stars.rotation.z += 0.001;

        // Spawn
        if(Math.random() < spawnRate) createAsteroid();

        // Particles
        particles.forEach(p => p.position.add(p.userData.vel));

        // Lasers
        for(let i=lasers.length-1; i>=0; i--) {
            lasers[i].position.z -= 1.5;
            if(lasers[i].position.z < -150) { scene.remove(lasers[i]); lasers.splice(i,1); }
        }

        // Asteroids
        for(let i=asteroids.length-1; i>=0; i--) {
            const a = asteroids[i];
            a.position.z += gameSpeed;
            a.rotation.x += a.userData.rot.x;
            a.rotation.y += a.userData.rot.y;

            // Laser Hit
            for(let j=lasers.length-1; j>=0; j--) {
                if(lasers[j].position.distanceTo(a.position) < 2.5) {
                    createExplosion(a.position);
                    scene.remove(a); asteroids.splice(i,1);
                    scene.remove(lasers[j]); lasers.splice(j,1);
                    score += 10;
                    if(elScore) elScore.textContent = score;
                    break;
                }
            }

            // Player Collision
            if(a && a.position.distanceTo(spaceship.position) < 1.2) {
                gameIsOver = true;
                saveHighScore('asteroid-field', score);
                if(elFinal) elFinal.textContent = score;
                if(elHigh) elHigh.textContent = getHighScore('asteroid-field');
                if(elOver) elOver.style.display = 'flex';
            }

            if(a && a.position.z > 20) { scene.remove(a); asteroids.splice(i,1); }
        }

        renderer.render(scene, camera);
    }

    // --- 4. START ---
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
})();
