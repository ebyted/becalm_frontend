import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert, ProgressBar, Form, Row, Col, Badge } from 'react-bootstrap';
import API_CONFIG from '../config/api';

function RitualDiario() {
  const [todayRitual, setTodayRitual] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reflection, setReflection] = useState('');
  const [ritualComplete, setRitualComplete] = useState(false);

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
        // Parse the response to create structured ritual steps
        const ritualSteps = parseRitualSteps(data.text);
        setTodayRitual(ritualSteps);
      } else {
        throw new Error('Error al generar ritual');
      }
    } catch (err) {
      // Fallback ritual
      setTodayRitual({
        title: 'Ritual de Bienestar Diario',
        steps: [
          {
            id: 1,
            title: 'Respiración Consciente',
            description: 'Toma 5 respiraciones profundas y conscientes al despertar',
            duration: '2 minutos'
          },
          {
            id: 2,
            title: 'Intención del Día',
            description: 'Establece una intención positiva para tu día',
            duration: '3 minutos'
          },
          {
            id: 3,
            title: 'Gratitud',
            description: 'Escribe o piensa en 3 cosas por las que te sientes agradecido',
            duration: '3 minutos'
          },
          {
            id: 4,
            title: 'Movimiento Suave',
            description: 'Realiza algunos estiramientos o movimientos suaves',
            duration: '5 minutos'
          },
          {
            id: 5,
            title: 'Afirmación Personal',
            description: 'Repite una afirmación que te empodere y te dé confianza',
            duration: '2 minutos'
          }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const parseRitualSteps = (text) => {
    // Simple parsing for fallback
    return {
      title: 'Ritual de Bienestar Generado',
      description: text,
      steps: [
        {
          id: 1,
          title: 'Primer Paso',
          description: 'Preparación y centrado',
          duration: '3 minutos'
        },
        {
          id: 2,
          title: 'Segundo Paso', 
          description: 'Práctica principal',
          duration: '5 minutos'
        },
        {
          id: 3,
          title: 'Cierre',
          description: 'Integración y gratitud',
          duration: '2 minutos'
        }
      ]
    };
  };

  const toggleStepComplete = (stepId) => {
    setCompletedSteps(prev => {
      if (prev.includes(stepId)) {
        return prev.filter(id => id !== stepId);
      } else {
        const newCompleted = [...prev, stepId];
        if (newCompleted.length === todayRitual.steps.length) {
          setRitualComplete(true);
        }
        return newCompleted;
      }
    });
  };

  const saveReflection = async () => {
    if (reflection.trim()) {
      try {
        await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GENERATE}`, {
          method: 'POST',
          headers: API_CONFIG.getAuthHeaders(),
          body: JSON.stringify({
            prompt: `Refleja sobre esta experiencia de ritual diario: "${reflection}"`,
            mode: 'reflexion_ritual'
          }),
        });
      } catch (err) {
        console.log('Reflexión guardada localmente');
      }
      
      // Save locally
      const ritualData = {
        date: new Date().toLocaleDateString(),
        completed: ritualComplete,
        reflection: reflection,
        steps: completedSteps.length
      };
      
      const savedRituals = JSON.parse(localStorage.getItem('dailyRituals') || '[]');
      savedRituals.unshift(ritualData);
      localStorage.setItem('dailyRituals', JSON.stringify(savedRituals.slice(0, 30))); // Keep last 30 days
      
      alert('¡Ritual completado y reflexión guardada!');
    }
  };

  useEffect(() => {
    // Check if ritual for today already exists
    const today = new Date().toLocaleDateString();
    const savedRituals = JSON.parse(localStorage.getItem('dailyRituals') || '[]');
    const todayData = savedRituals.find(r => r.date === today);
    
    if (!todayData) {
      generateDailyRitual();
    }
  }, []);

  const progressPercentage = todayRitual ? (completedSteps.length / todayRitual.steps.length) * 100 : 0;

  return (
    <Container fluid>
      <div className="text-center mb-4">
        <h1 className="text-success">🌅 Ritual Diario</h1>
        <p className="text-muted">Cultiva hábitos de bienestar con rituales personalizados</p>
      </div>

      {isLoading && (
        <Alert variant="info" className="text-center">
          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
          Creando tu ritual diario personalizado...
        </Alert>
      )}

      {todayRitual && (
        <>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">{todayRitual.title}</h5>
              <Badge bg={ritualComplete ? 'success' : 'primary'}>
                {completedSteps.length}/{todayRitual.steps.length} completados
              </Badge>
            </Card.Header>
            <Card.Body>
              <ProgressBar 
                now={progressPercentage} 
                className="mb-3"
                variant={ritualComplete ? 'success' : 'primary'}
              />
              
              {todayRitual.description && (
                <Alert variant="light" className="mb-3">
                  {todayRitual.description}
                </Alert>
              )}

              <Row>
                {todayRitual.steps.map((step) => (
                  <Col md={6} lg={4} key={step.id} className="mb-3">
                    <Card 
                      className={`h-100 ${completedSteps.includes(step.id) ? 'border-success bg-light' : 'border-secondary'}`}
                    >
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="card-title">{step.title}</h6>
                          <Badge bg="secondary" className="ms-2">{step.duration}</Badge>
                        </div>
                        <p className="card-text">{step.description}</p>
                        <Button
                          variant={completedSteps.includes(step.id) ? 'success' : 'outline-primary'}
                          size="sm"
                          onClick={() => toggleStepComplete(step.id)}
                          className="w-100"
                        >
                          {completedSteps.includes(step.id) ? '✓ Completado' : 'Marcar como completado'}
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>

          {ritualComplete && (
            <Card className="mb-4 border-success">
              <Card.Header className="bg-success text-white">
                <h5 className="mb-0">🎉 ¡Ritual Completado!</h5>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group>
                    <Form.Label>Reflexiona sobre tu experiencia</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={reflection}
                      onChange={(e) => setReflection(e.target.value)}
                      placeholder="¿Cómo te sientes después de completar tu ritual? ¿Qué observas en ti?"
                    />
                  </Form.Group>
                  <Button 
                    variant="success" 
                    className="mt-3"
                    onClick={saveReflection}
                    disabled={!reflection.trim()}
                  >
                    Guardar Reflexión
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          )}

          <div className="text-center">
            <Button 
              variant="outline-success" 
              onClick={generateDailyRitual}
              disabled={isLoading}
            >
              Generar Nuevo Ritual
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}

export default RitualDiario;