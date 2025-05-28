import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { fetchPostDetails, createComment, getPostComments, UpdatePost } from '../../services/postServices'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import PostCard from '../../components/PostCard'
import Loading from '../../components/Loading'
import Input from '../../components/Input'
import Icon from '../../assets/icons'
import CommentItem from '../../components/CommentItem'
import Button from '../../components/Button'
import { Image } from 'expo-image'
import imagen1 from '../../assets/images/imagen1.jpg'
import imagen2 from '../../assets/images/imagen2.jpg'
import imagen3 from '../../assets/images/imagen3.jpg'
import atardecer from '../../assets/images/atardecer.jpg'

const postDetails = () => {
  console.log('post?.userId === user?.id');
  const params = useLocalSearchParams();
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [starLoading, setStarLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [comments, setComments] = useState([]);
  // Edit-related state variables removed
  const inputRef = useRef(null);
  const commentRef = useRef('');
  const [post, setPost] = useState({});
  const [postId, setPostId] = useState(null);
  const [canDelete, setCanDelete] = useState(false);  
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
  
  // Separate useEffect to handle edit permission logic
  useEffect(() => {
    if (user && post) {
      console.log('user',user);
      console.log('post',post);
      const userCanDelete = post.user_id === user.id;
      console.log('Checking edit permission:', { postUserId: post.user_id, userId: user.id, userCanDelete });
      setCanDelete(userCanDelete);
    }
  }, [user, post]);  // This will run whenever user OR post changes
  
  
  // Image mapping for static imports
  const images = {
    'imagen1.jpg': imagen1,
    'imagen2.jpg': imagen2,
    'imagen3.jpg': imagen3,
    'atardecer.jpg': atardecer
  };

  // Extract and validate the post ID from params
  useEffect(() => {
    console.log('Params received:', params);
    const id = params.id;
    console.log('ID from params:', id);
    
    if (id && id !== 'undefined' && id !== 'null') {
      setPostId(id);
    } else {
      console.error('Invalid or missing post ID in params');
      setStarLoading(false);
    }
  }, [params]);

  // Fetch post details and comments once we have a valid ID
  useEffect(() => {
    if (postId) {
      console.log('Fetching post details for ID:', postId);
      getPostDetails(postId);
      fetchComments(postId);
    }
  }, [postId]);
  
  // Listen for global like state changes
  useEffect(() => {
    if (!post?.id) return;
    
    const handleLikeStateChange = (event) => {
      try {
        // If this event is for this specific post, update the post data
        if (event && event.detail && event.detail.postId === post.id.toString()) {
          console.log(`Updating post ${post.id} in postDetails with new like info:`, event.detail);
          
          // Update the post with the new like information
          setPost(currentPost => ({
            ...currentPost,
            // Update likes count if provided in the event
            likes: Array.isArray(currentPost.likes) 
              ? (event.detail.isLiked 
                ? [...currentPost.likes.filter(like => like.userId !== user?.id), { userId: user?.id, postId: currentPost.id }]
                : currentPost.likes.filter(like => like.userId !== user?.id))
              : []
          }));
        }
      } catch (error) {
        console.error('Error handling like state change in postDetails:', error);
      }
    };
    
    // Add event listener
    window.addEventListener('globalLikeStateChanged', handleLikeStateChange);
    
    // Clean up
    return () => {
      window.removeEventListener('globalLikeStateChanged', handleLikeStateChange);
    };
  }, [post?.id, user?.id]);

  // Check initial like state from localStorage when post is loaded
  useEffect(() => {
    if (post?.id && user?.id) {
      try {
        const globalLikeState = localStorage.getItem('globalLikeState') || '{}';
        const likeStates = JSON.parse(globalLikeState);
        const postState = likeStates[post.id.toString()];
        
        if (postState) {
          console.log(`Found initial global like state for post ${post.id} in postDetails:`, postState);
          // No need to set a separate state, the PostCard component will handle this
        }
      } catch (error) {
        console.error('Error checking initial global like state in postDetails:', error);
      }
    }
  }, [post?.id, user?.id]);

  const getPostDetails = async (id) => {
    try {
      setStarLoading(true);
      // Fetch post details with a 2 second delay for loading state
      const [res] = await Promise.all([
          fetchPostDetails(id),
          new Promise(resolve => setTimeout(resolve, 2000))
      ]);
      
      console.log('Post details response:', res);
      if (res.success) {
        console.log('Post details response:', res.data);
        setPost(res.data);
      } else {
        console.error('Failed to fetch post details:', res.msg);
        if (Platform.OS === 'web') {
          window.alert('Error al cargar el post: ' + res.msg);
        } else {
          Alert.alert('Error', 'No se pudo cargar el post: ' + res.msg);
        }
      }
    } catch (error) {
      console.error('Error fetching post details:', error);
      if (Platform.OS === 'web') {
        window.alert('Error al cargar el post');
      } else {
        Alert.alert('Error', 'Error al cargar el post');
      }
    } finally {
      setStarLoading(false);
    }
  };
  
  const removeCommentFromState = (commentId) => {
    // Filtrar el comentario eliminado del estado
    setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
  };

  const fetchComments = async (postId) => {
    try {
      setCommentLoading(true);
      const res = await getPostComments(postId);
      if (res.success) {
        setComments(res.data || []);
      } else {
        console.error('Error fetching comments:', res.msg);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  const onNewComment = async () => {
    if(!commentRef.current) return null;
    let data = {
      content: commentRef?.current,
    };
    setLoading(true);
    let res = await Promise.all([
      createComment(data,post?.id),
      new Promise(resolve => setTimeout(resolve, 2000))
    ]);
    setLoading(false);
    console.log('Comment response:', res);
    if(res[0].success){
      commentRef.current = null;
      
      // Add the new comment to the list
      const newComment = {
        id: Date.now(), // Temporary ID until refresh
        content: data.content,
        user: {
          id: user.id,
          name: user.name,
          image: user.image
        },
        createdAt: new Date().toISOString()
      };
      
      setComments(prevComments => [newComment, ...prevComments]);
      
      // Show success message
      if (Platform.OS === 'web') {
        window.alert("Comentario creado correctamente");
      } else {
        Alert.alert('Éxito', "Comentario creado correctamente");
      }
    } else {
      if (Platform.OS === 'web') {
        window.alert('Error al crear el comentario');
      } else {
        Alert.alert('Error', 'Error al crear el comentario');
      }
    }
  };
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.list}>
        {starLoading ? (
          <View style={styles.center}>
            <Loading color={theme.colors.primary} size="large" />
          </View>
        ) : !post?.id ? (
          <View style={styles.center}>
            <Text style={styles.notFound}>Post no encontrado</Text>
          </View>
        
        ) : (
          <>
            {/* Edit button removed */}
            
            <PostCard 
              item={{
                ...post,
                // Ensure we have a valid image source
                file: post.file && images[post.file] ? post.file : 'imagen1.jpg',
                userId: post.user_id // Make sure userId is properly passed
              }} 
              currentUser={user}
              router={router}
              isDetail={true}
              showMoreIcon={true}
            />
          </>
        )}
        
        {/* Sección de comentarios - solo visible cuando no está cargando */}
        {!starLoading && (
          <>
            {/* comment input */}
            <View style={styles.inputContainer}>
              <Input
                ref={inputRef}
                placeholder="Escribe un comentario..."
                onChangeText={(text) => commentRef.current = text}
                style={{ flex: 1 }}
                containerStyles={{ width: '80%' }}
              />
              {
                loading ? (
                  <View style={styles.loading}>
                    <Loading color={theme.colors.primary} size="small" />
                  </View>
                ) : (
                  <TouchableOpacity style={styles.sendIcon} onPress={onNewComment}>
                    <Icon name="send" color={theme.colors.primary} />
                  </TouchableOpacity>
                )
              }
            </View>

            {/* comments list */}
            <View style={styles.comments}>
              {commentLoading ? (
                <View style={styles.center}>
                  <Loading color={theme.colors.primary} size="small" />
                </View>
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                  <CommentItem
                    key={comment?.id?.toString()}
                    item={comment}
                    canDelete={user.id === comment?.user?.id || user?.id === post?.userId}
                    onDeleteSuccess={removeCommentFromState}
                  />
                ))
              ) : (
                <Text style={styles.noComments}>No hay comentarios aún</Text>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default postDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingVertical: wp(7),
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginVertical: hp(5),
  },
  list: {
    paddingHorizontal: wp(2),
  },
  sendIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.8,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    borderCurve: 'continuous',
    height: hp(12),
    width: hp(12),
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFound:{
    fontSize: hp(4),
    color: theme.colors.text,
    fontWeight: theme.fonts.medium,
  },
  loading: {
    height: hp(5.8),
    width: hp(5.8),
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ scale: 1.3 }],
  },
  comments: {
    marginBottom: hp(5),
  },
  noComments: {
    fontSize: hp(3.5),
    color: theme.colors.textLight,
    textAlign: 'center',
    marginTop: hp(5),
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: hp(3),
  },
  // Edit-related styles removed
});