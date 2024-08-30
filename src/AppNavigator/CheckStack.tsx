import React from 'react';
import {useSelector} from 'react-redux';
import RootStack from './RootStack';
import AuthStack from './AuthStack';

const CheckStack = () => {
  const userData = useSelector((state: any) => state?.appState?.authToken);

  return userData !== undefined ? <RootStack /> : <AuthStack />;
};

export default CheckStack;
