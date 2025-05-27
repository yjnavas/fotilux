import { StyleSheet, Text, TouchableOpacity, View, Platform, Alert } from 'react-native'
import React, { useState } from 'react'
import { theme } from '../constants/theme'
import Avatar from './Avatar'
import { hp } from '../helpers/common'
import moment from 'moment'
import Icon from '../assets/icons'
import { useRouter } from 'expo-router'
import { deleteComment } from '../services/postServices'

const CommentItem = ({
  item,
  canDelete = true,
  onDeleteSuccess,
}) => {
  const createdAt = moment(item?.createdAt).format('MMM D');
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!item?.id) {
      console.error('No se puede eliminar un comentario sin ID');
      return;
    }

    const performDelete = async () => {
      try {
        setIsDeleting(true);
        const response = await deleteComment(item.id);
        setIsDeleting(false);

        if (response.success) {
          // Llamar a la función de callback para actualizar el estado en el componente padre
          if (typeof onDeleteSuccess === 'function') {
            onDeleteSuccess(item.id);
          }
          
          // Mostrar mensaje de éxito
          if (Platform.OS === 'web') {
            window.alert("✅ Comentario eliminado con éxito");
          } else {
            Alert.alert(
              'Éxito', 
              'Comentario eliminado con éxito ✅',
              [{ text: 'OK' }]
            );
          }
        } else {
          // Mostrar mensaje de error
          if (Platform.OS === 'web') {
            window.alert(`Error: ${response.msg}`);
          } else {
            Alert.alert('Error', response.msg);
          }
        }
      } catch (error) {
        setIsDeleting(false);
        console.error('Error al eliminar comentario:', error);
        if (Platform.OS === 'web') {
          window.alert('Error al eliminar el comentario');
        } else {
          Alert.alert('Error', 'Error al eliminar el comentario');
        }
      }
    };

    // Mostrar confirmación antes de eliminar
    if (Platform.OS === 'web') {
      const confirm = window.confirm("¿Desea eliminar el comentario?");
      if (confirm) {
        await performDelete();
      }
    } else {
      Alert.alert('Confirmar', "¿Desea eliminar el comentario?", [
        { 
          text: 'Eliminar', 
          onPress: performDelete, 
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
  console.log('comentario', item);
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
              <TouchableOpacity onPress={handleDelete} disabled={isDeleting}>
                {isDeleting ? (
                  <View style={styles.loadingIcon}>
                    <Text style={{color: theme.colors.rose}}>...</Text>
                  </View>
                ) : (
                  <Icon name="delete" size={20} color={theme.colors.rose} />
                )}
              </TouchableOpacity>
            )
          }
        </View>
        <Text style={[styles.text, {fontWeight: 'normal'}]}>
          {item?.content}
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
  loadingIcon: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
})