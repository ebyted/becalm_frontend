import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import API_CONFIG from '../config/api';
import SmartNavigation from './SmartNavigation';
import '../styles/FixOverlay.css';

function DialogoConmigo({ onLogout }) {
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
          mode: 'dialogo_conmigo'
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

  // Cargar conversaciones desde localStorage
  useEffect(() => {
    const savedConversations = localStorage.getItem('dialogo_conversations');
    if (savedConversations) {
      try {
        const parsedConversations = JSON.parse(savedConversations);
        const conversationsWithDates = parsedConversations.map(conv => ({
          ...conv,
          timestamp: new Date(conv.timestamp)
        }));
        setMessages(conversationsWithDates);
      } catch (error) {
        console.error('Error cargando conversaciones:', error);
      }
    }
  }, []);

  // Guardar conversaciones
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('dialogo_conversations', JSON.stringify(messages));
    }
  }, [messages]);

  const getFallbackResponse = () => {
    const responses = [
      'Gracias por compartir tus pensamientos conmigo. Tu reflexión muestra una profunda autoconciencia que es el primer paso hacia el crecimiento personal.',
      'Me parece muy valioso lo que compartes. A veces hablar de nuestros sentimientos nos ayuda a verlos desde una nueva perspectiva.',
      'Tu sinceridad es admirable. Recuerda que cada experiencia, incluso las difíciles, contribuyen a tu sabiduría interior.',
      'Aprecio tu confianza al compartir esto. Los momentos de reflexión como este son oportunidades para conectar más profundamente contigo mismo/a.',
      'Lo que describes resuena con la experiencia humana universal. Tu capacidad de reflexionar es un regalo que puedes cultivar día a día.'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const deleteConversation = (conversationId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta conversación?')) {
      setMessages(prev => prev.filter(conv => conv.id !== conversationId));
    }
  };

  return (
    <Container fluid className="h-100 d-flex flex-column py-3 px-1 px-sm-2 px-md-4">
      <SmartNavigation onLogout={onLogout} />
      <div className="text-center mb-4 mb-md-5">
        <div className="dialogo-container">
          <h1 className="gradient-title floating no-triple-select" style={{
            fontSize: 'clamp(2rem, 8vw, 3.5rem)',
            marginBottom: '1rem'
          }}>
            🕊️ Diálogo Conmigo
          </h1>
          <p className="text-light mb-3 mb-md-4" style={{ 
            fontSize: 'clamp(0.9rem, 4vw, 1.1rem)', 
            fontWeight: '300',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            padding: '0 1rem'
          }}>
            Un espacio seguro para conversaciones profundas contigo mismo
          </p>
        </div>
      </div>

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

      {/* Nueva conversación */}
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
            💭 Nueva Conversación
          </h5>
          <p className="text-light d-none d-sm-block" style={{ 
            opacity: 0.8,
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            fontSize: '0.95rem'
          }}>
            Comparte lo que tienes en mente
          </p>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
          <div className="mb-3 mb-md-4">
            <textarea
              className="form-control w-100"
              rows={4}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="¿Qué te gustaría explorar o compartir hoy? Puedes hablar de cualquier cosa que esté en tu corazón o mente..."
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
              className="btn btn-primary"
              type="submit" 
              disabled={isLoading || !inputMessage.trim()}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '25px',
                padding: 'clamp(8px 16px, 3vw, 12px 24px)',
                fontSize: 'clamp(0.85rem, 3.5vw, 1rem)',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                opacity: isLoading || !inputMessage.trim() ? 0.5 : 1
              }}
            >
              {isLoading ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <span className="d-none d-sm-inline">Procesando...</span>
                  <span className="d-sm-none">...</span>
                </>
              ) : (
                <>
                  <span className="d-none d-sm-inline me-2">Iniciar Diálogo</span>
                  <span className="d-sm-none me-1">Enviar</span>
                  <span>💫</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Conversaciones anteriores */}
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
            🗣️ Conversaciones Anteriores ({messages.length})
          </h5>
        </div>
        
        {messages.length === 0 ? (
          <div className="text-center py-4 py-md-5">
            <div className="floating mb-3 mb-md-4" style={{ 
              fontSize: 'clamp(2.5rem, 12vw, 4rem)' 
            }}>🕊️</div>
            <p className="text-light" style={{ 
              fontSize: 'clamp(0.9rem, 4vw, 1.1rem)', 
              opacity: 0.8,
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
              padding: '0 1rem'
            }}>
              Aún no tienes conversaciones. ¡Comienza tu primer diálogo interior!
            </p>
          </div>
        ) : (
          <div>
            {messages.map((conversation, index) => (
              <div 
                key={conversation.id} 
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
                {/* Botón eliminar */}
                <button
                  onClick={() => deleteConversation(conversation.id)}
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
                  title="Eliminar conversación"
                >
                  🗑️
                </button>

                {/* Tu mensaje */}
                <div className="mb-3 mb-md-4" style={{ 
                  paddingRight: 'clamp(32px, 8vw, 50px)' 
                }}>
                  <div className="d-flex align-items-center mb-2 mb-md-3">
                    <span style={{ 
                      fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', 
                      marginRight: '8px' 
                    }}>👤</span>
                    <h6 className="text-light mb-0" style={{ 
                      fontWeight: '600',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                      fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)'
                    }}>
                      Tu Mensaje
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
                    {conversation.userMessage}
                  </p>
                </div>

                {/* Respuesta AI */}
                <div className="mb-2 mb-md-3">
                  <div className="d-flex align-items-center mb-2 mb-md-3">
                    <span style={{ 
                      fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', 
                      marginRight: '8px' 
                    }}>🕊️</span>
                    <h6 className="text-light mb-0" style={{ 
                      fontWeight: '600',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                      fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)'
                    }}>
                      Respuesta Reflexiva
                    </h6>
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                    padding: 'clamp(12px, 3vw, 20px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                    position: 'relative'
                  }}>
                    <p className="text-light mb-0" style={{ 
                      lineHeight: '1.6',
                      fontSize: 'clamp(0.85rem, 3.5vw, 1.05rem)',
                      wordBreak: 'break-word'
                    }}>
                      {conversation.aiResponse}
                    </p>
                  </div>
                </div>

                {/* Timestamp */}
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
                    <span className="d-none d-sm-inline">📅 {conversation.timestamp.toLocaleDateString()} • ⏰ {conversation.timestamp.toLocaleTimeString()}</span>
                    <span className="d-sm-none">📅 {conversation.timestamp.toLocaleDateString()}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CSS */}
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
          border-color: rgba(102, 126, 234, 0.5) !important;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25) !important;
          color: white !important;
          outline: none !important;
        }

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

        @media (max-width: 768px) {
          .text-light {
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5) !important;
          }
        }
      `}</style>
    </Container>
  );
}

export default DialogoConmigo;