// --- CORE GAME ENGINE ---
document.addEventListener('DOMContentLoaded', () => {
    let scene, camera, renderer;
    let deck = [], tableau = [[],[],[],[],[],[],[]], stock = [], waste = [], foundations = [[],[],[],[]];
    let selectedObject = null;
    let currentScore = 0;

    // 1. CREATE DATA-DRIVEN DECK
    function createDeck() {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        let newDeck = [];
        suits.forEach(suit => {
            const color = (suit === 'hearts' || suit === 'diamonds') ? 'red' : 'black';
            values.forEach((val, index) => {
                newDeck.push({ suit: suit, value: val, rank: index + 1, color: color, isFaceUp: false });
            });
        });
        return newDeck;
    }

    // 2. SHUFFLE LOGIC
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[array.length - 1]] = [array[array.length - 1], array[i]];
        }
        return array;
    }

    // 3. INTERACTION HANDLERS (Independent Functions)
    function handleCardClick(cardData) {
        if (!selectedObject) {
            if (cardData.isFaceUp) {
                selectedObject = cardData;
                console.log("Picked up:", cardData.value, "of", cardData.suit);
            }
        } else {
            if (isValidMove(selectedObject, cardData)) {
                executeMove(selectedObject, cardData);
            }
            selectedObject = null;
        }
    }

    function isValidMove(dragged, target) {
        if (!target) return dragged.rank === 13; // King on empty space
        return (dragged.color !== target.color) && (target.rank === dragged.rank + 1);
    }

    function executeMove(card, destination) {
        console.log("Moving card...");
        // Logic to update arrays and 3D positions goes here
        updateScore(10);
    }

    function updateScore(points) {
        currentScore += points;
        const scoreElement = document.getElementById('score');
        if (scoreElement) scoreElement.innerText = currentScore;
    }

    // 4. INITIALIZE
    function init() {
        // Build your Three.js scene here as you have been doing
        deck = shuffle(createDeck());
        // dealCards() logic would follow to place them in the 7 columns
    }

    init();
});    function addCardToScene(card, col, row) {
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
