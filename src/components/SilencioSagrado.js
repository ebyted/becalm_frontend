import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function SilencioSagrado() {
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [phase, setPhase] = useState('preparation'); // preparation, active, completion

  const durations = [
    { value: 3, label: '3 minutos', icon: '🌱' },
    { value: 5, label: '5 minutos', icon: '🌿' },
    { value: 10, label: '10 minutos', icon: '🌳' },
    { value: 15, label: '15 minutos', icon: '🏔️' },
    { value: 20, label: '20 minutos', icon: '🌌' }
  ];

  const startSilence = () => {
    setTimer(selectedDuration * 60);
    setIsActive(true);
    setPhase('active');
  };

  const stopSilence = () => {
    setIsActive(false);
    setTimer(0);
    setPhase('completion');
    setTimeout(() => setPhase('preparation'), 3000);
  };

  useEffect(() => {
    let interval = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    } else if (timer === 0 && isActive) {
      setIsActive(false);
      setPhase('completion');
      setTimeout(() => setPhase('preparation'), 5000);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!selectedDuration || timer === 0) return 0;
    return ((selectedDuration * 60 - timer) / (selectedDuration * 60)) * 100;
  };

  return (
    <Container fluid>
      <div className="text-center mb-5">
        <h1 className="gradient-title display-4 floating">🤫 Silencio Sagrado</h1>
        <p className="text-light mb-4" style={{ fontSize: '1.1rem', fontWeight: '300' }}>
          Encuentra paz en el espacio entre pensamientos
        </p>
      </div>

      {phase === 'preparation' && (
        <div>
          <div className="modern-card mb-5 p-5 text-center">
            <div className="floating mb-4" style={{ fontSize: '4rem' }}>🧘‍♂️</div>
            <h3 className="text-light mb-4" style={{ fontWeight: '600' }}>
              Prepárate para el Silencio
            </h3>
            <p className="text-light mb-4" style={{ opacity: 0.8, maxWidth: '600px', margin: '0 auto' }}>
              El silencio no es vacío, es plenitud. En estos momentos de quietud encontrarás la 
              sabiduría que ya vive en ti. Elige la duración que resuene con tu alma hoy.
            </p>
          </div>

          {/* Duration Selection */}
          <div className="modern-card mb-5 p-4">
            <div className="text-center mb-4">
              <h5 className="text-light" style={{ fontWeight: '600', fontSize: '1.3rem' }}>
                ⏱️ Duración de tu Silencio
              </h5>
            </div>

            <Row className="g-3">
              {durations.map((duration, index) => (
                <Col md={6} lg key={duration.value}>
                  <button
                    className="w-100 p-3 border-0"
                    onClick={() => setSelectedDuration(duration.value)}
                    style={{
                      background: selectedDuration === duration.value 
                        ? 'var(--primary-gradient)' 
                        : 'var(--glass-bg)',
                      color: 'white',
                      borderRadius: 'var(--border-radius)',
                      transition: 'var(--transition)',
                      cursor: 'pointer',
                      border: selectedDuration === duration.value 
                        ? '2px solid rgba(255, 255, 255, 0.3)'
                        : '1px solid var(--glass-border)',
                      fontWeight: selectedDuration === duration.value ? '600' : '500',
                      animationDelay: `${index * 0.1}s`,
                      animation: 'fadeInUp 0.5s ease-out both'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedDuration !== duration.value) {
                        e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedDuration !== duration.value) {
                        e.target.style.background = 'var(--glass-bg)';
                        e.target.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                      {duration.icon}
                    </div>
                    <div>{duration.label}</div>
                  </button>
                </Col>
              ))}
            </Row>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button 
              className="btn-modern btn-success-modern"
              onClick={startSilence}
              style={{ padding: '16px 32px', fontSize: '1.1rem' }}
            >
              <span className="me-2">Comenzar Silencio</span>
              <span>🌟</span>
            </button>
          </div>
        </div>
      )}

      {phase === 'active' && (
        <div className="modern-card text-center p-5">
          <div className="mb-5">
            <div style={{ fontSize: '6rem', marginBottom: '20px' }}>
              🤫
            </div>
            <h3 className="text-light mb-4" style={{ fontWeight: '300' }}>
              En Silencio Sagrado
            </h3>
          </div>

          <div className="mb-5">
            <div 
              className="display-1 mb-4 floating" 
              style={{ 
                background: 'var(--success-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: '700',
                fontSize: '4rem'
              }}
            >
              {formatTime(timer)}
            </div>

            {/* Progress Circle */}
            <div className="mb-4">
              <div className="progress-modern">
                <div 
                  className="progress-bar-modern"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              <small className="text-light mt-2 d-block" style={{ opacity: 0.7 }}>
                {Math.round(getProgressPercentage())}% completado
              </small>
            </div>
          </div>

          {/* Gentle guidance */}
          <div className="mb-5" style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '20px',
            borderRadius: 'var(--border-radius)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <p className="text-light mb-0" style={{ 
              fontSize: '1rem', 
              fontStyle: 'italic',
              opacity: 0.8,
              lineHeight: '1.6'
            }}>
              Respira suavemente... Permite que los pensamientos pasen como nubes en el cielo... 
              Encuentra el espacio de paz que siempre ha estado ahí...
            </p>
          </div>

          <button 
            className="btn-modern btn-secondary-modern"
            onClick={stopSilence}
          >
            <span className="me-2">Finalizar Silencio</span>
            <span>🔔</span>
          </button>
        </div>
      )}

      {phase === 'completion' && (
        <div className="modern-card text-center p-5">
          <div style={{ fontSize: '5rem', marginBottom: '30px' }}>
            🙏
          </div>
          
          <h3 className="gradient-title mb-4">
            Silencio Completado
          </h3>
          
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            padding: '30px',
            borderRadius: 'var(--border-radius-large)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            marginBottom: '30px'
          }}>
            <p className="text-light mb-0" style={{ 
              fontSize: '1.2rem',
              lineHeight: '1.6',
              fontWeight: '300'
            }}>
              Has honrado tu necesidad de silencio. En estos momentos de quietud, 
              tu alma se regenera y encuentra claridad. Lleva esta paz contigo 
              a lo largo del día.
            </p>
          </div>

          <p className="text-light" style={{ opacity: 0.7 }}>
            Regresando al menú principal...
          </p>
        </div>
      )}
    </Container>
  );
}

export default SilencioSagrado;
