import { StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import Avatar from './Avatar'
import { hp } from '../helpers/common'
import moment from 'moment'
import Icon from '../assets/icons'
import { useRouter } from 'expo-router'

const CommentItem = ({
  item,
  canDelete = true,
}) => {
  const createdAt = moment(item?.createdAt).format('MMM D');
  const router = useRouter();
  const handleDelete = () => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm("¿Desea eliminar el comentario?");
      if (confirm) {
        window.alert("✅ Se eliminó con éxito");
        router.push('home');
      }
    } else {
      inputRef?.current?.clear();
      commentRef.current = '';
      Alert.alert('Confirmar', "¿Desea eliminar el comentario?", [
        { 
          text: 'OK', 
          onPress: () => {
            Alert.alert(
              'Éxito', 
              'Se eliminó con éxito ✅',
              [
                { 
                  text: 'OK', 
                  onPress: () => router.push('home') 
                }
              ]
            );
          }, 
          style: 'destructive' 
        },
        { 
          text: 'Cancelar', 
          onPress: () => console.log('Cancelada la eliminación'), 
          style: 'cancel' 
        },
      ]);
    }
  }
  console.log('item', item);
  return (
    <View style={styles.container}>
      <Avatar
        uri={item?.user?.image}
        size={hp(10)}
      />
      <View style={styles.content}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={styles.nameContainer}>
            <Text style={styles.text}>{item?.user?.name}</Text>
            <Text style={styles.text}>.</Text>
            <Text style={[styles.text, {color: theme.colors.textLight}]}>{createdAt}</Text>
          </View>
          {
            canDelete && (
              <TouchableOpacity onPress={handleDelete}>
                <Icon name="delete" size={20} color={theme.colors.rose} />
              </TouchableOpacity>
            )
          }
        </View>
        <Text style={[styles.text, {fontWeight: 'normal'}]}>
          {item?.comment}
        </Text>  
      </View>
    </View>
  )
}

export default CommentItem

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
    flexDirection: 'row',
    gap: 10,
  },
  content: {
    backgroundColor: 'rgba(0,0,0,0.06)',
    flex: 1,
    gap: 5,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.radius.md,
    borderCurve: 'continuous',
  },
  highlight: {
    borderWidth: 0.2,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.dark,
    shadowColor: theme.colors.dark,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  text: {
    fontSize: hp(3.5),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },
})