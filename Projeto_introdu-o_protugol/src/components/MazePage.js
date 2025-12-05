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
import {
  DIFFICULTY,
  DIFFICULTY_NAMES,
  DIFFICULTY_STARS,
  MAP_CONFIG,
  TOTAL_MAPS,
  TIMER_CONFIG,
  GAMEPAD_CONFIG,
  ANIMATION_CONFIG,
  RANKING_CONFIG,
  MAP_SYMBOLS,
  AVAILABLE_COMMANDS,
  DIRECTIONS
} from '../constants/gameConstants';
import { MAZES_8X8, MAZES_10X10 } from '../data/mazeData';
import audioManager from '../utils/audioManager';
import rankingSync from '../utils/rankingSync';
import './MazePage.css';

const MazePage = ({ difficulty = 'medium', onBackToLevelSelect }) => {
  // ========== ESTADOS DO JOGO ==========
  // Posição do jogador no labirinto
  const [playerPosition, setPlayerPosition] = useState({ row: 1, col: 1 });
  // Posição anterior do jogador (para animação de deslizamento)
  const [previousPosition, setPreviousPosition] = useState({ row: 1, col: 1 });
  // Direção do movimento atual (para animação)
  const [moveDirection, setMoveDirection] = useState(null);
  // Direção atual do personagem (mantida mesmo quando parado)
  const [playerFacing, setPlayerFacing] = useState('down');
  // Indica se o personagem está andando
  const [isWalking, setIsWalking] = useState(false);
  // Frame atual da animação (1, 2, ou 3)
  const [animationFrame, setAnimationFrame] = useState(1);
  // Fila de comandos a serem executados (com ID único para cada comando)
  const [commandQueue, setCommandQueue] = useState([]);
  // Indica se o jogo foi iniciado (primeiro comando adicionado pelo usuário)
  const [gameStarted, setGameStarted] = useState(false);
  // Células que serão percorridas (para preview no nível fácil)
  const [previewPath, setPreviewPath] = useState(new Set());
  // Indica se os comandos estão sendo executados
  const [isExecuting, setIsExecuting] = useState(false);
  // Indica se está carregando o próximo mapa (transição entre fases)
  const [isLoadingMap, setIsLoadingMap] = useState(false);
  // Indica se está carregando o mapa inicial
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  // IDs dos comandos que estão sendo animados (desfragmentando)
  const [animatingIds, setAnimatingIds] = useState(new Set());
  // IDs dos comandos que colidiram com parede (animação vermelha)
  const [collidedIds, setCollidedIds] = useState(new Set());
  // Contador para gerar IDs únicos
  const commandIdCounter = useRef(0);
  // Bloco sendo arrastado (drag and drop)
  const [draggedBlock, setDraggedBlock] = useState(null);
  // Índice do bloco selecionado (navegação por teclado)
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(0);
  // Indica se está em dispositivo mobile
  const [isMobile, setIsMobile] = useState(false);
  
  // ========== ESTADOS DO CONTROLE PS4 ==========
  // Indica se um controle está conectado
  const [gamepadConnected, setGamepadConnected] = useState(false);
  // Índice do controle conectado
  const [gamepadIndex, setGamepadIndex] = useState(null);
  // Referência para o intervalo de polling do controle
  const gamepadPollInterval = useRef(null);
  // Estado dos botões do controle (para evitar repetição)
  const lastButtonStates = useRef({});
  // Flag para indicar se o componente acabou de ser montado (evitar comandos automáticos)
  const isComponentMounted = useRef(false);
  
  // ========== ESTADOS DO CRONÔMETRO ==========
  // Tempo decorrido em milissegundos (tempo total acumulado para exibição)
  const [timer, setTimer] = useState(0);
  // Tempo de cada fase individual (array com 3 valores)
  const [phaseTimes, setPhaseTimes] = useState([0, 0, 0]);
  // Timer individual da fase atual (começa em 0 a cada nova fase)
  const [currentPhaseTimer, setCurrentPhaseTimer] = useState(0);
  // Referência para o timer da fase atual (para captura precisa)
  const currentPhaseTimerRef = useRef(0);
  // Referência para armazenar o tempo acumulado das fases anteriores
  const accumulatedPhasesTimeRef = useRef(0);
  // Indica se o cronômetro está rodando
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  // Referência para o intervalo do cronômetro total
  const timerInterval = useRef(null);
  // Referência para o intervalo do cronômetro da fase atual
  const phaseTimerInterval = useRef(null);
  // Flag para evitar processamento múltiplo da conclusão de fase
  const isProcessingPhaseCompletion = useRef(false);
  
  // ========== ESTADOS DO SISTEMA DE MAPAS ==========
  // Mapa atual sendo jogado
  const [maze, setMaze] = useState([]);
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
  // Tempo final capturado quando o jogo é completado
  const [finalTime, setFinalTime] = useState(0);
  
  // ========== MAPAS DO JOGO ==========
  // Usar mapas importados do arquivo de dados
  const allMazes = MAZES_8X8;
  const allMazes10x10 = MAZES_10X10;

  // ========== FUNÇÕES AUXILIARES ==========
  
  /**
   * Calcula o preview do caminho baseado nos comandos da fila (nível fácil)
   * @returns {Set} - Set com as posições que serão percorridas
   */
  const calculatePreviewPath = () => {
    if (difficulty !== DIFFICULTY.EASY || commandQueue.length === 0 || !maze || maze.length === 0 || !maze[0]) {
      return new Set();
    }

    const path = new Set();
    let currentPos = { ...playerPosition };
    
    // Adicionar posição inicial
    path.add(`${currentPos.row},${currentPos.col}`);

    for (const cmd of commandQueue) {
      let newPos = { ...currentPos };

      switch (cmd.id) {
        case DIRECTIONS.UP:
          if (currentPos.row > 0) {
            newPos.row = currentPos.row - 1;
          }
          break;
        case DIRECTIONS.DOWN:
          if (currentPos.row < maze.length - 1) {
            newPos.row = currentPos.row + 1;
          }
          break;
        case DIRECTIONS.LEFT:
          if (currentPos.col > 0) {
            newPos.col = currentPos.col - 1;
          }
          break;
        case DIRECTIONS.RIGHT:
          if (currentPos.col < maze[0].length - 1) {
            newPos.col = currentPos.col + 1;
          }
          break;
        default:
          continue;
      }

      // Verificar se é movimento válido
      if (newPos.row >= 0 && newPos.row < maze.length &&
          newPos.col >= 0 && newPos.col < maze[0].length &&
          maze[newPos.row][newPos.col] !== MAP_SYMBOLS.WALL) {
        currentPos = newPos;
        path.add(`${currentPos.row},${currentPos.col}`);
      } else {
        // Colisão - parar preview
        break;
      }
    }

    return path;
  };

  /**
   * Seleciona 3 mapas aleatórios baseado na dificuldade
   * @returns {Array} - Array com 3 mapas selecionados
   */
  const selectNewMaps = () => {
    if (difficulty === DIFFICULTY.HARD) {
      // Nível difícil: usar mapas 10x10, todos com chave obrigatória
      const shuffled = [...allMazes10x10].sort(() => Math.random() - 0.5);
      return [shuffled[0], shuffled[1], shuffled[2]];
    } else if (difficulty === DIFFICULTY.EASY) {
      // Nível fácil: mapas 8x8 menores, sem chave
      const mapsWithoutKey = allMazes.filter((m, idx) => !m.some(row => row.includes(MAP_SYMBOLS.KEY)));
      const shuffled = [...mapsWithoutKey].sort(() => Math.random() - 0.5);
      return [shuffled[0], shuffled[1], shuffled[2] || shuffled[0]];
    } else {
      // Nível médio: mapas 8x8 padrão, todos sem chave
      const mapsWithoutKey = allMazes.filter((m, idx) => !m.some(row => row.includes(MAP_SYMBOLS.KEY)));
      const shuffled = [...mapsWithoutKey].sort(() => Math.random() - 0.5);
      return [shuffled[0], shuffled[1], shuffled[2] || shuffled[0]];
    }
  };
  
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
        if (mazeLayout[i][j] === MAP_SYMBOLS.END) {
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
        if (cell === MAP_SYMBOLS.PATH || cell === MAP_SYMBOLS.START) { // S pode ser usado como ponto de início marcado
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

  // Detectar se é dispositivo mobile
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 768 || 
                           (window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches) ||
                           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Carregar ranking e iniciar sincronização
  useEffect(() => {
    const loadRanking = async () => {
      const rankingType = `maze-${difficulty}`;
      const loadedRanking = await rankingSync.getRanking(rankingType);
      setRanking(loadedRanking);
    };
    
    loadRanking();
    
    // Iniciar sincronização automática
    rankingSync.startAutoSync(5000);
    
    // Limpar ao desmontar
    return () => {
      rankingSync.stopAutoSync();
    };
  }, [difficulty]);

  // Resetar carregamento inicial quando a dificuldade mudar
  useEffect(() => {
      setIsLoadingInitial(true);
      setTimeout(() => {
        setIsLoadingInitial(false);
      }, TIMER_CONFIG.INITIAL_LOADING_DELAY);
  }, [difficulty]);

  // Resetar mapas quando a dificuldade mudar
  useEffect(() => {
    setSelectedMaps([]);
  }, [difficulty]);

  // Selecionar 3 mapas aleatórios no início baseado na dificuldade
  useEffect(() => {
    // Resetar mapas quando a dificuldade mudar ou quando não houver mapas selecionados
    if (selectedMaps.length === 0) {
      const selected = selectNewMaps();
      setSelectedMaps(selected);
      const firstMaze = selected[0];
      setMaze(firstMaze);
      const startPos = calculateStartPosition(firstMaze);
      setPlayerPosition(startPos);
      setPreviousPosition(startPos);
      setCurrentMapIndex(0);
      setCompletedMaps(0);
      setHasKey(false);
      setCommandQueue([]);
      setGameStarted(false);
      // Iniciar com Forward1.png (frame 1, direção down)
      setPlayerFacing('down');
      setAnimationFrame(1);
      // Resetar estados dos botões para evitar comandos automáticos
      lastButtonStates.current = {};
      // Marcar que o componente foi montado após um pequeno delay (evitar comandos automáticos)
      isComponentMounted.current = false;
      setTimeout(() => {
        isComponentMounted.current = true;
      }, ANIMATION_CONFIG.COMMAND_DELAY * 2.5);
      
      // Iniciar música de fundo (se disponível)
      audioManager.playMusic('backgroundMusic');
      
      // Esconder o carregamento inicial após um delay
      setTimeout(() => {
        setIsLoadingInitial(false);
      }, TIMER_CONFIG.INITIAL_LOADING_DELAY);
    }
  }, [selectedMaps.length, difficulty]);
  
  // Limpar música quando o componente for desmontado
  useEffect(() => {
    return () => {
      audioManager.stopMusic();
    };
  }, []);

  // Calcular preview do caminho (nível fácil)
  useEffect(() => {
    // Não atualizar preview durante a execução para evitar piscar
    if (isExecuting) return;
    
    if (difficulty === DIFFICULTY.EASY && commandQueue.length > 0) {
      const path = calculatePreviewPath();
      setPreviewPath(path);
    } else {
      setPreviewPath(new Set());
    }
  }, [commandQueue.length, playerPosition.row, playerPosition.col, maze, difficulty, isExecuting]);

  // Usar comandos importados das constantes
  const availableCommands = AVAILABLE_COMMANDS;

  // ========== REFS PARA HOOKS ==========
  // Refs são usados para acessar valores atualizados dentro de useEffect
  // sem causar loops infinitos de re-renderização
  const commandQueueRef = useRef(commandQueue);
  const isExecutingRef = useRef(isExecuting);
  const selectedBlockIndexRef = useRef(selectedBlockIndex);
  const executeCommandsRef = useRef();
  const resetPositionRef = useRef();
  const timerRef = useRef(timer);
  const finalTimeRef = useRef(0);

  /**
   * Atualiza os refs sempre que os estados mudam
   * Isso permite que os useEffect acessem os valores mais recentes
   */
  useEffect(() => {
    commandQueueRef.current = commandQueue;
    isExecutingRef.current = isExecuting;
    selectedBlockIndexRef.current = selectedBlockIndex;
    timerRef.current = timer;
  }, [commandQueue, isExecuting, selectedBlockIndex, timer]);

  // ========== HOOKS DO CRONÔMETRO ==========
  
  /**
   * Inicia o cronômetro quando o primeiro comando é adicionado à fila pelo usuário
   * Inicia tanto o timer total quanto o timer da fase atual
   * Só inicia se o jogo foi realmente iniciado (gameStarted = true) OU se já está em uma fase subsequente
   */
  useEffect(() => {
    // Se já completou pelo menos uma fase, não precisa de gameStarted (já está em andamento)
    const canStartTimer = gameStarted || completedMaps > 0;
    
    if (commandQueue.length === 1 && !isTimerRunning && canStartTimer) {
      // Usar o ref que armazena o tempo acumulado das fases anteriores
      const totalTimeSoFar = accumulatedPhasesTimeRef.current;
      
      // Inicializar o timer total com a soma das fases anteriores
      setTimer(totalTimeSoFar);
      timerRef.current = totalTimeSoFar;
      
      // Iniciar o timer da fase atual em 0
      setCurrentPhaseTimer(0);
      currentPhaseTimerRef.current = 0;
      
      setIsTimerRunning(true);
    }
  }, [commandQueue.length, isTimerRunning, gameStarted, completedMaps]);

  /**
   * Atualiza o cronômetro total e da fase atual a cada 10ms
   * Limpa os intervalos quando o cronômetro para
   */
  useEffect(() => {
    if (isTimerRunning) {
      // Timer total (para exibição)
      timerInterval.current = setInterval(() => {
        setTimer(prev => {
          const newValue = prev + TIMER_CONFIG.INTERVAL_MS;
          timerRef.current = newValue;
          return newValue;
        });
      }, TIMER_CONFIG.INTERVAL_MS);
      
      // Timer da fase atual
      phaseTimerInterval.current = setInterval(() => {
        // Atualizar o ref primeiro (sempre tem o valor mais atualizado)
        currentPhaseTimerRef.current = (currentPhaseTimerRef.current || 0) + TIMER_CONFIG.INTERVAL_MS;
        // Depois atualizar o state
        setCurrentPhaseTimer(currentPhaseTimerRef.current);
      }, TIMER_CONFIG.INTERVAL_MS);
    } else {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        timerInterval.current = null;
      }
      if (phaseTimerInterval.current) {
        clearInterval(phaseTimerInterval.current);
        phaseTimerInterval.current = null;
      }
    }

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        timerInterval.current = null;
      }
      if (phaseTimerInterval.current) {
        clearInterval(phaseTimerInterval.current);
        phaseTimerInterval.current = null;
      }
    };
  }, [isTimerRunning]);

  /**
   * Verifica se o jogador pegou a chave ao passar pela posição 'K'
   */
  useEffect(() => {
    const keyRow = maze.findIndex(row => row.includes(MAP_SYMBOLS.KEY));
    const keyCol = keyRow >= 0 ? maze[keyRow].findIndex(cell => cell === MAP_SYMBOLS.KEY) : -1;
    
    if (keyRow >= 0 && keyCol >= 0 && 
        playerPosition.row === keyRow && 
        playerPosition.col === keyCol && 
        !hasKey) {
      setHasKey(true);
    }
  }, [playerPosition, maze, hasKey]);

  /**
   * Verifica se o jogador chegou no destino (E)
   * - Se for o 3º mapa (ou qualquer mapa no difícil), verifica se tem chave
   * - Avança para o próximo mapa ou completa o jogo
   * - O cronômetro só para quando completa os 3 mapas
   */
  useEffect(() => {
    const endRow = maze.findIndex(row => row.includes(MAP_SYMBOLS.END));
    const endCol = endRow >= 0 ? maze[endRow].findIndex(cell => cell === MAP_SYMBOLS.END) : -1;
    
    if (endRow >= 0 && endCol >= 0 && 
        playerPosition.row === endRow && 
        playerPosition.col === endCol && 
        isTimerRunning &&
        !isProcessingPhaseCompletion.current) {
      // Verificar se precisa de chave (apenas nível difícil)
      const needsKey = difficulty === DIFFICULTY.HARD;
      if (needsKey && !hasKey) {
        return;
      }
      
      // Marcar que estamos processando a conclusão da fase
      isProcessingPhaseCompletion.current = true;
      
      // Avançar para próximo mapa
      if (completedMaps < 2) {
        // Capturar o tempo da fase atual ANTES de parar o cronômetro
        // Usar o maior valor entre ref e state para garantir precisão
        const refTime = currentPhaseTimerRef.current || 0;
        const stateTime = currentPhaseTimer || 0;
        const currentPhaseTime = Math.max(refTime, stateTime);
        
        // Calcular o tempo acumulado das fases anteriores
        const previousPhasesTime = phaseTimes.reduce((sum, time) => sum + time, 0);
        // Calcular tempo total acumulado até agora (incluindo a fase atual)
        const totalTimeSoFar = previousPhasesTime + currentPhaseTime;
        
        // Salvar o tempo da fase no array usando função de atualização para evitar problemas de closure
        setPhaseTimes(prev => {
          const newPhaseTimes = [...prev];
          newPhaseTimes[currentMapIndex] = currentPhaseTime;
          
          // Atualizar o ref com o tempo acumulado das fases completadas
          accumulatedPhasesTimeRef.current = newPhaseTimes.reduce((sum, time) => sum + time, 0);
          
          return newPhaseTimes;
        });
        
        // Parar o cronômetro
        setIsTimerRunning(false);
        
        // Mostrar tela de carregamento
        setIsLoadingMap(true);
        
        // Aguardar um pouco para garantir que os intervalos foram limpos
        setTimeout(() => {
          // Avançar para o próximo mapa
          const nextMapIndex = currentMapIndex + 1;
          setCurrentMapIndex(nextMapIndex);
          if (selectedMaps.length > nextMapIndex) {
            const nextMaze = selectedMaps[nextMapIndex];
            setMaze(nextMaze);
            const startPos = calculateStartPosition(nextMaze);
            setPlayerPosition(startPos);
            setPreviousPosition(startPos);
          }
          setCompletedMaps(prev => prev + 1);
          setCommandQueue([]);
          setHasKey(false);
          // Iniciar nova fase com Forward1.png (frame 1, direção down)
          setPlayerFacing('down');
          setAnimationFrame(1);
          // NÃO resetar gameStarted aqui - manter true para próxima fase iniciar o cronômetro automaticamente
          // setGameStarted(false); // Removido - manter o jogo iniciado entre fases
          
          // Resetar o timer da fase atual para 0
          setCurrentPhaseTimer(0);
          currentPhaseTimerRef.current = 0;
          
          // Atualizar o timer total para refletir o tempo acumulado
          setTimer(totalTimeSoFar);
          timerRef.current = totalTimeSoFar;
          
          // Aguardar um pouco antes de esconder a tela de carregamento
          setTimeout(() => {
            setIsLoadingMap(false);
            // Resetar a flag após um delay para permitir que a próxima fase seja processada
            setTimeout(() => {
              isProcessingPhaseCompletion.current = false;
            }, 100);
          }, TIMER_CONFIG.PHASE_TRANSITION_DELAY); // Delay para mostrar a tela de carregamento
        }, 20);
      } else {
        // Jogo completo! Capturar o tempo da última fase ANTES de parar o cronômetro
        // Usar o maior valor entre ref e state para garantir precisão
        const refTime = currentPhaseTimerRef.current || 0;
        const stateTime = currentPhaseTimer || 0;
        const currentPhaseTime = Math.max(refTime, stateTime);
        
        // Salvar o tempo da última fase usando função de atualização
        setPhaseTimes(prev => {
          const newPhaseTimes = [...prev];
          newPhaseTimes[currentMapIndex] = currentPhaseTime;
          
          // Calcular o tempo total final (soma de todas as 3 fases)
          const finalTotalTime = newPhaseTimes.reduce((sum, time) => sum + time, 0);
          
          // Atualizar o ref
          accumulatedPhasesTimeRef.current = finalTotalTime;
          
          // Capturar o tempo final
          finalTimeRef.current = finalTotalTime;
          setFinalTime(finalTotalTime);
          
          return newPhaseTimes;
        });
        
        // Parar o cronômetro
        setIsTimerRunning(false);
        
        // Aguardar um pouco para garantir que os intervalos foram limpos
        setTimeout(() => {
          // Mostrar o modal
          setShowCompletionModal(true);
          // Resetar a flag
          isProcessingPhaseCompletion.current = false;
        }, 20);
      }
    }
  }, [playerPosition, maze, isTimerRunning, completedMaps, hasKey, currentMapIndex, selectedMaps, difficulty]);

  // ========== HOOKS DO CONTROLE PS4 ==========
  
  /**
   * Detecta quando um controle é conectado ou desconectado
   * Verifica se já existe um controle conectado ao carregar a página
   * Também verifica periodicamente para casos onde o evento não dispara
   */
  useEffect(() => {
    const handleGamepadConnected = (e) => {
      console.log('✅ Gamepad conectado:', e.gamepad.id);
      console.log('Índice do gamepad:', e.gamepad.index);
      console.log('Botões disponíveis:', e.gamepad.buttons.length);
      console.log('Eixos disponíveis:', e.gamepad.axes.length);
      setGamepadConnected(true);
      setGamepadIndex(e.gamepad.index);
    };

    const handleGamepadDisconnected = (e) => {
      console.log('❌ Gamepad desconectado:', e.gamepad.id);
      setGamepadConnected(false);
      setGamepadIndex(null);
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
          console.log(`🎮 Gamepad encontrado no índice ${i}:`, gamepads[i].id);
          console.log('Botões:', gamepads[i].buttons.length, 'Eixos:', gamepads[i].axes.length);
          if (!gamepadConnected || gamepadIndex !== i) {
            setGamepadConnected(true);
            setGamepadIndex(i);
          }
          return true;
        }
      }
      return false;
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    // Verificar imediatamente se já há um gamepad conectado
    console.log('🔍 Verificando gamepads existentes...');
    checkGamepads();
    
    // Verificar periodicamente (alguns navegadores não disparam o evento imediatamente)
    const checkInterval = setInterval(() => {
      if (!gamepadConnected) {
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
  }, [gamepadConnected, gamepadIndex]);

  // Polling do gamepad
  // Só funciona quando o MazePage está ativo (não na tela de seleção)
  useEffect(() => {
    if (!gamepadConnected || gamepadIndex === null) {
      if (gamepadPollInterval.current) {
        clearInterval(gamepadPollInterval.current);
        gamepadPollInterval.current = null;
      }
      return;
    }
    
    // Verificar periodicamente se o componente está ativo
    const checkActive = () => {
      const isActive = document.querySelector('.maze-page') !== null;
      if (!isActive && gamepadPollInterval.current) {
        clearInterval(gamepadPollInterval.current);
        gamepadPollInterval.current = null;
      }
      return isActive;
    };

    const pollGamepad = () => {
      // Verificar se o componente ainda está ativo
      if (!checkActive()) return;
      
      const gamepad = navigator.getGamepads()[gamepadIndex];
      if (!gamepad) return;

      // D-Pad e Analógicos (PS4: axes 0,1 para analógico esquerdo, 6,7 para D-Pad)
      // Botões do PS4: 0=X, 1=Círculo, 2=Quadrado, 3=Triângulo, 12-15=D-Pad
      const buttons = gamepad.buttons;
      const axes = gamepad.axes;

      // Threshold para considerar movimento do analógico (evitar drift)
      const analogThreshold = GAMEPAD_CONFIG.ANALOG_THRESHOLD;

      // Analógico esquerdo ou D-Pad Up (eixo 1 < -threshold ou eixo 7 < -threshold ou botão 12)
      const analogUp = axes[1] && axes[1] < -analogThreshold;
      const dpadUp = (buttons[12] && buttons[12].pressed) || (axes[7] && axes[7] < -analogThreshold);
      
      if (analogUp || dpadUp) {
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

      // Analógico esquerdo ou D-Pad Down (eixo 1 > threshold ou eixo 7 > threshold ou botão 13)
      const analogDown = axes[1] && axes[1] > analogThreshold;
      const dpadDown = (buttons[13] && buttons[13].pressed) || (axes[7] && axes[7] > analogThreshold);
      
      if (analogDown || dpadDown) {
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

      // Analógico esquerdo ou D-Pad Left (eixo 0 < -threshold ou eixo 6 < -threshold ou botão 14)
      const analogLeft = axes[0] && axes[0] < -analogThreshold;
      const dpadLeft = (buttons[14] && buttons[14].pressed) || (axes[6] && axes[6] < -analogThreshold);
      
      if (analogLeft || dpadLeft) {
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

      // Analógico esquerdo ou D-Pad Right (eixo 0 > threshold ou eixo 6 > threshold ou botão 15)
      const analogRight = axes[0] && axes[0] > analogThreshold;
      const dpadRight = (buttons[15] && buttons[15].pressed) || (axes[6] && axes[6] > analogThreshold);
      
      if (analogRight || dpadRight) {
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
      // Só processar se o componente já foi montado (evitar comandos automáticos)
      if (buttons[0] && buttons[0].pressed && isComponentMounted.current) {
        if (!lastButtonStates.current.buttonX) {
          const currentIndex = selectedBlockIndexRef.current;
          if (currentIndex >= 0 && currentIndex < availableCommands.length) {
            const selectedCommand = availableCommands[currentIndex];
            setCommandQueue(prev => {
              const newQueue = [...prev, { ...selectedCommand, uniqueId: commandIdCounter.current++ }];
              // Marcar que o jogo foi iniciado quando o primeiro comando é adicionado
              if (newQueue.length === 1) {
                setGameStarted(true);
              }
              return newQueue;
            });
          }
          lastButtonStates.current.buttonX = true;
        }
      } else {
        lastButtonStates.current.buttonX = false;
      }

      // Círculo (botão 1) ou B - Remover último comando da fila
      if (buttons[1] && buttons[1].pressed) {
        if (!lastButtonStates.current.buttonCircle && !isExecutingRef.current && commandQueueRef.current.length > 0) {
          setCommandQueue(prev => {
            if (prev.length === 0) return prev;
            return prev.slice(0, -1);
          });
          lastButtonStates.current.buttonCircle = true;
        }
      } else {
        lastButtonStates.current.buttonCircle = false;
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

      // Share/Select (botão 8) - Voltar para seleção de níveis
      if (buttons[8] && buttons[8].pressed) {
        if (!lastButtonStates.current.buttonShare) {
          if (onBackToLevelSelect) {
            onBackToLevelSelect();
          }
          lastButtonStates.current.buttonShare = true;
        }
      } else {
        lastButtonStates.current.buttonShare = false;
      }

      // Options/Menu (botão 9) - Resetar jogo
      if (buttons[9] && buttons[9].pressed) {
        if (!lastButtonStates.current.buttonOptions) {
          if (resetPositionRef.current) {
            resetPositionRef.current();
          }
          lastButtonStates.current.buttonOptions = true;
        }
      } else {
        lastButtonStates.current.buttonOptions = false;
      }
    };

    gamepadPollInterval.current = setInterval(pollGamepad, GAMEPAD_CONFIG.POLL_INTERVAL);
    
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
      // Se um input/textarea ou elemento editável estiver focado, não interceptar teclas
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable)) {
        return;
      }

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
            setCommandQueue(prev => {
              const newQueue = [...prev, { ...selectedCommand, uniqueId: commandIdCounter.current++ }];
              // Marcar que o jogo foi iniciado quando o primeiro comando é adicionado
              if (newQueue.length === 1) {
                setGameStarted(true);
              }
              return newQueue;
            });
          }
          break;
        case 'Enter':
          e.preventDefault();
          if (!isExecuting && commandQueue.length > 0) {
            if (executeCommandsRef.current) {
              executeCommandsRef.current();
            }
          }
          break;
        case 'c':
        case 'C':
          e.preventDefault();
          if (!isExecuting && commandQueue.length > 0) {
            setCommandQueue(prev => {
              if (prev.length === 0) return prev;
              return prev.slice(0, -1);
            });
          }
          break;
        case 'Escape':
          e.preventDefault();
          if (resetPositionRef.current) {
            resetPositionRef.current();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBlockIndex, isExecuting, commandQueue.length]);

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
      newQueue.splice(index, 0, { ...draggedBlock, uniqueId: commandIdCounter.current++ });
      setCommandQueue(newQueue);
      setDraggedBlock(null);
      // Marcar que o jogo foi iniciado quando o primeiro comando é adicionado
      if (newQueue.length === 1) {
        setGameStarted(true);
      }
    }
  };

  const handleDropQueue = (e) => {
    e.preventDefault();
    if (draggedBlock) {
      const newQueue = [...commandQueue, { ...draggedBlock, uniqueId: commandIdCounter.current++ }];
      setCommandQueue(newQueue);
      setDraggedBlock(null);
      // Marcar que o jogo foi iniciado quando o primeiro comando é adicionado
      if (newQueue.length === 1) {
        setGameStarted(true);
      }
    }
  };

  const removeCommand = () => {
    // Remove sempre o último bloco adicionado (último da fila)
    audioManager.playSound('buttonClick', null, 200);
    setCommandQueue(prev => {
      if (prev.length === 0) return prev;
      return prev.slice(0, -1);
    });
  };

  const clearQueue = () => {
    audioManager.playSound('buttonClick', null, 200);
    setCommandQueue([]);
  };

  // ========== FUNÇÃO PARA ADICIONAR COMANDO VIA BOTÃO MOBILE ==========
  const handleMobileCommandClick = (direction) => {
    if (isExecuting) return;
    
    // Encontrar o comando correspondente
    const command = AVAILABLE_COMMANDS.find(cmd => cmd.id === direction);
    if (!command) return;
    
    audioManager.playSound('buttonClick', null, 200);
    
    // Adicionar comando à fila
    const newQueue = [...commandQueue, { ...command, uniqueId: commandIdCounter.current++ }];
    setCommandQueue(newQueue);
    
    // Marcar que o jogo foi iniciado quando o primeiro comando é adicionado
    if (newQueue.length === 1) {
      setGameStarted(true);
    }
  };

  // ========== FUNÇÕES DE EXECUÇÃO ==========
  
  /**
   * Executa todos os comandos da fila sequencialmente
   * Move o jogador pelo labirinto de acordo com os comandos
   * Verifica colisões com paredes e coleta de chave
   */
  const executeCommands = async () => {
    if (commandQueueRef.current.length === 0 || isExecutingRef.current) return;
    if (!maze || maze.length === 0 || !maze[0]) {
      setIsExecuting(false);
      return;
    }

    // Tocar som de botão ao iniciar execução
    audioManager.playSound('buttonClick', null, 200);
    setIsExecuting(true);
    let currentPos = { ...playerPosition };
    const queue = [...commandQueueRef.current];

    for (let i = 0; i < queue.length; i++) {
      const cmd = queue[i];
      const cmdUniqueId = cmd.uniqueId !== undefined ? cmd.uniqueId : i; // Usar ID único se existir, senão usar índice
      
      let newPos = { ...currentPos };

      switch (cmd.id) {
        case DIRECTIONS.UP:
          if (currentPos.row > 0) {
            newPos.row = currentPos.row - 1;
          }
          break;
        case DIRECTIONS.DOWN:
          if (currentPos.row < maze.length - 1) {
            newPos.row = currentPos.row + 1;
          }
          break;
        case DIRECTIONS.LEFT:
          if (currentPos.col > 0) {
            newPos.col = currentPos.col - 1;
          }
          break;
        case DIRECTIONS.RIGHT:
          if (currentPos.col < maze[0].length - 1) {
            newPos.col = currentPos.col + 1;
          }
          break;
        default:
          continue;
      }

      // Verificar se há colisão com parede ou início (START)
      // NOTA: END não é bloqueado - o personagem pode entrar na linha de chegada
      const isValidPosition = newPos.row >= 0 && 
                               newPos.row < maze.length &&
                               newPos.col >= 0 && 
                               newPos.col < maze[0].length;
      
      const cellAtNewPos = isValidPosition ? maze[newPos.row][newPos.col] : null;
      
      // Bloquear movimento para START (não pode voltar ao início)
      // END é permitido - quando chegar lá, a execução será parada automaticamente
      const isWallCollision = !isValidPosition ||
                              cellAtNewPos === MAP_SYMBOLS.WALL ||
                              cellAtNewPos === MAP_SYMBOLS.START;

      if (isWallCollision) {
        // Colisão detectada - parar execução e mostrar animação vermelha
        // Adicionar animação vermelha no bloco que colidiu
        setCollidedIds(prev => new Set(prev).add(cmdUniqueId));
        
        // Parar som de movimento
        audioManager.stopSound('move');
        
        // Tocar som de colisão
        audioManager.playSound('collision');
        
        // Aguardar animação vermelha
        await new Promise(resolve => setTimeout(resolve, ANIMATION_CONFIG.COLLISION_DURATION));
        
        // Limpar toda a fila de comandos
        setCommandQueue([]);
        
        // Limpar todas as listas de animações
        setCollidedIds(new Set());
        setIsExecuting(false);
        setAnimatingIds(new Set());
        setMoveDirection(null);
        setIsWalking(false);
        return;
      }

      // Movimento válido - executar
      // Iniciar animação de desfragmentação para este comando
      setAnimatingIds(prev => new Set(prev).add(cmdUniqueId));
      
      // Determinar direção do movimento para animação
      let direction = null;
      if (newPos.row < currentPos.row) direction = 'up';
      else if (newPos.row > currentPos.row) direction = 'down';
      else if (newPos.col < currentPos.col) direction = 'left';
      else if (newPos.col > currentPos.col) direction = 'right';
      
      // Salvar posição anterior
      setPreviousPosition({ ...currentPos });
      
      // Atualizar direção que o personagem está olhando
      if (direction) {
        setPlayerFacing(direction);
      }
      
      // Atualizar posição do jogador primeiro (a transição CSS fará o movimento suave)
      currentPos = newPos;
      setPlayerPosition(currentPos);
      
      // Aplicar direção para animação visual e indicar que está andando
      setMoveDirection(direction);
      setIsWalking(true);
      
      // Tocar som de movimento
      audioManager.playSound('move');
      
      // Verificar se pegou a chave
      if (maze[currentPos.row][currentPos.col] === MAP_SYMBOLS.KEY && !hasKey) {
        setHasKey(true);
        // Tocar som de coleta de chave por 1 segundo
        audioManager.playSound('keyCollect', null, 1000);
      }
      
      // Verificar se chegou na linha de chegada (END) - parar execução IMEDIATAMENTE
      // Não executar mais comandos mesmo que ainda existam na fila
      if (maze[currentPos.row][currentPos.col] === MAP_SYMBOLS.END) {
        // Tocar som de chegada no destino
        // No nível difícil, se o mapa exige chave e o jogador ainda não a tem, suprimir o som
        const isHardNeedsKey = difficulty === DIFFICULTY.HARD && maze[currentPos.row][currentPos.col] === MAP_SYMBOLS.END && !hasKey;
        if (!isHardNeedsKey) {
          audioManager.playSound('goalReach');
        }
        
        // Animar frames: 1, 2, 1, 3 durante o movimento final
        const animateFinalMovement = async () => {
          // Frame 1
          setAnimationFrame(1);
          await new Promise(resolve => setTimeout(resolve, ANIMATION_CONFIG.MOVEMENT_DURATION / 4));
          
          // Frame 2
          setAnimationFrame(2);
          await new Promise(resolve => setTimeout(resolve, ANIMATION_CONFIG.MOVEMENT_DURATION / 4));
          
          // Frame 1 novamente
          setAnimationFrame(1);
          await new Promise(resolve => setTimeout(resolve, ANIMATION_CONFIG.MOVEMENT_DURATION / 4));
          
          // Frame 3
          setAnimationFrame(3);
          await new Promise(resolve => setTimeout(resolve, ANIMATION_CONFIG.MOVEMENT_DURATION / 4));
        };
        
        // Executar animação final
        await animateFinalMovement();
        
        // Limpar direção após animação e parar animação de andar
        setMoveDirection(null);
        setIsWalking(false);
        // Voltar para frame 1 quando parar
        setAnimationFrame(1);
        
        // Parar som de movimento quando parar de andar
        audioManager.stopSound('move');
        
        // Limpar toda a fila de comandos restantes
        setCommandQueue([]);
        
        // Remover da lista de animações
        setAnimatingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(cmdUniqueId);
          return newSet;
        });
        
        // Parar execução IMEDIATAMENTE - o useEffect vai detectar que chegou no END e processar a conclusão da fase
        setIsExecuting(false);
        return;
      }
      
      // Animar frames: 1, 2, 1, 3 durante o movimento
      const animateMovement = async () => {
        // Frame 1
        setAnimationFrame(1);
        await new Promise(resolve => setTimeout(resolve, ANIMATION_CONFIG.MOVEMENT_DURATION / 4));
        
        // Frame 2
        setAnimationFrame(2);
        await new Promise(resolve => setTimeout(resolve, ANIMATION_CONFIG.MOVEMENT_DURATION / 4));
        
        // Frame 1 novamente
        setAnimationFrame(1);
        await new Promise(resolve => setTimeout(resolve, ANIMATION_CONFIG.MOVEMENT_DURATION / 4));
        
        // Frame 3
        setAnimationFrame(3);
        await new Promise(resolve => setTimeout(resolve, ANIMATION_CONFIG.MOVEMENT_DURATION / 4));
      };
      
      // Executar animação
      await animateMovement();
      
      // Limpar direção após animação e parar animação de andar
      setMoveDirection(null);
      setIsWalking(false);
      // Voltar para frame 1 quando parar
      setAnimationFrame(1);
      
      // Parar som de movimento quando parar de andar
      audioManager.stopSound('move');
      
      // Remover o comando da fila após a animação usando o ID único
      setCommandQueue(prev => prev.filter(item => {
        const itemUniqueId = item.uniqueId;
        return itemUniqueId !== cmdUniqueId;
      }));
      
      // Remover da lista de animações
      setAnimatingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(cmdUniqueId);
        return newSet;
      });
      
      // Aguardar um pouco antes do próximo movimento
      await new Promise(resolve => setTimeout(resolve, ANIMATION_CONFIG.COMMAND_DELAY));
    }

    setIsExecuting(false);
    setAnimatingIds(new Set());
    setMoveDirection(null);
    setIsWalking(false);
    // Voltar para frame 1 quando terminar execução
    setAnimationFrame(1);
    
    // Parar som de movimento quando terminar execução
    audioManager.stopSound('move');
  };

  const resetPosition = () => {
    // Parar som de movimento se estiver tocando
    audioManager.stopSound('move');
    // Tocar som de botão
    audioManager.playSound('buttonClick', null, 200);
    // Selecionar novos mapas e voltar para o primeiro
    const selected = selectNewMaps();
    setSelectedMaps(selected);
    const firstMaze = selected[0];
    setMaze(firstMaze);
    const startPos = calculateStartPosition(firstMaze);
    setPlayerPosition(startPos);
    setPreviousPosition(startPos);
    setCurrentMapIndex(0);
    setCompletedMaps(0);
    setCommandQueue([]);
    setIsExecuting(false);
    // Iniciar com Forward1.png (frame 1, direção down)
    setPlayerFacing('down');
    setAnimationFrame(1);
    setTimer(0);
    setPhaseTimes([0, 0, 0]);
    setCurrentPhaseTimer(0);
    currentPhaseTimerRef.current = 0;
    accumulatedPhasesTimeRef.current = 0;
    isProcessingPhaseCompletion.current = false;
    setFinalTime(0);
    finalTimeRef.current = 0;
    setIsTimerRunning(false);
    setHasKey(false);
    setMoveDirection(null);
    setIsWalking(false);
    setGameStarted(false); // Resetar flag de jogo iniciado
    setIsLoadingMap(false); // Resetar tela de carregamento
    // Resetar estados dos botões para evitar comandos automáticos
    lastButtonStates.current = {};
    isComponentMounted.current = false; // Resetar flag de montagem
    // Remarcar como montado após um delay
    setTimeout(() => {
      isComponentMounted.current = true;
    }, ANIMATION_CONFIG.COMMAND_DELAY * 2.5);
  };

  // ========== FUNÇÕES DO RANKING ==========
  
  /**
   * Salva o tempo do jogador no ranking
   * Ordena por tempo (menor é melhor) e mantém apenas Top 10
   * Reseta o jogo após salvar
   */
  const handleSubmitScore = () => {
    if (playerName.trim()) {
      // Usar o tempo final capturado quando o jogo foi completado
      // Prioridade: finalTimeRef > finalTime > timerRef.current > timer
      const timeToSave = finalTimeRef.current > 0 ? finalTimeRef.current : 
                        (finalTime > 0 ? finalTime : 
                        (timerRef.current > 0 ? timerRef.current : 
                        (timer > 0 ? timer : 0)));
      
      // Se ainda não tiver tempo, usar um valor mínimo para não quebrar
      const validTime = timeToSave > 0 ? timeToSave : 1;
      
      const timeString = `${Math.floor(validTime / 60000)}:${Math.floor((validTime % 60000) / 1000).toString().padStart(2, '0')}.${Math.floor((validTime % 1000) / 10).toString().padStart(2, '0')}`;
      
      const newEntry = {
        name: playerName.trim(),
        time: validTime,
        timeString: timeString,
        date: new Date().toLocaleDateString('pt-BR'),
        timestamp: new Date().toISOString(),
        difficulty: difficulty
      };
      
      const newRanking = [...ranking, newEntry]
        .sort((a, b) => a.time - b.time)
        .slice(0, RANKING_CONFIG.MAX_ENTRIES);
      
      // Salvar usando sincronização
      const rankingType = `maze-${difficulty}`;
      rankingSync.saveRanking(rankingType, newRanking).then(updatedRanking => {
        setRanking(updatedRanking);
      });
      
      // Fechar o modal primeiro
      setShowCompletionModal(false);
      setPlayerName('');
      
      // Resetar para o início - selecionar novos mapas
      setSelectedMaps([]);
      setCurrentMapIndex(0);
      setCompletedMaps(0);
      setCommandQueue([]);
      setHasKey(false);
      setTimer(0);
      setPhaseTimes([0, 0, 0]);
      setCurrentPhaseTimer(0);
      currentPhaseTimerRef.current = 0;
      accumulatedPhasesTimeRef.current = 0;
      isProcessingPhaseCompletion.current = false;
      setFinalTime(0);
      finalTimeRef.current = 0;
      setIsTimerRunning(false);
      setGameStarted(false); // Resetar flag de jogo iniciado
      // A posição será definida quando os novos mapas forem selecionados
    }
  };

  /**
   * Limpa o ranking (com confirmação)
   * Remove do servidor e localStorage
   */
  const clearRanking = () => {
    if (window.confirm('Tem certeza que deseja limpar o ranking?')) {
      const rankingType = `maze-${difficulty}`;
      rankingSync.clearRanking(rankingType).then(() => {
        setRanking([]);
      });
    }
  };

  /**
   * Limpa todo o cache (localStorage)
   * Remove todos os dados salvos do jogo
   */
  const clearCache = () => {
    if (window.confirm('Tem certeza que deseja limpar todo o cache? Isso apagará todos os rankings salvos.')) {
      // Limpar todos os rankings de todas as dificuldades
      localStorage.removeItem('mazeRanking-easy');
      localStorage.removeItem('mazeRanking-medium');
      localStorage.removeItem('mazeRanking-hard');
      
      // Recarregar o ranking atual
      const rankingKey = `mazeRanking-${difficulty}`;
      const savedRanking = localStorage.getItem(rankingKey);
      if (savedRanking) {
        setRanking(JSON.parse(savedRanking));
      } else {
        setRanking([]);
      }
      
      // Tocar som de botão
      audioManager.playSound('buttonClick');
      
      alert('Cache limpo com sucesso!');
    }
  };

  useEffect(() => {
    executeCommandsRef.current = executeCommands;
    resetPositionRef.current = resetPosition;
  });

  /**
   * Obtém o nome da imagem baseado na direção e frame
   * @param {string} direction - Direção do personagem (down, up, left, right)
   * @param {number} frame - Frame da animação (1, 2, ou 3)
   * @returns {string} - Caminho da imagem
   */
  const getSpriteImage = (direction, frame) => {
    const directionMap = {
      'down': 'Forward',
      'up': 'Back',
      'left': 'Left',
      'right': 'Right'
    };
    
    const directionName = directionMap[direction] || 'Forward';
    // Caminho relativo à pasta public (começa com /)
    return `/sprites/player-sprites/${directionName}/${directionName}${frame}.png`;
  };

  const renderMaze = () => {
    // Verificar se o maze está inicializado
    if (!maze || maze.length === 0) {
      return (
        <div className="maze-wrapper">
          <div className="maze-loading">Carregando labirinto...</div>
        </div>
      );
    }
    
    // Calcular posição do personagem em pixels
    // Mapas 10x10 usam células menores para caber melhor na tela
    const difficultyKey = difficulty === DIFFICULTY.EASY ? 'EASY' : 
                          difficulty === DIFFICULTY.MEDIUM ? 'MEDIUM' : 'HARD';
    const cellSize = MAP_CONFIG[difficultyKey].CELL_SIZE;
    const playerX = playerPosition.col * cellSize;
    const playerY = playerPosition.row * cellSize;
    
    return (
      <div className="maze-wrapper">
        {maze.map((row, rowIndex) => (
          <div key={rowIndex} className="maze-row">
            {row.map((cell, colIndex) => {
              const isPlayer = playerPosition.row === rowIndex && playerPosition.col === colIndex;
              const isEnd = cell === MAP_SYMBOLS.END;
              const isKey = cell === MAP_SYMBOLS.KEY;
              const isPreview = previewPath.has(`${rowIndex},${colIndex}`) && !isPlayer;
              
              // Verificar se precisa de chave para completar (apenas nível difícil)
              const needsKey = difficulty === DIFFICULTY.HARD;
              const showLock = isEnd && needsKey && !hasKey;
              
              return (
                <div
                  key={colIndex}
                  className={`maze-cell ${cell === MAP_SYMBOLS.WALL ? 'wall' : 'path'} ${isPlayer ? 'player' : ''} ${isEnd ? 'end' : ''} ${isKey ? 'key' : ''} ${isPreview ? 'preview-path' : ''}`}
                  style={{
                    width: `${cellSize}px`,
                    height: `${cellSize}px`
                  }}
                >
                  {showLock && !isPlayer && <div className="lock-char">🔒</div>}
                  {isEnd && !isPlayer && !showLock && <div className="end-char">🏁</div>}
                  {isKey && !isPlayer && !hasKey && <div className="key-char">🔑</div>}
                </div>
              );
            })}
          </div>
        ))}
        {/* Personagem renderizado de forma absoluta sobre o labirinto */}
        <div 
          className={`player-char ${moveDirection ? `slide-${moveDirection}` : ''} facing-${playerFacing} ${isWalking ? 'walking' : 'idle'}`}
          style={{
            position: 'absolute',
            left: `${playerX}px`,
            top: `${playerY}px`,
            width: `${cellSize}px`,
            height: `${cellSize}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}
        >
          <img 
            className="player-sprite"
            src={getSpriteImage(playerFacing, isWalking ? animationFrame : 1)}
            alt="Personagem"
            onError={(e) => {
              console.error('Erro ao carregar sprite:', getSpriteImage(playerFacing, isWalking ? animationFrame : 1));
              // Fallback visual temporário
              e.target.style.display = 'none';
              e.target.parentElement.style.backgroundColor = '#3498db';
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="maze-page">
      <div className="maze-header"> 
        <div className={`header-top ${isMobile ? 'mobile-compact' : ''}`}>
          <h1>Labirinto de Programação</h1>
        </div>
        <div className="header-info-container">
          <div className={`difficulty-badge ${isMobile ? 'mobile-hidden' : ''}`}>
            {difficulty === DIFFICULTY.EASY && DIFFICULTY_STARS[DIFFICULTY.EASY] + ' ' + DIFFICULTY_NAMES[DIFFICULTY.EASY]}
            {difficulty === DIFFICULTY.MEDIUM && DIFFICULTY_STARS[DIFFICULTY.MEDIUM] + ' ' + DIFFICULTY_NAMES[DIFFICULTY.MEDIUM]}
            {difficulty === DIFFICULTY.HARD && DIFFICULTY_STARS[DIFFICULTY.HARD] + ' ' + DIFFICULTY_NAMES[DIFFICULTY.HARD]}
          </div>
          <div className="timer-display">
            <span className="timer-label">Tempo:</span>
            <span className="timer-value">
              {Math.floor(timer / 60000)}:{(Math.floor((timer % 60000) / 1000)).toString().padStart(2, '0')}.{Math.floor((timer % 1000) / 10).toString().padStart(2, '0')}
            </span>
            {isTimerRunning && <span className="timer-running">⏱️</span>}
          </div>
          <div className="progress-display">
            <span className="progress-label">Mapa {currentMapIndex + 1}/3 | Completados: {completedMaps}/3</span>
            {difficulty === DIFFICULTY.HARD && !hasKey && (
              <span className="key-required">🔑 Pegue a chave para finalizar!</span>
            )}
            {difficulty === DIFFICULTY.HARD && hasKey && (
              <span className="key-obtained">🔑 Chave obtida!</span>
            )}
          </div>
          <div className={`gamepad-status-display ${gamepadConnected ? 'connected' : 'disconnected'} ${isMobile ? 'mobile-hidden' : ''}`}>
            <span className="gamepad-status-label">Controle:</span>
            <span className="gamepad-status-value">
              {gamepadConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
          {onBackToLevelSelect && (
            <button 
              className={`btn-back-levels ${isMobile ? 'mobile-hidden' : ''}`}
              onClick={() => {
                audioManager.playSound('buttonClick', null, 200);
                onBackToLevelSelect();
              }}
              title="Voltar para seleção de níveis"
            >
              ← Voltar
            </button>
          )}
        </div>
      </div>

      {/* Modal de Conclusão */}
      {showCompletionModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Parabéns! Você completou os 3 mapas!</h2>
            <div className="modal-time">
              Tempo Total: {(() => {
                const displayTime = finalTimeRef.current > 0 ? finalTimeRef.current : 
                                  (finalTime > 0 ? finalTime : 
                                  (timerRef.current > 0 ? timerRef.current : timer));
                return `${Math.floor(displayTime / 60000)}:${Math.floor((displayTime % 60000) / 1000).toString().padStart(2, '0')}.${Math.floor((displayTime % 1000) / 10).toString().padStart(2, '0')}`;
              })()}
            </div>
            
            {/* Bloco de tempos por fase */}
            <div className="modal-phases-times">
              <h3>Tempos por Fase:</h3>
              <div className="phases-times-list">
                {phaseTimes.map((phaseTime, index) => {
                  const formatTime = (time) => {
                    if (time === 0) return '--:--.--';
                    return `${Math.floor(time / 60000)}:${Math.floor((time % 60000) / 1000).toString().padStart(2, '0')}.${Math.floor((time % 1000) / 10).toString().padStart(2, '0')}`;
                  };
                  return (
                    <div key={index} className="phase-time-item">
                      <span className="phase-label">Fase {index + 1}:</span>
                      <span className="phase-time-value">{formatTime(phaseTime)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="phases-total">
                <span className="total-label">Total Calculado:</span>
                <span className="total-time-value">
                  {(() => {
                    const totalCalculated = phaseTimes.reduce((sum, time) => sum + time, 0);
                    return `${Math.floor(totalCalculated / 60000)}:${Math.floor((totalCalculated % 60000) / 1000).toString().padStart(2, '0')}.${Math.floor((totalCalculated % 1000) / 10).toString().padStart(2, '0')}`;
                  })()}
                </span>
              </div>
            </div>
            
            <div className="modal-input-section">
              <label>Digite seu nome:</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Seu nome"
                className="name-input"
                maxLength={RANKING_CONFIG.MAX_NAME_LENGTH}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && playerName.trim()) {
                    e.preventDefault();
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
        <div className={`ranking-sidebar ${isMobile ? 'mobile-hidden' : ''}`}>
          <div className="ranking-header">
            <h3>Top 10 - {DIFFICULTY_NAMES[difficulty]}</h3>
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
          {/* Tela de carregamento entre mapas ou inicial */}
          {(isLoadingMap || isLoadingInitial) && (
            <div className="loading-map-overlay">
              <div className="loading-map-content">
                <div className="loading-spinner"></div>
                <h2>Carregando o mapa...</h2>
                <p>{isLoadingInitial ? 'Preparando o jogo' : 'Preparando o próximo desafio'}</p>
              </div>
            </div>
          )}
          <div className={`maze-area ${(isLoadingMap || isLoadingInitial) ? 'hidden' : ''}`}>
            {renderMaze()}
          </div>

          {/* Botões de Movimento Mobile */}
          <div className={`mobile-controls ${isMobile ? 'mobile-visible' : ''}`}>
            {/* Lado Esquerdo: Cima e Baixo */}
            <div className="mobile-controls-left">
              <button
                className="mobile-btn mobile-btn-up"
                onClick={() => handleMobileCommandClick('up')}
                disabled={isExecuting}
                aria-label="Mover para cima"
              >
                <span className="mobile-btn-icon">↑</span>
                <span className="mobile-btn-label">Cima</span>
              </button>
              <button
                className="mobile-btn mobile-btn-down"
                onClick={() => handleMobileCommandClick('down')}
                disabled={isExecuting}
                aria-label="Mover para baixo"
              >
                <span className="mobile-btn-icon">↓</span>
                <span className="mobile-btn-label">Baixo</span>
              </button>
            </div>

            {/* Lado Direito: Esquerda e Direita */}
            <div className="mobile-controls-right">
              <button
                className="mobile-btn mobile-btn-left"
                onClick={() => handleMobileCommandClick('left')}
                disabled={isExecuting}
                aria-label="Mover para esquerda"
              >
                <span className="mobile-btn-icon">←</span>
                <span className="mobile-btn-label">Esquerda</span>
              </button>
              <button
                className="mobile-btn mobile-btn-right"
                onClick={() => handleMobileCommandClick('right')}
                disabled={isExecuting}
                aria-label="Mover para direita"
              >
                <span className="mobile-btn-icon">→</span>
                <span className="mobile-btn-label">Direita</span>
              </button>
            </div>
          </div>
          
          <div className="maze-controls">
            <button 
              className="btn btn-execute" 
              onClick={executeCommands}
              disabled={isExecuting || commandQueue.length === 0}
            >
              {isExecuting ? 'Executando...' : '▶ Executar Comandos'}
            </button>
            <button className={`btn btn-reset ${isMobile ? 'mobile-hidden' : ''}`} onClick={resetPosition}>
              🔄 Resetar
            </button>
          </div>
        </div>

        <div className={`commands-section ${isMobile ? 'mobile-hidden' : ''}`}>
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
                  {commandQueue.map((cmd, index) => {
                    const cmdUniqueId = cmd.uniqueId !== undefined ? cmd.uniqueId : index;
                    return (
                      <div
                        key={cmdUniqueId}
                        className={`queue-item ${index === commandQueue.length - 1 ? 'queue-item-new' : ''} ${animatingIds.has(cmdUniqueId) ? 'queue-item-fragmenting' : ''} ${collidedIds.has(cmdUniqueId) ? 'queue-item-collision' : ''}`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                      >
                        <span className="queue-number">{index + 1}</span>
                        <span className="queue-icon">{cmd.icon}</span>
                        <span className="queue-label">{cmd.label}</span>
                        <button
                          className="queue-remove"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!isExecuting && commandQueue.length > 0) {
                              removeCommand();
                            }
                          }}
                          disabled={isExecuting || commandQueue.length === 0}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

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
                    audioManager.playSound('buttonClick', null, 200);
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
        </div>
      </div>
      
      {/* Botão de limpar cache - canto inferior direito */}
      <button 
        className="btn-clear-cache-fixed" 
        onClick={clearCache}
        title="Limpar Cache (apaga todos os rankings)"
      >
        🗑️
      </button>
    </div>
  );
};

export default MazePage;

