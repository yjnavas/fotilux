import { Share, StyleSheet, Text, TouchableOpacity, View, Platform, Alert, Modal } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { theme } from '../constants/theme'
import { hp, wp } from '../helpers/common'
import Avatar from './Avatar'
import moment from 'moment'
import Icon from '../assets/icons'
import RenderHtml from 'react-native-render-html';
import { Image } from 'expo-image'
import imagen1 from '../assets/images/imagen1.jpg';
import atardecer from '../assets/images/atardecer.jpg';
import imagen2 from '../assets/images/imagen2.jpg';
import imagen3 from '../assets/images/imagen3.jpg';
import { stripHtmlTags } from '../helpers/common'
import { downloadFile, getUserImageSrc } from '../services/imageServices'
import Loading from './Loading'
import { getPostComments, getPostLikes, addLike, removeLike, deletePost, create_favorite, delete_favorite, get_post_favorites } from '../services/postServices'
import { updateFavoriteState, getFavoriteState, addFavoriteStateListener, FAVORITE_STATE_CHANGED_EVENT } from '../utils/favoriteStateManager'

const images = {
  'imagen1.jpg': imagen1,
  'atardecer.jpg': atardecer,
  'imagen2.jpg': imagen2,
  'imagen3.jpg': imagen3,
};

const textStyle = {
  color: theme.colors.dark,
  fontSize: hp(1.75),
}
const tagStyles = {
  div: textStyle,
  p: textStyle,
  ol: textStyle,
  h1: {
    color: theme.colors.text,
  },
  h4: {
    color: theme.colors.text,
  },
}

