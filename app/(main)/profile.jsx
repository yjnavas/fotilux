import { Alert, StyleSheet, Text, TouchableOpacity, View, Platform, Pressable } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ScreenWrapper';
import Header from '../../components/Header';
import { hp, wp } from '../../helpers/common';
import { theme } from '../../constants/theme';
import Icon from '../../assets/icons';
import Avatar from '../../components/Avatar';

const Profile = () => {
    const router = useRouter();
    const user = {
        name: 'Yovani Navas',
        address: 'Calle de la República, 1, 28001 Madrid, España',
        email: 'yovanijnavas@gmail.com',
        phone: '+34 600 000 000',
        bio: 'Estudiante de ingeniería en la Universidad de Madrid, amante de la fotografía y de los videojuegos',
    };

  return (
    <ScreenWrapper bg={'white'}>
      <UserHeader user={user} router={router}/>
    </ScreenWrapper>
  )
}

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
            <View style={{gap: 15}}>
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
                {/* email, phone, bio */}
                <View style={{gap: 10}}>
                    <View style={styles.info}>
                        <Icon name="mail" size={20} color={theme.colors.textLight} />
                        <Text style={styles.infoText}>{user && user.email}</Text>
                    </View>
                </View>
                {
                    user && user.phone && (
                        <View style={styles.info}>
                            <Icon name="call" size={20} color={theme.colors.textLight} />
                            <Text style={styles.infoText}>{user && user.phone}</Text>
                        </View>
                    )
                }
                {
                    user && user.address && (
                        <View style={styles.info}>
                            <Icon name="location" size={20} color={theme.colors.textLight} />
                            <Text style={styles.infoText}>{user && user.address}</Text>
                        </View>
                    )
                }
                {
                    user && user.bio && (
                        <View style={styles.info}>
                            {/* <Icon name="call" size={20} color={theme.colors.textLight} /> */}
                            <Text style={styles.infoText}>{user && user.bio}</Text>
                        </View>
                    )
                }
            </View>
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
    infoText: {
        fontSize: hp(3.5),
        fontWeight: theme.fonts.semibold,
        color: theme.colors.textLight,
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
    }
})