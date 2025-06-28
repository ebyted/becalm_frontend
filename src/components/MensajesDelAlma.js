import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import apiService from '../config/api'; // ✅ CAMBIAR: API_CONFIG por apiService
import TopNavigation from './TopNavigation'; // ✅ CAMBIAR: topNavigation por TopNavigation
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
      // ✅ CAMBIAR: Usar apiService en lugar de fetch manual
      const response = await apiService.post('/v1/generate', {
        prompt: `Genera un mensaje del alma sobre ${type}. Debe ser inspirador, profundo y reconfortante.`,
        mode: 'mensajes_alma'
      });

      if (response && response.text) {
        setCurrentMessage(response.text);
      } else {
        throw new Error('Error al generar mensaje');
      }
    } catch (err) {
      console.error('Error generating message:', err);
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

  const deleteMessage = (messageId) => {
    const updatedMessages = savedMessages.filter(msg => msg.id !== messageId);
    setSavedMessages(updatedMessages);
    localStorage.setItem('savedMessages', JSON.stringify(updatedMessages));
  };

  useEffect(() => {
    // Load saved messages from localStorage
    const saved = localStorage.getItem('savedMessages');
    if (saved) {
      try {
        setSavedMessages(JSON.parse(saved));
      } catch (err) {
        console.error('Error loading saved messages:', err);
        setSavedMessages([]);
      }
    }
  }, []);

  return (
    <>
      {/* ✅ CAMBIAR: topNavigation por TopNavigation */}
      <TopNavigation onLogout={onLogout} />
      
      <Container fluid className="py-4">
        <div className="text-center mb-5">
          <div className="mensajes-container">
            <h1 className="gradient-title display-4 floating no-triple-select">
              💌 Mensajes del Alma
            </h1>
            <p className="text-light mb-4" style={{ 
              fontSize: '1.1rem', 
              fontWeight: '300',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' 
            }}>
              Recibe inspiración y sabiduría para tu camino interior
            </p>
          </div>
        </div>

        {/* Tipos de mensajes */}
        <div className="modern-card mb-5 p-4" style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
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
                    borderRadius: '15px',
                    transition: 'all 0.3s ease',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    color: 'white',
                    fontWeight: '600',
                    position: 'relative',
                    overflow: 'hidden',
                    animationDelay: `${index * 0.1}s`,
                    animation: 'fadeInUp 0.5s ease-out both',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                    opacity: isLoading ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.target.style.transform = 'translateY(-4px) scale(1.02)';
                      e.target.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                    }
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
          <div className="modern-card text-center p-5 mb-5" style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(15px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            {isLoading ? (
              <div>
                <div className="spinner-border text-light mb-4" role="status" style={{ width: '3rem', height: '3rem' }}>
                  <span className="visually-hidden">Cargando...</span>
                </div>
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
                  borderRadius: '15px',
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
                    fontStyle: 'italic',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                  }}>
                    "{currentMessage}"
                  </p>
                </div>

                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <button 
                    className="btn btn-success"
                    onClick={saveMessage}
                    style={{
                      background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                      border: 'none',
                      borderRadius: '25px',
                      padding: '10px 20px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.boxShadow = '0 8px 25px rgba(67, 233, 123, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <span className="me-2">💾</span>
                    <span>Guardar Mensaje</span>
                  </button>
                  
                  <button 
                    className="btn btn-primary"
                    onClick={() => generateMessage(selectedType)}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '25px',
                      padding: '10px 20px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <span className="me-2">🔄</span>
                    <span>Nuevo Mensaje</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mensajes guardados */}
        {savedMessages.length > 0 && (
          <div className="modern-card p-4" style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(15px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
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
                    className="modern-card p-4 h-100 position-relative"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      animationDelay: `${index * 0.1}s`,
                      animation: 'fadeInUp 0.5s ease-out both'
                    }}
                  >
                    <button
                      onClick={() => deleteMessage(message.id)}
                      className="btn-close btn-close-white position-absolute top-0 end-0 m-2"
                      style={{ fontSize: '0.8rem', opacity: 0.6 }}
                      onMouseEnter={(e) => e.target.style.opacity = '1'}
                      onMouseLeave={(e) => e.target.style.opacity = '0.6'}
                    />
                    
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
                      <span className="badge bg-secondary" style={{ opacity: 0.7, fontSize: '0.8rem' }}>
                        {new Date(message.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}

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
        `}</style>
      </Container>
    </>
  );
}

export default MensajesDelAlma;
