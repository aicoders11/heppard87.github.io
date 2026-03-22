document.addEventListener('DOMContentLoaded', () => {
    const gameGrid = document.querySelector('.game-grid');
    const symbols = ['★', '♦', '♥', '♠', '♣', '♦', '♥', '♠', '♣', '★', '⚓', '⚡', '⚓', '⚡', '☯', '☯'];
    let flippedCards = [];
    let matchedPairs = 0;
    let lockBoard = false;

    function shuffle(array) {
        array.sort(() => Math.random() - 0.5);
    }

    function createBoard() {
        shuffle(symbols);
        gameGrid.innerHTML = ''; // Clear previous board
        symbols.forEach(symbol => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.symbol = symbol;

            const frontFace = document.createElement('div');
            frontFace.classList.add('front-face');
            frontFace.textContent = symbol;

            const backFace = document.createElement('div');
            backFace.classList.add('back-face');
            backFace.textContent = '?';

            card.appendChild(frontFace);
            card.appendChild(backFace);
            gameGrid.appendChild(card);

            card.addEventListener('click', flipCard);
        });
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === flippedCards[0]) return;

        this.classList.add('flip');

        if (flippedCards.length === 0) {
            flippedCards.push(this);
            return;
        }

        flippedCards.push(this);
        checkForMatch();
    }

    function checkForMatch() {
        const [cardOne, cardTwo] = flippedCards;
        const isMatch = cardOne.dataset.symbol === cardTwo.dataset.symbol;

        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        flippedCards.forEach(card => card.removeEventListener('click', flipCard));
        matchedPairs++;
        resetBoard();
        if (matchedPairs === symbols.length / 2) {
            setTimeout(() => {
                alert('You won! Congratulations!');
                // Reset game or show a final message
            }, 500);
        }
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            flippedCards.forEach(card => card.classList.remove('flip'));
            resetBoard();
        }, 1200);
    }

    function resetBoard() {
        [flippedCards, lockBoard] = [[], false];
    }
    
    // Initial board creation
    createBoard();
});