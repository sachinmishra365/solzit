import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import RootStack from './RootStack';
import AuthStack from './AuthStack';
import {useColorScheme} from 'react-native';
import {internet, theme} from '../AppStore/Reducers/appState';
import NetInfo from '@react-native-community/netinfo';


const CheckStack = () => {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const [isConnected, setIsConnected] = useState(null);
  const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
  const accessToken  = Assesstoken?.authToken?.accessToken;

  useEffect(() => {
    dispatch(theme(colorScheme));
  }, [colorScheme]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: any) => {
      dispatch(internet(state.isConnected));
      setIsConnected(state.isConnected);
      // showToast(stataccessTokene.isConnected);
    });
    return () => unsubscribe();
  }, [isConnected]);

  const userData = useSelector((state: any) => state?.appState?.authToken);

  return userData !== undefined && accessToken? <RootStack /> : <AuthStack />;
};

export default CheckStack;
