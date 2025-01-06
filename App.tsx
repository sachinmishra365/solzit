import React, {useEffect, useState} from 'react';
import 'react-native-gesture-handler';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {
  configureFonts,
  MD3LightTheme,
  PaperProvider as PaperProvider,
} from 'react-native-paper';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from './src/AppStore/Store/store';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import StackNavigator from './src/AppNavigator/StackNavigator';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import NetInfo from '@react-native-community/netinfo';
import {Colors} from './src/constants/Colors';

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{borderLeftColor: 'green', height: 'auto', minHeight: 70}}
      contentContainerStyle={{paddingVertical: 15}}
      text1Style={{
        fontSize: 14,
        fontFamily: 'Lato-Bold',
      }}
      text2Style={{
        fontFamily: 'Lato-Regular',
      }}
      text2NumberOfLines={0}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 14,
        fontFamily: 'Lato-Bold',
      }}
      text2Style={{
        fontSize: 13,
        fontFamily: 'Lato-Regular',
      }}
    />
  ),

  tomatoToast: ({text1, props}: any) => (
    <View style={{height: 60, width: '100%', backgroundColor: 'tomato'}}>
      <Text>{text1}</Text>
      <Text>{props.uuid}</Text>
    </View>
  ),
};

export const navigationRef = createNavigationContainerRef();

const App = () => {
  const colorScheme = useColorScheme();

  const [isDark, setIsDark] = useState(colorScheme);
  const [isConnected, setIsConnected] = useState(null);

  useEffect(() => {
    setIsDark(colorScheme);
  }, [colorScheme]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: any) => {
      if (!state.isConnected) {
        setIsConnected(state.isConnected);
        showToast(state.isConnected);
      }
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

  const theme = {
    ...MD3LightTheme,
    roundness: 2,
  };

  return (
    <>
      <SafeAreaView
        style={{flex: 0}}
      />
      <SafeAreaView style={{flex: 1}}>
        <StatusBar
          barStyle={isDark === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={isDark === 'dark' ? Colors.black : Colors.white}
        />
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <PaperProvider theme={theme}>
              <NavigationContainer ref={navigationRef}>
                <StackNavigator />
                <Toast config={toastConfig} />
              </NavigationContainer>
            </PaperProvider>
          </PersistGate>
        </Provider>
      </SafeAreaView>
    </>
  );
};

export default App;
