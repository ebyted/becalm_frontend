// src/components/TopNavigation.js - NUEVO COMPONENTE
import React from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
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

          <Navbar.Toggle aria-controls="top-navbar-nav" style={{
            border: 'none',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px'
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
                      transition: 'all 0.3s ease'
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
                <div className="dropdown">
                  <Button
                    variant="outline-light"
                    size="sm"
                    className="dropdown-toggle nav-btn"
                    data-bs-toggle="dropdown"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '20px',
                      padding: '8px 16px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <span className="me-1">🌟</span>
                    <span>Explorar</span>
                  </Button>
                  <ul className="dropdown-menu dropdown-menu-end" style={{
                    background: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    marginTop: '8px'
                  }}>
                    {menuItems.map((item) => (
                      <li key={item.path}>
                        <button
                          className="dropdown-item d-flex align-items-center"
                          onClick={() => navigate(item.path)}
                          style={{
                            color: 'white',
                            background: 'transparent',
                            border: 'none',
                            padding: '8px 16px',
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
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </Nav.Item>

              {/* Botón Logout */}
              <Nav.Item>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={handleLogout}
                  className="d-flex align-items-center nav-btn"
                  style={{
                    background: 'rgba(220, 53, 69, 0.1)',
                    border: '1px solid rgba(220, 53, 69, 0.3)',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    transition: 'all 0.3s ease',
                    color: '#ff6b6b'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(220, 53, 69, 0.2)';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(220, 53, 69, 0.1)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <span className="me-1">🚪</span>
                  <span className="d-none d-md-inline">Salir</span>
                </Button>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* CSS para animaciones */}
      <style jsx>{`
        .nav-btn:focus {
          box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25) !important;
        }
        
        .dropdown-menu {
          animation: fadeInDown 0.3s ease-out;
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
      `}</style>
    </>
  );
}

export default TopNavigation;