import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DrawerNavigator from './DrawerNavigator';
import ApplyLeave from '../Screens/ApplyLeave';
import LeaveRequest from '../Screens/Leaves&Breakes/LeaveRequest';
import LeaveBalance from '../Screens/Leaves&Breakes/LeaveBalance';
import Aboutleavedetails from '../Screens/Dashboard/Aboutleavedetails';
import Profile from '../Screens/profile/Profile';
import Attandance from '../Screens/Attendance/Attandance';
import ChangePassword from '../Screens/ChangePassword/ChangePassword';
import SepratedAttendance from '../Screens/Attendance/SepratedAttendance';
import Summary from '../Screens/Attendance/Summary';

const Stack = createNativeStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
      <Stack.Screen name="ApplyLeave" component={ApplyLeave} />
      <Stack.Screen name="LeaveRequest" component={LeaveRequest} />
      <Stack.Screen name="LeaveBalance" component={LeaveBalance} />
      <Stack.Screen name="Aboutleavedetails" component={Aboutleavedetails} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="Attandance" component={Attandance} />
      <Stack.Screen name="SepratedAttendance" component={SepratedAttendance} />
      <Stack.Screen name="Summary" component={Summary} />
    </Stack.Navigator>
  );
};

export default RootStack;
