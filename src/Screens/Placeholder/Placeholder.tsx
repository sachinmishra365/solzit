import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from 'react-native/Libraries/NewAppScreen'

const Placeholder = () => {
  return (
    <ActivityIndicator
    animating={true}
    color={Colors.white}
    style={{justifyContent: 'center', alignItems: 'center', flex: 1}}
  />
  )
}

export default Placeholder

const styles = StyleSheet.create({})