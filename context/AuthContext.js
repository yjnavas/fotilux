import React, { createContext, useState, useContext, useEffect } from 'react';
import { router } from 'expo-router';
import { Platform } from 'react-native';
import { loginUser } from '../services/userServices';
import { initializeFavoriteStates, clearFavoriteStates } from '../utils/favoriteStateManager';
import { initializeLikeStates, clearLikeStates } from '../utils/likeStateManager';
import { initializeCommentStates, clearCommentStates } from '../utils/commentStateManager';

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
                
                // Inicializar los estados para el usuario actual
                // Nota: Ahora todos los state managers tienen una API consistente
                await initializeFavoriteStates(userData.id);
                await initializeLikeStates(userData.id); // Ya no necesita postIds como primer parámetro
                await initializeCommentStates(userData.id); // Ahora acepta userId por consistencia
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
          
          // Inicializar los estados para el usuario actual
          // Usando la API consistente para todos los state managers
          await initializeFavoriteStates(response.data.user.id);
          await initializeLikeStates(response.data.user.id);
          await initializeCommentStates(response.data.user.id);
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
        
        // Ya no necesitamos eliminar manualmente los estados de localStorage
        // Los state managers se encargan de esto a través de sus métodos clearStates
        console.log('Estados de likes y comentarios se limpiarán a través de los state managers');
      } else {
        // Para React Native:
        // await AsyncStorage.removeItem('token');
        // await AsyncStorage.removeItem('globalLikeState');
        // await AsyncStorage.removeItem('globalCommentState');
        console.log('Token eliminado');
      }
      
      // Limpiar todos los estados globales usando los métodos optimizados
      clearFavoriteStates();
      clearLikeStates();
      clearCommentStates();
      console.log('Estados globales limpiados correctamente');
      
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
