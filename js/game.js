import { Ball } from "./ball.js";
import {
  checkCollision,
  findConnectedBalls,
  findFloatingBalls,
  handleProjectileCollision,
} from "./collision.js";
import { createBallGrid, createBallRow, getGridPosition } from "./grid.js";
import { drawGame as renderGame, resizeCanvas } from "./draw.js";
import { createTimer } from "./timer.js";
import { Wind } from "./wind.js";

const canvas = document.querySelector("#gameField");
const ctx = canvas.getContext("2d");
const score = document.getElementById("score");
const startModal = document.getElementById("startGameModal");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const pauseModal = document.getElementById("pauseModal");
const continueButton = document.getElementById("continueButton");
const GameOverModal = document.getElementById("GameOverModal");
const finalScore = document.getElementById("finalScore");
const playAgainButton = document.getElementById("playAgain");
const pointsPerBall = 100;
let totalScore = 0;
let timerControls = null;

function updateWindIndicator(currentWind) {
  const leftLevels = [2, 1, 0].map((level) =>
    document.getElementById(`wind-left-${level}`),
  );
  const rightLevels = [0, 1, 2].map((level) =>
    document.getElementById(`wind-right-${level}`),
  );
  const label = document.getElementById("wind-label");
  const directionIcon = document.getElementById("wind-direction");
  const activeLevels = currentWind.strength === 0
    ? 0
    : currentWind.strengthLevels.indexOf(currentWind.strength);
  const levels = Math.max(0, activeLevels);
  const activeSide = currentWind.direction < 0 ? leftLevels : rightLevels;
  const inactiveSide = currentWind.direction < 0 ? rightLevels : leftLevels;

  [...leftLevels, ...rightLevels].forEach((level) => {
    level.classList.remove("bg-sky-300");
    level.classList.add("bg-zinc-300/50");
  });

  activeSide.forEach((level, index) => {
    if (index < levels) {
      level.classList.remove("bg-zinc-300/50");
      level.classList.add("bg-sky-300");
    }
  });

  inactiveSide.forEach((level) => {
    level.classList.remove("bg-sky-300");
    level.classList.add("bg-zinc-300/50");
  });

  label.textContent = levels === 0
    ? "No wind"
    : "Wind";
  directionIcon.style.transform = currentWind.direction < 0
    ? "rotate(-90deg)"
    : "rotate(90deg)";
}

const wind = new Wind({ onChange: updateWindIndicator });

if (!ctx) {
  throw new Error("Canvas context is not available.");
}

resizeCanvas(canvas, ctx);

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

const collisionLayout = {
  ballSize,
  ballSpacing,
  rowSpacing,
  rowOffsetPhase: 0,
};

const gridOptions = {
  canvas,
  ballColors,
  layout: { ...collisionLayout, ballRowCount },
  Ball,
};

const balls = createBallGrid({
  ...gridOptions,
});
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
let rowInsertionPending = false;

function shootBall() {
  if (projectile) {
    return;
  }

  const { x, y } = getShooterPosition();
  const speed = 5;
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
  rowInsertionPending = ballsShot % 6 === 0;
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

function insertRow() {
  collisionLayout.rowOffsetPhase =
    (collisionLayout.rowOffsetPhase + 1) % 2;

  for (const ball of balls) {
    ball.row += 1;
    const position = getGridPosition(ball.row, ball.column, collisionLayout);
    ball.x = position.x;
    ball.y = position.y;
  }

  balls.unshift(...createBallRow(0, {
    canvas,
    ballColors,
    layout: collisionLayout,
    Ball,
  }));
}

function  finishShot() {
  if (rowInsertionPending) {
    insertRow();
    rowInsertionPending = false;
  }
}

function animate() {
  if (projectile) {
    let shotFinished = false;
    wind.apply(projectile, 1);
    projectile.x += projectile.velocityX;
    projectile.y += projectile.velocityY;

    for (const ball of balls) {
      if (checkCollision(projectile, ball)) {
        const attachedBall = projectile;

        if (
          handleProjectileCollision(attachedBall, ball, balls, collisionLayout)
        ) {
          const connectedBalls = findConnectedBalls(
            attachedBall,
            balls,
            collisionLayout,
          );

          if (connectedBalls.length >= 4) {
            const floatingBalls = findFloatingBalls(
              balls.filter((ball) => !connectedBalls.includes(ball)),
              collisionLayout,
            );
            const destroyedBalls = [...connectedBalls, ...floatingBalls];

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
          shotFinished = true;
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
      shotFinished = true;
    }

    if (shotFinished) {
      finishShot();
    }
  }

  drawGame();

  if (projectile) {
    requestAnimationFrame(animate);
  }
}

function startgame() {
  timerControls = createTimer(document.getElementById("timer-bar"), gameOver);
}

startButton.addEventListener("click", () => {
  startModal.style.display = "none";
  startgame();
});

function gameOver() {
  if (timerControls) {
    timerControls = null;
  }
  finalScore.textContent = totalScore;
  GameOverModal.style.display = "flex";
}

playAgainButton.addEventListener("click", () => {
  GameOverModal.style.display = "none";
  totalScore = 0;
  score.textContent = `${totalScore}`;
  balls.length = 0;
  const newBalls = createBallGrid(gridOptions);
  balls.push(...newBalls);
  ballsShot = 0;
  rowInsertionPending = false;
  collisionLayout.rowOffsetPhase = 0;
  currentBall = getCurrentBall();
  nextBall = getNextBall();
  resizeCanvas(canvas, ctx);
  drawGame();
  startgame();
});

pauseButton.addEventListener("click", () => {
  if (!timerControls) {
    return;
  }

  if (pauseButton.dataset.paused === "true") {
    timerControls.resume();
    pauseButton.dataset.paused = "false";
  } else {
    timerControls.pause();
    pauseButton.dataset.paused = "true";
  }
  pauseModal.style.display = "flex";
});

continueButton.addEventListener("click", () => {
  if (!timerControls) {
    return;
  }
  timerControls.resume();
  pauseButton.dataset.paused = "false";
  pauseModal.style.display = "none";
});

function drawGame() {
  renderGame(ctx, canvas, balls, currentBall, nextBall, projectile, aimAngle, {
    getShooterPosition,
    getShufflerPosition,
  });
}

window.addEventListener("resize", () => {
  resizeCanvas(canvas, ctx);
  if (!projectile) {
    currentBall.x = getShooterPosition().x;
    currentBall.y = getShooterPosition().y;
  }
  drawGame();
});

drawGame();
