

import { useState } from 'react';
import activacionIcon from './assets/react.svg';
import diarioIcon from './assets/02diario_vivo.svg';
import dialogoIcon from './assets/01dialogo_sagrado.svg';
import mensajesIcon from './assets/05mensaje_del_alma.svg';
import ritualIcon from './assets/04ritual_diario.svg';
import mapaIcon from './assets/03mapa_interior.svg';
import silencioIcon from './assets/07silencio_sagrado.svg';
import meditaIcon from './assets/06medita_conmigo.svg';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Onboarding } from './components/Onboarding';
import { ActivacionLlave } from './components/ActivacionLlave';
import { DiarioVivo } from './components/DiarioVivo';
import { MeditaConmigo } from './components/MeditaConmigo';
import { MensajesAlma } from './components/MensajesAlma';
import { RitualDiario } from './components/RitualDiario';
import { MapaInterior } from './components/MapaInterior';
import { SilencioSagrado } from './components/SilencioSagrado';
import './App.css';
import { SacredDialog } from './components/SacredDialog';

function Login({ onLogin }: { onLogin: () => void }) {
  const [guest, setGuest] = useState(false);
  return (
    <div className="login glass-card">
      <h1>BECALM</h1>
      <p>Tu santuario digital para el crecimiento interior</p>
      <button onClick={onLogin}>Entrar</button>
      <button onClick={() => { setGuest(true); onLogin(); }}>Entrar como invitado</button>
      {guest && <div className="guest-msg">Acceso como invitado</div>}
    </div>
  );
}


