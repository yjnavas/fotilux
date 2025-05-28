import { StyleSheet, Text, View, ScrollView, Pressable, Alert, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import ScreenWrapper from '../../components/ScreenWrapper'
import { Image } from 'expo-image'
import { getUserImageSrc, uploadFile } from '../../services/imageServices'
import Icon from '../../assets/icons'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { updateUser } from '../../services/userServices'
import { currentUser } from '../../constants/user'

const EditProfile = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();
    const [user, setUser] = useState({
      name: currentUser.name || '',
      address: currentUser.address || '',
      user_name: currentUser.user_name || '',
      phone: currentUser.phone || '',
      bio: currentUser.bio || '',
      image: currentUser.image || null,
    });
    
    useEffect(() => {
      try {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setUser({
            id: parsedUserData.id,
            name: parsedUserData.name || '',
            address: parsedUserData.address || '',
            user_name: parsedUserData.user_name || '',
            phone: parsedUserData.phone || '',
            bio: parsedUserData.bio || '',
            image: parsedUserData.image || null,
          });
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
      }
    }, []);

    const onSubmit = async () => {
      setError(null);
      let userData = {...user};
      let { name, address, user_name, phone, bio, image } = userData;
      
      if(!name) {
        setError("Por favor rellene al menos el nombre");
        if (Platform.OS === 'web') {
          window.alert("Por favor rellene al menos el nombre");
        } else {
          Alert.alert('Error', "Por favor rellene al menos el nombre", [
            { text: 'OK', style: 'default' },
          ]);
        }
        return;
      }
      
      setLoading(true);
      
      try {
        if(typeof image === 'object' && image !== null) {
          let imageRes = await uploadFile('profiles', image.uri);
          if(imageRes.success) {
            userData.image = imageRes.data;
          } else {
            userData.image = null;
          }
        }
        
        const userDataStr = localStorage.getItem('currentUser');
        let userId = null;
        
        if (userDataStr) {
          const currentUserData = JSON.parse(userDataStr);
          userId = currentUserData.id;
        }
        
        if (!userId) {
          throw new Error('No se pudo obtener el ID del usuario');
        }
        
        const res = await updateUser(userId, userData);
        
        if(res.success) {
          if (Platform.OS === 'web') {
            window.alert("Datos actualizados correctamente");
            router.push('profile');
          } else {
            Alert.alert('Éxito', "Datos actualizados correctamente", [
              { text: 'OK', onPress: () => router.push('profile') },
            ]);
          }
        } else {
          throw new Error(res.msg || 'Error al actualizar los datos');
        }
      } catch (error) {
        console.error('Error al actualizar perfil:', error);
        setError(error.message || 'Error al actualizar el perfil');
        
        if (Platform.OS === 'web') {
          window.alert(error.message || 'Error al actualizar el perfil');
        } else {
          Alert.alert('Error', error.message || 'Error al actualizar el perfil', [
            { text: 'OK', style: 'default' },
          ]);
        }
      } finally {
        setLoading(false);
      }
    }
    const onPickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!result.canceled) {
          setUser({...user, image: result.assets[0]});
        }

        if(result.success){

        }
      
    }
    let imageSource = user.image ? 
      (typeof user.image === 'object' ? { uri: user.image.uri } : getUserImageSrc(user.image)) 
      : getUserImageSrc();
  return (
    <ScreenWrapper bg={'white'}>
      <View style={styles.container}>
        <ScrollView style={{flex: 1}}>
            <Header title="Editar Perfil" mb={20}/>
            {/* form */}
            <View style={styles.form}>
              <View style={styles.avatarContainer}>
                  <Image source={imageSource} style={styles.avatar} />
                  <Pressable style={styles.cameraIcon} onPress={onPickImage}>
                        <Icon name="camera" strokeWidth={2.5} size={20} />
                  </Pressable>
              </View>
              <Text style={{fontSize: hp(3.5), color: theme.colors.text, alignSelf: 'center'}}>
                Por favor rellene los campos que desee modificar
              </Text>
              <Input
                icon={<Icon name="user"/>}
                placeholder="Ingresa tu nombre"
                value={user.name}
                onChangeText={value => setUser({...user, name: value})}
              />
              <Input
                icon={<Icon name="mail"/>}
                placeholder="Ingresa tu nombre de usuario"
                value={user.user_name}
                onChangeText={value => setUser({...user, user_name: value})}
              />
              <Input
                icon={<Icon name="call"/>}
                placeholder="Ingresa tu numero de teléfono"
                value={user.phone}
                onChangeText={value => setUser({...user, phone: value})}
              />
              <Input
                icon={<Icon name="location"/>}
                placeholder="Ingresa tu dirección"
                value={user.address}
                onChangeText={value => setUser({...user, address: value})}
              />
              <Input
                placeholder="Ingresa tu Biografía"
                multiline={true}
                containerStyles={styles.bio}
                value={user.bio}
                onChangeText={value => setUser({...user, bio: value})}
              />
              <Button title={'Actualizar'} loading={loading} onPress={onSubmit} />
            </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  )
}

export default EditProfile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp(2),
    },
    avatarContainer: {
        height: hp(22),
        width: hp(22),
        alignSelf: 'center',
    },
    avatar: {
        height: '100%',
        width: '100%',  
        borderRadius: theme.radius.xxl*1.4,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: theme.colors.darkLight,
    },
    cameraIcon: {
        // position: 'absolute',
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
    form: {
        gap: 18,
        paddingHorizontal: wp(2),
        // marginTop: 20,
    },
    input:{
        flexDirection: 'row',
        borderWidth: 0.4,
        borderColor: theme.colors.text,
        borderRadius: theme.radius.xxl,
        borderCurve: 'continuous',
        padding: 17,
        paddingHorizontal: 20,
        gap: 15,
    },
    bio: {
        flexDirection: 'row',
        height: hp(25),
        alignItems: 'flex-start',
        paddingVertical: 15,
    }
})