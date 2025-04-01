import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import { hp } from '../helpers/common'
import Loading from './Loading'

const Button = ({
    buttonStyle,
    textStyle,
    title='',
    onPress=()=>{},
    loading=false,
    hasShadow=true,
}) => {
  const shadowStyle = {
    shadowColor: theme.colors.dark,
    shadowOffset: {
        width: 0,
        height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,

  }

  if (loading) {
    return (
      <View style={[styles.button, buttonStyle]}>
        <Loading/>
      </View>
    )
  }
  return (
    <Pressable onPress={onPress} style={[styles.button, buttonStyle, hasShadow && shadowStyle]}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  )
}

export default Button

const styles = StyleSheet.create({
    button: {
        backgroundColor: theme.colors.primary,
        height: hp(12.2),
        justifyContent: 'center',
        alignItems: 'center',
        borderCurve: 'continuous',
        borderRadius: theme.radius.xl,
        padding: 10,

    },
    text: {
        fontSize: hp(4),
        color: 'white',
        fontWeight: theme.fonts.bold,
    },
})