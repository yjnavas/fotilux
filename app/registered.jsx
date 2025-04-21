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

const registered = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);
  const onSubmit = async () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        router.push('home');
      }, 2000);
  };
  return (
    <ScreenWrapper bg={theme.colors.background}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <BackButton router={router} />
        {/* welcome text */}
        <View>
          <Text style={styles.registeredText}>!Registro Exitoso!</Text>
        </View>
        {/* Sucesfull image */}
        <View style={styles.circularImageContainer}>
          <Image source={require('../assets/images/check.png')} resizeMode="cover" style={styles.circularImage} />
        </View>
          <Text style={styles.registeredSecondText}>!Ya puedes iniciar sesion! has click para volver al inicio</Text>

        {/* footer */}
        <View style={styles.footer}>
          {/* button */}
          <View style={{paddingTop: hp(4)}}>
            <Button buttonStyle={{backgroundColor: theme.colors.primaryWelcome, width: 160, height: 60, fontWeight: theme.fonts.extrabold }} hasShadow={false} title={'OK'} loading={loading} onPress={onSubmit} />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default registered

const styles = StyleSheet.create({
  container:{
    flex: 1,
    gap: 45,
    paddingHorizontal : wp(4),
    backgroundColor: theme.colors.background,
  },
  registeredText: {
    fontSize: hp(16),
    fontWeight: theme.fonts.bold,
    color: theme.colors.textWhite,
    textAlign: 'center',
  },
  registeredSecondText: {
    fontSize: hp(6),
    fontWeight: theme.fonts.bold,
    color: theme.colors.textWhite,
    textAlign: 'center',
  },
  imageContainer: {
    width: wp(25),
    height: hp(55),
    borderRadius: 100,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: hp(2),
    backgroundColor: '#f0f0f0',
  },
  label: {
    fontSize: hp(4),
    color: theme.colors.textWhite,
    marginBottom: 5,
    paddingLeft: hp(4),
  },
  circularImageContainer: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(50) / 2,
    overflow: 'hidden',
    alignSelf: 'center',
    marginVertical: hp(2),
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularImage: {
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
    textAlign: 'center',
    color: theme.colors.textWhite,    
  }
})