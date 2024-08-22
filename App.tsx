import React from 'react';
import 'react-native-gesture-handler';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from './src/AppStore/Store/store';
import {SafeAreaView, StatusBar} from 'react-native';
import {PaperProvider} from 'react-native-paper';
import StackNavigator from './src/AppNavigator/StackNavigator';

export const navigationRef = createNavigationContainerRef();

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider>
          <SafeAreaView style={{flex: 1}}>
            <NavigationContainer ref={navigationRef}>
              <StackNavigator />
              <StatusBar animated={true} backgroundColor="#000" />
            </NavigationContainer>
          </SafeAreaView>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
