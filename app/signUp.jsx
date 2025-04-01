import { StyleSheet, Text, View, Pressable, Alert } from 'react-native'
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

const signUp = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const nameRef = useRef("");
  const surnameRef = useRef("");
  const usernameRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);
  const onSubmit = async () => {
    if(!emailRef.current || !passwordRef.current || !nameRef.current || !surnameRef.current || !usernameRef.current){
      Alert.alert('Sign Up', 'Please fill all the fields!');
      return;
    }else{
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        router.push('registered');
      }, 2000);
    }
  };
  return (
    <ScreenWrapper bg={theme.colors.background}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <BackButton router={router} />
        {/* welcome text */}
        <View>
          <Text style={styles.welcomeText}>!Bienvenido!</Text>
          <Text style={styles.welcomeTextSecondary}>Ingresa los siguientes datos para completar tu registro.</Text>
        </View>
        {/* form */}
        <View style={styles.form} role="form">
          <View style={styles.nameContainer}>
            <View style={styles.nameInputWrapper}>
              <Text style={styles.label}>Nombre</Text>
              <Input
                onChangeText={value => nameRef.current = value}
              />
            </View>
            <View style={styles.nameInputWrapper}>
              <Text style={styles.label}>Apellido</Text>
              <Input
                onChangeText={value => surnameRef.current = value}
              />
            </View>
          </View>
          <View>
            <Text style={styles.label}>Nombre de Usuario</Text>
            <Input
              onChangeText={value => usernameRef.current = value}
            />
          </View>
          <View>
            <Text style={styles.label}>Fecha de Nacimiento</Text>
            <Input              
              onChangeText={value => usernameRef.current = value}
            />
          </View>
          <View>
            <Text style={styles.label}>Correo Electronico</Text>
            <Input              
              onChangeText={value => emailRef.current = value}
            />
          </View>
          <View>
            <Text style={styles.label}>Contraseña</Text>
            <Input
              secureTextEntry={true}   
              onChangeText={value => passwordRef.current = value}
            />
          </View>
          {/* <Input
              icon={<Icon name="user" size={26} strokeWidth={1.6}/>}
              placeholder="Ingresa tu nombre"
              onChangeText={value=>nameRef.current = value}
            />
          <Input
            icon={<Icon name="mail" size={26} strokeWidth={1.6}/>}
            placeholder="Enter your email"
            onChangeText={value=>emailRef.current = value}
          />
          <Input
            icon={<Icon name="lock" size={26} strokeWidth={1.6}/>}
            placeholder="Enter your password"
            secureTextEntry={true}
            onChangeText={value=>passwordRef.current = value}
          /> */}
          {/* button */}
          <View style={{paddingTop: hp(4)}}>
            <Button buttonStyle={{backgroundColor: theme.colors.primaryWelcome}} hasShadow={false} title={'Registrar'} loading={loading} onPress={onSubmit} />
            {/* footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                ¿Ya tienes una cuenta?
              </Text>
              <Pressable onPress={() => router.push('login')}>
                <Text style={[styles.footerText, {color: theme.colors.textWhite, fontWeight: theme.fonts.semibold}]} >
                  Ingresar
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default signUp

const styles = StyleSheet.create({
  container:{
    flex: 1,
    gap: 30,
    paddingHorizontal : wp(4),
    backgroundColor: theme.colors.background,
  },
  welcomeText:{
    fontSize: hp(8),
    fontWeight: theme.fonts.bold,
    color: theme.colors.textWhite,
    textAlign: 'center',
  },
  welcomeTextSecondary:{
    fontSize: hp(5),
    fontWeight: theme.fonts.bold,
    color: theme.colors.textWhite,
    textAlign: 'center',
    paddingTop: hp(2),
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap:15,
  },
  nameInputWrapper: {
    flex: 1,
  },
  label: {
    fontSize: hp(4),
    color: theme.colors.textWhite,
    marginBottom: 5,
    paddingLeft: hp(4),
  },
  form:{
    gap: 25,
  },
  forgotPassword:{
    textAlign: 'right',
    fontWeight: theme.fonts.semibold,
    color: theme.colors.textWhite,
  },
  footer:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    paddingTop: hp(4),
  },
  footerText:{
    fontSize: hp(4),
    textAlign: 'center',
    color: theme.colors.textWhite,    
  }
})