import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Menu from './components/Menu';
import DiarioVivo from './components/DiarioVivo';
import MeditaConmigo from './components/MeditaConmigo';
import MensajesDelAlma from './components/MensajesDelAlma';
import RitualDiario from './components/RitualDiario';
import MapaInterior from './components/MapaInterior';
import SilencioSagrado from './components/SilencioSagrado';
import authService from './services/authService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 wave-background">
        <div className="aurora-effect"></div>
        <div className="text-center">
          <div className="floating mb-4" style={{ fontSize: '4rem' }}>🕊️</div>
          <h2 className="gradient-text-animated mb-4" style={{ fontWeight: '700' }}>
            BeCalm
          </h2>
          <div className="spinner-premium mb-4"></div>
          <p className="text-light typewriter" style={{ 
            fontSize: '1.1rem', 
            fontWeight: '300',
            width: 'fit-content',
            margin: '0 auto'
          }}>
            Preparando tu santuario de paz...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta principal - Menu */}
          <Route path="/" element={<Menu onLogout={handleLogout} />} />
          
          {/* Rutas de componentes - PASAR onLogout */}
          <Route path="/diario-vivo" element={<DiarioVivo onLogout={handleLogout} />} />
          <Route path="/medita-conmigo" element={<MeditaConmigo onLogout={handleLogout} />} />
          <Route path="/mensajes-del-alma" element={<MensajesDelAlma onLogout={handleLogout} />} />
          <Route path="/ritual-diario" element={<RitualDiario onLogout={handleLogout} />} />
          <Route path="/mapa-interior" element={<MapaInterior onLogout={handleLogout} />} />
          <Route path="/silencio-sagrado" element={<SilencioSagrado onLogout={handleLogout} />} />
          
          {/* Redirect por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;