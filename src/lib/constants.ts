import type { DisplayMode } from './types';

export const INITIAL_KEYWORDS = ['forward', 'back', 'left', 'right', 'jump', 'stop', 'go', 'pizza', 'burger', 'coke', 'fries', 'brake', 'up', 'down'];

export const MAZE_ROWS = 21;
export const MAZE_COLS = 31;

export const KEYWORDS_MAP: Record<DisplayMode, string[]> = {
  fastfood: ['pizza', 'burger', 'coke', 'fries', 'jump'],
  drive: ['left', 'right', 'forward', 'go', 'stop', 'brake'],
  findway: ['up', 'down', 'left', 'right'],
  tarot: []
};
