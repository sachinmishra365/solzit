import React, { useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import RootStack from './RootStack';
import AuthStack from './AuthStack';
import { useColorScheme } from 'react-native';
import { theme } from '../AppStore/Reducers/appState';

const CheckStack = () => {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();

  useEffect(() => {
    dispatch(theme(colorScheme));
  }, [colorScheme]);
  const userData = useSelector((state: any) => state?.appState?.authToken);

  return userData !== undefined ? <RootStack /> : <AuthStack />;
};

export default CheckStack;
