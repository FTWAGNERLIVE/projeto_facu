import React, { useState, useEffect } from 'react';
import './MobileControl.css';

const UltraSimpleQR = () => {
  const [showQR, setShowQR] = useState(false);
  const [serverUrl, setServerUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    // Detectar IP da rede automaticamente
    const detectNetworkIP = async () => {
      try {
        // Tentar detectar IP da rede fazendo uma requisição para o servidor
        const response = await fetch('http://localhost:3001/test');
        const data = await response.json();
        
        if (data.ip && data.ip !== 'localhost' && data.ip !== '127.0.0.1') {
          const protocol = window.location.protocol;
          const serverUrl = `${protocol}//${data.ip}:3001`;
          setServerUrl(serverUrl);
          console.log('IP da rede detectado:', data.ip);
          console.log('URL do servidor configurada:', serverUrl);
        } else {
          // Fallback para localhost
          const protocol = window.location.protocol;
          const hostname = window.location.hostname;
          const serverUrl = `${protocol}//${hostname}:3001`;
          setServerUrl(serverUrl);
          console.log('Usando localhost:', serverUrl);
        }
      } catch (error) {
        // Fallback para localhost se não conseguir detectar
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        const serverUrl = `${protocol}//${hostname}:3001`;
        setServerUrl(serverUrl);
        console.log('Erro ao detectar IP, usando localhost:', serverUrl);
      }
    };

    detectNetworkIP();
  }, []);

  const generateQRCode = () => {
    const mobileUrl = `${serverUrl}/mobile`;
    console.log('Gerando QR code para:', mobileUrl);
    
    // Usar API online para gerar QR code
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

export default UltraSimpleQR;
