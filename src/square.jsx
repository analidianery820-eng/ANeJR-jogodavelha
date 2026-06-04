import React from 'react';

export default function Square({ value, onClick, isWinning }) {
  return (
    <button 
      className={`square ${isWinning ? 'winning-square' : ''}`} 
      onClick={onClick}
    >
      {value}
    </button>
  );
}