import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Header from '../../components/Header'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import Icon from '../../assets/icons'

const Notifications = () => {
  return (
    <ScreenWrapper bg='white'>
    <View style={styles.container}>
      <Header title="Notificaciones" backToHome={true}/>
      <ScrollView style={{gap: 20}}>
        <View>
          <Text style={styles.title}>Nuevas</Text>
        </View>
      </ScrollView>
    </View>
    </ScreenWrapper>
  )
}

export default Notifications

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(2),
  },
  title: {
    paddingTop: 20,
    fontSize: hp(4),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
    textAlign: 'left',
  },
})