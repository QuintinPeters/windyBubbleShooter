class Wind {
    strength;

    apply(ball, deltaTime) {
        ball.velocityX += this.strength * deltaTime;
    }
}