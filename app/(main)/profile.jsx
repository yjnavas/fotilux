import { Alert, StyleSheet, Text, TouchableOpacity, View, Platform, Pressable, FlatList, Image, Dimensions  } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ScreenWrapper';
import Header from '../../components/Header';
import { hp, wp } from '../../helpers/common';
import { theme } from '../../constants/theme';
import Icon from '../../assets/icons';
import Avatar from '../../components/Avatar';
import { currentUser } from '../../constants/user'

const Profile = () => {
  const user = currentUser;
  const router = useRouter();
  return (
    <ScreenWrapper bg={'white'}>
      <UserHeader user={user} router={router}/>
    </ScreenWrapper>
  )
}
const images = [
  require('../../assets/images/imagen1.jpg'),
  require('../../assets/images/imagen2.jpg'),
  require('../../assets/images/imagen3.jpg'),
  require('../../assets/images/imagen2.jpg'),
  require('../../assets/images/imagen3.jpg'),
  require('../../assets/images/imagen1.jpg'),
  require('../../assets/images/imagen3.jpg'),
  require('../../assets/images/imagen1.jpg'),
  require('../../assets/images/imagen2.jpg'),
];

const renderItem = ({ item, router }) => (
  
<TouchableOpacity 
    style={styles.imageContainer}
    onPress={() => router.push({ pathname: 'postDetails', params: { id: '1' }})}
>
    <Image source={item} style={styles.image} />
</TouchableOpacity>
);

const UserHeader = ({user,router}) => {
    const onLogout = () => {
        console.log('logout')
        router.replace('/login')
    }

    const handleLogout = async () => {
        if (Platform.OS === 'web') {
            const confirm = window.confirm("¿Desea salir de la aplicación?");
            if (confirm) onLogout();
          } else {
            Alert.alert('Confirmar', "¿Desea salir de la aplicación?", [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'OK', onPress: onLogout, style: 'destructive' },
            ]);
          }
        // router.replace('/login')
        // Alert.alert('Confirmar', "Desea salir de la aplicación?", [
        //     {
        //         text: 'Cancelar',
        //         onPress: () => console.log('modal Cancel'),
        //         style: 'cancel',
        //     },            
        //     {
        //         text: 'OK',
        //         onPress: () => onLogout(),
        //         style: 'destructive',
        //     },
        // ]);
    }
    return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: wp(2)}}>
        <View>
            <Header title="Perfil" mb={20} backToHome={true}/>
            <TouchableOpacity style={styles.loggoutButton} onPress={handleLogout}>
                <Icon name="logout" color={theme.colors.rose}/>
            </TouchableOpacity>
        </View>
        <View style={styles.container}>
            <View style={{gap: 2}}>
                <View style={styles.avatarContainer}>
                    <Avatar
                        uri={"user?.image"}
                        size={hp(22)}
                        rounded={theme.radius.xxl*1.4}                        
                    />
                    <Pressable style={styles.editIcon} onPress={()=>router.push('editProfile')}>
                        <Icon name="edit" strokeWidth={2.5} size={20} />
                    </Pressable>
                </View>
                <View style={{alignItems: 'center', gap: 4}}>
                    <Text style={styles.userName}>{user.name}</Text>
                </View>
                <View style={{alignItems: 'center', gap: 4}}>
                  <Text style={styles.textUsername}>{user && user.username}</Text>
                </View>
                {/* email, phone, bio */}
                {/* <View style={{gap: 10}}>
                    <View style={styles.info}>
                        <Icon name="mail" size={18} width={18} color={theme.colors.textLight} />
                        <Text style={styles.infoText}>{user && user.email}</Text>
                    </View>
                </View>
                {
                    user && user.phone && (
                        <View style={styles.info}>
                            <Icon name="call" size={18} width={18} color={theme.colors.textLight} />
                            <Text style={styles.infoText}>{user && user.phone}</Text>
                        </View>
                    )
                }
                {
                    user && user.address && (
                        <View style={styles.info}>
                            <Icon name="location" size={18} width={18} color={theme.colors.textLight} />
                            <Text style={styles.infoText}>{user && user.address}</Text>
                        </View>
                    )
                } */}
                {
                    user && user.bio && (
                        <View style={styles.info}>
                            <Text style={styles.infoText}>{user && user.bio}</Text>
                        </View>
                    )
                }

                <View style={{ flexDirection: 'row', gap: 10, marginTop: 20, justifyContent: 'space-evenly',  zIndex: 1  }}>
                    <Pressable style={styles.textFollow}>
                      <Text style={styles.descText}>Posts</Text>
                      <Text style={styles.infoText}>9</Text>
                    </Pressable>
                    <Pressable style={styles.textFollow} onPress={()=>router.push('followers')}>
                      <Text style={styles.descText}>Seguidores</Text>
                      <Text style={styles.infoText}>200K</Text>
                    </Pressable>
                    <Pressable style={styles.textFollow} onPress={()=>router.push('following')}>
                      <Text style={styles.descText}>Siguiendo</Text>
                      <Text style={styles.infoText}>2K</Text>
                    </Pressable>
                </View>

                <View 
                  style={{
                      height: 1,
                      width: '100%',
                      backgroundColor: '#CCCCCC',
                      marginVertical: 10
                  }}
                />
            </View>
            <FlatList
              data={images}
              renderItem={(item) => renderItem({ ...item, router })}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
              contentContainerStyle={styles.gridContainer}
              showsVerticalScrollIndicator={false}
            />
        </View>

    </View> 
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: wp(2),
    },
    headerContainer:{
        marginHorizontal: wp(4),
        marginBottom: 20,
    },
    headerShape: {
        width: wp(100),
        height: hp(20),
    },
    avatarContainer: {
        height: hp(22),
        width: hp(22),
        alignSelf: 'center',
    },
    editIcon: {
        positon: 'absolute',
        bottom: 24,
        right: -52,
        padding: 3,
        borderRadius: 50,
        backgroundColor: 'white',
        shadowColor: theme.colors.textLight,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 7,
        width: hp(9),
    },
    textFollow: {
      color: theme.colors.text,
      fontSize: hp(3),
      justifyContent: 'center',
      alignItems: 'center',
    },
    textUsername:{
      color: theme.colors.text,
      fontSize: hp(4),
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: theme.fonts.bold,
      marginBottom: 10,
    },
    userName: {
        fontSize: hp(6),
        fontWeight: theme.fonts.medium,
        color: theme.colors.textDark,
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    descText: {
      fontSize: hp(4),
      fontWeight: theme.fonts.bold, 
      color: theme.colors.text,
      textAlign: 'center',
    },
    infoText: {
        fontSize: hp(3.5),
        fontWeight: theme.fonts.semibold,
        color: theme.colors.textLight,
        textAlign: 'center',
    },
    loggoutButton: {
        position: 'absolute',
        right: 0,
        padding: 5,
        borderRadius: theme.radius.sm,
        backgroundColor: '#fee2e2',
    },
    listStyle: {
        paddingHorizontal: hp(2),
        paddingBottom: 30,
    },
    noPosts:{
        fontSize: hp(2),
        textAlign: 'center',
        color: theme.colors.text,
    },
    gridContainer: {
      paddingTop: 20,
      paddingBottom: 20,
    },
    imageContainer: {
        width: (Dimensions.get('window').width - 4 * wp(2)) / 3,
        height: (Dimensions.get('window').width - 4 * wp(2)) / 3,
        backgroundColor: theme.colors.grayLight,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
})