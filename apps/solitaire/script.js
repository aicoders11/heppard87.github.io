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
        div.innerHTML = `<div>${card.val}${card.suit.symbol}</div><div style="align-self: flex-end">${card.val}${card.suit.symbol}</div>`;
    }
    return div;
}

function initGame() {
    createDeck();
    shuffleDeck();
    
    // Deal 1 card to each column as a demo
    for (let i = 1; i <= 7; i++) {
        const col = document.getElementById(`c${i}`);
        const cardData = deck.pop();
        col.appendChild(renderCard(cardData, true));
    }
}

window.onload = initGame;
