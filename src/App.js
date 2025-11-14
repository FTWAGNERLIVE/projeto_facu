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
import './App.css';

function App() {
  // Estado que controla qual página está sendo exibida ('maze' ou 'quiz')
  const [currentPage, setCurrentPage] = useState('maze');

  return (
    <div className="app-container">
      <nav className="main-navigation">
        <button
          className={`nav-btn ${currentPage === 'maze' ? 'active' : ''}`}
          onClick={() => setCurrentPage('maze')}
        >
          Labirinto
        </button>
        <button
          className={`nav-btn ${currentPage === 'quiz' ? 'active' : ''}`}
          onClick={() => setCurrentPage('quiz')}
        >
          Quiz
        </button>
      </nav>
      
      {currentPage === 'maze' ? <MazePage /> : <QuizPage />}
    </div>
  );
}

export default App;
