import React from 'react';

export default function Scoreboard({ scores }) {
  return (
    <div className="scoreboard">
      <h3>Placar</h3>
      <div className="score-tier">
       <div>Vitórias X: <strong>{scores.x}</strong></div>
        <div>Vitórias O: <strong>{scores.o}</strong></div>
        <div>Empates: <strong>{scores.ties}</strong></div>
      </div>
    </div>
  );
}