import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './MobileControl.css';

const MobileGameControl = ({ characterPosition, onPositionChange, onGameAction }) => {
  const [showQR, setShowQR] = useState(false);
  const [serverUrl, setServerUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [mobileConnected, setMobileConnected] = useState(false);

  useEffect(() => {
    // Detectar IP da rede automaticamente
    const detectNetworkIP = async () => {
      try {
        const response = await fetch('http://localhost:3001/test');
        const data = await response.json();
        
        if (data.ip && data.ip !== 'localhost' && data.ip !== '127.0.0.1') {
          const protocol = window.location.protocol;
          const serverUrl = `${protocol}//${data.ip}:3001`;
          setServerUrl(serverUrl);
          console.log('IP da rede detectado:', data.ip);
        } else {
          const protocol = window.location.protocol;
          const hostname = window.location.hostname;
          const serverUrl = `${protocol}//${hostname}:3001`;
          setServerUrl(serverUrl);
          console.log('Usando localhost:', serverUrl);
        }
      } catch (error) {
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        const serverUrl = `${protocol}//${hostname}:3001`;
        setServerUrl(serverUrl);
        console.log('Erro ao detectar IP, usando localhost:', serverUrl);
      }
    };

    detectNetworkIP();
  }, []);

  // Conectar com o servidor WebSocket
  useEffect(() => {
    if (serverUrl) {
      const newSocket = io(serverUrl);
      
      newSocket.on('connect', () => {
        console.log('Conectado ao servidor WebSocket');
        setIsConnected(true);
        newSocket.emit('register', 'desktop');
      });

      newSocket.on('mobileConnected', () => {
        console.log('Celular conectado!');
        setMobileConnected(true);
      });

      newSocket.on('mobileDisconnected', () => {
        console.log('Celular desconectado');
        setMobileConnected(false);
      });

      newSocket.on('mobileCommand', (command) => {
        console.log('Comando recebido do mobile:', command);
        console.log('Posição atual do personagem:', characterPosition);
        handleMobileCommand(command);
      });

      newSocket.on('disconnect', () => {
        console.log('Desconectado do servidor');
        setIsConnected(false);
        setMobileConnected(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [serverUrl]);

  // Enviar posição do personagem para o mobile
  useEffect(() => {
    if (socket && mobileConnected) {
      socket.emit('characterPosition', characterPosition);
    }
  }, [characterPosition, socket, mobileConnected]);

  const handleMobileCommand = (command) => {
    if (!command) return;

    switch (command.type) {
      case 'move':
        handleMoveCommand(command.direction);
        break;
      case 'gameAction':
        if (onGameAction) {
          onGameAction(command.action);
        }
        break;
      default:
        console.log('Comando desconhecido:', command);
    }
  };

  const handleMoveCommand = (direction) => {
    console.log('handleMoveCommand chamado com direção:', direction);
    console.log('Posição atual:', characterPosition);
    console.log('onPositionChange disponível:', !!onPositionChange);
    
    if (!onPositionChange) {
      console.log('ERRO: onPositionChange não está disponível');
      return;
    }

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
      case 'center':
        command = 'x := 200; y := 150';
        newX = 200;
        newY = 150;
        break;
      default:
        console.log('Direção desconhecida:', direction);
        return;
    }

    console.log(`Movendo personagem: ${direction}`);
    console.log(`Posição anterior:`, characterPosition);
    console.log(`Nova posição:`, { x: newX, y: newY });
    console.log(`Comando: ${command}`);
    
    // Atualizar posição
    onPositionChange({ x: newX, y: newY });
    
    // Se houver callback para executar comando, chamá-lo
    if (onGameAction) {
      console.log('Chamando onGameAction com comando:', command);
      onGameAction('command', command);
    }
  };

  const generateQRCode = () => {
    const mobileUrl = `${serverUrl}/mobile`;
    console.log('Gerando QR code para:', mobileUrl);
    
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(mobileUrl)}`;
    setQrCodeUrl(qrApiUrl);
  };

  const toggleQRCode = () => {
    const newShowQR = !showQR;
    setShowQR(newShowQR);
    
    if (newShowQR) {
      generateQRCode();
    }
  };

  return (
    <div className="mobile-control-panel">
      <div className="mobile-control-header">
        <h3>📱 Controle Móvel</h3>
        <div className="connection-status">
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
          </span>
          {mobileConnected && (
            <span className="mobile-status">📱 Celular Conectado</span>
          )}
        </div>
      </div>

      <div className="mobile-control-content">
        <div className="connection-setup">
          <div className="setup-instructions">
            <h4>🚀 Controle Móvel</h4>
            <ol>
              <li>Certifique-se que o celular está na mesma rede Wi-Fi</li>
              <li>Clique em "Mostrar QR Code" abaixo</li>
              <li>Escaneie o QR code com a câmera do celular</li>
              <li>Ou acesse manualmente: <code>{serverUrl}/mobile</code></li>
            </ol>
          </div>
          
          <div className="server-controls">
            <button 
              className="server-start-btn"
              onClick={toggleQRCode}
            >
              {showQR ? '🔽 Ocultar QR Code' : '📱 Mostrar QR Code'}
            </button>
          </div>
          
          {showQR && qrCodeUrl && (
            <div className="qr-container">
              <img 
                src={qrCodeUrl} 
                alt="QR Code para controle móvel" 
                onError={(e) => {
                  console.error('Erro ao carregar QR code');
                  e.target.style.display = 'none';
                }}
              />
              <p className="qr-instructions">
                Escaneie com a câmera do celular
              </p>
              <p style={{ fontSize: '0.8rem', color: '#ccc', marginTop: '10px' }}>
                URL: {serverUrl}/mobile
              </p>
              <p style={{ fontSize: '0.7rem', color: '#999', marginTop: '5px' }}>
                Se o QR code não aparecer, acesse a URL manualmente
              </p>
            </div>
          )}
          
          {showQR && !qrCodeUrl && (
            <div className="qr-container">
              <p style={{ color: '#fff', textAlign: 'center' }}>
                Carregando QR code...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileGameControl;
