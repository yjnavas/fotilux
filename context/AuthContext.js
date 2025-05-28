import React, { createContext, useState, useContext, useEffect } from 'react';
import { router } from 'expo-router';
import { Platform } from 'react-native';
import { loginUser } from '../services/userServices';
import { initializeFavoriteStates, clearFavoriteStates } from '../utils/favoriteStateManager';

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
          const isAuth = !!token;
          setIsAuthenticated(isAuth);
          
          // Si el usuario está autenticado, inicializar el estado de favoritos
          if (isAuth) {
            const userDataStr = localStorage.getItem('currentUser');
            if (userDataStr) {
              try {
                const userData = JSON.parse(userDataStr);
                setUser(userData);
                
                // Inicializar el estado de favoritos para el usuario actual
                await initializeFavoriteStates(userData.id);
                console.log('Estado de favoritos inicializado para el usuario:', userData.id);
              } catch (parseError) {
                console.error('Error parsing user data:', parseError);
              }
            }
          }
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
  const login = async (userData) => {
    try {
      // Caso normal: recibimos credenciales y llamamos al servicio
      const response = await loginUser(userData);
      
      if (response.success && response.data.access_token) {
        // Guardar el token y los datos del usuario
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('token_type', response.data.token_type);
        
        if (response.data.user) {
          localStorage.setItem('currentUser', JSON.stringify(response.data.user));
          setUser(response.data.user);
          
          // Inicializar el estado de favoritos para el usuario actual
          await initializeFavoriteStates(response.data.user.id);
          console.log('Estado de favoritos inicializado para el usuario:', response.data.user.id);
        }
        
        // Actualizar el estado de autenticación
        setIsAuthenticated(true);
        
        // Pequeña pausa para asegurar que el estado se actualice
        await new Promise(resolve => setTimeout(resolve, 100));
        
        return { success: true, data: response.data };
      } else {
        return { success: false, msg: response.msg || 'Error al iniciar sesión' };
      }
    } catch (error) {
      console.error('Error during login:', error);
      return { success: false, msg: error.message || 'Error durante el inicio de sesión' };
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem('token');
        localStorage.removeItem('token_type');
        localStorage.removeItem('currentUser');
        
        // Limpiar estado de likes almacenado en localStorage
        localStorage.removeItem('globalLikeState');
        console.log('Estado de likes limpiado correctamente');
      } else {
        // Para React Native:
        // await AsyncStorage.removeItem('token');
        // await AsyncStorage.removeItem('globalLikeState');
        console.log('Token eliminado');
      }
      
      // Limpiar el estado de favoritos
      clearFavoriteStates();
      console.log('Estado de favoritos limpiado correctamente');
      
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
