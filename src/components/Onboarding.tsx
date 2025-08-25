
import React, { useState } from 'react';
import '../App.css';

export function Onboarding() {
  const [form, setForm] = useState({
    nombre: '',
    ap: '',
    am: '',
    fechaNac: '',
    horaNac: '',
    ciudadNac: '',
    paisNac: '',
    genero: '',
    email: '',
    telefono: '',
    intereses: '',
    objetivo: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [tab, setTab] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const nextTab = () => setTab((t) => Math.min(t + 1, 2));
  const prevTab = () => setTab((t) => Math.max(t - 1, 0));

  return (
    <div className="glass-card">
      {!submitted ? (
        <form className="onboarding-form" onSubmit={handleSubmit}>
          <h2>Onboarding</h2>
          <div className="onboarding-tabs">
            <button type="button" className={tab === 0 ? 'active-tab' : ''} onClick={() => setTab(0)}>Datos personales</button>
            <button type="button" className={tab === 1 ? 'active-tab' : ''} onClick={() => setTab(1)}>Nacimiento</button>
            <button type="button" className={tab === 2 ? 'active-tab' : ''} onClick={() => setTab(2)}>Intereses y objetivo</button>
          </div>
          {tab === 0 && (
            <>
              <input name="nombre" placeholder="Nombre(s)" value={form.nombre} onChange={handleChange} required maxLength={32} />
              <input name="ap" placeholder="Apellido Paterno" value={form.ap} onChange={handleChange} required maxLength={32} />
              <input name="am" placeholder="Apellido Materno" value={form.am} onChange={handleChange} required maxLength={32} />
              <select name="genero" value={form.genero} onChange={handleChange} required>
                <option value="">Género</option>
                <option value="femenino">Femenino</option>
                <option value="masculino">Masculino</option>
                <option value="otro">Otro</option>
              </select>
              <input name="email" type="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} maxLength={32} />
              <input name="telefono" type="tel" placeholder="Teléfono" value={form.telefono} onChange={handleChange} maxLength={16} />
            </>
          )}
          {tab === 1 && (
            <>
              <input name="fechaNac" type="date" placeholder="Fecha de nacimiento" value={form.fechaNac} onChange={handleChange} required />
              <input name="horaNac" type="time" placeholder="Hora de nacimiento" value={form.horaNac} onChange={handleChange} />
              <input name="ciudadNac" placeholder="Ciudad de nacimiento" value={form.ciudadNac} onChange={handleChange} required maxLength={32} />
              <input name="paisNac" placeholder="País de nacimiento" value={form.paisNac} onChange={handleChange} maxLength={32} />
            </>
          )}
          {tab === 2 && (
            <>
              <textarea name="intereses" placeholder="Intereses personales (meditación, mindfulness, etc.)" value={form.intereses} onChange={handleChange} maxLength={120} />
              <textarea name="objetivo" placeholder="¿Cuál es tu objetivo principal en BECALM?" value={form.objetivo} onChange={handleChange} maxLength={120} />
            </>
          )}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5em', marginTop: '1em' }}>
            {tab > 0 && <button type="button" onClick={prevTab}>Anterior</button>}
            {tab < 2 && <button type="button" onClick={nextTab}>Siguiente</button>}
            {tab === 2 && <button type="submit">Comenzar</button>}
          </div>
        </form>
      ) : (
        <div className="onboarding-success">
          <h3>¡Bienvenido/a, {form.nombre}!</h3>
          <p>Tu perfil ha sido creado para una experiencia personalizada en BECALM.</p>
        </div>
      )}
    </div>
  );
}
