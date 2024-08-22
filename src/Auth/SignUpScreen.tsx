import {View, Text, Button} from 'react-native';
import React from 'react';

const SignUpScreen = ({navigation}: any) => {
  return (
    <View>
      <Text>SignUpScreen</Text>
      <Button
        title="Home"
        onPress={() => {
          navigation.navigate('Home');
        }}
      />
    </View>
  );
};

export default SignUpScreen;
