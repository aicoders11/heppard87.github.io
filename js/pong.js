const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 10;
const paddleHeight = 100;
let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;
const paddleSpeed = 5;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;
const ballSize = 10;

let leftScore = 0;
let rightScore = 0;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Paddles
  ctx.fillStyle = 'white';
  ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
  ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

  // Ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
  ctx.fill();

  // Scores
  ctx.font = '20px Arial';
  ctx.fillText(leftScore, canvas.width / 4, 30);
  ctx.fillText(rightScore, (canvas.width / 4) * 3, 30);
}

function update() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Ball collision with top/bottom walls
  if (ballY < 0 || ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  // Ball collision with paddles
  if (
    (ballX < paddleWidth && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) ||
    (ballX > canvas.width - paddleWidth && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight)
  ) {
    ballSpeedX = -ballSpeedX;
  }

  // Scoring
  if (ballX < 0) {
    rightScore++;
    resetBall();
  } else if (ballX > canvas.width) {
    leftScore++;
    resetBall();
  }

  // AI for right paddle
  if (rightPaddleY + paddleHeight / 2 < ballY) {
    rightPaddleY += paddleSpeed;
  } else {
    rightPaddleY -= paddleSpeed;
  }

  draw();
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX;
}

document.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  leftPaddleY = e.clientY - rect.top - paddleHeight / 2;
});

setInterval(update, 1000 / 60);
