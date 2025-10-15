const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const os = require('os');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(path.join(__dirname, 'public')));

// Rota para a página de controle móvel
app.get('/mobile', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mobile-control.html'));
});

// Armazenar conexões ativas
const connections = {
  desktop: null,
  mobile: null
};

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  // Registrar tipo de cliente
  socket.on('register', (clientType) => {
    console.log(`Cliente registrado como: ${clientType}`);
    
    if (clientType === 'desktop') {
      connections.desktop = socket;
    } else if (clientType === 'mobile') {
      connections.mobile = socket;
    }

    // Notificar desktop sobre conexão móvel
    if (clientType === 'mobile' && connections.desktop) {
      connections.desktop.emit('mobileConnected');
    }
  });

  // Receber comandos do mobile e enviar para desktop
  socket.on('mobileCommand', (command) => {
    console.log('Comando recebido do mobile:', command);
    
    if (connections.desktop) {
      connections.desktop.emit('mobileCommand', command);
    }
  });

  // Receber posição do personagem do desktop e enviar para mobile
  socket.on('characterPosition', (position) => {
    if (connections.mobile) {
      connections.mobile.emit('characterPosition', position);
    }
  });

  // Receber status do jogo do desktop e enviar para mobile
  socket.on('gameStatus', (status) => {
    if (connections.mobile) {
      connections.mobile.emit('gameStatus', status);
    }
  });

  // Desconexão
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
    
    if (connections.desktop === socket) {
      connections.desktop = null;
    }
    if (connections.mobile === socket) {
      connections.mobile = null;
      // Notificar desktop sobre desconexão móvel
      if (connections.desktop) {
        connections.desktop.emit('mobileDisconnected');
      }
    }
  });
});

// Função para obter IP local
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

server.listen(PORT, () => {
  const localIP = getLocalIP();
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesso local: http://localhost:${PORT}`);
  console.log(`Acesso na rede: http://${localIP}:${PORT}`);
  console.log(`Controle móvel: http://${localIP}:${PORT}/mobile`);
});
