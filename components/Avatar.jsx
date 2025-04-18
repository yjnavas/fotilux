import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { hp } from '../helpers/common'
import { theme } from '../constants/theme'
import { Image } from 'expo-image'
import { getUserImageSrc } from '../services/imageServices'


const Avatar = ({
    uri,
    size=hp(4,5),
    rounded=theme.radius.md,
    style={       
      borderWidth: 1,
      borderColor: theme.colors.darkLight
    },
}) => {
  return (
    <Image
        source={getUserImageSrc(uri)}
        transition={100}
        style={[
            styles.avatar,
            { width: size, height: size, borderRadius: rounded },
            style
        ]}
    />
  )
}

export default Avatar

const styles = StyleSheet.create({})