// src/components/TopNavigation.js - ARCHIVO COMPLETO
import React from 'react';
import { Container, Navbar, Nav, Button, Dropdown } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import '../styles/FixOverlay.css';

function TopNavigation({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <>
      <Navbar expand="lg" className="top-navigation shadow-sm" style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px)',
        webkitBackdropFilter: 'blur(15px)', // Safari
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <Container>
          {/* Título actual con animación */}
          <Navbar.Brand className="d-flex align-items-center">
            <span 
              className="me-2 floating" 
              style={{ fontSize: '1.8rem' }}
            >
              {currentPage.emoji}
            </span>
            <span 
              className="text-light gradient-title no-triple-select" 
              style={{ 
                fontSize: '1.4rem',
                fontWeight: '600',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
              }}
            >
              {currentPage.name}
            </span>
          </Navbar.Brand>

          {/* Mobile Toggle */}
          <Navbar.Toggle aria-controls="top-navbar-nav" style={{
            border: 'none',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '8px 12px'
          }}>
            <span style={{ color: 'white', fontSize: '1.2rem' }}>☰</span>
          </Navbar.Toggle>

          <Navbar.Collapse id="top-navbar-nav">
            <Nav className="ms-auto d-flex align-items-center">
              
              {/* Botón Home - Solo si no estamos en home */}
              {location.pathname !== '/' && (
                <Nav.Item className="me-2">
                  <Button
                    variant="outline-light"
                    size="sm"
                    onClick={() => navigate('/')}
                    className="d-flex align-items-center nav-btn"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '20px',
                      padding: '8px 16px',
                      transition: 'all 0.3s ease',
                      color: 'white'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    <span className="me-1">🏠</span>
                    <span className="d-none d-md-inline">Inicio</span>
                  </Button>
                </Nav.Item>
              )}

              {/* Menú dropdown para pantallas grandes */}
              <Nav.Item className="me-2 d-none d-lg-block">
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
                      color: 'white'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    <span className="me-1">🌟</span>
                    <span>Explorar</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu 
                    align="end"
                    style={{
                      background: 'rgba(0, 0, 0, 0.85)',
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
                        className="d-flex align-items-center"
                        style={{
                          color: 'white',
                          background: 'transparent',
                          border: 'none',
                          padding: '10px 16px',
                          borderRadius: '8px',
                          margin: '2px 4px',
                          transition: 'all 0.3s ease',
                          fontSize: '0.95rem'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                          e.target.style.transform = 'translateX(4px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.transform = 'translateX(0)';
                        }}
                      >
                        <span className="me-2" style={{ fontSize: '1.1rem' }}>
                          {item.emoji}
                        </span>
                        <span>{item.name}</span>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Nav.Item>

              {/* Menú móvil - Solo en pantallas pequeñas */}
              <Nav.Item className="me-2 d-lg-none">
                <Dropdown>
                  <Dropdown.Toggle
                    variant="outline-light"
                    size="sm"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '20px',
                      padding: '8px 12px',
                      color: 'white'
                    }}
                  >
                    <span className="me-1">📱</span>
                    <span className="d-none d-sm-inline">Menú</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu 
                    align="end"
                    style={{
                      background: 'rgba(0, 0, 0, 0.9)',
                      backdropFilter: 'blur(15px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      marginTop: '8px',
                      minWidth: '200px'
                    }}
                  >
                    {menuItems.map((item) => (
                      <Dropdown.Item
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className="d-flex align-items-center"
                        style={{
                          color: 'white',
                          background: 'transparent',
                          padding: '10px 16px',
                          borderRadius: '8px',
                          margin: '2px 4px',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                        }}
                      >
                        <span className="me-2">{item.emoji}</span>
                        <span>{item.name}</span>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Nav.Item>

              {/* Botón Logout */}
              <Nav.Item>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={handleLogout}
                  className="d-flex align-items-center nav-btn"
                  style={{
                    background: 'rgba(220, 53, 69, 0.15)',
                    border: '1px solid rgba(220, 53, 69, 0.4)',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    transition: 'all 0.3s ease',
                    color: '#ff6b6b'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(220, 53, 69, 0.25)';
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.color = '#ff5252';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(220, 53, 69, 0.15)';
                    e.target.style.transform = 'scale(1)';
                    e.target.style.color = '#ff6b6b';
                  }}
                >
                  <span className="me-1">🚪</span>
                  <span className="d-none d-sm-inline">Salir</span>
                </Button>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* CSS personalizado para animaciones */}
      <style jsx>{`
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

        /* Responsive */
        @media (max-width: 768px) {
          .top-navigation .navbar-brand span {
            font-size: 1.2rem !important;
          }
          
          .top-navigation .navbar-brand .floating {
            font-size: 1.5rem !important;
          }
        }

        /* Mejor contraste para texto */
        .nav-btn {
          color: white !important;
        }

        .nav-btn:hover {
          color: white !important;
        }
      `}</style>
    </>
  );
}

export default TopNavigation;