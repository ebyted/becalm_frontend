const API_CONFIG = {
  // Múltiples URLs de backend para fallback
  BACKEND_URLS: [
    'http://168.231.67.221:8011',  // Servidor principal
    'http://localhost:8011',       // Servidor local
    'http://127.0.0.1:8011'        // Alternativa local
  ],
  
  // URL base actual (se establece dinámicamente)
  BASE_URL: process.env.REACT_APP_API_URL || 'http://168.231.67.221:8011',
  
  ENDPOINTS: {
    // Auth endpoints
    LOGIN: '/token',
    REGISTER: '/register',
    
    // Content endpoints
    DIALOGO_MESSAGE: '/dialogo_conmigo/message',
    DIALOGO_HISTORY: '/dialogo_conmigo/history',
    GENERATE: '/v1/generate',
    MEDITATION_MUSIC: '/meditation/music',
    
    // Health check
    HEALTH: '/health'
  },
  
  // Timeout para requests (10 segundos)
  REQUEST_TIMEOUT: 10000,
  
  // Default headers for authenticated requests
  getAuthHeaders: () => {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  },
  
  // Función para probar conectividad a diferentes URLs
  findWorkingBackend: async function() {
    for (const url of this.BACKEND_URLS) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 segundos timeout
        
        const response = await fetch(`${url}/health`, {
          method: 'GET',
          signal: controller.signal,
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          mode: 'cors'
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          this.BASE_URL = url;
          console.log(`✅ Backend conectado: ${url}`);
          return url;
        }
      } catch (error) {
        console.log(`❌ Backend no disponible: ${url} - ${error.message}`);
        // Si es un timeout o error de red, continuar con el siguiente
        if (error.name === 'AbortError') {
          console.log(`⏱️ Timeout conectando a: ${url}`);
        }
      }
    }
    
    // Si ninguno funciona, usar el primero como fallback
    console.warn('⚠️ Ningún backend disponible, usando fallback');
    this.BASE_URL = this.BACKEND_URLS[0];
    return null;
  }
};

export default API_CONFIG;
