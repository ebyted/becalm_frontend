// src/components/TopNav.js - MENÚ MÓVIL COMPLETAMENTE FUNCIONAL
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import '../styles/FixOverlay.css';

function TopNav({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    if (onLogout) onLogout();
  };

  const menuItems = [
    { name: 'Diálogo Conmigo', path: '/', emoji: '🕊️' },
    { name: 'Diario Vivo', path: '/diario-vivo', emoji: '📖' },
    { name: 'Medita Conmigo', path: '/medita-conmigo', emoji: '🧘‍♀️' },
    { name: 'Mensajes del Alma', path: '/mensajes-del-alma', emoji: '💌' },
    { name: 'Ritual Diario', path: '/ritual-diario', emoji: '🌅' },
    { name: 'Mapa Interior', path: '/mapa-interior', emoji: '🗺️' },
    { name: 'Silencio Sagrado', path: '/silencio-sagrado', emoji: '🤫' }
  ];

  const getCurrentPageName = () => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    return currentItem || { name: 'BeCalm', emoji: '🕊️' };
  };

  const currentPage = getCurrentPageName();

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-nav-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* HEADER PRINCIPAL */}
      <div className="top-navigation-header" style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px)',
        webkitBackdropFilter: 'blur(15px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        padding: '15px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '70px'
      }}>
        
        {/* BRAND */}
        <div className="brand-container" style={{
          display: 'flex',
          alignItems: 'center',
          flex: 1
        }}>
          <span 
            className="floating" 
            style={{ 
              fontSize: 'clamp(1.5rem, 6vw, 2rem)',
              marginRight: '12px'
            }}
          >
            {currentPage.emoji}
          </span>
          <span 
            className="text-light gradient-title no-triple-select" 
            style={{ 
              fontSize: 'clamp(1.1rem, 5vw, 1.5rem)',
              fontWeight: '600',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
            }}
          >
            {currentPage.name}
          </span>
        </div>

        {/* MENÚ DESKTOP */}
        <div className="desktop-menu" style={{
          display: 'none',
          alignItems: 'center',
          gap: '12px'
        }}>
          {/* Botón Home */}
          {location.pathname !== '/' && (
            <button
              onClick={() => navigate('/')}
              className="desktop-nav-btn"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                padding: '8px 16px',
                color: 'white',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              🏠 Inicio
            </button>
          )}

          {/* Botón Explorar */}
          <div className="desktop-dropdown" style={{ position: 'relative' }}>
            <button
              className="desktop-nav-btn"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                padding: '8px 16px',
                color: 'white',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              🌟 Explorar
            </button>
          </div>

          {/* Botón Logout */}
          <button
            onClick={handleLogout}
            className="desktop-nav-btn logout-btn"
            style={{
              background: 'rgba(220, 53, 69, 0.15)',
              border: '1px solid rgba(220, 53, 69, 0.4)',
              borderRadius: '20px',
              padding: '8px 16px',
              color: '#ff6b6b',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            🚪 Salir
          </button>
        </div>

        {/* BOTÓN HAMBURGUESA MÓVIL */}
        <button
          onClick={toggleMobileMenu}
          className="mobile-menu-toggle"
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            padding: '12px',
            color: 'white',
            fontSize: '1.4rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            transform: isMobileMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)'
          }}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* MENÚ MÓVIL OVERLAY */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1001,
          animation: 'fadeIn 0.3s ease'
        }}>
          <div className="mobile-nav-container" style={{
            position: 'absolute',
            top: '70px',
            left: '10px',
            right: '10px',
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            maxHeight: 'calc(100vh - 90px)',
            overflowY: 'auto',
            animation: 'slideInDown 0.3s ease'
          }}>
            
            {/* TÍTULO DEL MENÚ */}
            <div style={{
              textAlign: 'center',
              marginBottom: '20px',
              paddingBottom: '15px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h5 style={{
                color: 'white',
                margin: 0,
                fontSize: '1.2rem',
                fontWeight: '600'
              }}>
                🌟 Explorar BeCalm
              </h5>
            </div>

            {/* ELEMENTOS DEL MENÚ */}
            <div className="mobile-menu-items">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className="mobile-menu-item"
                  style={{
                    width: '100%',
                    background: location.pathname === item.path 
                      ? 'rgba(67, 233, 123, 0.25)' 
                      : 'rgba(255, 255, 255, 0.1)',
                    border: location.pathname === item.path
                      ? '2px solid rgba(67, 233, 123, 0.6)'
                      : '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '15px',
                    padding: '16px 20px',
                    marginBottom: '12px',
                    color: 'white',
                    fontSize: '1.1rem',
                    fontWeight: location.pathname === item.path ? '600' : '400',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ 
                    fontSize: '1.4rem', 
                    marginRight: '15px',
                    minWidth: '30px'
                  }}>
                    {item.emoji}
                  </span>
                  <span style={{ flex: 1 }}>{item.name}</span>
                  {location.pathname === item.path && (
                    <span style={{ 
                      color: '#43e97b', 
                      fontSize: '1.3rem',
                      fontWeight: 'bold'
                    }}>●</span>
                  )}
                </button>
              ))}
            </div>

            {/* SEPARADOR */}
            <div style={{
              height: '1px',
              background: 'rgba(255, 255, 255, 0.2)',
              margin: '20px 0'
            }}></div>

            {/* BOTÓN LOGOUT */}
            <button 
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="mobile-logout-btn"
              style={{
                width: '100%',
                background: 'rgba(220, 53, 69, 0.2)',
                border: '1px solid rgba(220, 53, 69, 0.5)',
                borderRadius: '15px',
                padding: '16px 20px',
                color: '#ff6b6b',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                textAlign: 'left'
              }}
            >
              <span style={{ 
                fontSize: '1.3rem', 
                marginRight: '15px',
                minWidth: '30px'
              }}>🚪</span>
              <span>Cerrar Sesión</span>
            </button>

            {/* BOTÓN CERRAR */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                width: '100%',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '15px',
                padding: '12px',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.9rem',
                cursor: 'pointer',
                marginTop: '15px',
                transition: 'all 0.3s ease'
              }}
            >
              Cerrar Menú
            </button>
          </div>
        </div>
      )}

      {/* CSS STYLES */}
      <style jsx>{`
        .floating {
          animation: floating 3s ease-in-out infinite;
        }

        @keyframes floating {
          0%, 100% { 
            transform: translateY(0px); 
          }
          50% { 
            transform: translateY(-3px); 
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mobile-menu-toggle:hover {
          background: rgba(255, 255, 255, 0.25) !important;
          transform: scale(1.05) ${isMobileMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)'} !important;
        }

        .mobile-menu-item:hover {
          background: rgba(255, 255, 255, 0.2) !important;
          transform: translateX(5px);
          border-color: rgba(255, 255, 255, 0.4) !important;
        }

        .mobile-logout-btn:hover {
          background: rgba(220, 53, 69, 0.3) !important;
          border-color: rgba(220, 53, 69, 0.7) !important;
          transform: translateX(3px);
        }

        .desktop-nav-btn:hover {
          background: rgba(255, 255, 255, 0.2) !important;
          transform: scale(1.05);
        }

        .logout-btn:hover {
          background: rgba(220, 53, 69, 0.25) !important;
        }

        /* RESPONSIVE BREAKPOINTS */
        @media (min-width: 992px) {
          .desktop-menu {
            display: flex !important;
          }
          
          .mobile-menu-toggle {
            display: none !important;
          }
        }

        @media (max-width: 991px) {
          .desktop-menu {
            display: none !important;
          }
          
          .mobile-menu-toggle {
            display: flex !important;
          }
        }

        @media (max-width: 576px) {
          .top-navigation-header {
            padding: 12px 16px !important;
          }
          
          .mobile-nav-container {
            left: 5px !important;
            right: 5px !important;
            padding: 16px !important;
          }
          
          .mobile-menu-item {
            padding: 14px 16px !important;
            font-size: 1rem !important;
          }
          
          .mobile-logout-btn {
            padding: 14px 16px !important;
            font-size: 1rem !important;
          }
        }

        /* Scrollbar personalizado para el menú móvil */
        .mobile-nav-container::-webkit-scrollbar {
          width: 4px;
        }

        .mobile-nav-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        .mobile-nav-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }

        /* Prevenir scroll del body cuando el menú está abierto */
        ${isMobileMenuOpen ? `
          body {
            overflow: hidden;
          }
        ` : ''}
      `}</style>
    </>
  );
}

export default TopNav;