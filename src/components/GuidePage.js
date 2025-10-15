import React, { useState, useRef, useEffect, useCallback } from 'react';
import MobileGameControl from './MobileGameControl';
import PortugolInterpreter from '../utils/PortugolInterpreter';
import { portugolExamples, getAllExamples } from '../data/examples';
import './GuidePage.css';

const GuidePage = () => {
  const [code, setCode] = useState(`algoritmo "Guia Visual"
var
    x, y: inteiro
inicio
    // Posição inicial
    x := 100
    y := 100
    escreva("Iniciando guia visual...")
    
    // Movimento guiado
    x := x + 50
    escreva("Movendo para direita...")
    
    y := y + 30
    escreva("Movendo para baixo...")
    
    x := x - 20
    escreva("Movendo para esquerda...")
    
    y := y - 10
    escreva("Movendo para cima...")
    
    escreva("Guia concluída!")
fimalgoritmo`);

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [output, setOutput] = useState([]);
  const [characterPosition, setCharacterPosition] = useState({ x: 100, y: 100 });
  const [currentLine, setCurrentLine] = useState(0);
  const [selectedExample, setSelectedExample] = useState('guide');
  const [executedCommands, setExecutedCommands] = useState([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isManualMode, setIsManualMode] = useState(false);
  const [keyboardEnabled, setKeyboardEnabled] = useState(false);
  
  const interpreterRef = useRef(null);
  const gameAreaRef = useRef(null);

  useEffect(() => {
    interpreterRef.current = new PortugolInterpreter();
  }, []);

  const addOutput = (message, type = 'normal') => {
    setOutput(prev => [...prev, { message, type, timestamp: Date.now() }]);
  };

  const clearOutput = () => {
    setOutput([]);
  };

  const addCommand = (command, lineNumber) => {
    const newCommand = {
      id: Date.now(),
      command: command,
      lineNumber: lineNumber,
      timestamp: Date.now()
    };
    setExecutedCommands(prev => [...prev, newCommand]);
    setCurrentCommand(command);
  };

  const executeCode = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setIsPaused(false);
    clearOutput();
    setExecutedCommands([]);
    setCurrentCommand('');
    setCharacterPosition({ x: 100, y: 100 });
    setCurrentLine(0);

    try {
      addOutput("Iniciando execução do código...", "success");
      
      const result = await interpreterRef.current.execute(code, {
        onOutput: addOutput,
        onPositionChange: setCharacterPosition,
        onLineChange: setCurrentLine,
        onPause: () => setIsPaused(true),
        onResume: () => setIsPaused(false),
        onCommand: addCommand
      });

      if (result.success) {
        addOutput("Execução concluída com sucesso!", "success");
      } else {
        addOutput(`Erro: ${result.error}`, "error");
      }
    } catch (error) {
      addOutput(`Erro na execução: ${error.message}`, "error");
    } finally {
      setIsRunning(false);
      setIsPaused(false);
      setCurrentCommand('');
    }
  };

  const pauseCode = () => {
    if (interpreterRef.current) {
      interpreterRef.current.pause();
    }
  };

  const resumeCode = () => {
    if (interpreterRef.current) {
      interpreterRef.current.resume();
    }
  };

  const stopCode = () => {
    if (interpreterRef.current) {
      interpreterRef.current.stop();
    }
    setIsRunning(false);
    setIsPaused(false);
    setCharacterPosition({ x: 100, y: 100 });
    setCurrentLine(0);
    setCurrentCommand('');
    addOutput("Execução interrompida pelo usuário.", "warning");
  };

  const resetGame = () => {
    stopCode();
    clearOutput();
    setExecutedCommands([]);
    setCurrentCommand('');
    setCharacterPosition({ x: 100, y: 100 });
    setCurrentLine(0);
  };

  const loadExample = (exampleKey) => {
    const example = portugolExamples[exampleKey];
    if (example) {
      setCode(example.code);
      setSelectedExample(exampleKey);
      resetGame();
    }
  };

  const getDirectionArrow = (command) => {
    if (command.includes('x := x +')) return '→';
    if (command.includes('x := x -')) return '←';
    if (command.includes('y := y +')) return '↓';
    if (command.includes('y := y -')) return '↑';
    return '●';
  };

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
    setCharacterPosition({ x: newX, y: newY });
    
    // Adicionar comando à lista
    setExecutedCommands(prev => [...prev, { 
      command, 
      lineNumber: executedCommands.length + 1,
      timestamp: Date.now()
    }]);
    
    // Adicionar saída
    addOutput(`Movimento por teclado: ${command}`, 'success');
    
    // Atualizar comando atual
    setCurrentCommand(command);
    
    // Limpar comando atual após um tempo
    setTimeout(() => {
      setCurrentCommand('');
    }, 1000);
  }, [keyboardEnabled, isRunning, characterPosition, executedCommands.length, addOutput]);

  // Adicionar/remover listener de teclado
  useEffect(() => {
    if (keyboardEnabled) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [keyboardEnabled, handleKeyPress]);

  const executeManualMovement = (direction, value = 30) => {
    if (isRunning) return;
    
    let command = '';
    let newX = characterPosition.x;
    let newY = characterPosition.y;
    
    switch (direction) {
      case 'up':
        command = `y := y - ${value}`;
        newY = Math.max(40, characterPosition.y - value);
        break;
      case 'down':
        command = `y := y + ${value}`;
        newY = Math.min(260, characterPosition.y + value);
        break;
      case 'left':
        command = `x := x - ${value}`;
        newX = Math.max(40, characterPosition.x - value);
        break;
      case 'right':
        command = `x := x + ${value}`;
        newX = Math.min(360, characterPosition.x + value);
        break;
      default:
        return;
    }
    
    // Atualizar posição
    setCharacterPosition({ x: newX, y: newY });
    
    // Adicionar comando à lista
    setExecutedCommands(prev => [...prev, { 
      command, 
      lineNumber: executedCommands.length + 1,
      timestamp: Date.now()
    }]);
    
    // Adicionar saída
    addOutput(`Movimento manual: ${command}`, 'success');
    
    // Atualizar comando atual
    setCurrentCommand(command);
    
    // Limpar comando atual após um tempo
    setTimeout(() => {
      setCurrentCommand('');
    }, 1000);
  };

  const toggleMode = () => {
    setIsManualMode(!isManualMode);
    setKeyboardEnabled(!isManualMode);
    if (isManualMode) {
      resetGame();
    }
  };

  const toggleKeyboardMode = () => {
    setKeyboardEnabled(!keyboardEnabled);
  };

  const handleGameAction = (action, command = null) => {
    if (action === 'command' && command) {
      // Adicionar comando executado manualmente
      const newCommand = {
        id: Date.now(),
        command: command,
        timestamp: new Date().toLocaleTimeString(),
        type: 'manual'
      };
      setExecutedCommands(prev => [...prev, newCommand]);
      addOutput(`Comando executado: ${command}`);
      return;
    }

    switch (action) {
      case 'execute':
        executeCode();
        break;
      case 'pause':
        pauseCode();
        break;
      case 'stop':
        stopCode();
        break;
      case 'reset':
        resetGame();
        break;
      default:
        console.log('Ação desconhecida:', action);
    }
  };

  return (
    <div className="guide-container">
      <div className="guide-layout">
        {/* Painel de Controle Móvel */}
        <div className="editor-panel">
          <MobileGameControl
            characterPosition={characterPosition}
            onPositionChange={setCharacterPosition}
            onGameAction={handleGameAction}
          />
        </div>

        {/* Painel do Jogo com Guia */}
        <div className="game-panel">
          <div className="header">
            🎮 Guia Visual de Programação
            <div className="mode-indicator">
              {isManualMode ? '🎯 Modo Manual' : '📝 Modo Código'}
            </div>
          </div>
          
          <div className="controls">
            <button 
              className={`btn ${isManualMode ? 'btn-success' : 'btn-primary'}`}
              onClick={toggleMode}
            >
              {isManualMode ? '🎯 Modo Manual' : '📝 Modo Código'}
            </button>
            
            <button 
              className={`btn ${keyboardEnabled ? 'btn-success' : 'btn-secondary'}`}
              onClick={toggleKeyboardMode}
              disabled={isRunning}
            >
              {keyboardEnabled ? '⌨️ Teclado Ativo' : '⌨️ Ativar Teclado'}
            </button>
            
            {!isManualMode && (
              <>
                <button 
                  className="btn btn-primary" 
                  onClick={executeCode}
                  disabled={isRunning && !isPaused}
                >
                  ▶️ Executar
                </button>
                
                {isRunning && !isPaused && (
                  <button className="btn btn-secondary" onClick={pauseCode}>
                    ⏸️ Pausar
                  </button>
                )}
                
                {isPaused && (
                  <button className="btn btn-secondary" onClick={resumeCode}>
                    ▶️ Continuar
                  </button>
                )}
                
                <button 
                  className="btn btn-danger" 
                  onClick={stopCode}
                  disabled={!isRunning}
                >
                  ⏹️ Parar
                </button>
              </>
            )}
            
            <button className="btn btn-secondary" onClick={resetGame}>
              🔄 Reset
            </button>
          </div>
          
          <div className="game-area" ref={gameAreaRef}>
            <div className="grid"></div>
            
            {/* Setas direcionais */}
            <div className="direction-arrows">
              <button 
                className={`arrow arrow-up ${currentCommand.includes('y := y -') ? 'active' : ''} ${isManualMode ? 'clickable' : ''}`}
                onClick={() => isManualMode && executeManualMovement('up')}
                disabled={!isManualMode}
                title={isManualMode ? 'Mover para cima' : 'Modo manual desabilitado'}
              >
                ↑
              </button>
              <button 
                className={`arrow arrow-down ${currentCommand.includes('y := y +') ? 'active' : ''} ${isManualMode ? 'clickable' : ''}`}
                onClick={() => isManualMode && executeManualMovement('down')}
                disabled={!isManualMode}
                title={isManualMode ? 'Mover para baixo' : 'Modo manual desabilitado'}
              >
                ↓
              </button>
              <button 
                className={`arrow arrow-left ${currentCommand.includes('x := x -') ? 'active' : ''} ${isManualMode ? 'clickable' : ''}`}
                onClick={() => isManualMode && executeManualMovement('left')}
                disabled={!isManualMode}
                title={isManualMode ? 'Mover para esquerda' : 'Modo manual desabilitado'}
              >
                ←
              </button>
              <button 
                className={`arrow arrow-right ${currentCommand.includes('x := x +') ? 'active' : ''} ${isManualMode ? 'clickable' : ''}`}
                onClick={() => isManualMode && executeManualMovement('right')}
                disabled={!isManualMode}
                title={isManualMode ? 'Mover para direita' : 'Modo manual desabilitado'}
              >
                →
              </button>
            </div>

            {/* Personagem */}
            <div
              className={`character ${isRunning && !isPaused ? 'character-active' : ''}`}
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

            {/* Informações de debug */}
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
          </div>

          {/* Janela de Comandos Executados */}
          <div className="commands-panel">
            <div className="commands-header">
              <h3>📋 Comandos Executados</h3>
              <div className="current-command">
                <strong>Atual:</strong> {currentCommand || 'Nenhum'}
              </div>
            </div>
            
            <div className="commands-list">
              {executedCommands.length === 0 ? (
                <div className="no-commands">
                  <p>Nenhum comando executado ainda</p>
                  <small>Execute o código para ver os comandos aqui</small>
                </div>
              ) : (
                executedCommands.map((cmd, index) => (
                  <div key={cmd.id} className={`command-item ${index === executedCommands.length - 1 ? 'current' : ''}`}>
                    <div className="command-arrow">
                      {getDirectionArrow(cmd.command)}
                    </div>
                    <div className="command-content">
                      <div className="command-text">{cmd.command}</div>
                      <div className="command-line">Linha {cmd.lineNumber}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidePage;
