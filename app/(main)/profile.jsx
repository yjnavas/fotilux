import { Alert, StyleSheet, Text, TouchableOpacity, View, Platform, Pressable, FlatList, Image, Dimensions  } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '../../components/ScreenWrapper';
import Header from '../../components/Header';
import { hp, wp } from '../../helpers/common';
import { theme } from '../../constants/theme';
import Icon from '../../assets/icons';
import Avatar from '../../components/Avatar';
import { useAuth } from '../../context/AuthContext'
import { getUser } from '../../services/userServices';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(true);
  const router = useRouter();
  const { logout } = useAuth();
  const params = useLocalSearchParams();
  const userId = params.id;

  // Función para cargar datos del usuario
  const loadUserData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Si tenemos un userId como parámetro, cargamos ese usuario específico
      if (userId && userId !== null && userId !== undefined) {
        console.log('Cargando perfil de usuario con ID:', userId);
        setIsCurrentUser(false);
        
        const response = await getUser(userId);
        if (response.success) {
          setUser(response.data);
        } else {
          setError(response.msg || 'Error al cargar el perfil del usuario');
        }
      } else {
        // Si no hay userId, cargamos el usuario actual desde localStorage
        console.log('Cargando perfil del usuario actual desde localStorage');
        setIsCurrentUser(true);
        
        const userData = localStorage.getItem('currentUser');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setUser(parsedUserData);
        } else {
          setError('No se encontró información del usuario');
        }
      }
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      setError('Error al cargar el perfil: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos del usuario al montar el componente o cuando cambie el userId
  useEffect(() => {
    loadUserData();
  }, [userId]);

  // Log para depuración
  useEffect(() => {
    console.log('Updated user state in profile:', user);
    console.log('Is current user profile:', isCurrentUser);
  }, [user, isCurrentUser]);

  return (
    <ScreenWrapper bg={'white'}>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Cargando información del usuario...</Text>
        </View>
      ) : error ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: theme.colors.rose}}>{error}</Text>
          <TouchableOpacity 
            style={{marginTop: 20, padding: 10, backgroundColor: theme.colors.primary, borderRadius: theme.radius.sm}}
            onPress={() => router.back()}
          >
            <Text style={{color: 'white'}}>Volver</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <UserHeader 
          user={user} 
          router={router} 
          logout={logout} 
          isCurrentUser={isCurrentUser}
        />
      )}
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

const UserHeader = ({user, router, logout, isCurrentUser = true}) => {
    const onLogout = () => {
        console.log('logout')
        logout();
        // router.replace('/login')
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
    }
    return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: wp(2)}}>
        <View>
            <Header title="Perfil" mb={20} backToHome={true}/>
            {isCurrentUser && (
              <TouchableOpacity style={styles.loggoutButton} onPress={handleLogout}>
                  <Icon name="logout" color={theme.colors.rose}/>
              </TouchableOpacity>
            )}
        </View>
        <View style={styles.container}>
            <View style={{gap: 2}}>
                <View style={styles.avatarContainer}>
                    <Avatar
                        uri={"user?.image"}
                        size={hp(22)}
                        rounded={theme.radius.xxl*1.4}                        
                    />
                    {isCurrentUser && (
                      <Pressable style={styles.editIcon} onPress={()=>router.push('editProfile')}>
                          <Icon name="edit" strokeWidth={2.5} size={20} />
                      </Pressable>
                    )}
                </View>
                <View style={{alignItems: 'center', gap: 4}}>
                    <Text style={styles.userName}>{user.name}</Text>
                </View>
                {user && user.user_name && (
                <View style={{alignItems: 'center', gap: 4}}>
                  <Text style={styles.textUsername}>{user.user_name}</Text>
                </View>
                )}
                {/* email, phone, bio */}
                {
                    user && user.email && ( 
                <View style={{gap: 10, alignItems: 'center', width: '100%'}}>
                    <View style={styles.info}>
                        <Icon name="mail" size={18} width={18} color={theme.colors.textLight} />
                        <Text style={styles.infoText}>{user && user.email}</Text>
                    </View>
                </View>
                    )
                }
                {
                    user && user.phone && (
                        <View style={[styles.info, {alignSelf: 'center'}]}>
                            <Icon name="call" size={18} width={18} color={theme.colors.textLight} />
                            <Text style={styles.infoText}>{user && user.phone}</Text>
                        </View>
                    )
                }
                {
                    user && user.address && (
                        <View style={[styles.info, {alignSelf: 'center'}]}>
                            <Icon name="location" size={18} width={18} color={theme.colors.textLight} />
                            <Text style={styles.infoText}>{user && user.address}</Text>
                        </View>
                    )
                }
                {
                    user && user.bio && (
                        <View style={[styles.info, {alignSelf: 'center'}]}>
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
        justifyContent: 'center',
        gap: 10,
        textAlign: 'center',
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