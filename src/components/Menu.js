import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import '../styles/FixOverlay.css';

function Menu({ onLogout }) {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'dialogo-conmigo',
      title: '🗣️ Diálogo Conmigo',
      description: 'Conversación profunda contigo mismo',
      path: '/',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      id: 'diario-vivo',
      title: '📖 Diario Vivo',
      description: 'Registra tus pensamientos y reflexiones',
      path: '/diario-vivo',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      id: 'medita-conmigo',
      title: '🧘‍♀️ Medita Conmigo',
      description: 'Encuentra paz interior a través de la meditación',
      path: '/medita-conmigo',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      id: 'mensajes-del-alma',
      title: '💌 Mensajes del Alma',
      description: 'Recibe mensajes inspiradores',
      path: '/mensajes-del-alma',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    {
      id: 'ritual-diario',
      title: '🌅 Ritual Diario',
      description: 'Crea rutinas sagradas para tu bienestar',
      path: '/ritual-diario',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    {
      id: 'mapa-interior',
      title: '🗺️ Mapa Interior',
      description: 'Explora tu mundo interior',
      path: '/mapa-interior',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    },
    {
      id: 'silencio-sagrado',
      title: '🤫 Silencio Sagrado',
      description: 'Encuentra la paz en el silencio',
      path: '/silencio-sagrado',
      gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    }
  ];

  const handleLogout = () => {
    authService.logout();
    if (onLogout) onLogout();
  };

  return (
    <Container fluid className="py-4">
      {/* Título principal */}
      <div className="text-center mb-5">
        <div className="menu-container">
          <h1 className="gradient-title display-1 floating no-triple-select mb-4">🕊️ BeCalm</h1>
          <p className="text-light mb-4" style={{ 
            fontSize: '1.3rem', 
            fontWeight: '300',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' 
          }}>
            Tu santuario digital de paz y bienestar
          </p>
        </div>
      </div>

      {/* Grid de opciones del menú */}
      <Row className="g-4 mb-5">
        {menuItems.map((item, index) => (
          <Col key={item.id} xs={12} md={6} lg={4}>
            <div 
              className="menu-card modern-card h-100 p-4"
              onClick={() => navigate(item.path)}
              style={{
                background: item.gradient,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                animationDelay: `${index * 0.1}s`,
                animation: 'fadeInUp 0.6s ease-out both',
                borderRadius: '20px',
                border: 'none',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
              }}
            >
              {/* Efecto de brillo sutil */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)'
              }}></div>
              
              <div className="text-center">
                <h4 className="text-white mb-3" style={{ 
                  fontWeight: '600',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  fontSize: '1.5rem'
                }}>
                  {item.title}
                </h4>
                <p className="text-white mb-0" style={{ 
                  opacity: 0.9,
                  fontSize: '1.05rem',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                  lineHeight: '1.4'
                }}>
                  {item.description}
                </p>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Sección de información y logout */}
      <Row className="g-4">
        <Col xs={12} lg={8}>
          <div className="modern-card p-4" style={{ 
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px'
          }}>
            <h5 className="text-light mb-3" style={{ 
              fontWeight: '600',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
            }}>
              ✨ Bienvenido a tu espacio de calma
            </h5>
            <p className="text-light mb-0" style={{ 
              opacity: 0.8,
              fontSize: '1.05rem',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
              lineHeight: '1.6'
            }}>
              Cada herramienta está diseñada para acompañarte en tu viaje hacia el bienestar interior.
              Tómate tu tiempo, respira profundo y elige lo que tu corazón necesita hoy.
            </p>
          </div>
        </Col>
        
        <Col xs={12} lg={4}>
          <div className="modern-card p-4 h-100 d-flex align-items-center justify-content-center" style={{ 
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            borderRadius: '20px',
            border: 'none',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
          }}>
            <button 
              className="btn-modern text-white border-0 bg-transparent d-flex align-items-center justify-content-center w-100"
              onClick={handleLogout}
              style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                padding: '12px 24px',
                transition: 'all 0.3s ease',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.3)';
              }}
            >
              <span className="me-2" style={{ fontSize: '1.3rem' }}>🚪</span>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </Col>
      </Row>

      {/* CSS para animaciones */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .menu-card:hover {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        
        .menu-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: inherit;
          border-radius: inherit;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .menu-card:hover::before {
          opacity: 0.1;
        }
      `}</style>
    </Container>
  );
}

export default Menu;