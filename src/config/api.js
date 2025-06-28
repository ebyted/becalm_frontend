import API_CONFIG from '../config/api';

class ApiService {
  constructor() {
    this.initializeBackend();
  }

  async initializeBackend() {
    console.log('🔄 Inicializando conexión con backend...');
    await API_CONFIG.findWorkingBackend();
    console.log('🚀 ApiService usando URL:', API_CONFIG.BASE_URL);
  }

  async request(endpoint, options = {}) {
    // Asegurar que tenemos una URL válida
    if (!API_CONFIG.BASE_URL) {
      await this.initializeBackend();
    }

    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
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
        error: error.message,
        config
      });
      
      // Si falla, intentar encontrar otro backend
      if (error.message.includes('fetch')) {
        console.log('🔄 Intentando reconectar con otro backend...');
        await API_CONFIG.findWorkingBackend();
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
}

const apiService = new ApiService();
export default apiService;
