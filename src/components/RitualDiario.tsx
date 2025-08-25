import React from 'react';
import '../App.css';

import ritualIcon from '../assets/04ritual_diario.svg';

export function RitualDiario() {
  return (
    <div className="glass-card ritual-diario">
      <img src={ritualIcon} alt="Ritual Diario" style={{width:'48px',height:'48px',marginBottom:'0.5em'}} />
      <h2>Ritual Diario</h2>
      <div className="ritual" style={{margin:'2em 0',fontStyle:'italic',color:'#7B8057'}}>
        {/* Ritual canalizado */}
        “Inhala en 4, retén en 4, exhala en 4. Hazlo 3 veces.”
      </div>
      <div className="afirmacion" style={{margin:'1em 0',color:'#4A4D34'}}>
        “Hoy camino con suavidad. Confío en mi ritmo.”
      </div>
      <div className="gesto" style={{margin:'1em 0',color:'#4A4D34'}}>
        “Pon una mano en tu pecho, otra en tu vientre. Respira ahí.”
      </div>
    </div>
  );
}