function Navbar() {
  const [open, setOpen] = useState(false);
  const iconStyle = { width: '28px', height: '28px', verticalAlign: 'middle', marginRight: '0.5em' };
  return (
    <nav className="navbar glass-card" style={{position:'relative',padding:'0.7em 1em',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
      <span style={{fontWeight:'bold',fontSize:'1.3em',color:'#7B8057'}}>BECALM</span>
      <button onClick={() => setOpen(!open)} style={{background:'none',border:'none',cursor:'pointer',padding:0}} aria-label="Menú">
        <svg width="32" height="32" viewBox="0 0 32 32"><rect y="7" width="32" height="3" rx="2" fill="#7B8057"/><rect y="14" width="32" height="3" rx="2" fill="#7B8057"/><rect y="21" width="32" height="3" rx="2" fill="#7B8057"/></svg>
      </button>
      {open && (
        <div style={{position:'absolute',top:'100%',right:0,zIndex:10,background:'#FFFFEF',boxShadow:'0 4px 24px #7B805733',borderRadius:'0 0 16px 16px',padding:'1em 0.5em',minWidth:'220px'}}>
          <Link to="/" onClick={()=>setOpen(false)} style={{display:'block',padding:'0.7em 1em',color:'#7B8057',fontWeight:'bold'}}>Inicio</Link>
          <Link to="/onboarding" onClick={()=>setOpen(false)} style={{display:'block',padding:'0.7em 1em',color:'#7B8057',fontWeight:'bold'}}>Onboarding</Link>
          <Link to="/activacion" onClick={()=>setOpen(false)} style={{display:'flex',alignItems:'center',padding:'0.7em 1em'}}><img src={activacionIcon} alt="Activación" style={iconStyle}/>Activación de la llave</Link>
          <Link to="/dialogo" onClick={()=>setOpen(false)} style={{display:'flex',alignItems:'center',padding:'0.7em 1em'}}><img src={dialogoIcon} alt="Diálogo" style={iconStyle}/>Diálogo Sagrado</Link>
          <Link to="/diario" onClick={()=>setOpen(false)} style={{display:'flex',alignItems:'center',padding:'0.7em 1em'}}><img src={diarioIcon} alt="Diario Vivo" style={iconStyle}/>Diario Vivo</Link>
          <Link to="/medita" onClick={()=>setOpen(false)} style={{display:'flex',alignItems:'center',padding:'0.7em 1em'}}><img src={meditaIcon} alt="Medita Conmigo" style={iconStyle}/>Medita Conmigo</Link>
          <Link to="/mensajes" onClick={()=>setOpen(false)} style={{display:'flex',alignItems:'center',padding:'0.7em 1em'}}><img src={mensajesIcon} alt="Mensajes del Alma" style={iconStyle}/>Mensajes del Alma</Link>
          <Link to="/ritual" onClick={()=>setOpen(false)} style={{display:'flex',alignItems:'center',padding:'0.7em 1em'}}><img src={ritualIcon} alt="Ritual Diario" style={iconStyle}/>Ritual Diario</Link>
          <Link to="/mapa" onClick={()=>setOpen(false)} style={{display:'flex',alignItems:'center',padding:'0.7em 1em'}}><img src={mapaIcon} alt="Mapa Interior" style={iconStyle}/>Mapa Interior</Link>
          <Link to="/silencio" onClick={()=>setOpen(false)} style={{display:'flex',alignItems:'center',padding:'0.7em 1em'}}><img src={silencioIcon} alt="Silencio Sagrado" style={iconStyle}/>Silencio Sagrado</Link>
        </div>
      )}
    </nav>
  );
}
function HomeMenu() {
  const navigate = useNavigate();
  const cardStyle = {
    background:'#FFFFEF',
    boxShadow:'0 4px 24px #7B805733',
    borderRadius:'18px',
    padding:'1.5em',
    margin:'1em',
    textAlign:'center' as const,
    cursor:'pointer',
    transition:'transform 0.15s',
    fontWeight:'bold',
    color:'#7B8057',
    fontSize:'1.1em',
    display:'flex',
    flexDirection:'column' as const,
    alignItems:'center' as const,
    gap:'0.7em',
    width:'180px',
    minHeight:'120px',
    justifyContent:'center' as const
  };
  const iconStyle = { width: '48px', height: '48px', marginBottom: '0.5em' };
  return (
    <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:'1em',margin:'2em auto',maxWidth:'800px'}}>
      <div style={cardStyle} onClick={()=>navigate('/activacion')}><img src={activacionIcon} alt="Activación" style={iconStyle}/>Activación de la llave</div>
      <div style={cardStyle} onClick={()=>navigate('/dialogo')}><img src={dialogoIcon} alt="Diálogo" style={iconStyle}/>Diálogo Sagrado</div>
      <div style={cardStyle} onClick={()=>navigate('/diario')}><img src={diarioIcon} alt="Diario Vivo" style={iconStyle}/>Diario Vivo</div>
      <div style={cardStyle} onClick={()=>navigate('/medita')}><img src={meditaIcon} alt="Medita Conmigo" style={iconStyle}/>Medita Conmigo</div>
      <div style={cardStyle} onClick={()=>navigate('/mensajes')}><img src={mensajesIcon} alt="Mensajes del Alma" style={iconStyle}/>Mensajes del Alma</div>
      <div style={cardStyle} onClick={()=>navigate('/ritual')}><img src={ritualIcon} alt="Ritual Diario" style={iconStyle}/>Ritual Diario</div>
      <div style={cardStyle} onClick={()=>navigate('/mapa')}><img src={mapaIcon} alt="Mapa Interior" style={iconStyle}/>Mapa Interior</div>
      <div style={cardStyle} onClick={()=>navigate('/silencio')}><img src={silencioIcon} alt="Silencio Sagrado" style={iconStyle}/>Silencio Sagrado</div>
    </div>
  );
}

function App() {
  const [logged, setLogged] = useState(false);
  if (!logged) return <Login onLogin={() => setLogged(true)} />;
  return (
    <BrowserRouter>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<HomeMenu />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/activacion" element={<ActivacionLlave />} />
          <Route path="/dialogo" element={<SacredDialog />} />
          <Route path="/diario" element={<DiarioVivo />} />
          <Route path="/medita" element={<MeditaConmigo />} />
          <Route path="/mensajes" element={<MensajesAlma />} />
          <Route path="/ritual" element={<RitualDiario />} />
          <Route path="/mapa" element={<MapaInterior />} />
          <Route path="/silencio" element={<SilencioSagrado />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
