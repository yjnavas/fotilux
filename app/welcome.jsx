import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { StatusBar } from 'expo-status-bar'
import { wp, hp } from '../helpers/common'
import { Image } from 'react-native'
import { theme } from '../constants/theme'
import Button from '../components/Button'
import { useRouter } from 'expo-router'

const Welcome = () => {
  const router = useRouter()
  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* welcome image */}
        <Image source={require('../assets/images/react-logo.png')} resizeMode="contain" style={styles.welcomeImage} />
        {/* title */}
        <View style={{gap:20}}>
          <Text style={styles.title}>Fotilux!</Text>
          <Text style={styles.punchline}>Where every thought finds a home and every image tells a story.</Text>
        </View>
        {/* footer */}
        <View style={styles.footer}>
            <Button
              title="Getting Started"
              buttonStyle={{ marginHorizontal: wp(3) }}
              onPress={() => router.push('signUp')}
            />
            <View style={styles.bottomTextContainer} >
                <Text style={styles.loginText}>
                    Already have an account?
                </Text>
                <Pressable onPress={() => router.push('login')}>
                    <Text style={[styles.loginText, {color: theme.colors.primaryDark, fontWeight: theme.fonts.bold}]} >
                        Login
                    </Text>
                </Pressable>
            </View>
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Welcome

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
      backgroundColor: 'white',
      paddingHorizontal: wp(4),
    },
    welcomeImage: {
      width: wp(40),
      height: hp(30),
      alignSelf : 'center',
    },
    title: {
      color : theme.colors.text,
      fontSize: hp(8),
      textAlign: 'center',
      fontWeight: theme.fonts.extrabold,
    },
    punchline: {
      color : theme.colors.text,
      fontSize: hp(4),
      textAlign: 'center',
      paddingHorizontal: wp(4),
      fontWeight: theme.fonts.medium,
    },
    footer: {
      gap: 30,
      width: '100%',
    },
    loginText: {
      color: theme.colors.primary,
      fontSize: hp(3),
      textAlign: 'center',
    },
    bottomTextContainer:{
      flexDirection : 'row',
      justifyContent: 'center',
      alignItems  : 'center',
      gap: 5,
    },
    loginText:{
      textAlign: 'center',
      color: theme.colors.text,
      fontSize: hp(3),
    }
})