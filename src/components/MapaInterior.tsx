
import '../App.css';

import mapaIcon from '../assets/03mapa_interior.svg';

export function MapaInterior() {
  return (
    <div className="glass-card mapa-interior">
      <img src={mapaIcon} alt="Mapa Interior" style={{width:'48px',height:'48px',marginBottom:'0.5em'}} />
      <h2>Mapa Interior</h2>
      <div className="constelacion" style={{margin:'2em 0'}}>
        {/* Constelación visual de frases y símbolos */}
        <div className="punto-luminoso" style={{margin:'1em',color:'#7B8057'}}>“Hoy tu energía dejó una huella suave.”</div>
        <div className="punto-luminoso" style={{margin:'1em',color:'#7B8057'}}>“La espiral de tu viaje se ilumina.”</div>
        <div className="punto-luminoso" style={{margin:'1em',color:'#7B8057'}}>“Un símbolo se repite: 🌿”</div>
      </div>
    </div>
  );
}
