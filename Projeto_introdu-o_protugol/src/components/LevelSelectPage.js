/**
 * Componente LevelSelectPage - Seleção de Níveis de Dificuldade
 * 
 * Permite ao jogador escolher entre três níveis de dificuldade:
 * - Fácil: Preview visual do caminho
 * - Médio: Jogo padrão
 * - Difícil: Mapas maiores com chave obrigatória
 */

import React, { useState, useEffect, useRef } from 'react';
import { DIFFICULTY, DIFFICULTY_NAMES, DIFFICULTY_STARS, GAMEPAD_CONFIG } from '../constants/gameConstants';
import './LevelSelectPage.css';

const LevelSelectPage = ({ onSelectLevel }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const gamepadPollInterval = useRef(null);
  const gamepadIndex = useRef(null);
  const lastButtonStates = useRef({});

  // Detectar controle conectado
  useEffect(() => {
    const handleGamepadConnected = (e) => {
      console.log('✅ Gamepad conectado na seleção de níveis:', e.gamepad.id);
      console.log('Índice:', e.gamepad.index);
      gamepadIndex.current = e.gamepad.index;
    };

    const handleGamepadDisconnected = () => {
      console.log('❌ Gamepad desconectado na seleção de níveis');
      gamepadIndex.current = null;
      if (gamepadPollInterval.current) {
        clearInterval(gamepadPollInterval.current);
        gamepadPollInterval.current = null;
      }
    };

    // Função para verificar gamepads manualmente
    const checkGamepads = () => {
      const gamepads = navigator.getGamepads();
      for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
          console.log(`🎮 Gamepad encontrado na seleção de níveis (índice ${i}):`, gamepads[i].id);
          if (gamepadIndex.current !== i) {
            gamepadIndex.current = i;
          }
          return true;
        }
      }
      return false;
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    // Verificar imediatamente se já há um gamepad conectado
    console.log('🔍 Verificando gamepads na seleção de níveis...');
    checkGamepads();
    
    // Verificar periodicamente (alguns navegadores não disparam o evento imediatamente)
    const checkInterval = setInterval(() => {
      if (gamepadIndex.current === null) {
        checkGamepads();
      }
    }, 1000);

    // Limpar intervalo após 10 segundos (evitar verificação infinita)
    setTimeout(() => {
      clearInterval(checkInterval);
    }, 10000);

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
      clearInterval(checkInterval);
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

      // Threshold para considerar movimento do analógico (evitar drift)
      const analogThreshold = GAMEPAD_CONFIG.ANALOG_THRESHOLD;

      // Analógico esquerdo ou D-Pad Left (eixo 0 < -threshold ou eixo 6 < -threshold ou botão 14)
      const analogLeft = axes[0] && axes[0] < -analogThreshold;
      const dpadLeft = (buttons[14] && buttons[14].pressed) || (axes[6] && axes[6] < -analogThreshold);
      
      if (analogLeft || dpadLeft) {
        if (!lastButtonStates.current.dpadLeft) {
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
          lastButtonStates.current.dpadLeft = true;
        }
      } else {
        lastButtonStates.current.dpadLeft = false;
      }

      // Analógico esquerdo ou D-Pad Right (eixo 0 > threshold ou eixo 6 > threshold ou botão 15)
      const analogRight = axes[0] && axes[0] > analogThreshold;
      const dpadRight = (buttons[15] && buttons[15].pressed) || (axes[6] && axes[6] > analogThreshold);
      
      if (analogRight || dpadRight) {
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
          const levelToSelect = selectedIndex === 0 ? DIFFICULTY.EASY : selectedIndex === 1 ? DIFFICULTY.MEDIUM : DIFFICULTY.HARD;
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
          const levelToSelect = selectedIndex === 0 ? DIFFICULTY.EASY : selectedIndex === 1 ? DIFFICULTY.MEDIUM : DIFFICULTY.HARD;
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
            onClick={() => onSelectLevel(DIFFICULTY.EASY)}
          >
            <div className="level-icon easy">{DIFFICULTY_STARS[DIFFICULTY.EASY]}</div>
            <h2>{DIFFICULTY_NAMES[DIFFICULTY.EASY]}</h2>
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
            onClick={() => onSelectLevel(DIFFICULTY.MEDIUM)}
          >
            <div className="level-icon medium">{DIFFICULTY_STARS[DIFFICULTY.MEDIUM]}</div>
            <h2>{DIFFICULTY_NAMES[DIFFICULTY.MEDIUM]}</h2>
            <p className="level-description">
              Jogo padrão com desafio equilibrado
            </p>
            <div className="level-features">
              <span>✓ Mapas médios</span>
              <span>✓ Sem ajuda visual</span>
              <span>✓ Desafio moderado</span>
            </div>
            {selectedIndex === 1 && <div className="selection-indicator">← Selecionado →</div>}
          </div>

          <div 
            className={`level-card ${selectedIndex === 2 ? 'selected' : ''}`} 
            onClick={() => onSelectLevel(DIFFICULTY.HARD)}
          >
            <div className="level-icon hard">{DIFFICULTY_STARS[DIFFICULTY.HARD]}</div>
            <h2>{DIFFICULTY_NAMES[DIFFICULTY.HARD]}</h2>
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

