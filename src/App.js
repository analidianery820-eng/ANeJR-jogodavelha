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
import { useState, useEffect } from "react";

export default function App() {
 
  const [tabuleiro, setTabuleiro] = useState(Array(9).fill(null));
  const [turnoJogador1, setTurnoJogador1] = useState(true);
  const [vencedor, setVencedor] = useState(null);

  
  const [pokemon1, setPokemon1] = useState(null);
  const [pokemon2, setPokemon2] = useState(null);

 
  const [nomeP1, setNomeP1] = useState("pikachu");
  const [nomeP2, setNomeP2] = useState("bulbasaur");

  
  const [erro, setErro] = useState("");

  
  async function buscarPokemon(nomePokemon, númeroJogador) {
    try {
      const resposta = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${nomePokemon.toLowerCase().trim()}`
      );

      if (!resposta.ok) {
        throw new Error("Pokémon não encontrado.");
      }

      const dados = await resposta.json();

      
      if (númeroJogador === 1) {
        setPokemon1(dados);
      } else if (númeroJogador === 2) {
        setPokemon2(dados);
      }

    } catch (erroApi) {
      console.log(erroApi);
      
      setErro("Pokémon não encontrado.");
    }
  }

  
  // REQUISITO 1: useEffect executa apenas quando a página é aberta
  
  useEffect(() => {
    setErro("");
    buscarPokemon("pikachu", 1);
    buscarPokemon("bulbasaur", 2);
  }, []);

  
  function alterarPokemons() {
    setErro(""); 
    buscarPokemon(nomeP1, 1);
    buscarPokemon(nomeP2, 2);
    reiniciarJogo(); 
  }

  
  function clicarCasa(posicao) {
    
    if (tabuleiro[posicao] || vencedor || erro || !pokemon1 || !pokemon2) return;

    const novoTabuleiro = [...tabuleiro];
    
    novoTabuleiro[posicao] = turnoJogador1 ? pokemon1 : pokemon2;
    setTabuleiro(novoTabuleiro);

    /
    if (verificarGanhador(novoTabuleiro)) {
      setVencedor(turnoJogador1 ? pokemon1 : pokemon2);
    } else if (novoTabuleiro.every((casa) => casa !== null)) {
      setVencedor("Empate");
    } else {
      setTurnoJogador1(!turnoJogador1); 
    }
  }

  
  function verificarGanhador(quadrados) {
    const combinacoesDeVitoria = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
      [0, 4, 8], [2, 4, 6]             // Diagonais
    ];

    for (let i = 0; i < combinacoesDeVitoria.length; i++) {
      const [a, b, c] = combinacoesDeVitoria[i];
      if (quadrados[a] && quadrados[a].name === quadrados[b]?.name && quadrados[a].name === quadrados[c]?.name) {
        return true;
      }
    }
    return false;
  }


  function reiniciarJogo() {
    setTabuleiro(Array(9).fill(null));
    setTurnoJogador1(true);
    setVencedor(null);
  }

  return (
    <div style={{ fontFamily: "sans-serif", textAlign: "center", padding: "20px" }}>
      <h1>Poké-Tic-Tac-Toe</h1>

      
      <div style={{ marginBottom: "20px" }}>
        <div>
          <label>Jogador 1: </label>
          <input
            type="text"
            value={nomeP1}
            onChange={(e) => setNomeP1(e.target.value)}
            placeholder="Digite o nome do Pokémon 1"
          />
        </div>

        <div style={{ marginTop: "10px", marginBottom: "10px" }}>
          <label>Jogador 2: </label>
          <input
            type="text"
            value={nomeP2}
            onChange={(e) => setNomeP2(e.target.value)}
            placeholder="Digite o nome do Pokémon 2"
          />
        </div>

        <button onClick={alterarPokemons}>
          Alterar Pokémon
        </button>
      </div>

      
      {erro && <h3 style={{ color: "red" }}>⚠️ {erro}</h3>}

      
      {pokemon1 && pokemon2 && !erro && (
        <h2>
          {vencedor ? (
            vencedor === "Empate" ? "Deu Velha! Empate! 🤝" : `🏆 Vitória de: ${vencedor.name.toUpperCase()}`
          ) : (
            `Turno de: ${turnoJogador1 ? pokemon1.name.toUpperCase() : pokemon2.name.toUpperCase()}`
          )}
        </h2>
      )}

     
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 100px)",
        gridGap: "5px",
        justifyContent: "center",
        marginBottom: "20px"
      }}>
        {tabuleiro.map((casa, index) => (
          <button
            key={index}
            onClick={() => clicarCasa(index)}
            style={{
              width: "100px",
              height: "100px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            
            {casa && (
              <img 
                src={casa.sprites.front_default} 
                alt={casa.name} 
                style={{ width: "80px", height: "80px" }} 
              />
            )}
          </button>
        ))}
      </div>

      <button onClick={reiniciarJogo}>
        Reiniciar Partida
      </button>
    </div>
  );
}