import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../../AppStore/Reducers/appState';

const Placeholder = () => {
  const isDark = useSelector(isDarkTheme);

  return (
    <ActivityIndicator
    animating={true}
    color={isDark ? Colors.white : Colors.primary}
    style={{justifyContent: 'center', alignItems: 'center', flex: 1}}
  />
  )
}

export default Placeholder

const styles = StyleSheet.create({})