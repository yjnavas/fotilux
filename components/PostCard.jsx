import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import { hp, wp } from '../helpers/common'
import Avatar from './Avatar'
import moment from 'moment'
import Icon from '../assets/icons'
import RenderHtml from 'react-native-render-html';
import { Image } from 'expo-image'
import imagen1 from '../assets/images/imagen1.jpg';
import atardecer from '../assets/images/atardecer.jpg';
import imagen2 from '../assets/images/imagen2.jpg';
import imagen3 from '../assets/images/imagen3.jpg';

const images = {
  'imagen1.jpg': imagen1,
  'atardecer.jpg': atardecer,
  'imagen2.jpg': imagen2,
  'imagen3.jpg': imagen3,
};

const textStyle = {
  color: theme.colors.dark,
  fontSize: hp(1.75),
}
const tagStyles = {
  div: textStyle,
  p: textStyle,
  ol: textStyle,
  h1: {
    color: theme.colors.text,
  },
  h4: {
    color: theme.colors.text,
  },
}
const PostCard = ({
    item,
    currentUser,
    router,
    hasShadow = false,
}) => {
    const shadowStyles = {
        shadorOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 1,
    }

    const openPostDetails = () => {
        // router.push('postDetails', {id: item?.id});
    }

    const createdAt = moment(item?.createdAt).format('MMM D');
    const liked = true;
    const likes = [];
  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <View style={styles.header}>
        {/* user info and post time */}
        <View style={styles.userInfo}>
            <Avatar
                size={hp(10)}
                uri={item?.user?.image}
                rounded={theme.radius.md}
            />
            <View style={{gap: 2}}>
                <Text style={styles.username}>{item?.name}</Text>
                <Text style={styles.postTime}>{createdAt}</Text>
            </View>
        </View>

        <TouchableOpacity onPress={openPostDetails}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Icon name="threeDotsHorizontal" size={hp(4)} strokeWidth={3} color={theme.colors.text} />
          </View>
        </TouchableOpacity>
      </View>

        {/* post body media */}
        <View style={styles.content}>
          <View style={styles.postBody}>
            {
              item?.body && (
                <RenderHtml 
                  source={{html:item?.body}} 
                  contentWidth={wp(30)} 
                  tagsStyles={tagStyles} 
                />
                // <Text >{item?.body}</Text>
              )
            }
          </View>
          {/* post image */}
          {
            item?.file  &&(
              <View style={styles.postMedia}>
                  <Image 
                    source={images[item.file]}
                    transition={100} 
                    contentFit='cover' 
                    style={styles.postMedia} 
                  />
              </View>
            )
          }
        </View>
        {/* Linkedin01FreeIcons, comment, share */}
        <View style={styles.footer}>
          <View style={styles.footerButtons}>
            <TouchableOpacity>
              <Icon name="heart" size={24} fill={liked ? theme.colors.rose : 'transparent'} color={liked ? theme.colors.rose : theme.colors.textLight} />
            </TouchableOpacity>
            <Text style={styles.count}>
              {
                likes?.length
              }
            </Text>
          </View>
          <View style={styles.footerButtons}>
            <TouchableOpacity>
              <Icon name="comment" size={24} color={ theme.colors.textLight} />
            </TouchableOpacity>
            <Text style={styles.count}>
              {
                0
              }
            </Text>
          </View>
          <View style={styles.footerButtons}>
            <TouchableOpacity>
              <Icon name="share" size={24} color={ theme.colors.textLight} />
            </TouchableOpacity>
            <Text style={styles.count}>
              {
                0
              }
            </Text>
          </View>
        </View>
    </View>
  )
}

export default PostCard

const styles = StyleSheet.create({
    container: {
        gap: 10,
        marginBottom: 15,
        borderRadius: theme.radius.xxl*1.4,
        borderCurve: 'continuous',
        padding: 10,
        paddingVertical: 12,
        backgroundColor: theme.colors.white,
        borderWidth: 0.5,
        borderColor: theme.colors.gray,
        shadowColor: '#000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    username: {
        fontSize: hp(4),
        color: theme.colors.text,
        fontWeight: theme.fonts.bold,
    },
    postTime: {
        fontSize: hp(2.5),
        color: theme.colors.textLight,
        fontWeight: theme.fonts.medium,
    },
    content: {
        gap: 10,
    },
    postMedia:{
        height: hp(80),
        width: '100%',
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous',
    },
    postBody: {
        marginLeft: 5,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    footerButtons: {
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'cennter',
        gap: 18,
    },
    count: {
        color: theme.colors.text,
        fontSize: hp(3),
    },
})