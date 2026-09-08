import { Ball } from './ball.js';

const canvas = document.querySelector('#gameField');
const ctx = canvas.getContext('2d');


if (!ctx) {
    throw new Error('Canvas context is not available.');
}

function resizeCanvas() {
    const bounds = canvas.getBoundingClientRect();
    const pixelRatio = window.devicePixelRatio || 1;

    canvas.width = bounds.width * pixelRatio;
    canvas.height = bounds.height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

resizeCanvas();
    
const ball = new Ball({
    x: canvas.clientWidth / 13,
    y: canvas.clientHeight /10,
    size: 28,
    color: '#facc15',
    glowColor: '#f59e0b',
});

function drawGame() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ball.draw(ctx);
}

window.addEventListener('resize', () => {
    resizeCanvas();
    ball.x = canvas.clientWidth / 13;
    ball.y = canvas.clientHeight / 10;
    drawGame();
});

drawGame();
