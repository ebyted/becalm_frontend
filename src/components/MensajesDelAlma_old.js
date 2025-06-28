import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert, Row, Col } from 'react-bootstrap';
import API_CONFIG from '../config/api';

function MensajesDelAlma() {
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedMessages, setSavedMessages] = useState([]);

  const messageTypes = [
    { type: 'inspiracion', label: 'Inspiración', icon: '✨' },
    { type: 'fortaleza', label: 'Fortaleza', icon: '💪' },
    { type: 'paz', label: 'Paz Interior', icon: '🕊️' },
    { type: 'amor', label: 'Amor Propio', icon: '💝' },
    { type: 'esperanza', label: 'Esperanza', icon: '🌟' },
    { type: 'sabiduria', label: 'Sabiduría', icon: '🦉' }
  ];

  const generateMessage = async (type) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GENERATE}`, {
        method: 'POST',
        headers: API_CONFIG.getAuthHeaders(),
        body: JSON.stringify({
          prompt: `Genera un mensaje del alma sobre ${type}. Debe ser inspirador, profundo y reconfortante.`,
          mode: 'mensajes_alma'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentMessage(data.text);
      } else {
        throw new Error('Error al generar mensaje');
      }
    } catch (err) {
      // Fallback messages
      const fallbackMessages = {
        inspiracion: 'Tu alma conoce el camino. Confía en su sabiduría y permite que te guíe hacia la luz que ya llevas dentro.',
        fortaleza: 'Eres más fuerte de lo que crees. Cada desafío que has superado es prueba de tu resistencia interior.',
        paz: 'En el silencio de tu corazón encontrarás la paz que buscas. Respira profundo y permítete ser.',
        amor: 'Eres digno de amor, empezando por el amor que te das a ti mismo. Tu valor no depende de nadie más.',
        esperanza: 'Cada amanecer trae nuevas posibilidades. Tu futuro está lleno de oportunidades por descubrir.',
        sabiduria: 'La sabiduría no viene de saber todas las respuestas, sino de hacer las preguntas correctas.'
      };
      setCurrentMessage(fallbackMessages[type] || 'Tu alma tiene un mensaje especial para ti hoy. Escúchala con atención.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveMessage = () => {
    if (currentMessage) {
      const newSavedMessage = {
        text: currentMessage,
        timestamp: new Date(),
        id: Date.now()
      };
      setSavedMessages(prev => [newSavedMessage, ...prev.slice(0, 9)]); // Keep only last 10
      localStorage.setItem('savedMessages', JSON.stringify([newSavedMessage, ...savedMessages.slice(0, 9)]));
    }
  };

  useEffect(() => {
    // Load saved messages from localStorage
    const saved = localStorage.getItem('savedMessages');
    if (saved) {
      setSavedMessages(JSON.parse(saved));
    }
  }, []);

  return (
    <Container fluid>
      <div className="text-center mb-4">
        <h1 className="text-success">💌 Mensajes del Alma</h1>
        <p className="text-muted">Recibe inspiración y sabiduría para tu camino</p>
      </div>

      <Row className="mb-4">
        {messageTypes.map((type, index) => (
          <Col md={4} lg={2} key={index} className="mb-3">
            <Button
              variant="outline-success"
              className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
              onClick={() => generateMessage(type.type)}
              disabled={isLoading}
            >
              <div className="fs-3 mb-2">{type.icon}</div>
              <div>{type.label}</div>
            </Button>
          </Col>
        ))}
      </Row>

      {currentMessage && (
        <Card className="mb-4 shadow">
          <Card.Body className="text-center p-4">
            <h5 className="text-success mb-3">Mensaje del Alma</h5>
            <blockquote className="blockquote">
              <p className="mb-3" style={{ fontSize: '1.1em', lineHeight: '1.6' }}>
                "{currentMessage}"
              </p>
            </blockquote>
            <div>
              <Button 
                variant="success" 
                size="sm" 
                onClick={saveMessage}
                className="me-2"
              >
                💾 Guardar Mensaje
              </Button>
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={() => setCurrentMessage('')}
              >
                Cerrar
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}

      {isLoading && (
        <Alert variant="info" className="text-center">
          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
          Canalizando mensaje del alma...
        </Alert>
      )}

      {savedMessages.length > 0 && (
        <Card>
          <Card.Header>
            <h5>💎 Mensajes Guardados</h5>
          </Card.Header>
          <Card.Body>
            {savedMessages.map(message => (
              <Card key={message.id} className="mb-3 bg-light">
                <Card.Body className="py-3">
                  <p className="mb-2">"{message.text}"</p>
                  <small className="text-muted">
                    Guardado el {new Date(message.timestamp).toLocaleDateString()}
                  </small>
                </Card.Body>
              </Card>
            ))}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default MensajesDelAlma;