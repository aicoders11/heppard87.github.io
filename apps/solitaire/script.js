document.addEventListener('DOMContentLoaded', () => {
    // --- 1. GAME STATE & 3D VARIABLES ---
    let scene, camera, renderer, raycaster = new THREE.Raycaster(), mouse = new THREE.Vector2();
    let moves = 0, currentScore = 0, selectedObject = null;
    
    // --- 2. MENU LOGIC ---
    const toggleBtn = document.getElementById('toggle-menu');
    const menuContent = document.getElementById('menu-content');
    const gameUI = document.getElementById('game-ui');

    toggleBtn.addEventListener('click', () => {
        const isHidden = menuContent.classList.toggle('hidden');
        gameUI.classList.toggle('collapsed');
        toggleBtn.textContent = isHidden ? 'Show Menu' : 'Collapse Menu';
    });

    // --- 3. 3D ENGINE INITIALIZATION (Simplified) ---
    function initScene() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('game-container').appendChild(renderer.domElement);
        camera.position.z = 5;
    }

    // --- 4. RULES & INTERACTION ---
    function handleMove(dragged, target) {
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
                moves++;
                document.getElementById('moves').innerText = moves;
            } else if (obj.userData.card) {
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

    // --- 5. START ---
    initScene();
    window.addEventListener('click', onPointerClick);
    
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
});                        document.getElementById('score').innerText = currentScore;
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
const toggleBtn = document.getElementById('toggle-menu');
const menuContent = document.getElementById('menu-content');
const gameUI = document.getElementById('game-ui');

toggleBtn.addEventListener('click', () => {
    const isHidden = menuContent.classList.toggle('hidden');
    gameUI.classList.toggle('collapsed');
    
    // Change button text based on state
    toggleBtn.textContent = isHidden ? 'Show Menu' : 'Collapse Menu';
});
