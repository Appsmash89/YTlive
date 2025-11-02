import type { Maze, Position, CellType } from './types';

// Using recursive backtracking algorithm
export const generateMaze = (rows: number, cols: number): { maze: Maze, playerPosition: Position, isComplete: boolean } => {
  // Ensure dimensions are odd
  const height = rows % 2 === 0 ? rows + 1 : rows;
  const width = cols % 2 === 0 ? cols + 1 : cols;
  
  const maze: Maze = Array.from({ length: height }, () => Array(width).fill('wall'));
  
  const start: Position = { row: 1, col: 1 };
  
  const carvePassages = (cy: number, cx: number) => {
    maze[cy][cx] = 'path';
    const directions = [
      { r: -2, c: 0 }, // North
      { r: 2, c: 0 },  // South
      { r: 0, c: -2 }, // West
      { r: 0, c: 2 }   // East
    ];

    // Shuffle directions
    for (let i = directions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [directions[i], directions[j]] = [directions[j], directions[i]];
    }
    
    for (const dir of directions) {
      const ny = cy + dir.r;
      const nx = cx + dir.c;
      
      if (ny >= 0 && ny < height && nx >= 0 && nx < width && maze[ny][nx] === 'wall') {
        // Carve path to the new cell
        maze[cy + dir.r / 2][cx + dir.c / 2] = 'path';
        carvePassages(ny, nx);
      }
    }
  };

  carvePassages(start.row, start.col);

  // Set start and end points
  maze[1][1] = 'start';
  maze[height - 2][width - 2] = 'end';
  
  // Ensure the end point is reachable
  if (maze[height - 3][width - 2] === 'wall' && maze[height - 2][width - 3] === 'wall') {
      // If end is blocked, open one path
       maze[height - 2][width - 3] = 'path';
  }


  return { 
    maze, 
    playerPosition: { row: 1, col: 1 },
    isComplete: false
  };
};
