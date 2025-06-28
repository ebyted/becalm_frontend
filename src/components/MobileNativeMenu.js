// src/components/MobileNativeMenu.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  ScrollView, 
  Animated,
  Dimensions,
  StatusBar
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const MobileNativeMenu = ({ onLogout }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-width));

  const menuItems = [
    { name: 'Diálogo Conmigo', path: '/', emoji: '🕊️', screen: 'Home' },
    { name: 'Diario Vivo', path: '/diario-vivo', emoji: '📖', screen: 'DiarioVivo' },
    { name: 'Medita Conmigo', path: '/medita-conmigo', emoji: '🧘‍♀️', screen: 'MeditaConmigo' },
    { name: 'Mensajes del Alma', path: '/mensajes-del-alma', emoji: '💌', screen: 'MensajesAlma' },
    { name: 'Ritual Diario', path: '/ritual-diario', emoji: '🌅', screen: 'RitualDiario' },
    { name: 'Mapa Interior', path: '/mapa-interior', emoji: '🗺️', screen: 'MapaInterior' },
    { name: 'Silencio Sagrado', path: '/silencio-sagrado', emoji: '🤫', screen: 'SilencioSagrado' }
  ];

  const getCurrentPage = () => {
    const currentPath = window.location.pathname;
    return menuItems.find(item => item.path === currentPath) || 
           { name: 'BeCalm', emoji: '🕊️' };
  };

  const openMenu = () => {
    setIsMenuOpen(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const closeMenu = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start(() => setIsMenuOpen(false));
  };

  const handleNavigation = (screen, path) => {
    closeMenu();
    // Para React Native Web, usamos window.location
    if (path) {
      window.location.href = path;
    }
  };

  const currentPage = getCurrentPage();

  return (
    <>
      {/* HEADER NATIVO */}
      <View style={styles.header}>
        <StatusBar backgroundColor="rgba(0,0,0,0.8)" translucent />
        
        {/* Brand */}
        <View style={styles.brandContainer}>
          <Text style={styles.emoji}>{currentPage.emoji}</Text>
          <Text style={styles.brandText}>{currentPage.name}</Text>
        </View>

        {/* Menu Button */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={openMenu}
          activeOpacity={0.8}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL MENÚ NATIVO */}
      <Modal
        visible={isMenuOpen}
        transparent={true}
        animationType="none"
        onRequestClose={closeMenu}
      >
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <TouchableOpacity 
            style={styles.overlayTouch}
            onPress={closeMenu}
            activeOpacity={1}
          />
          
          <Animated.View style={[styles.menuContainer, { transform: [{ translateX: slideAnim }] }]}>
            {/* Header del menú */}
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>🌟 Explora BeCalm</Text>
              <TouchableOpacity
                onPress={closeMenu}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Items del menú */}
            <ScrollView style={styles.menuItems} showsVerticalScrollIndicator={false}>
              {menuItems.map((item, index) => {
                const isActive = window.location.pathname === item.path;
                
                return (
                  <TouchableOpacity
                    key={item.path}
                    style={[
                      styles.menuItem,
                      isActive && styles.menuItemActive
                    ]}
                    onPress={() => handleNavigation(item.screen, item.path)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.menuItemEmoji}>{item.emoji}</Text>
                    <Text style={[
                      styles.menuItemText,
                      isActive && styles.menuItemTextActive
                    ]}>
                      {item.name}
                    </Text>
                    {isActive && (
                      <Text style={styles.activeIndicator}>●</Text>
                    )}
                  </TouchableOpacity>
                );
              })}

              {/* Separador */}
              <View style={styles.separator} />

              {/* Logout */}
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => {
                  closeMenu();
                  onLogout();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.logoutEmoji}>🚪</Text>
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </Modal>
    </>
  );
};

// ESTILOS NATIVOS
const styles = {
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: StatusBar.currentHeight || 40,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emoji: {
    fontSize: 28,
    marginRight: 12,
  },
  brandText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  menuButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    elevation: 2,
  },
  menuIcon: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayTouch: {
    flex: 1,
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.85,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    paddingTop: StatusBar.currentHeight || 40,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 18,
    color: 'white',
  },
  menuItems: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuItemActive: {
    backgroundColor: 'rgba(67, 233, 123, 0.25)',
    borderColor: 'rgba(67, 233, 123, 0.6)',
    borderWidth: 2,
  },
  menuItemEmoji: {
    fontSize: 24,
    marginRight: 18,
    minWidth: 35,
  },
  menuItemText: {
    fontSize: 16,
    color: 'white',
    flex: 1,
    fontWeight: '400',
  },
  menuItemTextActive: {
    fontWeight: '600',
  },
  activeIndicator: {
    fontSize: 20,
    color: '#43e97b',
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 53, 69, 0.2)',
    borderRadius: 15,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(220, 53, 69, 0.5)',
  },
  logoutEmoji: {
    fontSize: 22,
    marginRight: 18,
    minWidth: 35,
  },
  logoutText: {
    fontSize: 16,
    color: '#ff6b6b',
    fontWeight: '600',
  },
};

export default MobileNativeMenu;