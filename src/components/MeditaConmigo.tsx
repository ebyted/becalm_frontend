
import '../App.css';

import meditaIcon from '../assets/02diario_vivo.svg';

export function MeditaConmigo() {
  return (
    <div className="glass-card medita-conmigo">
      <img src={meditaIcon} alt="Medita Conmigo" style={{width:'48px',height:'48px',marginBottom:'0.5em'}} />
      <h2>Medita Conmigo</h2>
      <div className="mensaje-bienvenida" style={{margin:'2em 0',fontStyle:'italic',color:'#7B8057'}}>
        Hoy tienes la oportunidad de volver a ti. Elige cómo quieres respirar este momento: cada meditación es una puerta distinta… Ninguna es mejor que otra. Solo distinta. Escoge la que resuene contigo hoy.
      </div>
      <div className="opciones-meditacion" style={{display:'flex',flexWrap:'wrap',gap:'1em',justifyContent:'center'}}>
        <button className="btn-main">Respira conmigo</button>
        <button className="btn-main">Activa tu centro</button>
        <button className="btn-main">Acaricia tu sombra</button>
        <button className="btn-main">Recuerda tu raíz</button>
        <button className="btn-main">Silencio guiado</button>
      </div>
    </div>
  );
}
