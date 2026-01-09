const cards = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let time = 0;
let timer;

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function initGame() {
    const grid = document.querySelector('.memory-grid');
    grid.innerHTML = '';
    shuffle(cards).forEach(val => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = val;
        card.innerText = '?';
        card.addEventListener('click', flipCard);
        grid.appendChild(card);
    });
}

function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        if (moves === 0 && time === 0) startTimer();
        this.classList.add('flipped');
        this.innerText = this.dataset.value;
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            moves++;
            document.getElementById('moves').innerText = `Moves: ${moves}`;
            checkMatch();
        }
    }
}

function checkMatch() {
    const [c1, c2] = flippedCards;
    if (c1.dataset.value === c2.dataset.value) {
        matchedPairs++;
        flippedCards = [];
        if (matchedPairs === 8) endGame();
    } else {
        setTimeout(() => {
            c1.classList.remove('flipped');
            c2.classList.remove('flipped');
            c1.innerText = '?';
            c2.innerText = '?';
            flippedCards = [];
        }, 1000);
    }
}

function startTimer() {
    timer = setInterval(() => {
        time++;
        document.getElementById('timer').innerText = `Time: ${time}`;
    }, 1000);
}

function endGame() {
    clearInterval(timer);
    alert(`System Overridden! Moves: ${moves}, Time: ${time}s`);
}

initGame();
