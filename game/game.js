const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20; // Size of each grid square
const canvasSize = 500;
const row = canvasSize / box;
const col = canvasSize / box;

let snake;
let food;
let direction;
let score;
let gameInterval;
let isGameOver = false;

function initGame() {
    snake = [
        { x: 8, y: 10 },
        { x: 7, y: 10 },
        { x: 6, y: 10 }
    ];
    direction = 'RIGHT';
    placeFood();
    score = 0;
    isGameOver = false;
    document.getElementById('score').innerText = 'Score: 0';
    clearInterval(gameInterval);
    gameInterval = setInterval(draw, 100);
}

function placeFood() {
    // Place food not on the snake
    let valid = false;
    while (!valid) {
        food = {
            x: Math.floor(Math.random() * col),
            y: Math.floor(Math.random() * row)
        };
        valid = !snake.some(segment => segment.x === food.x && segment.y === food.y);
    }
}

function draw() {
    // Draw background
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? '#5bc85b' : '#fff';
        ctx.fillRect(snake[i].x * box, snake[i].y * box, box - 2, box - 2);
        ctx.strokeStyle = '#444';
        ctx.strokeRect(snake[i].x * box, snake[i].y * box, box - 2, box - 2);
    }

    // Draw food
    ctx.fillStyle = '#f44336';
    ctx.fillRect(food.x * box, food.y * box, box - 2, box - 2);

    // Move snake
    let head = { ...snake[0] };
    switch (direction) {
        case 'LEFT':
            head.x -= 1;
            break;
        case 'UP':
            head.y -= 1;
            break;
        case 'RIGHT':
            head.x += 1;
            break;
        case 'DOWN':
            head.y += 1;
            break;
    }

    // Check collision with wall
    if (head.x < 0 || head.x >= col || head.y < 0 || head.y >= row) {
        endGame();
        return;
    }

    // Check collision with self
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            endGame();
            return;
        }
    }

    snake.unshift(head);

    // If snake eats food
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById('score').innerText = 'Score: ' + score;
        placeFood();
    } else {
        snake.pop();
    }
}

function endGame() {
    clearInterval(gameInterval);
    isGameOver = true;
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    ctx.fillStyle = "#fff";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", canvasSize/2, canvasSize/2 - 10);
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, canvasSize/2, canvasSize/2 + 25);
}

document.addEventListener('keydown', (e) => {
    if (isGameOver) return;
    switch (e.key) {
        case 'ArrowLeft':
            if (direction !== 'RIGHT') direction = 'LEFT';
            break;
        case 'ArrowUp':
            if (direction !== 'DOWN') direction = 'UP';
            break;
        case 'ArrowRight':
            if (direction !== 'LEFT') direction = 'RIGHT';
            break;
        case 'ArrowDown':
            if (direction !== 'UP') direction = 'DOWN';
            break;
    }
});

document.getElementById('restartBtn').addEventListener('click', () => {
    initGame();
});

initGame();