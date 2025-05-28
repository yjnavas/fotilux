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
import { updateLikeState, getLikeState, addLikeStateListener, LIKE_STATE_CHANGED_EVENT } from '../utils/likeStateManager'
import { updateCommentState, getCommentState, addCommentStateListener, COMMENT_STATE_CHANGED_EVENT } from '../utils/commentStateManager'

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

  // Efecto para cargar likes
  useEffect(() => {
    if (!item?.id) return;
    
    // Verificar primero el estado global de likes
    const savedLikeState = getLikeState(item.id);
    if (savedLikeState) {
      console.log(`Estado de like guardado para post ${item.id}:`, savedLikeState);
      setLiked(savedLikeState.isLiked);
      setLikes(new Array(savedLikeState.count || 0).fill({})); // Crear array con la cantidad correcta
    } else {
      // Si no hay estado guardado, cargar desde la API
      fetchLikes();
    }
    
    // Configurar listener para cambios en el estado de likes
    const handleLikeChange = (event) => {
      const { postId, isLiked, count } = event.detail;
      if (postId === item?.id?.toString()) {
        console.log(`Recibido evento de cambio de like para post ${postId}:`, isLiked, count);
        setLiked(isLiked);
        setLikes(new Array(count || 0).fill({}));
      }
    };
    
    // Agregar event listener
    window.addEventListener(LIKE_STATE_CHANGED_EVENT, handleLikeChange);
    
    // Cleanup
    return () => {
      window.removeEventListener(LIKE_STATE_CHANGED_EVENT, handleLikeChange);
    };
  }, [item?.id]);

  // Efecto para cargar comentarios
  useEffect(() => {
    if (!item?.id) return;
    
    // Verificar primero el estado global de comentarios
    const savedCommentState = getCommentState(item.id);
    if (savedCommentState) {
      console.log(`Estado de comentarios guardado para post ${item.id}:`, savedCommentState);
      if (savedCommentState.comments && savedCommentState.comments.length > 0) {
        setComments(savedCommentState.comments);
      } else if (savedCommentState.count > 0) {
        // Si solo tenemos el contador pero no los comentarios completos, cargar desde API
        fetchComments();
      } else {
        setComments([]);
      }
    } else {
      // Si no hay estado guardado, cargar desde la API
      fetchComments();
    }
    
    // Configurar listener para cambios en el estado de comentarios
    const handleCommentChange = (event) => {
      const { postId, comments } = event.detail;
      if (postId === item?.id?.toString()) {
        console.log(`Recibido evento de cambio de comentarios para post ${postId}:`, comments.length);
        setComments(comments || []);
      }
    };
    
    // Agregar event listener
    window.addEventListener(COMMENT_STATE_CHANGED_EVENT, handleCommentChange);
    
    // Cleanup
    return () => {
      window.removeEventListener(COMMENT_STATE_CHANGED_EVENT, handleCommentChange);
    };
  }, [item?.id]);

  // Efecto específico para favoritos
  useEffect(() => {
    if (!item?.id) return;
    
    // Verificar primero el estado global de favoritos
    const savedFavoriteState = getFavoriteState(item.id);
    if (savedFavoriteState !== null) {
      console.log(`Estado de favorito guardado para post ${item.id}:`, savedFavoriteState);
      setFavorited(savedFavoriteState);
    } else {
      // Solo si no hay estado guardado, consultamos la API
      const checkFavoriteStatus = async () => {
        setLoading(true);
        try {
          const response = await get_post_favorites(item.id);
          if (response.success) {
            // Si se proporciona isFavorited directamente, usarlo
            if (item.isFavorited !== undefined) {
              console.log(`Usando isFavorited proporcionado directamente para post ${item.id}:`, item.isFavorited);
              setFavorited(item.isFavorited);
              updateFavoriteState(item.id, item.isFavorited);
            } else {
              // Verificar si el post actual está en favoritos del usuario
              const isPostFavorited = response.data.some(fav => fav.user_id === currentUser?.id);
              console.log(`Post ${item.id} está en favoritos: ${isPostFavorited}`);
              setFavorited(isPostFavorited);
              updateFavoriteState(item.id, isPostFavorited);
            }
          } else {
            console.error('Error al cargar favoritos:', response.msg);
          }
        } catch (error) {
          console.error('Error al verificar estado de favoritos:', error);
        } finally {
          setLoading(false);
        }
      };
      
      checkFavoriteStatus();
    }
    
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
  }, [item?.id, item?.isFavorited, currentUser?.id]);
  


  const fetchLikes = async () => {
    if (!item?.id) return;
    
    setLikesLoading(true);
    try {
      const res = await getPostLikes(item.id);
      if (res.success) {
        const likesData = res.data || [];
        setLikes(likesData);
        
        // Verificar si el usuario actual ha dado like
        const userHasLiked = likesData.some(like => like.user_id === currentUser?.id);
        setLiked(userHasLiked);
        
        // Actualizar el estado global
        updateLikeState(item.id, userHasLiked, likesData.length);
      } else {
        console.error('Error al cargar likes:', res.msg);
      }
    } catch (error) {
      console.error('Error al cargar likes:', error);
    } finally {
      setLikesLoading(false);
    }
  };

  const fetchComments = async () => {
    if (!item?.id) return;
    
    setCommentsLoading(true);
    try {
      const res = await getPostComments(item.id);
      if (res.success) {
        const commentsData = res.data || [];
        setComments(commentsData);
        
        // Actualizar el estado global
        updateCommentState(item.id, commentsData);
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
        // Actualizar el estado global usando el nuevo state manager
        updateLikeState(item.id, newLikedState, newLikeCount);
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
      const message = 'Debes iniciar sesión para agregar a favoritos';
      Platform.OS === 'web' ? alert(message) : Alert.alert('Error', message);
      return;
    }

    // Actualización optimista de la UI
    const previousState = favorited;
    setFavorited(!favorited);
    setLoading(true);
    
    try {
      const response = await (favorited ? delete_favorite(item.id) : create_favorite(item.id));
      
      if (response.success) {
        // Actualizar estado global
        updateFavoriteState(item.id, !favorited);
        
        const message = favorited ? 'Post eliminado de favoritos' : 'Post agregado a favoritos';
        Platform.OS === 'web' ? alert(message) : Alert.alert('Éxito', message);
      } else {
        // Revertir cambio si hay error
        setFavorited(previousState);
        const errorMsg = response.msg || 'Error al procesar la operación de favoritos';
        Platform.OS === 'web' ? alert(errorMsg) : Alert.alert('Error', errorMsg);
      }
    } catch (error) {
      console.error('Error en onFavorites:', error);
      // Revertir cambio si hay error
      setFavorited(previousState);
      const errorMsg = 'Error al procesar la operación de favoritos';
      Platform.OS === 'web' ? alert(errorMsg) : Alert.alert('Error', errorMsg);
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
                <Icon name="star" size={24} fill={favorited ? theme.colors.gold : 'transparent'} color={favorited ? theme.colors.gold : theme.colors.textLight} />
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