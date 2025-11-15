/**
 * Componente LevelSelectPage - Seleção de Níveis de Dificuldade
 * 
 * Permite ao jogador escolher entre três níveis de dificuldade:
 * - Fácil: Preview visual do caminho
 * - Médio: Jogo padrão
 * - Difícil: Mapas maiores com chave obrigatória
 */

import React, { useState, useEffect, useRef } from 'react';
import './LevelSelectPage.css';

const LevelSelectPage = ({ onSelectLevel }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const gamepadPollInterval = useRef(null);
  const gamepadIndex = useRef(null);
  const lastButtonStates = useRef({});

  // Detectar controle conectado
  useEffect(() => {
    const handleGamepadConnected = (e) => {
      gamepadIndex.current = e.gamepad.index;
    };

    const handleGamepadDisconnected = () => {
      gamepadIndex.current = null;
      if (gamepadPollInterval.current) {
        clearInterval(gamepadPollInterval.current);
        gamepadPollInterval.current = null;
      }
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    const gamepads = navigator.getGamepads();
    for (let i = 0; i < gamepads.length; i++) {
      if (gamepads[i]) {
        gamepadIndex.current = i;
        break;
      }
    }

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
      if (gamepadPollInterval.current) {
        clearInterval(gamepadPollInterval.current);
      }
    };
  }, []);

  // Polling do gamepad para navegação
  useEffect(() => {
    if (gamepadIndex.current === null) {
      if (gamepadPollInterval.current) {
        clearInterval(gamepadPollInterval.current);
        gamepadPollInterval.current = null;
      }
      return;
    }

    const pollGamepad = () => {
      const gamepad = navigator.getGamepads()[gamepadIndex.current];
      if (!gamepad) return;

      const buttons = gamepad.buttons;
      const axes = gamepad.axes;

      // D-Pad Left ou Analógico Left
      if ((buttons[14] && buttons[14].pressed) || (axes[6] && axes[6] < -0.5)) {
        if (!lastButtonStates.current.dpadLeft) {
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
          lastButtonStates.current.dpadLeft = true;
        }
      } else {
        lastButtonStates.current.dpadLeft = false;
      }

      // D-Pad Right ou Analógico Right
      if ((buttons[15] && buttons[15].pressed) || (axes[6] && axes[6] > 0.5)) {
        if (!lastButtonStates.current.dpadRight) {
          setSelectedIndex(prev => (prev < 2 ? prev + 1 : prev));
          lastButtonStates.current.dpadRight = true;
        }
      } else {
        lastButtonStates.current.dpadRight = false;
      }

      // X (botão 0) ou A - Selecionar nível
      if (buttons[0] && buttons[0].pressed) {
        if (!lastButtonStates.current.buttonX) {
          const levelToSelect = selectedIndex === 0 ? 'easy' : selectedIndex === 1 ? 'medium' : 'hard';
          onSelectLevel(levelToSelect);
          lastButtonStates.current.buttonX = true;
        }
      } else {
        lastButtonStates.current.buttonX = false;
      }
    };

    gamepadPollInterval.current = setInterval(pollGamepad, 50);

    return () => {
      if (gamepadPollInterval.current) {
        clearInterval(gamepadPollInterval.current);
        gamepadPollInterval.current = null;
      }
    };
  }, [selectedIndex, onSelectLevel]);

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setSelectedIndex(prev => (prev < 2 ? prev + 1 : prev));
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          const levelToSelect = selectedIndex === 0 ? 'easy' : selectedIndex === 1 ? 'medium' : 'hard';
          onSelectLevel(levelToSelect);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, onSelectLevel]);

  return (
    <div className="level-select-page">
      <div className="level-select-container">
        <h1>Escolha o Nível de Dificuldade</h1>
        <p className="level-select-subtitle">Selecione o nível que deseja jogar</p>
        
        <div className="levels-grid">
          <div 
            className={`level-card ${selectedIndex === 0 ? 'selected' : ''}`} 
            onClick={() => onSelectLevel('easy')}
          >
            <div className="level-icon easy">⭐</div>
            <h2>Fácil</h2>
            <p className="level-description">
              Preview visual do caminho conforme você monta os comandos
            </p>
            <div className="level-features">
              <span>✓ Preview visual</span>
              <span>✓ Mapas menores</span>
              <span>✓ Ideal para iniciantes</span>
            </div>
            {selectedIndex === 0 && <div className="selection-indicator">← Selecionado →</div>}
          </div>

          <div 
            className={`level-card ${selectedIndex === 1 ? 'selected' : ''}`} 
            onClick={() => onSelectLevel('medium')}
          >
            <div className="level-icon medium">⭐⭐</div>
            <h2>Médio</h2>
            <p className="level-description">
              Jogo padrão com desafio equilibrado
            </p>
            <div className="level-features">
              <span>✓ Mapas médios</span>
              <span>✓ Alguns mapas com chave</span>
              <span>✓ Desafio moderado</span>
            </div>
            {selectedIndex === 1 && <div className="selection-indicator">← Selecionado →</div>}
          </div>

          <div 
            className={`level-card ${selectedIndex === 2 ? 'selected' : ''}`} 
            onClick={() => onSelectLevel('hard')}
          >
            <div className="level-icon hard">⭐⭐⭐</div>
            <h2>Difícil</h2>
            <p className="level-description">
              Mapas maiores e todos requerem chave para completar
            </p>
            <div className="level-features">
              <span>✓ Mapas grandes</span>
              <span>✓ Chave obrigatória</span>
              <span>✓ Máximo desafio</span>
            </div>
            {selectedIndex === 2 && <div className="selection-indicator">← Selecionado →</div>}
          </div>
        </div>
        <p className="controls-hint">
          Use as setas do teclado ou D-Pad do controle para navegar | Enter, Space ou X para selecionar
        </p>
      </div>
    </div>
  );
};

export default LevelSelectPage;

