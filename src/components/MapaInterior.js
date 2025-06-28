import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import API_CONFIG from '../config/api';
import '../styles/FixOverlay.css';

function MapaInterior() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [insights, setInsights] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const emotionalAreas = [
    { 
      id: 'amor', 
      name: 'Amor Propio', 
      icon: '💝', 
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      description: 'Explora tu relación contigo mismo'
    },
    { 
      id: 'miedo', 
      name: 'Miedos', 
      icon: '😰', 
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      description: 'Identifica y transforma tus temores'
    },
    { 
      id: 'alegria', 
      name: 'Alegría', 
      icon: '😊', 
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      description: 'Conecta con tu felicidad interior'
    },
    { 
      id: 'tristeza', 
      name: 'Tristeza', 
      icon: '😢', 
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      description: 'Honra y procesa tus sentimientos de pérdida'
    },
    { 
      id: 'ira', 
      name: 'Ira', 
      icon: '😤', 
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      description: 'Transforma la ira en energía constructiva'
    },
    { 
      id: 'esperanza', 
      name: 'Esperanza', 
      icon: '🌟', 
      color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      description: 'Cultiva la confianza en el futuro'
    }
  ];

  const exploreArea = async (area) => {
    setSelectedArea(area);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GENERATE}`, {
        method: 'POST',
        headers: API_CONFIG.getAuthHeaders(),
        body: JSON.stringify({
          prompt: `Proporciona una reflexión profunda sobre ${area.name.toLowerCase()} como parte del autoconocimiento. Incluye preguntas de autorreflexión y consejos prácticos.`,
          mode: 'mapa_interior'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setInsights(prev => ({ ...prev, [area.id]: data.text }));
      } else {
        throw new Error('Error al obtener insights');
      }
    } catch (err) {
      const fallbackInsights = {
        amor: 'El amor propio es la base de todas las relaciones saludables. Pregúntate: ¿Cómo me hablo a mí mismo? ¿Me trato con la misma compasión que ofrezco a otros? Practica la autocompasión diariamente.',
        miedo: 'Los miedos son señales de crecimiento. Cuando sientes miedo, pregúntate: ¿Qué me está enseñando esta emoción? ¿Qué necesito para sentirme más seguro? Recuerda que el coraje no es la ausencia de miedo, sino actuar a pesar de él.',
        alegria: 'La alegría auténtica nace desde dentro. Reflexiona: ¿Qué actividades me llenan de energía? ¿Cuándo me siento más vivo? Cultiva momentos de gratitud y celebra las pequeñas victorias.',
        tristeza: 'La tristeza es una emoción sagrada que nos conecta con lo que valoramos. Pregúntate: ¿Qué pérdida estoy procesando? ¿Cómo puedo honrar este sentimiento? Permite que la tristeza fluya sin resistencia.',
        ira: 'La ira es energía que busca justicia y cambio. Reflexiona: ¿Qué límites necesito establecer? ¿Qué injusticia percibo? Canaliza esta energía hacia acciones constructivas y comunicación asertiva.',
        esperanza: 'La esperanza es la luz que guía en la oscuridad. Pregúntate: ¿Qué visión tengo para mi futuro? ¿Qué pequeño paso puedo dar hoy? Recuerda que cada día es una nueva oportunidad.'
      };
      setInsights(prev => ({ ...prev, [area.id]: fallbackInsights[area.id] || 'Cada área de tu interior tiene sabiduría que ofrecer. Tómate tiempo para escuchar lo que tiene que decirte.' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="py-4">
      <div className="text-center mb-5">
        <div className="mapa-container">
          <h1 className="gradient-title display-4 floating no-triple-select">
            🗺️ Mapa Interior
          </h1>
          <p className="text-light mb-4" style={{ 
            fontSize: '1.1rem', 
            fontWeight: '300',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' 
          }}>
            Explora tu mundo interior y emocional
          </p>
        </div>
      </div>

      {!selectedArea ? (
        <div>
          <div className="modern-card mb-5 p-4 text-center">
            <div className="floating mb-4" style={{ fontSize: '3rem' }}>🧭</div>
            <h5 className="text-light mb-3" style={{ fontWeight: '600', fontSize: '1.3rem' }}>
              Navega por tu Paisaje Emocional
            </h5>
            <p className="text-light" style={{ opacity: 0.8, maxWidth: '600px', margin: '0 auto' }}>
              Cada área de tu mapa interior contiene sabiduría única. Selecciona un territorio emocional para comenzar tu exploración.
            </p>
          </div>

          <Row className="g-4">
            {emotionalAreas.map((area, index) => (
              <Col md={6} lg={4} key={area.id}>
                <button
                  className="w-100 h-100 border-0 p-4"
                  onClick={() => exploreArea(area)}
                  style={{
                    background: area.color,
                    borderRadius: 'var(--border-radius-large)',
                    color: 'white',
                    fontWeight: '600',
                    transition: 'var(--transition)',
                    cursor: 'pointer',
                    minHeight: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    animationDelay: `${index * 0.1}s`,
                    animation: 'fadeInUp 0.5s ease-out both'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-8px) scale(1.03)';
                    e.target.style.boxShadow = 'var(--shadow-heavy)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = 'var(--shadow-light)';
                  }}
                >
                  <div style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)'
                  }}></div>
                  
                  <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>
                    {area.icon}
                  </div>
                  <h5 style={{ marginBottom: '12px', fontSize: '1.4rem' }}>
                    {area.name}
                  </h5>
                  <p style={{ 
                    fontSize: '0.95rem', 
                    opacity: 0.9,
                    textAlign: 'center',
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    {area.description}
                  </p>
                </button>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <div>
          {/* Area Selected */}
          <div className="modern-card mb-5 p-5 text-center">
            <button 
              className="btn-modern mb-4"
              onClick={() => setSelectedArea(null)}
              style={{ float: 'left' }}
            >
              <span className="me-2">← Volver al Mapa</span>
            </button>
            
            <div style={{ clear: 'both' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>
                {selectedArea.icon}
              </div>
              <h2 className="gradient-title mb-4">
                Explorando: {selectedArea.name}
              </h2>
              <p className="text-light mb-4" style={{ fontSize: '1.1rem', opacity: 0.8 }}>
                {selectedArea.description}
              </p>
            </div>
          </div>

          {/* Insights */}
          <div className="modern-card p-5">
            {isLoading ? (
              <div className="text-center">
                <div className="modern-spinner mb-4" style={{ width: '60px', height: '60px', margin: '0 auto' }}></div>
                <p className="text-light" style={{ fontSize: '1.2rem' }}>
                  Explorando tu {selectedArea.name.toLowerCase()}...
                </p>
              </div>
            ) : insights[selectedArea.id] ? (
              <div>
                <div className="text-center mb-4">
                  <h5 className="text-light" style={{ fontWeight: '600', fontSize: '1.3rem' }}>
                    🔍 Reflexiones y Descubrimientos
                  </h5>
                </div>
                
                <div style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                  padding: '30px',
                  borderRadius: 'var(--border-radius-large)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  position: 'relative',
                  marginBottom: '30px'
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
                    fontSize: '1.1rem',
                    lineHeight: '1.7',
                    fontWeight: '300'
                  }}>
                    {insights[selectedArea.id]}
                  </p>
                </div>

                <div className="d-flex justify-content-center gap-3">
                  <button 
                    className="btn-modern btn-success-modern"
                    onClick={() => exploreArea(selectedArea)}
                  >
                    <span className="me-2">Explorar Más Profundo</span>
                    <span>🔄</span>
                  </button>
                  
                  <button 
                    className="btn-modern"
                    onClick={() => setSelectedArea(null)}
                  >
                    <span className="me-2">Explorar Otra Área</span>
                    <span>🗺️</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="floating mb-4" style={{ fontSize: '3rem' }}>🌱</div>
                <p className="text-light">
                  Preparándote para explorar tu {selectedArea.name.toLowerCase()}...
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </Container>
  );
}

export default MapaInterior;
