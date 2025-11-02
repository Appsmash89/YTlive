export type Author = {
  name: string;
  avatar: string;
};

export type Comment = {
  id: string;
  author: Author;
  text: string;
};

export type CommandLog = {
  id:string;
  comment: Comment;
  command: string | undefined;
  feedback: string | undefined;
  timestamp: Date;
};

export type TarotCard = {
  name: string;
  number: string;
  arcana: string;
  suit: string;
  imageUrl: string;
  imageHint: string;
  keywords: string[];
  meanings: {
    light: string[];
    shadow: string[];
  };
  favorableColor: string;
  obstacleAdvice: string;
  description: string;
};

export type DisplayMode = 'fastfood' | 'tarot' | 'drive' | 'findway';

export type CarState = {
  position: 'center' | 'left' | 'right';
  speed: 'moving' | 'stopped';
};

export type CellType = 'path' | 'wall' | 'start' | 'end';
export type Maze = CellType[][];
export type Position = {
  row: number;
  col: number;
};
export type MazeState = {
  maze: Maze;
  playerPosition: Position;
  isComplete: boolean;
};

export type ActiveMedia = {
  url: string;
  type: string;
  command: string;
  authorName: string;
  hint?: string;
};

export type YouTubeComment = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  text: string;
};
