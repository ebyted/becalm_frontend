import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import API_CONFIG from '../config/api';

const ApiTest = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(API_CONFIG.BASE_URL);
  }, []);

  const testConnection = async () => {
    setLoading(true);
    const results = {};
    
    // Probar cada URL
    for (const url of API_CONFIG.BACKEND_URLS) {
      try {
        const startTime = Date.now();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`${url}/health`, {
          method: 'GET',
          signal: controller.signal,
          headers: { 'Accept': 'application/json' }
        });
        
        clearTimeout(timeoutId);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        if (response.ok) {
          const data = await response.json();
          results[url] = { 
            success: true, 
            data, 
            responseTime: `${responseTime}ms`,
            status: response.status 
          };
        } else {
          results[url] = { 
            success: false, 
            error: `HTTP ${response.status}`,
            responseTime: `${responseTime}ms` 
          };
        }
      } catch (error) {
        results[url] = { 
          success: false, 
          error: error.name === 'AbortError' ? 'Timeout' : error.message 
        };
      }
    }
    
    setTestResults(results);
    setLoading(false);
  };

  const testApiEndpoint = async () => {
    setLoading(true);
    try {
      const result = await apiService.healthCheck();
      setTestResults(prev => ({
        ...prev,
        'API Service': { success: true, data: result }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        'API Service': { success: false, error: error.message }
      }));
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #007bff', 
      borderRadius: '8px',
      margin: '20px',
      backgroundColor: '#f8f9fa'
    }}>
      <h3 style={{ color: '#007bff' }}>🔧 API Connection Diagnostics</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <strong>URLs configuradas:</strong>
        <ul>
          {API_CONFIG.BACKEND_URLS.map(url => (
            <li key={url} style={{ 
              color: url === currentUrl ? '#28a745' : '#6c757d',
              fontWeight: url === currentUrl ? 'bold' : 'normal'
            }}>
              {url} {url === currentUrl && '← Actual'}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={testConnection} 
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {loading ? 'Probando...' : 'Probar Todas las URLs'}
        </button>
        
        <button 
          onClick={testApiEndpoint} 
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Probando...' : 'Probar API Service'}
        </button>
      </div>
      
      {Object.keys(testResults).length > 0 && (
        <div>
          <h4>Resultados:</h4>
          {Object.entries(testResults).map(([url, result]) => (
            <div 
              key={url}
              style={{ 
                marginTop: '10px', 
                padding: '10px', 
                borderRadius: '4px',
                backgroundColor: result.success ? '#d4edda' : '#f8d7da',
                border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`
              }}
            >
              <strong>{url}:</strong>
              {result.success ? (
                <div>
                  <span style={{ color: '#155724' }}>✅ Conectado</span>
                  {result.responseTime && <span> - {result.responseTime}</span>}
                  {result.data && (
                    <pre style={{ 
                      marginTop: '5px', 
                      fontSize: '12px',
                      backgroundColor: '#fff',
                      padding: '5px',
                      borderRadius: '3px'
                    }}>
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  )}
                </div>
              ) : (
                <div>
                  <span style={{ color: '#721c24' }}>❌ Error: {result.error}</span>
                  {result.responseTime && <span> - {result.responseTime}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApiTest;