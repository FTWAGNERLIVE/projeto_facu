/**
 * Constantes do Jogo
 * 
 * Centraliza todas as constantes utilizadas no jogo
 */

// ========== CONFIGURAÇÕES DE DIFICULDADE ==========
export const DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

export const DIFFICULTY_NAMES = {
  [DIFFICULTY.EASY]: 'Fácil',
  [DIFFICULTY.MEDIUM]: 'Médio',
  [DIFFICULTY.HARD]: 'Difícil'
};

export const DIFFICULTY_STARS = {
  [DIFFICULTY.EASY]: '⭐',
  [DIFFICULTY.MEDIUM]: '⭐⭐',
  [DIFFICULTY.HARD]: '⭐⭐⭐'
};

// ========== CONFIGURAÇÕES DE MAPA ==========
export const MAP_CONFIG = {
  EASY: {
    SIZE: 8,
    CELL_SIZE: 50,
    REQUIRES_KEY: false,
    HAS_PREVIEW: true
  },
  MEDIUM: {
    SIZE: 8,
    CELL_SIZE: 50,
    REQUIRES_KEY: false,
    HAS_PREVIEW: false
  },
  HARD: {
    SIZE: 10,
    CELL_SIZE: 40,
    REQUIRES_KEY: true,
    HAS_PREVIEW: false
  }
};

export const TOTAL_MAPS = 3;

// ========== CONFIGURAÇÕES DE TIMER ==========
export const TIMER_CONFIG = {
  INTERVAL_MS: 10,
  PHASE_TRANSITION_DELAY: 800,
  INITIAL_LOADING_DELAY: 600
};

// ========== CONFIGURAÇÕES DE CONTROLE ==========
export const GAMEPAD_CONFIG = {
  POLL_INTERVAL: 50,
  ANALOG_THRESHOLD: 0.5,
  BUTTONS: {
    X: 0,
    CIRCLE: 1,
    SQUARE: 2,
    TRIANGLE: 3,
    L2: 6,
    R2: 7,
    SHARE: 8,
    OPTIONS: 9,
    DPAD_UP: 12,
    DPAD_DOWN: 13,
    DPAD_LEFT: 14,
    DPAD_RIGHT: 15
  },
  AXES: {
    LEFT_STICK_X: 0,
    LEFT_STICK_Y: 1,
    RIGHT_STICK_X: 2,
    RIGHT_STICK_Y: 3,
    DPAD_X: 6,
    DPAD_Y: 7
  }
};

// ========== CONFIGURAÇÕES DE ANIMAÇÃO ==========
export const ANIMATION_CONFIG = {
  MOVEMENT_DURATION: 400,
  COLLISION_DURATION: 800,
  COMMAND_DELAY: 200
};

// ========== CONFIGURAÇÕES DE RANKING ==========
export const RANKING_CONFIG = {
  MAX_ENTRIES: 10,
  MAX_NAME_LENGTH: 20
};

// ========== SÍMBOLOS DO MAPA ==========
export const MAP_SYMBOLS = {
  WALL: '#',
  PATH: ' ',
  START: 'S',
  END: 'E',
  KEY: 'K'
};

// ========== COMANDOS DISPONÍVEIS ==========
export const AVAILABLE_COMMANDS = [
  { 
    id: 'up', 
    label: 'Mover para Cima', 
    command: 'y := y - 1', 
    icon: '↑' 
  },
  { 
    id: 'down', 
    label: 'Mover para Baixo', 
    command: 'y := y + 1', 
    icon: '↓' 
  },
  { 
    id: 'left', 
    label: 'Mover para Esquerda', 
    command: 'x := x - 1', 
    icon: '←' 
  },
  { 
    id: 'right', 
    label: 'Mover para Direita', 
    command: 'x := x + 1', 
    icon: '→' 
  }
];

// ========== DIRECÕES ==========
export const DIRECTIONS = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right'
};

