import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import { hp, wp } from '../helpers/common'
import Avatar from './Avatar'

const NotificationsItem = ({
    item,
    router,
}) => {
    const handleClick = () => {
        router.push({pathname: 'postDetails', params: {id: item?.id}});
    }
  return (
    <View style={[styles.content, { display: 'flex', flexDirection: 'row', alignItems: 'center' }]}>
    <TouchableOpacity styles={styles.container} onPress={handleClick}>
        <View style={styles.userInfo}>
            <Avatar
                // uri={item?.data?.userPhoto}
                size={hp(10)}
            />
        <Text style={[styles.text, {width: wp(30), textAlign: 'left'}]}>{item?.title}</Text>
        </View>
    </TouchableOpacity>
    </View>
  )
}

export default NotificationsItem

const styles = StyleSheet.create({
    container: {
        fleX: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 18,
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: theme.colors.white,
        padding: 15,
        borderRadius: theme.radius.xxl,
        borderCurve: 'continuous',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 30,
    },
    content: {
        backgroundColor: 'rgba(0,0,0,0.06)',
        flex: 1,
        gap: 5,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: theme.radius.md,
        borderCurve: 'continuous',
      },
    nameTitle: {
        flex: 1,
        gap: 2,
    },
    text: {
        fontSize: hp(4),
        fontWeight: theme.fonts.medium,
        color: theme.colors.text,
    },
})