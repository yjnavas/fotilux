import { StyleSheet, Text, View, Pressable, Alert, Image, Platform } from 'react-native'
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
import { useAuth } from '../context/AuthContext'

const login = () => {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!emailRef.current) {
      newErrors.email = 'El correo electrónico es requerido';
      isValid = false;
    } else if (!validateEmail(emailRef.current)) {
      newErrors.email = 'Correo electrónico inválido';
      isValid = false;
    }

    if (!passwordRef.current) {
      newErrors.password = 'La contraseña es requerida';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const onSubmit = async () => {
    if (validateForm()) {
      setLoading(true);

      try {
        const userData = {
          mail: emailRef.current,
          password: passwordRef.current
        };

        const response = await authLogin(userData);
        console.log('login response', response);

        if (response.success) {
          // Esperar un pequeño tiempo para asegurar que el estado de autenticación se actualice
          setTimeout(() => {
            setLoading(false);
            router.replace('/home');
          }, 300);
        } else {
          setLoading(false);
          if (Platform.OS === 'web') {
            window.alert(`Error: ${response.msg || 'Credenciales incorrectas'}`);
          } else {
            Alert.alert('Error', response.msg || 'Credenciales incorrectas');
          }
        }
      } catch (error) {
        setLoading(false);
        if (Platform.OS === 'web') {
          window.alert('Error al conectar con el servidor');
        } else {
          Alert.alert('Error', 'Error al conectar con el servidor');
        }
        console.log('Login error:', error);
      }
    }
  };

  return (
    <ScreenWrapper bg={theme.colors.background}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* <BackButton router={router} /> */}
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
              keyboardType="email-address"
              autoCapitalize="none"
              />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>
          <View>
            <Text style={styles.label}>Contraseña</Text>
            <Input
              placeholder="Ingresa tu contraseña"
              icon={<Icon name="lock" size={20} width={20} color={theme.colors.textLight} />}
              secureTextEntry={true}
              onChangeText={value=>passwordRef.current = value}
              autoCapitalize="none"
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
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
    paddingTop: 80,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: hp(3.5),
    marginTop: 5,
    paddingLeft: hp(4),
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