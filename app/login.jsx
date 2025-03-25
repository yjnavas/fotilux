import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Home from '../assets/icons/Home'
import { theme } from '../constants/theme'

const login = () => {
  return (
    <View>
      <Text>login</Text>
      <Home strokeWidth={2} color={theme.colors.primary} />
    </View>
  )
}

export default login

const styles = StyleSheet.create({})