export class Wind {
  constructor({
    strengthLevels = [0, 0.015, 0.03, 0.05],
    interval = 10000,
    maxVelocity = 18,
    onChange = () => {},
  } = {}) {
    this.strengthLevels = strengthLevels;
    this.maxVelocity = maxVelocity;
    this.strength = 0;
    this.direction = 1;
    this.onChange = onChange;
    this.randomize();
    this.changeTimer = setInterval(() => {
      this.randomize();
    }, interval);
  }

  apply(ball, deltaTime) {
    ball.velocityX += this.strength * this.direction * deltaTime;
    ball.velocityX = Math.max(
      -this.maxVelocity,
      Math.min(this.maxVelocity, ball.velocityX),
    );
  }

  setStrength(strength) {
    this.strength = Math.max(0, strength);
  }

  randomize() {
    this.direction = Math.random() < 0.5 ? -1 : 1;
    const level =
      this.strengthLevels[
        Math.floor(Math.random() * this.strengthLevels.length)
      ];
    this.setStrength(level);
    this.onChange(this);
  }

  destroy() {
    clearInterval(this.changeTimer);
  }
}
