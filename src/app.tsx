
import { signal } from "@preact/signals";
import './app.css';

type Cell = {
  row: number;
  col: number;
};

const gridWidth = signal(10);
const gridHeight = signal(10);
const pathLength = signal(10);
const grid = signal<Cell[][]>([]);
const path = signal<Cell[]>([]);
const userPath = signal<Cell[]>([]);
const gameStarted = signal(false);
const showPath = signal(false);
const gameOver = signal(false);
const gameWon = signal(false);
const score = signal(0);

const generateGrid = () => {
  const newGrid: Cell[][] = [];
  for (let row = 0; row < gridHeight.value; row++) {
    newGrid[row] = [];
    for (let col = 0; col < gridWidth.value; col++) {
      newGrid[row][col] = { row, col };
    }
  }
  grid.value = newGrid;
};

const generatePath = () => {
  const newPath: Cell[] = [];
  let currentRow = Math.floor(Math.random() * gridHeight.value);
  let currentCol = Math.floor(Math.random() * gridWidth.value);

  newPath.push({ row: currentRow, col: currentCol });

  let attempts = 0;
  while (newPath.length < pathLength.value) {
    attempts++;
    if (attempts > 1000) { // Avoid infinite loops
      console.error("Failed to generate a path with the given constraints.");
      // Reset and try again
      newPath.length = 0;
      currentRow = Math.floor(Math.random() * gridHeight.value);
      currentCol = Math.floor(Math.random() * gridWidth.value);
      newPath.push({ row: currentRow, col: currentCol });
      attempts = 0;
    }

    const directions = [];
    if (currentRow > 0 && !newPath.some(c => c.row === currentRow - 1 && c.col === currentCol)) directions.push([-1, 0]);
    if (currentRow < gridHeight.value - 1 && !newPath.some(c => c.row === currentRow + 1 && c.col === currentCol)) directions.push([1, 0]);
    if (currentCol > 0 && !newPath.some(c => c.row === currentRow && c.col === currentCol - 1)) directions.push([0, -1]);
    if (currentCol < gridWidth.value - 1 && !newPath.some(c => c.row === currentRow && c.col === currentCol + 1)) directions.push([0, 1]);

    if (directions.length === 0) {
      // Path is blocked, restart from a new random cell
      newPath.length = 0;
      currentRow = Math.floor(Math.random() * gridHeight.value);
      currentCol = Math.floor(Math.random() * gridWidth.value);
      newPath.push({ row: currentRow, col: currentCol });
      continue;
    }

    const move = directions[Math.floor(Math.random() * directions.length)];
    currentRow += move[0];
    currentCol += move[1];
    newPath.push({ row: currentRow, col: currentCol });
  }
  path.value = newPath;
};

const startGame = () => {
  generateGrid();
  generatePath();
  userPath.value = [];
  score.value = 0;
  gameOver.value = false;
  gameWon.value = false;
  gameStarted.value = true;
  showPath.value = true;
  
  let i = 0;
  const interval = setInterval(() => {
    if (i < path.value.length) {
      const currentCell = path.value[i];
      const cellElement = document.querySelector(`[data-row="${currentCell.row}"][data-col="${currentCell.col}"]`);
      cellElement?.classList.add('path');
      setTimeout(() => {
        cellElement?.classList.remove('path');
      }, 500)
      i++;
    } else {
      clearInterval(interval);
      showPath.value = false;
    }
  }, 1000);
};

const resetGame = () => {
  gameStarted.value = false;
  showPath.value = false;
  gameOver.value = false;
  gameWon.value = false;
  score.value = 0;
  userPath.value = [];
  path.value = [];
  generateGrid();
}

const handleCellClick = (cell: Cell) => {
  if (showPath.value || gameOver.value || !gameStarted.value) return;

  const currentPathIndex = userPath.value.length;
  const isCorrectClick =
    path.value[currentPathIndex]?.row === cell.row &&
    path.value[currentPathIndex]?.col === cell.col;

  if (isCorrectClick) {
    userPath.value = [...userPath.value, cell];
    score.value++;
    if (userPath.value.length === path.value.length) {
      gameOver.value = true;
      gameWon.value = true;
    }
  } else {
    gameOver.value = true;
    gameWon.value = false;
  }
};

const cellClass = (cell: Cell) => {
  const isUserPath = userPath.value.some(
    (pathCell) => pathCell.row === cell.row && pathCell.col === cell.col
  );
  if (isUserPath) return 'cell correct';
  return 'cell';
}

export function App() {
  if(grid.value.length === 0) generateGrid();

  const onWidthChange = (e) => {
    gridWidth.value = parseInt(e.target.value, 10);
    generateGrid();
  }

  const onHeightChange = (e) => {
    gridHeight.value = parseInt(e.target.value, 10);
    generateGrid();
  }

  const onPathLengthChange = (e) => {
    pathLength.value = parseInt(e.target.value, 10);
  }

  return (
    <div class="game-container">
      <h1>Path Memory Game</h1>
      {!gameStarted.value ? (
        <div class="controls setup">
          <div class="input-control">
            <label for="width">Width:</label>
            <input type="number" id="width" value={gridWidth.value} onInput={onWidthChange} />
          </div>
          <div class="input-control">
            <label for="height">Height:</label>
            <input type="number" id="height" value={gridHeight.value} onInput={onHeightChange} />
          </div>
          <div class="input-control">
            <label for="path">Path Length:</label>
            <input type="number" id="path" value={pathLength.value} onInput={onPathLengthChange} />
          </div>
        </div>
      ) : null}
      <div class="controls">
        <button onClick={startGame} disabled={gameStarted.value && !gameOver.value}>Start Game</button>
        <button onClick={resetGame} disabled={!gameStarted.value}>Reset Game</button>
      </div>
      {gameStarted.value ? (
        <div class="grid" style={{ gridTemplateColumns: `repeat(${gridWidth.value}, 40px)`, gridTemplateRows: `repeat(${gridHeight.value}, 40px)` }}>
          {grid.value.map((row) =>
            row.map((cell) => (
              <div
                class={cellClass(cell)}
                data-row={cell.row}
                data-col={cell.col}
                onClick={() => handleCellClick(cell)}
              />
            ))
          )}
        </div>
      ) : <div class="grid-placeholder">Setup your game and press start!</div>}

       {gameOver.value && (
        <div class="modal-overlay">
          <div class="modal-dialog">
            <h2>{gameWon.value ? 'You Won!' : 'Game Over!'}</h2>
            <p>Your score: {score.value}</p>
            <button onClick={startGame}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}
