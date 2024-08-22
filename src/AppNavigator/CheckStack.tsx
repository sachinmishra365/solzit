import React from 'react';
import {useSelector} from 'react-redux';
import RootStack from './RootStack';
import AuthStack from './AuthStack/AuthStack';

const CheckStack = () => {
  const CheckStatus = useSelector((state: any) => state?.appState?.authToken);
  return CheckStatus !== null ? <RootStack /> : <AuthStack />;
};

export default CheckStack;
