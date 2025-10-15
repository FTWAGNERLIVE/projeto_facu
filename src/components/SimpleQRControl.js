import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import './MobileControl.css';

const SimpleQRControl = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [serverUrl, setServerUrl] = useState('');

  useEffect(() => {
    // Detectar URL do servidor (sempre porta 3001)
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const serverUrl = `${protocol}//${hostname}:3001`;
    setServerUrl(serverUrl);
    console.log('URL do servidor configurada:', serverUrl);
  }, []);

  const generateQRCode = async () => {
    try {
      const mobileUrl = `${serverUrl}/mobile`;
      console.log('Gerando QR code para:', mobileUrl);
      
      const qrCodeDataURL = await QRCode.toDataURL(mobileUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      console.log('QR code gerado:', qrCodeDataURL);
      setQrCodeUrl(qrCodeDataURL);
    } catch (error) {
      console.error('Erro ao gerar QR code:', error);
    }
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
              <img src={qrCodeUrl} alt="QR Code para controle móvel" />
              <p className="qr-instructions">
                Escaneie com a câmera do celular
              </p>
              <p style={{ fontSize: '0.8rem', color: '#ccc', marginTop: '10px' }}>
                URL: {serverUrl}/mobile
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleQRControl;
