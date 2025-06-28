// src/services/api.js - Versión simplificada
import API_CONFIG from '../config/api';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.isInitialized = false;
    console.log('🚀 ApiService creado con URL:', this.baseURL);
  }

  async ensureInitialized() {
    if (!this.isInitialized) {
      console.log('🔄 Inicializando ApiService...');
      await API_CONFIG.findWorkingBackend();
      this.baseURL = API_CONFIG.BASE_URL;
      this.isInitialized = true;
      console.log('✅ ApiService inicializado con:', this.baseURL);
    }
  }

  async request(endpoint, options = {}) {
    // No llamar ensureInitialized aquí para evitar problemas de inicialización
    const url = `${this.baseURL}${endpoint}`;
    console.log('📡 Request a:', url);
    
    const config = {
      ...options,
      headers: {
        ...API_CONFIG.getAuthHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      console.log('📥 Response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('access_token');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Request exitoso');
      return data;
      
    } catch (error) {
      console.error('❌ Request falló:', {
        url,
        error: error.message
      });
      throw error;
    }
  }

  // Métodos HTTP simples
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

  // Métodos específicos
  async healthCheck() {
    return this.get('/health');
  }

  async login(credentials) {
    return this.post('/auth/login', credentials);
  }
}

// Crear instancia única
const apiService = new ApiService();

// Inicializar de forma asíncrona después de un delay para evitar problemas de carga
setTimeout(async () => {
  try {
    await apiService.ensureInitialized();
  } catch (error) {
    console.error('⚠️ Error inicializando API:', error);
  }
}, 1000);

export default apiService;