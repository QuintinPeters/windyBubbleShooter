export class Ball {
  constructor({
    x,
    y,
    size,
    color,
    velocityX = 0,
    velocityY = 0,
    borderColor = "rgba(255, 255, 255, 0.75)",
    borderWidth = 2,
    glowColor = color,
    glowBlur = 12,
    opacity = 1,
    row = null,
    column = null,
  }) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.borderColor = borderColor;
    this.borderWidth = borderWidth;
    this.glowColor = glowColor;
    this.glowBlur = glowBlur;
    this.opacity = opacity;
    this.row = row;
    this.column = column;
  }

  draw(context) {
    const gradient = context.createRadialGradient(
      this.x - this.size * 0.35,
      this.y - this.size * 0.35,
      this.size * 0.1,
      this.x,
      this.y,
      this.size,
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.9)");
    gradient.addColorStop(0.2, this.color);
    gradient.addColorStop(1, this.glowColor);

    context.save();
    context.globalAlpha = this.opacity;
    context.shadowColor = this.glowColor;
    context.shadowBlur = this.glowBlur;
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fillStyle = gradient;
    context.fill();
    context.shadowBlur = 0;
    context.lineWidth = this.borderWidth;
    context.strokeStyle = this.borderColor;
    context.stroke();
    context.restore();
  }
}
