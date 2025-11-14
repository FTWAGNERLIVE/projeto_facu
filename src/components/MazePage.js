/**
 * Componente MazePage - Jogo de Labirinto de Programação
 * 
 * Este componente implementa um jogo educativo onde o jogador precisa programar
 * comandos para navegar por um labirinto usando blocos de código Portugol.
 * 
 * Funcionalidades principais:
 * - Sistema de 3 mapas aleatórios (o 3º requer chave)
 * - Cronômetro com milissegundos
 * - Sistema de ranking (Top 10)
 * - Suporte a teclado e controle PS4
 * - Drag and drop de comandos
 */

import React, { useState, useRef, useEffect } from 'react';
import './MazePage.css';

const MazePage = () => {
  // ========== ESTADOS DO JOGO ==========
  // Posição do jogador no labirinto
  const [playerPosition, setPlayerPosition] = useState({ row: 1, col: 1 });
  // Fila de comandos a serem executados
  const [commandQueue, setCommandQueue] = useState([]);
  // Indica se os comandos estão sendo executados
  const [isExecuting, setIsExecuting] = useState(false);
  // Bloco sendo arrastado (drag and drop)
  const [draggedBlock, setDraggedBlock] = useState(null);
  // Índice do bloco selecionado (navegação por teclado)
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(0);
  
  // ========== ESTADOS DO CONTROLE PS4 ==========
  // Indica se um controle está conectado
  const [gamepadConnected, setGamepadConnected] = useState(false);
  // Índice do controle conectado
  const [gamepadIndex, setGamepadIndex] = useState(null);
  // Referência para o intervalo de polling do controle
  const gamepadPollInterval = useRef(null);
  // Estado dos botões do controle (para evitar repetição)
  const lastButtonStates = useRef({});
  
  // ========== ESTADOS DO CRONÔMETRO ==========
  // Tempo decorrido em milissegundos
  const [timer, setTimer] = useState(0);
  // Indica se o cronômetro está rodando
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  // Referência para o intervalo do cronômetro
  const timerInterval = useRef(null);
  
  // ========== ESTADOS DO SISTEMA DE MAPAS ==========
  // Índice do mapa atual (0, 1 ou 2)
  const [currentMapIndex, setCurrentMapIndex] = useState(0);
  // Quantidade de mapas completados (0 a 3)
  const [completedMaps, setCompletedMaps] = useState(0);
  // Indica se o jogador possui a chave (necessária no 3º mapa)
  const [hasKey, setHasKey] = useState(false);
  // Array com os 3 mapas selecionados aleatoriamente
  const [selectedMaps, setSelectedMaps] = useState([]);
  
  // ========== ESTADOS DO RANKING ==========
  // Indica se o modal de conclusão está visível
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  // Nome do jogador para salvar no ranking
  const [playerName, setPlayerName] = useState('');
  // Lista do ranking (Top 10)
  const [ranking, setRanking] = useState([]);
  
  // ========== MAPAS DO JOGO ==========
  // Array com todos os mapas disponíveis (18 mapas diferentes)
  // Cada mapa é uma matriz 8x8 onde:
  // '#' = parede (não pode passar)
  // ' ' = caminho livre
  // 'E' = destino final
  // 'K' = chave (necessária no 3º mapa)
  const allMazes = [
    // Mapa 1 - Destino no canto superior direito
    [
      ['#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', ' ', ' ', ' ', '#', ' ', ' ', 'E'],
      ['#', ' ', '#', ' ', '#', ' ', '#', '#'],
      ['#', ' ', ' ', ' ', ' ', ' ', ' ', '#'],
      ['#', '#', '#', ' ', '#', '#', ' ', '#'],
      ['#', ' ', ' ', ' ', ' ', ' ', ' ', '#'],
      ['#', ' ', '#', '#', '#', '#', ' ', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#']
    ],
    // Mapa 2 - Destino no centro superior
    [
      ['#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', ' ', ' ', ' ', 'E', ' ', ' ', '#'],
      ['#', ' ', '#', '#', '#', '#', ' ', '#'],
      ['#', ' ', ' ', ' ', ' ', ' ', ' ', '#'],
      ['#', '#', ' ', '#', '#', ' ', '#', '#'],
      ['#', ' ', ' ', ' ', ' ', ' ', ' ', '#'],
      ['#', ' ', '#', '#', '#', '#', ' ', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#']
    ],
    // Mapa 3 - Destino no meio direito (com chave)
    [
      ['#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', ' ', ' ', ' ', '#', ' ', ' ', '#'],
      ['#', ' ', '#', ' ', '#', ' ', '#', '#'],
      ['#', ' ', ' ', ' ', ' ', ' ', ' ', 'E'],
      ['#', '#', '#', ' ', '#', '#', ' ', '#'],
      ['#', ' ', ' ', ' ', ' ', '#', ' ', '#'],
      ['#', 'K', '#', '#', '#', '#', ' ', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#']
    ],
    // Mapa 4 - Destino no canto inferior esquerdo
    [
      ['#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', ' ', '#', ' ', ' ', ' ', ' ', '#'],
      ['#', ' ', '#', ' ', '#', '#', ' ', '#'],
      ['#', ' ', '#', ' ', ' ', '#', ' ', '#'],
      ['#', ' ', '#', '#', ' ', ' ', ' ', '#'],
      ['#', ' ', ' ', ' ', ' ', '#', ' ', '#'],
      ['E', ' ', '#', '#', '#', '#', ' ', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#']
    ],
    // Mapa 5 - Destino no centro
    [
      ['#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', ' ', ' ', ' ', '#', ' ', ' ', '#'],
      ['#', '#', '#', ' ', '#', ' ', '#', '#'],
      ['#', ' ', ' ', ' ', 'E', ' ', ' ', '#'],
      ['#', ' ', '#', '#', '#', '#', ' ', '#'],
      ['#', ' ', ' ', ' ', ' ', ' ', ' ', '#'],
      ['#', ' ', '#', ' ', '#', '#', '#', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#']
    ],
    // Mapa 6 - Destino no meio esquerdo
    [
      ['#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', ' ', ' ', ' ', ' ', ' ', ' ', '#'],
      ['#', ' ', '#', '#', '#', '#', ' ', '#'],
      ['E', ' ', ' ', ' ', ' ', ' ', ' ', '#'],
      ['#', '#', ' ', '#', '#', ' ', '#', '#'],
      ['#', ' ', ' ', ' ', ' ', ' ', ' ', '#'],
      ['#', ' ', '#', '#', '#', '#', ' ', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#']
    ],
    // Mapa 7 - Destino no canto superior esquerdo
    [
      ['#', '#', '#', '#', '#', '#', '#', '#'],
      ['E', ' ', ' ', '#', ' ', ' ', ' ', '#'],
      ['#', ' ', '#', '#', ' ', '#', ' ', '#'],
      ['#', ' ', ' ', ' ', ' ', '#', ' ', '#'],
      ['#', '#', '#', ' ', ' ', ' ', ' ', '#'],
      ['#', ' ', ' ', ' ', '#', '#', ' ', '#'],
      ['#', ' ', '#', '#', '#', '#', ' ', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#']
    ],
    // Mapa 8 - Destino no meio inferior
    [
      ['#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', ' ', ' ', ' ', ' ', '#', ' ', '#'],
      ['#', ' ', '#', '#', ' ', '#', ' ', '#'],
      ['#', ' ', ' ', '#', ' ', ' ', ' ', '#'],
      ['#', '#', ' ', '#', '#', '#', ' ', '#'],
      ['#', ' ', ' ', ' ', ' ', ' ', ' ', '#'],
      ['#', ' ', '#', '#', 'E', '#', ' ', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#']
    ],
    // Mapa 9 - Destino no canto inferior direito
    [
      ['#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', ' ', ' ', '#', ' ', ' ', ' ', '#'],
      ['#', ' ', '#', '#', ' ', '#', '#', '#'],
      ['#', ' ', ' ', ' ', ' ', ' ', ' ', '#'],
      ['#', '#', '#', ' ', '#', '#', ' ', '#'],
      ['#', ' ', ' ', ' ', ' ', ' ', ' ', '#'],
      ['#', ' ', '#', '#', '#', '#', ' ', 'E'],
      ['#', '#', '#', '#', '#', '#', '#', '#']
    ],
    // Mapa 10 - Destino no meio esquerdo superior
    [
      ['#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', ' ', ' ', ' ', ' ', ' ', ' ', '#'],
      ['E', ' ', '#', '#', '#', '#', ' ', '#'],
      ['#', ' ', ' ', ' ', ' ', '#', ' ', '#'],
      ['#', '#', '#', ' ', ' ', ' ', ' ', '#'],
      ['#', ' ', ' ', ' ', '#', '#', ' ', '#'],
      ['#', ' ', '#', '#', '#', '#', ' ', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#']
    ],
    // Mapa 11 - Destino no centro direito
    [
      ['#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', ' ', '#', ' ', ' ', ' ', ' ', '#'],
      ['#', ' ', '#', ' ', '#', '#', ' ', '#'],
      ['#', ' ', ' ', ' ', ' ', '#', ' ', 'E'],
      ['#', '#', '#', '#', ' ', ' ', ' ', '#'],
      ['#', ' ', ' ', ' ', ' ', '#', ' ', '#'],
      ['#', ' ', '#', '#', '#', '#', ' ', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#']
    ],
    // Mapa 12 - Destino no meio esquerdo inferior (mais difícil)
    [
      ['#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', ' ', ' ', ' ', '#', ' ', ' ', '#'],
      ['#', ' ', '#', ' ', '#', ' ', '#', '#'],
      ['#', ' ', ' ', ' ', ' ', ' ', ' ', '#'],
      ['#', '#', '#', ' ', '#', '#', ' ', '#'],
      ['#', ' ', ' ', ' ', ' ', ' ', ' ', '#'],
      ['E', ' ', '#', '#', '#', '#', ' ', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#']
    ],
    // Mapa 13 - Mais complexo, destino no topo
    [
      ['#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', ' ', ' ', 'E', ' ', ' ', ' ', '#'],
      ['#', ' ', '#', '#', '#', '#', ' ', '#'],
      ['#', ' ', ' ', ' ', ' ', '#', ' ', '#'],
      ['#', '#', '#', ' ', ' ', ' ', ' ', '#'],
      ['#', ' ', ' ', ' ', '#', '#', ' ', '#'],
      ['#', ' ', '#', '#', '#', '#', ' ', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#']
    ],
    // Mapa 14 - Labirinto em espiral, destino no centro (com chave)
    [
      ['#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', ' ', ' ', ' ', ' ', ' ', ' ', '#'],
      ['#', ' ', '#', '#', '#', '#', ' ', '#'],
      ['#', ' ', '#', ' ', 'E', '#', ' ', '#'],
      ['#', ' ', '#', ' ', '#', '#', ' ', '#'],
      ['#', 'K', '#', ' ', ' ', ' ', ' ', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#']
    ],
    // Mapa 15 - Múltiplos caminhos, destino no canto (com chave)
    [
      ['#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', ' ', ' ', ' ', ' ', ' ', ' ', '#'],
      ['#', ' ', '#', '#', ' ', '#', '#', '#'],
      ['#', ' ', ' ', '#', ' ', ' ', ' ', '#'],
      ['#', '#', ' ', '#', '#', '#', ' ', '#'],
      ['#', ' ', ' ', ' ', '#', ' ', ' ', '#'],
      ['#', 'K', '#', '#', '#', '#', ' ', 'E'],
      ['#', '#', '#', '#', '#', '#', '#', '#']
    ],
    // Mapa 16 - Mais difícil, destino no meio direito (com chave)
    [
      ['#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', ' ', '#', ' ', ' ', ' ', '#', '#'],
      ['#', ' ', '#', ' ', '#', ' ', ' ', '#'],
      ['#', ' ', ' ', ' ', '#', ' ', ' ', 'E'],
      ['#', '#', '#', ' ', ' ', ' ', '#', '#'],
      ['#', ' ', ' ', ' ', '#', ' ', ' ', '#'],
      ['#', 'K', '#', '#', '#', '#', ' ', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#']
    ],
    // Mapa 17 - Complexo com chave no meio
    [
      ['#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', ' ', ' ', ' ', '#', ' ', ' ', '#'],
      ['#', ' ', '#', ' ', '#', ' ', '#', '#'],
      ['#', ' ', ' ', 'K', ' ', ' ', ' ', 'E'],
      ['#', '#', '#', ' ', '#', '#', ' ', '#'],
      ['#', ' ', ' ', ' ', ' ', ' ', ' ', '#'],
      ['#', ' ', '#', '#', '#', '#', ' ', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#']
    ],
    // Mapa 18 - Muito difícil, destino no topo (com chave)
    [
      ['#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', ' ', ' ', 'E', ' ', ' ', ' ', '#'],
      ['#', ' ', '#', '#', '#', '#', ' ', '#'],
      ['#', ' ', ' ', ' ', ' ', '#', ' ', '#'],
      ['#', '#', '#', ' ', ' ', ' ', ' ', '#'],
      ['#', ' ', ' ', ' ', '#', '#', ' ', '#'],
      ['#', ' ', '#', '#', '#', '#', ' ', '#'],
      ['#', 'K', '#', '#', '#', '#', '#', '#']
    ]
  ];

  const [maze, setMaze] = useState(allMazes[0]);

  // Carregar ranking do localStorage
  useEffect(() => {
    const savedRanking = localStorage.getItem('mazeRanking');
    if (savedRanking) {
      setRanking(JSON.parse(savedRanking));
    }
  }, []);

  // Selecionar 3 mapas aleatórios no início (garantindo que o 3º tenha chave)
  useEffect(() => {
    if (selectedMaps.length === 0) {
      const mapsWithoutKey = allMazes.filter((m, idx) => !m.some(row => row.includes('K')));
      const mapsWithKey = allMazes.filter((m, idx) => m.some(row => row.includes('K')));
      
      // Selecionar 2 mapas aleatórios sem chave
      const shuffled = [...mapsWithoutKey].sort(() => Math.random() - 0.5);
      const selected = [shuffled[0], shuffled[1]];
      
      // Adicionar um mapa com chave como 3º
      const keyMap = mapsWithKey[Math.floor(Math.random() * mapsWithKey.length)];
      selected.push(keyMap);
      
      setSelectedMaps(selected);
      const firstMaze = selected[0];
      setMaze(firstMaze);
      const startPos = calculateStartPosition(firstMaze);
      setPlayerPosition(startPos);
      setCurrentMapIndex(0);
    }
  }, [selectedMaps.length]);

  // ========== FUNÇÕES AUXILIARES ==========
  
  /**
   * Calcula a posição inicial do jogador que esteja mais distante do destino
   * @param {Array} mazeLayout - Matriz do labirinto
   * @returns {Object} - Posição {row, col} mais distante do destino
   */
  const calculateStartPosition = (mazeLayout) => {
    // Encontrar posição do destino
    let endRow = -1;
    let endCol = -1;
    for (let i = 0; i < mazeLayout.length; i++) {
      for (let j = 0; j < mazeLayout[i].length; j++) {
        if (mazeLayout[i][j] === 'E') {
          endRow = i;
          endCol = j;
          break;
        }
      }
      if (endRow !== -1) break;
    }

    if (endRow === -1) {
      // Se não encontrar destino, usar posição padrão
      return { row: 1, col: 1 };
    }

    // Encontrar todas as posições válidas (espaços vazios, não paredes, não destino, não chave)
    const validPositions = [];
    for (let i = 0; i < mazeLayout.length; i++) {
      for (let j = 0; j < mazeLayout[i].length; j++) {
        const cell = mazeLayout[i][j];
        if (cell === ' ' || cell === 'S') { // S pode ser usado como ponto de início marcado
          validPositions.push({ row: i, col: j });
        }
      }
    }

    if (validPositions.length === 0) {
      return { row: 1, col: 1 };
    }

    // Calcular distância de cada posição válida até o destino
    let maxDistance = -1;
    let bestPosition = validPositions[0];

    validPositions.forEach(pos => {
      // Distância de Manhattan (soma das diferenças em linha e coluna)
      const distance = Math.abs(pos.row - endRow) + Math.abs(pos.col - endCol);
      if (distance > maxDistance) {
        maxDistance = distance;
        bestPosition = pos;
      }
    });

    return bestPosition;
  };

  const availableCommands = [
    { id: 'up', label: 'Mover para Cima', command: 'y := y - 1', icon: '↑' },
    { id: 'down', label: 'Mover para Baixo', command: 'y := y + 1', icon: '↓' },
    { id: 'left', label: 'Mover para Esquerda', command: 'x := x - 1', icon: '←' },
    { id: 'right', label: 'Mover para Direita', command: 'x := x + 1', icon: '→' }
    
  ];

  // ========== REFS PARA HOOKS ==========
  // Refs são usados para acessar valores atualizados dentro de useEffect
  // sem causar loops infinitos de re-renderização
  const commandQueueRef = useRef(commandQueue);
  const isExecutingRef = useRef(isExecuting);
  const selectedBlockIndexRef = useRef(selectedBlockIndex);
  const executeCommandsRef = useRef();
  const resetPositionRef = useRef();

  /**
   * Atualiza os refs sempre que os estados mudam
   * Isso permite que os useEffect acessem os valores mais recentes
   */
  useEffect(() => {
    commandQueueRef.current = commandQueue;
    isExecutingRef.current = isExecuting;
    selectedBlockIndexRef.current = selectedBlockIndex;
  }, [commandQueue, isExecuting, selectedBlockIndex]);

  // ========== HOOKS DO CRONÔMETRO ==========
  
  /**
   * Inicia o cronômetro quando o primeiro comando é adicionado à fila
   */
  useEffect(() => {
    if (commandQueue.length === 1 && !isTimerRunning) {
      setIsTimerRunning(true);
      setTimer(0);
    }
  }, [commandQueue.length, isTimerRunning]);

  /**
   * Atualiza o cronômetro a cada 10ms (para mostrar milissegundos)
   * Limpa o intervalo quando o cronômetro para
   */
  useEffect(() => {
    if (isTimerRunning) {
      timerInterval.current = setInterval(() => {
        setTimer(prev => prev + 10);
      }, 10);
    } else {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        timerInterval.current = null;
      }
    }

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        timerInterval.current = null;
      }
    };
  }, [isTimerRunning]);

  /**
   * Verifica se o jogador pegou a chave ao passar pela posição 'K'
   */
  useEffect(() => {
    const keyRow = maze.findIndex(row => row.includes('K'));
    const keyCol = keyRow >= 0 ? maze[keyRow].findIndex(cell => cell === 'K') : -1;
    
    if (keyRow >= 0 && keyCol >= 0 && 
        playerPosition.row === keyRow && 
        playerPosition.col === keyCol && 
        !hasKey) {
      setHasKey(true);
    }
  }, [playerPosition, maze, hasKey]);

  /**
   * Verifica se o jogador chegou no destino (E)
   * - Se for o 3º mapa, verifica se tem chave
   * - Avança para o próximo mapa ou completa o jogo
   * - O cronômetro só para quando completa os 3 mapas
   */
  useEffect(() => {
    const endRow = maze.findIndex(row => row.includes('E'));
    const endCol = endRow >= 0 ? maze[endRow].findIndex(cell => cell === 'E') : -1;
    
    if (endRow >= 0 && endCol >= 0 && 
        playerPosition.row === endRow && 
        playerPosition.col === endCol && 
        isTimerRunning) {
      // Se for o 3º mapa e não tem chave, não completa
      if (completedMaps === 2 && !hasKey) {
        return;
      }
      
      // Não parar o cronômetro aqui - ele só para quando completar os 3 mapas
      
      // Avançar para próximo mapa
      if (completedMaps < 2) {
        const nextMapIndex = currentMapIndex + 1;
        setCurrentMapIndex(nextMapIndex);
        if (selectedMaps.length > nextMapIndex) {
          const nextMaze = selectedMaps[nextMapIndex];
          setMaze(nextMaze);
          const startPos = calculateStartPosition(nextMaze);
          setPlayerPosition(startPos);
        }
        setCompletedMaps(prev => prev + 1);
        setCommandQueue([]);
        setHasKey(false);
        // Cronômetro continua rodando - não resetar
      } else {
        // Jogo completo! Parar cronômetro e mostrar modal
        setIsTimerRunning(false);
        setShowCompletionModal(true);
      }
    }
  }, [playerPosition, maze, isTimerRunning, completedMaps, hasKey, currentMapIndex, timer, selectedMaps]);

  // ========== HOOKS DO CONTROLE PS4 ==========
  
  /**
   * Detecta quando um controle é conectado ou desconectado
   * Verifica se já existe um controle conectado ao carregar a página
   */
  useEffect(() => {
    const handleGamepadConnected = (e) => {
      console.log('Gamepad conectado:', e.gamepad.id);
      setGamepadConnected(true);
      setGamepadIndex(e.gamepad.index);
    };

    const handleGamepadDisconnected = (e) => {
      console.log('Gamepad desconectado:', e.gamepad.id);
      setGamepadConnected(false);
      setGamepadIndex(null);
      if (gamepadPollInterval.current) {
        clearInterval(gamepadPollInterval.current);
        gamepadPollInterval.current = null;
      }
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    // Verificar se já há um gamepad conectado
    const gamepads = navigator.getGamepads();
    for (let i = 0; i < gamepads.length; i++) {
      if (gamepads[i]) {
        setGamepadConnected(true);
        setGamepadIndex(i);
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

  // Polling do gamepad
  useEffect(() => {
    if (!gamepadConnected || gamepadIndex === null) {
      if (gamepadPollInterval.current) {
        clearInterval(gamepadPollInterval.current);
        gamepadPollInterval.current = null;
      }
      return;
    }

    const pollGamepad = () => {
      const gamepad = navigator.getGamepads()[gamepadIndex];
      if (!gamepad) return;

      // D-Pad (PS4: axes 6 e 7 ou botões 12-15)
      // Botões do PS4: 0=X, 1=Círculo, 2=Quadrado, 3=Triângulo, 12-15=D-Pad
      const buttons = gamepad.buttons;
      const axes = gamepad.axes;

      // D-Pad Up (botão 12 ou eixo 7 < -0.5)
      if ((buttons[12] && buttons[12].pressed) || (axes[7] && axes[7] < -0.5)) {
        if (!lastButtonStates.current.dpadUp) {
          setSelectedBlockIndex(prev => {
            const newIndex = prev - 2;
            return newIndex >= 0 ? newIndex : prev;
          });
          lastButtonStates.current.dpadUp = true;
        }
      } else {
        lastButtonStates.current.dpadUp = false;
      }

      // D-Pad Down (botão 13 ou eixo 7 > 0.5)
      if ((buttons[13] && buttons[13].pressed) || (axes[7] && axes[7] > 0.5)) {
        if (!lastButtonStates.current.dpadDown) {
          setSelectedBlockIndex(prev => {
            const newIndex = prev + 2;
            return newIndex < availableCommands.length ? newIndex : prev;
          });
          lastButtonStates.current.dpadDown = true;
        }
      } else {
        lastButtonStates.current.dpadDown = false;
      }

      // D-Pad Left (botão 14 ou eixo 6 < -0.5)
      if ((buttons[14] && buttons[14].pressed) || (axes[6] && axes[6] < -0.5)) {
        if (!lastButtonStates.current.dpadLeft) {
          setSelectedBlockIndex(prev => {
            const newIndex = prev - 1;
            return newIndex >= 0 ? newIndex : prev;
          });
          lastButtonStates.current.dpadLeft = true;
        }
      } else {
        lastButtonStates.current.dpadLeft = false;
      }

      // D-Pad Right (botão 15 ou eixo 6 > 0.5)
      if ((buttons[15] && buttons[15].pressed) || (axes[6] && axes[6] > 0.5)) {
        if (!lastButtonStates.current.dpadRight) {
          setSelectedBlockIndex(prev => {
            const newIndex = prev + 1;
            return newIndex < availableCommands.length ? newIndex : prev;
          });
          lastButtonStates.current.dpadRight = true;
        }
      } else {
        lastButtonStates.current.dpadRight = false;
      }

      // X (botão 0) ou A - Adicionar à fila
      if (buttons[0] && buttons[0].pressed) {
        if (!lastButtonStates.current.buttonX) {
          const currentIndex = selectedBlockIndexRef.current;
          if (currentIndex >= 0 && currentIndex < availableCommands.length) {
            const selectedCommand = availableCommands[currentIndex];
            setCommandQueue(prev => [...prev, selectedCommand]);
          }
          lastButtonStates.current.buttonX = true;
        }
      } else {
        lastButtonStates.current.buttonX = false;
      }

      // Triângulo (botão 3) ou Y - Executar comandos
      if (buttons[3] && buttons[3].pressed) {
        if (!lastButtonStates.current.buttonTriangle && !isExecutingRef.current && commandQueueRef.current.length > 0) {
          if (executeCommandsRef.current) {
            executeCommandsRef.current();
          }
          lastButtonStates.current.buttonTriangle = true;
        }
      } else {
        lastButtonStates.current.buttonTriangle = false;
      }

      // R2 (botão 7) - Executar comandos (start)
      if (buttons[7] && buttons[7].pressed && buttons[7].value > 0.5) {
        if (!lastButtonStates.current.buttonR2 && !isExecutingRef.current && commandQueueRef.current.length > 0) {
          if (executeCommandsRef.current) {
            executeCommandsRef.current();
          }
          lastButtonStates.current.buttonR2 = true;
        }
      } else {
        lastButtonStates.current.buttonR2 = false;
      }

      // L2 (botão 6) - Limpar fila
      if (buttons[6] && buttons[6].pressed && buttons[6].value > 0.5) {
        if (!lastButtonStates.current.buttonL2) {
          setCommandQueue([]);
          lastButtonStates.current.buttonL2 = true;
        }
      } else {
        lastButtonStates.current.buttonL2 = false;
      }

      // Share/Select (botão 8) - Resetar jogo
      if (buttons[8] && buttons[8].pressed) {
        if (!lastButtonStates.current.buttonShare) {
          if (resetPositionRef.current) {
            resetPositionRef.current();
          }
          lastButtonStates.current.buttonShare = true;
        }
      } else {
        lastButtonStates.current.buttonShare = false;
      }
    };

    gamepadPollInterval.current = setInterval(pollGamepad, 50);
    
    return () => {
      if (gamepadPollInterval.current) {
        clearInterval(gamepadPollInterval.current);
        gamepadPollInterval.current = null;
      }
    };
  }, [gamepadConnected, gamepadIndex, selectedBlockIndex]);

  // ========== HOOKS DO TECLADO ==========
  
  /**
   * Gerencia a navegação por teclado
   * - Setas: navegar entre blocos de comando
   * - Espaço: adicionar comando selecionado à fila
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isExecuting) return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setSelectedBlockIndex(prev => {
            const newIndex = prev - 2;
            return newIndex >= 0 ? newIndex : prev;
          });
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedBlockIndex(prev => {
            const newIndex = prev + 2;
            return newIndex < availableCommands.length ? newIndex : prev;
          });
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setSelectedBlockIndex(prev => {
            const newIndex = prev - 1;
            return newIndex >= 0 ? newIndex : prev;
          });
          break;
        case 'ArrowRight':
          e.preventDefault();
          setSelectedBlockIndex(prev => {
            const newIndex = prev + 1;
            return newIndex < availableCommands.length ? newIndex : prev;
          });
          break;
        case ' ':
          e.preventDefault();
          if (selectedBlockIndex >= 0 && selectedBlockIndex < availableCommands.length) {
            const selectedCommand = availableCommands[selectedBlockIndex];
            setCommandQueue(prev => [...prev, selectedCommand]);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBlockIndex, isExecuting]);

  const handleDragStart = (e, command) => {
    setDraggedBlock(command);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (draggedBlock) {
      const newQueue = [...commandQueue];
      newQueue.splice(index, 0, draggedBlock);
      setCommandQueue(newQueue);
      setDraggedBlock(null);
    }
  };

  const handleDropQueue = (e) => {
    e.preventDefault();
    if (draggedBlock) {
      setCommandQueue([...commandQueue, draggedBlock]);
      setDraggedBlock(null);
    }
  };

  const removeCommand = (index) => {
    const newQueue = commandQueue.filter((_, i) => i !== index);
    setCommandQueue(newQueue);
  };

  const clearQueue = () => {
    setCommandQueue([]);
  };

  // ========== FUNÇÕES DE EXECUÇÃO ==========
  
  /**
   * Executa todos os comandos da fila sequencialmente
   * Move o jogador pelo labirinto de acordo com os comandos
   * Verifica colisões com paredes e coleta de chave
   */
  const executeCommands = async () => {
    if (commandQueueRef.current.length === 0 || isExecutingRef.current) return;

    setIsExecuting(true);
    let currentPos = { ...playerPosition };

    for (let i = 0; i < commandQueueRef.current.length; i++) {
      const cmd = commandQueueRef.current[i];
      let newPos = { ...currentPos };

      switch (cmd.id) {
        case 'up':
          if (currentPos.row > 0) {
            newPos.row = currentPos.row - 1;
          }
          break;
        case 'down':
          if (currentPos.row < maze.length - 1) {
            newPos.row = currentPos.row + 1;
          }
          break;
        case 'left':
          if (currentPos.col > 0) {
            newPos.col = currentPos.col - 1;
          }
          break;
        case 'right':
          if (currentPos.col < maze[0].length - 1) {
            newPos.col = currentPos.col + 1;
          }
          break;
        default:
          continue;
      }

      if (newPos.row >= 0 && newPos.row < maze.length &&
          newPos.col >= 0 && newPos.col < maze[0].length &&
          maze[newPos.row][newPos.col] !== '#') {
        currentPos = newPos;
        setPlayerPosition(currentPos);
        
        // Verificar se pegou a chave
        if (maze[currentPos.row][currentPos.col] === 'K' && !hasKey) {
          setHasKey(true);
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    setIsExecuting(false);
  };

  const resetPosition = () => {
    // Voltar para o primeiro mapa
    if (selectedMaps.length > 0) {
      const firstMaze = selectedMaps[0];
      setMaze(firstMaze);
      const startPos = calculateStartPosition(firstMaze);
      setPlayerPosition(startPos);
      setCurrentMapIndex(0);
      setCompletedMaps(0);
    } else {
      const startPos = calculateStartPosition(maze);
      setPlayerPosition(startPos);
    }
    setCommandQueue([]);
    setIsExecuting(false);
    setTimer(0);
    setIsTimerRunning(false);
    setHasKey(false);
  };

  // ========== FUNÇÕES DO RANKING ==========
  
  /**
   * Salva o tempo do jogador no ranking
   * Ordena por tempo (menor é melhor) e mantém apenas Top 10
   * Reseta o jogo após salvar
   */
  const handleSubmitScore = () => {
    if (playerName.trim()) {
      const finalTime = timer;
      const timeString = `${Math.floor(finalTime / 60000)}:${Math.floor((finalTime % 60000) / 1000).toString().padStart(2, '0')}.${Math.floor((finalTime % 1000) / 10).toString().padStart(2, '0')}`;
      
      const newEntry = {
        name: playerName.trim(),
        time: finalTime,
        timeString: timeString,
        date: new Date().toLocaleDateString('pt-BR'),
        timestamp: new Date().toISOString()
      };
      
      const newRanking = [...ranking, newEntry]
        .sort((a, b) => a.time - b.time)
        .slice(0, 10);
      
      setRanking(newRanking);
      localStorage.setItem('mazeRanking', JSON.stringify(newRanking));
      
      // Resetar para o início - selecionar novos mapas
      setSelectedMaps([]);
      setCurrentMapIndex(0);
      setCompletedMaps(0);
      setCommandQueue([]);
      setHasKey(false);
      setTimer(0);
      setIsTimerRunning(false);
      setShowCompletionModal(false);
      setPlayerName('');
      // A posição será definida quando os novos mapas forem selecionados
    }
  };

  /**
   * Limpa o ranking (com confirmação)
   * Remove do localStorage e do estado
   */
  const clearRanking = () => {
    if (window.confirm('Tem certeza que deseja limpar o ranking?')) {
      setRanking([]);
      localStorage.removeItem('mazeRanking');
    }
  };

  useEffect(() => {
    executeCommandsRef.current = executeCommands;
    resetPositionRef.current = resetPosition;
  });

  const renderMaze = () => {
    return maze.map((row, rowIndex) => (
      <div key={rowIndex} className="maze-row">
        {row.map((cell, colIndex) => {
          const isPlayer = playerPosition.row === rowIndex && playerPosition.col === colIndex;
          const isEnd = cell === 'E';
          const isKey = cell === 'K';
          
          return (
            <div
              key={colIndex}
              className={`maze-cell ${cell === '#' ? 'wall' : 'path'} ${isPlayer ? 'player' : ''} ${isEnd ? 'end' : ''} ${isKey ? 'key' : ''}`}
            >
              {isPlayer && <div className="player-char">😊</div>}
              {isEnd && !isPlayer && <div className="end-char">🏁</div>}
              {isKey && !isPlayer && !hasKey && <div className="key-char">🔑</div>}
            </div>
          );
        })}
      </div>
    ));
  };

  return (
    <div className="maze-page">
      <div className="maze-header">
        <h1>Labirinto de Programação</h1>
        <p>Arraste os blocos ou use as setas do teclado para navegar e ESPAÇO para adicionar à fila</p>
        <div className="timer-display">
          <span className="timer-label">Tempo:</span>
          <span className="timer-value">
            {Math.floor(timer / 60000)}:{(Math.floor((timer % 60000) / 1000)).toString().padStart(2, '0')}.{Math.floor((timer % 1000) / 10).toString().padStart(2, '0')}
          </span>
          {isTimerRunning && <span className="timer-running">⏱️</span>}
        </div>
        <div className="progress-display">
          <span className="progress-label">Mapa {currentMapIndex + 1}/3 | Completados: {completedMaps}/3</span>
          {completedMaps === 2 && !hasKey && (
            <span className="key-required">🔑 Pegue a chave para finalizar!</span>
          )}
          {hasKey && (
            <span className="key-obtained">🔑 Chave obtida!</span>
          )}
        </div>
        {gamepadConnected && (
          <div className="gamepad-status">
            Controle conectado! D-Pad: navegar | X: adicionar | Triângulo/R2: executar | L2: limpar | Share: resetar
          </div>
        )}
      </div>

      {/* Modal de Conclusão */}
      {showCompletionModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Parabéns! Você completou os 3 mapas!</h2>
            <div className="modal-time">
              Tempo: {Math.floor(timer / 60000)}:{(Math.floor((timer % 60000) / 1000)).toString().padStart(2, '0')}.{Math.floor((timer % 1000) / 10).toString().padStart(2, '0')}
            </div>
            <div className="modal-input-section">
              <label>Digite seu nome:</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Seu nome"
                className="name-input"
                maxLength={20}
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && playerName.trim()) {
                    handleSubmitScore();
                  }
                }}
              />
              <button 
                className="btn btn-primary" 
                onClick={handleSubmitScore}
                disabled={!playerName.trim()}
              >
                Salvar e Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="maze-container">
        {/* Ranking Sidebar */}
        <div className="ranking-sidebar">
          <div className="ranking-header">
            <h3>Top 10</h3>
            {ranking.length > 0 && (
              <button className="btn-clear-ranking" onClick={clearRanking} title="Limpar ranking">
                🗑️
              </button>
            )}
          </div>
          <div className="ranking-list">
            {ranking.length === 0 ? (
              <div className="no-ranking">
                <p>Nenhum recorde ainda</p>
                <small>Complete os 3 mapas para aparecer aqui!</small>
              </div>
            ) : (
              ranking.map((entry, index) => (
                <div key={`${entry.timestamp}-${index}`} className={`ranking-item ${index < 3 ? 'top-three' : ''}`}>
                  <div className="rank-position">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </div>
                  <div className="rank-info">
                    <div className="rank-name">{entry.name}</div>
                    <div className="rank-time">{entry.timeString}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="maze-section">
          <div className="maze-area">
            {renderMaze()}
          </div>
          
          <div className="maze-controls">
            <button 
              className="btn btn-execute" 
              onClick={executeCommands}
              disabled={isExecuting || commandQueue.length === 0}
            >
              {isExecuting ? 'Executando...' : '▶ Executar Comandos'}
            </button>
            <button className="btn btn-reset" onClick={resetPosition}>
              🔄 Resetar
            </button>
          </div>
        </div>

        <div className="commands-section">
          <div className="available-commands">
            <h3>Blocos de Comando</h3>
            <div className="commands-grid">
              {availableCommands.map((cmd, index) => (
                <div
                  key={cmd.id}
                  className={`command-block ${selectedBlockIndex === index ? 'selected' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, cmd)}
                  onClick={() => {
                    setSelectedBlockIndex(index);
                  }}
                >
                  <div className="block-icon">{cmd.icon}</div>
                  <div className="block-label">{cmd.label}</div>
                  <div className="block-code">{cmd.command}</div>
                  {selectedBlockIndex === index && (
                    <div className="block-selected-indicator">✓ Selecionado</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="command-queue">
            <div className="queue-header">
              <h3>Fila de Comandos</h3>
              {commandQueue.length > 0 && (
                <button className="btn-clear" onClick={clearQueue}>
                  Limpar
                </button>
              )}
            </div>
            
            <div
              className="queue-area"
              onDragOver={handleDragOver}
              onDrop={handleDropQueue}
            >
              {commandQueue.length === 0 ? (
                <div className="queue-empty">
                  Arraste os blocos aqui para criar a sequência de comandos
                </div>
              ) : (
                <div className="queue-items">
                  {commandQueue.map((cmd, index) => (
                    <div
                      key={index}
                      className={`queue-item ${index === commandQueue.length - 1 ? 'queue-item-new' : ''}`}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                    >
                      <span className="queue-number">{index + 1}</span>
                      <span className="queue-icon">{cmd.icon}</span>
                      <span className="queue-label">{cmd.label}</span>
                      <button
                        className="queue-remove"
                        onClick={() => removeCommand(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MazePage;

