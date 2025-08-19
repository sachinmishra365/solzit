import React, { useState } from 'react';
import {View, Text, StyleSheet, Dimensions, ScrollView, RefreshControl} from 'react-native';
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import CarouselScreen from './NewDashBoard/CarouselScreen';
import UpcomingEvents from './NewDashBoard/UpcomingEvents';
import Fabbutton from './FabButton/Fabbutton';
import {Colors} from '../../constants/Colors';

const {width} = Dimensions.get('window');

const Dashboard2 = () => {
  const isDark = useSelector(isDarkTheme);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const userData = useSelector((state: any) => state?.appState?.authToken);
  
  return (
    <>
      <ScrollView 
        style={styles(isDark).container}
        contentContainerStyle={{paddingBottom: 100}}
        showsVerticalScrollIndicator={false}>
        <Text style={styles(isDark).greet}>Welcome back !</Text>
        <Text style={styles(isDark).title}>
          {userData?.userProfile?.fullName || 'Guest'}
        </Text>

        <View style={styles(isDark).carouselWrapper}>
          <CarouselScreen />
        </View>
        <View style={{marginHorizontal: 16}}>
          <UpcomingEvents />
        </View>
      </ScrollView>
      <Fabbutton />
    </>
  );
};

const styles = (isDark: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? Colors.black : Colors.white,
    },
    carouselWrapper: {
      alignItems: 'center',

    },
    title: {
      color: isDark ? Colors.white : Colors.black,
      fontSize: 20,
      fontFamily: 'Lato-Bold',
      marginHorizontal: 16,
    },
    greet: {
      color: isDark ? Colors.medium_gray : Colors.dark_gray,
      fontSize: 12,
      fontFamily: 'Lato-Bold',
      marginHorizontal: 16,
      marginTop: 5,
      marginBottom: -5,
    },
  });

export default Dashboard2;
