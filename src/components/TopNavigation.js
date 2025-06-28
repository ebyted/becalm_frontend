
// src/components/TopNavigation.js - MENÚ MÓVIL FUNCIONAL
import React, { useState } from 'react';
import { Container, Navbar, Nav, Button, Dropdown } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import '../styles/FixOverlay.css';

function TopNavigation({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

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
    setExpanded(false); // Cerrar menú después de navegar
  };

  return (
    <>
      <Navbar 
        expand="lg" 
        expanded={expanded}
        onToggle={(expanded) => setExpanded(expanded)}
        className="top-navigation shadow-sm" 
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          webkitBackdropFilter: 'blur(15px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          minHeight: '70px'
        }}
      >
        <Container fluid className="px-3">
          {/* Brand - Responsive */}
          <Navbar.Brand className="d-flex align-items-center">
            <span 
              className="me-2 floating" 
              style={{ 
                fontSize: 'clamp(1.3rem, 5vw, 1.8rem)'
              }}
            >
              {currentPage.emoji}
            </span>
            <span 
              className="text-light gradient-title no-triple-select" 
              style={{ 
                fontSize: 'clamp(1rem, 4vw, 1.4rem)',
                fontWeight: '600',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
              }}
            >
              {currentPage.name}
            </span>
          </Navbar.Brand>

          {/* Mobile Toggle - CORREGIDO */}
          <Navbar.Toggle 
            aria-controls="top-navbar-nav"
            onClick={() => setExpanded(!expanded)}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              padding: '12px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              outline: 'none',
              boxShadow: 'none',
              fontSize: '1.2rem'
            }}
          >
            <span style={{ 
              color: 'white', 
              fontSize: '1.4rem',
              display: 'block',
              transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease'
            }}>
              {expanded ? '✕' : '☰'}
            </span>
          </Navbar.Toggle>

          <Navbar.Collapse id="top-navbar-nav">
            <Nav className="ms-auto">
              
              {/* MENÚ MÓVIL - Visible solo en pantallas pequeñas */}
              <div className="d-lg-none w-100 mobile-menu-container" style={{
                paddingTop: '1rem',
                paddingBottom: '1rem'
              }}>
                {menuItems.map((item) => (
                  <div key={item.path} className="mobile-menu-item-wrapper mb-2">
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className="mobile-menu-item w-100 text-start d-flex align-items-center"
                      style={{
                        background: location.pathname === item.path 
                          ? 'rgba(67, 233, 123, 0.25)' 
                          : 'rgba(255, 255, 255, 0.1)',
                        border: location.pathname === item.path
                          ? '1px solid rgba(67, 233, 123, 0.5)'
                          : '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        padding: '15px 18px',
                        color: 'white',
                        transition: 'all 0.3s ease',
                        fontSize: '1rem',
                        fontWeight: location.pathname === item.path ? '600' : '400',
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'left'
                      }}
                    >
                      <span className="me-3" style={{ fontSize: '1.3rem' }}>
                        {item.emoji}
                      </span>
                      <span className="flex-grow-1">{item.name}</span>
                      {location.pathname === item.path && (
                        <span style={{ 
                          color: '#43e97b', 
                          fontSize: '1.2rem',
                          fontWeight: 'bold'
                        }}>●</span>
                      )}
                    </button>
                  </div>
                ))}
                
                {/* Separador */}
                <hr style={{ 
                  border: 'none', 
                  height: '1px', 
                  background: 'rgba(255, 255, 255, 0.2)',
                  margin: '1rem 0'
                }} />
                
                {/* Botón Logout móvil */}
                <div className="mobile-logout-wrapper">
                  <button 
                    className="w-100 mobile-logout-btn"
                    onClick={() => {
                      handleLogout();
                      setExpanded(false);
                    }}
                    style={{
                      background: 'rgba(220, 53, 69, 0.2)',
                      border: '1px solid rgba(220, 53, 69, 0.4)',
                      borderRadius: '12px',
                      padding: '15px 18px',
                      color: '#ff6b6b',
                      fontSize: '1rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <span className="me-3" style={{ fontSize: '1.2rem' }}>🚪</span>
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>

              {/* MENÚ DESKTOP - Solo visible en pantallas grandes */}
              <div className="d-none d-lg-flex align-items-center">
                {/* Botón Home */}
                {location.pathname !== '/' && (
                  <Nav.Item className="me-2">
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={() => navigate('/')}
                      className="nav-btn"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '20px',
                        padding: '8px 16px',
                        transition: 'all 0.3s ease',
                        color: 'white',
                        fontSize: '0.9rem'
                      }}
                    >
                      <span className="me-1">🏠</span>
                      <span>Inicio</span>
                    </Button>
                  </Nav.Item>
                )}

                {/* Dropdown Explorar */}
                <Nav.Item className="me-2">
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="outline-light"
                      size="sm"
                      className="nav-btn"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '20px',
                        padding: '8px 16px',
                        transition: 'all 0.3s ease',
                        color: 'white',
                        fontSize: '0.9rem'
                      }}
                    >
                      <span className="me-1">🌟</span>
                      <span>Explorar</span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu 
                      align="end"
                      style={{
                        background: 'rgba(0, 0, 0, 0.9)',
                        backdropFilter: 'blur(20px)',
                        webkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        marginTop: '8px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                        minWidth: '220px'
                      }}
                    >
                      {menuItems.map((item) => (
                        <Dropdown.Item
                          key={item.path}
                          onClick={() => navigate(item.path)}
                          className="d-flex align-items-center dropdown-item-custom"
                          style={{
                            color: 'white',
                            background: 'transparent',
                            border: 'none',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            margin: '2px 4px',
                            transition: 'all 0.3s ease',
                            fontSize: '0.95rem',
                            cursor: 'pointer'
                          }}
                        >
                          <span className="me-2" style={{ fontSize: '1.1rem' }}>
                            {item.emoji}
                          </span>
                          <span>{item.name}</span>
                          {location.pathname === item.path && (
                            <span className="ms-auto" style={{ color: '#43e97b', fontSize: '0.8rem' }}>●</span>
                          )}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Nav.Item>

                {/* Botón Logout Desktop */}
                <Nav.Item>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={handleLogout}
                    className="nav-btn"
                    style={{
                      background: 'rgba(220, 53, 69, 0.15)',
                      border: '1px solid rgba(220, 53, 69, 0.4)',
                      borderRadius: '20px',
                      padding: '8px 16px',
                      transition: 'all 0.3s ease',
                      color: '#ff6b6b',
                      fontSize: '0.9rem'
                    }}
                  >
                    <span className="me-1">🚪</span>
                    <span>Salir</span>
                  </Button>
                </Nav.Item>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* CSS Mejorado para móvil */}
      <style jsx>{`
        .navbar-toggler:focus {
          box-shadow: none !important;
          outline: none !important;
        }

        .navbar-toggler:hover {
          background: rgba(255, 255, 255, 0.25) !important;
          transform: scale(1.05);
        }

        .mobile-menu-item:hover {
          background: rgba(255, 255, 255, 0.2) !important;
          transform: translateX(5px);
          border-color: rgba(255, 255, 255, 0.4) !important;
        }

        .mobile-logout-btn:hover {
          background: rgba(220, 53, 69, 0.3) !important;
          border-color: rgba(220, 53, 69, 0.6) !important;
          transform: translateX(3px);
        }

        .dropdown-item-custom:hover {
          background: rgba(255, 255, 255, 0.15) !important;
          transform: translateX(4px);
        }

        .nav-btn:hover {
          background: rgba(255, 255, 255, 0.2) !important;
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .nav-btn:focus {
          box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25) !important;
          outline: none !important;
        }

        .dropdown-toggle::after {
          border-top-color: white !important;
          margin-left: 0.5em !important;
        }

        .dropdown-menu {
          animation: fadeInDown 0.2s ease-out;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

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

        /* CORRECCIONES ESPECÍFICAS PARA MÓVIL */
        @media (max-width: 991px) {
          .navbar-collapse {
            background: rgba(0, 0, 0, 0.95) !important;
            backdrop-filter: blur(20px);
            border-radius: 15px;
            margin-top: 10px;
            padding: 15px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          }

          .navbar-collapse.show {
            display: block !important;
            animation: slideInDown 0.3s ease-out;
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

          .mobile-menu-container {
            width: 100% !important;
          }

          .navbar-nav {
            width: 100%;
          }
        }

        @media (max-width: 576px) {
          .navbar {
            padding: 0.5rem 0.75rem !important;
          }
          
          .container-fluid {
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
          }

          .mobile-menu-item {
            font-size: 0.95rem !important;
            padding: 12px 15px !important;
          }

          .mobile-logout-btn {
            font-size: 0.95rem !important;
            padding: 12px 15px !important;
          }
        }

        /* Evitar que el body se desplace cuando el menú está abierto */
        .navbar-collapse.show {
          position: relative;
          z-index: 1050;
        }

        /* Smooth transitions */
        .navbar-collapse {
          transition: all 0.3s ease;
        }

        .mobile-menu-item, .mobile-logout-btn {
          transition: all 0.2s ease;
        }
      `}</style>
    </>
  );
}

export default TopNavigation;