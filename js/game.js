import { Ball } from "./ball.js";
import {
  checkCollision,
  findConnectedBalls,
  findFloatingBalls,
  handleProjectileCollision,
} from "./collision.js";

const canvas = document.querySelector("#gameField");
const ctx = canvas.getContext("2d");
const score = document.getElementById("score");
const pointsPerBall = 100;
let totalScore = 0;

if (!ctx) {
  throw new Error("Canvas context is not available.");
}

function resizeCanvas() {
  const bounds = canvas.getBoundingClientRect();
  const pixelRatio = window.devicePixelRatio || 1;

  canvas.width = bounds.width * pixelRatio;
  canvas.height = bounds.height * pixelRatio;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

resizeCanvas();

const ballSize = 20;
const ballDiameter = ballSize * 2;
const ballGap = 3;
const ballSpacing = ballDiameter + ballGap;
const rowSpacing = (ballSpacing * Math.sqrt(3)) / 2;
const ballRowCount = 5;
const ballColors = [
  { color: "#facc15", glowColor: "#f59e0b" },
  { color: "#fb7185", glowColor: "#e11d48" },
  { color: "#38bdf8", glowColor: "#0284c7" },
  { color: "#29D877", glowColor: "#27c56e" },
  { color: "#B65EFF", glowColor: "#6b33cc" },
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

      balls.push(
        new Ball({
          x: ballSize + column * ballSpacing + rowOffset,
          y: ballSize + row * rowSpacing,
          size: ballSize,
          color: palette.color,
          glowColor: palette.glowColor,
          row: row,
          column: column,
        }),
      );
    }
  }

  return balls;
}

const balls = createBallGrid();
const collisionLayout = { ballSize, ballSpacing, rowSpacing };
const shufflerRadius = 30;

function getShooterPosition() {
  return {
    x: canvas.clientWidth / 2,
    y: canvas.clientHeight - 230,
  };
}

function getShufflerPosition() {
  return {
    x: canvas.clientWidth - 220,
    y: canvas.clientHeight - 200,
  };
}

function drawShooter() {
  const shooterX = canvas.clientWidth / 2;
  const shooterY = canvas.clientHeight - 150;
  const { x: shufflerX, y: shufflerY } = getShufflerPosition();

  ctx.beginPath();
  ctx.arc(shooterX, shooterY, 115, 0, 2 * Math.PI);

  ctx.fillStyle = "#D9D9D966";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(shooterX, shooterY, 50, 0, 2 * Math.PI);
  ctx.fillStyle = "#D9D9D966";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(shufflerX, shufflerY, shufflerRadius, 0, 2 * Math.PI);
  ctx.fillStyle = "#D9D9D988";
  ctx.fill();

  ctx.save();
  ctx.translate(shufflerX, shufflerY);
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2.5;
  ctx.lineCap = "arrow";
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.moveTo(-13, -7);
  ctx.lineTo(13, -7);
  ctx.lineTo(8, -12);
  ctx.moveTo(13, -7);
  ctx.lineTo(8, -2);
  ctx.moveTo(13, 7);
  ctx.lineTo(-13, 7);
  ctx.lineTo(-8, 2);
  ctx.moveTo(-13, 7);
  ctx.lineTo(-8, 12);
  ctx.stroke();
  ctx.restore();

  if (!projectile) {
    currentBall.draw(ctx);
  }
  nextBall.draw(ctx);
}

function drawAimLine(angle) {
  const { x: shooterX, y: shooterY } = getShooterPosition();

  const length = 300;

  ctx.save();
  ctx.setLineDash([2, 40]);
  ctx.beginPath();
  ctx.moveTo(shooterX, shooterY);
  ctx.lineTo(
    shooterX + Math.cos(angle) * length,
    shooterY + Math.sin(angle) * length,
  );

  ctx.strokeStyle = "#25C1FF";
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.restore();
}

let aimAngle = 0;

canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();

  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const { x: shooterX, y: shooterY } = getShooterPosition();

  let angle = Math.atan2(mouseY - shooterY, mouseX - shooterX);
  angle = Math.max(-Math.PI + 0.1, Math.min(-0.1, angle));

  aimAngle = angle;
  drawGame();
});

