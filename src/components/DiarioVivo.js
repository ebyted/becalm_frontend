import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import apiService from '../config/api';
import topNavigation from './TTopNavigation'; // ✅ CORREGIR AQUÍ
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
        // Convertir timestamps de string a Date
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
      // Intentar obtener reflexión de la IA
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
      
      // Guardar entrada con reflexión por defecto
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
      <topNavigation onLogout={onLogout} />
      <Container fluid className="py-4">
        <div className="text-center mb-5">
          <div className="diario-container">
            <h1 className="gradient-title display-4 floating no-triple-select">
              📖 Diario Vivo
            </h1>
            <p className="text-light mb-4" style={{ 
              fontSize: '1.1rem', 
              fontWeight: '300',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' 
            }}>
              Registra tus pensamientos y reflexiones diarias
            </p>
          </div>
        </div>

        {error && (
          <div className="alert-modern mb-4 text-center" style={{ 
            color: '#e74c3c',
            background: 'rgba(231, 76, 60, 0.1)',
            border: '1px solid rgba(231, 76, 60, 0.3)',
            borderRadius: '8px',
            padding: '12px 20px'
          }}>
            {error}
          </div>
        )}

        {/* Nueva entrada */}
        <div className="modern-card mb-5 p-4">
          <div className="text-center mb-4">
            <h5 className="text-light" style={{ 
              fontWeight: '600', 
              fontSize: '1.3rem',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
            }}>
              ✨ Nueva Entrada
            </h5>
            <p className="text-light" style={{ 
              opacity: 0.8,
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
            }}>
              Expresa tus pensamientos libremente
            </p>
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); saveEntry(); }}>
            <div className="mb-4">
              <textarea
                className="form-control-modern w-100"
                rows={5}
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                placeholder="¿Qué está pasando en tu mente y corazón hoy? Escribe sin filtros, este es tu espacio seguro..."
                disabled={isLoading}
                style={{ 
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                  resize: 'vertical',
                  minHeight: '120px'
                }}
              />
            </div>
            
            <div className="d-flex justify-content-end">
              <button 
                className="btn-modern btn-success-modern"
                type="submit" 
                disabled={isLoading || !newEntry.trim()}
                style={{ padding: '12px 24px' }}
              >
                {isLoading ? (
                  <>
                    <div className="modern-spinner me-2" style={{ width: '20px', height: '20px' }}></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <span className="me-2">Guardar Entrada</span>
                    <span>💾</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Entradas anteriores */}
        <div className="modern-card p-4">
          <div className="text-center mb-4">
            <h5 className="text-light" style={{ 
              fontWeight: '600', 
              fontSize: '1.3rem',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
            }}>
              📚 Entradas Anteriores ({entries.length})
            </h5>
          </div>
          
          {entries.length === 0 ? (
            <div className="text-center py-5">
              <div className="floating mb-4" style={{ fontSize: '4rem' }}>📝</div>
              <p className="text-light" style={{ 
                fontSize: '1.1rem', 
                opacity: 0.8,
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
              }}>
                Aún no tienes entradas. ¡Comienza escribiendo tu primera reflexión!
              </p>
            </div>
          ) : (
            <div>
              {entries.map((entry, index) => (
                <div 
                  key={entry.id} 
                  className="modern-card mb-4 p-4"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    animation: 'fadeInUp 0.5s ease-out both',
                    position: 'relative'
                  }}
                >
                  {/* Botón eliminar */}
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(231, 76, 60, 0.2)',
                      border: '1px solid rgba(231, 76, 60, 0.4)',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontSize: '14px'
                    }}
                    title="Eliminar entrada"
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(231, 76, 60, 0.3)';
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(231, 76, 60, 0.2)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    🗑️
                  </button>

                  {/* Tu reflexión */}
                  <div className="mb-4" style={{ paddingRight: '40px' }}>
                    <div className="d-flex align-items-center mb-3">
                      <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>📝</span>
                      <h6 className="text-light mb-0" style={{ 
                        fontWeight: '600',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                      }}>
                        Tu Reflexión
                      </h6>
                    </div>
                    <p className="text-light" style={{ 
                      lineHeight: '1.6',
                      fontSize: '1.05rem',
                      marginBottom: '0',
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 'var(--border-radius)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {entry.text}
                    </p>
                  </div>

                  {/* Perspectiva AI */}
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-3">
                      <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>🤔</span>
                      <h6 className="text-light mb-0" style={{ 
                        fontWeight: '600',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                      }}>
                        Perspectiva y Reflexión
                      </h6>
                    </div>
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                      padding: '20px',
                      borderRadius: 'var(--border-radius)',
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
                        fontSize: '1.05rem'
                      }}>
                        {entry.reflection}
                      </p>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="d-flex justify-content-end">
                    <span className="badge-modern" style={{ 
                      opacity: 0.7,
                      background: 'rgba(255, 255, 255, 0.1)',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.85rem'
                    }}>
                      📅 {entry.timestamp.toLocaleDateString()} • ⏰ {entry.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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

export default DiarioVivo;
