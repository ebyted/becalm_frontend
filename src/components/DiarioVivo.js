import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import apiService from '../config/api';
import TopNav from './TopNav';
import '../styles/FixOverlay.css';

function DiarioVivo({ onLogout }) {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar entradas desde localStorage al iniciar
  useEffect(() => {
    const savedEntries = localStorage.getItem('diario_entries');
    if (savedEntries) {
      try {
        const parsedEntries = JSON.parse(savedEntries);
        const entriesWithDates = parsedEntries.map(entry => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }));
        setEntries(entriesWithDates);
      } catch (error) {
        console.error('Error cargando entradas:', error);
      }
    }
  }, []);

  // Guardar entradas en localStorage cuando cambien
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('diario_entries', JSON.stringify(entries));
    }
  }, [entries]);

  const saveEntry = async () => {
    if (!newEntry.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await apiService.post('/v1/generate', {
        prompt: `Reflexiona sobre esta entrada de diario: "${newEntry}". Proporciona una perspectiva reflexiva y alentadora en español, máximo 150 palabras.`,
        mode: 'diario_vivo'
      });

      const entry = {
        text: newEntry,
        reflection: response.text || getFallbackReflection(),
        timestamp: new Date(),
        id: Date.now()
      };
      
      setEntries(prev => [entry, ...prev]);
      setNewEntry('');
      
    } catch (err) {
      console.error('Error al obtener reflexión de IA:', err);
      setError('Se guardó tu entrada, pero no se pudo generar una reflexión automática');
      
      const entry = {
        text: newEntry,
        reflection: getFallbackReflection(),
        timestamp: new Date(),
        id: Date.now()
      };
      
      setEntries(prev => [entry, ...prev]);
      setNewEntry('');
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackReflection = () => {
    const reflections = [
      'Tu reflexión es valiosa. Cada palabra escrita es un paso hacia el autoconocimiento y el crecimiento personal. Continúa explorando tus pensamientos con curiosidad y compasión.',
      'Escribir sobre nuestros pensamientos y sentimientos es un acto de valentía. Te felicito por tomarte este tiempo para conectar contigo mismo/a.',
      'Cada entrada en tu diario es una semilla de sabiduría personal. Con el tiempo, estas reflexiones te ayudarán a ver patrones y crecimiento en tu vida.',
      'Tu honestidad contigo mismo/a es admirable. Estos momentos de introspección son fundamentales para tu bienestar emocional y mental.',
      'Al escribir tus pensamientos, estás creando un espacio sagrado para tu crecimiento personal. Cada reflexión es un regalo que te das a ti mismo/a.'
    ];
    return reflections[Math.floor(Math.random() * reflections.length)];
  };

  const deleteEntry = (entryId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta entrada?')) {
      setEntries(prev => prev.filter(entry => entry.id !== entryId));
    }
  };

  return (
    <>
      <TopNav onLogout={onLogout} />
      
      <Container fluid className="py-3 px-1 px-sm-2 px-md-4">
        {/* Header - Optimizado para móvil */}
        <div className="text-center mb-4 mb-md-5">
          <div className="diario-container">
            <h1 className="gradient-title floating no-triple-select" style={{
              fontSize: 'clamp(2rem, 8vw, 3.5rem)',
              marginBottom: '1rem'
            }}>
              📖 Diario Vivo
            </h1>
            <p className="text-light mb-3 mb-md-4" style={{ 
              fontSize: 'clamp(0.9rem, 4vw, 1.1rem)', 
              fontWeight: '300',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
              padding: '0 1rem'
            }}>
              Registra tus pensamientos y reflexiones diarias
            </p>
          </div>
        </div>

        {/* Error message - Responsive */}
        {error && (
          <div className="alert-modern mb-3 mb-md-4 text-center mx-2" style={{ 
            color: '#e74c3c',
            background: 'rgba(231, 76, 60, 0.1)',
            border: '1px solid rgba(231, 76, 60, 0.3)',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: 'clamp(0.85rem, 3vw, 1rem)'
          }}>
            {error}
          </div>
        )}

        {/* Nueva entrada - Optimizada para móvil */}
        <div className="modern-card mb-4 mb-md-5" style={{
          margin: '0 8px',
          padding: 'clamp(16px, 4vw, 24px)',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div className="text-center mb-3 mb-md-4">
            <h5 className="text-light" style={{ 
              fontWeight: '600', 
              fontSize: 'clamp(1.1rem, 5vw, 1.3rem)',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
              marginBottom: '0.5rem'
            }}>
              ✨ Nueva Entrada
            </h5>
            <p className="text-light d-none d-sm-block" style={{ 
              opacity: 0.8,
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
              fontSize: '0.95rem'
            }}>
              Expresa tus pensamientos libremente
            </p>
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); saveEntry(); }}>
            <div className="mb-3 mb-md-4">
              <textarea
                className="form-control w-100"
                rows={4}
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                placeholder="¿Qué está pasando en tu mente y corazón hoy? Escribe sin filtros, este es tu espacio seguro..."
                disabled={isLoading}
                style={{ 
                  fontSize: 'clamp(0.9rem, 4vw, 1.1rem)',
                  lineHeight: '1.6',
                  resize: 'vertical',
                  minHeight: 'clamp(100px, 20vw, 140px)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  color: 'white',
                  padding: 'clamp(12px, 3vw, 16px)',
                  backdropFilter: 'blur(10px)'
                }}
              />
            </div>
            
            <div className="d-flex justify-content-end">
              <button 
                className="btn btn-success"
                type="submit" 
                disabled={isLoading || !newEntry.trim()}
                style={{
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  border: 'none',
                  borderRadius: '25px',
                  padding: 'clamp(8px 16px, 3vw, 12px 24px)',
                  fontSize: 'clamp(0.85rem, 3.5vw, 1rem)',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  opacity: isLoading || !newEntry.trim() ? 0.5 : 1
                }}
              >
                {isLoading ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <span className="d-none d-sm-inline">Guardando...</span>
                    <span className="d-sm-none">...</span>
                  </>
                ) : (
                  <>
                    <span className="d-none d-sm-inline me-2">Guardar Entrada</span>
                    <span className="d-sm-none me-1">Guardar</span>
                    <span>💾</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Entradas anteriores - Optimizadas para móvil */}
        <div className="modern-card" style={{
          margin: '0 8px',
          padding: 'clamp(16px, 4vw, 24px)',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div className="text-center mb-3 mb-md-4">
            <h5 className="text-light" style={{ 
              fontWeight: '600', 
              fontSize: 'clamp(1.1rem, 5vw, 1.3rem)',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
            }}>
              📚 Entradas Anteriores ({entries.length})
            </h5>
          </div>
          
          {entries.length === 0 ? (
            <div className="text-center py-4 py-md-5">
              <div className="floating mb-3 mb-md-4" style={{ 
                fontSize: 'clamp(2.5rem, 12vw, 4rem)' 
              }}>📝</div>
              <p className="text-light" style={{ 
                fontSize: 'clamp(0.9rem, 4vw, 1.1rem)', 
                opacity: 0.8,
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                padding: '0 1rem'
              }}>
                Aún no tienes entradas. ¡Comienza escribiendo tu primera reflexión!
              </p>
            </div>
          ) : (
            <div>
              {entries.map((entry, index) => (
                <div 
                  key={entry.id} 
                  className="modern-card mb-3 mb-md-4"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    animation: 'fadeInUp 0.5s ease-out both',
                    position: 'relative',
                    padding: 'clamp(12px, 3vw, 20px)',
                    background: 'rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '15px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {/* Botón eliminar - Responsive */}
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    style={{
                      position: 'absolute',
                      top: 'clamp(8px, 2vw, 12px)',
                      right: 'clamp(8px, 2vw, 12px)',
                      background: 'rgba(231, 76, 60, 0.2)',
                      border: '1px solid rgba(231, 76, 60, 0.4)',
                      borderRadius: '50%',
                      width: 'clamp(28px, 6vw, 32px)',
                      height: 'clamp(28px, 6vw, 32px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontSize: 'clamp(12px, 3vw, 14px)',
                      color: '#ff6b6b'
                    }}
                    title="Eliminar entrada"
                  >
                    🗑️
                  </button>

                  {/* Tu reflexión - Optimizada */}
                  <div className="mb-3 mb-md-4" style={{ 
                    paddingRight: 'clamp(32px, 8vw, 50px)' 
                  }}>
                    <div className="d-flex align-items-center mb-2 mb-md-3">
                      <span style={{ 
                        fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', 
                        marginRight: '8px' 
                      }}>📝</span>
                      <h6 className="text-light mb-0" style={{ 
                        fontWeight: '600',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                        fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)'
                      }}>
                        Tu Reflexión
                      </h6>
                    </div>
                    <p className="text-light" style={{ 
                      lineHeight: '1.6',
                      fontSize: 'clamp(0.85rem, 3.5vw, 1.05rem)',
                      marginBottom: '0',
                      padding: 'clamp(12px, 3vw, 16px)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word'
                    }}>
                      {entry.text}
                    </p>
                  </div>

                  {/* Perspectiva AI - Optimizada */}
                  <div className="mb-2 mb-md-3">
                    <div className="d-flex align-items-center mb-2 mb-md-3">
                      <span style={{ 
                        fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', 
                        marginRight: '8px' 
                      }}>🤔</span>
                      <h6 className="text-light mb-0" style={{ 
                        fontWeight: '600',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                        fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)'
                      }}>
                        Perspectiva y Reflexión
                      </h6>
                    </div>
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                      padding: 'clamp(12px, 3vw, 20px)',
                      borderRadius: '12px',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)'
                      }}></div>
                      <p className="text-light mb-0" style={{ 
                        lineHeight: '1.6',
                        fontSize: 'clamp(0.85rem, 3.5vw, 1.05rem)',
                        wordBreak: 'break-word'
                      }}>
                        {entry.reflection}
                      </p>
                    </div>
                  </div>

                  {/* Timestamp - Responsive */}
                  <div className="d-flex justify-content-end">
                    <span style={{ 
                      opacity: 0.7,
                      background: 'rgba(255, 255, 255, 0.1)',
                      padding: 'clamp(3px 8px, 2vw, 4px 12px)',
                      borderRadius: '20px',
                      fontSize: 'clamp(0.7rem, 2.5vw, 0.85rem)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <span className="d-none d-sm-inline">📅 {entry.timestamp.toLocaleDateString()} • ⏰ {entry.timestamp.toLocaleTimeString()}</span>
                      <span className="d-sm-none">📅 {entry.timestamp.toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CSS para animaciones y estilos móvil */}
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
            outline: none !important;
          }

          /* Optimizaciones específicas para móvil */
          @media (max-width: 576px) {
            .container-fluid {
              padding-left: 8px !important;
              padding-right: 8px !important;
            }
            
            .modern-card {
              margin-left: 0 !important;
              margin-right: 0 !important;
            }
            
            .btn {
              min-width: 80px;
            }
          }

          /* Mejorar legibilidad en pantallas pequeñas */
          @media (max-width: 768px) {
            .text-light {
              text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5) !important;
            }
          }
        `}</style>
      </Container>
    </>
  );
}

export default DiarioVivo;
