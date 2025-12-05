/**
 * Serviço de Sincronização de Ranking
 * 
 * Sincroniza rankings com o servidor quando disponível,
 * com fallback para localStorage quando o servidor não estiver disponível.
 */

// Detectar automaticamente o IP do servidor baseado na URL atual
const getServerURL = () => {
  // Se tiver configurado no .env, usa esse
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Caso contrário, tenta detectar automaticamente
  const hostname = window.location.hostname;
  
  // Se for localhost, usa localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3001/api';
  }
  
  // Se for um IP na rede, usa o mesmo IP na porta 3001
  return `http://${hostname}:3001/api`;
};

const API_BASE_URL = getServerURL();

class RankingSync {
  constructor() {
    this.serverAvailable = false;
    this.checkServerInterval = null;
    this.syncInterval = null;
    this.lastSyncTime = null;
  }

  /**
   * Verifica se o servidor está disponível
   */
  async checkServer() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      const response = await fetch(`${API_BASE_URL}/status`, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      this.serverAvailable = response.ok;
      return this.serverAvailable;
    } catch (error) {
      this.serverAvailable = false;
      return false;
    }
  }

  /**
   * Busca ranking do servidor
   * @param {string} type - Tipo de ranking ('maze-easy', 'maze-medium', 'maze-hard')
   */
  async getRanking(type) {
    // Tentar buscar do servidor
    if (this.serverAvailable) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(`${API_BASE_URL}/rankings/${type}`, {
          method: 'GET',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const ranking = await response.json();
          // Salvar também no localStorage como backup
          this.saveToLocalStorage(type, ranking);
          return ranking;
        }
      } catch (error) {
        console.debug('Servidor não disponível, usando localStorage');
        this.serverAvailable = false;
      }
    }

    // Fallback para localStorage
    return this.getFromLocalStorage(type);
  }

  /**
   * Salva ranking no servidor e localStorage
   * @param {string} type - Tipo de ranking
   * @param {Array} ranking - Array de entradas do ranking
   */
  async saveRanking(type, ranking) {
    // Salvar no localStorage primeiro (sempre)
    this.saveToLocalStorage(type, ranking);

    // Tentar salvar no servidor
    if (this.serverAvailable) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(`${API_BASE_URL}/rankings/${type}/replace`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ranking }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (response.ok) {
          const result = await response.json();
          return result.ranking;
        }
      } catch (error) {
        console.debug('Erro ao salvar no servidor, usando apenas localStorage');
        this.serverAvailable = false;
      }
    }

    return ranking;
  }

  /**
   * Adiciona uma nova entrada ao ranking
   * @param {string} type - Tipo de ranking
   * @param {Object} entry - Nova entrada
   */
  async addEntry(type, entry) {
    // Adicionar no localStorage primeiro
    let ranking = this.getFromLocalStorage(type);
    ranking.push(entry);

    // Ordenar e manter Top 10
    if (type.startsWith('maze-')) {
      ranking.sort((a, b) => a.time - b.time);
    } else {
      ranking.sort((a, b) => (b.percentage || 0) - (a.percentage || 0));
    }
    ranking = ranking.slice(0, 10);

    // Salvar
    return await this.saveRanking(type, ranking);
  }

  /**
   * Limpa um ranking
   * @param {string} type - Tipo de ranking
   */
  async clearRanking(type) {
    // Limpar localStorage
    this.saveToLocalStorage(type, []);

    // Limpar no servidor
    if (this.serverAvailable) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        await fetch(`${API_BASE_URL}/rankings/${type}`, {
          method: 'DELETE',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
      } catch (error) {
        console.debug('Erro ao limpar no servidor');
      }
    }
  }

  /**
   * Sincroniza todos os rankings do servidor
   */
  async syncAll() {
    if (!this.serverAvailable) {
      await this.checkServer();
      if (!this.serverAvailable) return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${API_BASE_URL}/rankings`, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const allRankings = await response.json();
        
        // Salvar todos no localStorage
        if (allRankings.mazeRankingEasy) {
          localStorage.setItem('mazeRanking-easy', JSON.stringify(allRankings.mazeRankingEasy));
        }
        if (allRankings.mazeRankingMedium) {
          localStorage.setItem('mazeRanking-medium', JSON.stringify(allRankings.mazeRankingMedium));
        }
        if (allRankings.mazeRankingHard) {
          localStorage.setItem('mazeRanking-hard', JSON.stringify(allRankings.mazeRankingHard));
        }

        this.lastSyncTime = new Date();
        return true;
      }
    } catch (error) {
      console.debug('Erro ao sincronizar:', error);
      this.serverAvailable = false;
    }

    return false;
  }

  /**
   * Inicia verificação periódica do servidor e sincronização
   */
  startAutoSync(intervalMs = 5000) {
    // Verificar servidor a cada 5 segundos
    this.checkServerInterval = setInterval(() => {
      this.checkServer();
    }, intervalMs);

    // Sincronizar rankings a cada 10 segundos
    this.syncInterval = setInterval(() => {
      if (this.serverAvailable) {
        this.syncAll();
      }
    }, intervalMs * 2);

    // Verificar imediatamente
    this.checkServer();
  }

  /**
   * Para a sincronização automática
   */
  stopAutoSync() {
    if (this.checkServerInterval) {
      clearInterval(this.checkServerInterval);
      this.checkServerInterval = null;
    }
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // ========== MÉTODOS AUXILIARES ==========

  getFromLocalStorage(type) {
    const keyMap = {
      'maze-easy': 'mazeRanking-easy',
      'maze-medium': 'mazeRanking-medium',
      'maze-hard': 'mazeRanking-hard'
    };

    const key = keyMap[type];
    if (!key) return [];

    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  }

  saveToLocalStorage(type, ranking) {
    const keyMap = {
      'maze-easy': 'mazeRanking-easy',
      'maze-medium': 'mazeRanking-medium',
      'maze-hard': 'mazeRanking-hard'
    };

    const key = keyMap[type];
    if (key) {
      localStorage.setItem(key, JSON.stringify(ranking));
    }
  }
}

// Instância singleton
const rankingSync = new RankingSync();

export default rankingSync;

