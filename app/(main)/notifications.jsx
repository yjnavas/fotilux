import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Header from '../../components/Header'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import Icon from '../../assets/icons'
import NotificationsItem from '../../components/NotificationsItem'
import { useRouter } from 'expo-router'
import { currentUser } from '../../constants/user'
import { fetchNotifications } from '../../services/notificationsService'

const Notifications = () => {
  const router = useRouter();
  const user = currentUser;
  const [notifications, setNotifications] = React.useState([]);

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    const res = await fetchNotifications(user?.id);
    console.log('res', res);
    if(res.success){
      setNotifications(res.data);
    }
  }

  return (
    <ScreenWrapper bg='white'>
    <View style={styles.container}>
      <Header title="Notificaciones" backToHome={true}/>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listStyle}>
        {
          notifications.map((item) => (
            <NotificationsItem
              item={item}
              key={item.senderId}
              router={router} 
            />
          ))
        }
        {
          notifications.length === 0 && (
            <Text style={styles.noData}>No hay notificaciones aun</Text>
          )
        }
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
    backgroundColor: theme.colors.white,
  },
  listStyle: {
    paddingVertical: 20,
    gap: 10,
  },
  noData: {
    fontsize: hp(3),
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
    textAlign: 'center',
  },
  title: {
    paddingTop: 20,
    fontSize: hp(4),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
    textAlign: 'left',
  },
})