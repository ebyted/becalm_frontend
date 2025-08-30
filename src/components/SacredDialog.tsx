import React, { useState } from 'react';
import dialogoIcon from '../assets/01dialogo_sagrado.svg';
import '../App.css';

export function SacredDialog() {
  const [messages, setMessages] = useState([
    { from: 'guia', text: 'Este es tu espacio de reencuentro interior. Escribe lo que tu alma quiera expresar.' }
  ]);
  const [input, setInput] = useState('');

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8034';
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { from: 'usuario', text: input }]);
    // Obtener datos del usuario desde localStorage
    let userData: Record<string, any> = {};
    try {
      userData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
    } catch {}
    // Construir payload con los campos requeridos
    const payload = {
      mensaje: input,
      nombre: userData['nombre'] || '',
      fecha_nacimiento: userData['fecha_nacimiento'] || userData['nacimiento'] || '',
      hora_nacimiento: userData['hora_nacimiento'] || userData['hora'] || '',
      lugar_nacimiento: userData['lugar_nacimiento'] || userData['lugar'] || ''
    };
    try {
      const res = await fetch(`${BACKEND_URL}/dialogo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setMessages(msgs => [...msgs, { from: 'guia', text: data.respuesta || 'Respuesta recibida.' }]);
    } catch (err) {
      setMessages(msgs => [...msgs, { from: 'guia', text: 'Error al conectar con el backend.' }]);
    }
    setInput('');
  };

  return (
    <div className="glass-card dialogo-sagrado" style={{
      maxWidth: '480px',
      padding: '2em',
      overflowY: 'auto',
      boxSizing: 'border-box'
    }}>
      <img src={dialogoIcon} alt="Diálogo Sagrado" style={{width:'48px',height:'48px',marginBottom:'0.5em'}} />
      <h2 style={{fontSize:'2em'}}>Diálogo Sagrado</h2>
      <div className="mensajes" style={{margin:'1.5em 0',minHeight:'120px'}}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            textAlign: msg.from === 'usuario' ? 'right' : 'left',
            color: msg.from === 'usuario' ? '#4A4D34' : '#7B8057',
            fontStyle: msg.from === 'guia' ? 'italic' : 'normal',
            marginBottom: '0.7em',
            background: msg.from === 'usuario' ? 'rgba(123,128,87,0.08)' : 'transparent',
            borderRadius: '8px',
            padding: '0.5em 0.8em',
            display: 'inline-block',
            maxWidth: '90%'
          }}>{msg.text}</div>
        ))}
      </div>
      <form onSubmit={handleSend} style={{
        display: 'flex',
        gap: '0.7em',
        flexWrap: 'wrap',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Escribe aquí..."
          style={{
            flex: '1 1 180px',
            fontSize: '1.15em',
            padding: '0.8em',
            borderRadius: '10px',
            minWidth: '0',
            maxWidth: '100%'
          }}
        />
        <button
          type="submit"
          className="btn-main"
          style={{
            fontSize: '1.15em',
            padding: '0.8em 1.5em',
            borderRadius: '10px',
            flex: '0 0 auto',
            maxWidth: '100%'
          }}
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
