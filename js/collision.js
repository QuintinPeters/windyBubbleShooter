import { getGridPosition, getNeighborPositions, isGridPositionOccupied } from "./grid.js";
export { getGridPosition };

/* export function getGridPosition(row, column, layout) {
  const rowParity = (row + (layout.rowOffsetPhase || 0)) % 2;
  const rowOffset = rowParity === 0 ? 0 : layout.ballSpacing / 2;

  return {
    x: layout.ballSize + column * layout.ballSpacing + rowOffset,
    y: layout.ballSize + row * layout.rowSpacing,
  };
}

export function getNeighborPositions(row, column, layout = {}) {
  const rowParity = (row + (layout.rowOffsetPhase || 0)) % 2;

  if (rowParity === 0) {
    return [
      { row, column: column - 1 },
      { row, column: column + 1 },
      { row: row - 1, column: column - 1 },
      { row: row - 1, column },
      { row: row + 1, column: column - 1 },
      { row: row + 1, column },
    ];
  }

  return [
    { row, column: column - 1 },
    { row, column: column + 1 },
    { row: row - 1, column },
    { row: row - 1, column: column + 1 },
    { row: row + 1, column },
    { row: row + 1, column: column + 1 },
  ];
}

export function isGridPositionOccupied(balls, row, column) {
  return balls.some((ball) => ball.row === row && ball.column === column);
} */

export function findBestGridPosition(hitBall, projectile, balls, layout) {
  const freePositions = getNeighborPositions(
    hitBall.row,
    hitBall.column,
    layout,
  ).filter((position) =>
    !isGridPositionOccupied(balls, position.row, position.column),
  );

  if (freePositions.length === 0) {
    return null;
  }

  return freePositions.reduce((bestPosition, position) => {
    const bestGridPosition = getGridPosition(
      bestPosition.row,
      bestPosition.column,
      layout,
    );
    const gridPosition = getGridPosition(position.row, position.column, layout);
    const bestDistance = Math.hypot(
      projectile.x - bestGridPosition.x,
      projectile.y - bestGridPosition.y,
    );
    const distance = Math.hypot(
      projectile.x - gridPosition.x,
      projectile.y - gridPosition.y,
    );

    return distance < bestDistance ? position : bestPosition;
  });
}

export function checkCollision(ballA, ballB) {
  return (
    Math.hypot(ballA.x - ballB.x, ballA.y - ballB.y) <=
    ballA.size + ballB.size
  );
}

export function findConnectedBalls(startBall, balls, layout) {
  const connected = [];
  const queue = [startBall];
  const visited = new Set();
  const ballsByPosition = new Map(
    balls.map((ball) => [`${ball.row}:${ball.column}`, ball]),
  );
  let queueIndex = 0;

  while (queueIndex < queue.length) {
    const ball = queue[queueIndex];
    queueIndex += 1;
    const key = `${ball.row}:${ball.column}`;

    if (visited.has(key)) {
      continue;
    }

    visited.add(key);

    if (ball.color !== startBall.color) {
      continue;
    }

    connected.push(ball);
    for (const position of getNeighborPositions(ball.row, ball.column, layout)) {
      const neighbor = ballsByPosition.get(
        `${position.row}:${position.column}`,
      );

      if (neighbor && !visited.has(`${neighbor.row}:${neighbor.column}`)) {
        queue.push(neighbor);
      }
    }
  }

  return connected;
}

export function findFloatingBalls(balls, layout) {
  const supported = new Set();
  const queue = balls.filter((ball) => ball.row === 0);
  const ballsByPosition = new Map(
    balls.map((ball) => [`${ball.row}:${ball.column}`, ball]),
  );
  let queueIndex = 0;

  while (queueIndex < queue.length) {
    const ball = queue[queueIndex];
    queueIndex += 1;
    const key = `${ball.row}:${ball.column}`;

    if (supported.has(key)) {
      continue;
    }

    supported.add(key);
    for (const position of getNeighborPositions(ball.row, ball.column, layout)) {
      const neighbor = ballsByPosition.get(
        `${position.row}:${position.column}`,
      );

      if (neighbor && !supported.has(`${neighbor.row}:${neighbor.column}`)) {
        queue.push(neighbor);
      }
    }
  }

  return balls.filter((ball) => !supported.has(`${ball.row}:${ball.column}`));
}

export function handleProjectileCollision(
  projectile,
  hitBall,
  balls,
  layout,
) {
  const position = findBestGridPosition(hitBall, projectile, balls, layout);

  if (!position) {
    return false;
  }

  const gridPosition = getGridPosition(position.row, position.column, layout);

  projectile.x = gridPosition.x;
  projectile.y = gridPosition.y;
  projectile.row = position.row;
  projectile.column = position.column;
  projectile.velocityX = 0;
  projectile.velocityY = 0;

  balls.push(projectile);
  return true;
}