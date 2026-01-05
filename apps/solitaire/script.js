// Solitaire 3D - Functional Version
document.addEventListener('DOMContentLoaded', () => {
    // --- CORE VARIABLES ---
    let scene, camera, renderer;
    let deck, tableau, foundations, stock, waste, moveHistory;
    let selectedObject = null;
    let currentScore = 0;

    // --- GAME INITIALIZATION ---
    function initGame() {
        // 1. Setup the 3D World
        setupScene();
        
        // 2. Initialize Game State
        tableau = [[], [], [], [], [], [], []];
        foundations = [[], [], [], []];
        stock = [];
        waste = [];
        moveHistory = [];
        
        // 3. Create and Shuffle Deck
        const freshDeck = createDeck();
        deck = shuffleDeck(freshDeck);
        
        // 4. Deal the Cards
        dealCards();
        
        // 5. Start Animation Loop
        animate();
    }

    // --- INTERACTION: DRAWING CARDS ---
    function handleStockClick() {
        if (stock.length === 0) {
            // Recycle waste back to stock
            stock = waste.reverse().map(card => {
                card.isFaceUp = false;
                return card;
            });
            waste = [];
        } else {
            // Draw a new card
            let card = stock.pop();
            card.isFaceUp = true;
            waste.push(card);
        }
        updateUI();
    }

    // --- INTERACTION: MOVING CARDS ---
    function handleCardClick(card) {
        if (!selectedObject) {
            // Pick up a card
            if (card.isFaceUp) {
                selectedObject = card;
                highlightCard(card, true);
            }
        } else {
            // Try to place the held card
            if (isValidMove(selectedObject, card)) {
                handleMove(selectedObject, card);
                selectedObject = null;
            } else {
                // Drop old card and pick up new one
                highlightCard(selectedObject, false);
                selectedObject = card.isFaceUp ? card : null;
                if (selectedObject) highlightCard(selectedObject, true);
            }
        }
    }

    // --- THE RULES (REFEREE) ---
    function isValidMove(dragged, target) {
        // If placing on an empty tableau spot, it must be a King
        if (!target) return dragged.rankValue === 13;
        
        // Standard Solitaire Rule: Opposite color and one rank lower
        const isOppositeColor = (dragged.color !== target.color);
        const isNextRank = (target.rankValue === dragged.rankValue + 1);
        
        return isOppositeColor && isNextRank;
    }

    // --- WIN CONDITION ---
    function checkVictory() {
        const totalInFoundations = foundations.reduce((sum, pile) => sum + pile.length, 0);
        if (totalInFoundations === 52) {
            alert("Congratulations! Mission Accomplished.");
        }
    }

    // --- START THE ENGINE ---
    initGame();
    window.addEventListener('click', onMouseClick);
});
