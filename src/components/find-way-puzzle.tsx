
"use client";

import type { MazeState } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Waypoints } from 'lucide-react';
import Image from 'next/image';

interface FindWayPuzzleProps {
  mazeState: MazeState;
}

const FindWayPuzzle = ({ mazeState }: FindWayPuzzleProps) => {
  const { maze, playerPosition } = mazeState;
  const rows = maze.length;
  const cols = maze[0].length;

  return (
    <div className="w-full h-full bg-gray-800 flex items-center justify-center p-4">
      <div
        className="relative bg-gray-900 border-2 border-accent/50 rounded-lg shadow-lg"
        style={{
          aspectRatio: `${cols} / ${rows}`
        }}
      >
        <div 
          className="grid h-full w-full"
          style={{
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
          }}
        >
          {maze.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              let cellContent = null;
              let cellClass = 'flex items-center justify-center';

              if (cell === 'wall') {
                cellClass += ' bg-gray-700/50';
              } else {
                 cellClass += ' bg-gray-900';
              }

              if (cell === 'start') {
                cellContent = <Key className="h-3/4 w-3/4 text-yellow-400" />;
              } else if (cell === 'end') {
                cellContent = <Waypoints className="h-3/4 w-3/4 text-green-400 animate-pulse" />;
              }
              
              return (
                <div key={`${rowIndex}-${colIndex}`} className={cellClass}>
                  {cellContent}
                </div>
              );
            })
          )}
        </div>

        <motion.div
          className="absolute top-0 left-0"
          style={{
            width: `${100 / cols}%`,
            height: `${100 / rows}%`,
          }}
          initial={false}
          animate={{
            x: `${playerPosition.col * 100}%`,
            y: `${playerPosition.row * 100}%`,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="w-3/4 h-3/4 rounded-full bg-blue-400 shadow-lg"
              style={{
                backgroundImage: 'radial-gradient(circle, #a7d9f7 0%, #3a9de0 100%)',
                border: '2px solid #a7d9f7'
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FindWayPuzzle;
