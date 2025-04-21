import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Header from '../../components/Header'

const followers = () => {
  return (
    <ScreenWrapper bg='white'>
    <View style={styles.container}>
      <Header title="Seguidores"/>
    <Text>followers</Text>
    </View>
    </ScreenWrapper>
  )
}

export default followers

const styles = StyleSheet.create({})