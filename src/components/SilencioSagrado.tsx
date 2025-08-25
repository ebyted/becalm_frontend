import { useState, useEffect } from 'react';
import '../App.css';

const tracks = [
  {
    name: 'Calm Meditation',
    src: 'https://cdn.pixabay.com/audio/2022/10/16/audio_12b6b1b7b7.mp3',
    author: 'Pixabay',
  },
  {
    name: 'Nature Forest',
    src: 'https://cdn.pixabay.com/audio/2022/03/15/audio_115b7b2b7b.mp3',
    author: 'Pixabay',
  },
  {
    name: 'Soft Piano',
    src: 'https://cdn.pixabay.com/audio/2022/10/16/audio_12b6b1b7b8.mp3',
    author: 'Pixabay',
  },
];

// ...existing code...


import silencioIcon from '../assets/07silencio_sagrado.svg';

export function SilencioSagrado() {
  const [selected, setSelected] = useState(tracks[0]);
  const [seconds, setSeconds] = useState(300); // 5 minutos
  const [running, setRunning] = useState(false);
  let timerRef: any = null;

  useEffect(() => {
    if (!running) {
      if (timerRef) clearTimeout(timerRef);
      return;
    }
    if (seconds === 0) {
      setRunning(false);
      return;
    }
    timerRef = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => { if (timerRef) clearTimeout(timerRef); };
  }, [running, seconds]);

  const format = (s: number) => `${Math.floor(s/60)}:${('0'+(s%60)).slice(-2)}`;

  return (
    <div className="glass-card silencio-sagrado">
      <img src={silencioIcon} alt="Silencio Sagrado" style={{width:'48px',height:'48px',marginBottom:'0.5em'}} />
      <h2>Silencio Sagrado</h2>
      <p>Este es tu espacio para conectar con el silencio interior. Respira profundo, relájate y permite que la quietud te acompañe unos minutos.</p>
      <div style={{marginTop: '2em', textAlign: 'center'}}>
        <span style={{fontSize: '2.5em', color: '#7B8057'}}>🧘‍♂️</span>
        <p style={{marginTop: '1em', color: '#4A4D34'}}>Puedes cerrar los ojos y simplemente estar presente.</p>
        <div style={{margin: '2em auto 1em auto', maxWidth: '340px'}}>
          <div style={{marginBottom: '1.2em', textAlign: 'center'}}>
            <svg width="90" height="90">
              <circle cx="45" cy="45" r="40" fill="#F8F0E2" stroke="#7B8057" strokeWidth="3" />
              <circle cx="45" cy="45" r="40" fill="none" stroke="#4A4D34" strokeWidth="5" strokeDasharray={2*Math.PI*40} strokeDashoffset={2*Math.PI*40*(1-seconds/300)} />
              <text x="50%" y="54%" textAnchor="middle" fontSize="1.3em" fill="#4A4D34">{format(seconds)}</text>
            </svg>
            <div style={{display: 'flex', justifyContent: 'center', gap: '0.7em', marginTop: '0.5em'}}>
              <button type="button" style={{background:'#7B8057',color:'#FFFFEF',border:'none',borderRadius:'50%',width:'32px',height:'32px',fontSize:'1em',cursor:'pointer'}} onClick={() => setRunning(true)} disabled={running}>▶</button>
              <button type="button" style={{background:'#7B8057',color:'#FFFFEF',border:'none',borderRadius:'50%',width:'32px',height:'32px',fontSize:'1em',cursor:'pointer'}} onClick={() => setRunning(false)} disabled={!running}>⏸</button>
              <button type="button" style={{background:'#4A4D34',color:'#FFD700',border:'none',borderRadius:'50%',width:'32px',height:'32px',fontSize:'1em',cursor:'pointer'}} onClick={() => { setSeconds(300); setRunning(false); }}>⟲</button>
            </div>
            <p style={{fontSize:'0.95em',color:'#7B8057',marginTop:'0.5em'}}>Temporizador de meditación (5 min)</p>
          </div>
          <select value={selected.name} onChange={e => setSelected(tracks.find(t => t.name === e.target.value) || tracks[0])} style={{width: '100%', padding: '0.5em', borderRadius: '8px', fontSize: '1em', marginBottom: '1em'}}>
            {tracks.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
          </select>
          <audio controls style={{width: '100%'}} src={selected.src} loop muted>
            Tu navegador no soporta audio.
          </audio>
          <div style={{marginTop: '0.5em', display: 'flex', justifyContent: 'center', gap: '1em'}}>
            <label style={{fontSize: '0.95em', color: '#7B8057'}}>
              <input type="checkbox" onChange={e => {
                const audio = document.querySelector('.silencio-sagrado audio') as HTMLAudioElement | null;
                if (audio) audio.muted = e.target.checked;
              }} defaultChecked /> Silenciar
            </label>
            <label style={{fontSize: '0.95em', color: '#7B8057'}}>
              Volumen
              <input type="range" min="0" max="1" step="0.01" defaultValue="1" style={{marginLeft: '0.5em'}} onChange={e => {
                const audio = document.querySelector('.silencio-sagrado audio') as HTMLAudioElement | null;
                if (audio) audio.volume = Number(e.target.value);
              }} />
            </label>
          </div>
          <p style={{fontSize: '0.95em', color: '#7B8057', marginTop: '0.5em'}}>Música ambiental: "{selected.name}" ({selected.author})</p>
        </div>
      </div>
    </div>
  );
}
