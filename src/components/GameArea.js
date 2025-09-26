import React, { forwardRef, useEffect, useState, useCallback } from 'react';
import './GameArea.css';

const GameArea = forwardRef(({ 
  characterPosition, 
  currentLine, 
  isRunning, 
  isPaused,
  onPositionChange,
  onCommandExecute
}, ref) => {
  const [obstacles, setObstacles] = useState([]);
  const [animationClass, setAnimationClass] = useState('');
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState(1);
  const [visitedObstacles, setVisitedObstacles] = useState(new Set());
  const [instructionsMinimized, setInstructionsMinimized] = useState(false);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isManualMode, setIsManualMode] = useState(false);
  const [keyboardEnabled, setKeyboardEnabled] = useState(false);

  // Função para verificar sobreposição
  const isOverlapping = (newObstacle, existingObstacles) => {
    const minDistance = 80; // Distância mínima entre obstáculos aumentada
    return existingObstacles.some(obstacle => {
      const distance = Math.sqrt(
        Math.pow(newObstacle.x - obstacle.x, 2) + 
        Math.pow(newObstacle.y - obstacle.y, 2)
      );
      return distance < minDistance;
    });
  };

  const isInControlArea = (x, y) => {
    // Verificar se está na área dos controles (topo da tela)
    return (y < 120 && x < 400) || (y < 200 && x > 300);
  };

  // Criar obstáculos aleatórios sem sobreposição
  useEffect(() => {
    const newObstacles = [];
    const maxAttempts = 100;
    
    for (let i = 0; i < 8; i++) {
      let attempts = 0;
      let newObstacle;
      
      do {
        newObstacle = {
          id: i,
          x: Math.random() * 320 + 40,
          y: Math.random() * 220 + 40,
          type: Math.random() > 0.5 ? 'tree' : 'rock',
          size: Math.random() * 30 + 20,
          visited: false
        };
        attempts++;
      } while ((isOverlapping(newObstacle, newObstacles) || isInControlArea(newObstacle.x, newObstacle.y)) && attempts < maxAttempts);
      
      newObstacles.push(newObstacle);
    }
    setObstacles(newObstacles);
  }, []);

  // Controle por teclado
  const handleKeyPress = useCallback((event) => {
    if (!keyboardEnabled || isRunning) return;

    const step = 30;
    let newX = characterPosition.x;
    let newY = characterPosition.y;
    let command = '';

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        command = `y := y - ${step}`;
        newY = Math.max(40, characterPosition.y - step);
        break;
      case 'ArrowDown':
        event.preventDefault();
        command = `y := y + ${step}`;
        newY = Math.min(260, characterPosition.y + step);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        command = `x := x - ${step}`;
        newX = Math.max(40, characterPosition.x - step);
        break;
      case 'ArrowRight':
        event.preventDefault();
        command = `x := x + ${step}`;
        newX = Math.min(360, characterPosition.x + step);
        break;
      default:
        return;
    }

    // Atualizar posição
    if (onPositionChange) {
      onPositionChange({ x: newX, y: newY });
    }

    // Adicionar comando
    if (onCommandExecute) {
      onCommandExecute(command);
    }

    setCurrentCommand(command);
    setTimeout(() => setCurrentCommand(''), 1000);
  }, [keyboardEnabled, isRunning, characterPosition, onPositionChange, onCommandExecute]);

  // Adicionar/remover listener de teclado
  useEffect(() => {
    if (keyboardEnabled) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [keyboardEnabled, handleKeyPress]);

  // Verificar colisão com obstáculos e pontuar
  useEffect(() => {
    if (!isRunning || isPaused) return;

    const characterRadius = 20;
    const newVisitedObstacles = new Set(visitedObstacles);
    let scoreChange = 0;

    obstacles.forEach(obstacle => {
      if (obstacle.visited) return;

      const distance = Math.sqrt(
        Math.pow(characterPosition.x - obstacle.x, 2) + 
        Math.pow(characterPosition.y - obstacle.y, 2)
      );

      if (distance < characterRadius + obstacle.size / 2) {
        obstacle.visited = true;
        newVisitedObstacles.add(obstacle.id);
        
        if (obstacle.type === 'rock') {
          scoreChange += 10; // +10 pontos para pedras
        } else if (obstacle.type === 'tree') {
          scoreChange -= 5; // -5 pontos para árvores
        }
      }
    });

    if (scoreChange !== 0) {
      setScore(prev => Math.max(0, prev + scoreChange));
      setVisitedObstacles(newVisitedObstacles);
    }
  }, [characterPosition, isRunning, isPaused, obstacles, visitedObstacles]);

  // Animação do personagem baseada na fase
  useEffect(() => {
    if (isRunning && !isPaused) {
      if (phase === 1) {
        setAnimationClass('character-active');
      } else if (phase === 2) {
        setAnimationClass('character-spin');
      } else if (phase === 3) {
        setAnimationClass('character-dance');
      }
    } else {
      setAnimationClass('');
    }
  }, [isRunning, isPaused, phase]);

  const getObstacleEmoji = (type) => {
    return type === 'tree' ? '🌳' : '🪨';
  };

  const changePhase = (newPhase) => {
    setPhase(newPhase);
    setScore(0);
    setVisitedObstacles(new Set());
    const newObstacles = [];
    const maxAttempts = 100;
    
    for (let i = 0; i < 8; i++) {
      let attempts = 0;
      let newObstacle;
      
      do {
        newObstacle = {
          id: i,
          x: Math.random() * 300 + 50,
          y: Math.random() * 200 + 50,
          type: Math.random() > 0.5 ? 'tree' : 'rock',
          size: Math.random() * 30 + 20,
          visited: false
        };
        attempts++;
      } while (isOverlapping(newObstacle, newObstacles) && attempts < maxAttempts);
      
      newObstacles.push(newObstacle);
    }
    setObstacles(newObstacles);
  };

  const toggleKeyboardMode = () => {
    setKeyboardEnabled(!keyboardEnabled);
    setIsManualMode(!isManualMode);
  };

  return (
    <div className="game-container">
      {/* Debug Info */}
      <div className="debug-info">
        <div className="debug-item">
          <strong>Linha Atual:</strong> {currentLine}
        </div>
        <div className="debug-item">
          <strong>Posição:</strong> ({Math.round(characterPosition.x)}, {Math.round(characterPosition.y)})
        </div>
        <div className="debug-item">
          <strong>Status:</strong> 
          <span className={`status ${isRunning ? (isPaused ? 'paused' : 'running') : 'stopped'}`}>
            {isRunning ? (isPaused ? 'Pausado' : 'Executando') : 'Parado'}
          </span>
        </div>
        <div className="debug-item">
          <strong>Teclado:</strong> 
          <span className={`status ${keyboardEnabled ? 'running' : 'stopped'}`}>
            {keyboardEnabled ? 'Ativo' : 'Inativo'}
          </span>
        </div>
      </div>

      <div ref={ref} className="game-area">
        <div className="grid"></div>
        
        {/* Área de movimento delimitada */}
        <div className="movement-area"></div>
        
        {/* Obstáculos */}
        {obstacles.map(obstacle => (
          <div
            key={obstacle.id}
            className={`obstacle ${obstacle.type} ${obstacle.visited ? 'visited' : ''}`}
            style={{
              left: obstacle.x,
              top: obstacle.y,
              width: obstacle.size,
              height: obstacle.size,
              fontSize: obstacle.size * 0.6
            }}
          >
            {getObstacleEmoji(obstacle.type)}
          </div>
        ))}

        {/* Personagem */}
        <div
          className={`character ${animationClass}`}
          style={{
            left: characterPosition.x,
            top: characterPosition.y,
            transform: isPaused ? 'scale(1.1)' : 'scale(1)',
            filter: isPaused ? 'hue-rotate(180deg)' : 'none'
          }}
        >
          {isPaused ? '😴' : '😊'}
        </div>

        {/* Comando atual sendo executado */}
        {currentCommand && (
          <div className="current-command-display">
            <div className="command-text">{currentCommand}</div>
            <div className="command-arrow">
              {currentCommand.includes('x := x +') ? '→' : 
               currentCommand.includes('x := x -') ? '←' :
               currentCommand.includes('y := y +') ? '↓' :
               currentCommand.includes('y := y -') ? '↑' : '●'}
            </div>
          </div>
        )}

      {/* Controles de Fase */}
      <div className="phase-controls">
        <h4>🎮 Fases do Jogo</h4>
        <div className="phase-buttons">
          <button 
            className={`phase-btn ${phase === 1 ? 'active' : ''}`}
            onClick={() => changePhase(1)}
            disabled={isRunning}
          >
            🚀 Fase 1: Pontuação
          </button>
          <button 
            className={`phase-btn ${phase === 2 ? 'active' : ''}`}
            onClick={() => changePhase(2)}
            disabled={isRunning}
          >
            🌀 Fase 2: Rotação
          </button>
          <button 
            className={`phase-btn ${phase === 3 ? 'active' : ''}`}
            onClick={() => changePhase(3)}
            disabled={isRunning}
          >
            💃 Fase 3: Dança
          </button>
        </div>
      </div>

      {/* Pontuação */}
      <div className="score-display">
        <div className="score-item">
          <span className="score-label">Pontuação:</span>
          <span className="score-value">{score}</span>
        </div>
        <div className="score-item">
          <span className="score-label">Fase:</span>
          <span className="score-value">{phase}</span>
        </div>
      </div>

        {/* Controle de Teclado */}
        <div className="keyboard-controls">
          <button 
            className={`keyboard-btn ${keyboardEnabled ? 'active' : ''}`}
            onClick={toggleKeyboardMode}
            disabled={isRunning}
          >
            {keyboardEnabled ? '⌨️ Teclado Ativo' : '⌨️ Ativar Teclado'}
          </button>
          {keyboardEnabled && (
            <div className="keyboard-hint">
              Use as setas do teclado para mover
            </div>
          )}
        </div>

        {/* Instruções */}
        <div className={`instructions ${instructionsMinimized ? 'minimized' : ''}`}>
          <div className="instructions-header">
            <h3>🎯 Instruções do Jogo</h3>
            <button 
              className="minimize-btn"
              onClick={() => setInstructionsMinimized(!instructionsMinimized)}
              title={instructionsMinimized ? 'Expandir instruções' : 'Minimizar instruções'}
            >
              {instructionsMinimized ? '▶️' : '▼'}
            </button>
          </div>
          
          {!instructionsMinimized && (
            <div className="instructions-content">
              <p>Use comandos Portugol ou teclado para controlar o personagem:</p>
              <ul>
                <li><code>x := x + valor</code> ou <strong>→</strong> - Move para direita</li>
                <li><code>x := x - valor</code> ou <strong>←</strong> - Move para esquerda</li>
                <li><code>y := y + valor</code> ou <strong>↓</strong> - Move para baixo</li>
                <li><code>y := y - valor</code> ou <strong>↑</strong> - Move para cima</li>
                <li><code>escreva("texto")</code> - Mostra mensagem</li>
              </ul>
              
              <div className="phase-instructions">
                <h4>📋 Fases:</h4>
                <ul>
                  <li><strong>Fase 1:</strong> 🪨 +10 pontos, 🌳 -5 pontos</li>
                  <li><strong>Fase 2:</strong> Personagem roda em círculo</li>
                  <li><strong>Fase 3:</strong> Personagem executa dança</li>
                </ul>
                
                <h4>⚠️ Limites de Movimento:</h4>
                <ul>
                  <li><strong>X:</strong> 40px a 360px (horizontal)</li>
                  <li><strong>Y:</strong> 40px a 260px (vertical)</li>
                  <li>Personagem não pode sair da área tracejada</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

GameArea.displayName = 'GameArea';

export default GameArea;
