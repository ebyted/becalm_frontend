// src/utils/deviceDetector.js
export const isMobileDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // Detectar móviles específicos
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
  
  // También verificar el ancho de pantalla
  const screenWidth = window.innerWidth;
  const isMobileWidth = screenWidth <= 768;
  
  // Verificar touch support
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  return mobileRegex.test(userAgent) || (isMobileWidth && isTouchDevice);
};

export const getDeviceInfo = () => {
  return {
    isMobile: isMobileDevice(),
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    userAgent: navigator.userAgent
  };
};