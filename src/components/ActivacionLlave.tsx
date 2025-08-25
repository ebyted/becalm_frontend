
import '../App.css';

import activacionIcon from '../assets/react.svg';

export function ActivacionLlave() {
  return (
    <div className="glass-card activacion-llave">
      <img src={activacionIcon} alt="Activación de la llave" style={{width:'48px',height:'48px',marginBottom:'0.5em'}} />
      <h2>Activación de la llave</h2>
      <form className="activacion-form">
        <label>Nombre completo
          <input type="text" name="nombre" maxLength={60} required />
        </label>
        <label>Día de nacimiento
          <input type="number" name="dia" min={1} max={31} required />
        </label>
        <label>Mes de nacimiento
          <input type="text" name="mes" maxLength={15} required />
        </label>
        <button type="submit" className="btn-main">Activar llave</button>
      </form>
      <div className="mensaje-canalizado" style={{marginTop:'2em',fontStyle:'italic',color:'#7B8057'}}>
        {/* Aquí se mostrará el mensaje canalizado */}
        "Bienvenido a Becalm. Tu templo ya te reconoce."
      </div>
    </div>
  );
}
