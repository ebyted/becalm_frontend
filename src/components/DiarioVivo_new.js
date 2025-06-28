import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import API_CONFIG from '../config/api';

function DiarioVivo() {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const saveEntry = async () => {
    if (!newEntry.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GENERATE}`, {
        method: 'POST',
        headers: API_CONFIG.getAuthHeaders(),
        body: JSON.stringify({
          prompt: `Reflexiona sobre esta entrada de diario: "${newEntry}". Proporciona una perspectiva reflexiva y alentadora.`,
          mode: 'diario_vivo'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const entry = {
          text: newEntry,
          reflection: data.text,
          timestamp: new Date(),
          id: Date.now()
        };
        setEntries(prev => [entry, ...prev]);
        setNewEntry('');
      } else {
        throw new Error('Error al guardar la entrada');
      }
    } catch (err) {
      setError('No se pudo guardar la entrada');
      // Save locally as fallback
      const entry = {
        text: newEntry,
        reflection: 'Tu reflexión es valiosa. Cada palabra escrita es un paso hacia el autoconocimiento y el crecimiento personal. Continúa explorando tus pensamientos con curiosidad y compasión.',
        timestamp: new Date(),
        id: Date.now()
      };
      setEntries(prev => [entry, ...prev]);
      setNewEntry('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid>
      <div className="text-center mb-5">
        <h1 className="gradient-title display-4 floating">📖 Diario Vivo</h1>
        <p className="text-light mb-4" style={{ fontSize: '1.1rem', fontWeight: '300' }}>
          Registra tus pensamientos y reflexiones diarias
        </p>
      </div>

      {error && (
        <div className="alert-modern mb-4 text-center" style={{ color: '#e74c3c' }}>
          {error}
        </div>
      )}

      {/* Nueva entrada */}
      <div className="modern-card mb-5 p-4">
        <div className="text-center mb-4">
          <h5 className="text-light" style={{ fontWeight: '600', fontSize: '1.3rem' }}>
            ✨ Nueva Entrada
          </h5>
          <p className="text-light" style={{ opacity: 0.8 }}>
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
          <h5 className="text-light" style={{ fontWeight: '600', fontSize: '1.3rem' }}>
            📚 Entradas Anteriores
          </h5>
        </div>
        
        {entries.length === 0 ? (
          <div className="text-center py-5">
            <div className="floating mb-4" style={{ fontSize: '4rem' }}>📝</div>
            <p className="text-light" style={{ fontSize: '1.1rem', opacity: 0.8 }}>
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
                  animation: 'fadeInUp 0.5s ease-out both'
                }}
              >
                {/* Tu reflexión */}
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>📝</span>
                    <h6 className="text-light mb-0" style={{ fontWeight: '600' }}>
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
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    {entry.text}
                  </p>
                </div>

                {/* Perspectiva AI */}
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-3">
                    <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>🤔</span>
                    <h6 className="text-light mb-0" style={{ fontWeight: '600' }}>
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
                  <span className="badge-modern" style={{ opacity: 0.7 }}>
                    📅 {entry.timestamp.toLocaleDateString()} • ⏰ {entry.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}

export default DiarioVivo;
