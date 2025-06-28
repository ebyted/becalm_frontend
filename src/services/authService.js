import API_CONFIG from '../config/api';

class AuthService {
  async login(username, password) {
    try {
      // Asegurar que tengamos un backend funcional
      await this.checkHealth();
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Credenciales incorrectas';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } catch (e) {
          // Si no puede parsear JSON, usar mensaje por defecto
          if (response.status === 404) {
            errorMessage = 'Servidor no encontrado. Verificando otros backends...';
          } else if (response.status === 401) {
            errorMessage = 'Usuario o contraseña incorrectos';
          } else {
            errorMessage = `Error del servidor: ${response.status}`;
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('token_type', data.token_type);
      localStorage.setItem('backend_url', API_CONFIG.BASE_URL); // Guardar URL funcional
      return data;
    } catch (error) {
      // Mejorar manejo de errores de red
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`No se puede conectar a ningún servidor. URLs probadas: ${API_CONFIG.BACKEND_URLS.join(', ')}`);
      }
      throw error;
    }
  }

  async register(username, password, fullName = '') {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
          full_name: fullName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al registrar usuario');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Check if token is expired (basic check)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp > now;
    } catch {
      return false;
    }
  }

  async checkHealth() {
    try {
      // Primero intentar encontrar un backend que funcione
      const workingUrl = await API_CONFIG.findWorkingBackend();
      return workingUrl !== null;
    } catch {
      return false;
    }
  }
}

export default new AuthService();
