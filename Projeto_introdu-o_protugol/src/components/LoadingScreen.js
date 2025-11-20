/**
 * Componente LoadingScreen - Tela de Carregamento
 * 
 * Exibe uma tela de carregamento enquanto o jogo está sendo inicializado
 */

import React from 'react';
import { DIFFICULTY, DIFFICULTY_NAMES, DIFFICULTY_STARS } from '../constants/gameConstants';
import './LoadingScreen.css';

const LoadingScreen = ({ level }) => {
  const levelName = DIFFICULTY_NAMES[level] || 'Desconhecido';
  const levelStars = DIFFICULTY_STARS[level] || '';

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <h2 className="loading-title">Carregando Nível {levelStars}</h2>
        <p className="loading-subtitle">{levelName}</p>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

