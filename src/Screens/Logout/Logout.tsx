import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import AuthStack from '../../AppNavigator/AuthStack';

const Logout = () => {
    const navigation:any =useNavigation();
  return (
    <View>
      <Text onPress={()=>{navigation.navigate('Login')}}>Logout</Text>
    </View>
  )
}

export default Logout

const styles = StyleSheet.create({})