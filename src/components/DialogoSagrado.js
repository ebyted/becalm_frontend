import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import API_CONFIG from '../config/api';

function DialogoSagrado() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load conversation history when component mounts
    const loadHistory = async () => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DIALOGO_HISTORY}?days=7`, {
          headers: API_CONFIG.getAuthHeaders()
        });

        if (response.ok) {
          const history = await response.json();
          const formattedHistory = history.map(msg => ({
            text: msg.content,
            sender: msg.role === 'user' ? 'user' : 'ai',
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(formattedHistory);
        }
      } catch (err) {
        console.log('No se pudo cargar el historial:', err);
      }
    };

    loadHistory();
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { text: inputMessage, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DIALOGO_MESSAGE}`, {
        method: 'POST',
        headers: API_CONFIG.getAuthHeaders(),
        body: JSON.stringify({
          prompt: inputMessage,
          mode: 'dialogo_sagrado'
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la comunicación con el servidor');
      }

      const data = await response.json();
      const aiMessage = { 
        text: data.text || 'Gracias por compartir. ¿Cómo te sientes al expresar esto?', 
        sender: 'ai', 
        timestamp: new Date() 
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setError('No se pudo conectar con el servicio de IA. Modo offline activado.');
      // Fallback response when API is not available
      const fallbackMessage = {
        text: 'Comprendo tu mensaje. En este espacio sagrado, cada palabra tiene valor. ¿Te gustaría profundizar más en estos sentimientos?',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Container fluid className="h-100 d-flex flex-column">
      <div className="text-center mb-4">
        <h1 className="gradient-title display-4 floating">🕊️ Diálogo Conmigo</h1>
        <div className="d-flex align-items-center justify-content-center mb-3">
          <div className="becalm-logo-floating me-3">
            🕊️
          </div>
          <p className="text-light mb-0" style={{ 
            fontSize: '1.1rem', 
            fontWeight: '300',
            color: '#ffffff',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.7)'
          }}>
            Un espacio seguro para la reflexión y el crecimiento personal
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="warning" dismissible onClose={() => setError('')} className="alert-modern">
          {error}
        </Alert>
      )}

      <div className="modern-card flex-grow-1 d-flex flex-column" style={{ maxHeight: '70vh', minHeight: '500px' }}>
        <div className="flex-grow-1 overflow-auto p-4" style={{ scrollbarWidth: 'thin' }}>
          {messages.length === 0 ? (
            <div className="text-center mt-5">
              <div className="floating" style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌟</div>
              <p className="text-light" style={{ fontSize: '1.1rem', opacity: 0.8 }}>
                Bienvenido al Diálogo Conmigo. Comparte tus pensamientos y sentimientos...
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div 
                key={index} 
                className={`d-flex mb-3 ${message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
              >
                <div 
                  className={`chat-bubble ${
                    message.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'
                  }`}
                >
                  <div style={{ marginBottom: '8px', lineHeight: '1.5' }}>{message.text}</div>
                  <small style={{ opacity: 0.7, fontSize: '0.8rem' }}>
                    {message.timestamp.toLocaleTimeString()}
                  </small>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="d-flex justify-content-start mb-3">
              <div className="chat-bubble chat-bubble-ai">
                <div className="d-flex align-items-center">
                  <div className="modern-spinner me-2"></div>
                  <span>Reflexionando...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-top" style={{ borderColor: 'var(--glass-border) !important' }}>
          <Form onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
            <div className="d-flex gap-3 align-items-end">
              <div className="flex-grow-1">
                <textarea
                  className="form-control-modern w-100"
                  rows={2}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Comparte tus pensamientos, sentimientos o preguntas..."
                  disabled={isLoading}
                  style={{ 
                    resize: 'none',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <button 
                className="btn-modern btn-success-modern d-flex align-items-center justify-content-center"
                type="submit" 
                disabled={isLoading || !inputMessage.trim()}
                style={{ minWidth: '100px', height: '48px' }}
              >
                {isLoading ? (
                  <div className="modern-spinner" style={{ width: '20px', height: '20px' }}></div>
                ) : (
                  <>
                    <span className="me-2">Enviar</span>
                    <span>✨</span>
                  </>
                )}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </Container>
  );
}

export default DialogoSagrado;