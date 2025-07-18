// src/config/api.js - ARCHIVO COMPLETO CORREGIDO
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
  
  // ENDPOINTS CORREGIDOS SEGÚN TU API
  ENDPOINTS: {
    HEALTH: '/health',
    LOGIN: '/token',                    // ✅ CAMBIO: era /auth/login, ahora /token
    REGISTER: '/register',              // ✅ AGREGAR: endpoint de registro
    DIALOGO_MESSAGE: '/dialogo_conmigo/message',  // ✅ CAMBIO: ruta correcta
    DIALOGO_HISTORY: '/dialogo_conmigo/history',  // ✅ CAMBIO: ruta correcta
    GENERATE: '/v1/generate',           // ✅ AGREGAR: endpoint de generación
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

  // MÉTODO LOGIN CORREGIDO para usar /token con FormData
  async login(credentials) {
    const url = `${this.baseURL}${API_CONFIG.ENDPOINTS.LOGIN}`;
    console.log('📡 Login request a:', url);
    
    // FastAPI OAuth2PasswordRequestForm espera form data, no JSON
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          // NO incluir Content-Type para FormData
          'Accept': 'application/json',
        },
        body: formData  // Usar FormData en lugar de JSON
      });
      
      console.log('📥 Login response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Login exitoso');
      
      // Guardar token
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
      }
      
      return data;
      
    } catch (error) {
      console.error('❌ Login falló:', error);
      throw error;
    }
  }

  async register(userData) {
    return this.post(API_CONFIG.ENDPOINTS.REGISTER, userData);
  }

  async sendMessage(message) {
    return this.post(API_CONFIG.ENDPOINTS.DIALOGO_MESSAGE, { 
      prompt: message,
      mode: 'text' 
    });
  }

  async getHistory(days = 2) {
    return this.get(`${API_CONFIG.ENDPOINTS.DIALOGO_HISTORY}?days=${days}`);
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

// Exportar tanto el servicio como la configuración
export { API_CONFIG };
export default apiService;
