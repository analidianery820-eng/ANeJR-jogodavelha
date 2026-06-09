export default function Square() {
  
  import React, { useState, useEffect, useCallback } from 'react';
import Board from './board';
import Scoreboard from './scoreboard';
import './styles.css'; // Conecta os estilos que estão na mesma pasta

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
  [0, 4, 8], [2, 4, 6]             // Diagonais
];

export default function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [moveDetails, setMoveDetails] = useState([]); 
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [isVsCpu, setIsVsCpu] = useState(false);
  const [scores, setScores] = useState({ x: 0, o: 0, ties: 0 });

  const currentSquares = history[stepNumber];

  const checkWinner = useCallback((squares) => {
    for (let combo of WINNING_COMBINATIONS) {
      const [a, b, c] = combo;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: combo };
      }
    }
    const isTie = squares.every(square => square !== null);
    return isTie ? { winner: 'Empate', line: null } : null;
  }, []);

  const gameResult = checkWinner(currentSquares);
  const winner = gameResult?.winner;
  const winningLine = gameResult?.line;

  useEffect(() => {
    if (winner === 'X') setScores(p => ({ ...p, x: p.x + 1 }));
    if (winner === 'O') setScores(p => ({ ...p, o: p.o + 1 }));
    if (winner === 'Empate') setScores(p => ({ ...p, ties: p.ties + 1 }));
  }, [winner]);

  const handleClick = (index) => {
    if (currentSquares[index] || winner || (isVsCpu && !xIsNext)) return;
    executeMove(index);
  };

  const executeMove = (index) => {
    const nextPlayer = xIsNext ? 'X' : 'O';
    const newHistory = history.slice(0, stepNumber + 1);
    const current = newHistory[newHistory.length - 1];
    const nextSquares = current.slice();
    
    nextSquares[index] = nextPlayer;

    setHistory([...newHistory, nextSquares]);
    setMoveDetails([...moveDetails.slice(0, stepNumber), { player: nextPlayer, position: index }]);
    setStepNumber(newHistory.length);
    setXIsNext(!xIsNext);
  };

  useEffect(() => {
    if (isVsCpu && !xIsNext && !winner) {
      const availableMoves = currentSquares
        .map((val, idx) => (val === null ? idx : null))
        .filter(val => val !== null);

      if (availableMoves.length > 0) {
        const timer = setTimeout(() => {
          const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
          executeMove(randomMove);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [xIsNext, isVsCpu, currentSquares, winner, stepNumber]);

  const restartGame = () => {
    setHistory([Array(9).fill(null)]);
    setMoveDetails([]);
    setStepNumber(0);
    setXIsNext(true);
  };

  const undoMove = () => {
    if (stepNumber === 0) return;
    if (isVsCpu && stepNumber >= 2) {
      setStepNumber(stepNumber - 2);
      setXIsNext(true);
    } else {
      setStepNumber(stepNumber - 1);
      setXIsNext(!xIsNext);
    }
  };

  let status = winner === 'Empate' ? 'Fim de jogo: Empate!' : winner ? `Vencedor: ${winner}` : `Vez do jogador: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div className="game-container">
      <h1>Jogo da Velha</h1>
      <div className="mode-selection">
        <label>
          <input type="checkbox" checked={isVsCpu} onChange={(e) => { setIsVsCpu(e.target.checked); restartGame(); }} />
          Jogar contra a Máquina (CPU)
        </label>
      </div>
      <div className="status-message">{status}</div>
      <div className="game-layout">
        <div className="game-board-section">
          <Board squares={currentSquares} onClick={handleClick} winningLine={winningLine} />
          <div className="controls">
            <button className="btn-restart" onClick={restartGame}>Reiniciar Jogo</button>
            <button className="btn-undo" onClick={undoMove} disabled={stepNumber === 0 || !!winner}>Desfazer Jogada</button>
          </div>
        </div>
        <div className="game-info-section">
          <Scoreboard scores={scores} />
          <div className="history-log">
            <h3>Histórico de Jogadas</h3>
            <ul>
              {moveDetails.slice(0, stepNumber).map((move, index) => (
                <li key={index}>Jogada {index + 1}: <strong>{move.player}</strong> na posição {move.position}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
}
