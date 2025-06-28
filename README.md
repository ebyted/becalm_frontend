# BeCalm Frontend

Aplicación frontend de React para BeCalm, una plataforma de bienestar mental y espiritual que integra con un backend de IA para proporcionar experiencias personalizadas.

## 🌟 Características

- **Diálogo Sagrado**: Chat interactivo con IA para reflexión personal
- **Diario Vivo**: Registro de pensamientos con insights automatizados
- **Medita Conmigo**: Sesiones de meditación guiada con temporizador
- **Mensajes del Alma**: Generación de mensajes inspiracionales personalizados
- **Ritual Diario**: Creación y seguimiento de rituales de bienestar
- **Mapa Interior**: Análisis del estado emocional con visualizaciones
- **Silencio Sagrado**: Sesiones de silencio con seguimiento de progreso

## 🚀 Instalación

### Prerrequisitos
- Node.js >= 14
- npm o yarn
- Backend API ejecutándose en http://localhost:8011

### Pasos de instalación

1. **Instalar dependencias**
```bash
npm install
```

2. **Configurar variables de entorno**
   - El archivo `.env` ya está configurado para apuntar al backend local
   - Modifica `REACT_APP_API_URL` si tu backend está en una URL diferente

3. **Iniciar la aplicación**
```bash
npm start
```

La aplicación se abrirá en http://localhost:3000

## 🔧 Configuración del Backend

Asegúrate de que el backend de la API esté ejecutándose en el puerto 8011. El backend debe tener los siguientes endpoints configurados:

- `POST /token` - Autenticación
- `POST /register` - Registro de usuarios
- `POST /dialogo_conmigo/message` - Chat con IA
- `GET /dialogo_conmigo/history` - Historial de conversaciones
- `POST /v1/generate` - Generación de contenido con IA

## 📁 Estructura del proyecto

```
src/
├── components/         # Componentes React
│   ├── Login.js       # Autenticación
│   ├── Menu.js        # Navegación lateral
│   ├── DialogoSagrado.js    # Chat con IA
│   ├── DiarioVivo.js        # Diario personal
│   ├── MeditaConmigo.js     # Sesiones de meditación
│   ├── MensajesDelAlma.js   # Mensajes inspiracionales
│   ├── RitualDiario.js      # Rituales de bienestar
│   ├── MapaInterior.js      # Mapa emocional
│   └── SilencioSagrado.js   # Sesiones de silencio
├── services/          # Servicios de API
│   └── authService.js # Manejo de autenticación
├── config/           # Configuración
│   └── api.js       # Configuración de endpoints
├── App.js           # Componente principal
└── index.js         # Punto de entrada
```

## 🔒 Autenticación

La aplicación requiere autenticación. Los usuarios pueden:
- Registrarse con usuario, contraseña y nombre completo (opcional)
- Iniciar sesión con credenciales existentes
- Los tokens se almacenan en localStorage y se incluyen automáticamente en las peticiones

## 🎨 Funcionalidades por Componente

### DialogoSagrado
- Chat en tiempo real con IA especializada en bienestar
- Historial de conversaciones persistente
- Respuestas contextuales y empáticas

### DiarioVivo
- Escritura de entradas personales
- Generación automática de reflexiones con IA
- Almacenamiento local de entradas

### MeditaConmigo
- Diferentes tipos de meditación (5-15 minutos)
- Temporizador con notificaciones
- Guías generadas dinámicamente

### MensajesDelAlma
- 6 categorías de mensajes (inspiración, fortaleza, paz, etc.)
- Generación personalizada con IA
- Función de guardado de mensajes favoritos

### RitualDiario
- Generación de rituales personalizados
- Sistema de progreso paso a paso
- Reflexiones post-ritual

### MapaInterior
- Análisis del estado emocional actual
- Visualización de balance emocional
- Insights personalizados y seguimiento semanal

### SilencioSagrado
- Sesiones de silencio temporizadas (3-20 minutos)
- Estadísticas de práctica
- Historial de sesiones

## 🛠️ Scripts disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm test` - Ejecuta las pruebas
- `npm run eject` - Expone la configuración de webpack (irreversible)

## 🔧 Personalización

Para personalizar la aplicación:

1. **Modificar endpoints**: Edita `src/config/api.js`
2. **Cambiar estilos**: Modifica `src/App.css` y archivos CSS de componentes
3. **Agregar funcionalidades**: Crea nuevos componentes en `src/components/`

## 🚨 Solución de problemas

### El backend no responde
- Verifica que el backend esté ejecutándose en el puerto correcto
- Revisa la configuración CORS en el backend
- Confirma que las variables de entorno estén configuradas

### Errores de autenticación
- Limpia localStorage: `localStorage.clear()`
- Verifica que las credenciales sean correctas
- Asegúrate de que el endpoint `/token` esté funcionando

### Problemas de conexión
- La aplicación funciona en modo offline con respuestas predeterminadas
- Revisa la consola del navegador para errores de red
- Verifica la configuración de `REACT_APP_API_URL` en `.env`

## 📝 Notas de desarrollo

- La aplicación usa React Hooks para el manejo de estado
- Bootstrap 5 para los estilos y componentes UI
- LocalStorage para persistencia de datos offline
- Manejo de errores con fallbacks para funcionalidad offline

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
