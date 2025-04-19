import { StyleSheet, Text, View, Button, Pressable, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { router, useRouter } from 'expo-router'
import { wp, hp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import Icon from '../../assets/icons'
import Avatar from '../../components/Avatar'
import { currentUser } from '../../constants/user'
import { getPosts } from '../../services/postServices'
import PostCard from '../../components/PostCard'
import Loading from '../../components/Loading'


var limit = 0;
const Home = () => {

  const user = currentUser;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    // Define la función asíncrona dentro del efecto
    const fetchPosts = async () => {
      let res = await getPosts(user?.id);
      if (res.success) {
        console.log('llego',res.data);
        setPosts(res.data);
      }
    };
  
    // Ejecuta la función
    fetchPosts();
  }, [user?.id]);

  const handleLoadMore = () => {
    setTimeout(() => {
      setLoading(true);
    }, 20000);
    setLoading(false);
  }

  const onLogout = () => {
    // llamado a la api
    limit = limit + 10;
    console.log('logout')
    router.replace('/login')
  }

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
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => 
            <PostCard
              item={item}
              currentUser={user}
              router={router}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            <View style={{marginVertical: posts.length == 0 ? 200: 30}}>
              <Loading/>
            </View>
          }
        />

      </View>      
      {/* <Button title="logout" onPress={onLogout} /> */}
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
    fontSize: hp(2),
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