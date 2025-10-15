import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import io from 'socket.io-client';
import './MobileControl.css';

const MobileControl = ({ 
  characterPosition, 
  isRunning, 
  isPaused, 
  onPositionChange, 
  onCommandExecute,
  onGameAction 
}) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [mobileConnected, setMobileConnected] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [serverUrl, setServerUrl] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [isServerRunning, setIsServerRunning] = useState(false);

  useEffect(() => {
    // Detectar URL do servidor
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port || (protocol === 'https:' ? '443' : '3001');
    const serverUrl = `${protocol}//${hostname}:${port}`;
    setServerUrl(serverUrl);
  }, []);

  const generateQRCode = async (url) => {
    try {
      const mobileUrl = `${url}/mobile`;
      const qrCodeDataURL = await QRCode.toDataURL(mobileUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrCodeDataURL);
    } catch (error) {
      console.error('Erro ao gerar QR code:', error);
    }
  };

  const startServer = async () => {
    try {
      setIsServerRunning(true);
      
      // Conectar ao servidor WebSocket
      const newSocket = io(serverUrl);
      setSocket(newSocket);

      // Registrar como cliente desktop
      newSocket.emit('register', 'desktop');

      // Eventos de conexão
      newSocket.on('connect', () => {
        setIsConnected(true);
        generateQRCode(serverUrl);
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
        setMobileConnected(false);
      });

      // Eventos do mobile
      newSocket.on('mobileConnected', () => {
        setMobileConnected(true);
      });

      newSocket.on('mobileDisconnected', () => {
        setMobileConnected(false);
      });

      // Receber comandos do mobile
      newSocket.on('mobileCommand', (command) => {
        handleMobileCommand(command);
      });

      setSocket(newSocket);
    } catch (error) {
      console.error('Erro ao iniciar servidor:', error);
      setIsServerRunning(false);
    }
  };

  const stopServer = () => {
    if (socket) {
      socket.close();
      setSocket(null);
    }
    setIsServerRunning(false);
    setIsConnected(false);
    setMobileConnected(false);
    setQrCodeUrl('');
    setShowQR(false);
  };

  const handleMobileCommand = (command) => {
    if (!command) return;

    switch (command.type) {
      case 'move':
        handleMoveCommand(command.direction);
        break;
      case 'game':
        handleGameCommand(command.action);
        break;
      case 'special':
        handleSpecialCommand(command.action);
        break;
      default:
        console.log('Comando desconhecido:', command);
    }
  };

  const handleMoveCommand = (direction) => {
    const step = 30;
    let newX = characterPosition.x;
    let newY = characterPosition.y;
    let command = '';

    switch (direction) {
      case 'up':
        command = `y := y - ${step}`;
        newY = Math.max(40, characterPosition.y - step);
        break;
      case 'down':
        command = `y := y + ${step}`;
        newY = Math.min(260, characterPosition.y + step);
        break;
      case 'left':
        command = `x := x - ${step}`;
        newX = Math.max(40, characterPosition.x - step);
        break;
      case 'right':
        command = `x := x + ${step}`;
        newX = Math.min(360, characterPosition.x + step);
        break;
      default:
        return;
    }

    // Atualizar posição
    if (onPositionChange) {
      onPositionChange({ x: newX, y: newY });
    }

    // Adicionar comando
    if (onCommandExecute) {
      onCommandExecute(command);
    }
  };

  const handleGameCommand = (action) => {
    if (onGameAction) {
      onGameAction(action);
    }
  };

  const handleSpecialCommand = (action) => {
    if (action === 'center') {
      // Comando especial - mover para o centro
      const centerX = 200;
      const centerY = 150;
      const command = `x := ${centerX}; y := ${centerY}`;
      
      if (onPositionChange) {
        onPositionChange({ x: centerX, y: centerY });
      }
      
      if (onCommandExecute) {
        onCommandExecute(command);
      }
    }
  };

  // Enviar posição do personagem para o mobile
  useEffect(() => {
    if (socket && mobileConnected) {
      socket.emit('characterPosition', characterPosition);
    }
  }, [characterPosition, socket, mobileConnected]);

  // Enviar status do jogo para o mobile
  useEffect(() => {
    if (socket && mobileConnected) {
      socket.emit('gameStatus', { isRunning, isPaused });
    }
  }, [isRunning, isPaused, socket, mobileConnected]);

  const toggleQRCode = () => {
    const newShowQR = !showQR;
    setShowQR(newShowQR);
    
    if (newShowQR && isConnected) {
      generateQRCode(serverUrl);
    }
  };

  return (
    <div className="mobile-control-panel">
      <div className="mobile-control-header">
        <h3>📱 Controle Móvel</h3>
        <div className="connection-indicators">
          <div className={`indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            <span className="indicator-dot"></span>
            Servidor: {isConnected ? 'Ativo' : 'Inativo'}
          </div>
          <div className={`indicator ${mobileConnected ? 'connected' : 'disconnected'}`}>
            <span className="indicator-dot"></span>
            Mobile: {mobileConnected ? 'Conectado' : 'Desconectado'}
          </div>
        </div>
      </div>

      <div className="mobile-control-content">
        {!isServerRunning ? (
          <div className="connection-setup">
            <div className="setup-instructions">
              <h4>🚀 Iniciar Controle Móvel</h4>
              <ol>
                <li>Certifique-se que o celular está na mesma rede Wi-Fi</li>
                <li>Clique em "Iniciar Servidor" abaixo</li>
                <li>Escaneie o QR code que aparecerá</li>
                <li>Ou acesse manualmente: <code>{serverUrl}/mobile</code></li>
              </ol>
            </div>
            
            <div className="server-controls">
              <button 
                className="server-start-btn"
                onClick={startServer}
                disabled={isServerRunning}
              >
                🚀 Iniciar Servidor
              </button>
            </div>
          </div>
        ) : (
          <div className="server-active">
            <div className="active-indicator">
              <span className="pulse-dot"></span>
              <strong>Servidor ativo!</strong>
            </div>
            
            <div className="server-actions">
              <button 
                className="qr-toggle-btn"
                onClick={toggleQRCode}
              >
                {showQR ? '🔽 Ocultar QR Code' : '📱 Mostrar QR Code'}
              </button>
              
              <button 
                className="server-stop-btn"
                onClick={stopServer}
              >
                ⏹️ Parar Servidor
              </button>
            </div>
            
            {showQR && qrCodeUrl && (
              <div className="qr-container">
                <img src={qrCodeUrl} alt="QR Code para controle móvel" />
                <p className="qr-instructions">
                  Escaneie com a câmera do celular
                </p>
              </div>
            )}
            
            <div className="mobile-controls-info">
              <h4>🎮 Controles Disponíveis:</h4>
              <ul>
                <li><strong>Setas:</strong> Mover personagem</li>
                <li><strong>Centro:</strong> Ir para posição central</li>
                <li><strong>Ações:</strong> Executar, Pausar, Parar, Reset</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileControl;
