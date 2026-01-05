
// 1. SETUP
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Starfield Background
const starGeo = new THREE.BufferGeometry();
const starCount = 5000;
const starPos = new Float32Array(starCount * 3);
for(let i=0; i<starCount*3; i++) starPos[i] = (Math.random() - 0.5) * 2000;
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const starMat = new THREE.PointsMaterial({color: 0xffffff, size: 0.5});
const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

// 2. PLAYER SHIP (A cool triangular fighter)
const ship = new THREE.Group();
const bodyGeo = new THREE.ConeGeometry(0.5, 2, 4);
const bodyMat = new THREE.MeshBasicMaterial({ color: 0x00f5d4, wireframe: true });
const body = new THREE.Mesh(bodyGeo, bodyMat);
body.rotation.x = Math.PI / 2; // Point forward
body.rotation.y = Math.PI / 4; // Rotate so flat side is down
ship.add(body);

// Engine Glow
const engineGeo = new THREE.SphereGeometry(0.3, 8, 8);
const engineMat = new THREE.MeshBasicMaterial({ color: 0xff0055 });
const engine = new THREE.Mesh(engineGeo, engineMat);
engine.position.z = 1;
ship.add(engine);

scene.add(ship);
ship.position.z = 10; // Start closer to camera

// 3. ASTEROIDS
const asteroids = [];
const asteroidGeo = new THREE.DodecahedronGeometry(1, 0); // Low poly rock
const asteroidMat = new THREE.MeshBasicMaterial({ color: 0x888888, wireframe: true });

function spawnAsteroid() {
    const rock = new THREE.Mesh(asteroidGeo, asteroidMat);
    // Spawn far away in random XY spot
    rock.position.set( (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 30, -100 );
    scene.add(rock);
    asteroids.push(rock);
}

// 4. GAME LOGIC
let score = 0;
let health = 100;
let speed = 0.5;
let gameActive = true;

// Input Handling
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
    // Convert mouse pos to -1 to +1 range
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
    if (!gameActive) return;
    requestAnimationFrame(animate);

    // Move Ship based on mouse
    ship.position.x += (mouseX * 15 - ship.position.x) * 0.1;
    ship.position.y += (mouseY * 10 - ship.position.y) * 0.1;
    
    // Tilt ship when moving
    ship.rotation.z = -ship.position.x * 0.05; 
    ship.rotation.x = ship.position.y * 0.05;

    // Spawn Asteroids randomly
    if (Math.random() < 0.05) spawnAsteroid();

    // Move & Check Asteroids
    for (let i = asteroids.length - 1; i >= 0; i--) {
        const rock = asteroids[i];
        rock.position.z += speed; // Move towards camera
        rock.rotation.x += 0.01;
        rock.rotation.y += 0.02;

        // Collision Check (Simple distance check)
        if (rock.position.distanceTo(ship.position) < 1.5) {
            health -= 20;
            document.getElementById('health').innerText = health + '%';
            scene.remove(rock);
            asteroids.splice(i, 1);
            
            // Flash screen red
            document.body.style.background = '#330000';
            setTimeout(() => document.body.style.background = '#000', 100);

            if (health <= 0) gameOver();
        }

        // Remove if passed camera
        if (rock.position.z > 15) {
            scene.remove(rock);
            asteroids.splice(i, 1);
            score += 10;
            document.getElementById('score').innerText = score;
            speed += 0.001; // Get harder over time
        }
    }

    renderer.render(scene, camera);
}

function gameOver() {
    gameActive = false;
    document.getElementById('game-over').style.display = 'block';
}

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
