import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import apiService from '../config/api'; // ✅ CAMBIAR: API_CONFIG por apiService
import TopNavigation from './TopNavigation'; // ✅ CAMBIAR: topNavigation por TopNavigation
import '../styles/FixOverlay.css';

function RitualDiario({ onLogout }) {
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
      // ✅ CAMBIAR: Usar apiService en lugar de fetch manual
      const response = await apiService.post('/v1/generate', {
        prompt: 'Crea un ritual diario de bienestar con 5 pasos simples que incluyan mindfulness, gratitud y autocuidado.',
        mode: 'ritual_diario'
      });

      if (response && response.text) {
        setTodayRitual({
          title: 'Ritual Personalizado del Día',
          description: response.text,
          steps: defaultRitual.steps
        });
      } else {
        throw new Error('Error al generar ritual');
      }
    } catch (err) {
      console.error('Error generating ritual:', err);
      setTodayRitual(defaultRitual);
    } finally {
      setIsLoading(false);
    }
  };

  const saveReflection = async () => {
    if (!reflection.trim()) return;

    try {
      // Guardar en localStorage por ahora
      const reflections = JSON.parse(localStorage.getItem('ritualReflections') || '[]');
      const newReflection = {
        date: new Date().toISOString().split('T')[0],
        text: reflection,
        completedSteps: completedSteps.length,
        totalSteps: todayRitual?.steps.length || 0,
        timestamp: new Date().toISOString()
      };
      
      reflections.unshift(newReflection);
      localStorage.setItem('ritualReflections', JSON.stringify(reflections.slice(0, 30))); // Keep last 30
      
      alert('💾 Reflexión guardada correctamente');
      setReflection('');
    } catch (err) {
      console.error('Error saving reflection:', err);
      alert('❌ Error al guardar la reflexión');
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
      {/* ✅ CAMBIAR: topNavigation por TopNavigation */}
      <TopNavigation onLogout={onLogout} />
      
      <Container fluid className="py-4">
        <div className="text-center mb-5">
          <div className="ritual-container">
            <h1 className="gradient-title display-4 floating no-triple-select">
              🌅 Ritual Diario
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
          <div className="modern-card text-center p-5" style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(15px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            {isLoading ? (
              <>
                <div className="spinner-border text-light mb-4" role="status" style={{ width: '3rem', height: '3rem' }}>
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="text-light" style={{ fontSize: '1.2rem' }}>
                  Creando tu ritual personalizado...
                </p>
              </>
            ) : (
              <>
                <div className="floating mb-4" style={{ fontSize: '4rem' }}>🌱</div>
                <button 
                  className="btn btn-success"
                  onClick={generateDailyRitual}
                  style={{
                    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                    border: 'none',
                    borderRadius: '25px',
                    padding: '12px 30px',
                    fontSize: '1.1rem',
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
                  <span className="me-2">Generar Ritual del Día</span>
                  <span>✨</span>
                </button>
              </>
            )}
          </div>
        ) : (
          <div>
            {/* Progress Section */}
            <div className="modern-card mb-5 p-4 text-center" style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(15px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h3 className="text-light mb-4" style={{ fontWeight: '600' }}>
                {todayRitual.title}
              </h3>
              
              <div className="mb-4">
                <div className="progress mb-2" style={{ 
                  height: '10px', 
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.1)'
                }}>
                  <div 
                    className="progress-bar"
                    style={{ 
                      width: `${progressPercentage}%`,
                      background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                      borderRadius: '10px',
                      transition: 'width 0.5s ease'
                    }}
                  ></div>
                </div>
                <p className="text-light mt-2" style={{ opacity: 0.8 }}>
                  {completedSteps.length} de {todayRitual.steps.length} pasos completados ({Math.round(progressPercentage)}%)
                </p>
              </div>

              {ritualComplete && (
                <div className="alert alert-success" style={{ 
                  background: 'rgba(39, 174, 96, 0.2)',
                  border: '1px solid rgba(39, 174, 96, 0.3)',
                  borderRadius: '15px',
                  color: '#2ecc71'
                }}>
                  🎉 ¡Felicitaciones! Has completado tu ritual diario. 
                  Tu bienestar es una prioridad y lo estás demostrando.
                </div>
              )}
            </div>

            {/* Steps */}
            <Row className="g-4 mb-5">
              {todayRitual.steps.map((step, index) => (
                <Col md={6} lg={4} key={step.id}>
                  <div 
                    className={`modern-card p-4 h-100 ${
                      completedSteps.includes(step.id) ? 'completed-step' : ''
                    }`}
                    onClick={() => toggleStep(step.id)}
                    style={{ 
                      animationDelay: `${index * 0.1}s`,
                      animation: 'fadeInUp 0.5s ease-out both',
                      cursor: 'pointer',
                      background: completedSteps.includes(step.id) 
                        ? 'linear-gradient(135deg, rgba(39, 174, 96, 0.2), rgba(46, 204, 113, 0.2))'
                        : 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(15px)',
                      borderRadius: '20px',
                      border: completedSteps.includes(step.id) 
                        ? '1px solid rgba(39, 174, 96, 0.3)'
                        : '1px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-5px)';
                      e.target.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    <div className="text-center mb-3">
                      <div style={{ 
                        fontSize: '3rem', 
                        marginBottom: '12px',
                        opacity: completedSteps.includes(step.id) ? 1 : 0.7,
                        transform: completedSteps.includes(step.id) ? 'scale(1.1)' : 'scale(1)',
                        transition: 'all 0.3s ease'
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
                      <span className="badge bg-secondary" style={{ 
                        opacity: 0.8,
                        background: 'rgba(255, 255, 255, 0.1) !important',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}>
                        ⏱️ {step.duration}
                      </span>
                      <span className="text-light" style={{ 
                        fontSize: '0.9rem',
                        opacity: completedSteps.includes(step.id) ? 1 : 0.6,
                        fontWeight: completedSteps.includes(step.id) ? '600' : '400'
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
              <div className="modern-card p-4" style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(15px)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div className="text-center mb-4">
                  <h5 className="text-light" style={{ fontWeight: '600', fontSize: '1.3rem' }}>
                    📝 Reflexión del Día
                  </h5>
                  <p className="text-light" style={{ opacity: 0.8 }}>
                    ¿Cómo te sientes después de completar tu ritual?
                  </p>
                </div>

                <textarea
                  className="form-control mb-4"
                  rows={4}
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="Comparte tus pensamientos sobre cómo te ayudó este ritual..."
                  style={{ 
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    backdropFilter: 'blur(10px)'
                  }}
                />

                <div className="text-center">
                  <button 
                    className="btn btn-success"
                    onClick={saveReflection}
                    disabled={!reflection.trim()}
                    style={{
                      background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                      border: 'none',
                      borderRadius: '25px',
                      padding: '10px 25px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      opacity: !reflection.trim() ? 0.5 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (reflection.trim()) {
                        e.target.style.transform = 'scale(1.05)';
                        e.target.style.boxShadow = '0 8px 25px rgba(67, 233, 123, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <span className="me-2">Guardar Reflexión</span>
                    <span>💾</span>
                  </button>
                </div>
              </div>
            )}
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

          .floating {
            animation: floating 3s ease-in-out infinite;
          }

          @keyframes floating {
            0%, 100% { 
              transform: translateY(0px); 
            }
            50% { 
              transform: translateY(-5px); 
            }
          }

          .form-control::placeholder {
            color: rgba(255, 255, 255, 0.6);
          }

          .form-control:focus {
            background: rgba(255, 255, 255, 0.15) !important;
            border-color: rgba(67, 233, 123, 0.5) !important;
            box-shadow: 0 0 0 0.2rem rgba(67, 233, 123, 0.25) !important;
            color: white !important;
          }
        `}</style>
      </Container>
    </>
  );
}

export default RitualDiario;
