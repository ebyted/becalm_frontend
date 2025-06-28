import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const useApi = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!endpoint) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiService.get(endpoint);
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('🚨 useApi Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.immediate !== false && endpoint) {
      fetchData();
    }
  }, [endpoint]);

  return { data, loading, error, refetch: fetchData };
};

// Hook para POST requests
export const useApiPost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (endpoint, data) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiService.post(endpoint, data);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { postData, loading, error };
};

// Hook específico para autenticación
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.login(credentials);
      localStorage.setItem('access_token', response.access_token);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  return { user, login, logout, loading, error };
};

export default useApi;