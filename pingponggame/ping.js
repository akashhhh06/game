const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 16;
const PADDLE_HEIGHT = 96;
const BALL_SIZE = 18;
const PADDLE_SPEED = 6;
const AI_SPEED = 3.2;
const BALL_SPEED = 6;

// Game objects
let leftPaddle = {
    x: 0,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0
};

let rightPaddle = {
    x: canvas.width - PADDLE_WIDTH,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0
};

let ball = {
    x: canvas.width / 2 - BALL_SIZE / 2,
    y: canvas.height / 2 - BALL_SIZE / 2,
    size: BALL_SIZE,
    dx: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
    dy: BALL_SPEED * (Math.random() * 2 - 1)
};

let scores = { left: 0, right: 0 };

// Paddle control via mouse
canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    leftPaddle.y = mouseY - leftPaddle.height / 2;

    // Clamp paddle inside the canvas
    leftPaddle.y = Math.max(0, Math.min(canvas.height - leftPaddle.height, leftPaddle.y));
});

// Draw all game elements
function drawRect(x, y, w, h, color = '#fff') {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, size, color = '#fff') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
    ctx.fill();
}

function drawNet() {
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 4;
    for (let i = 10; i < canvas.height; i += 32) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, i);
        ctx.lineTo(canvas.width / 2, i + 16);
        ctx.stroke();
    }
}

function drawScore() {
    ctx.font = "bold 44px monospace";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(scores.left, canvas.width / 4, 60);
    ctx.fillText(scores.right, canvas.width * 3 / 4, 60);
}

// Collision detection
function collides(ball, paddle) {
    return (
        ball.x < paddle.x + paddle.width &&
        ball.x + ball.size > paddle.x &&
        ball.y < paddle.y + paddle.height &&
        ball.y + ball.size > paddle.y
    );
}

// AI movement
function moveAIPaddle() {
    let paddleCenter = rightPaddle.y + rightPaddle.height / 2;
    if (ball.y + ball.size / 2 < paddleCenter - 10) {
        rightPaddle.y -= AI_SPEED;
    } else if (ball.y + ball.size / 2 > paddleCenter + 10) {
        rightPaddle.y += AI_SPEED;
    }
    // Clamp paddle inside the canvas
    rightPaddle.y = Math.max(0, Math.min(canvas.height - rightPaddle.height, rightPaddle.y));
}

// Ball reset
function resetBall(direction = 1) {
    ball.x = canvas.width / 2 - BALL_SIZE / 2;
    ball.y = canvas.height / 2 - BALL_SIZE / 2;
    ball.dx = BALL_SPEED * direction;
    ball.dy = BALL_SPEED * (Math.random() * 2 - 1);
}

// Game update
function update() {
    // Move AI paddle
    moveAIPaddle();

    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision (top/bottom)
    if (ball.y < 0) {
        ball.y = 0;
        ball.dy *= -1;
    } else if (ball.y + ball.size > canvas.height) {
        ball.y = canvas.height - ball.size;
        ball.dy *= -1;
    }

    // Paddle collisions
    if (collides(ball, leftPaddle)) {
        ball.x = leftPaddle.x + leftPaddle.width;
        ball.dx *= -1;
        // Add some spin based on where the ball hits the paddle
        let impact = (ball.y + ball.size / 2) - (leftPaddle.y + leftPaddle.height / 2);
        ball.dy = impact * 0.25;
    }

    if (collides(ball, rightPaddle)) {
        ball.x = rightPaddle.x - ball.size;
        ball.dx *= -1;
        let impact = (ball.y + ball.size / 2) - (rightPaddle.y + rightPaddle.height / 2);
        ball.dy = impact * 0.25;
    }

    // Score check
    if (ball.x < 0) {
        scores.right++;
        resetBall(1);
    } else if (ball.x + ball.size > canvas.width) {
        scores.left++;
        resetBall(-1);
    }
}

// Game render
function render() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw net
    drawNet();

    // Draw paddles & ball
    drawRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height, "#0ff");
    drawRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height, "#f36");
    drawBall(ball.x, ball.y, ball.size, "#fff");

    // Draw scores
    drawScore();
}

// Game loop
function loop() {
    update();
    render();
    requestAnimationFrame(loop);
}

loop();