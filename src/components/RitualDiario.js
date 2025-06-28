import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import API_CONFIG from '../config/api';
import topNavigation from 'topNavigation'; // ✅ AGREGAR IMPORT
import '../styles/FixOverlay.css';

function RitualDiario({ onLogout }) { // ✅ RECIBIR onLogout prop
  const [todayRitual, setTodayRitual] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reflection, setReflection] = useState('');
  const [ritualComplete, setRitualComplete] = useState(false);

  const defaultRitual = {
    title: 'Ritual de Bienestar Diario',
    steps: [
      {
        id: 1,
        title: 'Respiración Consciente',
        description: 'Toma 5 respiraciones profundas y conscientes al despertar',
        duration: '2 minutos',
        icon: '🫁'
      },
      {
        id: 2,
        title: 'Intención del Día',
        description: 'Establece una intención positiva para tu día',
        duration: '3 minutos',
        icon: '🎯'
      },
      {
        id: 3,
        title: 'Gratitud Matutina',
        description: 'Menciona 3 cosas por las que te sientes agradecido',
        duration: '2 minutos',
        icon: '🙏'
      },
      {
        id: 4,
        title: 'Movimiento Suave',
        description: 'Estira tu cuerpo o haz algunos movimientos suaves',
        duration: '5 minutos',
        icon: '🤸‍♀️'
      },
      {
        id: 5,
        title: 'Reflexión Nocturna',
        description: 'Al terminar el día, reflexiona sobre tus experiencias',
        duration: '3 minutos',
        icon: '🌙'
      }
    ]
  };

  const generateDailyRitual = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GENERATE}`, {
        method: 'POST',
        headers: API_CONFIG.getAuthHeaders(),
        body: JSON.stringify({
          prompt: 'Crea un ritual diario de bienestar con 5 pasos simples que incluyan mindfulness, gratitud y autocuidado.',
          mode: 'ritual_diario'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTodayRitual({
          title: 'Ritual Personalizado del Día',
          description: data.text,
          steps: defaultRitual.steps
        });
      } else {
        throw new Error('Error al generar ritual');
      }
    } catch (err) {
      setTodayRitual(defaultRitual);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStep = (stepId) => {
    if (completedSteps.includes(stepId)) {
      setCompletedSteps(completedSteps.filter(id => id !== stepId));
    } else {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const progressPercentage = todayRitual ? (completedSteps.length / todayRitual.steps.length) * 100 : 0;

  useEffect(() => {
    if (completedSteps.length === todayRitual?.steps.length && todayRitual?.steps.length > 0) {
      setRitualComplete(true);
    } else {
      setRitualComplete(false);
    }
  }, [completedSteps, todayRitual]);

  useEffect(() => {
    generateDailyRitual();
  }, []);

  return (
    <>
      {/* ✅ AGREGAR NAVEGACIÓN SUPERIOR */}
      <topNavigation onLogout={onLogout} />
      
      <Container fluid className="py-4">
        <div className="text-center mb-5">
          <div className="diario-container">
            <h1 className="gradient-title display-4 floating no-triple-select">
              📖 Ritual Diario
            </h1>
            <p className="text-light mb-4" style={{ 
              fontSize: '1.1rem', 
              fontWeight: '300',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' 
            }}>
              Construye hábitos saludables con rituales conscientes
            </p>
          </div>
        </div>

        {!todayRitual ? (
          <div className="modern-card text-center p-5">
            {isLoading ? (
              <>
                <div className="modern-spinner mb-4" style={{ width: '60px', height: '60px', margin: '0 auto' }}></div>
                <p className="text-light" style={{ fontSize: '1.2rem' }}>
                  Creando tu ritual personalizado...
                </p>
              </>
            ) : (
              <>
                <div className="floating mb-4" style={{ fontSize: '4rem' }}>🌱</div>
                <button 
                  className="btn-modern btn-success-modern"
                  onClick={generateDailyRitual}
                >
                  <span className="me-2">Generar Ritual del Día</span>
                  <span>✨</span>
                </button>
              </>
            )}
          </div>
        ) : (
          <div>
            {/* Progress Section */}
            <div className="modern-card mb-5 p-4 text-center">
              <h3 className="text-light mb-4" style={{ fontWeight: '600' }}>
                {todayRitual.title}
              </h3>
              
              <div className="mb-4">
                <div className="progress-modern">
                  <div 
                    className="progress-bar-modern"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-light mt-2" style={{ opacity: 0.8 }}>
                  {completedSteps.length} de {todayRitual.steps.length} pasos completados
                </p>
              </div>

              {ritualComplete && (
                <div className="alert-modern mb-4 text-center" style={{ color: '#27ae60' }}>
                  🎉 ¡Felicitaciones! Has completado tu ritual diario. 
                  Tu bienestar es una prioridad y lo estás demostrando.
                </div>
              )}
            </div>

            {/* Steps */}
            <Row className="g-4">
              {todayRitual.steps.map((step, index) => (
                <Col md={6} lg={4} key={step.id}>
                  <div 
                    className={`modern-card p-4 h-100 cursor-pointer ${
                      completedSteps.includes(step.id) ? 'completed-step' : ''
                    }`}
                    onClick={() => toggleStep(step.id)}
                    style={{ 
                      animationDelay: `${index * 0.1}s`,
                      animation: 'fadeInUp 0.5s ease-out both',
                      cursor: 'pointer',
                      background: completedSteps.includes(step.id) 
                        ? 'linear-gradient(135deg, rgba(39, 174, 96, 0.2), rgba(46, 204, 113, 0.2))'
                        : 'var(--glass-bg)',
                      border: completedSteps.includes(step.id) 
                        ? '1px solid rgba(39, 174, 96, 0.3)'
                        : '1px solid var(--glass-border)',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div className="text-center mb-3">
                      <div style={{ 
                        fontSize: '3rem', 
                        marginBottom: '12px',
                        opacity: completedSteps.includes(step.id) ? 1 : 0.7,
                        transform: completedSteps.includes(step.id) ? 'scale(1.1)' : 'scale(1)',
                        transition: 'var(--transition)'
                      }}>
                        {completedSteps.includes(step.id) ? '✅' : step.icon}
                      </div>
                      <h5 className="text-light mb-3" style={{ fontWeight: '600' }}>
                        {step.title}
                      </h5>
                    </div>

                    <p className="text-light mb-3" style={{ 
                      fontSize: '0.95rem', 
                      lineHeight: '1.5',
                      opacity: 0.9
                    }}>
                      {step.description}
                    </p>

                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge-modern" style={{ opacity: 0.8 }}>
                        ⏱️ {step.duration}
                      </span>
                      <span className="text-light" style={{ 
                        fontSize: '0.9rem',
                        opacity: completedSteps.includes(step.id) ? 1 : 0.6
                      }}>
                        {completedSteps.includes(step.id) ? 'Completado' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>

            {/* Reflection Section */}
            {ritualComplete && (
              <div className="modern-card mt-5 p-4">
                <div className="text-center mb-4">
                  <h5 className="text-light" style={{ fontWeight: '600', fontSize: '1.3rem' }}>
                    📝 Reflexión del Día
                  </h5>
                  <p className="text-light" style={{ opacity: 0.8 }}>
                    ¿Cómo te sientes después de completar tu ritual?
                  </p>
                </div>

                <textarea
                  className="form-control-modern w-100 mb-4"
                  rows={4}
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="Comparte tus pensamientos sobre cómo te ayudó este ritual..."
                  style={{ 
                    fontSize: '1rem',
                    lineHeight: '1.6'
                  }}
                />

                <div className="text-center">
                  <button 
                    className="btn-modern btn-success-modern"
                    disabled={!reflection.trim()}
                  >
                    <span className="me-2">Guardar Reflexión</span>
                    <span>💾</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Container>
    </>
  );
}

export default RitualDiario;
