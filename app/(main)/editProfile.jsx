import { StyleSheet, Text, View, ScrollView, Pressable, Alert, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import ScreenWrapper from '../../components/ScreenWrapper'
import { Image } from 'expo-image'
import { getUserImageSrc } from '../../services/imageServices'
import Icon from '../../assets/icons'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { useRouter } from 'expo-router'

const EditProfile = () => {
    const currentUser = {
        name: 'Yovani Navas',
        address: 'Calle de la República, 1, 28001 Madrid, España',
        email: 'yovanijnavas@gmail.com',
        phone: '+34 600 000 000',
        bio: 'Estudiante de ingeniería en la Universidad de Madrid, amante de la fotografía y de los videojuegos',
        image: null,
    };

    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const [user, setUser] = useState({
      name: currentUser.name || '',
      address: currentUser.address || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      bio: currentUser.bio || '',
      image: currentUser.image || null,
    });

    const onSubmit = async () => {
      let UserData = {...user};
      let { name, address, email, phone, bio } = UserData;
      if(!name || !address || !email || !phone || !bio){
        if (Platform.OS === 'web') {
            const confirm = window.confirm("Por favor rellene todos los campos");
            if (confirm) onLogout();
          } else {
            Alert.alert('Error', "Por favor rellene todos los campos", [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'OK', onPress: onLogout, style: 'destructive' },
            ]);
          }
        return;
      }else{
        // setLoading(true);
        if (Platform.OS === 'web') {
          const confirm = window.confirm("Datos actualizados correctamente");
          if (confirm) router.push('profile');
        } else {
          Alert.alert('Exito', "Datos actualizados correctamente", [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'OK', onPress: router.push('profile'), style: 'destructive' },
          ]);
        }
      }
    }
    const onPickImage = async () => {
      //   const result = await ImagePicker.launchImageLibraryAsync({
      //       mediaTypes: ImagePicker.MediaTypeOptions.All,
      //       allowsEditing: true,
      //       aspect: [4, 3],
      //       quality: 1,
      //   }
      // );
    }
    let imageSource = getUserImageSrc(currentUser.image);
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