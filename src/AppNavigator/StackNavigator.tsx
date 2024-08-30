import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CheckStack from './CheckStack';
import RootStack from './RootStack';
import AuthStack from './AuthStack';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="CheckStack" component={CheckStack} />
      <Stack.Screen name="AuthStack" component={AuthStack} />
      <Stack.Screen name="RootStack" component={RootStack} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
