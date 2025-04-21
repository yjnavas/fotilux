import { StyleSheet, Text, View, ScrollView, Platform, Alert } from 'react-native'
import React, {useEffect, useRef} from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Header from '../../components/Header'
import { useRouter } from 'expo-router'
import { currentUser } from '../../constants/user'
import { fetchFollowers } from '../../services/userServices'
import { theme } from '../../constants/theme'
import Icon from '../../assets/icons'
import { hp, wp } from '../../helpers/common'
import ListItem from '../../components/ListItem'
import Input from '../../components/Input'

const following = () => {
  const router = useRouter();
  const user = currentUser;
    const searchRef = useRef("");
  const [followers, setFollowers] = React.useState([]);

  useEffect(() => {
    getFollowers();
  }, []);

  const getFollowers = async () => {
    const res = await fetchFollowers(user?.id);
    console.log('res', res);
    if(res.success){
      setFollowers(res.data);
    }
  }

  const unfollow = async (item) => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm("¿Desea dejar de seguir a este usuario?");
      if (confirm) {
        window.alert("✅ has dejado de seguir al usuario");
        router.push('home');
      }
    } else {
      inputRef?.current?.clear();
      commentRef.current = '';
      Alert.alert('Confirmar', "¿Desea dejar de seguir a este usuario?", [
        { 
          text: 'OK', 
          onPress: () => {
            Alert.alert(
              'Éxito', 
              'has dejado de seguir al usuario ✅',
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


  return (
    <ScreenWrapper bg='white'>
      <View style={styles.container}>
        <Header title="Seguidos"/>
        <View style={{marginTop: 20}}>
          <Input
            placeholder="Buscar..."
            icon={<Icon name="search" size={20} width={20} color={theme.colors.textLight} />}
            onChangeText={value=>searchRef.current = value}
          />
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listStyle}>
          {
            followers.map((item) => (
              <ListItem
                item={item}
                key={item.id}
                router={router}
                rightButton
                onRightButtonPress={unfollow}
                rightButtonContent={'Dejar de seguir'}
                rightButtonStyle={{ backgroundColor: theme.colors.primary }}
              />
            ))
          }
          {
            followers.length === 0 && (
              <Text style={styles.noData}>No hay seguidores aun</Text>
            )
          }
        </ScrollView>
      </View>
    </ScreenWrapper>
  )
}

export default following

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