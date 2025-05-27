import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Pressable, Platform, Alert } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import Header from '../../components/Header'
import Avatar from '../../components/Avatar'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Icon from '../../assets/icons'
import Button from '../../components/Button'
import * as ImagePicker from 'expo-image-picker'
import { fetchPostDetails, createPost } from '../../services/postServices'
import Loading from '../../components/Loading'

const NewPost = ({}) => {
  const [post, setPost] = useState(null);
  const [starLoading, setStarLoading] = useState(true);
  const [postContent, setPostContent] = useState('');
  const { postId } = useLocalSearchParams();

  const [user, setUser] = useState(null);
  const router = useRouter();
  
  // Obtener datos del usuario desde localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
    }
  }, []);

  const bodyRef = useRef("");
  const editorRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const getPostDetails = async (id) => {
    try {
      const [res] = await Promise.all([
        fetchPostDetails(id),
        new Promise(resolve => setTimeout(resolve, 2000))
      ]);
      
      if(res.success) {
        setPost(res.data);
        setFile(res.data?.file || null);
        bodyRef.current = res.data.body;
        
        // Timeout para asegurar renderizado del editor
        setTimeout(() => {
          editorRef?.current?.setContentHTML(res.data.body);
        }, 300);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setStarLoading(false);
    }
  };

  useEffect(() => {
    if(postId) getPostDetails(postId);
    else setStarLoading(false); // Caso para nuevo post
  }, [postId])

  const onPick = async () => {
    let mediaConfig = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    }
    let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);

    if (result.canceled) {
      setUser({...user, image: result.assets[0]});
    }

    if(!result.canceled){
      setFile(result.assets[0]);
    }
  }

  useEffect(() => {
    if(post && post.id){
      bodyRef.current = post.body;
      setFile(post.file || null);
      setTimeout(() => {
        editorRef?.current?.setContentHTML(post.body);
      }, 300); 
    }
  }, [user]);

  const getFileUri = (file) => {
    if(!file) return null;
    if(isLocalFile(file)){
      return file.uri;
    }
    return file.uri;
    // return getImageService(file)?uri;
  }

  const onSubmit = async () => {
    if(!postContent){
      if (Platform.OS === 'web') {
        alert('Por favor, escribe algo en tu post');
      } else {
        Alert.alert('Aviso', 'Por favor, escribe algo en tu post');
      }
      return;
    }

    setLoading(true);
    try {
      const postData = {
        // title: '', // El título es opcional según el esquema del backend
        body: postContent,
      };

      // El ID del usuario ahora se extrae del token en el backend
      const response = await createPost(postData);
      console.log('user', user)
      if (response.success) {
        setPostContent(''); // Limpiar el contenido después de publicar
        if (Platform.OS === 'web') {
          const confirm = window.confirm(response.data?.message || "Post realizado correctamente");
          if (confirm) router.push('home');
        } else {
          Alert.alert('Éxito', response.data?.message || "Post realizado correctamente", [
            { text: 'OK', onPress: () => router.push('home'), style: 'default' },
          ]);
        }
        router.push('home');
      } else {
        throw new Error(response.msg || 'Error al crear el post');
      }
    } catch (error) {
      if (Platform.OS === 'web') {
        alert(`Error al crear el post: ${error.message}`);
      } else {
        Alert.alert('Error', `Error al crear el post: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  }

  const isLocalFile = (file) => {
    if(!file) return null;
    if(typeof file === 'object') return true;
  }

  const getFileType = (file) => {
    if(!file) return null;
    if(isLocalFile(file)){
      return file.type;
    }
    if(file.includes('postImage')){
      return 'image';
    }
    return 'image';
  }

  return (
    <ScreenWrapper bg='white'>
      <View style={styles.container}>
        <Header title={post && post.id ? 'Editar Post' : 'Crear Post'} backToHome={true}/>
        <ScrollView style={{gap: 20}}>
          
          {/* avatar */}
          <View style={styles.header}>
            <Avatar
              uri={user?.image}
              size={hp(12)}
              rounded={theme.radius.md}
            />
            <View style={{gap: 2}}>
              <Text style={styles.username}>
                {
                  user && user.name
                }
              </Text>
              <Text style={styles.publicText}>
                Public
              </Text>
            </View>
          </View>


          {
            file && (
              <View style={{ marginTop: 20 }}>
                <View style={styles.file}>
                  {
                    <Image source={{uri: getFileUri(file)}} resizeMode='cover' style={{flex: 1}} />
                  }
                </View>
                <Pressable style={styles.closeIcon} onPress={()=>setFile(null)}>
                  <Icon name="delete" strokeWidth={2.5} size={25} color={theme.colors.textWhite} />
                </Pressable>
              </View>
            )
          }

          {
            !file && (              
              <TouchableOpacity onPress={() => onPick()}>
                <View style={styles.media}>
                  <Text style={styles.addImageText}>Agregar imagen a tu post</Text>
                  <View style={styles.mediaIcons}>
                        <Icon name="image" strokeWidth={2.5} size={30} color={theme.colors.textDark} />
                  </View>
                </View>
              </TouchableOpacity>            
            )
          }
          

          <View style={[styles.textEditor, { width: '100%' }]}>
            <textarea
              style={{
                width: '100%',
                minHeight: '200px',
                padding: wp(2),
                borderRadius: theme.radius.xl,
                borderColor: theme.colors.gray,
                borderWidth: '1.5px',
                fontSize: hp(3.5),
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="¿Qué estás pensando?"
            />
          </View>

        </ScrollView>
        {
          starLoading ? (
            <Loading color={theme.colors.primary} size="large" />
          ) : (
            <Button 
              title={post && post.id ? 'Editar' : 'Publicar'}
              loading={loading}
              hasShadow={false}
              onPress={onSubmit}
            />
          )
        }
      </View>
    </ScreenWrapper>
  )
}

export default NewPost

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 30,
    paddingHorizontal: wp(2),
    gap: 15,
    maxWidth: '100%',
    overflow: 'hidden',
  },
  title: {
    fontSize: hp(2.5),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
    textAlign: 'center',
  },
  header:{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  username: {
    fontSize: hp(4),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  avatar: {
    heigth: hp(6.5),
    width: hp(6.5),
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  publicText: {
    fontSize: hp(3),
    fontWeight: theme.fonts.medium,
    color: theme.colors.textLight,
  },
  textEditor: {
    marginTop: 20,
  },
  media: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    padding: 12,
    paddingHorizontal: 18,
    borderRadius: theme.radius.xl,
    borderCurve: 'continous',
    borderColor: theme.colors.gray,
  },
  mediaIcons:{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  addImageText: {
    fontSize: hp(4),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  imageIcon: {
    borderRadius: theme.radius.md,
  },
  file: {
    height: hp(85),
    width: '100%',
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    borderCurve: 'continous',
  },
  video: {},
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 6,
    borderRadius: theme.radius.xxl*1.44,
    backgroundColor: 'rgba(255,0,0,0.6)',
  }
})