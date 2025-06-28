import React from 'react';
import { NavLink } from 'react-router-dom';
import authService from '../services/authService';
import './Menu.css';
import icons from '../assets/images/icons';

function Menu({ onLogout }) {
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
    <aside className="menu-container d-flex flex-column">
      <div className="menu-content d-flex flex-column h-100">
        {/* Brand Section */}
        <div className="brand-section">
          <h2 className="brand-title">BeCalm</h2>
          <p className="brand-subtitle">Tu santuario digital</p>
        </div>

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
    </aside>
  );
}

export default Menu;