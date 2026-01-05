// Solitaire 3D - Integrated Logic Version
document.addEventListener('DOMContentLoaded', () => {
    let scene, camera, renderer, deck, tableau, foundations, stock, waste;

    // --- 1. THE DATA GENERATOR ---
    function createDeck() {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        let newDeck = [];

        suits.forEach(suit => {
            const color = (suit === 'hearts' || suit === 'diamonds') ? 'red' : 'black';
            values.forEach((value, index) => {
                newDeck.push({
                    suit: suit,
                    value: value,
                    rankValue: index + 1,
                    color: color,
                    isFaceUp: false,
                    mesh: null // To be linked to Three.js Mesh
                });
            });
        });
        return newDeck;
    }

    // --- 2. THE SHUFFLE ENGINE ---
    function shuffleDeck(cards) {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        return cards;
    }

    // --- 3. THE 3D PLACEMENT ---
    function addCardToScene(card, col, row) {
        // This links the data object to the visible card on your screen
        const xPos = -6 + (col * 2);
        const yPos = 2 - (row * 0.2);
        const zPos = row * 0.01; // Tiny lift so they stack in 3D

        // Create the card geometry (Matches your screen dimensions)
        const geometry = new THREE.BoxGeometry(1.5, 2.2, 0.05);
        const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(xPos, yPos, zPos);
        if (card.isFaceUp) mesh.rotation.y = Math.PI; // Flip it face up
        
        card.mesh = mesh;
        scene.add(mesh);
    }

    // --- 4. THE DEALER ---
    function dealCards() {
        tableau = [[], [], [], [], [], [], []];
        for (let i = 0; i < 7; i++) {
            for (let j = i; j < 7; j++) {
                let card = deck.pop();
                if (i === j) card.isFaceUp = true;
                tableau[j].push(card);
                addCardToScene(card, j, i);
            }
        }
        stock = deck; // Remaining cards go to the pile
    }

    // --- START ENGINE ---
    function initGame() {
        // Clear old scene
        while(scene.children.length > 0){ scene.remove(scene.children[0]); }
        
        const rawDeck = createDeck();
        deck = shuffleDeck(rawDeck);
        dealCards();
        console.log("Game Dealt Successfully");
    }

    // Standard Three.js init calls here...
    initGame();
});