function getCurrentBall() {
  const randomColor = ballColors[Math.floor(Math.random() * ballColors.length)];

  return new Ball({
    x: canvas.clientWidth / 2,
    y: canvas.clientHeight - 230,
    size: 20,
    color: randomColor.color,
    glowColor: randomColor.glowColor,
  });
}

function getNextBall() {
  const randomColor = ballColors[Math.floor(Math.random() * ballColors.length)];
  return new Ball({
    x: canvas.clientWidth / 2,
    y: canvas.clientHeight - 70,
    size: 20,
    color: randomColor.color,
    glowColor: randomColor.glowColor,
  });
}

let currentBall = getCurrentBall();
let nextBall = getNextBall();
let projectile = null;

function switchBall() {
  const currentColor = currentBall.color;
  const currentGlow = currentBall.glowColor;

  currentBall.color = nextBall.color;
  currentBall.glowColor = nextBall.glowColor;

  nextBall.color = currentColor;
  nextBall.glowColor = currentGlow;
  drawGame();
}

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();

  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const { x: shufflerX, y: shufflerY } = getShufflerPosition();
  const distance = Math.hypot(mouseX - shufflerX, mouseY - shufflerY);

  if (distance <= shufflerRadius) {
    switchBall();
  }
});

let ballsShot = 0; 

function shootBall() {
  if (projectile) {
    return;
  }

  const { x, y } = getShooterPosition();
  const speed = 15;
  const velocityX = Math.cos(aimAngle) * speed;
  const velocityY = Math.sin(aimAngle) * speed;

  currentBall.x = x;
  currentBall.y = y;
  currentBall.velocityX = velocityX;
  currentBall.velocityY = velocityY;
  projectile = currentBall;
  currentBall = nextBall;
  currentBall.x = getShooterPosition().x;
  currentBall.y = getShooterPosition().y;
  nextBall = getNextBall();
  ballsShot += 1; 
  console.log(`Balls shot: ${ballsShot}`);
  animate();
}


canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();

  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const { x: shufflerX, y: shufflerY } = getShufflerPosition();
  const distance = Math.hypot(mouseX - shufflerX, mouseY - shufflerY);

  if (distance > shufflerRadius) {
    shootBall();
  }
});

function animate() {
  if (projectile) {
    projectile.x += projectile.velocityX;
    projectile.y += projectile.velocityY;

    for (const ball of balls) {
      if (checkCollision(projectile, ball)) {
        const attachedBall = projectile;

        if (
          handleProjectileCollision(
            attachedBall,
            ball,
            balls,
            collisionLayout,
          )
        ) {
          const connectedBalls = findConnectedBalls(attachedBall, balls);

          if (connectedBalls.length >= 4) {
            const floatingBalls = findFloatingBalls(
              balls.filter((ball) => !connectedBalls.includes(ball)),
            );
            const destroyedBalls = [
              ...connectedBalls,
              ...floatingBalls,
            ];

            totalScore += destroyedBalls.length * pointsPerBall;
            score.textContent = `${totalScore}`;

            for (const destroyedBall of destroyedBalls) {
              const index = balls.indexOf(destroyedBall);

              if (index !== -1) {
                balls.splice(index, 1);
              }
            }
          }

          projectile = null;
        }
        break;
      }
    }

    if (
      projectile &&
      (projectile.x - projectile.size <= 0 ||
        projectile.x + projectile.size >= canvas.clientWidth)
    ) {
      projectile.velocityX *= -1;

      projectile.x = Math.max(
        projectile.size,
        Math.min(canvas.clientWidth - projectile.size, projectile.x),
      );
    }

    if (projectile && projectile.y + projectile.size < 0) {
      projectile = null;
    }
  }

  drawGame();

  if (projectile) {
    requestAnimationFrame(animate);
  }
}

function addBallRow() 
{
  
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  drawAimLine(aimAngle);
  balls.forEach((ball) => ball.draw(ctx));
  drawShooter();
  if (projectile) {
    projectile.draw(ctx);
  }
}

window.addEventListener("resize", () => {
  resizeCanvas();
  if (!projectile) {
    currentBall.x = getShooterPosition().x;
    currentBall.y = getShooterPosition().y;
  }
  drawGame();
});

drawGame();
