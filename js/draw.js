export function resizeCanvas(canvas, context) {
  const bounds = canvas.getBoundingClientRect();
  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = bounds.width * pixelRatio;
  canvas.height = bounds.height * pixelRatio;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

export function drawAimLine(context, canvas, angle, getShooterPosition) {
  const { x, y } = getShooterPosition();
  context.save();
  context.setLineDash([2, 40]);
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x + Math.cos(angle) * 300, y + Math.sin(angle) * 300);
  context.strokeStyle = "#25C1FF";
  context.lineWidth = 4;
  context.stroke();
  context.restore();
}

export function drawShooter(context, canvas, currentBall, nextBall, projectile, getShufflerPosition) {
  const shooterX = canvas.clientWidth / 2;
  const shooterY = canvas.clientHeight - 150;
  const { x: shufflerX, y: shufflerY } = getShufflerPosition();

  context.beginPath();
  context.arc(shooterX, shooterY, 115, 0, 2 * Math.PI);
  context.fillStyle = "#D9D9D966";
  context.fill();
  context.beginPath();
  context.arc(shooterX, shooterY, 50, 0, 2 * Math.PI);
  context.fill();
  context.beginPath();
  context.arc(shufflerX, shufflerY, 30, 0, 2 * Math.PI);
  context.fillStyle = "#D9D9D988";
  context.fill();

  context.save();
  context.translate(shufflerX, shufflerY);
  context.strokeStyle = "#000000";
  context.lineWidth = 2.5;
  context.lineCap = "arrow";
  context.lineJoin = "round";
  context.beginPath();
  context.moveTo(-13, -7);
  context.lineTo(13, -7);
  context.lineTo(8, -12);
  context.moveTo(13, -7);
  context.lineTo(8, -2);
  context.moveTo(13, 7);
  context.lineTo(-13, 7);
  context.lineTo(-8, 2);
  context.moveTo(-13, 7);
  context.lineTo(-8, 12);
  context.stroke();
  context.restore();

  if (!projectile) currentBall.draw(context);
  nextBall.draw(context);
}

export function drawGame(context, canvas, balls, currentBall, nextBall, projectile, angle, positions) {
  context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  drawAimLine(context, canvas, angle, positions.getShooterPosition);
  balls.forEach((ball) => ball.draw(context));
  drawShooter(context, canvas, currentBall, nextBall, projectile, positions.getShufflerPosition);
  if (projectile) projectile.draw(context);
}
