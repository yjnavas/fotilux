import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState} from 'react'
import { theme } from '../constants/theme'
import { hp, wp } from '../helpers/common'
import Avatar from './Avatar'
import Button from '../components/Button'

const ListItem = ({
    item,
    router,
    rightButton,
    onRightButtonPress,
    rightButtonStyle,
    rightButtonContent
}) => {
  console.log('item', item);
  const [loading, setLoading] = useState(false);
  return (
    <View style={[styles.content, { display: 'flex', flexDirection: 'row', alignItems: 'center' }]}>
        <View styles={styles.container}>
            <View style={[styles.userInfo, { width: rightButton ? 180 : '100%'}]}>
            <Avatar
                // uri={item?.data?.userPhoto}
                size={hp(10)}
            />
            <Text style={[styles.text, {width: wp(30), textAlign: 'left'}]}>{item?.title || item?.username}</Text>
            </View>
        </View>

        {/* Botón derecho condicional */}
          {rightButton && (
            <Button buttonStyle={[styles.rightButtonStyle, rightButtonStyle]} textStyle={{fontWeight: theme.fonts.small}} hasShadow={false} title={rightButtonContent} loading={loading} onPress={() => onRightButtonPress(item)} />
          )
        }
    </View>
  )
}

export default ListItem

const styles = StyleSheet.create({
    container: {
        fleX: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'start',
        gap: 2,
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
        gap: 4,
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
    text: {
        fontSize: hp(4),
        fontWeight: theme.fonts.medium,
        color: theme.colors.text,
    },
    rightButtonStyle: {
        height: hp(9),
        width: wp(16),
        backgroundColor: theme.colors.primary,
        borderCurve: 'continuous',
    },
})