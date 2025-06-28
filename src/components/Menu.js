import React from 'react';
import { NavLink } from 'react-router-dom';
import authService from '../services/authService';
import './Menu.css';
import icons from '../assets/images/icons';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/FixOverlay.css';

function Menu({ onLogout }) {
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Diálogo Conmigo', path: '/', icon: icons.dialogo, emoji: '🕊️' },
    { name: 'Diario Vivo', path: '/diario-vivo', icon: icons.diario, emoji: '📖' },
    { name: 'Medita Conmigo', path: '/medita-conmigo', icon: icons.medita, emoji: '🧘‍♀️' },
    { name: 'Mensajes del Alma', path: '/mensajes-del-alma', icon: icons.mensajes, emoji: '💌' },
    { name: 'Ritual Diario', path: '/ritual-diario', icon: icons.ritual, emoji: '🌅' },
    { name: 'Mapa Interior', path: '/mapa-interior', icon: icons.mapa, emoji: '🗺️' },
    { name: 'Silencio Sagrado', path: '/silencio-sagrado', icon: icons.silencio, emoji: '🤫' }
  ];

  const handleLogout = () => {
    authService.logout();
    if (onLogout) onLogout();
  };

  return (
    <Container fluid className="py-4">
      <div className="text-center mb-5">
        <div className="menu-container">
          <h1 className="gradient-title display-4 floating no-triple-select">
            🌟 BeCalm Menu
          </h1>
          <p className="text-light mb-4" style={{ 
            fontSize: '1.1rem', 
            fontWeight: '300',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' 
          }}>
            Elige tu camino hacia la paz interior
          </p>
        </div>
      </div>
      <div className="menu-content d-flex flex-column h-100">
        {/* Menu Items */}
        <div className="flex-grow-1">
          {menuItems.map((item, index) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                isActive ? 'custom-item active text-decoration-none' : 'custom-item text-decoration-none'
              }
              style={{ 
                animationDelay: `${index * 0.1}s`,
                animation: 'fadeInLeft 0.5s ease-out both'
              }}
            >
              {/* Usar icono PNG si está disponible, sino emoji */}
              {item.icon ? (
                <img src={item.icon} alt={item.name} className="icon" />
              ) : (
                <span className="icon d-flex align-items-center justify-content-center" style={{ fontSize: '1.4rem' }}>
                  {item.emoji}
                </span>
              )}
              <span className="item-text text-light">{item.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Logout Section */}
        <div className="logout-section">
          <button 
            className="logout-button d-flex align-items-center justify-content-center"
            onClick={handleLogout}
          >
            <span className="me-2">🚪</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </Container>
  );
}

export default Menu;