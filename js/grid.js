export function getGridPosition(row, column, layout) {
  const rowParity = (row + (layout.rowOffsetPhase || 0)) % 2;
  const rowOffset = rowParity === 0 ? 0 : layout.ballSpacing / 2;

  return {
    x: layout.ballSize + column * layout.ballSpacing + rowOffset,
    y: layout.ballSize + row * layout.rowSpacing,
  };
}

export function getNeighborPositions(row, column, layout = {}) {
  const rowParity = (row + (layout.rowOffsetPhase || 0)) % 2;
  const diagonalColumns = rowParity === 0 ? [-1, 0] : [0, 1];

  return [
    { row, column: column - 1 },
    { row, column: column + 1 },
    ...diagonalColumns.flatMap((offset) => [
      { row: row - 1, column: column + offset },
      { row: row + 1, column: column + offset },
    ]),
  ];
}

export function isGridPositionOccupied(balls, row, column) {
  return balls.some((ball) => ball.row === row && ball.column === column);
}

export function createBallGrid({ canvas, ballColors, layout, Ball }) {
  const rowCount = Math.max(
    1,
    Math.min(layout.ballRowCount || 5, Math.floor((canvas.clientHeight - layout.ballSize) / layout.rowSpacing) + 1),
  );
  const balls = [];

  for (let row = 0; row < rowCount; row += 1) {
    balls.push(...createBallRow(row, { canvas, ballColors, layout, Ball }));
  }
  return balls;
}

export function createBallRow(row, { canvas, ballColors, layout, Ball }) {
  const offset = (row + (layout.rowOffsetPhase || 0)) % 2 ? layout.ballSpacing / 2 : 0;
  const columnCount = Math.max(
    1,
    Math.floor((canvas.clientWidth - (layout.ballSize * 2 + offset)) / layout.ballSpacing) + 1,
  );
  return Array.from({ length: columnCount }, (_, column) => {
    const palette = ballColors[Math.floor(Math.random() * ballColors.length)];
    return new Ball({
      ...getGridPosition(row, column, layout),
      size: layout.ballSize,
      color: palette.color,
      glowColor: palette.glowColor,
      row,
      column,
    });
  });
}
