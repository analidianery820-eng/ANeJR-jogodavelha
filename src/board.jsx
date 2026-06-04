import React from 'react';
import Square from './Square';

export default function Board({ squares, onClick, winningLine }) {
  return (
    <div className="board">
      {squares.map((square, index) => {
        const isWinning = winningLine && winningLine.includes(index);
        return (
          <Square 
            key={index} 
            value={square} 
            onClick={() => onClick(index)} 
            isWinning={isWinning}
          />
        );
      })}
    </div>
  );
}