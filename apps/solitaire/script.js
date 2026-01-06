const suits = [
    { name: 'spades', symbol: '♠', color: 'black' },
    { name: 'hearts', symbol: '♥', color: 'red' },
    { name: 'clubs', symbol: '♣', color: 'black' },
    { name: 'diamonds', symbol: '♦', color: 'red' }
];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
let deck = [];

function createDeck() {
    deck = [];
    suits.forEach(suit => {
        values.forEach(val => {
            deck.push({ suit, val });
        });
    });
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function renderCard(card, isFaceUp = true) {
    const div = document.createElement('div');
    div.className = `card ${card.suit.color} ${isFaceUp ? '' : 'back'}`;
    
    if (isFaceUp) {
        div.draggable = true; // Make the card draggable
        div.id = `card-${Math.random().toString(36).substr(2, 9)}`; // Unique ID for tracking
        div.innerHTML = `<div>${card.val}${card.suit.symbol}</div><div style="align-self: flex-end">${card.val}${card.suit.symbol}</div>`;
        
        // Handle start of drag
        div.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.id);
            e.target.classList.add('dragging');
        });

        div.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });
    }
    return div;
}

window.onload = initGame;
