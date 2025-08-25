import React from 'react';
import '../App.css';

import mensajeIcon from '../assets/05mensaje_del_alma.svg';

export function MensajesAlma() {
  return (
    <div className="glass-card mensajes-alma">
      <img src={mensajeIcon} alt="Mensajes del Alma" style={{width:'48px',height:'48px',marginBottom:'0.5em'}} />
      <h2>Mensajes del Alma</h2>
      <div className="mensaje-diario" style={{margin:'2em 0',fontStyle:'italic',color:'#7B8057'}}>
        {/* Mensaje canalizado diario */}
        "Hoy tu alma recuerda lo que ya es luz."
      </div>
      <button className="btn-main">Pedir visión</button>
      <div className="microoraculo" style={{marginTop:'2em',color:'#4A4D34'}}>
        {/* Microoráculo: símbolo, palabra clave, mantra */}
        Símbolo: 🌿 Palabra clave: "Presencia" Mantra: "Soy aquí y ahora"
      </div>
    </div>
  );
}