const PostCard = ({
  item,
  currentUser,
  router,
  hasShadow = false,
  showMoreIcon = true,
  isDetail = false,
  canDelete = false, 
}) => {

  const inputRef = useRef(null);
  const commentRef = useRef('');
  
  const shadowStyles = {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  }

  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [likesLoading, setLikesLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);

  // Initial data fetch when component mounts
  useEffect(() => {
    console.log('useEffect inicial ejecutándose');
    
    const loadData = async () => {
      if (!item?.id) return;
      
      console.log(`Cargando datos para post ${item.id}`);
      
      // Verificar si hay un estado de favorito guardado
      const savedFavoriteState = getFavoriteState(item.id);
      if (savedFavoriteState !== null) {
        console.log(`Estado de favorito guardado para post ${item.id}:`, savedFavoriteState);
        setFavorited(savedFavoriteState);
      }
      
      // Establecer estados de carga
      setLikesLoading(true);
      setCommentsLoading(true);
      setLoading(true); // Para favoritos
      
      try {
        // Ejecutar todas las consultas en paralelo y esperar a que terminen
        const [likesResult, commentsResult, favoritesResult] = await Promise.all([
          getPostLikes(item.id),
          getPostComments(item.id),
          get_post_favorites(item.id)
        ]);
        
        console.log(`Datos cargados para post ${item.id}`);
        
        // Procesar resultados de likes
        if (likesResult.success) {
          setLikes(likesResult.data || []);
          
          // Verificar si el usuario actual ha dado like
          const userHasLiked = likesResult.data.some(like => like.user_id === currentUser?.id);
          console.log('likesResult', likesResult)
          console.log(`Usuario ${currentUser?.id} ha dado like al post ${item.id}: ${userHasLiked}`);
          
          // Si se proporciona isLiked directamente, usarlo
          if (item.isLiked !== undefined) {
            console.log(`Usando isLiked proporcionado directamente para post ${item.id}:`, item.isLiked);
            setLiked(item.isLiked);
          } else {
            // Usar el resultado de la API
            setLiked(userHasLiked);
          }
        } else {
          console.error('Error al cargar likes:', likesResult.msg);
        }
        
        // Procesar resultados de comentarios
        if (commentsResult.success) {
          setComments(commentsResult.data || []);
        } else {
          console.error('Error al cargar comentarios:', commentsResult.msg);
        }
        
        // Procesar resultados de favoritos
        if (favoritesResult.success && savedFavoriteState === null) {
          console.log('favoritesResult', favoritesResult);
          // Verificar si el post actual está en favoritos del usuario
          const isPostFavorited = favoritesResult.data.some(fav => fav.user_id === currentUser?.id);
          console.log(`Post ${item.id} está en favoritos: ${isPostFavorited}`);
          
          // Si se proporciona isFavorited directamente, usarlo
          if (item.isFavorited !== undefined) {
            console.log(`Usando isFavorited proporcionado directamente para post ${item.id}:`, item.isFavorited);
            setFavorited(item.isFavorited);
            // Actualizar el estado global
            updateFavoriteState(item.id, item.isFavorited);
          } else {
            // Usar el resultado de la API
            setFavorited(isPostFavorited);
            // Actualizar el estado global
            updateFavoriteState(item.id, isPostFavorited);
          }
        } else if (!favoritesResult.success) {
          console.error('Error al cargar favoritos:', favoritesResult.msg);
        }
      } catch (error) {
        console.error('Error al cargar datos del post:', error);
      } finally {
        setLikesLoading(false);
        setCommentsLoading(false);
        setLoading(false); // Para favoritos
      }
    };
    
    loadData();
    
    // Configurar listener para cambios en el estado de favoritos
    const handleFavoriteChange = (event) => {
      const { postId, isFavorited } = event.detail;
      if (postId === item?.id?.toString()) {
        console.log(`Recibido evento de cambio de favorito para post ${postId}:`, isFavorited);
        setFavorited(isFavorited);
      }
    };
    
    // Agregar event listener
    window.addEventListener(FAVORITE_STATE_CHANGED_EVENT, handleFavoriteChange);
    
    // Cleanup
    return () => {
      window.removeEventListener(FAVORITE_STATE_CHANGED_EVENT, handleFavoriteChange);
    };
  }, [item?.id, item?.isLiked, item?.isFavorited, currentUser?.id]);
  
  
  // Listen for global like state changes
  useEffect(() => {
    if (!item?.id) return;
    
    const handleLikeStateChange = (event) => {
      try {
        // If this event is for this specific post, update immediately
        if (event && event.detail && event.detail.postId === item.id.toString()) {
          console.log(`Updating like state for post ${item.id} from event:`, event.detail);
          setLiked(event.detail.isLiked);
          return;
        }
        
        // Otherwise check global state
        checkGlobalLikeState(item.id.toString());
      } catch (error) {
        console.error('Error handling like state change:', error);
      }
    };
    
    // Add event listener
    window.addEventListener('globalLikeStateChanged', handleLikeStateChange);
    
    // Check initial state
    checkGlobalLikeState(item.id.toString());
    
    // Clean up
    return () => {
      window.removeEventListener('globalLikeStateChanged', handleLikeStateChange);
    };
  }, [item?.id]);
  
  // Function to check global like state
  const checkGlobalLikeState = (postId) => {
    try {
      const globalLikeState = localStorage.getItem('globalLikeState') || '{}';
      const likeStates = JSON.parse(globalLikeState);
      const postState = likeStates[postId];
      
      if (postState) {
        console.log(`Found global like state for post ${postId}:`, postState);
        // Update local state based on global state
        setLiked(postState.isLiked);
        fetchLikes();
      } else if (currentUser) {
        // If no global state, check if the current user has liked this post
        const userLiked = likes.some(like => like.userId === currentUser.id);
        setLiked(userLiked);
      }
    } catch (error) {
      console.error('Error checking global like state:', error);
    }
  };

  const fetchLikes = async () => {
    if (!item?.id) return;
    
    setLikesLoading(true);
    try {
      const res = await getPostLikes(item.id);
      if (res.success) {
        setLikes(res.data || []);
      } else {
        console.error('Error al cargar likes:', res.msg);
      }
    } catch (error) {
      console.error('Error al cargar likes:', error);
    } finally {
      setLikesLoading(false);
    }
  };
  
  // Function to update global like state
  const updateGlobalLikeState = (postId, isLiked, count) => {
    try {
      // Ensure postId is a string for consistency
      const postIdStr = postId.toString();
      
      // Get current global like state
      const globalLikeStateString = localStorage.getItem('globalLikeState') || '{}';
      const globalLikeState = JSON.parse(globalLikeStateString);
      
      // Update state for this post
      globalLikeState[postIdStr] = {
        isLiked: isLiked,
        count: count,
        timestamp: Date.now()
      };
      
      // Save updated global like state back to localStorage
      localStorage.setItem('globalLikeState', JSON.stringify(globalLikeState));
    } catch (error) {
      console.error('Error updating global like state:', error);
    }
  };
  
  // Function to notify all components about like state change
  const notifyLikeStateChange = (postId, isLiked, count) => {
    // Update global state
    updateGlobalLikeState(postId, isLiked, count);
    
    // Dispatch event
    const event = new CustomEvent('globalLikeStateChanged', {
      detail: { postId, isLiked, count }
    });
    window.dispatchEvent(event);
  };

  const fetchComments = async () => {
    if (!item?.id) return;
    
    setCommentsLoading(true);
    try {
      const res = await getPostComments(item.id);
      if (res.success) {
        setComments(res.data || []);
      } else {
        console.error('Error al cargar comentarios:', res.msg);
      }
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const openPostDetails = () => {
    if(!showMoreIcon) return null;
    if(isDetail) {
      setShowDropdown(!showDropdown);
    } else {
      router.push({pathname: 'postDetails', params: {id: item?.id}});
    }
  }

  const onLike = async () => {
    if (!item?.id || likesLoading || !currentUser) return;
    
    // Store current state for potential rollback
    const previousLikedState = liked;
    const previousLikes = [...likes];
    
    // Calculate new like count
    const newLikeCount = liked ? likes.length - 1 : likes.length + 1;
    
    // Toggle like state optimistically for better UX
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikesLoading(true);
    
    try {
      let response;
      if (newLikedState) {
        // Add like
        const newLike = { userId: currentUser.id, postId: item.id };
        setLikes(prevLikes => [...prevLikes, newLike]);
        response = await addLike(item.id);
        console.log('Add like response:', response);
      } else {
        // Remove like
        setLikes(prevLikes => prevLikes.filter(like => like.userId !== currentUser.id));
        response = await removeLike(item.id);
        console.log('Remove like response:', response);
      }
      
      if (response && response.success) {
        // Notify all components about like state change
        notifyLikeStateChange(item.id, newLikedState, newLikeCount);
      } else {
        // If API call failed, revert UI state and likes array
        setLiked(previousLikedState);
        setLikes(previousLikes);
      }
    } catch (error) {
      // Revert UI state and likes array if there was an error
      setLiked(previousLikedState);
      setLikes(previousLikes);
    } finally {
      setLikesLoading(false);
    }
  }

  const onFavorites = async () => {
    if (!currentUser) {
      Alert.alert('Error', 'Debes iniciar sesión para agregar a favoritos');
      return;
    }

    setLoading(true);
    try {
      if (!favorited) {
        // Agregar a favoritos
        const response = await create_favorite(item.id);
        if (response.success) {
          setFavorited(true);
          // Actualizar el estado global y notificar a otros componentes
          updateFavoriteState(item.id, true);
          if (Platform.OS === 'web') {
            alert('Post agregado a favoritos');
          } else {
            Alert.alert('Éxito', 'Post agregado a favoritos');
          }
        } else {
          if (Platform.OS === 'web') {
            alert(response.msg || 'Error al agregar a favoritos');
          } else {
            Alert.alert('Error', response.msg || 'Error al agregar a favoritos');
          }
        }
      } else {
        // Quitar de favoritos
        const response = await delete_favorite(item.id);
        if (response.success) {
          setFavorited(false);
          // Actualizar el estado global y notificar a otros componentes
          updateFavoriteState(item.id, false);
          if (Platform.OS === 'web') {
            alert('Post eliminado de favoritos');
          } else {
            Alert.alert('Éxito', 'Post eliminado de favoritos');
          }
        } else {
          if (Platform.OS === 'web') {
            alert(response.msg || 'Error al eliminar de favoritos');
          } else {
            Alert.alert('Error', response.msg || 'Error al eliminar de favoritos');
          }
        }
      }
    } catch (error) {
      console.error('Error en onFavorites:', error);
      if (Platform.OS === 'web') {
        alert('Error al procesar la operación de favoritos');
      } else {
        Alert.alert('Error', 'Error al procesar la operación de favoritos');
      }
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async () => {
    const confirmDelete = async () => {
      // Mostrar indicador de carga
      setLoading(true);
      
      try {
        // Llamar al servicio de eliminación
        const response = await deletePost(item.id);
        
        if (response.success) {
          // Mostrar mensaje de éxito
          if (Platform.OS === 'web') {
            window.alert("✅ " + response.msg);
          } else {
            Alert.alert('Éxito', response.msg + ' ✅');
          }
          // Redirigir a la página principal
          router.push('home');
        } else {
          // Mostrar mensaje de error
          if (Platform.OS === 'web') {
            window.alert("❌ " + response.msg);
          } else {
            Alert.alert('Error', response.msg);
          }
        }
      } catch (error) {
        console.error('Error al eliminar el post:', error);
        // Mostrar mensaje de error
        if (Platform.OS === 'web') {
          window.alert("❌ Error al eliminar el post");
        } else {
          Alert.alert('Error', 'Error al eliminar el post');
        }
      } finally {
        setLoading(false);
      }
    };
    
    // Mostrar confirmación
    if (Platform.OS === 'web') {
      const confirm = window.confirm("¿Desea eliminar el post?");
      if (confirm) {
        await confirmDelete();
      }
    } else {
      inputRef?.current?.clear();
      commentRef.current = '';
      Alert.alert('Confirmar', "¿Desea eliminar el post?", [
        { 
          text: 'OK', 
          onPress: confirmDelete, 
          style: 'destructive' 
        },
        { 
          text: 'Cancelar', 
          onPress: () => console.log('Cancelada la eliminación'), 
          style: 'cancel' 
        },
      ]);
    }
  }

  const createdAt = moment(item?.createdAt).format('MMM D');
  // We're now using the liked state variable instead of calculating it here
  const showDelete = item?.userId === currentUser?.id;

  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <View style={styles.header}>
        {/* user info and post time */}
        <TouchableOpacity 
          style={styles.userInfo} 
          onPress={() => router.push({pathname: 'profile', params: {id: item?.user_id === currentUser?.id ? null : item?.user_id}})}
        >
          <Avatar
            size={hp(10)}
            uri={item?.user?.image}
            rounded={theme.radius.md}
          />
          <View style={{gap: 2}}>
            <Text style={styles.username}>{item?.name}</Text>
            <Text style={styles.postTime}>{createdAt}</Text>
          </View>
        </TouchableOpacity>
        {
          isDetail && item?.userId === currentUser?.id && (
            <View>
              <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Icon name="threeDotsHorizontal" size={hp(4)} strokeWidth={3} color={theme.colors.text} />
                </View>
              </TouchableOpacity>
              
              {showDropdown && (
                <View style={styles.dropdownMenu}>
                  <TouchableOpacity 
                    style={styles.dropdownItem} 
                    onPress={() => {
                      setShowDropdown(false);
                      handleDelete();
                    }}
                  >
                    <Icon name="delete" size={hp(3.5)} color={theme.colors.rose} />
                    <Text style={styles.dropdownText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )
        }
      </View>

      {/* post body media */}
      <View style={styles.content}>
        <View style={styles.postBody}>
          {
            item?.body && (
              <RenderHtml 
                source={{html:item?.body}} 
                contentWidth={wp(30)} 
                tagsStyles={tagStyles} 
              />
            )
          }
        </View>
        {/* post image */}
        {
          item?.file  &&(
            <View style={styles.postMedia}>
              <Image 
                source={images[item.file]}
                transition={100} 
                contentFit='cover' 
                style={styles.postMedia} 
              />
            </View>
          )
        }
      </View>
      {/* Linkedin01FreeIcons, comment, share */}
      <View style={styles.footer}>
        <View style={styles.footerButtons}>
          <TouchableOpacity onPress={onLike} disabled={likesLoading}>
            {likesLoading ? (
              <Loading size="small" color={theme.colors.textLight} />
            ) : (
              <Icon name="heart" size={24} fill={liked ? theme.colors.rose : 'transparent'} color={liked ? theme.colors.rose : theme.colors.textLight} />
            )}
          </TouchableOpacity>
          <Text style={styles.count}>
            {likes?.length || 0}
          </Text>
        </View>
        <View style={styles.footerButtons}>
          <TouchableOpacity onPress={isDetail ? null : openPostDetails} disabled={isDetail}>
            {commentsLoading ? (
              <Loading size="small" color={theme.colors.textLight} />
            ) : (
              <Icon name="comment" size={24} color={theme.colors.textLight} />
            )}
          </TouchableOpacity>
          <Text style={styles.count}>
            {comments?.length || 0}
          </Text>
        </View>
        <View style={styles.footerButtons}>
          {
            loading ? (
              <Loading size="small" color={theme.colors.textLight} />
            ) : (
              <TouchableOpacity onPress={onFavorites}>
                <Icon name="star" size={24} fill={favorited ? theme.colors.yellow : 'transparent'} color={favorited ? theme.colors.yellow : theme.colors.textLight} />
              </TouchableOpacity>
            )
          }
        </View>
        </View>
    </View>
  )
}

export default PostCard

const styles = StyleSheet.create({
    container: {
        gap: 10,
        marginBottom: 15,
        borderRadius: theme.radius.xxl*1.4,
        borderCurve: 'continuous',
        padding: 10,
        paddingVertical: 12,
        backgroundColor: theme.colors.white,
        borderWidth: 0.5,
        borderColor: theme.colors.gray,
        shadowColor: '#000',
    },
    dropdownMenu: {
        position: 'absolute',
        right: 32,
        top: hp(-2),
        backgroundColor: theme.colors.white,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.gray,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        zIndex: 1000,
        elevation: 5,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        gap: 8,
    },
    dropdownText: {
        color: theme.colors.text,
        fontSize: hp(3),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    username: {
        fontSize: hp(4),
        color: theme.colors.text,
        fontWeight: theme.fonts.bold,
    },
    postTime: {
        fontSize: hp(2.5),
        color: theme.colors.textLight,
        fontWeight: theme.fonts.medium,
    },
    content: {
        gap: 10,
    },
    postMedia:{
        height: hp(80),
        width: '100%',
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous',
    },
    postBody: {
        marginLeft: 5,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    footerButtons: {
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'cennter',
        gap: 0,
    },
    count: {
        color: theme.colors.text,
        fontSize: hp(3),
    },
})