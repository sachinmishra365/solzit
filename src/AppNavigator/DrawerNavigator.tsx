import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, Button } from 'react-native';
import Dashboard2 from '../Screens/Dashboard/Dashboard2';
import Dashboard from '../Screens/Dashboard/Dashboard';
import CustomDrawer from './CustomDrawer';
import { Colors } from '../constants/Colors';
import CombinedDashboard from '../Screens/Dashboard/CombinedDashboard';
import { isDarkTheme } from '../AppStore/Reducers/appState';
import { useSelector } from 'react-redux';

const Drawer = createDrawerNavigator();


export default function DrawerNavigator() {
  const isDark = useSelector(isDarkTheme);

  return (
    <Drawer.Navigator
      initialRouteName="CombinedDashboard"
      screenOptions={{
        headerShown: false, drawerStyle: { backgroundColor:  isDark ? Colors.black : Colors.primary, width: '75%' },
        drawerLabelStyle: { color: Colors.white, }
      }}
      drawerContent={(props) => <CustomDrawer {...props}
      />}
    >
      <Drawer.Screen name="CombinedDashboard" component={CombinedDashboard} />
      {/* <Drawer.Screen name="Home" component={Dashboard2} />
      <Drawer.Screen name="Notifications" component={Dashboard} /> */}
    </Drawer.Navigator>
  );
}
