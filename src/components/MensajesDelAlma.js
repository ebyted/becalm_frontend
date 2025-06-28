import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import API_CONFIG from '../config/api';
import TopNavigation from './TopNavigation'; // ✅ CORREGIR AQUÍ
import '../styles/FixOverlay.css';

function MensajesDelAlma({ onLogout }) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedMessages, setSavedMessages] = useState([]);
  const [selectedType, setSelectedType] = useState('');

  const messageTypes = [
    { type: 'inspiracion', label: 'Inspiración', icon: '✨', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { type: 'fortaleza', label: 'Fortaleza', icon: '💪', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { type: 'paz', label: 'Paz Interior', icon: '🕊️', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { type: 'amor', label: 'Amor Propio', icon: '💝', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
    { type: 'esperanza', label: 'Esperanza', icon: '🌟', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
    { type: 'sabiduria', label: 'Sabiduría', icon: '🦉', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }
  ];

  const generateMessage = async (type) => {
    setIsLoading(true);
    setSelectedType(type);
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GENERATE}`, {
        method: 'POST',
        headers: API_CONFIG.getAuthHeaders(),
        body: JSON.stringify({
          prompt: `Genera un mensaje del alma sobre ${type}. Debe ser inspirador, profundo y reconfortante.`,
          mode: 'mensajes_alma'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentMessage(data.text);
      } else {
        throw new Error('Error al generar mensaje');
      }
    } catch (err) {
      // Fallback messages
      const fallbackMessages = {
        inspiracion: 'Tu alma conoce el camino. Confía en su sabiduría y permite que te guíe hacia la luz que ya llevas dentro. Cada paso que das es un acto de valentía y crecimiento.',
        fortaleza: 'Eres más fuerte de lo que crees. Cada desafío que has superado es prueba de tu resistencia interior. Tu fortaleza no se mide por la ausencia de miedo, sino por tu capacidad de seguir adelante a pesar de él.',
        paz: 'En el silencio de tu corazón encontrarás la paz que buscas. Respira profundo y permítete ser. La paz no es la ausencia de tormenta, sino la calma que encuentras en medio de ella.',
        amor: 'Eres digno de amor, empezando por el amor que te das a ti mismo. Tu valor no depende de nadie más. Ama tus imperfecciones, celebra tus logros y abraza tu humanidad.',
        esperanza: 'Cada amanecer trae nuevas posibilidades. Tu futuro está lleno de oportunidades por descubrir. La esperanza es el susurro del alma que te recuerda que lo mejor está por venir.',
        sabiduria: 'La sabiduría no viene de saber todas las respuestas, sino de hacer las preguntas correctas. Confía en tu intuición y permite que tu experiencia sea tu maestra.'
      };
      setCurrentMessage(fallbackMessages[type] || 'Tu alma tiene un mensaje especial para ti hoy. Escúchala con atención y permite que su sabiduría ilumine tu camino.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveMessage = () => {
    if (currentMessage) {
      const messageType = messageTypes.find(mt => mt.type === selectedType);
      const newSavedMessage = {
        text: currentMessage,
        type: selectedType,
        typeLabel: messageType?.label || 'Mensaje',
        icon: messageType?.icon || '💌',
        timestamp: new Date(),
        id: Date.now()
      };
      setSavedMessages(prev => [newSavedMessage, ...prev.slice(0, 9)]); // Keep only last 10
      localStorage.setItem('savedMessages', JSON.stringify([newSavedMessage, ...savedMessages.slice(0, 9)]));
    }
  };

  useEffect(() => {
    // Load saved messages from localStorage
    const saved = localStorage.getItem('savedMessages');
    if (saved) {
      setSavedMessages(JSON.parse(saved));
    }
  }, []);

  return (
    <>
      <TopNavigation onLogout={onLogout} />
      <Container fluid>
        <div className="text-center mb-5">
          <h1 className="gradient-title display-4 floating">💌 Mensajes del Alma</h1>
          <p className="text-light mb-4" style={{ fontSize: '1.1rem', fontWeight: '300' }}>
            Recibe inspiración y sabiduría para tu camino
          </p>
        </div>

        {/* Tipos de mensajes */}
        <div className="modern-card mb-5 p-4">
          <div className="text-center mb-4">
            <h5 className="text-light" style={{ fontWeight: '600', fontSize: '1.3rem' }}>
              🎭 Elige tu Inspiración
            </h5>
            <p className="text-light" style={{ opacity: 0.8 }}>
              Selecciona el tipo de mensaje que tu alma necesita escuchar hoy
            </p>
          </div>

          <Row className="g-3">
            {messageTypes.map((messageType, index) => (
              <Col md={6} lg={4} key={messageType.type}>
                <button
                  className="w-100 p-4 border-0"
                  onClick={() => generateMessage(messageType.type)}
                  disabled={isLoading}
                  style={{
                    background: messageType.gradient,
                    borderRadius: 'var(--border-radius)',
                    transition: 'var(--transition)',
                    cursor: 'pointer',
                    color: 'white',
                    fontWeight: '600',
                    position: 'relative',
                    overflow: 'hidden',
                    animationDelay: `${index * 0.1}s`,
                    animation: 'fadeInUp 0.5s ease-out both'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-4px) scale(1.02)';
                    e.target.style.boxShadow = 'var(--shadow-medium)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = 'var(--shadow-light)';
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>
                    {messageType.icon}
                  </div>
                  <div style={{ fontSize: '1.1rem' }}>
                    {messageType.label}
                  </div>
                </button>
              </Col>
            ))}
          </Row>
        </div>

        {/* Mensaje actual */}
        {(currentMessage || isLoading) && (
          <div className="modern-card text-center p-5 mb-5">
            {isLoading ? (
              <div>
                <div className="modern-spinner mb-4" style={{ width: '60px', height: '60px', margin: '0 auto' }}></div>
                <p className="text-light" style={{ fontSize: '1.2rem', opacity: 0.8 }}>
                  El alma está preparando tu mensaje...
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <span style={{ fontSize: '4rem' }}>
                    {messageTypes.find(mt => mt.type === selectedType)?.icon || '💌'}
                  </span>
                </div>
                
                <div className="mb-4" style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                  padding: '30px',
                  borderRadius: 'var(--border-radius-large)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)'
                  }}></div>
                  
                  <p className="text-light mb-0" style={{ 
                    fontSize: '1.3rem',
                    lineHeight: '1.6',
                    fontWeight: '300',
                    fontStyle: 'italic'
                  }}>
                    "{currentMessage}"
                  </p>
                </div>

                <div className="d-flex justify-content-center gap-3">
                  <button 
                    className="btn-modern btn-success-modern"
                    onClick={saveMessage}
                  >
                    <span className="me-2">Guardar Mensaje</span>
                    <span>💾</span>
                  </button>
                  
                  <button 
                    className="btn-modern"
                    onClick={() => generateMessage(selectedType)}
                  >
                    <span className="me-2">Nuevo Mensaje</span>
                    <span>🔄</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mensajes guardados */}
        {savedMessages.length > 0 && (
          <div className="modern-card p-4">
            <div className="text-center mb-4">
              <h5 className="text-light" style={{ fontWeight: '600', fontSize: '1.3rem' }}>
                💎 Mensajes Guardados
              </h5>
              <p className="text-light" style={{ opacity: 0.8 }}>
                Tus inspiraciones favoritas
              </p>
            </div>

            <Row className="g-4">
              {savedMessages.map((message, index) => (
                <Col md={6} lg={4} key={message.id}>
                  <div 
                    className="modern-card p-4 h-100"
                    style={{ 
                      animationDelay: `${index * 0.1}s`,
                      animation: 'fadeInUp 0.5s ease-out both'
                    }}
                  >
                    <div className="text-center mb-3">
                      <span style={{ fontSize: '2rem' }}>{message.icon}</span>
                      <h6 className="text-light mt-2 mb-3" style={{ fontWeight: '600' }}>
                        {message.typeLabel}
                      </h6>
                    </div>
                    
                    <p className="text-light mb-3" style={{ 
                      fontSize: '0.95rem',
                      lineHeight: '1.5',
                      opacity: 0.9
                    }}>
                      "{message.text}"
                    </p>
                    
                    <div className="mt-auto">
                      <span className="badge-modern" style={{ opacity: 0.7, fontSize: '0.8rem' }}>
                        {new Date(message.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Container>
    </>
  );
}

export default MensajesDelAlma;
