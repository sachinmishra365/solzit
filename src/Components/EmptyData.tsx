import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../constants/Colors'
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../AppStore/Reducers/appState';

const EmptyData = () => {
    const isDark = useSelector(isDarkTheme);

    return (
        <View style={styles(isDark).container}>
            <Text style={styles(isDark).txt}>
                No Records
            </Text>
        </View>
    )
}

export default EmptyData

const styles = (isDark: boolean) =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        txt: {
            color: isDark ? Colors.white : Colors.black,
            alignSelf: 'center',
            fontFamily: 'Lato-Bold',
        }
    })