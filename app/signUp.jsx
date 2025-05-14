import { StyleSheet, Text, View, Pressable, Alert, ScrollView, Platform } from 'react-native'
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
import { registerUser } from '../services/userServices'

const signUp = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const usernameRef = useRef("");
  const passwordRef = useRef("");
  const confirmPasswordRef = useRef("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8; // Minimum 8 characters
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!usernameRef.current) {
      newErrors.username = 'El nombre de usuario es requerido';
      isValid = false;
    }

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
    } else if (!validatePassword(passwordRef.current)) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
      isValid = false;
    }

    if (!confirmPasswordRef.current) {
      newErrors.confirmPassword = 'La confirmación de contraseña es requerida';
      isValid = false;
    } else if (confirmPasswordRef.current !== passwordRef.current) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
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
          name: usernameRef.current, // Using username as name for API
          mail: emailRef.current,
          password: passwordRef.current
        };

        const response = await registerUser(userData);
        console.log('response',response);
        if (response.success) {
          setLoading(false);
          if (Platform.OS === 'web') {
            const confirm = window.confirm('Registro Exitoso, Tu cuenta ha sido creada correctamente');
            if (confirm) router.push('registered');
          } else {
            Alert.alert('Registro Exitoso', 'Tu cuenta ha sido creada correctamente');
            router.push('registered');
          }
        } else {
          setLoading(false);
          if (Platform.OS === 'web') {
            const confirm = window.confirm(`Error a, ${response.msg}`);
            if (confirm) router.push('registered');
          } else {
            Alert.alert(`Error b, ${response.msg}`);
          }
        }
      } catch (error) {
        setLoading(false);
        Alert.alert('Error', 'Hubo un error al conectar con el servidor');
        console.log('Registration error:', error);
      }
    }
  };

  return (
    <ScreenWrapper bg={theme.colors.background}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <BackButton router={router} />
          {/* welcome text */}
          <View>
            <Text style={styles.welcomeText}>!Bienvenido!</Text>
            <Text style={styles.welcomeTextSecondary}>Ingresa los siguientes datos para completar tu registro.</Text>
          </View>
          {/* form */}
          <View style={styles.form} role="form">
            <View>
              <Text style={styles.label}>Nombre de Usuario</Text>
              <Input
                onChangeText={value => usernameRef.current = value}
                placeholder="Ingresa tu nombre de usuario"
                keyboardType="default"
                autoCapitalize="none"
              />
              {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
            </View>
            <View>
              <Text style={styles.label}>Correo Electrónico</Text>
              <Input
                onChangeText={value => emailRef.current = value}
                placeholder="ejemplo@correo.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>
            <View>
              <Text style={styles.label}>Contraseña</Text>
              <Input
                secureTextEntry={true}
                onChangeText={value => passwordRef.current = value}
                placeholder="Mínimo 8 caracteres"
                autoCapitalize="none"
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>
            <View>
              <Text style={styles.label}>Confirmar Contraseña</Text>
              <Input
                secureTextEntry={true}
                onChangeText={value => confirmPasswordRef.current = value}
                placeholder="Confirma tu contraseña"
                autoCapitalize="none"
              />
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>

            {/* button */}
            <View style={{paddingTop: hp(4)}}>
              <Button buttonStyle={{backgroundColor: theme.colors.primaryWelcome}} hasShadow={false} title={'Registrar'} loading={loading} onPress={onSubmit} />
              {/* footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  ¿Ya tienes una cuenta?
                </Text>
                <Pressable onPress={() => router.push('login')}>
                  <Text style={[styles.footerText, {color: theme.colors.textWhite, fontWeight: theme.fonts.semibold}]}>
                    Ingresar
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  )
}

export default signUp

const styles = StyleSheet.create({
  container:{
    flex: 1,
    gap: 30,
    paddingHorizontal : wp(4),
    paddingVertical: hp(4),
    backgroundColor: theme.colors.background,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: hp(3.5),
    marginTop: 5,
    paddingLeft: hp(4),
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
    gap: 20,
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