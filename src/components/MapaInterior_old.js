import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert, Row, Col, ProgressBar, Badge } from 'react-bootstrap';
import API_CONFIG from '../config/api';

function MapaInterior() {
  const [emotionalState, setEmotionalState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [insights, setInsights] = useState('');
  const [weeklyProgress, setWeeklyProgress] = useState([]);

  const emotions = [
    { name: 'Alegría', color: 'success', icon: '😊', intensity: 0 },
    { name: 'Tranquilidad', color: 'info', icon: '😌', intensity: 0 },
    { name: 'Energía', color: 'warning', icon: '⚡', intensity: 0 },
    { name: 'Gratitud', color: 'primary', icon: '🙏', intensity: 0 },
    { name: 'Ansiedad', color: 'danger', icon: '😰', intensity: 0 },
    { name: 'Tristeza', color: 'secondary', icon: '😢', intensity: 0 },
    { name: 'Enojo', color: 'danger', icon: '😠', intensity: 0 },
    { name: 'Confusión', color: 'dark', icon: '🤔', intensity: 0 }
  ];

  const [currentEmotions, setCurrentEmotions] = useState(emotions);

  const updateEmotionIntensity = (emotionName, intensity) => {
    setCurrentEmotions(prev => 
      prev.map(emotion => 
        emotion.name === emotionName 
          ? { ...emotion, intensity } 
          : emotion
      )
    );
  };

  const generateInsights = async () => {
    setIsLoading(true);
    
    const dominantEmotions = currentEmotions
      .filter(e => e.intensity > 3)
      .map(e => `${e.name} (${e.intensity}/5)`)
      .join(', ');

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GENERATE}`, {
        method: 'POST',
        headers: API_CONFIG.getAuthHeaders(),
        body: JSON.stringify({
          prompt: `Analiza este estado emocional y proporciona insights de autoconocimiento: ${dominantEmotions}. Incluye sugerencias para el crecimiento personal.`,
          mode: 'mapa_interior'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setInsights(data.text);
        saveEmotionalState();
      } else {
        throw new Error('Error al generar insights');
      }
    } catch (err) {
      setInsights(generateFallbackInsights(dominantEmotions));
      saveEmotionalState();
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackInsights = (emotions) => {
    if (!emotions) {
      return 'Tu mapa emocional muestra un estado equilibrado. Este es un buen momento para reflexionar sobre lo que ha contribuido a esta estabilidad.';
    }
    
    return `He notado estas emociones predominantes: ${emotions}. 
    
Recuerda que todas las emociones son válidas y temporales. Las emociones intensas nos ofrecen información valiosa sobre nuestras necesidades y valores.

Sugerencias para ti:
• Practica la autocompasión mientras navegas estos sentimientos
• Considera qué necesidades emocionales puedes atender hoy
• Recuerda que el crecimiento surge tanto de momentos difíciles como de alegres
• Tu consciencia emocional ya es un gran paso hacia el bienestar`;
  };

  const saveEmotionalState = () => {
    const state = {
      date: new Date().toLocaleDateString(),
      emotions: currentEmotions.filter(e => e.intensity > 0),
      insights: insights,
      timestamp: new Date()
    };

    const savedStates = JSON.parse(localStorage.getItem('emotionalStates') || '[]');
    savedStates.unshift(state);
    localStorage.setItem('emotionalStates', JSON.stringify(savedStates.slice(0, 30)));
    
    updateWeeklyProgress();
  };

  const updateWeeklyProgress = () => {
    const savedStates = JSON.parse(localStorage.getItem('emotionalStates') || '[]');
    const lastWeek = savedStates.slice(0, 7);
    setWeeklyProgress(lastWeek);
  };

  useEffect(() => {
    updateWeeklyProgress();
  }, []);

  const getEmotionalBalance = () => {
    const positiveEmotions = ['Alegría', 'Tranquilidad', 'Energía', 'Gratitud'];
    const positiveSum = currentEmotions
      .filter(e => positiveEmotions.includes(e.name))
      .reduce((sum, e) => sum + e.intensity, 0);
    
    const totalSum = currentEmotions.reduce((sum, e) => sum + e.intensity, 0);
    
    return totalSum > 0 ? (positiveSum / totalSum) * 100 : 50;
  };

  return (
    <Container fluid>
      <div className="text-center mb-4">
        <h1 className="text-success">🗺️ Mapa Interior</h1>
        <p className="text-muted">Explora y comprende tu paisaje emocional</p>
      </div>

      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5>¿Cómo te sientes ahora?</h5>
              <small className="text-muted">Desliza para indicar la intensidad de cada emoción (1-5)</small>
            </Card.Header>
            <Card.Body>
              <Row>
                {currentEmotions.map((emotion) => (
                  <Col md={6} key={emotion.name} className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <span className="me-2" style={{ fontSize: '1.5em' }}>{emotion.icon}</span>
                      <strong className="me-auto">{emotion.name}</strong>
                      <Badge bg={emotion.color}>{emotion.intensity}/5</Badge>
                    </div>
                    <input
                      type="range"
                      className="form-range"
                      min="0"
                      max="5"
                      value={emotion.intensity}
                      onChange={(e) => updateEmotionIntensity(emotion.name, parseInt(e.target.value))}
                    />
                  </Col>
                ))}
              </Row>
              
              <div className="text-center mt-4">
                <Button 
                  variant="success" 
                  onClick={generateInsights}
                  disabled={isLoading || currentEmotions.every(e => e.intensity === 0)}
                >
                  {isLoading ? 'Analizando...' : 'Generar Insights'}
                </Button>
              </div>
            </Card.Body>
          </Card>

          {insights && (
            <Card className="mb-4">
              <Card.Header>
                <h5>🔍 Insights de tu Mapa Interior</h5>
              </Card.Header>
              <Card.Body>
                <p style={{ whiteSpace: 'pre-line' }}>{insights}</p>
              </Card.Body>
            </Card>
          )}
        </Col>

        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header>
              <h6>Balance Emocional Actual</h6>
            </Card.Header>
            <Card.Body>
              <div className="text-center">
                <div className="mb-3">
                  <span style={{ fontSize: '3em' }}>
                    {getEmotionalBalance() > 60 ? '😊' : getEmotionalBalance() > 40 ? '😐' : '😔'}
                  </span>
                </div>
                <ProgressBar 
                  now={getEmotionalBalance()} 
                  variant={getEmotionalBalance() > 60 ? 'success' : getEmotionalBalance() > 40 ? 'warning' : 'danger'}
                  className="mb-2"
                />
                <small className="text-muted">
                  {Math.round(getEmotionalBalance())}% Balance Positivo
                </small>
              </div>
            </Card.Body>
          </Card>

          {weeklyProgress.length > 0 && (
            <Card>
              <Card.Header>
                <h6>Progreso Semanal</h6>
              </Card.Header>
              <Card.Body>
                {weeklyProgress.slice(0, 5).map((state, index) => (
                  <div key={index} className="mb-2 pb-2 border-bottom">
                    <div className="d-flex justify-content-between">
                      <small><strong>{state.date}</strong></small>
                      <div>
                        {state.emotions.slice(0, 3).map(emotion => (
                          <span key={emotion.name} style={{ fontSize: '0.8em' }} className="me-1">
                            {emotions.find(e => e.name === emotion.name)?.icon}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                {weeklyProgress.length === 0 && (
                  <small className="text-muted">
                    Comienza a registrar tu estado emocional para ver tu progreso
                  </small>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default MapaInterior;