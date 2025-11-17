/**
 * Componente App - Navegação Principal
 * 
 * Gerencia a navegação entre as páginas do jogo:
 * - Labirinto: jogo de programação com labirintos
 * - Quiz: quiz de perguntas e respostas
 */

import React, { useState } from 'react';
import QuizPage from './components/QuizPage';
import MazePage from './components/MazePage';
import LevelSelectPage from './components/LevelSelectPage';
import './App.css';

function App() {
  // Estado que controla qual página está sendo exibida ('maze', 'quiz' ou 'level-select')
  const [currentPage, setCurrentPage] = useState('maze');
  // Estado que controla o nível de dificuldade selecionado
  const [difficulty, setDifficulty] = useState(null);
  // Estado que controla se está na seleção de níveis
  const [showLevelSelect, setShowLevelSelect] = useState(false);

  const handleSelectLevel = (level) => {
    setDifficulty(level);
    setShowLevelSelect(false);
  };

  const handleMazeClick = () => {
    setCurrentPage('maze');
    setShowLevelSelect(true);
  };

  return (
    <div className="app-container">
      <nav className="main-navigation">
        <button
          className={`nav-btn ${currentPage === 'maze' ? 'active' : ''}`}
          onClick={handleMazeClick}
        >
          Labirinto
        </button>
        <button
          className={`nav-btn ${currentPage === 'quiz' ? 'active' : ''}`}
          onClick={() => {
            setCurrentPage('quiz');
            setShowLevelSelect(false);
          }}
        >
          Quiz
        </button>
      </nav>
      
      {showLevelSelect ? (
        <LevelSelectPage onSelectLevel={handleSelectLevel} />
      ) : currentPage === 'maze' && difficulty ? (
        <MazePage difficulty={difficulty} onBackToLevelSelect={() => setShowLevelSelect(true)} />
      ) : currentPage === 'quiz' ? (
        <QuizPage />
      ) : (
        <LevelSelectPage onSelectLevel={handleSelectLevel} />
      )}
    </div>
  );
}

export default App;
