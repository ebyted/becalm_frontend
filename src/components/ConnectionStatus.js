import React, { useState, useEffect } from 'react';
import API_CONFIG from '../config/api';

function ConnectionStatus() {
  const [status, setStatus] = useState('checking');
  const [currentUrl, setCurrentUrl] = useState('');
  const [lastCheck, setLastCheck] = useState(new Date());

  const checkConnection = async () => {
    setStatus('checking');
    try {
      const workingUrl = await API_CONFIG.findWorkingBackend();
      if (workingUrl) {
        setStatus('online');
        setCurrentUrl(workingUrl);
      } else {
        setStatus('offline');
        setCurrentUrl('');
      }
    } catch (error) {
      setStatus('offline');
      setCurrentUrl('');
    }
    setLastCheck(new Date());
  };

  useEffect(() => {
    checkConnection();
    // Verificar conectividad cada 30 segundos
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusInfo = () => {
    switch (status) {
      case 'checking':
        return {
          icon: '🔄',
          text: 'Verificando...',
          color: '#f39c12',
          detail: 'Probando conectividad'
        };
      case 'online':
        return {
          icon: '✅',
          text: 'Conectado',
          color: '#27ae60',
          detail: currentUrl
        };
      case 'offline':
        return {
          icon: '❌',
          text: 'Desconectado',
          color: '#e74c3c',
          detail: 'Sin conexión al backend'
        };
      default:
        return {
          icon: '❓',
          text: 'Desconocido',
          color: '#95a5a6',
          detail: ''
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="connection-status">
      <div className="d-flex align-items-center justify-content-center mb-2">
        <span className="me-2 text-light">Backend:</span>
        <span 
          className="badge-modern"
          style={{ backgroundColor: statusInfo.color }}
        >
          {statusInfo.icon} {statusInfo.text}
        </span>
        <button 
          className="btn-glass-mini ms-2"
          onClick={checkConnection}
          title="Verificar conexión"
          disabled={status === 'checking'}
        >
          {status === 'checking' ? '⏳' : '🔄'}
        </button>
      </div>
      
      {statusInfo.detail && (
        <div className="text-center">
          <small className="text-light" style={{ opacity: 0.8, fontSize: '0.8rem' }}>
            {statusInfo.detail}
          </small>
        </div>
      )}
      
      <div className="text-center mt-1">
        <small className="text-light" style={{ opacity: 0.6, fontSize: '0.7rem' }}>
          Última verificación: {lastCheck.toLocaleTimeString()}
        </small>
      </div>
    </div>
  );
}

export default ConnectionStatus;
