// --- 1. SETTINGS & DATA ---
const suits = [
    { name: 'spades', symbol: '♠', color: 'black' },
    { name: 'hearts', symbol: '♥', color: 'red' },
    { name: 'clubs', symbol: '♣', color: 'black' },
    { name: 'diamonds', symbol: '♦', color: 'red' }
];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const rankMap = { 'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13 };
let deck = [];

// --- 2. DEFINE FUNCTIONS FIRST ---

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
    div.dataset.val = card.val;
    div.dataset.color = card.suit.color;

    if (isFaceUp) {
        div.draggable = true;
        div.id = 'card-' + Math.random().toString(36).substr(2, 9);
        div.innerHTML = `<div>${card.val}${card.suit.symbol}</div><div style="align-self: flex-end">${card.val}${card.suit.symbol}</div>`;
        
        div.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.id);
            e.target.classList.add('dragging');
        });
        div.addEventListener('dragend', (e) => e.target.classList.remove('dragging'));
    }
    return div;
}

function isMoveValid(draggedCard, targetSlot) {
    const lastCard = targetSlot.lastElementChild;
    if (!lastCard) return draggedCard.dataset.val === 'K';

    const dVal = rankMap[draggedCard.dataset.val];
    const tVal = rankMap[lastCard.dataset.val];
    return (draggedCard.dataset.color !== lastCard.dataset.color) && (dVal === tVal - 1);
}

// --- 3. DEFINE INITGAME ---
function initGame() {
    console.log("Initializing Game...");
    createDeck();
    shuffleDeck();

    document.querySelectorAll('.slot').forEach(slot => {
        slot.addEventListener('dragover', (e) => e.preventDefault());
        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            const id = e.dataTransfer.getData('text/plain');
            const dragged = document.getElementById(id);
            const targetSlot = e.target.closest('.slot');

            if (dragged && targetSlot && isMoveValid(dragged, targetSlot)) {
                targetSlot.appendChild(dragged);
            }
        });
    });

    for (let i = 1; i <= 7; i++) {
        const col = document.getElementById('c' + i);
        if (col) {
            for (let j = 0; j < i; j++) {
                const isLast = (j === i - 1);
                col.appendChild(renderCard(deck.pop(), isLast));
            }
        }
    }
}

// --- 4. CALL INITGAME AT THE VERY END ---
window.onload = initGame;
