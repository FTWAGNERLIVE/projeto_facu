class PortugolInterpreter {
  constructor() {
    this.variables = {};
    this.isRunning = false;
    this.isPaused = false;
    this.currentLine = 0;
    this.callbacks = {};
    this.timeoutId = null;
    
    // Limites da área de movimento (ajustar conforme o tamanho da GameArea)
    this.movementLimits = {
      x: { min: 40, max: 360 }, // 40px de margem de cada lado
      y: { min: 40, max: 260 }  // 40px de margem de cada lado
    };
  }

  async execute(code, callbacks = {}) {
    this.callbacks = callbacks;
    this.isRunning = true;
    this.isPaused = false;
    this.variables = {};
    this.currentLine = 0;

    try {
      // Limpar código e dividir em linhas
      const lines = this.cleanCode(code);
      
      for (let i = 0; i < lines.length; i++) {
        if (!this.isRunning) break;
        
        // Aguardar se pausado
        while (this.isPaused && this.isRunning) {
          await this.sleep(100);
        }
        
        if (!this.isRunning) break;
        
        this.currentLine = i + 1;
        if (this.callbacks.onLineChange) {
          this.callbacks.onLineChange(this.currentLine);
        }
        
        const line = lines[i].trim();
        if (!line || line.startsWith('//') || line.startsWith('algoritmo') || line.startsWith('fimalgoritmo')) {
          continue;
        }
        
        await this.executeLine(line);
        await this.sleep(500); // Pausa entre comandos para visualização
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      this.isRunning = false;
      this.isPaused = false;
    }
  }

  cleanCode(code) {
    return code
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }

  async executeLine(line) {
    // Comando escreva
    if (line.startsWith('escreva(')) {
      const match = line.match(/escreva\("([^"]*)"\)/);
      if (match) {
        const message = match[1];
        if (this.callbacks.onOutput) {
          this.callbacks.onOutput(message, 'normal');
        }
      }
      return;
    }

    // Atribuição de variáveis
    if (line.includes(':=')) {
      const [varName, expression] = line.split(':=').map(s => s.trim());
      
      if (varName === 'x' || varName === 'y') {
        const value = this.evaluateExpression(expression);
        const oldValue = this.variables[varName] || 0;
        
        // Aplicar limites de área de movimento
        const limitedValue = this.applyMovementLimits(varName, value);
        this.variables[varName] = limitedValue;
        
        // Atualizar posição do personagem
        if (this.callbacks.onPositionChange) {
          const newPosition = {
            x: this.variables.x || 100,
            y: this.variables.y || 100
          };
          this.callbacks.onPositionChange(newPosition);
        }
        
        // Mostrar movimento
        if (this.callbacks.onOutput) {
          const direction = this.getMovementDirection(varName, oldValue, value);
          if (direction) {
            this.callbacks.onOutput(`Personagem ${direction}`, 'success');
          }
        }
        
        // Callback para comando executado
        if (this.callbacks.onCommand) {
          this.callbacks.onCommand(line, this.currentLine);
        }
      } else {
        this.variables[varName] = this.evaluateExpression(expression);
      }
      return;
    }

    // Comando se (if)
    if (line.startsWith('se ')) {
      // Implementação básica de condicionais
      return;
    }

    // Comando para (for)
    if (line.startsWith('para ')) {
      // Implementação básica de loops
      return;
    }

    // Comando enquanto (while)
    if (line.startsWith('enquanto ')) {
      // Implementação básica de loops
      return;
    }
  }

  evaluateExpression(expression) {
    // Substituir variáveis por seus valores
    let expr = expression;
    Object.keys(this.variables).forEach(varName => {
      const regex = new RegExp(`\\b${varName}\\b`, 'g');
      expr = expr.replace(regex, this.variables[varName]);
    });
    
    // Avaliar expressão matemática simples
    try {
      // Substituir operadores Portugol por JavaScript
      expr = expr.replace(/\+\+/g, '+');
      expr = expr.replace(/--/g, '-');
      expr = expr.replace(/\*\*/g, '*');
      expr = expr.replace(/\/\//g, '/');
      
      // Avaliar usando Function para segurança
      return Function(`"use strict"; return (${expr})`)();
    } catch (error) {
      throw new Error(`Erro na expressão: ${expression}`);
    }
  }

  getMovementDirection(varName, oldValue, newValue) {
    if (varName === 'x') {
      if (newValue > oldValue) return 'moveu para direita';
      if (newValue < oldValue) return 'moveu para esquerda';
    } else if (varName === 'y') {
      if (newValue > oldValue) return 'moveu para baixo';
      if (newValue < oldValue) return 'moveu para cima';
    }
    return null;
  }

  pause() {
    this.isPaused = true;
    if (this.callbacks.onPause) {
      this.callbacks.onPause();
    }
  }

  resume() {
    this.isPaused = false;
    if (this.callbacks.onResume) {
      this.callbacks.onResume();
    }
  }

  stop() {
    this.isRunning = false;
    this.isPaused = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  sleep(ms) {
    return new Promise(resolve => {
      this.timeoutId = setTimeout(resolve, ms);
    });
  }

  // Aplicar limites de movimento para manter o personagem dentro da área
  applyMovementLimits(varName, value) {
    const limits = this.movementLimits[varName];
    if (!limits) return value;
    
    // Limitar o valor dentro dos limites
    const limitedValue = Math.max(limits.min, Math.min(limits.max, value));
    
    // Se o valor foi limitado, mostrar aviso
    if (limitedValue !== value && this.callbacks.onOutput) {
      const direction = varName === 'x' ? 'horizontal' : 'vertical';
      this.callbacks.onOutput(
        `⚠️ Limite ${direction} atingido! Posição ajustada para ${limitedValue}`, 
        'warning'
      );
    }
    
    return limitedValue;
  }

  // Métodos para comandos Portugol específicos
  static getPortugolKeywords() {
    return [
      'algoritmo', 'fimalgoritmo', 'var', 'inteiro', 'real', 'caractere', 'logico',
      'inicio', 'fim', 'se', 'entao', 'senao', 'fimse', 'para', 'de', 'ate', 'faca', 'fimpara',
      'enquanto', 'fimenquanto', 'escreva', 'leia', 'escreval', 'leial'
    ];
  }

  static getPortugolSyntax() {
    return {
      keywords: this.getPortugolKeywords(),
      operators: ['+', '-', '*', '/', ':=', '=', '<>', '<', '>', '<=', '>='],
      comments: ['//'],
      strings: ['"', "'"]
    };
  }
}

export default PortugolInterpreter;
