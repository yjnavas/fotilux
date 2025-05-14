import React, { createContext, useState, useContext, useEffect } from 'react';
import { router } from 'expo-router';
import { Platform } from 'react-native';

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // En web usamos localStorage
        if (Platform.OS === 'web') {
          const token = localStorage.getItem('token');
          setIsAuthenticated(!!token);
        } 
        // En mobile usamos AsyncStorage
        else {
          // Para React Native necesitaríamos importar AsyncStorage
          // const token = await AsyncStorage.getItem('token');
          // Por ahora, simplemente simulamos que no hay token en mobile
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Función para iniciar sesión
  const login = async (token) => {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem('token', token);
      } else {
        // Para React Native:
        // await AsyncStorage.setItem('token', token);
        console.log('Token guardado:', token);
      }
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem('token');
      } else {
        // Para React Native:
        // await AsyncStorage.removeItem('token');
        console.log('Token eliminado');
      }
      setIsAuthenticated(false);
      router.replace('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
