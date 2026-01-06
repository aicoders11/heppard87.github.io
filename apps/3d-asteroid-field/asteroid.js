(function() {
    // --- 1. SETUP & HELPERS ---
    function getHighScore(k) { return parseInt(localStorage.getItem(k) || '0'); }
    function saveHighScore(k, s) { if(s > getHighScore(k)) localStorage.setItem(k, s); }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.z = 10;
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const pLight = new THREE.PointLight(0xffffff, 1);
    pLight.position.set(0,0,50);
    scene.add(pLight);

    const spaceship = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1, 8), new THREE.MeshPhongMaterial({color: 0x00ff00}));
    spaceship.rotation.x = Math.PI/2;
    scene.add(spaceship);

    const mouse = new THREE.Vector2();
    document.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX/window.innerWidth)*2-1;
        mouse.y = -(e.clientY/window.innerHeight)*2+1;
    });

    // --- 2. GAME VARIABLES ---
    let score = 0;
    let gameIsOver = false;
    const lasers = [];
    const asteroids = [];
    const laserMat = new THREE.MeshBasicMaterial({color: 0xff0000});
    const astMat = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});

    // HTML Elements
    const elScore = document.getElementById('score');
    const elHigh = document.getElementById('high-score');
    const elOver = document.getElementById('game-over-screen');
    const elFinal = document.getElementById('final-score');
    const btnRestart = document.getElementById('restart-button');

    if(elHigh) elHigh.textContent = getHighScore('asteroid-field');
    if(btnRestart) btnRestart.addEventListener('click', resetGame);

    document.addEventListener('click', () => {
        if(!gameIsOver) {
            const l = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1, 8), laserMat);
            l.position.set(spaceship.position.x, spaceship.position.y, spaceship.position.z);
            l.rotation.x = Math.PI/2;
            lasers.push(l);
            scene.add(l);
        }
    });

    function createAsteroid() {
        const a = new THREE.Mesh(new THREE.IcosahedronGeometry(Math.random()*2+0.5, 0), astMat);
        a.position.set((Math.random()-0.5)*50, (Math.random()-0.5)*50, -100);
        asteroids.push(a);
        scene.add(a);
    }

    function resetGame() {
        score = 0;
        gameIsOver = false;
        if(elScore) elScore.textContent = '0';
        if(elOver) elOver.style.display = 'none';
        
        asteroids.forEach(a => scene.remove(a));
        asteroids.length = 0;
        lasers.forEach(l => scene.remove(l));
        lasers.length = 0;
        spaceship.position.set(0,0,0);
        
        animate();
    }

    // --- 3. THE MISSING ANIMATION LOOP ---
    function animate() {
        if(gameIsOver) return;
        requestAnimationFrame(animate);

        // Move Player
        spaceship.position.x += (mouse.x*10 - spaceship.position.x)*0.1;
        spaceship.position.y += (mouse.y*10 - spaceship.position.y)*0.1;

        // Manage Lasers
        for(let i=lasers.length-1; i>=0; i--) {
            lasers[i].position.z -= 1;
            if(lasers[i].position.z < -100) {
                scene.remove(lasers[i]);
                lasers.splice(i,1);
            }
        }

        // Manage Asteroids
        if(Math.random() < 0.1) createAsteroid();

        for(let i=asteroids.length-1; i>=0; i--) {
            const a = asteroids[i];
            a.position.z += 0.5;

            // Hit by Laser
            for(let j=lasers.length-1; j>=0; j--) {
                if(lasers[j].position.distanceTo(a.position) < 2) {
                    scene.remove(a); asteroids.splice(i,1);
                    scene.remove(lasers[j]); lasers.splice(j,1);
                    score += 10;
                    if(elScore) elScore.textContent = score;
                    break;
                }
            }

            // Hit Player
            if(a && a.position.distanceTo(spaceship.position) < 1) {
                gameIsOver = true;
                saveHighScore('asteroid-field', score);
                if(elFinal) elFinal.textContent = score;
                if(elHigh) elHigh.textContent = getHighScore('asteroid-field');
                if(elOver) elOver.style.display = 'flex';
            }

            if(a && a.position.z > 20) {
                scene.remove(a);
                asteroids.splice(i,1);
            }
        }
        renderer.render(scene, camera);
    }

    // --- 4. START ---
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.triggerGameOverForTesting = () => {
        gameIsOver = true;
        if(elOver) elOver.style.display = 'flex';
    };
})();
