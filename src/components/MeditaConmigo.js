import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import apiService from '../config/api'; // ✅ CAMBIAR: API_CONFIG por apiService
import TopNavigation from './TTopNavigation'; // ✅ CAMBIAR: topNavigation por TopNavigation
import '../styles/FixOverlay.css';

function MeditaConmigo({ onLogout }) {
  const [currentSession, setCurrentSession] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [guidance, setGuidance] = useState('');
  const [backgroundMusic, setBackgroundMusic] = useState('silencio');
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
    setTimer(meditation.duration * 60);
    setIsActive(true);

    try {
      // ✅ CAMBIAR: Usar apiService
      const response = await apiService.post('/v1/generate', {
        prompt: `Crea una guía de meditación para ${meditation.name} de ${meditation.duration} minutos. ${meditation.description}`,
        mode: 'meditacion'
      });

      if (response && response.text) {
        setGuidance(response.text);
      } else {
        setDefaultGuidance(meditation);
      }

      if (backgroundMusic === 'musica') {
        await getBackgroundMusic();
      }
    } catch (err) {
      console.error('Error getting meditation guidance:', err);
      setDefaultGuidance(meditation);
      
      if (backgroundMusic === 'musica') {
        generateFallbackMusic();
      }
    }
  };

  const setDefaultGuidance = (meditation) => {
    setGuidance(`Bienvenido a tu sesión de ${meditation.name}. 

Encuentra una posición cómoda, ya sea sentado o acostado. Cierra los ojos suavemente y permite que tu mente se relaje. 

${meditation.description}

Respira naturalmente y permite que cada exhalación te lleve más profundo hacia un estado de calma y serenidad.`);
  };

  const stopMeditation = () => {
    setIsActive(false);
    setTimer(0);
    stopAudio();
  };

  const getBackgroundMusic = async () => {
    try {
      const response = await apiService.post('/audio/meditation', {
        meditation_type: currentSession?.name || 'relajacion',
        duration: currentSession?.duration || 10,
        style: 'ambient'
      });

      if (response && response.tracks && response.tracks.length > 0) {
        const track = response.tracks[0];
        setCurrentTrack(track.name || 'Música de Meditación');
        
        if (track.url) {
          playAudioTrack(track.url);
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
    setCurrentTrack('Sonidos Relajantes');
    try {
      const prefersSilence = localStorage.getItem('prefer_silence') === 'true';
      if (prefersSilence) {
        setCurrentTrack('Modo Silencioso');
        setIsPlaying(false);
        setAudioError('');
        return;
      }
      
      generateRelaxingSounds();
    } catch (err) {
      console.error('Error al configurar audio:', err);
      setAudioError('Audio no soportado en este navegador');
      setCurrentTrack('Modo Silencioso');
    }
  };

  const generateRelaxingSounds = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filterNode = audioContext.createBiquadFilter();
      
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(400, audioContext.currentTime);
      filterNode.Q.setValueAtTime(1, audioContext.currentTime);
      
      oscillator.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(261.63, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 2);
      
      const lfo = audioContext.createOscillator();
      const lfoGain = audioContext.createGain();
      lfo.frequency.setValueAtTime(0.1, audioContext.currentTime);
      lfoGain.gain.setValueAtTime(2, audioContext.currentTime);
      
      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);
      
      oscillator.start();
      lfo.start();
      
      setAudioElement({ 
        oscillators: [oscillator, lfo], 
        gainNodes: [gainNode, lfoGain], 
        context: audioContext 
      });
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
          audioElement.audio.src = '';
        } else if (audioElement.oscillators) {
          audioElement.gainNodes?.forEach(gainNode => {
            try {
              gainNode.gain.linearRampToValueAtTime(0, audioElement.context.currentTime + 0.5);
            } catch (e) {}
          });
          
          setTimeout(() => {
            audioElement.oscillators?.forEach(osc => {
              try {
                osc.stop();
              } catch (e) {}
            });
          }, 600);
        }
        
        if (audioElement.context && audioElement.context.state !== 'closed') {
          setTimeout(() => {
            try {
              audioElement.context.close();
            } catch (e) {}
          }, 700);
        }
      } catch (err) {
        console.log('Audio ya detenido o error al detener:', err);
      }
      setAudioElement(null);
    }
    setIsPlaying(false);
    setAudioError('');
  };

  useEffect(() => {
    let interval = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    } else if (timer === 0 && isActive) {
      setIsActive(false);
      setGuidance(prev => prev + '\n\n✨ Tu sesión de meditación ha terminado. Toma un momento para agradecer este tiempo que te has dedicado. Respira profundo y vuelve suavemente al presente.');
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* ✅ CAMBIAR: <topNavigation> por <TopNavigation> */}
      <TopNavigation onLogout={onLogout} />
      <Container fluid className="py-4">
        <div className="text-center mb-5">
          <div className="medita-container">
            <h1 className="gradient-title display-4 floating no-triple-select">
              🧘‍♀️ Medita Conmigo
            </h1>
            <p className="text-light mb-4" style={{ 
              fontSize: '1.1rem', 
              fontWeight: '300',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' 
            }}>
              Encuentra paz interior a través de la meditación
            </p>
          </div>
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
                  <div className="mt-2">
                    <button 
                      className="btn-glass-mini me-2"
                      onClick={() => {
                        const currentPreference = localStorage.getItem('prefer_silence') === 'true';
                        localStorage.setItem('prefer_silence', (!currentPreference).toString());
                      }}
                      title={localStorage.getItem('prefer_silence') === 'true' ? 'Habilitar sonidos sintéticos' : 'Usar solo silencio'}
                    >
                      {localStorage.getItem('prefer_silence') === 'true' ? '🔊' : '🤫'}
                    </button>
                    <small className="text-light" style={{ opacity: 0.6, fontSize: '0.8rem' }}>
                      {localStorage.getItem('prefer_silence') === 'true' ? 'Solo silencio' : 'Con sonidos'}
                    </small>
                  </div>
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
    </>
  );
}

export default MeditaConmigo;
