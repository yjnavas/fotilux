import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Header from '../../components/Header'

const following = () => {
  return (
    <ScreenWrapper bg='white'>
    <View style={styles.container}>
      <Header title="Siguiendo"/>
    <Text>following</Text>
    </View>
    </ScreenWrapper>
  )
}

export default following

const styles = StyleSheet.create({})