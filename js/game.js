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

const ballSize = 24;
const ballDiameter = ballSize * 2;
const ballGap = 3;
const ballSpacing = ballDiameter + ballGap;
const rowSpacing = ballSpacing * Math.sqrt(3) / 2;
const ballRowCount = 5;
const ballColors = [
    { color: '#facc15', glowColor: '#f59e0b' },
    { color: '#fb7185', glowColor: '#e11d48' },
    { color: '#38bdf8', glowColor: '#0284c7' },
    { color: '#29D877', glowColor: '#27c56e' },
    { color: '#B65EFF', glowColor: '#6b33cc' },
];

function createBallGrid() {
    const balls = [];
    const rowCount = Math.max(
        1,
        Math.min(
            ballRowCount,
            Math.floor((canvas.clientHeight - ballSize) / rowSpacing) + 1,
        ),
    );

    for (let row = 0; row < rowCount; row += 1) {
        const rowOffset = row % 2 === 0 ? 0 : ballSpacing / 2;
        const columnCount = Math.max(
            1,
            Math.floor(
                (canvas.clientWidth - (ballDiameter + rowOffset)) / ballSpacing,
            ) + 1,
        );

        for (let column = 0; column < columnCount; column += 1) {
            const palette = ballColors[Math.floor(Math.random() * ballColors.length)];

            balls.push(new Ball({
                x: ballSize + column * ballSpacing + rowOffset,
                y: ballSize + row * rowSpacing,
                size: ballSize,
                color: palette.color,
                glowColor: palette.glowColor,
            }));
        }
    }

    return balls;
}

let balls = createBallGrid();

function drawGame() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    balls.forEach((ball) => ball.draw(ctx));
}

window.addEventListener('resize', () => {
    resizeCanvas();
    balls = createBallGrid();
    drawGame();
});

drawGame();
