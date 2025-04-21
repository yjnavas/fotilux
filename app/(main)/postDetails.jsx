import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { fetchPostDetails, createComment } from '../../services/postServices'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import { currentUser } from '../../constants/user'
import PostCard from '../../components/PostCard'
import Loading from '../../components/Loading'
import Input from '../../components/Input'
import Icon from '../../assets/icons'
import CommentItem from '../../components/CommentItem'

const postDetails = () => {
  const { id } = useLocalSearchParams();
  const user = currentUser;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [starLoading, setStarLoading] = useState(true);
  const inputRef = useRef(null);
  const commentRef = useRef('');
  const [post, setPost] = useState({});

  useEffect(() => {
    getPostDetails(id);
  }, [id])

  getPostDetails = async (id) => {
    // Agregar delay de 2 segundos
    const [res] = await Promise.all([
        fetchPostDetails(id),
        new Promise(resolve => setTimeout(resolve, 2000))
    ]);
    
    console.log('res', res);
    if(res.success) setPost(res.data);
    setStarLoading(false);
  }

  const onNewComment = async () => {
    if(!commentRef.current) return null;
    let data = {
      userId: user?.id,
      postId: post?.id,
      text: commentRef?.current,
    }
    setLoading(true);
    let res = await Promise.all([
      createComment(data),
      new Promise(resolve => setTimeout(resolve, 2000))
    ]);
    setLoading(false);
    console.log('llego hasta aca', res);
    if(res[0].success){
      if (Platform.OS === 'web') {
        const confirm = window.confirm("Comentario creado correctamente");
        if (confirm) router.push('home');
      } else {
        inputRef?.current?.clear();
        commentRef.current = '';
        Alert.alert('Exito', "Comentario creado correctamente", [
          { text: 'OK', onPress: router.push('home'), style: 'destructive' },
        ]);
      }
    }else{
      Alert.alert('Error', 'Error al crear el comentario');
    }
    console.log('res', res);
  }

  if(starLoading){
    return (
      <View style={styles.center}>
        <Loading color={theme.colors.primary} size="large" />
      </View>
    )
  }

  if(!post){
    return (
      <View style={[styles.center, { justifyContent: 'flex-start', marginTop: 100 }]}>
        <Text style={styles.notFound}>No se encontró el post</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        <PostCard
          item={{
            ...post, 
            // comments: [{count: post?.comments?.length}]
          }}
          currentUser={user}
          router={router}
          hasShadow={false}
          showMoreIcon={false}
          isDetail={true}
        />

        {/* commnet input */}
        <View style={styles.inputContainer}>
          <Input
            inputRef={inputRef}
            onChangeText={value => commentRef.current = value}
            placeholder="Escribe tu comentario..."
            placeholderTextColor={theme.colors.textLight}
            containerStyles={{ width: '82%' }}
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

        {/* commnets list */}
        <View style={styles.comments}>
          {
            post?.comments?.map((comment) => (
              <CommentItem
                key={comment?.id?.toString()}
                item={comment}
                // canDelete={user.id === comment?.user?.id || user?.id === post?.userId}
              />
            ))
          }
        </View>

      </ScrollView>
    </View>
  )
}

export default postDetails

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
})