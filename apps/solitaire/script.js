document.addEventListener('DOMContentLoaded', () => {
    // --- 1. GAME STATE & 3D VARIABLES ---
    let scene, camera, renderer, raycaster = new THREE.Raycaster(), mouse = new THREE.Vector2();
    let deck = [], tableau = [[],[],[],[],[],[],[]], foundations = [[],[],[],        card.mesh = mesh;
        scene.add(mesh);
    }

    // --- 5. INTERACTION & RULES ---
    function handleMove(dragged, target) {
        // Logic: Opposite color and one rank lower (e.g., Red 6 on Black 7)
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
                // Draw card logic
                moves++;
                document.getElementById('moves').innerText = moves;
            } else if (obj.userData.card) {
                const card = obj.userData.card;
                if (!selectedObject && card.isFaceUp) {
                    selectedObject = card;
                    card.mesh.material.emissive.setHex(0x333333); // Highlight
                } else if (selectedObject) {
                    if (handleMove(selectedObject, card)) {
                        // Move card animation and logic here
                        currentScore += 10;
                        document.getElementById('score').innerText = currentScore;
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
