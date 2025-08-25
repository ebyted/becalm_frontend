
import '../App.css';

import diarioIcon from '../assets/02diario_vivo.svg';

export function DiarioVivo() {
  return (
    <div className="glass-card diario-vivo" style={{maxWidth:'480px', padding:'2em', overflowY:'auto'}}>
      <img src={diarioIcon} alt="Diario Vivo" style={{width:'48px',height:'48px',marginBottom:'0.5em'}} />
      <h2 style={{fontSize:'2em'}}>Diario Vivo</h2>
      <div className="mensaje-activador" style={{margin:'2em 0',fontStyle:'italic',color:'#7B8057',fontSize:'1.25em'}}>
        {/* Pregunta activadora diaria */}
        “¿Qué parte de ti pide ser vista hoy, pero tú sueles ignorar?”
      </div>
      <form className="diario-form" style={{display:'flex',flexDirection:'column',gap:'1.5em'}}>
        <label style={{fontSize:'1.15em'}}>Hoy, lo que más sentí fue...
          <input type="text" name="emocion" maxLength={60} style={{fontSize:'1.15em',padding:'0.8em',borderRadius:'10px',marginTop:'0.5em'}} />
        </label>
        <label style={{fontSize:'1.15em'}}>Un pensamiento que me visitó varias veces fue...
          <input type="text" name="mente" maxLength={60} style={{fontSize:'1.15em',padding:'0.8em',borderRadius:'10px',marginTop:'0.5em'}} />
        </label>
        <label style={{fontSize:'1.15em'}}>Mi cuerpo me habló a través de...
          <input type="text" name="cuerpo" maxLength={60} style={{fontSize:'1.15em',padding:'0.8em',borderRadius:'10px',marginTop:'0.5em'}} />
        </label>
        <label style={{fontSize:'1.15em'}}>¿Quieres escribir algo más?
          <textarea name="extra" rows={5} maxLength={200} style={{fontSize:'1.15em',padding:'0.8em',borderRadius:'10px',marginTop:'0.5em'}} />
        </label>
        <button type="submit" className="btn-main" style={{fontSize:'1.15em',padding:'0.8em 1.5em',borderRadius:'10px',marginTop:'1em'}}>Guardar entrada</button>
      </form>
      <div className="reflexion-mensual" style={{marginTop:'2em',color:'#4A4D34',fontSize:'1.15em'}}>
        {/* Reflexión mensual */}
        “¿Qué frases, emociones o símbolos se repitieron este mes?”
      </div>
    </div>
  );
}
