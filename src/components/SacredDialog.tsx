import React, { useState } from 'react';
import dialogoIcon from '../assets/01dialogo_sagrado.svg';
import '../App.css';

export function SacredDialog() {
  // Cargar historial de mensajes desde localStorage o iniciar con el mensaje inicial
  const initialMessages = (() => {
    try {
      const saved = localStorage.getItem('dialogoSagradoChat');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { from: 'guia', text: 'Este es tu espacio de reencuentro interior. Escribe lo que tu alma quiera expresar.' }
    ];
  })();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8034';
  const handleSend = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!input.trim()) return;
  const newMessages = [...messages, { from: 'usuario', text: input }];
  setMessages(newMessages);
  localStorage.setItem('dialogoSagradoChat', JSON.stringify(newMessages));
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
      setMessages((msgs: any[]) => {
        // Agrega la respuesta del backend como un nuevo mensaje
        const updated = [...msgs, { from: 'guia', text: data.respuesta || 'Respuesta recibida.' }];
        localStorage.setItem('dialogoSagradoChat', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      setMessages((msgs: any[]) => {
        const updated = [...msgs, { from: 'guia', text: 'Error al conectar con el backend.' }];
        localStorage.setItem('dialogoSagradoChat', JSON.stringify(updated));
        return updated;
      });
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
      <div className="mensajes" style={{margin:'1.5em 0',minHeight:'120px',display:'flex',flexDirection:'column',gap:'0.5em'}}>
        {messages.map((msg: any, i: number) => (
          <div
            key={i}
            style={{
              alignSelf: msg.from === 'usuario' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              background: msg.from === 'usuario' ? 'rgba(123,128,87,0.08)' : 'transparent',
              color: msg.from === 'usuario' ? '#4A4D34' : '#7B8057',
              fontStyle: msg.from === 'guia' ? 'italic' : 'normal',
              borderRadius: msg.from === 'usuario' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              padding: '0.7em 1em',
              marginBottom: '0.1em',
              boxShadow: msg.from === 'usuario' ? '0 2px 8px #7B805733' : 'none',
              transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
              wordBreak: 'break-word',
              position: 'relative',
              animation: 'fadeInChat 0.5s',
            }}
          >
            {msg.text}
          </div>
        ))}
        <style>{`
          @keyframes fadeInChat {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
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
