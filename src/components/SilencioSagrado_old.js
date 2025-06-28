import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col, Alert, Badge } from 'react-bootstrap';
import API_CONFIG from '../config/api';

function SilencioSagrado() {
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(300); // 5 minutes default
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [guidedMessage, setGuidedMessage] = useState('');

  const durations = [
    { value: 180, label: '3 min', description: 'Pausa breve' },
    { value: 300, label: '5 min', description: 'Momento de paz' },
    { value: 600, label: '10 min', description: 'Silencio profundo' },
    { value: 900, label: '15 min', description: 'Contemplación extendida' },
    { value: 1200, label: '20 min', description: 'Inmersión completa' }
  ];

  const startSilence = async () => {
    setIsActive(true);
    setTimer(selectedDuration);
    
    const session = {
      startTime: new Date(),
      duration: selectedDuration,
      id: Date.now()
    };
    setCurrentSession(session);

    // Get guided message from AI
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GENERATE}`, {
        method: 'POST',
        headers: API_CONFIG.getAuthHeaders(),
        body: JSON.stringify({
          prompt: `Crea una breve introducción inspiradora para una sesión de silencio sagrado de ${selectedDuration/60} minutos. Debe ser serena y motivadora.`,
          mode: 'silencio_sagrado'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGuidedMessage(data.text);
      }
    } catch (err) {
      setGuidedMessage('Bienvenido a este momento sagrado de silencio. Permite que la quietud abrace tu ser y encuentra la paz en este espacio atemporal.');
    }
  };

  const endSilence = () => {
    setIsActive(false);
    if (currentSession) {
      const completedSession = {
        ...currentSession,
        endTime: new Date(),
        completed: timer === 0,
        actualDuration: selectedDuration - timer
      };
      
      setSessions(prev => [completedSession, ...prev.slice(0, 9)]); // Keep last 10 sessions
      
      // Save to localStorage
      const savedSessions = JSON.parse(localStorage.getItem('silenceSessions') || '[]');
      savedSessions.unshift(completedSession);
      localStorage.setItem('silenceSessions', JSON.stringify(savedSessions.slice(0, 20)));
    }
    
    setTimer(0);
    setCurrentSession(null);
    setGuidedMessage('');
  };

  useEffect(() => {
    let interval = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    } else if (timer === 0 && isActive) {
      endSilence();
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  useEffect(() => {
    // Load previous sessions
    const savedSessions = JSON.parse(localStorage.getItem('silenceSessions') || '[]');
    setSessions(savedSessions.slice(0, 10));
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    return mins > 0 ? `${mins} min` : `${seconds} seg`;
  };

  const getTotalMinutes = () => {
    return sessions.reduce((total, session) => {
      return total + Math.floor((session.actualDuration || 0) / 60);
    }, 0);
  };

  const getSessionsThisWeek = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    return sessions.filter(session => 
      new Date(session.startTime) > weekAgo
    ).length;
  };

  return (
    <Container fluid>
      <div className="text-center mb-4">
        <h1 className="text-success">🤫 Silencio Sagrado</h1>
        <p className="text-muted">Encuentra la paz en el silencio interior</p>
      </div>

      <Row>
        <Col lg={8}>
          {!isActive ? (
            <Card className="mb-4">
              <Card.Header>
                <h5>Iniciar Sesión de Silencio</h5>
              </Card.Header>
              <Card.Body>
                <div className="text-center mb-4">
                  <p className="text-muted">
                    El silencio sagrado es un espacio para reconectar contigo mismo, 
                    encontrar calma interior y cultivar la presencia consciente.
                  </p>
                </div>

                <Row className="g-3 mb-4">
                  {durations.map(duration => (
                    <Col md={6} lg={4} key={duration.value}>
                      <Card 
                        className={`h-100 cursor-pointer ${selectedDuration === duration.value ? 'border-success bg-light' : 'border-secondary'}`}
                        onClick={() => setSelectedDuration(duration.value)}
                        style={{ cursor: 'pointer' }}
                      >
                        <Card.Body className="text-center">
                          <h4 className="text-success">{duration.label}</h4>
                          <p className="text-muted mb-0">{duration.description}</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>

                <div className="text-center">
                  <Button 
                    variant="success" 
                    size="lg"
                    onClick={startSilence}
                  >
                    🧘‍♀️ Comenzar Silencio ({formatDuration(selectedDuration)})
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ) : (
            <Card className="mb-4 text-center border-success">
              <Card.Body className="py-5">
                <div className="mb-4">
                  <h2 className="text-success mb-3">Silencio Sagrado</h2>
                  <div className="display-1 text-primary mb-3">
                    {formatTime(timer)}
                  </div>
                  <Badge bg="success" className="fs-6">En sesión</Badge>
                </div>

                {guidedMessage && (
                  <Alert variant="light" className="mb-4">
                    <p className="mb-0" style={{ fontStyle: 'italic' }}>
                      {guidedMessage}
                    </p>
                  </Alert>
                )}

                <div className="mt-4">
                  <Button 
                    variant="outline-secondary" 
                    onClick={endSilence}
                  >
                    Terminar Sesión
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>

        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header>
              <h6>📊 Tu Práctica</h6>
            </Card.Header>
            <Card.Body>
              <div className="text-center">
                <Row>
                  <Col>
                    <div className="mb-3">
                      <h4 className="text-success mb-1">{getTotalMinutes()}</h4>
                      <small className="text-muted">Minutos totales</small>
                    </div>
                  </Col>
                  <Col>
                    <div className="mb-3">
                      <h4 className="text-info mb-1">{getSessionsThisWeek()}</h4>
                      <small className="text-muted">Esta semana</small>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div>
                      <h4 className="text-warning mb-1">{sessions.length}</h4>
                      <small className="text-muted">Sesiones totales</small>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>

          {sessions.length > 0 && (
            <Card>
              <Card.Header>
                <h6>📝 Historial Reciente</h6>
              </Card.Header>
              <Card.Body>
                {sessions.slice(0, 5).map((session, index) => (
                  <div key={session.id} className="mb-2 pb-2 border-bottom">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <small className="text-muted">
                          {new Date(session.startTime).toLocaleDateString()}
                        </small>
                        <div>
                          <Badge 
                            bg={session.completed ? 'success' : 'warning'} 
                            className="me-1"
                          >
                            {formatDuration(session.actualDuration || 0)}
                          </Badge>
                          {session.completed && <span className="text-success">✓</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {sessions.length === 0 && (
                  <div className="text-center text-muted">
                    <p>Aún no tienes sesiones registradas</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default SilencioSagrado;