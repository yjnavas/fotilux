import { StyleSheet, Text, View, Pressable, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { router, useRouter } from 'expo-router'
import { wp, hp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import { getFavoritesPost } from '../../services/postServices'
import PostCard from '../../components/PostCard'
import Loading from '../../components/Loading'
import Header from '../../components/Header'

const FavoritesPosts = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState([]);
  const [skip, setSkip] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const limit = 3; // Número de posts a cargar por página

  // Obtener datos del usuario desde localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem('currentUser');
      console.log('userData from localStorage:', userData);
      
      if (userData) {
        // Parse the JSON string from localStorage
        const parsedUserData = JSON.parse(userData);
        setUser(parsedUserData);
        
        // This won't show the updated user state immediately due to React's asynchronous state updates
        console.log('Current user state (won\'t reflect update yet):', user);
      }
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
    }
  }, []);
  
  // Add a separate useEffect to log the user after state updates
  useEffect(() => {
    console.log('Updated user state:', user);
  }, [user]);

  // Función para cargar los posts favoritos iniciales
  const fetchInitialFavoritePosts = async () => {
    setLoading(true);
    try {
      const res = await getFavoritesPost(0, limit);
      if (res.success) {
        // Asegurarse de que todos los posts estén marcados como favoritos
        const markedPosts = res.data.map(post => ({
          ...post,
          isFavorited: true // Marcar explícitamente como favorito
        }));
        console.log('Posts favoritos cargados:', markedPosts);
        setPosts(markedPosts);
        setHasMore(res.hasMore);
        setSkip(limit); // Preparar para la siguiente carga
      } else {
        console.error('Error al cargar posts favoritos:', res.msg);
      }
    } catch (error) {
      console.error('Error al cargar posts favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar posts favoritos iniciales al montar el componente
  useEffect(() => {
    fetchInitialFavoritePosts();
  }, []);
  
  // Listen for global favorite state changes
  useEffect(() => {
    const handleFavoriteStateChange = (event) => {
      if (!event.detail) return;
      
      console.log('Global favorite state change received in favorites:', event.detail);
      const { postId, isFavorite } = event.detail;
      
      // Si un post fue quitado de favoritos, eliminarlo de la lista
      if (!isFavorite) {
        setPosts(currentPosts => {
          return currentPosts.filter(post => post.id.toString() !== postId.toString());
        });
      }
    };
    
    // Add event listener
    window.addEventListener('globalFavoriteStateChanged', handleFavoriteStateChange);
    
    // Clean up
    return () => {
      window.removeEventListener('globalFavoriteStateChanged', handleFavoriteStateChange);
    };
  }, []);

  // Listen for global like state changes
  useEffect(() => {
    const handleLikeStateChange = (event) => {
      if (!event.detail) return;
      
      console.log('Global like state change received in favorites:', event.detail);
      const { postId, isLiked, count } = event.detail;
      
      // Update only the specific post that was liked/unliked
      setPosts(currentPosts => {
        return currentPosts.map(post => {
          // If this is the post that was liked/unliked
          if (post.id.toString() === postId.toString()) {
            // Create a copy of the post with updated like information
            const updatedPost = { ...post };
            
            // Update the post with the new like count
            // Note: The actual like status will be handled by the PostCard component
            console.log(`Updating post ${postId} with new like count: ${count}`);
            return updatedPost;
          }
          return post;
        });
      });
    };
    
    // Add event listener
    window.addEventListener('globalLikeStateChanged', handleLikeStateChange);
    
    // Clean up
    return () => {
      window.removeEventListener('globalLikeStateChanged', handleLikeStateChange);
    };
  }, []);

  // Función para cargar más posts favoritos (infinite scroll)
  const loadMoreFavoritePosts = async () => {
    if (!hasMore || loading) return;
    
    setLoading(true);
    console.log('Cargando más posts favoritos desde skip:', skip, 'con límite:', limit);
    
    try {
      const res = await getFavoritesPost(skip, limit);
      
      if (res.success) {
        // Verificar si hay nuevos posts
        if (res.data && res.data.length > 0) {
          // Asegurarse de que todos los nuevos posts estén marcados como favoritos
          const markedPosts = res.data.map(post => ({
            ...post,
            isFavorited: true // Marcar explícitamente como favorito
          }));
          
          // Filtrar para evitar duplicados
          const currentIds = posts.map(p => p.id.toString());
          const newPosts = markedPosts.filter(p => !currentIds.includes(p.id.toString()));
          
          // Añadir los nuevos posts al final de la lista actual
          setPosts(currentPosts => [...currentPosts, ...newPosts]);
          
          // Actualizar el skip para la próxima carga
          setSkip(currentSkip => currentSkip + limit);
          
          // Actualizar el estado de hasMore
          setHasMore(res.hasMore);
        } else {
          // No hay más posts para cargar
          setHasMore(false);
        }
      } else {
        console.error('Error al cargar más posts favoritos:', res.msg);
        setHasMore(false); // Detener las consultas en caso de error
      }
    } catch (error) {
      console.error('Error al cargar más posts favoritos:', error);
      setHasMore(false); // Detener las consultas en caso de error
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar el evento onEndReached de FlatList
  const handleLoadMore = () => {
    console.log('Reached end, loading more favorite posts...');
    if (!loading && hasMore) {
      loadMoreFavoritePosts();
    }
  };
  
  // Función para refrescar la lista (pull to refresh)
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchInitialFavoritePosts();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScreenWrapper bg={'white'} >
      <View style={styles.container}>
        <Header title="Favoritos" showBackButton={true} mb={15} />

      {/* posts favoritos */}
        <FlatList
          data={posts}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(item, index) => `favorite-post-${item.id}-${index}`}
          renderItem={({ item }) => 
            <PostCard
              item={item}
              currentUser={user}
              router={router}
              isDetail={false}
              showMoreIcon={true}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={!loading && posts.length === 0 ? (
            <View style={{marginVertical: 100, alignItems: 'center'}}>
              <Text style={styles.noPosts}>No tienes posts favoritos</Text>
            </View>
          ) : null}
          ListFooterComponent={
            <View style={{marginVertical: posts.length === 0 ? 200: 30}}>
              {loading ? (
                <Loading/>
              ) : !hasMore && posts.length > 0 ? (
                <Text style={styles.noPosts}>No hay más posts favoritos</Text>
              ) : null}
            </View>
          }
        />

      </View>
    </ScreenWrapper>
  )
}

export default FavoritesPosts

const styles = StyleSheet.create({
  container:{
    flex: 1,
    marginHorizontal: wp(2),
  },
  listStyle: {
    paddingTop: 10,
    paddingHorizontal: wp(2),
  },
  noPosts: {
    fontSize: hp(4),
    textAlign: 'center',
    color: theme.colors.text,
  },
  pill: {
    position: 'absolute',
    right: -10,
    top: -4,
    height: hp(2.2),
    width: hp(2.2),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: theme.colors.roseLight,
  },
  pillText: {
    color: 'white',
    fontSize: hp(1.2),
    fontWeight: theme.fonts.bold,
  },
})
