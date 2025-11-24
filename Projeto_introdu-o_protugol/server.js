/**
 * Servidor de Sincronização de Ranking
 * 
 * Servidor simples para sincronizar rankings entre múltiplos PCs na mesma rede.
 * 
 * Para iniciar: node server.js
 * O servidor rodará na porta 3001
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Arquivo para armazenar rankings
const RANKINGS_FILE = path.join(__dirname, 'rankings.json');

// Inicializar arquivo de rankings se não existir
if (!fs.existsSync(RANKINGS_FILE)) {
  fs.writeFileSync(RANKINGS_FILE, JSON.stringify({
    mazeRankingEasy: [],
    mazeRankingMedium: [],
    mazeRankingHard: [],
    quizRanking: []
  }));
}

// Função para ler rankings
const readRankings = () => {
  try {
    const data = fs.readFileSync(RANKINGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler rankings:', error);
    return {
      mazeRankingEasy: [],
      mazeRankingMedium: [],
      mazeRankingHard: [],
      quizRanking: []
    };
  }
};

// Função para salvar rankings
const saveRankings = (rankings) => {
  try {
    fs.writeFileSync(RANKINGS_FILE, JSON.stringify(rankings, null, 2));
    return true;
  } catch (error) {
    console.error('Erro ao salvar rankings:', error);
    return false;
  }
};

// ========== ROTAS ==========

// GET - Buscar todos os rankings
app.get('/api/rankings', (req, res) => {
  const rankings = readRankings();
  res.json(rankings);
});

// GET - Buscar ranking específico
app.get('/api/rankings/:type', (req, res) => {
  const { type } = req.params;
  const rankings = readRankings();
  
  const rankingMap = {
    'maze-easy': 'mazeRankingEasy',
    'maze-medium': 'mazeRankingMedium',
    'maze-hard': 'mazeRankingHard',
    'quiz': 'quizRanking'
  };
  
  const key = rankingMap[type];
  if (key && rankings[key]) {
    res.json(rankings[key]);
  } else {
    res.json([]);
  }
});

// POST - Salvar ranking
app.post('/api/rankings/:type', (req, res) => {
  const { type } = req.params;
  const { entry } = req.body;
  
  if (!entry) {
    return res.status(400).json({ error: 'Entry é obrigatório' });
  }
  
  const rankings = readRankings();
  
  const rankingMap = {
    'maze-easy': 'mazeRankingEasy',
    'maze-medium': 'mazeRankingMedium',
    'maze-hard': 'mazeRankingHard',
    'quiz': 'quizRanking'
  };
  
  const key = rankingMap[type];
  if (!key) {
    return res.status(400).json({ error: 'Tipo de ranking inválido' });
  }
  
  // Adicionar nova entrada
  let ranking = rankings[key] || [];
  ranking.push(entry);
  
  // Ordenar e manter apenas Top 10
  if (type.startsWith('maze-')) {
    // Para labirinto: ordenar por tempo (menor é melhor)
    ranking.sort((a, b) => a.time - b.time);
  } else {
    // Para quiz: ordenar por porcentagem (maior é melhor)
    ranking.sort((a, b) => (b.percentage || 0) - (a.percentage || 0));
  }
  
  ranking = ranking.slice(0, 10);
  rankings[key] = ranking;
  
  // Salvar
  if (saveRankings(rankings)) {
    res.json({ success: true, ranking: ranking });
  } else {
    res.status(500).json({ error: 'Erro ao salvar ranking' });
  }
});

// POST - Salvar ranking completo (substituir)
app.post('/api/rankings/:type/replace', (req, res) => {
  const { type } = req.params;
  const { ranking } = req.body;
  
  if (!Array.isArray(ranking)) {
    return res.status(400).json({ error: 'Ranking deve ser um array' });
  }
  
  const rankings = readRankings();
  
  const rankingMap = {
    'maze-easy': 'mazeRankingEasy',
    'maze-medium': 'mazeRankingMedium',
    'maze-hard': 'mazeRankingHard',
    'quiz': 'quizRanking'
  };
  
  const key = rankingMap[type];
  if (!key) {
    return res.status(400).json({ error: 'Tipo de ranking inválido' });
  }
  
  rankings[key] = ranking.slice(0, 10);
  
  if (saveRankings(rankings)) {
    res.json({ success: true, ranking: rankings[key] });
  } else {
    res.status(500).json({ error: 'Erro ao salvar ranking' });
  }
});

// DELETE - Limpar ranking
app.delete('/api/rankings/:type', (req, res) => {
  const { type } = req.params;
  const rankings = readRankings();
  
  const rankingMap = {
    'maze-easy': 'mazeRankingEasy',
    'maze-medium': 'mazeRankingMedium',
    'maze-hard': 'mazeRankingHard',
    'quiz': 'quizRanking'
  };
  
  const key = rankingMap[type];
  if (!key) {
    return res.status(400).json({ error: 'Tipo de ranking inválido' });
  }
  
  rankings[key] = [];
  
  if (saveRankings(rankings)) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Erro ao limpar ranking' });
  }
});

// GET - Status do servidor
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Servidor de sincronização rodando na porta ${PORT}`);
  console.log(`📡 Acesse em: http://localhost:${PORT}`);
  console.log(`🌐 Para outros PCs na rede: http://[IP_DESTE_PC]:${PORT}\n`);
  console.log('Para descobrir o IP deste PC:');
  console.log('  Windows: ipconfig');
  console.log('  Linux/Mac: ifconfig ou ip addr\n');
});

