import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
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
      
      // Even if API fails, try to provide synthetic sounds if music is selected
      if (backgroundMusic === 'musica') {
        generateFallbackMusic();
      }
    }
  };

  const stopMeditation = () => {
    setIsActive(false);
    setTimer(0);
    
    // Stop any audio
    stopAudio();
  };

  const getBackgroundMusic = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MEDITATION_MUSIC}`, {
        method: 'POST',
        headers: API_CONFIG.getAuthHeaders(),
        body: JSON.stringify({
          meditation_type: currentSession?.name || 'relajacion',
          duration: currentSession?.duration || 10,
          style: 'ambient'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.tracks && data.tracks.length > 0) {
          const track = data.tracks[0];
          setCurrentTrack(track.name || 'Música de Meditación');
          
          if (track.url) {
            playAudioTrack(track.url);
          } else {
            generateFallbackMusic();
          }
        } else {
          generateFallbackMusic();
        }
      } else {
        generateFallbackMusic();
      }
    } catch (err) {
      console.error('Error getting background music:', err);
      generateFallbackMusic();
    }
  };

  const generateFallbackMusic = () => {
    setCurrentTrack('Sonidos Relajantes Sintéticos');
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
        
        oscillators.push(oscillator);
        gainNodes.push(gainNode);
      });
      
      setAudioElement({ oscillators, gainNodes, context: audioContext });
      setIsPlaying(true);
      setAudioError('');
      
    } catch (err) {
      console.error('Error creating synthetic audio:', err);
      setAudioError('No se pudo crear audio sintético');
    }
  };

  const playAudioTrack = (url) => {
    try {
      const audio = new Audio(url);
      audio.loop = true;
      audio.volume = 0.3;
      
      audio.addEventListener('loadstart', () => {
        setIsPlaying(true);
        setAudioError('');
      });
      
      audio.addEventListener('error', (e) => {
        console.error('Error loading audio:', e);
        setAudioError('Error al cargar la música');
        setIsPlaying(false);
        // Fallback to synthetic sounds
        generateFallbackMusic();
      });
      
      audio.play().then(() => {
        setAudioElement({ audio, type: 'url' });
        setIsPlaying(true);
      }).catch(err => {
        console.error('Error playing audio:', err);
        generateFallbackMusic();
      });
      
    } catch (err) {
      console.error('Error with audio playback:', err);
      generateFallbackMusic();
    }
  };

  const stopAudio = () => {
    if (audioElement) {
      try {
        if (audioElement.type === 'url' && audioElement.audio) {
          audioElement.audio.pause();
          audioElement.audio.currentTime = 0;
        } else if (audioElement.oscillators) {
          audioElement.oscillators.forEach(osc => {
            try {
              osc.stop();
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
    setIsPlaying(false);
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
      <div className="text-center mb-5">
        <h1 className="gradient-title display-4 floating">🧘‍♀️ Medita Conmigo</h1>
        <p className="text-light mb-4" style={{ fontSize: '1.1rem', fontWeight: '300' }}>
          Encuentra tu paz interior con sesiones guiadas
        </p>
      </div>

      {!currentSession ? (
        <div>
          {/* Music Background Selection */}
          <div className="modern-card mb-5 p-4">
            <h6 className="text-center mb-4" style={{ color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: '600' }}>
              🎵 Ambiente de Meditación
            </h6>
            <div className="d-flex justify-content-center gap-4">
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
                <label className="form-check-label text-light" htmlFor="silencio">
                  🤫 Silencio Natural
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
                <label className="form-check-label text-light" htmlFor="musica">
                  🎼 Sonidos Relajantes
                </label>
              </div>
            </div>
            {backgroundMusic === 'musica' && (
              <div className="text-center mt-3">
                <small className="text-light" style={{ opacity: 0.8 }}>
                  Se generarán sonidos armoniosos para tu meditación
                </small>
              </div>
            )}
          </div>

          {/* Meditation Types */}
          <Row className="g-4">
            {meditationTypes.map((meditation, index) => (
              <Col md={6} lg={3} key={index}>
                <div 
                  className="meditation-card h-100 d-flex flex-column p-4"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-center mb-4">
                    <div className="floating" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                      {index === 0 ? '🫁' : index === 1 ? '🤗' : index === 2 ? '🧠' : '🙏'}
                    </div>
                    <h5 className="text-light mb-3" style={{ fontWeight: '600' }}>{meditation.name}</h5>
                    <p className="text-light mb-3" style={{ opacity: 0.8, fontSize: '0.95rem' }}>
                      {meditation.description}
                    </p>
                    <div className="badge-modern mb-3">
                      ⏱️ {meditation.duration} min
                    </div>
                  </div>
                  <button 
                    className="btn-modern btn-success-modern mt-auto"
                    onClick={() => startMeditation(meditation)}
                  >
                    <span className="me-2">Comenzar</span>
                    <span>✨</span>
                  </button>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <div className="modern-card text-center p-5">
          <h3 className="gradient-title mb-4" style={{ fontSize: '2rem' }}>
            {currentSession.name}
          </h3>
          
          <div className="mb-5">
            <div 
              className="display-2 mb-3 floating" 
              style={{ 
                background: 'var(--success-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: '700'
              }}
            >
              {formatTime(timer)}
            </div>
            {isActive && (
              <div className="badge-modern bg-success text-white">
                ▶️ En progreso
              </div>
            )}
            {!isActive && timer === 0 && (
              <div className="badge-modern bg-secondary text-white">
                ✅ Completado
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {currentSession && (
            <div className="mb-4">
              <div className="progress-modern">
                <div 
                  className="progress-bar-modern"
                  style={{ 
                    width: `${((currentSession.duration * 60 - timer) / (currentSession.duration * 60)) * 100}%`
                  }}
                ></div>
              </div>
              <small className="text-light mt-2 d-block" style={{ opacity: 0.7 }}>
                Progreso de la sesión
              </small>
            </div>
          )}

          {guidance && (
            <div className="modern-card mb-5 p-4">
              <div className="text-center mb-3">
                <span style={{ fontSize: '2rem' }}>🌟</span>
              </div>
              <p className="text-light" style={{ 
                whiteSpace: 'pre-line', 
                lineHeight: '1.6',
                fontSize: '1.1rem'
              }}>
                {guidance}
              </p>
            </div>
          )}

          {currentTrack && (
            <div className="alert-modern mb-4">
              <div className="d-flex align-items-center justify-content-center flex-wrap">
                <span className="me-2" style={{ fontSize: '1.5rem' }}>🎵</span>
                <strong className="me-2 text-light">Reproduciendo: </strong>
                <span className="text-light">{currentTrack}</span>
                {isPlaying && <span className="ms-2 badge-modern bg-success text-white">▶️ Activo</span>}
              </div>
              {audioError && (
                <div className="text-center mt-2">
                  <small className="text-warning">{audioError}</small>
                </div>
              )}
            </div>
          )}

          <div className="d-flex justify-content-center gap-3">
            {isActive ? (
              <button 
                className="btn-modern btn-secondary-modern"
                onClick={stopMeditation}
              >
                <span className="me-2">Terminar Sesión</span>
                <span>🛑</span>
              </button>
            ) : (
              <button 
                className="btn-modern"
                onClick={() => {
                  setCurrentSession(null);
                  setGuidance('');
                }}
              >
                <span className="me-2">Volver al Menú</span>
                <span>🏠</span>
              </button>
            )}
          </div>
        </div>
      )}
    </Container>
  );
}

export default MeditaConmigo;
