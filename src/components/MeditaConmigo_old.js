import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col, Badge, Alert } from 'react-bootstrap';
import API_CONFIG from '../config/api';

function MeditaConmigo() {
  const [currentSession, setCurrentSession] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [guidance, setGuidance] = useState('');
  const [backgroundMusic, setBackgroundMusic] = useState('silencio'); // 'silencio' o 'musica'
  const [currentTrack, setCurrentTrack] = useState(null);
  const [audioElement, setAudioElement] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState('');

  const meditationTypes = [
    { name: 'Respiración Consciente', duration: 5, description: 'Enfócate en tu respiración natural' },
    { name: 'Relajación Corporal', duration: 10, description: 'Libera la tensión de todo tu cuerpo' },
    { name: 'Mindfulness', duration: 15, description: 'Observa tus pensamientos sin juzgar' },
    { name: 'Gratitud', duration: 8, description: 'Cultiva sentimientos de agradecimiento' }
  ];

  const startMeditation = async (meditation) => {
    setCurrentSession(meditation);
    setTimer(meditation.duration * 60); // Convert to seconds
    setIsActive(true);

    try {
      // Get guided meditation text
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GENERATE}`, {
        method: 'POST',
        headers: API_CONFIG.getAuthHeaders(),
        body: JSON.stringify({
          prompt: `Crea una guía de meditación para ${meditation.name} de ${meditation.duration} minutos. ${meditation.description}`,
          mode: 'meditacion'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGuidance(data.text);
      }

      // If music is selected, get background music
      if (backgroundMusic === 'musica') {
        await getBackgroundMusic();
      }
    } catch (err) {
      setGuidance(`Bienvenido a tu sesión de ${meditation.name}. Encuentra una posición cómoda, cierra los ojos suavemente y permite que tu mente se relaje. ${meditation.description}.`);
      
      // Fallback music if API fails
      if (backgroundMusic === 'musica') {
        setCurrentTrack('Sonidos de la naturaleza y música suave');
      }
    }
  };

  const getBackgroundMusic = async () => {
    try {
      // Use the specific meditation music endpoint
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MEDITATION_MUSIC}`, {
        method: 'POST',
        headers: API_CONFIG.getAuthHeaders(),
        body: JSON.stringify({
          prompt: `meditación ${currentSession?.name?.toLowerCase() || 'mindfulness'}`,
          mode: 'Playlist'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.tracks && data.tracks.length > 0) {
          const randomTrack = data.tracks[Math.floor(Math.random() * data.tracks.length)];
          setCurrentTrack(randomTrack);
          // In a real app, you would play the actual audio file here
          simulateBackgroundMusic();
        } else {
          throw new Error('No tracks received');
        }
      } else {
        throw new Error('Music endpoint not available');
      }
    } catch (err) {
      console.log('Music API error:', err.message, '- Using fallback tracks');
      // Fallback to predefined relaxing music
      const fallbackTracks = [
        'Sonidos del Océano - Meditación Profunda',
        'Bosque Encantado - Música Ambient',
        'Lluvia Suave - Relajación Total',
        'Campanas Tibetanas - Armonía Interior',
        'Naturaleza Serena - Paz Mental'
      ];
      const randomTrack = fallbackTracks[Math.floor(Math.random() * fallbackTracks.length)];
      setCurrentTrack(randomTrack);
      simulateBackgroundMusic();
    }
  };

  const simulateBackgroundMusic = () => {
    try {
      // Usar Web Audio API para generar sonidos relajantes sintéticos
      generateRelaxingSounds();
    } catch (err) {
      console.error('Error al configurar audio:', err);
      setAudioError('Audio no soportado en este navegador');
      setCurrentTrack(currentTrack + ' (Silencioso)');
    }
  };

  const generateRelaxingSounds = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Crear múltiples osciladores para un sonido más rico
      const oscillators = [];
      const gainNodes = [];
      
      // Frecuencias relajantes (basadas en frecuencias Solfeggio)
      const frequencies = [220, 440, 528, 741]; // A3, A4, frecuencia de amor, frecuencia de despertar
      
      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const filterNode = audioContext.createBiquadFilter();
        
        // Configurar filtro para suavizar el sonido
        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(800, audioContext.currentTime);
        
        oscillator.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        oscillator.type = 'sine';
        
        // Volumen muy bajo y variable para cada oscilador
        const volume = 0.02 / (index + 1); // Cada oscilador más suave
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        
        // Añadir ligera modulación para hacer el sonido más orgánico
        const lfo = audioContext.createOscillator();
        const lfoGain = audioContext.createGain();
        lfo.frequency.setValueAtTime(0.5, audioContext.currentTime); // Modulación lenta
        lfoGain.gain.setValueAtTime(1, audioContext.currentTime);
        
        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);
        
        oscillator.start();
        lfo.start();
        
        oscillators.push({ oscillator, lfo });
        gainNodes.push(gainNode);
      });
      
      setAudioElement({ 
        pause: () => {
          oscillators.forEach(({ oscillator, lfo }) => {
            try {
              oscillator.stop();
              lfo.stop();
            } catch (e) {}
          });
          audioContext.close();
        },
        oscillators: oscillators,
        context: audioContext
      });
      
      setIsPlaying(true);
      console.log('🎵 Reproduciendo sonidos relajantes sintéticos');
      
    } catch (err) {
      console.error('Error generando sonidos:', err);
      setAudioError('Generación de audio no disponible');
      setCurrentTrack(currentTrack + ' (Silencioso)');
    }
  };

  const stopMeditation = () => {
    setIsActive(false);
    setCurrentSession(null);
    setTimer(0);
    setGuidance('');
    setCurrentTrack(null);
    setIsPlaying(false);
    setAudioError('');
    
    if (audioElement) {
      try {
        if (audioElement.pause) {
          audioElement.pause();
        }
        if (audioElement.oscillators) {
          audioElement.oscillators.forEach(({ oscillator, lfo }) => {
            try {
              oscillator.stop();
              lfo.stop();
            } catch (e) {}
          });
        }
        if (audioElement.context) {
          audioElement.context.close();
        }
      } catch (err) {
        console.log('Audio ya detenido');
      }
      setAudioElement(null);
    }
  };

  useEffect(() => {
    let interval = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    } else if (timer === 0 && isActive) {
      setIsActive(false);
      setGuidance(guidance + '\n\nTu sesión de meditación ha terminado. Toma un momento para agradecer este tiempo que te has dedicado.');
    }
    return () => clearInterval(interval);
  }, [isActive, timer, guidance]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Container fluid>
      <div className="text-center mb-4">
        <h1 className="text-success">🧘‍♀️ Medita Conmigo</h1>
        <p className="text-muted">Encuentra tu paz interior con sesiones guiadas</p>
      </div>

      {!currentSession ? (
        <div>
          {/* Music Background Selection */}
          <Card className="mb-4">
            <Card.Header>
              <h6>🎵 Ambiente de Meditación</h6>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-center gap-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="backgroundMusic"
                    id="silencio"
                    value="silencio"
                    checked={backgroundMusic === 'silencio'}
                    onChange={(e) => setBackgroundMusic(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="silencio">
                    🤫 Silencio
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="backgroundMusic"
                    id="musica"
                    value="musica"
                    checked={backgroundMusic === 'musica'}
                    onChange={(e) => setBackgroundMusic(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="musica">
                    🎼 Con música de fondo
                  </label>
                </div>
              </div>
              {backgroundMusic === 'musica' && (
                <div className="text-center mt-2">
                  <small className="text-muted">
                    La IA seleccionará música armoniosa para tu meditación
                  </small>
                </div>
              )}
            </Card.Body>
          </Card>

          <Row>
          {meditationTypes.map((meditation, index) => (
            <Col md={6} lg={3} key={index} className="mb-3">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-center">{meditation.name}</Card.Title>
                  <Card.Text className="flex-grow-1 text-center">
                    {meditation.description}
                  </Card.Text>
                  <div className="text-center mb-3">
                    <Badge bg="success">{meditation.duration} min</Badge>
                  </div>
                  <Button 
                    variant="outline-success" 
                    onClick={() => startMeditation(meditation)}
                    className="mt-auto"
                  >
                    Comenzar
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        </div>
      ) : (
        <Card className="text-center">
          <Card.Body>
            <h3 className="text-success mb-4">{currentSession.name}</h3>
            
            <div className="mb-4">
              <h1 className="display-4 text-primary">{formatTime(timer)}</h1>
              {isActive && <Badge bg="success">En progreso</Badge>}
              {!isActive && timer === 0 && <Badge bg="secondary">Completado</Badge>}
            </div>

            {guidance && (
              <Card className="mb-4 bg-light">
                <Card.Body>
                  <p style={{ whiteSpace: 'pre-line' }}>{guidance}</p>
                </Card.Body>
              </Card>
            )}

            {currentTrack && (
              <Alert variant="info" className="mb-4">
                <div className="d-flex align-items-center justify-content-center">
                  <span className="me-2">🎵</span>
                  <strong>Reproduciendo: </strong>
                  <span className="ms-2">{currentTrack}</span>
                  {isPlaying && <span className="ms-2 badge bg-success">▶️ Activo</span>}
                </div>
                {audioError && (
                  <div className="text-center mt-2">
                    <small className="text-warning">{audioError}</small>
                  </div>
                )}
              </Alert>
            )}

            <div>
              {isActive ? (
                <Button variant="danger" onClick={stopMeditation}>
                  Terminar Sesión
                </Button>
              ) : (
                <Button variant="secondary" onClick={() => {
                  setCurrentSession(null);
                  setGuidance('');
                }}>
                  Volver al Menú
                </Button>
              )}
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default MeditaConmigo;