import { StyleSheet, Text, View, Button, Pressable, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { router, useRouter } from 'expo-router'
import { wp, hp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import Icon from '../../assets/icons'
import Avatar from '../../components/Avatar'
import { getPosts } from '../../services/postServices'
import PostCard from '../../components/PostCard'
import Loading from '../../components/Loading'

const Home = () => {
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

  // Función para cargar los posts iniciales
  const fetchInitialPosts = async () => {
    setLoading(true);
    try {
      const res = await getPosts(0, limit);
      if (res.success) {
        setPosts(res.data);
        setHasMore(res.hasMore);
        setSkip(limit); // Preparar para la siguiente carga
      } else {
        console.error('Error al cargar posts:', res.msg);
      }
    } catch (error) {
      console.error('Error al cargar posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar posts iniciales al montar el componente
  useEffect(() => {
    fetchInitialPosts();
  }, []);
  
  // Listen for global like state changes
  useEffect(() => {
    const handleLikeStateChange = (event) => {
      if (!event.detail) return;
      
      console.log('Global like state change received in home:', event.detail);
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



  // Función para cargar más posts (infinite scroll)
  const loadMorePosts = async () => {
    if (!hasMore || loading) return;
    
    setLoading(true);
    console.log('Cargando más posts desde skip:', skip, 'con límite:', limit);
    
    // Simular un pequeño retraso para ver el indicador de carga
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const res = await getPosts(skip, limit);
      if (res.success) {
        console.log('Posts cargados:', res.data.length);
        
        // Filtrar los posts nuevos para eliminar duplicados
        const newPosts = res.data.filter(newPost => {
          // Verificar si este post ya existe en el estado actual
          return !posts.some(existingPost => existingPost.id === newPost.id);
        });
        
        console.log('Posts únicos a agregar:', newPosts.length);
        
        // Agregar solo los posts únicos a los existentes
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
        setHasMore(res.hasMore);
        setSkip(prevSkip => prevSkip + limit); // Actualizar skip para la próxima carga
      } else {
        console.error('Error al cargar más posts:', res.msg);
      }
    } catch (error) {
      console.error('Error al cargar más posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar el evento onEndReached de FlatList
  const handleLoadMore = () => {
    console.log('Reached end, loading more posts...');
    if (!loading && hasMore) {
      loadMorePosts();
    }
  };
  
  // Función para refrescar la lista (pull to refresh)
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchInitialPosts();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScreenWrapper bg={'white'}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Fotilux</Text>
          <View style={styles.icons}>
            <Pressable onPress={()=> router.push('notifications')}>
              <Icon name="heart" size={hp(3,2)} strokeWidth={2} color={theme.colors.text} />
            </Pressable>
            <Pressable onPress={()=> router.push('newPost')}>
              <Icon name="plus" size={hp(3,2)} strokeWidth={2} color={theme.colors.text} />
            </Pressable>
            <Pressable onPress={()=> router.push('profile')}>
              <Avatar
                uri={'user?.image'}
                size={hp(8)}
                rounded={theme.radius.sm}
                style={styles.icons}
              />
            </Pressable>
          </View>
        </View>

      {/* posts */}
        <FlatList
          data={posts}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(item, index) => `post-${item.id}-${index}`}
          renderItem={({ item }) => 
            <PostCard
              item={item}
              currentUser={user}
              router={router}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={!loading && posts.length === 0 ? (
            <View style={{marginVertical: 100, alignItems: 'center'}}>
              <Text style={styles.noPosts}>No hay posts disponibles</Text>
            </View>
          ) : null}
          ListFooterComponent={
            <View style={{marginVertical: posts.length === 0 ? 200: 30}}>
              {loading ? (
                <Loading/>
              ) : !hasMore && posts.length > 0 ? (
                <Text style={styles.noPosts}>No hay más posts</Text>
              ) : null}
            </View>
          }
        />

      </View>      
      {/* <View style={{padding: 20}}>
        <Button title="Cerrar sesión" onPress={onLogout} />
      </View> */}
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginHorizontal: wp(2),
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(6),
    fontWeight: theme.fonts.bold,
  },
  avatarImage: {
    height: hp(4.3),
    width: hp(4.3),
    borderRadius: theme.radius.sm,
    bonderCurve: 'continuous',
    bonrderColor: theme.colors.gray,
    borderWidth: 3,
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
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