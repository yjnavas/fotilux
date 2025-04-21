import { StyleSheet, Text, View, ScrollView } from 'react-native'
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

const followers = () => {
  const router = useRouter();
  const user = currentUser;
  const [followers, setFollowers] = React.useState([]);
  const searchRef = useRef("");

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

  return (
    <ScreenWrapper bg='white'>
      <View style={styles.container}>
        <Header title="Seguidores"/>
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

export default followers

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