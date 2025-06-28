// src/config/api.js - ARCHIVO CORREGIDO
const API_CONFIG = {
  // URLs de backend en orden de prioridad
  BACKEND_URLS: [
    '/api',  // Proxy local a través de nginx
    'http://168.231.67.221:8011', // Directo al backend
    'http://localhost:8011' // Local fallback
  ],
  
  // URL actual (se establecerá dinámicamente)
  BASE_URL: '/api',
  
  // Configuración
  REQUEST_TIMEOUT: 10000,
  MAX_RETRIES: 3,
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Endpoints
  ENDPOINTS: {
    HEALTH: '/health',
    LOGIN: '/auth/login',
    DIALOGO_MESSAGE: '/dialogo/message',
    DIALOGO_HISTORY: '/dialogo/history',
  },
  
  // Función para obtener headers con auth
  getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      ...this.DEFAULT_HEADERS,
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  },
  
  // Función para probar un backend específico
  async testBackend(url) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${url}/health`, {
        method: 'GET',
        headers: this.DEFAULT_HEADERS,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        console.log(`✅ Backend ${url} está funcionando`);
        return true;
      } else {
        console.log(`⚠️ Backend ${url} respondió con status ${response.status}`);
        return false;
      }
    } catch (error) {
      console.log(`❌ Backend ${url} no disponible:`, error.message);
      return false;
    }
  },
  
  // Función para encontrar backend que funcione
  async findWorkingBackend() {
    console.log('🔍 Buscando backend disponible...');
    
    for (const url of this.BACKEND_URLS) {
      console.log(`🔄 Probando: ${url}`);
      const isWorking = await this.testBackend(url);
      
      if (isWorking) {
        this.BASE_URL = url;
        console.log(`✅ Backend seleccionado: ${url}`);
        
        // Notificar cambio de estado
        window.dispatchEvent(new CustomEvent('apiConnectionChanged', { 
          detail: { connected: true, url: url }
        }));
        
        return url;
      }
    }
    
    console.error('❌ Ningún backend disponible');
    this.BASE_URL = this.BACKEND_URLS[0]; // Fallback al primero
    
    // Notificar que no hay conexión
    window.dispatchEvent(new CustomEvent('apiConnectionChanged', { 
      detail: { connected: false, url: null }
    }));
    
    return this.BASE_URL;
  }
};

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.isInitialized = false;
    this.initializeBackend();
  }

  async initializeBackend() {
    if (this.isInitialized) return;
    
    console.log('🔄 Inicializando conexión con backend...');
    try {
      await API_CONFIG.findWorkingBackend();
      this.baseURL = API_CONFIG.BASE_URL;
      this.isInitialized = true;
      console.log('🚀 ApiService inicializado con URL:', this.baseURL);
    } catch (error) {
      console.error('❌ Error inicializando backend:', error);
      this.baseURL = API_CONFIG.BACKEND_URLS[0]; // Fallback
    }
  }

  async request(endpoint, options = {}) {
    // Asegurar que estamos inicializados
    if (!this.isInitialized) {
      await this.initializeBackend();
    }

    const url = `${this.baseURL}${endpoint}`;
    console.log('📡 Haciendo request a:', url);
    
    const config = {
      ...options,
      headers: {
        ...API_CONFIG.getAuthHeaders(),
        ...options.headers,
      },
    };

    // Timeout controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.REQUEST_TIMEOUT);
    
    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log('📥 Response status:', response.status);
      
      if (!response.ok) {
        // Si es 401, limpiar token
        if (response.status === 401) {
          localStorage.removeItem('access_token');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Request exitoso');
      return data;
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        console.error('⏱️ Request timeout:', url);
        throw new Error('Request timeout - el servidor tardó demasiado en responder');
      }
      
      console.error('❌ API Request falló:', {
        url,
        error: error.message
      });
      
      // Si falla, intentar encontrar otro backend
      if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        console.log('🔄 Intentando reconectar con otro backend...');
        this.isInitialized = false;
        await this.initializeBackend();
        
        // Intentar una vez más con el nuevo backend
        if (this.baseURL !== url.replace(endpoint, '')) {
          console.log('🔄 Reintentando con nuevo backend...');
          return this.request(endpoint, options);
        }
      }
      
      throw error;
    }
  }

  // Métodos HTTP
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Métodos específicos de la API
  async login(credentials) {
    return this.post(API_CONFIG.ENDPOINTS.LOGIN, credentials);
  }

  async sendMessage(message) {
    return this.post(API_CONFIG.ENDPOINTS.DIALOGO_MESSAGE, { message });
  }

  async getHistory() {
    return this.get(API_CONFIG.ENDPOINTS.DIALOGO_HISTORY);
  }

  async healthCheck() {
    return this.get(API_CONFIG.ENDPOINTS.HEALTH);
  }

  // Método para forzar reconexión
  async reconnect() {
    console.log('🔄 Forzando reconexión...');
    this.isInitialized = false;
    await this.initializeBackend();
  }
}

// Crear instancia única
const apiService = new ApiService();

// Exportar tanto el servicio como la configuración de manera explícita
export { API_CONFIG };
export default apiService;

// También exportar endpoints directamente para facilitar el uso
export const ENDPOINTS = API_CONFIG.ENDPOINTS;
