import { StyleSheet, Text, View, Pressable, Alert, Image } from 'react-native'
import React, { useRef, useState } from 'react'
import { theme } from '../constants/theme'
import Icon from '../assets/icons'
import { StatusBar } from 'expo-status-bar'
import BackButton from '../components/BackButton'
import { useRouter } from 'expo-router'
import { wp, hp } from '../helpers/common'
import Input from '../components/Input'
import Button from '../components/Button'
import ScreenWrapper from '../components/ScreenWrapper'

const login = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);
  const onSubmit = async () => {
    if(!emailRef.current || !passwordRef.current){
      Alert.alert('Login', 'Please fill all the fields');
      return;
    }else{
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        router.push('home');
      }, 2000);
    }
  };
  return (
    <ScreenWrapper bg={theme.colors.background}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <BackButton router={router} />
        {/* login image */}
        <View style={styles.imageContainer}>
          <Image source={require('../assets/images/fotilux.jpeg')} resizeMode="cover" style={styles.loginImage} />
        </View>
        {/* form */}
        <View style={styles.form} role="form">
          <View>
            <Text style={styles.label}>Usuario</Text>
            <Input
              placeholder="Ingresa tu email"
              icon={<Icon name="mail" size={20} width={20} color={theme.colors.textLight} />}
              onChangeText={value=>emailRef.current = value}
              />
          </View>
          <View>
            <Text style={styles.label}>Contraseña</Text>
            <Input
              placeholder="Ingresa tu contraseña"
              icon={<Icon name="lock" size={20} width={20} color={theme.colors.textLight} />}
              secureTextEntry={true}
              onChangeText={value=>passwordRef.current = value}
            />
          </View>
          {/* <Text style={styles.forgotPassword}>
            Forgot password?
          </Text> */}
          {/* button */}
          <View style={{paddingTop: hp(4)}}>
            <Button buttonStyle={{backgroundColor: theme.colors.primaryWelcome}} hasShadow={false} title={'Iniciar Sesión'} loading={loading} onPress={onSubmit} />
          </View>
        </View>

        {/* footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ¿No tienes una cuenta?
          </Text>
          <Pressable onPress={() => router.push('signUp')}>
            <Text style={[styles.footerText, {color: theme.colors.textWhite, fontWeight: theme.fonts.semibold}]} >
              Registrate
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default login

const styles = StyleSheet.create({
  container:{
    flex: 1,
    gap: 45,
    paddingHorizontal : wp(4),
    backgroundColor: theme.colors.background,
  },
  label: {
    fontSize: hp(4),
    color: theme.colors.textWhite,
    marginBottom: 5,
    paddingLeft: hp(4),
  },
  imageContainer: {
    width: wp(25),
    height: hp(55),
    borderRadius: 60,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: hp(2),
    backgroundColor: '#f0f0f0',
  },
  loginImage: {
    width: '100%',
    height: '100%',
  },
  welcomeText:{
    fontSize: hp(8),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },
  form:{
    gap: 25,
  },
  forgotPassword:{
    textAlign: 'right',
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  footer:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  footerText:{
    fontSize: hp(4),
    textAlign: 'center',
    color: theme.colors.textWhite,    
  }
})