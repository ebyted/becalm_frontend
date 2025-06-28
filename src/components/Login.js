import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import authService from '../services/authService';
import apiService, { API_CONFIG } from '../config/api';
import ConnectionStatus from './ConnectionStatus';

function Login({ onLogin }) {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Usar el método del servicio directamente
      const response = await apiService.login({
        username: formData.username,
        password: formData.password
      });
      
      console.log('✅ Login exitoso:', response);
      setSuccess('¡Bienvenido a BeCalm!');
      setTimeout(() => {
        onLogin();
      }, 1000);
    } catch (error) {
      console.error('❌ Error en login:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.register(formData.username, formData.password, formData.fullName);
      setSuccess('Usuario creado exitosamente. Ahora puedes iniciar sesión.');
      setActiveTab('login');
      setFormData({ ...formData, password: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="w-100" style={{ maxWidth: '500px' }}>
        <div className="text-center mb-5">
          <h1 className="brand-logo display-4 floating">🕊️ BeCalm</h1>
          <p className="text-light mb-4" style={{ 
            fontSize: '1.1rem', 
            fontWeight: '300',
            color: '#ffffff',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.7)'
          }}>
            Tu santuario digital de paz y bienestar
          </p>
          
          {/* Connection Status Component */}
          <ConnectionStatus />
        </div>

        <div className="modern-card p-5">
          {error && (
            <div className="alert-modern text-center mb-4" style={{ color: '#e74c3c' }}>
              {error}
            </div>
          )}
          
          {success && (
            <div className="alert-modern text-center mb-4" style={{ color: '#27ae60' }}>
              {success}
            </div>
          )}

          <div className="mb-4">
            <div className="d-flex justify-content-center">
              <div className="nav-tabs-modern d-flex">
                <button
                  className={`nav-link ${activeTab === 'login' ? 'active' : ''}`}
                  onClick={() => setActiveTab('login')}
                  style={{
                    background: activeTab === 'login' ? 'var(--primary-gradient)' : 'var(--glass-bg)',
                    color: activeTab === 'login' ? 'white' : 'var(--text-primary)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--border-radius) var(--border-radius) 0 0',
                    padding: '12px 24px',
                    marginRight: '4px',
                    transition: 'var(--transition)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    cursor: 'pointer'
                  }}
                >
                  🔑 Iniciar Sesión
                </button>
                <button
                  className={`nav-link ${activeTab === 'register' ? 'active' : ''}`}
                  onClick={() => setActiveTab('register')}
                  style={{
                    background: activeTab === 'register' ? 'var(--primary-gradient)' : 'var(--glass-bg)',
                    color: activeTab === 'register' ? 'white' : 'var(--text-primary)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--border-radius) var(--border-radius) 0 0',
                    padding: '12px 24px',
                    transition: 'var(--transition)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    cursor: 'pointer'
                  }}
                >
                  ✨ Registrarse
                </button>
              </div>
            </div>
          </div>

          {activeTab === 'login' ? (
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="form-label text-light mb-2" style={{ fontWeight: '500' }}>
                  👤 Usuario
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-control-modern w-100"
                  placeholder="Ingresa tu nombre de usuario"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-light mb-2" style={{ fontWeight: '500' }}>
                  🔒 Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control-modern w-100"
                  placeholder="Ingresa tu contraseña"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-modern btn-success-modern w-100 d-flex align-items-center justify-content-center"
                style={{ padding: '14px' }}
              >
                {loading ? (
                  <>
                    <div className="modern-spinner me-2" style={{ width: '20px', height: '20px' }}></div>
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <span className="me-2">Entrar</span>
                    <span>🚀</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <label className="form-label text-light mb-2" style={{ fontWeight: '500' }}>
                  ✨ Nombre Completo
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="form-control-modern w-100"
                  placeholder="Ingresa tu nombre completo"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-light mb-2" style={{ fontWeight: '500' }}>
                  👤 Usuario
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-control-modern w-100"
                  placeholder="Elige un nombre de usuario"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-light mb-2" style={{ fontWeight: '500' }}>
                  🔒 Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control-modern w-100"
                  placeholder="Crea una contraseña segura"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-modern btn-success-modern w-100 d-flex align-items-center justify-content-center"
                style={{ padding: '14px' }}
              >
                {loading ? (
                  <>
                    <div className="modern-spinner me-2" style={{ width: '20px', height: '20px' }}></div>
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    <span className="me-2">Crear Cuenta</span>
                    <span>🌟</span>
                  </>
                )}
              </button>
            </form>
          )}

          <div className="text-center mt-4">
            <p className="text-light" style={{ opacity: 0.8, fontSize: '0.9rem' }}>
              {activeTab === 'login' 
                ? '¿No tienes cuenta? Únete a nuestra comunidad' 
                : '¿Ya tienes cuenta? Inicia sesión y continúa tu viaje'
              }
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Login;
