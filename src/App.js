import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import GameArea from './components/GameArea';
import QuizPage from './components/QuizPage';
import GuidePage from './components/GuidePage';
import PortugolInterpreter from './utils/PortugolInterpreter';
import { portugolExamples, getAllExamples } from './data/examples';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('game'); // 'game', 'quiz' ou 'guide'
  const [code, setCode] = useState(`algoritmo "Jogo do Personagem"
var
    x, y: inteiro
inicio
    // Posição inicial do personagem
    x := 100
    y := 100
    
    // Movimentação
    escreva("Personagem iniciando movimento...")
    
    // Mover para direita
    x := x + 50
    escreva("Movendo para direita...")
    
    // Mover para baixo
    y := y + 50
    escreva("Movendo para baixo...")
    
    // Mover para esquerda
    x := x - 30
    escreva("Movendo para esquerda...")
    
    // Mover para cima
    y := y - 20
    escreva("Movendo para cima...")
    
    escreva("Movimento concluído!")
fimalgoritmo`);

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [output, setOutput] = useState([]);
  const [characterPosition, setCharacterPosition] = useState({ x: 100, y: 100 });
  const [currentLine, setCurrentLine] = useState(0);
  const [selectedExample, setSelectedExample] = useState('basic');
  
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

  const executeCode = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setIsPaused(false);
    clearOutput();
    setCharacterPosition({ x: 100, y: 100 });
    setCurrentLine(0);

    try {
      addOutput("Iniciando execução do código...", "success");
      
      const result = await interpreterRef.current.execute(code, {
        onOutput: addOutput,
        onPositionChange: setCharacterPosition,
        onLineChange: setCurrentLine,
        onPause: () => setIsPaused(true),
        onResume: () => setIsPaused(false)
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
    addOutput("Execução interrompida pelo usuário.", "warning");
  };

  const resetGame = () => {
    stopCode();
    clearOutput();
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

  return (
    <div className="container">
      {/* Navegação */}
      <div className="navigation">
        <button 
          className={`nav-btn ${currentPage === 'game' ? 'active' : ''}`}
          onClick={() => setCurrentPage('game')}
        >
          🎮 Jogo de Programação
        </button>
        <button 
          className={`nav-btn ${currentPage === 'guide' ? 'active' : ''}`}
          onClick={() => setCurrentPage('guide')}
        >
          🎯 Guia Visual
        </button>
        <button 
          className={`nav-btn ${currentPage === 'quiz' ? 'active' : ''}`}
          onClick={() => setCurrentPage('quiz')}
        >
          📝 Questionário de Lógica
        </button>
      </div>

      {currentPage === 'game' ? (
        <div className="main-content">
          {/* Painel do Editor */}
          <div className="editor-panel">
        <div className="header">
          📝 Editor de Código Portugol
        </div>
        
        <div className="controls">
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
          
          <button className="btn btn-secondary" onClick={resetGame}>
            🔄 Reset
          </button>
        </div>

        <div className="examples-panel">
          <div className="examples-header">
            <strong>📚 Exemplos de Código:</strong>
          </div>
          <div className="examples-buttons">
            {getAllExamples().map(example => (
              <button
                key={example.key}
                className={`btn btn-example ${selectedExample === example.key ? 'active' : ''}`}
                onClick={() => loadExample(example.key)}
                title={example.title}
              >
                {example.title}
              </button>
            ))}
          </div>
        </div>

        <div className="editor-container">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: 'on'
            }}
          />
        </div>

        <div className="output-panel">
          <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#fff' }}>
            📊 Saída do Programa:
          </div>
          {output.map((line, index) => (
            <div key={index} className={`output-line ${line.type}`}>
              [{new Date(line.timestamp).toLocaleTimeString()}] {line.message}
            </div>
          ))}
        </div>
      </div>

      {/* Painel do Jogo */}
      <div className="game-panel">
        <div className="header">
          🎮 Área do Personagem
        </div>
        
        <GameArea
          ref={gameAreaRef}
          characterPosition={characterPosition}
          currentLine={currentLine}
          isRunning={isRunning}
          isPaused={isPaused}
          onPositionChange={setCharacterPosition}
          onCommandExecute={(command) => {
            addOutput(`Comando executado: ${command}`, 'success');
          }}
        />
      </div>
        </div>
      ) : currentPage === 'guide' ? (
        <GuidePage />
      ) : (
        <QuizPage />
      )}
    </div>
  );
}

export default App;
