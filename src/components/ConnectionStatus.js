import React, { useState, useEffect } from 'react';
import apiService from '../config/api'; // O la ruta correcta

const ConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    // Listener para cambios de conexión API
    const handleConnectionChange = (event) => {
      const { connected, url } = event.detail;
      console.log('🔄 Estado API actualizado:', { connected, url });
      setIsConnected(connected);
      setApiUrl(url);
    };

    // Agregar listener
    window.addEventListener('apiConnectionChanged', handleConnectionChange);

    // Verificar estado inicial
    const checkInitialConnection = async () => {
      try {
        await apiService.healthCheck();
        setIsConnected(true);
        setApiUrl('/api');
      } catch (error) {
        console.log('Estado inicial: desconectado');
        setIsConnected(false);
      }
    };

    checkInitialConnection();

    // Cleanup
    return () => {
      window.removeEventListener('apiConnectionChanged', handleConnectionChange);
    };
  }, []);

  return (
    <button 
      style={{
        backgroundColor: isConnected ? '#28a745' : '#dc3545',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
      onClick={async () => {
        if (!isConnected) {
          console.log('🔄 Intentando reconectar...');
          await apiService.reconnect();
        }
      }}
    >
      {isConnected ? `✅ Conectado (${apiUrl})` : '❌ Desconectado'}
    </button>
  );
};

export default ConnectionStatus;
