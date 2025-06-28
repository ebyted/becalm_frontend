// src/components/SmartNavigation.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isMobileDevice, getDeviceInfo } from '../utils/deviceDetector';
import authService from '../services/authService';
import '../styles/FixOverlay.css';

const SmartNavigation = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Diálogo Conmigo', path: '/', emoji: '🕊️' },
    { name: 'Diario Vivo', path: '/diario-vivo', emoji: '📖' },
    { name: 'Medita Conmigo', path: '/medita-conmigo', emoji: '🧘‍♀️' },
    { name: 'Mensajes del Alma', path: '/mensajes-del-alma', emoji: '💌' },
    { name: 'Ritual Diario', path: '/ritual-diario', emoji: '🌅' },
    { name: 'Mapa Interior', path: '/mapa-interior', emoji: '🗺️' },
    { name: 'Silencio Sagrado', path: '/silencio-sagrado', emoji: '🤫' }
  ];

  useEffect(() => {
    const detectDevice = () => {
      const info = getDeviceInfo();
      setDeviceInfo(info);
      setIsLoading(false);
      
      console.log('🔍 Device Detection:', {
        isMobile: info.isMobile,
        screenWidth: info.screenWidth,
        userAgent: info.userAgent.substring(0, 50) + '...'
      });
    };

    detectDevice();

    const handleResize = () => {
      detectDevice();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const getCurrentPageName = () => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    return currentItem || { name: 'BeCalm', emoji: '🕊️' };
  };

  const handleLogout = () => {
    authService.logout();
    if (onLogout) onLogout();
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const currentPage = getCurrentPageName();

  if (isLoading) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '20px',
        textAlign: 'center',
        color: 'white',
        backdropFilter: 'blur(15px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{ fontSize: '24px', marginBottom: '10px' }}>🔄</div>
        <div>Cargando navegación...</div>
      </div>
    );
  }

  return (
    <>
      {/* HEADER UNIVERSAL */}
      <div className="smart-navigation-header" style={{
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
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
              color: 'white'
            }}
          >
            {currentPage.name}
          </span>
        </div>

        {/* MENÚ DESKTOP - Para pantallas grandes */}
        {!deviceInfo?.isMobile && (
          <div className="desktop-menu" style={{
            display: 'flex',
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
                  padding: '10px 18px',
                  color: 'white',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>🏠</span>
                <span>Inicio</span>
              </button>
            )}

            {/* Botones de Navegación */}
            {menuItems.filter(item => item.path !== location.pathname).slice(0, 2).map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="desktop-nav-btn"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '20px',
                  padding: '10px 18px',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{item.emoji}</span>
                <span style={{ whiteSpace: 'nowrap' }}>{item.name}</span>
              </button>
            ))}

            {/* Botón Más */}
            <button
              onClick={toggleMobileMenu}
              className="desktop-nav-btn"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                padding: '10px 18px',
                color: 'white',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              🌟 Más
            </button>

            {/* Botón Logout */}
            <button
              onClick={handleLogout}
              className="desktop-nav-btn logout-btn"
              style={{
                background: 'rgba(220, 53, 69, 0.15)',
                border: '1px solid rgba(220, 53, 69, 0.4)',
                borderRadius: '20px',
                padding: '10px 18px',
                color: '#ff6b6b',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>🚪</span>
              <span>Salir</span>
            </button>
          </div>
        )}

        {/* BOTÓN HAMBURGUESA - Para móviles o cuando se necesite */}
        {(deviceInfo?.isMobile || window.innerWidth <= 1200) && (
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
        )}
      </div>

      {/* MENÚ MÓVIL/OVERLAY */}
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
          <div className="mobile-nav-container" onClick={(e) => e.stopPropagation()} style={{
            position: 'absolute',
            top: '80px',
            left: '10px',
            right: '10px',
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '25px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto',
            animation: 'slideInDown 0.3s ease'
          }}>
            
            {/* TÍTULO DEL MENÚ */}
            <div style={{
              textAlign: 'center',
              marginBottom: '25px',
              paddingBottom: '20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h5 style={{
                color: 'white',
                margin: 0,
                fontSize: '1.3rem',
                fontWeight: '600'
              }}>
                🌟 Explora BeCalm
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
                    padding: '18px 22px',
                    marginBottom: '15px',
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
                    fontSize: '1.5rem', 
                    marginRight: '18px',
                    minWidth: '35px'
                  }}>
                    {item.emoji}
                  </span>
                  <span style={{ flex: 1 }}>{item.name}</span>
                  {location.pathname === item.path && (
                    <span style={{ 
                      color: '#43e97b', 
                      fontSize: '1.4rem',
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
              margin: '25px 0'
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
                padding: '18px 22px',
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
                fontSize: '1.4rem', 
                marginRight: '18px',
                minWidth: '35px'
              }}>🚪</span>
              <span>Cerrar Sesión</span>
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
          transform: translateX(8px);
          border-color: rgba(255, 255, 255, 0.4) !important;
        }

        .mobile-logout-btn:hover {
          background: rgba(220, 53, 69, 0.3) !important;
          border-color: rgba(220, 53, 69, 0.7) !important;
          transform: translateX(5px);
        }

        .desktop-nav-btn:hover {
          background: rgba(255, 255, 255, 0.2) !important;
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .logout-btn:hover {
          background: rgba(220, 53, 69, 0.25) !important;
          transform: scale(1.05);
        }

        /* Scrollbar personalizado */
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

        @media (max-width: 576px) {
          .smart-navigation-header {
            padding: 12px 16px !important;
          }
          
          .mobile-nav-container {
            left: 5px !important;
            right: 5px !important;
            padding: 20px !important;
          }
          
          .mobile-menu-item {
            padding: 16px 18px !important;
            font-size: 1.05rem !important;
          }
          
          .mobile-logout-btn {
            padding: 16px 18px !important;
            font-size: 1.05rem !important;
          }
        }
      `}</style>
    </>
  );
};

export default SmartNavigation;