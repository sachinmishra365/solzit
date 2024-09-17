import React, {useEffect, useState} from 'react';
import 'react-native-gesture-handler';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import {Provider, useDispatch} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from './src/AppStore/Store/store';
import {
  SafeAreaView,
  StatusBar,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {PaperProvider} from 'react-native-paper';
import StackNavigator from './src/AppNavigator/StackNavigator';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import NetInfo from '@react-native-community/netinfo';
import {Colors} from './src/constants/Colors';
import { theme } from './src/AppStore/Reducers/appState';

const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={{borderLeftColor: 'green', height: 'auto', minHeight: 70}}
      contentContainerStyle={{paddingVertical: 15}}
      text1Style={{
        fontSize: 14,
        fontWeight: '400',
      }}
      text2NumberOfLines={0}
    />
  ),

  error: props => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 14,
      }}
      text2Style={{
        fontSize: 13,
      }}
    />
  ),

  tomatoToast: ({text1, props}) => (
    <View style={{height: 60, width: '100%', backgroundColor: 'tomato'}}>
      <Text>{text1}</Text>
      <Text>{props.uuid}</Text>
    </View>
  ),
};

export const navigationRef = createNavigationContainerRef();

const App = (props) => {
  const colorScheme = useColorScheme();
  // console.log(colorScheme);

  const [isDark, setIsDark] = useState(colorScheme);
  const [isConnected, setIsConnected] = useState(null);

  useEffect(() => {
    setIsDark(colorScheme);
  }, [colorScheme]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: any) => {
      setIsConnected(state.isConnected);
      showToast(state.isConnected);
    });

    return () => unsubscribe();
  }, [isConnected]);

  const showToast = (connected: any) => {
    Toast.show({
      type: connected ? 'success' : 'error',
      text1: connected ? 'Online' : 'Offline',
      text2: connected
        ? 'You are now connected to the internet.'
        : 'You are currently offline.',
      text2Style: {flexWrap: 'wrap', fontSize: 13},
    });
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider>
          <SafeAreaView style={{flex: 1}}>
            <NavigationContainer ref={navigationRef}>
              <StackNavigator />
              {/* <StatusBar animated={true} backgroundColor="#000" /> */}
              <StatusBar
                barStyle="light-content"
                animated={true}
                backgroundColor={
                  isDark === 'dark' ? Colors.black : Colors.black
                }
              />
            </NavigationContainer>
          </SafeAreaView>
          <Toast config={toastConfig} />
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
