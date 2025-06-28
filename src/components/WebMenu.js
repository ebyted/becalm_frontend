// src/components/WebMenu.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';

const WebMenu = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ... (usar el código del TopNavigation anterior, pero más compacto)
  
  const menuItems = [
    { name: 'Diálogo Conmigo', path: '/', emoji: '🕊️' },
    { name: 'Diario Vivo', path: '/diario-vivo', emoji: '📖' },
    { name: 'Medita Conmigo', path: '/medita-conmigo', emoji: '🧘‍♀️' },
    { name: 'Mensajes del Alma', path: '/mensajes-del-alma', emoji: '💌' },
    { name: 'Ritual Diario', path: '/ritual-diario', emoji: '🌅' },
    { name: 'Mapa Interior', path: '/mapa-interior', emoji: '🗺️' },
    { name: 'Silencio Sagrado', path: '/silencio-sagrado', emoji: '🤫' }
  ];

  // ... resto del código igual al TopNavigation anterior
  
  return (
    <div style={{ /* estilos web */ }}>
      {/* HTML del menú web */}
    </div>
  );
};

export default WebMenu;