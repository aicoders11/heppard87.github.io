document.addEventListener('DOMContentLoaded', () => {
    const buttons = {
        green: document.getElementById('green'),
        red: document.getElementById('red'),
        blue: document.getElementById('blue'),
        yellow: document.getElementById('yellow')
    };
    const startButton = document.getElementById('start-btn');
    const statusDisplay = document.getElementById('status');
    const levelDisplay = document.getElementById('level');

    let sequence = [];
    let playerSequence = [];
    let level = 0;
    let gameInProgress = false;
    let awaitingPlayerInput = false;

    const sounds = {
        green: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
        red: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
        blue: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
        yellow: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'),
        error: new Audio('https://s3.amazonaws.com/adam-recvlohe-assets/G-major-6th-chord-on-piano.mp3') // A placeholder error sound
    };

    startButton.addEventListener('click', startGame);

    function startGame() {
        if (gameInProgress) return;
        gameInProgress = true;
        sequence = [];
        playerSequence = [];
        level = 0;
        statusDisplay.textContent = 'Watch the sequence!';
        startButton.textContent = 'Restart';
        nextLevel();
    }

    function nextLevel() {
        level++;
        levelDisplay.textContent = `Level: ${level}`;
        playerSequence = [];
        awaitingPlayerInput = false; // Disable player input until sequence is shown

        const colors = ['green', 'red', 'blue', 'yellow'];
        const nextColor = colors[Math.floor(Math.random() * colors.length)];
        sequence.push(nextColor);

        playSequence();
    }

    function playSequence() {
        let i = 0;
        const intervalId = setInterval(() => {
            if (i >= sequence.length) {
                clearInterval(intervalId);
                statusDisplay.textContent = 'Your turn!';
                awaitingPlayerInput = true; // Enable player input
                return;
            }
            lightUpButton(sequence[i]);
            i++;
        }, 800); // Time between button lights
    }

    function lightUpButton(color) {
        const button = buttons[color];
        button.classList.add('lit');
        sounds[color].play();
        setTimeout(() => {
            button.classList.remove('lit');
        }, 400); // How long the button stays lit
    }

    Object.keys(buttons).forEach(color => {
        buttons[color].addEventListener('click', () => {
            if (!gameInProgress || !awaitingPlayerInput) return;
            
            const clickedColor = buttons[color].id;
            playerSequence.push(clickedColor);
            lightUpButton(clickedColor); // Provide visual feedback

            checkPlayerInput();
        });
    });

    function checkPlayerInput() {
        const currentStep = playerSequence.length - 1;

        if (playerSequence[currentStep] !== sequence[currentStep]) {
            gameOver();
            return;
        }

        if (playerSequence.length === sequence.length) {
            statusDisplay.textContent = 'Correct! Next level...';
            setTimeout(nextLevel, 1000);
        }
    }

    function gameOver() {
        gameInProgress = false;
        awaitingPlayerInput = false;
        statusDisplay.textContent = `Game Over! You reached level ${level}. Press Start to play again.`;
        sounds.error.play();
        startButton.textContent = 'Start Game';
    }
});